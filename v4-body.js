/* V5 refinement of blocks 08–17. Existing source IDs and media navigation are preserved. */
(() => {
  'use strict';
  const play = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const external = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19 19 5M6 5h13v13"/></svg>';
  const chevron = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const videoCopy = {
    IMG_6973: ['Сепарация и свои приоритеты', 'После работы с сепарацией стало легче выбирать своё и ставить личные желания на первое место.'],
    IMG_6977: ['Учиться выражать чувства', 'Клиентка учится замечать и выражать чувства и рассказывает, что у неё стало больше сил на привычные дела.'],
    IMG_6978: ['Спокойствие без осуждения', 'На встречах спокойно говорить о сложном: не возникает страха осуждения, есть возможность обратиться за помощью.'],
    IMG_6970: ['Свои чувства и ценности', 'Лучше понимает свои чувства и ценности, принимает себя и находит способы поддерживать себя между встречами.'],
    IMG_6972: ['Поддержка в семейной ситуации', 'Делится благодарностью за помощь в семейной ситуации и уверенностью в решении обратиться к выбранному психологу.'],
    IMG_6974: ['Разговор о главном', 'Клиентка рассказывает о точном отклике и возможности говорить о главном без долгих объяснений.'],
    IMG_6979: ['Внутренний конфликт в отношениях', 'Клиентка описывает образную работу с конфликтом в отношениях и перемены, которые заметила после встречи.'],
    IMG_6980: ['Знакомство с образной работой', 'Во время визуализации удивилась возможностям своего воображения; после встречи остались темы для самостоятельных размышлений.'],
    'unique-20261105': ['Контроль и доверие к себе', 'В работе с сильными чувствами смогла выдохнуть, ослабить контроль и почувствовать больше доверия к себе.']
  };
  const textCopy = [
    ['photo_2025-03-12_20-57-15.webp','Уверенность и свои решения','За последние несколько дней я успела заметить, что уже могу смелее высказывать своё мнение на работе и даже решилась записаться на новые курсы.'],
    ['photo_2024-12-17_16-53-44.webp','Ближе к себе','Отшелушивается что-то и каждый такой шаг приближает к самой себе настоящей.'],
    ['photo_2026-02-11_18-18-54.webp','От страха к интересу','Получилось прожить много тревожащих меня состояний и выйти из состояния „страха жить жизнь и делать выборы“ в ощущение интереса к этому процессу и азарта.']
  ];
  /* One immutable interface model for HM06 and A02. Author articles are outside this component. */
  const priceModel=Object.freeze([
    Object.freeze({sessions:1,title:'Разовая сессия',term:'Одна встреча',description:'Первая встреча или отдельная сессия.',price:6000}),
    Object.freeze({sessions:5,title:'5 сессий',term:'Ориентир по длительности работы: до 3 месяцев',description:'Несколько встреч в рамках текущей работы.',price:28000}),
    Object.freeze({sessions:10,title:'10 сессий',term:'Ориентир по длительности работы: до 6 месяцев',description:'Продолжение регулярной работы.',price:51000}),
    Object.freeze({sessions:25,title:'25 сессий',term:'Ориентир по длительности работы: до 12 месяцев',description:'Длительная регулярная работа.',price:115000})
  ]);
  const priceNote='Количество встреч и необходимость продолжения обсуждаем по ходу работы.';
  const priceAuthorNote='Пакет — это не только экономия. Это ритм, глубина и меньше шансов сбежать с процесса в момент сопротивления.';
  const rubles=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0')+'\u00a0₽';
  function priceMarkup(){return '<table class="format-table"><caption class="sr">Стоимость встреч и пакетов; сравнение с разовыми встречами по 6 000 ₽</caption><thead><tr><th scope="col">Формат</th><th scope="col">Для чего подходит</th><th scope="col">Стоимость</th></tr></thead><tbody>'+priceModel.map(x=>`<tr><th scope="row"><span class="format-name">${x.title}</span><span class="format-term">${x.term}</span></th><td class="format-purpose">${x.description}</td><td class="format-price">${x.sessions>1?`<span class="separate-price">По отдельности: ${rubles(x.sessions*6000)}</span>`:''}<strong>${rubles(x.price)}</strong>${x.sessions>1?`<span class="package-saving">Экономия ${rubles(x.sessions*6000-x.price)}</span>`:''}</td></tr>`).join('')+'</tbody></table><p class="v6-price-note">'+priceNote+'</p><p class="v7-price-author-note">'+priceAuthorNote+'</p>';}
  window.V7Pricing=Object.freeze({rows:priceModel,render:priceMarkup,note:priceNote,authorNote:priceAuthorNote});
  const setText = (el, text) => { if (el && el.textContent !== text) el.textContent = text; };
  const link = (id,text) => `<a class="v4-text-action" href="#${id}" data-page="${id}">${text}${arrow}</a>`;
  const book = text => `<a class="button primary" href="#native-contact" data-form="BOOK">${text}</a>`;
  const init = (d,id,fn) => { const s=d.getElementById(id); if (!s || s.dataset.v4Body) return; if(fn(s)!==false)s.dataset.v4Body='true'; };
  window.applyV4Body = function(d = document) {
    if(!d.getElementById('HM01'))d.querySelectorAll('.subpage .package-sheet').forEach(host=>{
      if(host.closest('.author-article'))return;
      host.classList.add('v7-pricing-interface');
      if(!host.dataset.v7Pricing){host.dataset.v7Pricing='true';host.innerHTML=priceMarkup();}
    });
    if(!window.__v6BodyErrors){window.__v6BodyErrors=true;d.addEventListener('error',e=>{
      if(!e.target.matches?.('#HM_SESSION iframe'))return;
      const hint=d.querySelector('.v7-session-fallback');if(hint)hint.setAttribute('role','status');
    },true);}
    const archiveGrid=d.querySelector('.v3-review-archive-grid');
    if(archiveGrid&&!d.querySelector('.v6-review-filter')){
      setText(d.querySelector('main h1'),'Отзывы');
      archiveGrid.querySelectorAll('[data-video-src]').forEach(card=>{const id=card.dataset.videoSrc.split('?')[0].split('/').pop().replace(/\.mp4$/i,'');const item=videoCopy[id];if(!item)return;card.dataset.topic=item[0];setText(card.querySelector('h3'),item[0]);});
      const nav=d.createElement('nav');nav.className='v6-review-filter';nav.setAttribute('aria-label','Форматы отзывов');
      nav.innerHTML='<button data-v6-filter="all" aria-pressed="true">Все</button><button data-v6-filter="video" aria-pressed="false">Видеоотзывы</button><button data-v6-filter="text" aria-pressed="false">Отзывы в сообщениях</button>';
      nav.addEventListener('click',e=>{const b=e.target.closest('[data-v6-filter]');if(!b)return;nav.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));[...archiveGrid.children].forEach(x=>x.hidden=b.dataset.v6Filter!=='all'&&(b.dataset.v6Filter==='video'?!x.classList.contains('v3-video-card'):!x.classList.contains('v3-text-card')));});archiveGrid.before(nav);
    }
    if (!d.getElementById('HM01')) return;
    init(d,'HM07_VIDEO',s=>{
      const cards=[...s.querySelectorAll('.v3-video-card')]; if(!cards.length)return false;
      s.classList.add('v4-video-section');
      cards.forEach(card=>{
        const id=decodeURIComponent(card.dataset.videoSrc.split('?')[0].split('/').pop()).replace(/\.mp4$/i,''), info=videoCopy[id]; if(!info)return;
        card.dataset.topic=info[0]; card.classList.add('v4-video-card');
        const poster=card.querySelector('.v3-video-card__poster'); poster.className='v4-video-poster v3-video-card__poster';
        if(!['IMG_6973','IMG_6977'].includes(id)){
          card.dataset.poster=id==='IMG_6972'?'v6-media/posters/IMG_6972.webp':`v4-media/posters/${id}.webp`;
          const image=poster.querySelector('img');if(image){
            const fallback=image.getAttribute('src');image.dataset.v4PosterFallback=fallback;
            image.addEventListener('error',()=>{if(image.dataset.v4PosterFallback){const src=image.dataset.v4PosterFallback;delete image.dataset.v4PosterFallback;image.src=src;card.dataset.poster=src;}},{once:true});
            image.src=card.dataset.poster;image.removeAttribute('srcset');image.alt=`Кадр видеоотзыва: ${info[0]}`;
          }
        }
        poster.querySelector('[data-play]').innerHTML=play;
        const copy=card.querySelector('.v3-video-card__copy'); copy.className='v4-video-copy';
        copy.innerHTML=`<h3>${info[0]}</h3><p>${info[1]}</p><button type="button" class="v4-text-action" data-play aria-label="Смотреть отзыв: ${info[0]}">Смотреть отзыв</button>`;
        poster.querySelector('button').setAttribute('aria-label',`Смотреть отзыв: ${info[0]}`);
      });
      const all=s.querySelector('a[data-page="A05"]');if(all){all.className='v4-text-action v4-all-reviews';all.innerHTML=`Все отзывы${arrow}`;}
      s.querySelectorAll('[data-step]').forEach(b=>{b.innerHTML=arrow;if(b.dataset.step==='-1')b.querySelector('svg').style.transform='rotate(180deg)';});
      const track=s.querySelector('.video-review-grid');let pending=false;
      const resizeGroup=()=>{pending=false;if(!track.isConnected)return;const bounds=track.getBoundingClientRect();
        const visible=cards.filter(c=>{const r=c.getBoundingClientRect();return Math.min(r.right,bounds.right)-Math.max(r.left,bounds.left)>r.width*.5;});
        if(!visible.length)return;cards.forEach(c=>c.querySelector('.v4-video-copy').style.minHeight='0px');
        const copyHeight=Math.max(...visible.map(c=>c.querySelector('.v4-video-copy').getBoundingClientRect().height));
        visible.forEach(c=>c.querySelector('.v4-video-copy').style.minHeight=copyHeight+'px');
        track.style.height=Math.max(...visible.map(c=>c.getBoundingClientRect().height))+'px';
      };
      const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(resizeGroup);}};
      track.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);d.fonts?.ready.then(schedule);schedule();
    });
    init(d,'HM_SESSION',s=>{
      s.classList.add('v4-session');
      const left=s.querySelector('.session-details'); left.className='v4-session-details';
      left.innerHTML='<div class="v4-session-points"><div><h3>Сначала определяем задачу</h3><p>Обсуждаем, что происходит сейчас, что вы хотите изменить и чему важно уделить внимание на этой встрече.</p></div><div><h3>Работаем с вашим запросом</h3><p>В зависимости от задачи обращаемся к разговору, чувствам, образам и телесным откликам. Вы можете говорить, что замечаете по ходу работы.</p></div><div><h3>Подводим итоги</h3><p>Обсуждаем ваше состояние и то, что удалось заметить. При необходимости предлагаю практики между встречами.</p></div></div><p class="v4-meeting-format">90 минут · онлайн в Zoom или очно в Санкт-Петербурге.<span class="v6-online-note">Для онлайн-встречи выберите место, где вас не будут отвлекать.</span></p>';
      s.querySelector('.session-composition').className='v4-session-columns';
      const right=s.querySelector('.session-media');right.className='v4-session-media';
      const film=right.querySelector('.session-film'); film.classList.add('v4-session-film');
      film.querySelector('.v2-film-title')?.remove();
      right.querySelectorAll('.v3-session-fallback,.session-video-fallback,.v2-film-caption,.session-reading').forEach(e=>e.remove());
      film.insertAdjacentHTML('afterend',`<p class="v4-media-caption">Видео о первой встрече · 18:30</p><p class="v7-session-fallback"><span>Если видео не загружается, </span><a class="v4-text-action v4-session-external" href="https://vkvideo.ru/video822555244_456239197" target="_blank" rel="noopener noreferrer">откройте его во ВКонтакте${external}</a></p><div class="v4-session-actions">${book('Записаться на первую сессию')}${link('H23','Прочитать о первой встрече')}</div>`);
    });
    init(d,'HM05',s=>{
      s.classList.add('v4-methods');
      const data=[['M01','Репарационная психология и терапия','Работаем с повторяющимися реакциями и внутренними сценариями через чувства, образы и телесные отклики. Исследуем то, что связано с вашим запросом.'],['M02','ДПДГ','Работаем с воспоминаниями о тяжёлом опыте, которые продолжают вызывать сильные переживания в настоящем.'],['M05','Краткосрочная терапия','Сосредотачиваемся на конкретной трудности: уточняем задачу и работаем над изменениями, которые вы хотите заметить в своей жизни.']];
      const inside=s.querySelector('.inside');inside.innerHTML='<h2>Подходы и методы</h2><div class="v4-method-rows">'+data.map(([id,title,copy])=>`<article class="v4-method-row"><div><h3>${title}</h3>${id==='M02'?'<p class="v4-method-expansion">Десенсибилизация и переработка движениями глаз</p>':''}</div><p>${copy}</p><a class="v4-text-action" href="#${id}" data-page="${id}" aria-label="Подробнее: ${title}">Подробнее${arrow}</a></article>`).join('')+'</div>'+link('A01','Все подходы и методы');
    });
    init(d,'HM_CREDENTIALS',s=>{
      const features=[...s.querySelectorAll('.v3-credential-feature')];if(features.length!==4)return false;
      s.classList.add('v4-credentials');setText(s.querySelector('h2'),'Образование и подготовка');s.querySelector('h2').insertAdjacentHTML('afterend','<p class="v6-education-intro">Основная подготовка, обучение методам и дополнительные программы.</p>');
      const labels=[['Репарационная психология и терапия','Профпереподготовка · 1155 часов · 2025'],['ДПДГ: протоколы работы','Семинар · 16 академических часов · 2025'],['Эриксоновская психотерапия и гипноз','Программа · 26 академических часов · 2024'],['Аттестация по АРПТ','Решение аттестационной комиссии']];
      features.forEach((item,i)=>{item.querySelector('.credential-preview')?.style.removeProperty('width');const c=item.querySelector(':scope > .v3-credential-caption');if(c)c.innerHTML=`<span class="v6-credential-label">${i===0?'Основная подготовка':''}</span><strong>${labels[i][0]}</strong><span>${labels[i][1]}</span>`;});
      const archive=s.querySelector('.v3-credential-archive');if(archive)setText(archive.querySelector(':scope > summary'),`Остальные документы (${archive.querySelectorAll('.credential-preview').length})`);
      s.querySelectorAll('.v3-credential-appendices>summary,.v3-credential-archive>summary').forEach(e=>e.insertAdjacentHTML('beforeend',chevron));
    });
    init(d,'HM06',s=>{
      s.classList.add('v4-prices');const inside=s.querySelector('.inside'),table=inside.querySelector('.package-sheet');
      if(!table.dataset.v7Pricing){table.innerHTML=priceMarkup();table.dataset.v7Pricing='true';}
      const heading=inside.querySelector('h2');const grid=d.createElement('div');grid.className='v4-price-columns';
      grid.innerHTML='<div class="v4-price-intro"><p>Одна встреча длится 90 минут. Онлайн и в кабинете в Санкт-Петербурге — одинаковая стоимость.</p><p>Можно начать с одной встречи. Пакет не обязателен.</p>'+book('Записаться на сессию')+link('A02','Стоимость и условия')+'</div>';
      grid.append(table);inside.replaceChildren(heading,grid);
    });
    init(d,'HM07_TEXT',s=>{
      const cards=[...s.querySelectorAll('.v3-text-review-grid > .v3-text-card')];if(cards.length!==3)return false;
      s.classList.add('v4-text-reviews');
      cards.forEach(card=>{const item=textCopy.find(x=>decodeURIComponent(card.dataset.reviewSource).includes(x[0]));if(!item)return;card.classList.add('v4-text-card');card.innerHTML=`<h3>${item[1]}</h3><blockquote>«${item[2]}»</blockquote><button type="button" class="v4-text-action" data-open-original>Открыть оригинал</button>`;});
      const archive=s.querySelector('.v3-review-archive');if(archive)setText(archive.querySelector('summary'),`Другие отзывы в сообщениях (${archive.querySelectorAll('[data-review-source]').length})`);
      archive?.querySelector('summary').insertAdjacentHTML('beforeend',chevron);
      const all=s.querySelector('a[data-page="A05"]');if(all){all.className='v4-text-action v4-review-catalog';all.innerHTML=`Все отзывы${arrow}`;}
    });
    init(d,'HM08',s=>{
      s.classList.add('v4-faq');setText(s.querySelector('h2'),'Перед первой встречей');
      const layout=s.querySelector('.faq-layout');layout.className='v4-faq-layout';const hint=s.querySelector('.faq-lead');hint.className='v4-faq-hint';
      hint.innerHTML='<h3>Остались вопросы?</h3><p>Можно спросить о формате и о том, что важно знать перед началом работы.</p><button class="primary" data-form="QUESTION">Задать вопрос</button>';
      const lastAnswer=s.querySelector('.faq details:last-child p');lastAnswer.append(' Продолжительность работы и необходимость следующих встреч тоже обсуждаем по ходу терапии.');layout.prepend(hint);s.querySelectorAll('.faq details').forEach(e=>{e.open=false;e.querySelector('summary').insertAdjacentHTML('beforeend',chevron);});
    });
    init(d,'HM11',s=>{s.classList.add('v4-contact');setText(s.querySelector('h2'),'Обсудим ваш запрос');setText(s.querySelector('p'),'Коротко напишите, что вас беспокоит. Я помогу сориентироваться, подойдёт ли вам работа со мной.');const text=s.querySelector('p');text.insertAdjacentHTML('afterend','<p class="v6-contact-next">Сначала уточним запрос и подходящий формат в переписке.</p>');setText(s.querySelector('[data-form="DISCUSS"]'),'Написать о своей ситуации');});
    init(d,'HM10',s=>{
      s.classList.add('v4-publications');const inside=s.querySelector('.inside');inside.innerHTML=`<div class="v4-publications-head"><h2>Полезно перед встречей</h2>${link('A07','Все публикации')}</div><a class="v4-publication-card" href="#REQUEST_GUIDE" data-page="REQUEST_GUIDE"><div><h3>С каким запросом прийти к психологу?</h3><p>Что говорить, если пока трудно понять, что с вами, и почему запрос может меняться в процессе работы.</p></div><span class="v4-text-action">Читать${arrow}</span></a>`;
    });
    const footer=d.querySelector('.footer');if(footer&&!footer.dataset.v4Body){
      footer.dataset.v4Body='true';footer.classList.add('v4-footer');const grid=footer.querySelector('.footer-grid');grid.classList.add('v4-footer-grid');
      const contacts=grid.children[0],docs=grid.children[1],channels=grid.children[2];contacts.classList.add('v4-footer-contacts');docs.classList.add('v4-footer-documents');channels.classList.add('v4-footer-channels');
      const contact=contacts.querySelector('[data-page="H22"]');if(contact){contact.className='v4-text-action v6-footer-contact-page';contact.insertAdjacentHTML('beforebegin',`<a class="button quiet v6-direct-contact" href="https://t.me/MariBernshtein" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram, откроется в новой вкладке">Написать в Telegram${external}</a>`);}const reviewLink=contacts.querySelector('[data-page="A05"]');setText(reviewLink,'Отзывы');
      channels.querySelector('p.small')?.remove();channels.querySelectorAll('a').forEach(a=>{a.querySelectorAll('.external-arrow').forEach(e=>e.remove());a.insertAdjacentHTML('beforeend',external);});
      const note=d.createElement('p');note.className='v4-prototype-note shell';note.textContent='Прототип: обращения не отправляются, запись не создаётся.';grid.after(note);
    }
    /* Responsive reordering also changes the reading order, without duplicate content. */
    if(!window.__v4BodyResponsive){
      window.__v4BodyResponsive=true;
      const arrange=()=>{
        const faq=d.querySelector('.v4-faq-layout'),hint=faq?.querySelector('.v4-faq-hint');
        if(hint){if(matchMedia('(max-width:1023px)').matches){if(faq.lastElementChild!==hint)faq.append(hint);}else if(faq.firstElementChild!==hint)faq.prepend(hint);}
        const grid=d.querySelector('.v4-footer-grid'),docs=grid?.querySelector('.v4-footer-documents'),channels=grid?.querySelector('.v4-footer-channels');
        if(grid&&docs&&channels){if(matchMedia('(max-width:767px)').matches){if(grid.lastElementChild!==docs)grid.append(channels,docs);}else if(grid.lastElementChild!==channels)grid.append(docs,channels);}
      };
      window.__v4ArrangeBody=arrange;matchMedia('(max-width:1023px)').addEventListener('change',arrange);matchMedia('(max-width:767px)').addEventListener('change',arrange);
    }
    window.__v4ArrangeBody();
  };
})();
