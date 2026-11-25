/* HeroFocus — kept for C9–C11. It now hands their CTA row to the shared D-pad model in stage.js
   (HeroKit.focus), so every concept focuses the same way:
     hero:  ← → across the CTAs; → past the last brings the next title into the hero, focus on its primary CTA;
            ← past the first brings back the previous one. Nothing in the margins or the peek takes focus.
     ↑ nav (live HTML nav) · ↓ Live Lineup row below the hero. */
(function () {
  function init(K, { ctas }) {
    K.focus.setHeroItems(ctas);
    return {
      get zone() { return K.zone; },
      refresh() { K.focus.resetCta(); },
      paint() { K.focus.refresh(); },
    };
  }
  window.HeroFocus = { init };
})();
