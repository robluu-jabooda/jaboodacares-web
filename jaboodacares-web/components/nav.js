/**
 * Jabooda Cares — Shared Navigation
 * Drop <script src="/components/nav.js" defer></script> into any page's <head>.
 * Active page is highlighted automatically based on window.location.pathname.
 */
(function () {
  var NAV_LINKS = [
    { label: 'Home',        href: '/' },
    { label: 'About',       href: '/about' },
    { label: 'RVAHI',       href: '/rvahi/' },
    { label: 'Partners',    href: '/partners/' },
    { label: 'Give',        href: '/give' },
  ];

  var ORG = {
    name: 'Jabooda Cares',
    sub: 'Affordable Housing',
  };

  var path = window.location.pathname.replace(/index\.html$/, '');

  var linkHTML = NAV_LINKS.map(function (l) {
    var active = path === l.href || (l.href !== '/' && path.startsWith(l.href));
    return '<a href="' + l.href + '" class="jc-nav-link' + (active ? ' jc-active' : '') + '">' + l.label + '<\/a>';
  }).join('');

  var nav = document.createElement('nav');
  nav.className = 'jc-nav';
  nav.innerHTML =
    '<div class="jc-nav-inner">' +
      '<a href="/" class="jc-nav-brand">' +
        '<span class="jc-nav-name">' + ORG.name + '<\/span>' +
        '<span class="jc-nav-sub">' + ORG.sub + '<\/span>' +
      '<\/a>' +
      '<button class="jc-nav-toggle" aria-label="Menu" aria-expanded="false">' +
        '<span><\/span><span><\/span><span><\/span>' +
      '<\/button>' +
      '<div class="jc-nav-links">' + linkHTML + '<\/div>' +
    '<\/div>';

  document.body.prepend(nav);

  var btn = nav.querySelector('.jc-nav-toggle');
  var links = nav.querySelector('.jc-nav-links');
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('jc-open', !open);
  });

  var style = document.createElement('style');
  style.textContent =
    '.jc-nav{position:sticky;top:0;z-index:1000;background:#080F0B;border-bottom:1px solid rgba(255,255,255,.08);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
    '.jc-nav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:64px}' +
    '.jc-nav-brand{text-decoration:none;display:flex;flex-direction:column;gap:1px}' +
    '.jc-nav-name{font-family:"Playfair Display",Georgia,serif;font-size:1.15rem;font-weight:700;color:#fff;letter-spacing:.01em}' +
    '.jc-nav-sub{font-family:"IBM Plex Mono","Courier New",monospace;font-size:.65rem;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.12em}' +
    '.jc-nav-links{display:flex;gap:.25rem;align-items:center}' +
    '.jc-nav-link{text-decoration:none;font-size:.875rem;font-weight:500;color:rgba(255,255,255,.6);padding:.4rem .75rem;border-radius:6px;transition:color .15s,background .15s}' +
    '.jc-nav-link:hover{color:#fff;background:rgba(255,255,255,.06)}' +
    '.jc-nav-link.jc-active{color:#fff;background:rgba(255,255,255,.1)}' +
    '.jc-nav-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px}' +
    '.jc-nav-toggle span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:transform .2s,opacity .2s}' +
    '.jc-nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}' +
    '.jc-nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}' +
    '.jc-nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}' +
    '@media(max-width:768px){' +
      '.jc-nav-toggle{display:flex}' +
      '.jc-nav-links{display:none;position:absolute;top:64px;left:0;right:0;background:#080F0B;flex-direction:column;padding:.5rem 1rem 1rem;border-bottom:1px solid rgba(255,255,255,.08)}' +
      '.jc-nav-links.jc-open{display:flex}' +
      '.jc-nav-link{padding:.75rem 1rem;width:100%;border-radius:8px}' +
    '}';
  document.head.appendChild(style);
})();
