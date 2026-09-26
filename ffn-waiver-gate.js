/* ============================================================
   FFN Waiver Gate
   Blocks the calendar's Buy Tickets button until a waiver is
   signed for the selected event date.

   Drop this into ffn-calendar-embed.html before </body>, after
   the main calendar script.

   Config: set SUPABASE_URL and SUPABASE_ANON_KEY below.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  var SUPABASE_URL      = 'https://xvtkintjtfrsexalqbcs.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_aj9fAYj98S3vZ7zcTBhmdg_3T5KN56s';

  /* If the database is unreachable, should checkout still open?
     true  = fail open. Guest signs, we cache locally and retry. Sales continue.
     false = fail closed. No save, no checkout. Legally strict, revenue risk. */
  var FAIL_OPEN = true;

  var EVENT_NAME   = 'Fresno Fright Nights';
  var STORE_KEY    = 'ffn_waiver_v1';
  var QUEUE_KEY    = 'ffn_waiver_queue_v1';
  var EXPIRY_DAYS  = 120;

  /* ---------- STORAGE ---------- */
  function now() { return Date.now(); }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      var cutoff = now() - (EXPIRY_DAYS * 86400000);
      var clean = {};
      Object.keys(data).forEach(function (k) {
        if (data[k] && data[k].ts && data[k].ts > cutoff) clean[k] = data[k];
      });
      return clean;
    } catch (e) { return {}; }
  }

  function writeStore(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function hasWaiver(dateIso) {
    var s = readStore();
    return !!(s[dateIso] && s[dateIso].complete);
  }

  function markWaiver(dateIso, info) {
    var s = readStore();
    s[dateIso] = { complete: true, ts: now(), party: info.party || 1, name: info.name || '' };
    writeStore(s);
  }

  /* ---------- OFFLINE QUEUE ---------- */
  function queuePush(record) {
    try {
      var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      q.push(record);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    } catch (e) {}
  }

  function queueFlush() {
    var q;
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (e) { return; }
    if (!q.length) return;
    if (SUPABASE_URL.indexOf('REPLACE_') === 0) return;

    var remaining = [];
    var pending   = q.length;

    q.forEach(function (rec) {
      postWaiver(rec, function (ok) {
        if (!ok) remaining.push(rec);
        pending--;
        if (pending === 0) {
          try { localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining)); } catch (e) {}
        }
      });
    });
  }

  /* ---------- NETWORK ---------- */
  function postWaiver(record, cb) {
    if (SUPABASE_URL.indexOf('REPLACE_') === 0) { cb(false); return; }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', SUPABASE_URL + '/rest/v1/waivers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    xhr.setRequestHeader('Prefer', 'return=minimal');
    xhr.timeout = 12000;
    xhr.onload  = function () { cb(xhr.status >= 200 && xhr.status < 300); };
    xhr.onerror = function () { cb(false); };
    xhr.ontimeout = function () { cb(false); };
    try { xhr.send(JSON.stringify(record)); } catch (e) { cb(false); }
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) { try { return crypto.randomUUID(); } catch (e) {} }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /* ---------- LEGAL TEXT ---------- */
  var LEGAL = [
    '<h4>ATTRACTION CONDUCT:</h4>',
    '<p>I agree to:</p>',
    '<ul>',
    '<li>Not run, smoke, eat, drink, or touch props, actors, or other guests inside the attraction</li>',
    '<li>Secure jewelry or loose accessories before entering</li>',
    '<li>Not use video or flash photography inside including mobile electronic devices</li>',
    '<li>Not attempt any photo or video recording while inside</li>',
    '<li>Follow all posted rules and staff instructions</li>',
    '</ul>',
    '<h4>MEDIA RELEASE:</h4>',
    '<p>I grant permission for my image, likeness, and voice to be recorded and used for promotional, advertising, and broadcast purposes without compensation. I waive all rights to any images or recordings made of me at the attraction. I have no expectation of privacy within this business or on its grounds.</p>',
    '<h4>ASSUMPTION OF RISK &amp; WAIVER OF LIABILITY:</h4>',
    '<p>I voluntarily assume all risks and dangers associated with participation in this haunted attraction, including but not limited to personal injury, property loss, illness (including viral exposure), and death.</p>',
    '<p>I hereby release and hold harmless the attraction, its owners, operators, affiliates, landlords, employees, and contractors from any liability, harm, injury, damage, expense, or death that may occur before, during, or after my visit.</p>',
    '<h4>NO REFUNDS:</h4>',
    '<p>I understand that there are no refunds for any reason, including dissatisfaction, early exit, fear, illness, injury, or weather-related closures. In the event of severe weather, rain checks may be honored for another date within the same operating season.</p>',
    '<h4>MINORS:</h4>',
    '<p>If I am signing on behalf of a guest under 18 years of age, I certify that I am the parent or legal guardian of that guest and I accept these terms on their behalf.</p>'
  ].join('');

  /* ---------- STYLES ---------- */
  var CSS = [
    '.wg-ov{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:2147483000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;}',
    '.wg-ov.on{display:block;}',
    '.wg-wrap{max-width:720px;margin:0 auto;padding:16px 14px 48px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#EDE6E0;}',
    '.wg-head{position:sticky;top:0;background:#0A0708;border-bottom:1px solid #2A1F22;padding:14px 0 12px;margin-bottom:16px;z-index:5;}',
    '.wg-title{font-size:19px;font-weight:800;color:#FF7A18;letter-spacing:.3px;margin:0 0 4px;}',
    '.wg-sub{font-size:13px;color:#9B8F88;margin:0;}',
    '.wg-x{position:absolute;top:10px;right:0;background:#3A1114;color:#FF6B6B;border:1px solid #6B1F24;border-radius:6px;padding:7px 13px;font-size:13px;font-weight:700;cursor:pointer;}',
    '.wg-box{background:#140F11;border:1px solid #2A1F22;border-radius:10px;padding:16px;margin-bottom:16px;}',
    '.wg-legal{max-height:230px;overflow-y:auto;font-size:13px;line-height:1.65;background:#0D090A;border:1px solid #241A1D;border-radius:8px;padding:14px;margin-bottom:6px;}',
    '.wg-legal h4{color:#FF7A18;font-size:12px;letter-spacing:.7px;margin:14px 0 6px;text-transform:uppercase;}',
    '.wg-legal h4:first-child{margin-top:0;}',
    '.wg-legal p,.wg-legal li{color:#C9BFB9;margin:0 0 8px;}',
    '.wg-legal ul{margin:0 0 8px;padding-left:18px;}',
    '.wg-scrollnote{font-size:11px;color:#7A6E68;text-align:center;margin-bottom:14px;}',
    '.wg-lbl{display:block;font-size:12px;font-weight:700;color:#9B8F88;letter-spacing:.5px;text-transform:uppercase;margin:0 0 6px;}',
    '.wg-in{width:100%;background:#0D090A;border:1px solid #33262A;border-radius:7px;padding:12px;color:#EDE6E0;font-size:16px;margin-bottom:12px;box-sizing:border-box;}',
    '.wg-in:focus{outline:none;border-color:#FF7A18;}',
    '.wg-in.bad{border-color:#FF6B6B;}',
    '.wg-row{display:flex;gap:10px;}',
    '.wg-row>div{flex:1;}',
    '.wg-sigwrap{background:#fff;border:1px solid #33262A;border-radius:7px;overflow:hidden;margin-bottom:6px;}',
    '.wg-sigwrap.bad{border-color:#FF6B6B;}',
    '.wg-sig{display:block;width:100%;height:150px;touch-action:none;cursor:crosshair;}',
    '.wg-sigbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}',
    '.wg-sighint{font-size:11px;color:#7A6E68;}',
    '.wg-clear{background:none;border:none;color:#FF7A18;font-size:12px;font-weight:700;cursor:pointer;padding:4px 0;}',
    '.wg-err{color:#FF6B6B;font-size:12px;min-height:15px;margin-bottom:8px;}',
    '.wg-go{width:100%;background:linear-gradient(135deg,#FF7A18,#E03E1A);color:#fff;border:none;border-radius:8px;padding:16px;font-size:16px;font-weight:800;letter-spacing:.4px;cursor:pointer;}',
    '.wg-go:disabled{opacity:.5;cursor:not-allowed;}',
    '.wg-chk{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer;}',
    '.wg-chk input{margin-top:3px;width:18px;height:18px;flex-shrink:0;accent-color:#FF7A18;}',
    '.wg-chk span{font-size:13px;color:#C9BFB9;line-height:1.5;}',
    '.wg-prog{font-size:12px;color:#9B8F88;margin-bottom:12px;}',
    '.wg-done{background:#14210F;border:1px solid #2F4A22;color:#8FD06A;border-radius:7px;padding:10px 12px;font-size:13px;font-weight:700;margin-bottom:10px;}'
  ].join('');

  /* ---------- BUILD DOM ---------- */
  var overlay, elParty, elFirst, elLast, elChk, elErr, elGo, sigCtx, sigHas, elProg, elDoneList;
  var partyCount = 1, signedIdx = 0, groupId = '', currentDate = null, onPass = null;

  function injectOnce() {
    if (document.getElementById('wg-style')) return;
    var st = document.createElement('style');
    st.id = 'wg-style';
    st.textContent = CSS;
    document.head.appendChild(st);

    overlay = document.createElement('div');
    overlay.className = 'wg-ov';
    overlay.id = 'wg-ov';
    overlay.innerHTML =
      '<div class="wg-wrap">' +
        '<div class="wg-head" style="position:relative;">' +
          '<button class="wg-x" id="wg-x">✕ CLOSE</button>' +
          '<div class="wg-title">WAIVER REQUIRED</div>' +
          '<p class="wg-sub" id="wg-sub">Every guest must sign before tickets can be purchased.</p>' +
        '</div>' +
        '<div id="wg-donelist"></div>' +
        '<div class="wg-box">' +
          '<div class="wg-prog" id="wg-prog"></div>' +
          '<div class="wg-legal" id="wg-legal">' + LEGAL + '</div>' +
          '<div class="wg-scrollnote">Scroll the box above to read the full agreement</div>' +
          '<div class="wg-row">' +
            '<div><label class="wg-lbl">First Name</label><input class="wg-in" id="wg-first" autocomplete="given-name"></div>' +
            '<div><label class="wg-lbl">Last Name</label><input class="wg-in" id="wg-last" autocomplete="family-name"></div>' +
          '</div>' +
          '<label class="wg-lbl">Signature</label>' +
          '<div class="wg-sigwrap" id="wg-sigwrap"><canvas class="wg-sig" id="wg-sig"></canvas></div>' +
          '<div class="wg-sigbar">' +
            '<span class="wg-sighint">Sign with finger or mouse</span>' +
            '<button class="wg-clear" id="wg-clear">Clear</button>' +
          '</div>' +
          '<label class="wg-chk"><input type="checkbox" id="wg-chk">' +
            '<span>I have read and agree to the conduct rules, media release, assumption of risk, waiver of liability, and no-refund policy above. I am 18 or older, or signing as parent/guardian.</span>' +
          '</label>' +
          '<div class="wg-err" id="wg-err"></div>' +
          '<button class="wg-go" id="wg-go">Sign &amp; Continue</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    elFirst = document.getElementById('wg-first');
    elLast  = document.getElementById('wg-last');
    elChk   = document.getElementById('wg-chk');
    elErr   = document.getElementById('wg-err');
    elGo    = document.getElementById('wg-go');
    elProg  = document.getElementById('wg-prog');
    elDoneList = document.getElementById('wg-donelist');

    document.getElementById('wg-x').addEventListener('click', close);
    document.getElementById('wg-clear').addEventListener('click', clearSig);
    elGo.addEventListener('click', submit);

    initSig();
  }

  /* ---------- SIGNATURE PAD ---------- */
  function initSig() {
    var c = document.getElementById('wg-sig');
    var drawing = false;
    sigHas = false;

    function size() {
      var r = window.devicePixelRatio || 1;
      var w = c.offsetWidth, h = 150;
      c.width = Math.floor(w * r); c.height = Math.floor(h * r);
      c.style.height = h + 'px';
      sigCtx = c.getContext('2d');
      sigCtx.scale(r, r);
      sigCtx.lineWidth = 2.2; sigCtx.lineCap = 'round';
      sigCtx.lineJoin = 'round'; sigCtx.strokeStyle = '#111';
    }
    size();
    window.addEventListener('resize', function () { if (sigHas) return; size(); });

    function pos(e) {
      var r = c.getBoundingClientRect();
      var p = (e.touches && e.touches[0]) ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }
    function start(e) { e.preventDefault(); drawing = true; sigHas = true; var p = pos(e); sigCtx.beginPath(); sigCtx.moveTo(p.x, p.y); }
    function move(e)  { if (!drawing) return; e.preventDefault(); var p = pos(e); sigCtx.lineTo(p.x, p.y); sigCtx.stroke(); }
    function end()    { drawing = false; }

    c.addEventListener('mousedown', start); c.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    c.addEventListener('touchstart', start, {passive:false});
    c.addEventListener('touchmove', move, {passive:false});
    c.addEventListener('touchend', end);
  }

  function clearSig() {
    var c = document.getElementById('wg-sig');
    if (sigCtx) sigCtx.clearRect(0, 0, c.width, c.height);
    sigHas = false;
    document.getElementById('wg-sigwrap').classList.remove('bad');
  }

  /* ---------- FLOW ---------- */
  function renderProgress() {
    elProg.textContent = 'Guest ' + (signedIdx + 1) + ' of ' + partyCount;
    elGo.textContent = (signedIdx + 1 >= partyCount) ? 'Sign & Continue to Tickets' : 'Sign & Next Guest';
  }

  function submit() {
    var fn = (elFirst.value || '').trim();
    var ln = (elLast.value || '').trim();
    var ok = true;
    elErr.textContent = '';
    elFirst.classList.remove('bad'); elLast.classList.remove('bad');
    document.getElementById('wg-sigwrap').classList.remove('bad');

    if (!fn) { elFirst.classList.add('bad'); ok = false; }
    if (!ln) { elLast.classList.add('bad'); ok = false; }
    if (!sigHas) { document.getElementById('wg-sigwrap').classList.add('bad'); ok = false; }
    if (!elChk.checked) { ok = false; elErr.textContent = 'You must agree to the terms above.'; }
    else if (!ok) { elErr.textContent = 'Please complete all fields and sign.'; }
    if (!ok) return;

    elGo.disabled = true; elGo.textContent = 'Saving...';

    var rec = {
      group_id: groupId,
      admission_number: signedIdx + 1,
      party_size: partyCount,
      first_name: fn,
      last_name: ln,
      signature: document.getElementById('wg-sig').toDataURL('image/png'),
      event_name: EVENT_NAME,
      event_date: currentDate.iso,
      signed_at: new Date().toISOString(),
      user_agent: navigator.userAgent || '',
      fingerprint: ''
    };

    postWaiver(rec, function (saved) {
      if (!saved) {
        if (!FAIL_OPEN) {
          elErr.textContent = 'Could not save waiver. Please check your connection and try again.';
          elGo.disabled = false; renderProgress();
          return;
        }
        queuePush(rec);
      }
      advance(fn, ln);
    });
  }

  function advance(fn, ln) {
    var d = document.createElement('div');
    d.className = 'wg-done';
    d.textContent = '✓ ' + fn + ' ' + ln + ' — waiver signed';
    elDoneList.appendChild(d);

    signedIdx++;
    elGo.disabled = false;

    if (signedIdx >= partyCount) {
      markWaiver(currentDate.iso, { party: partyCount, name: fn + ' ' + ln });
      close();
      if (typeof onPass === 'function') onPass();
      return;
    }

    elFirst.value = ''; elLast.value = ''; elChk.checked = false;
    clearSig();
    renderProgress();
    elFirst.focus();
    document.getElementById('wg-ov').scrollTop = 0;
  }

  function open(dateObj, partySize, cb) {
    injectOnce();
    currentDate = dateObj;
    partyCount  = Math.max(1, parseInt(partySize, 10) || 1);
    signedIdx   = 0;
    groupId     = uuid();
    onPass      = cb;

    elDoneList.innerHTML = '';
    elFirst.value = ''; elLast.value = ''; elChk.checked = false;
    elErr.textContent = '';
    clearSig();
    renderProgress();

    document.getElementById('wg-sub').textContent =
      'Required for ' + (dateObj.label || 'your visit') + '. Every guest in your party must sign.';

    document.getElementById('wg-ov').classList.add('on');
    document.body.style.overflow = 'hidden';
    try { if (window.parent !== window) window.parent.postMessage({ffn:'ticket-open'}, '*'); } catch (e) {}
    setTimeout(function () { var c = document.getElementById('wg-sig'); if (c) { /* resize after paint */ } }, 50);
  }

  function close() {
    var ov = document.getElementById('wg-ov');
    if (ov) ov.classList.remove('on');
    document.body.style.overflow = '';
  }

  /* ---------- PARTY SIZE PROMPT ---------- */
  function askParty(dateObj, cb) {
    injectOnce();
    var n = prompt('How many guests are in your party? (including yourself)', '1');
    if (n === null) return;
    var c = parseInt(n, 10);
    if (!c || c < 1 || c > 50) { alert('Please enter a number between 1 and 50.'); return askParty(dateObj, cb); }
    open(dateObj, c, cb);
  }

  /* ---------- PUBLIC API ---------- */
  window.FFNWaiverGate = {
    /* Returns true if this date already has a signed waiver on this device */
    has: hasWaiver,
    /* Opens the waiver flow. cb fires only on full completion. */
    require: function (dateObj, cb) {
      if (hasWaiver(dateObj.iso)) { cb(); return; }
      askParty(dateObj, cb);
    },
    flush: queueFlush,
    _config: function () { return { url: SUPABASE_URL, failOpen: FAIL_OPEN }; }
  };

  /* Retry any queued waivers on load and when connection returns */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queueFlush);
  } else { queueFlush(); }
  window.addEventListener('online', queueFlush);
})();
