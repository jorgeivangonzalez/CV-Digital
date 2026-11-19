(function () {
    'use strict';

    var TITLES = {
        es: 'Iván González · Director Creativo y Productor',
        en: 'Iván González · Creative Director & Producer'
    };
    var $ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* ---------- Diploma carousel: duplicate the cards for a seamless loop ---------- */
    var track = document.querySelector('.cert-track');
    if (track) {
        $('.cert-track > *').forEach(function (card) {
            var copy = card.cloneNode(true);
            copy.setAttribute('aria-hidden', 'true');
            $('a', copy).forEach(function (a) { a.tabIndex = -1; });
            track.appendChild(copy);
        });
        // constant speed (~45 px/s) no matter how many diplomas are added
        track.style.animationDuration = Math.round(track.scrollWidth / 2 / 45) + 's';

        // Credly badges: load their script after both copies exist so each one gets rendered
        var credly = document.createElement('script');
        credly.async = true;
        credly.src = 'https://cdn.credly.com/assets/utilities/embed.js';
        document.body.appendChild(credly);
    }

    /* ---------- Language switch ---------- */
    function setLang(lang) {
        $('[data-en]').forEach(function (el) {
            if (el.dataset.es === undefined) el.dataset.es = el.textContent;   // remember the Spanish original
            el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es;
        });
        $('[data-href-en]').forEach(function (a) {                              // e.g. CV file
            if (a.dataset.hrefEs === undefined) a.dataset.hrefEs = a.getAttribute('href');
            a.setAttribute('href', lang === 'en' ? a.dataset.hrefEn : a.dataset.hrefEs);
        });
        document.documentElement.lang = lang;
        document.title = TITLES[lang];
        $('.lang-switch button').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
        });
        try { localStorage.setItem('lang', lang); } catch (e) {}
        try {
            var url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            history.replaceState(null, '', url);
        } catch (e) {}
    }

    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    var saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    var initial = [fromUrl, saved].filter(function (l) { return l === 'es' || l === 'en'; })[0] || 'es';

    $('.lang-switch button').forEach(function (b) {
        b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    setLang(initial);
})();
