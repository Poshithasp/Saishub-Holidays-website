/**
 * HydrationCleanup — Server Component
 * ------------------------------------
 * Browser extensions (Bitdefender, Grammarly, ColorZilla, Norton Safe Web,
 * LastPass, etc.) inject attributes such as `bis_skin_checked`, `bis_size`,
 * `__processed_...`, `data-gr-*`, `cz-shortcut-listen` into the DOM *before*
 * React can hydrate. Because these attributes were not on the server-
 * rendered HTML, React throws:
 *
 *     "Hydration failed because the server rendered HTML didn't match the client."
 *
 * A `'use client'` component with `useEffect` cannot fix this — `useEffect`
 * runs AFTER hydration has already thrown. We must run the cleanup
 * synchronously in the <head>, before React mounts.
 *
 * We render an inline <script> via `dangerouslySetInnerHTML`. The script:
 *   1) Walks the DOM immediately and strips known extension attributes.
 *   2) Installs a MutationObserver that keeps stripping them throughout
 *      hydration in case the extension re-injects.
 *   3) Disconnects the observer a few seconds after `load` to save CPU.
 *
 * This is a Server Component and MUST be placed inside <head> in layout.js.
 */
export default function HydrationCleanup() {
  const script = `
(function () {
  try {
    var PREFIXES = ['bis_', '__processed_', 'data-new-gr-', 'data-gr-'];
    var EXACT = { 'bis_skin_checked': 1, 'bis_size': 1, 'bis_register': 1, 'cz-shortcut-listen': 1, 'data-lt-installed': 1, 'data-gramm': 1, 'data-gramm_editor': 1 };
    function bad(n) {
      if (!n) return false;
      if (EXACT[n]) return true;
      for (var i = 0; i < PREFIXES.length; i++) if (n.indexOf(PREFIXES[i]) === 0) return true;
      return false;
    }
    function scrub(el) {
      if (!el || el.nodeType !== 1) return;
      var a = el.attributes;
      if (a && a.length) {
        for (var i = a.length - 1; i >= 0; i--) {
          var name = a[i].name;
          if (bad(name)) { try { el.removeAttribute(name); } catch (_) {} }
        }
      }
      var kids = el.children;
      if (kids && kids.length) for (var j = 0; j < kids.length; j++) scrub(kids[j]);
    }
    function initial() { if (document.documentElement) scrub(document.documentElement); }
    initial();
    document.addEventListener('DOMContentLoaded', initial);

    if (typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i];
          if (m.type === 'attributes' && bad(m.attributeName)) {
            try { m.target.removeAttribute(m.attributeName); } catch (_) {}
          } else if (m.type === 'childList' && m.addedNodes) {
            for (var k = 0; k < m.addedNodes.length; k++) scrub(m.addedNodes[k]);
          }
        }
      });
      function start() {
        if (document.documentElement) {
          mo.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
        }
      }
      start();
      window.addEventListener('load', function () {
        setTimeout(function () { try { mo.disconnect(); } catch (_) {} }, 3000);
      });
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('[HydrationCleanup]', e);
  }
})();
`;
  return (
    <script
      id="hydration-cleanup"
      // The extension-cleanup script itself can be rewritten by aggressive
      // script-blocking browser extensions (they swap the inline code for a
      // `src=chrome-extension://...`), which triggers a hydration mismatch on
      // this very element. suppressHydrationWarning tells React to ignore any
      // attribute/content differences on this node.
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
