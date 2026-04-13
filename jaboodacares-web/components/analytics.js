/**
 * Jabooda Cares — Google Analytics 4
 * Drop <script src="/components/analytics.js" defer></script> into any page's <head>.
 * Measurement ID: G-NLJMT7WVTE
 */
(function () {
  // Load gtag.js
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NLJMT7WVTE';
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-NLJMT7WVTE');
})();
