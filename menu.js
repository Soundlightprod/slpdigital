(function(){var b=document.querySelector('.menu-btn'),n=document.querySelector('.nav');if(!b||!n)return;
function set(o){n.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');}
b.addEventListener('click',function(){set(!n.classList.contains('open'));});
n.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('nav a'))set(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
matchMedia('(min-width:861px)').addEventListener('change',function(){set(false);});})();
