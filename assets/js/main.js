/* 대화상조 — 페이지 전환 · 배경 전환 · 모바일 메뉴 · 문자 링크 */
(function () {
  'use strict';

  var TEL = '031-912-4444';
  var PAGES = ['home', 'about', 'product', 'contact'];

  // 탭마다 어떤 배경을 쓸지 — 사진 4장을 탭 4개에 하나씩 배정합니다.
  var PAGE_BG = { home: '0', about: '2', product: '1', contact: '3' };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var isMobile = function () { return window.matchMedia('(max-width:900px)').matches; };

  var stage = $('#stage');
  var sheet = $('#sheet');
  var menuBtn = $('#menuBtn');

  var navBtns = $$('.nav button, .sheet__nav button');
  var sections = $$('.page');
  var shots = $$('.stage__bg img');

  /* ── 1. 배경 — 탭이 정합니다 ── */
  function setBg(i) {
    i = String(i);
    shots.forEach(function (s) { s.classList.toggle('is-on', s.dataset.bg === i); });
  }

  /* ── 2. 페이지 전환 ── */
  function show(page) {
    if (PAGES.indexOf(page) < 0) page = 'home';

    navBtns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.go === page); });
    sections.forEach(function (s) {
      var on = s.dataset.page === page;
      s.hidden = !on;
      s.classList.remove('is-on');
      if (on) {
        s.scrollTop = 0;
        void s.offsetWidth;              // 애니메이션 재생을 위한 리셋
        s.classList.add('is-on');
      }
    });

    stage.dataset.page = page;           // 배경 크롭을 페이지별로 잡는 데 씁니다
    stage.classList.toggle('at-home', page === 'home');
    setBg(PAGE_BG[page]);

    if (isMobile()) window.scrollTo(0, 0);
    if (location.hash.slice(1) !== page) history.replaceState(null, '', '#' + page);
  }

  /* ── 3. 모바일 메뉴 ── */
  function openSheet() {
    sheet.hidden = false;
    document.body.classList.add('is-locked');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('#sheetClose').focus();
  }
  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove('is-locked');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', openSheet);
  $('#sheetClose').addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  });

  // 상단 메뉴 · 시트 · 본문 안의 이동 버튼을 한 번에 처리
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (!t) return;
    e.preventDefault();
    if (!sheet.hidden) closeSheet();
    show(t.dataset.go);
  });

  window.addEventListener('hashchange', function () { show(location.hash.slice(1)); });
  show(location.hash.slice(1) || 'home');

  /* ── 4. 문자 링크 — 상담 요청 양식을 미리 채워 보냅니다 ── */
  var sms = $('#smsLink');
  if (sms) {
    var body = '[대화상조 상담 요청]\n성함: \n연락처: \n내용: ';
    // iOS는 ?&body=, 그 외는 ?body=
    var sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '';
    sms.setAttribute('href', 'sms:' + TEL + '?' + sep + 'body=' + encodeURIComponent(body));
  }
})();
