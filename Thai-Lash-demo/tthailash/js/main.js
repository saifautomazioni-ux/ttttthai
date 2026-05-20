// NAV scroll
const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

// FAQ accordion
document.getElementById('faqList').addEventListener('click',e=>{
  const btn=e.target.closest('.faq-q');
  if(!btn)return;
  const item=btn.closest('.faq-item');
  const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>{
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded','false');
  });
  if(!isOpen){
    item.classList.add('open');
    btn.setAttribute('aria-expanded','true');
  }
});

// Reveal on scroll
const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
reveals.forEach(el=>{
  io.observe(el);
  // stagger siblings
  const siblings=[...el.parentElement.querySelectorAll('.reveal')];
  const idx=siblings.indexOf(el);
  el.style.transitionDelay=`${idx*0.08}s`;
});