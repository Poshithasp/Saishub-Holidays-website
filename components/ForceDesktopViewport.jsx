/**
 * ForceDesktopViewport — Server Component
 * -----------------------------------------
 * Renders an inline <script> in <head> that runs synchronously BEFORE the
 * browser lays out the page. On any device whose physical screen width is
 * smaller than DESKTOP_WIDTH, it replaces the viewport meta with a fixed
 * `width=DESKTOP_WIDTH` and a computed `initial-scale` so the page is
 * rendered at the same layout as a desktop, just proportionally scaled
 * down to fit the phone/tablet screen.
 *
 * Desktop browsers (screen.width >= DESKTOP_WIDTH) are untouched — the
 * normal responsive `width=device-width, initial-scale=1` meta remains.
 *
 * Why this approach?
 * - Setting `width=1400` alone in the Next.js viewport export is overridden
 *   by Next's auto-injected `initial-scale=1`, which some browsers honor
 *   over `width` — producing a mobile layout again.
 * - Setting an initial-scale via viewport export requires a static value,
 *   but different devices have different widths — so we compute it at
 *   runtime.
 * - Running in <head> BEFORE body is parsed means there is no layout flash.
 */
export default function ForceDesktopViewport() {
  const script = `
(function () {
  try {
    var DESKTOP_WIDTH = 1400;
    // screen.width is the device's physical screen width in CSS px and is
    // NOT affected by the current viewport meta — safe to read here.
    var deviceW = (window.screen && window.screen.width) || window.innerWidth || 0;
    if (deviceW > 0 && deviceW < DESKTOP_WIDTH) {
      var scale = deviceW / DESKTOP_WIDTH;
      var content = 'width=' + DESKTOP_WIDTH + ', initial-scale=' + scale.toFixed(4) + ', maximum-scale=5, user-scalable=yes';
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    }
  } catch (e) {
    // never fail the page over this
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[ForceDesktopViewport]', e);
    }
  }
})();
`;
  return (
    <script
      id="force-desktop-viewport"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
