/**
 * Jabooda Cares — Shared Footer
 * Drop <script src="/components/footer.js" defer></script> into any page's <head>.
 */
(function () {
  var ORG = {
    name: 'Jabooda Cares',
    ein: '99-4589825',
    phone: '206-395-9808',
    email: 'robert@jabooda.com',
    address: '2101 S Grand St, Seattle WA 98144',
  };

  var FOOTER_COLS = [
    {
      heading: 'Programs',
      links: [
        { label: 'Partners',            href: '/partners/' },
      ],
    },
    {
      heading: 'Organization',
      links: [
        { label: 'About & Board',   href: '/about' },
        { label: 'Give',            href: '/give' },
      ],
    },
    {
      heading: 'Transparency',
      links: [
        { label: 'Financials & 990', href: '/transparency' },
        { label: 'Privacy Policy',   href: '/privacy' },
        { label: 'Donor Privacy',    href: '/donor-privacy' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: ORG.phone, href: 'tel:' + ORG.phone.replace(/-/g, '') },
        { label: ORG.email, href: 'mailto:' + ORG.email },
      ],
    },
  ];

  var colsHTML = FOOTER_COLS.map(function (col) {
    var linksHTML = col.links.map(function (l) {
      return '<a href="' + l.href + '" class="jc-ft-link">' + l.label + '<\/a>';
    }).join('');
    return '<div class="jc-ft-col"><div class="jc-ft-heading">' + col.heading + '<\/div>' + linksHTML + '<\/div>';
  }).join('');

  var year = new Date().getFullYear();

  var footer = document.createElement('footer');
  footer.className = 'jc-footer';
  footer.innerHTML =
    '<div class="jc-ft-inner">' +
      '<div class="jc-ft-brand">' +
        '<div class="jc-ft-name">' + ORG.name + '<\/div>' +
        '<div class="jc-ft-address">' + ORG.address + '<\/div>' +
      '<\/div>' +
      '<div class="jc-ft-cols">' + colsHTML + '<\/div>' +
    '<\/div>' +
    '<div class="jc-ft-bottom">' +
      '<span>501(c)(3) &middot; EIN ' + ORG.ein + '<\/span>' +
      '<span>Donations are tax-deductible to the extent allowed by law<\/span>' +
      '<span>Equal Housing Opportunity &oplus;<\/span>' +
      '<span>&copy; ' + year + ' ' + ORG.name + '<\/span>' +
    '<\/div>';

  document.body.appendChild(footer);

  var style = document.createElement('style');
  style.textContent =
    '.jc-footer{background:#080F0B;border-top:1px solid rgba(255,255,255,.08);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:rgba(255,255,255,.55);padding:3rem 1.5rem 1.5rem;margin-top:auto}' +
    '.jc-ft-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;gap:3rem;flex-wrap:wrap}' +
    '.jc-ft-brand{min-width:200px}' +
    '.jc-ft-name{font-family:"Playfair Display",Georgia,serif;font-size:1.25rem;font-weight:700;color:#fff;margin-bottom:.5rem}' +
    '.jc-ft-address{font-family:"IBM Plex Mono","Courier New",monospace;font-size:.75rem;line-height:1.6}' +
    '.jc-ft-cols{display:flex;gap:3rem;flex-wrap:wrap}' +
    '.jc-ft-col{display:flex;flex-direction:column;gap:.4rem}' +
    '.jc-ft-heading{font-family:"IBM Plex Mono","Courier New",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.35);margin-bottom:.25rem}' +
    '.jc-ft-link{text-decoration:none;font-size:.875rem;color:rgba(255,255,255,.6);transition:color .15s}' +
    '.jc-ft-link:hover{color:#fff}' +
    '.jc-ft-bottom{max-width:1200px;margin:2rem auto 0;padding-top:1rem;border-top:1px solid rgba(255,255,255,.06);display:flex;flex-wrap:wrap;gap:1.5rem;font-family:"IBM Plex Mono","Courier New",monospace;font-size:.7rem;color:rgba(255,255,255,.3)}' +
    '@media(max-width:768px){' +
      '.jc-ft-inner{flex-direction:column;gap:2rem}' +
      '.jc-ft-cols{gap:2rem}' +
      '.jc-ft-bottom{flex-direction:column;gap:.5rem}' +
    '}';
  document.head.appendChild(style);
})();
