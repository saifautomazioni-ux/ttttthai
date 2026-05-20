// Always start at top — clears any hash in the URL and forces scroll to Hero
window.addEventListener('load',()=>{
  if(window.location.hash) history.replaceState(null,'',window.location.pathname);
  window.scrollTo(0,0);
});

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

// ---- FORM PRENOTAZIONE ----
(function(){
  const state={base:null,extras:[],date:null,time:null};
  const MONTHS=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const today=new Date();

  // Panel helpers
  function openPanel(wrap){closeAllPanels();wrap.classList.add('open')}
  function closePanel(wrap){wrap.classList.remove('open')}
  function closeAllPanels(){document.querySelectorAll('.pf-sel.open').forEach(w=>w.classList.remove('open'))}
  document.addEventListener('click',e=>{if(!e.target.closest('.pf-sel'))closeAllPanels()},{passive:true});

  // --- Servizio ---
  const servWrap=document.getElementById('servizioWrap');
  const servTrigger=document.getElementById('servizioTrigger');
  const servPanel=document.getElementById('servizioPanel');
  const servValue=document.getElementById('servizioValue');
  const servClose=document.getElementById('servizioClose');

  function updateServSummary(){
    const parts=[];
    if(state.base)parts.push(state.base);
    state.extras.forEach(v=>parts.push(v));
    if(parts.length){servValue.textContent=parts.join(', ');servTrigger.classList.add('has-value')}
    else{servValue.textContent='Seleziona un servizio';servTrigger.classList.remove('has-value')}
  }

  servTrigger.addEventListener('click',e=>{e.stopPropagation();servWrap.classList.contains('open')?closePanel(servWrap):openPanel(servWrap)});
  servClose.addEventListener('click',()=>{closePanel(servWrap);updateServSummary()});

  servPanel.addEventListener('click',e=>{
    const row=e.target.closest('.pf-srv-row');
    if(!row)return;
    const type=row.dataset.type;
    const val=row.dataset.value;
    if(type==='base'){
      servPanel.querySelectorAll('.pf-srv-row[data-type="base"]').forEach(r=>r.classList.remove('selected'));
      row.classList.add('selected');
      state.base=val;
    } else if(type==='extra'){
      if(row.classList.contains('selected')){
        row.classList.remove('selected');
        state.extras=state.extras.filter(v=>v!==val);
      } else {
        row.classList.add('selected');
        state.extras.push(val);
      }
    }
  });

  // --- Calendar ---
  let calYear=today.getFullYear(),calMonth=today.getMonth();
  const dataWrap=document.getElementById('dataWrap');
  const dataTrigger=document.getElementById('dataTrigger');
  const dataValue=document.getElementById('dataValue');
  const calLabel=document.getElementById('calLabel');
  const calDays=document.getElementById('calDays');

  function renderCal(){
    calLabel.textContent=MONTHS[calMonth]+' '+calYear;
    calDays.innerHTML='';
    const firstDow=new Date(calYear,calMonth,1).getDay();
    const offset=firstDow===0?6:firstDow-1;
    const total=new Date(calYear,calMonth+1,0).getDate();
    const todayMs=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
    for(let i=0;i<offset;i++){const s=document.createElement('span');s.className='cal-day';calDays.appendChild(s)}
    for(let d=1;d<=total;d++){
      const btn=document.createElement('button');
      btn.type='button';btn.className='cal-day';btn.textContent=d;
      const dt=new Date(calYear,calMonth,d);
      if(dt.getTime()===todayMs)btn.classList.add('cal-today');
      if(dt.getTime()<todayMs)btn.classList.add('cal-disabled');
      if(state.date&&dt.toDateString()===state.date.toDateString())btn.classList.add('cal-selected');
      btn.addEventListener('click',()=>{
        state.date=dt;
        dataValue.textContent=d+' '+MONTHS[calMonth]+' '+calYear;
        dataTrigger.classList.add('has-value');
        renderCal();
        setTimeout(()=>closePanel(dataWrap),200);
      });
      calDays.appendChild(btn);
    }
  }

  dataTrigger.addEventListener('click',e=>{e.stopPropagation();dataWrap.classList.contains('open')?closePanel(dataWrap):(openPanel(dataWrap),renderCal())});
  document.getElementById('calPrev').addEventListener('click',e=>{e.stopPropagation();calMonth--;if(calMonth<0){calMonth=11;calYear--}renderCal()});
  document.getElementById('calNext').addEventListener('click',e=>{e.stopPropagation();calMonth++;if(calMonth>11){calMonth=0;calYear++}renderCal()});

  // --- Time picker ---
  const oraWrap=document.getElementById('oraWrap');
  const oraTrigger=document.getElementById('oraTrigger');
  const oraValue=document.getElementById('oraValue');
  const timeGrid=document.getElementById('timeGrid');

  function buildTimes(){
    timeGrid.innerHTML='';
    for(let h=9;h<=19;h++){
      [0,30].forEach(m=>{
        if(h===19&&m===30)return;
        const lbl=h+':'+(m===0?'00':'30');
        const btn=document.createElement('button');
        btn.type='button';btn.className='pf-time-slot';btn.textContent=lbl;
        if(state.time===lbl)btn.classList.add('ts-selected');
        btn.addEventListener('click',()=>{
          state.time=lbl;oraValue.textContent=lbl;oraTrigger.classList.add('has-value');
          timeGrid.querySelectorAll('.pf-time-slot').forEach(s=>s.classList.remove('ts-selected'));
          btn.classList.add('ts-selected');
          setTimeout(()=>closePanel(oraWrap),200);
        });
        timeGrid.appendChild(btn);
      });
    }
  }

  oraTrigger.addEventListener('click',e=>{e.stopPropagation();oraWrap.classList.contains('open')?closePanel(oraWrap):(buildTimes(),openPanel(oraWrap))});

  // --- Validation & submit ---
  function setError(el,errId,show){
    const field=el.closest('.pf-field');
    const err=document.getElementById(errId);
    if(show){field.classList.add('has-error');err.classList.add('show')}
    else{field.classList.remove('has-error');err.classList.remove('show')}
  }

  document.getElementById('prenNome').addEventListener('input',function(){
    if(this.value.trim())setError(this,'errNome',false);
  });

  document.getElementById('prenForm').addEventListener('submit',e=>{
    e.preventDefault();
    let ok=true;
    const nome=document.getElementById('prenNome');
    if(!nome.value.trim()){setError(nome,'errNome',true);ok=false}else{setError(nome,'errNome',false)}
    if(!state.base){setError(servWrap,'errServizio',true);ok=false}else{setError(servWrap,'errServizio',false)}
    if(!state.date){setError(dataWrap,'errData',true);ok=false}else{setError(dataWrap,'errData',false)}
    if(!state.time){setError(oraWrap,'errOra',true);ok=false}else{setError(oraWrap,'errOra',false)}
    if(ok){
      document.getElementById('prenForm').style.display='none';
      document.getElementById('prenSuccess').classList.add('show');
    }
  });
})();

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