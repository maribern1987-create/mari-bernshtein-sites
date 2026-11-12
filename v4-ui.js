/* V4 shared interactions. Forms are local validation only; no transport or storage. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  const icon = (path) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${path}"/></svg>`;
  const cross = icon('M6 6l12 12M18 6 6 18');
  const chevron = icon('m6 9 6 6 6-6');
  const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const channels = [
    {id:'telegram',label:'Telegram',field:'Имя или ссылка в Telegram',placeholder:'@username или https://t.me/username',type:'text',autocomplete:'off'},
    {id:'vk',label:'ВКонтакте',field:'Ссылка на вашу страницу ВКонтакте',placeholder:'https://vk.com/username',type:'url',autocomplete:'url'},
    {id:'whatsapp',label:'WhatsApp',field:'Номер WhatsApp',placeholder:'+7 900 000-00-00',type:'tel',autocomplete:'tel'},
    {id:'email',label:'Email',field:'Ваш email',placeholder:'name@example.com',type:'email',autocomplete:'email'}
  ];
  let modal, trigger, imageItems = [], imageIndex = 0, scale = 1, resizeFrame;
  let savedScroll = 0, savedBody = null;
  function unlockBody(){if(savedBody){Object.assign(document.body.style,savedBody);savedBody=null;window.scrollTo(0,savedScroll);}}
  const faqStates=new WeakMap(),railStates=new WeakMap();
  function toggleFaq(details){
    const answer=$('.v4-faq-answer',details),summary=$('summary',details);if(!answer)return;
    const old=faqStates.get(details),expanded=!(old?.expanded??details.open),start=answer.getBoundingClientRect().height;
    old?.animation?.cancel();details.open=true;summary.setAttribute('aria-expanded',String(expanded));
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=expanded;faqStates.delete(details);return;}
    const animation=answer.animate([{height:`${start}px`,opacity:expanded?0:1},{height:`${expanded?answer.scrollHeight:0}px`,opacity:expanded?1:0}],{duration:200,easing:'ease-out'});
    const state={expanded,animation};faqStates.set(details,state);
    animation.onfinish=()=>{if(faqStates.get(details)!==state)return;details.open=expanded;faqStates.delete(details);animation.cancel();};
  }
  function updateRail(track){
    const bounds=track.getBoundingClientRect();
    all('.v3-video-card',track).forEach(card=>{const rect=card.getBoundingClientRect(),visible=Math.min(rect.right,bounds.right)-Math.max(rect.left,bounds.left)>=Math.min(80,rect.width*.45);card.inert=!visible;if(visible)card.removeAttribute('aria-hidden');else card.setAttribute('aria-hidden','true');});
  }
  function moveRail(track,direction){
    const old=railStates.get(track),card=$('.v3-video-card',track),step=(card?.getBoundingClientRect().width||track.clientWidth)+(parseFloat(getComputedStyle(track).gap)||0);
    const target=Math.max(0,Math.min(track.scrollWidth-track.clientWidth,(old?.target??track.scrollLeft)+direction*step));
    if(old)cancelAnimationFrame(old.frame);
    const state={target,frame:0,start:performance.now(),from:track.scrollLeft};railStates.set(track,state);
    track.style.scrollBehavior='auto';track.style.scrollSnapType='none';
    const finish=()=>{track.scrollLeft=target;track.style.scrollBehavior='';track.style.scrollSnapType='';railStates.delete(track);updateRail(track);};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    const tick=now=>{if(railStates.get(track)!==state)return;const t=Math.min(1,(now-state.start)/250),ease=1-Math.pow(1-t,3);track.scrollLeft=state.from+(target-state.from)*ease;if(t<1)state.frame=requestAnimationFrame(tick);else finish();};
    state.frame=requestAnimationFrame(tick);
  }
  function closeNav(restore = false) {
    $('#site-nav')?.classList.remove('open');
    $('#menu-toggle')?.setAttribute('aria-expanded','false');
    $('.site-header')?.classList.remove('nav-open');
    if (restore) $('#menu-toggle')?.focus({preventScroll:true});
  }
  function placeNav() {
    const header = $('.site-header'), nav = $('#site-nav'), container = $('.header-inner');
    if (!header || !nav || !container) return;
    const bottom = header.getBoundingClientRect().bottom;
    nav.style.setProperty('--v4-nav-top', `${Math.max(0,bottom)+8}px`);
    nav.style.setProperty('--v4-nav-right', `${Math.max(16,innerWidth-container.getBoundingClientRect().right)}px`);
    document.documentElement.style.setProperty('--v4-anchor-offset', `${innerWidth < 768 ? 88 : innerWidth < 1024 ? 84 : 88}px`);
  }
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('dialog'); modal.id = 'v4-dialog'; modal.className = 'v4-dialog';
    modal.setAttribute('aria-labelledby','v4-dialog-title');
    modal.innerHTML = `<div class="v4-dialog-shell"><header class="v4-dialog-header"><h2 id="v4-dialog-title" tabindex="-1"></h2><button type="button" class="v4-close" data-v4-close aria-label="Закрыть окно">${cross}</button></header><div class="v4-dialog-body"></div><div class="v4-view-controls" hidden></div></div>`;
    document.body.append(modal);
    modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
    modal.addEventListener('click', e => { if(e.target === modal || e.target.closest('[data-v4-close]')) closeModal(); });
    modal.addEventListener('close', () => {
      all('video',modal).forEach(v => {v.pause();v.removeAttribute('src');v.load();});
      all('iframe',modal).forEach(f => f.removeAttribute('src'));
      unlockBody();
      modal.querySelector('.v4-dialog-body').replaceChildren();
      if(trigger?.isConnected) trigger.focus({preventScroll:true});
    });
    modal.addEventListener('keydown', e => {
      if(e.key !== 'Tab') return;
      const controls = all('button,a[href],input,textarea,select,[tabindex="0"]',modal).filter(el=>!el.disabled && el.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(!first){e.preventDefault();$('#v4-dialog-title').focus();return;}
      if(e.shiftKey && (document.activeElement===first || !controls.includes(document.activeElement))){e.preventDefault();last.focus();}
      else if(!e.shiftKey && (document.activeElement===last || !controls.includes(document.activeElement))){e.preventDefault();first.focus();}
    });
    return modal;
  }
  function closeModal(){if(modal?.open){all('video',modal).forEach(v=>{v.pause();v.removeAttribute('src');v.load();});all('iframe',modal).forEach(f=>f.removeAttribute('src'));unlockBody();modal.close();}}
  function openModal(title,kind,source) {
    ensureModal(); closeNav(); trigger = source || document.activeElement;
    all('video').forEach(v=>v.pause());
    modal.className = `v4-dialog v4-dialog--${kind}`;
    $('#v4-dialog-title',modal).textContent=title;
    $('.v4-dialog-body',modal).className='v4-dialog-body';
    $('.v4-dialog-body',modal).replaceChildren();
    $('.v4-view-controls',modal).hidden=true;
    if(!modal.open){
      savedScroll=window.scrollY;
      savedBody={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};
      Object.assign(document.body.style,{position:'fixed',top:`-${savedScroll}px`,width:'100%',overflow:'hidden'});
      modal.showModal();
    }
    $('#v4-dialog-title',modal).focus({preventScroll:true});
    return $('.v4-dialog-body',modal);
  }
  function contactProblem(id,value){
    const v=value.trim(); if(!v)return 'Укажите контакт для выбранного канала.';
    if(id==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return 'Проверьте адрес email.';
    if(id==='telegram' && !/^@?[a-zA-Z][\w]{3,31}$/.test(v) && !/^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z][\w]{3,31}\/?$/.test(v))return 'Укажите имя Telegram или ссылку t.me.';
    if(id==='vk' && !/^https?:\/\/(www\.)?vk\.(com|ru)\/[\w.-]+\/?$/.test(v))return 'Укажите полную ссылку на страницу ВКонтакте.';
    if(id==='whatsapp' && (v.replace(/\D/g,'').length<10 || v.replace(/\D/g,'').length>15 || /[^\d\s+().-]/.test(v)))return 'Проверьте номер: от 10 до 15 цифр.';
    return '';
  }
  function openForm(kind,source){
    const title={BOOK:'Записаться на сессию',DISCUSS:'Обсудить запрос',QUESTION:'Задать вопрос'}[kind];
    const body=openModal(title,'form',source);
    body.innerHTML=`<form class="v4-form" novalidate><p class="v4-form-note">Учебная форма: обращения не отправляются.</p><div class="v4-field"><label for="v4-name">Как к вам обращаться? *</label><input id="v4-name" name="name" autocomplete="name" required></div><fieldset class="v4-channels"><legend>Как с вами связаться? *</legend><p class="v4-help" id="v4-channel-hint">Можно выбрать один или несколько способов.</p><div class="v4-chips">${channels.map(c=>`<label><input type="checkbox" name="channel" value="${c.id}" aria-describedby="v4-channel-hint"><span>${c.label}</span></label>`).join('')}</div><p class="v4-error" id="v4-channel-error" hidden></p></fieldset><div class="v4-contact-fields"></div>${kind==='BOOK'?'':`<div class="v4-field"><label for="v4-query">${kind==='QUESTION'?'Ваш вопрос':'С чем вы хотели бы обратиться?'} *</label><textarea id="v4-query" name="query" aria-describedby="v4-query-help" required></textarea><p id="v4-query-help" class="v4-help">Достаточно нескольких предложений.</p></div>`}<button class="primary v4-form-submit" type="submit">Проверить форму</button><p class="v4-form-result" role="status" tabindex="-1" hidden></p><p class="v4-help v4-legal"><a href="#L01" data-page="L01">Как используются данные</a> · <a href="#A04" data-page="A04">Условия работы</a></p></form>`;
    const form=$('form',body),fields=$('.v4-contact-fields',form),values={};
    form.addEventListener('change',e=>{
      if(e.target.name!=='channel')return;
      all('[data-v4-contact]',fields).forEach(input=>values[input.dataset.v4Contact]=input.value);
      const selected=all('[name="channel"]:checked',form).map(x=>x.value);
      all('[data-v4-contact-group]',fields).forEach(group=>{if(!selected.includes(group.dataset.v4ContactGroup))group.remove();});
      channels.filter(c=>selected.includes(c.id)).forEach(c=>{
        if($(`[data-v4-contact-group="${c.id}"]`,fields))return;
        const group=document.createElement('div');group.className='v4-field';group.dataset.v4ContactGroup=c.id;
        group.innerHTML=`<label for="v4-contact-${c.id}">${c.field} *</label><input id="v4-contact-${c.id}" name="contact_${c.id}" data-v4-contact="${c.id}" type="${c.type}" inputmode="${c.type==='tel'?'tel':c.type==='email'?'email':c.type==='url'?'url':'text'}" autocomplete="${c.autocomplete}" autocapitalize="none" spellcheck="false" placeholder="${escape(c.placeholder)}" required>`;
        $('input',group).value=values[c.id]||''; fields.append(group);
      });
      $('#v4-channel-error',form).hidden=true;$('.v4-form-result',form).hidden=true;
    });
    const paint=(input,message)=>{
      const id=input.id+'-error';let error=$('#'+id,form);
      if(!error){error=document.createElement('p');error.id=id;error.className='v4-error';input.after(error);}
      error.textContent=message;error.hidden=!message;
      if(message){input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',id);}
      else{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');if(input.id==='v4-query')input.setAttribute('aria-describedby','v4-query-help');}
    };
    form.addEventListener('submit',e=>{
      e.preventDefault();let first=null;
      const name=$('#v4-name',form);const nameError=name.value.trim()?'':'Укажите ваше имя.';paint(name,nameError);if(nameError)first=name;
      const selected=all('[name="channel"]:checked',form),channelError=$('#v4-channel-error',form);
      channelError.hidden=!!selected.length;channelError.textContent='Выберите хотя бы один способ связи.';
      all('[name="channel"]',form).forEach(input=>{if(!selected.length)input.setAttribute('aria-describedby','v4-channel-hint v4-channel-error');else input.setAttribute('aria-describedby','v4-channel-hint');});
      if(!selected.length)first ||= $('[name="channel"]',form);
      all('[data-v4-contact]',form).forEach(input=>{const error=contactProblem(input.dataset.v4Contact,input.value);paint(input,error);if(error)first ||=input;});
      const query=$('#v4-query',form);if(query){const error=query.value.trim()?'':'Напишите несколько слов.';paint(query,error);if(error)first ||=query;}
      const result=$('.v4-form-result',form); result.hidden=!!first;
      if(first){first.focus();return;}
      result.textContent='Форма заполнена. Это прототип: сообщение не отправлено.';result.focus();
    });
    form.addEventListener('input',e=>{if(e.target.matches('input:not([type=checkbox]),textarea')){paint(e.target,'');$('.v4-form-result',form).hidden=true;}});
  }
  function renderImage(){
    const item=imageItems[imageIndex];if(!item)return;
    $('#v4-dialog-title',modal).textContent=item.title;
    const body=$('.v4-dialog-body',modal);body.className='v4-dialog-body v4-image-stage';
    body.innerHTML='<img class="v4-original" alt=""><p class="v4-media-status" role="status">Загружается изображение…</p>';
    const img=$('img',body),status=$('.v4-media-status',body);img.alt=item.title;img.src=item.src;
    img.onload=()=>{status.hidden=true;setScale(1);};
    const imageError=()=>{
      status.hidden=false;status.textContent='Изображение не удалось загрузить. ';
      const retry=document.createElement('button');retry.type='button';retry.textContent='Попробовать ещё раз';
      retry.addEventListener('click',()=>{status.textContent='Загружается изображение…';delete img.dataset.mediaUnavailable;const url=new URL(item.src,document.baseURI);if(!item.src.startsWith('data:'))url.searchParams.set('retry',Date.now());img.src=url.href;});status.append(retry);
    };
    img.onerror=imageError;img.addEventListener('media-unavailable',imageError);
    const controls=$('.v4-view-controls',modal);controls.hidden=false;
    controls.innerHTML=`${imageItems.length>1?`<button type="button" data-v4-prev aria-label="Предыдущий документ">${icon('m14 6-6 6 6 6')}</button><span class="v4-count" aria-live="polite">${imageIndex+1} из ${imageItems.length}</span><button type="button" data-v4-next aria-label="Следующий документ">${icon('m10 6 6 6-6 6')}</button>`:''}<div class="v4-zoom-controls"><button type="button" data-v4-zoom="out" aria-label="Уменьшить изображение">${icon('M5 12h14')}</button><button type="button" data-v4-zoom="fit">Вписать</button><button type="button" data-v4-zoom="in" aria-label="Увеличить изображение">${icon('M5 12h14M12 5v14')}</button><span data-v4-scale aria-live="polite">Вписано целиком</span></div>`;
    if(imageItems.length>1){$('[data-v4-prev]',controls).disabled=imageIndex===0;$('[data-v4-next]',controls).disabled=imageIndex===imageItems.length-1;}
    scale=1;setScale(1);
  }
  function setScale(value){
    scale=Math.max(1,Math.min(4,value));const img=$('.v4-original',modal),stage=$('.v4-image-stage',modal);if(!img||!stage)return;
    const availableHeight=stage.clientHeight-32,availableWidth=stage.clientWidth-32;
    const fit=Math.min(availableWidth/(img.naturalWidth||availableWidth),availableHeight/(img.naturalHeight||availableHeight),1);
    img.style.width=`${Math.max(1,(img.naturalWidth||availableWidth)*fit*scale)}px`;img.style.height='auto';
    stage.classList.toggle('is-zoomed',scale>1);$('[data-v4-scale]',modal).textContent=scale===1?'Вписано целиком':`${Math.round(scale*100)}% от вписанного`;
    $('[data-v4-zoom="out"]',modal).disabled=scale===1;$('[data-v4-zoom="in"]',modal).disabled=scale===4;
    if(scale===1){stage.scrollTop=0;stage.scrollLeft=0;}
  }
  function openImages(items,index,source){imageItems=items;imageIndex=index;openModal(items[index].title,'image',source);renderImage();}
  function openVideo(src,title,source,poster){
    const body=openModal(title,'video',source);body.className='v4-dialog-body v4-video-stage';
    const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=src;if(poster)video.poster=poster;
    const fallback=document.createElement('p');fallback.className='v4-video-fallback';
    const link=document.createElement('a');link.href=src;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Открыть видео отдельно';fallback.append(link);
    const error=document.createElement('p');error.hidden=true;error.setAttribute('role','status');
    error.append('Видео не удалось открыть в этом просмотре. Используйте ссылку на источник. ');
    const retry=document.createElement('button');retry.type='button';retry.textContent='Попробовать ещё раз';error.append(retry);
    let retried=false;
    const start=()=>video.play().catch(e=>{if(modal?.open&&video.isConnected&&!['AbortError','NotSupportedError'].includes(e.name))error.hidden=false;});
    const reload=()=>{error.hidden=true;const url=new URL(src,document.baseURI);url.searchParams.set('media-retry','1');video.src=url.href;start();};
    video.addEventListener('error',()=>{if(!modal?.open||!video.isConnected)return;if(!retried){retried=true;reload();}else error.hidden=false;});
    video.addEventListener('playing',()=>error.hidden=true);retry.addEventListener('click',reload);
    body.append(video,error,fallback);start();
  }
  function apply(root=document){
    const nav=$('#site-nav');if(nav){nav.setAttribute('aria-label','Основная навигация');nav.removeAttribute('role');}
    const toggle=$('#menu-toggle');if(toggle){toggle.setAttribute('aria-label','Меню');toggle.setAttribute('aria-controls','site-nav');}
    all('[data-menu-toggle]',root).forEach(button=>{if(!button.dataset.v4Chevron){all('span[aria-hidden]',button).forEach(s=>s.remove());button.insertAdjacentHTML('beforeend',chevron);button.dataset.v4Chevron='1';}});
    all('#site-nav [data-section="HM_CREDENTIALS"]',root).forEach(a=>a.textContent='Образование и подготовка');
    all('.credential-preview',root).forEach(card=>{card.setAttribute('role','button');card.tabIndex=0;card.setAttribute('aria-label','Открыть документ: '+($('img',card)?.alt||'образование и подготовка'));});
    all('.v4-faq .faq details',root).forEach(details=>{
      if($('.v4-faq-answer',details))return;
      const answer=document.createElement('div');answer.className='v4-faq-answer';
      [...details.childNodes].filter(node=>node!==$('summary',details)).forEach(node=>answer.append(node));details.append(answer);
    });
    all('#HM07_VIDEO .video-review-grid',root).forEach(track=>{
      if(track.dataset.v4Keyboard)return;track.dataset.v4Keyboard='1';
      track.addEventListener('scroll',()=>updateRail(track),{passive:true});new ResizeObserver(()=>updateRail(track)).observe(track);updateRail(track);
    });
    const flow=$('#flow-dialog');
    if(flow && !flow.dataset.v4Shell){
      flow.dataset.v4Shell='1';
      const close=$('.dialog-header [data-close]',flow);
      if(close){close.innerHTML=cross;close.setAttribute('aria-label','Закрыть окно');}
      let previousStyles=null,previousScroll=0;
      const sync=()=>{
        if(flow.open && !previousStyles){previousScroll=scrollY;previousStyles={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};Object.assign(document.body.style,{position:'fixed',top:`-${previousScroll}px`,width:'100%',overflow:'hidden'});all('video').forEach(v=>v.pause());closeNav();}
        else if(!flow.open&&previousStyles){Object.assign(document.body.style,previousStyles);previousStyles=null;scrollTo(0,previousScroll);}
      };
      new MutationObserver(sync).observe(flow,{attributes:true,attributeFilter:['open']});
      flow.addEventListener('close',sync);
    }
    placeNav();
  }
  window.applyV4Ui=apply;
  function intercept(e){e.preventDefault();e.stopImmediatePropagation();}
  window.addEventListener('click',e=>{
    const faq=e.target.closest?.('.v4-faq summary');if(faq){intercept(e);toggleFaq(faq.parentElement);return;}
    const target=e.target.closest?.('button,a,.credential-preview');
    if(target?.matches('.v3-carousel-controls [data-step]')){const track=target.closest('.v3-video-rail')?.querySelector('.video-review-grid');if(track){intercept(e);moveRail(track,Number(target.dataset.step));}return;}
    if(target?.closest('#v4-dialog')){
      if(target.matches('[data-v4-prev],[data-v4-next]')){intercept(e);imageIndex+=target.hasAttribute('data-v4-prev')?-1:1;renderImage();target.matches('[data-v4-prev]')?$('[data-v4-prev]',modal)?.focus():$('[data-v4-next]',modal)?.focus();}
      else if(target.dataset.v4Zoom){intercept(e);setScale(target.dataset.v4Zoom==='fit'?1:scale+(target.dataset.v4Zoom==='in'?.5:-.5));}
      else if(target.dataset.page){closeModal();}
      return;
    }
    if(target?.dataset.form && ['BOOK','DISCUSS','QUESTION'].includes(target.dataset.form)){intercept(e);openForm(target.dataset.form,target);return;}
    if(target?.id==='menu-toggle'){intercept(e);const open=!$('#site-nav').classList.contains('open');$('#site-nav').classList.toggle('open',open);target.setAttribute('aria-expanded',String(open));placeNav();return;}
    if(target?.dataset.menuToggle){intercept(e);const panel=document.getElementById(target.dataset.menuToggle);if(panel){panel.hidden=!panel.hidden;target.setAttribute('aria-expanded',String(!panel.hidden));}return;}
    if(target?.matches('.credential-preview')){intercept(e);const cards=all('.credential-gallery .credential-preview');openImages(cards.map(c=>({src:$('img',c)?.currentSrc||$('img',c)?.src,title:$('img',c)?.alt||'Документ'})),cards.indexOf(target),target);return;}
    if(target?.hasAttribute('data-open-original')){intercept(e);const card=target.closest('[data-review-source]');if(card)openImages([{src:card.dataset.reviewSource,title:'Оригинал отзыва'}],0,target);return;}
    if(target?.hasAttribute('data-play')){const card=target.closest('[data-video-src]');if(card){intercept(e);openVideo(card.dataset.videoSrc,'Видеоотзыв: '+card.dataset.topic,target,card.dataset.poster);}return;}
    if(target?.hasAttribute('data-intro-local')){const video=$('video',target.parentElement);if(video){intercept(e);openVideo(video.currentSrc||video.src,'Видео-знакомство',target,video.poster);}return;}
    if($('#site-nav')?.classList.contains('open')){
      if(target?.closest('#site-nav') && !target.hasAttribute('data-menu-toggle')){
        closeNav();const id=target.dataset.section||target.dataset.localAnchor;
        if(id)setTimeout(()=>{const heading=$('h2',document.getElementById(id)||document)||document.getElementById(id);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}},80);
      }else if(!e.target.closest('#site-nav'))closeNav();
    }
  },true);
  window.addEventListener('keydown',e=>{
    const track=e.target.closest?.('#HM07_VIDEO .video-review-grid');if(track&&['ArrowRight','ArrowLeft'].includes(e.key)){intercept(e);moveRail(track,e.key==='ArrowRight'?1:-1);return;}
    if(e.key==='Escape' && $('#site-nav')?.classList.contains('open')&&!document.querySelector('dialog[open]')){intercept(e);closeNav(true);}
    const card=e.target.closest?.('.credential-preview');if(card && (e.key==='Enter'||e.key===' ')){intercept(e);card.click();}
  },true);
  document.addEventListener('focusin',e=>{if($('#site-nav')?.classList.contains('open')&&!e.target.closest('#site-nav,#menu-toggle'))closeNav();});
  window.addEventListener('resize',()=>{placeNav();cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(modal?.open&&modal.classList.contains('v4-dialog--image'))setScale(scale);});},{passive:true});
  window.addEventListener('scroll',placeNav,{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(),{once:true});else apply();
})();
