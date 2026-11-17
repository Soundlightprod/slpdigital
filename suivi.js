/* SLP Digital : suivi des visites et des clics de contact, versés dans les statistiques de l'admin SLP.
   Aucun suivi pour les navigateurs « notrack » (visites de Nj) ni pour les robots (filtrés côté serveur). */
(function () {
  var API = 'https://soundlightprod.fr/api/';
  var me = document.currentScript || document.querySelector('script[src="/suivi.js"]'), page = (me && me.getAttribute('data-page')) || '';
  var skip = false;
  try { if (/[?&]notrack=1/.test(location.search)) localStorage.setItem('slp_notrack', '1'); if (/[?&]notrack=0/.test(location.search)) localStorage.removeItem('slp_notrack'); skip = !!localStorage.getItem('slp_notrack'); } catch (e) {}
  if (skip) return;
  var sid = '';
  try { sid = sessionStorage.getItem('slp_visit_sid') || ''; if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2); sessionStorage.setItem('slp_visit_sid', sid); } } catch (e) {}
  function post(path, body) { try { fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(function () {}); } catch (e) {} }
  var slug = page || 'accueil';
  if (page) post('track-visit', { artist_slug: page, session_id: sid, site: 'digital', ref: document.referrer }); // l'accueil envoie déjà sa visite
  var last = '';
  function ev(action) { var k = action + Date.now().toString().slice(0, -3); if (k === last) return; last = k; post('contact-event', { action: action, page: slug, session_id: sid, site: 'digital' }); }
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('a[href], button[data-commande], a[data-commande]');
    if (!el) return;
    var h = el.getAttribute('href') || '';
    if (el.hasAttribute('data-commande')) ev('devis');
    else if (/^tel:/i.test(h)) ev('appel');
    else if (/^mailto:/i.test(h)) ev('mail');
    else if (/wa\.me|api\.whatsapp\.com/i.test(h)) ev('whatsapp');
    else if (/buy\.stripe\.com/i.test(h)) ev('devis');
  });
  var f = document.getElementById('contactForm') || document.querySelector('#contact form');
  if (f) f.addEventListener('focusin', function once() { f.removeEventListener('focusin', once); ev('formulaire'); });
})();
