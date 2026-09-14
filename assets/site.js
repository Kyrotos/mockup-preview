(() => {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu=document.querySelector('.mobile-menu');
  menu?.addEventListener('toggle',()=>menu.querySelector('summary').setAttribute('aria-expanded',String(menu.open)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus();}});
  document.addEventListener('click',event=>{if(menu?.open&&!menu.contains(event.target))menu.open=false;});
  if(reduced.matches)return;
  document.documentElement.classList.add('motion-ready');
  const entries=[...document.querySelectorAll('.reveal')];
  const observer=new IntersectionObserver(batch=>batch.forEach(item=>{if(item.isIntersecting){item.target.classList.add('revealed');observer.unobserve(item.target);}}),{threshold:.08});
  entries.forEach((node,i)=>{node.style.setProperty('--delay',`${(i%3)*65}ms`);observer.observe(node);});
  const hero=document.querySelector('.home-hero');
  const close=document.querySelector('.closing-field');
  let progress=0,closeProgress=0,scheduled=false;
  function update(){scheduled=false;if(reduced.matches)return;if(hero){progress=Math.max(progress,Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/hero.offsetHeight)));hero.style.setProperty('--crop',1+progress*.06);}if(close){const rect=close.getBoundingClientRect();closeProgress=Math.max(closeProgress,Math.min(1,Math.max(0,(innerHeight-rect.top)/(innerHeight*.8))));close.style.setProperty('--scrim',.26+closeProgress*.4);}}
  function onScroll(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  addEventListener('scroll',onScroll,{passive:true});update();
  reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.documentElement.classList.remove('motion-ready');removeEventListener('scroll',onScroll);hero?.style.removeProperty('--crop');close?.style.removeProperty('--scrim');}});
})();
