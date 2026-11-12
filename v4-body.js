/* V4 blocks 08–17. Source media and navigation stay in the V3 data model. */
(() => {
  'use strict';
  const play = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const external = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19 19 5M6 5h13v13"/></svg>';
  const chevron = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const videoCopy = {
    IMG_6973: ['Сепарация и свои приоритеты', 'Опыт работы с отношениями с родителями и личными приоритетами. В центре отзыва — собственные желания, выбор работы и ощущение своего места в жизни.'],
    IMG_6977: ['Учиться выражать чувства', 'Постепенное освоение навыка замечать и выражать чувства. В отзыве этот опыт связан с ощущением сил для творчества, повседневных дел и занятий спортом.'],
    IMG_6978: ['Спокойствие без осуждения', 'Личное впечатление от спокойного контакта на встречах и возможности обращаться за помощью без страха осуждения. Благодарность за совместную работу и замеченные изменения.'],
    IMG_6970: ['Понимание себя', 'Опыт длительной терапии: принятие себя, понимание своих чувств и личных ценностей. Отдельное место занимают собственные ориентиры и способы поддерживать себя.'],
    IMG_6972: ['Опыт обращения за поддержкой', 'Благодарность за помощь в семейной ситуации и опыт обращения за поддержкой. В коротком отзыве важны доверие к специалисту и уверенность в своём выборе.'],
    IMG_6974: ['Ясность и личный контакт', 'Личные впечатления от общения и совместной работы. В отзыве важны ясность разговора, точность отклика и возможность обозначить то, с чем хочется разобраться.'],
    IMG_6979: ['Внутренний конфликт и изменения', 'Опыт образной работы с внутренним конфликтом в теме отношений. В центре отзыва — взаимодействие внутренних образов и изменения, замеченные после встречи.'],
    IMG_6980: ['Опыт образной работы', 'Впечатление от визуализации и собственных возможностей воображения. Отдельно отмечена работа, к которой хочется возвращаться в размышлениях после завершения встречи с психологом.'],
    'unique-20261105': ['Контроль и доверие к себе', 'Опыт встречи с интенсивными переживаниями и сопротивлением. В отзыве звучат темы расслабления, ослабления контроля и возможности больше доверять себе и своему телу.']
  };
  const textCopy = [
    ['photo_2025-03-12_20-57-15.webp','Уверенность и свои решения','За последние несколько дней я успела заметить, что уже могу смелее высказывать своё мнение на работе и даже решилась записаться на новые курсы.'],
    ['photo_2024-12-17_16-53-44.webp','Ближе к себе','Так хорошо внутри стало, на осуждения все равно и это дает росточки для углубления, успокоения и проживания с большей внутренней гармонией. Отшелушивается что-то и каждый такой шаг приближает к самой себе настоящей.'],
    ['photo_2025-01-21_16-36-25.webp','Безопасность и понимание себя','Ты создала настолько безопасное пространство, где я смогла открыто рассказать о своих переживаниях. Ты помогла мне разобраться в причинах моего беспокойства и агрессии, которые я наблюдала у мужчин вокруг меня.']
  ];
  const setText = (el, text) => { if (el && el.textContent !== text) el.textContent = text; };
  const link = (id,text) => `<a class="v4-text-action" href="#${id}" data-page="${id}">${text}${arrow}</a>`;
  const book = text => `<a class="button primary" href="#native-contact" data-form="BOOK">${text}</a>`;
  const init = (d,id,fn) => { const s=d.getElementById(id); if (!s || s.dataset.v4Body) return; if(fn(s)!==false)s.dataset.v4Body='true'; };
  window.applyV4Body = function(d = document) {
    if (!d.getElementById('HM01')) return;
    init(d,'HM07_VIDEO',s=>{
      const cards=[...s.querySelectorAll('.v3-video-card')]; if(!cards.length)return false;
      s.classList.add('v4-video-section');
      cards.forEach(card=>{
        const id=decodeURIComponent(card.dataset.videoSrc.split('?')[0].split('/').pop()).replace(/\.mp4$/i,''), info=videoCopy[id]; if(!info)return;
        card.dataset.topic=info[0]; card.classList.add('v4-video-card');
        const poster=card.querySelector('.v3-video-card__poster'); poster.className='v4-video-poster v3-video-card__poster';
        if(!['IMG_6973','IMG_6977'].includes(id)){
          card.dataset.poster=`v4-media/posters/${id}.webp`;
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
    });
    init(d,'HM_SESSION',s=>{
      s.classList.add('v4-session');
      const left=s.querySelector('.session-details'); left.className='v4-session-details';
      left.innerHTML='<div class="v4-session-points"><div><h3>Со мной можно не соглашаться</h3><p>Мои предположения можно поправлять. Вы можете задавать вопросы и говорить, если что-то не подходит. Здесь важен именно ваш опыт.</p></div><div><h3>Сессия длится 1,5 часа</h3><p>Есть время разобраться в ситуации, поработать с переживаниями и подвести итоги.</p></div><div><h3>Практики между встречами</h3><p>По ходу работы я предлагаю задания и практики самопомощи: наблюдать за своими реакциями, поддерживать себя и пробовать новые действия.</p></div></div><p class="v4-meeting-format">Онлайн в Zoom или в кабинете в Санкт-Петербурге.<br>Для онлайн-встречи выберите место, где вас не будут отвлекать.</p>';
      s.querySelector('.session-composition').className='v4-session-columns';
      const right=s.querySelector('.session-media');right.className='v4-session-media';
      const film=right.querySelector('.session-film'); film.classList.add('v4-session-film');
      film.querySelector('.v2-film-title')?.remove();
      right.querySelectorAll('.v3-session-fallback,.session-video-fallback,.v2-film-caption,.session-reading').forEach(e=>e.remove());
      film.insertAdjacentHTML('afterend',`<p class="v4-media-caption">Видео о первой встрече · 18:30</p><a class="v4-text-action v4-session-external" href="https://vkvideo.ru/video822555244_456239197" target="_blank" rel="noopener noreferrer">Открыть во ВКонтакте${external}</a><div class="v4-session-actions">${book('Записаться на первую сессию')}${link('H23','Прочитать о первой встрече')}</div>`);
    });
    init(d,'HM05',s=>{
      s.classList.add('v4-methods');
      const data=[['M01','Репарационная психология и терапия','Работаем с внутренними сценариями, чувствами, образами и телесными реакциями, которые связаны с вашим запросом.'],['M02','ДПДГ','Обращаемся к воспоминаниям и переживаниям, связанным с тяжёлым опытом, который продолжает отзываться в настоящем.'],['M05','Краткосрочная терапия','Сосредотачиваемся на конкретной трудности: уточняем задачу и обсуждаем изменения, к которым вы хотите прийти.']];
      const inside=s.querySelector('.inside');inside.innerHTML='<h2>Подходы и методы</h2><div class="v4-method-rows">'+data.map(([id,title,copy])=>`<article class="v4-method-row"><div><h3>${title}</h3>${id==='M02'?'<p class="v4-method-expansion">Десенсибилизация и переработка движениями глаз</p>':''}</div><p>${copy}</p><a class="v4-text-action" href="#${id}" data-page="${id}" aria-label="Подробнее: ${title}">Подробнее${arrow}</a></article>`).join('')+'</div>'+link('A01','Все подходы и методы');
    });
    init(d,'HM_CREDENTIALS',s=>{
      const features=[...s.querySelectorAll('.v3-credential-feature')];if(features.length!==4)return false;
      s.classList.add('v4-credentials');setText(s.querySelector('h2'),'Образование и подготовка');
      const labels=[['Репарационная психология и терапия','Профпереподготовка · 1155 часов · 2025'],['ДПДГ: протоколы работы','Семинар · 16 академических часов · 2025'],['Эриксоновская психотерапия и гипноз','Программа · 26 академических часов · 2024'],['Аттестация по АРПТ','Решение аттестационной комиссии']];
      features.forEach((item,i)=>{item.querySelector('.credential-preview')?.style.removeProperty('width');const c=item.querySelector(':scope > .v3-credential-caption');if(c)c.innerHTML=`<strong>${labels[i][0]}</strong><span>${labels[i][1]}</span>`;});
      const archive=s.querySelector('.v3-credential-archive');if(archive)setText(archive.querySelector(':scope > summary'),`Остальные документы (${archive.querySelectorAll('.credential-preview').length})`);
      s.querySelectorAll('.v3-credential-appendices>summary,.v3-credential-archive>summary').forEach(e=>e.insertAdjacentHTML('beforeend',chevron));
    });
    init(d,'HM06',s=>{
      s.classList.add('v4-prices');const inside=s.querySelector('.inside'),table=inside.querySelector('.package-sheet');
      const purposes=['Первая встреча или отдельная сессия.','Вариант для регулярной работы с одним запросом.','Вариант для продолжения работы и связанных тем.','Вариант для длительной регулярной работы.'];
      table.querySelectorAll('.format-purpose').forEach((e,i)=>setText(e,purposes[i]));
      const heading=inside.querySelector('h2');const grid=d.createElement('div');grid.className='v4-price-columns';
      grid.innerHTML='<div class="v4-price-intro"><p>Одна встреча длится 90 минут. Онлайн и в кабинете в Санкт-Петербурге — одинаковая стоимость.</p><p>Можно начать с одной встречи. Пакет не обязателен.</p>'+book('Записаться на сессию')+link('A02','Стоимость и условия')+'</div>';
      grid.append(table);inside.replaceChildren(heading,grid);
    });
    init(d,'HM07_TEXT',s=>{
      const cards=[...s.querySelectorAll('.v3-text-review-grid > .v3-text-card')];if(cards.length!==3)return false;
      s.classList.add('v4-text-reviews');
      cards.forEach(card=>{const item=textCopy.find(x=>decodeURIComponent(card.dataset.reviewSource).includes(x[0]));if(!item)return;card.classList.add('v4-text-card');card.innerHTML=`<h3>${item[1]}</h3><blockquote>«${item[2]}»</blockquote><button type="button" class="v4-text-action" data-open-original>Открыть оригинал</button>`;});
      const archive=s.querySelector('.v3-review-archive');if(archive)setText(archive.querySelector('summary'),`Показать остальные отзывы (${archive.querySelectorAll('[data-review-source]').length})`);
      archive?.querySelector('summary').insertAdjacentHTML('beforeend',chevron);
      const all=s.querySelector('a[data-page="A05"]');if(all){all.className='v4-text-action v4-review-catalog';all.innerHTML=`Все отзывы и кейсы${arrow}`;}
    });
    init(d,'HM08',s=>{
      s.classList.add('v4-faq');setText(s.querySelector('h2'),'Перед первой встречей');
      const layout=s.querySelector('.faq-layout');layout.className='v4-faq-layout';const hint=s.querySelector('.faq-lead');hint.className='v4-faq-hint';
      hint.innerHTML='<h3>Остались вопросы?</h3><p>Можно спросить о формате и о том, что важно знать перед началом работы.</p><button class="primary" data-form="QUESTION">Задать вопрос</button>';
      layout.prepend(hint);s.querySelectorAll('.faq details').forEach(e=>{e.open=false;e.querySelector('summary').insertAdjacentHTML('beforeend',chevron);});
    });
    init(d,'HM11',s=>{s.classList.add('v4-contact');setText(s.querySelector('h2'),'Обсудим ваш запрос');setText(s.querySelector('[data-form="DISCUSS"]'),'Обсудить запрос');});
    init(d,'HM10',s=>{
      s.classList.add('v4-publications');const inside=s.querySelector('.inside');inside.innerHTML=`<div class="v4-publications-head"><h2>Публикации</h2>${link('A07','Все публикации')}</div><a class="v4-publication-card" href="#REQUEST_GUIDE" data-page="REQUEST_GUIDE"><div><h3>С каким запросом прийти к психологу?</h3><p>Что говорить, если пока трудно понять, что с вами, и почему запрос может меняться в процессе работы.</p></div><span class="v4-text-action">Читать${arrow}</span></a>`;
    });
    const footer=d.querySelector('.footer');if(footer&&!footer.dataset.v4Body){
      footer.dataset.v4Body='true';footer.classList.add('v4-footer');const grid=footer.querySelector('.footer-grid');grid.classList.add('v4-footer-grid');
      const contacts=grid.children[0],docs=grid.children[1],channels=grid.children[2];contacts.classList.add('v4-footer-contacts');docs.classList.add('v4-footer-documents');channels.classList.add('v4-footer-channels');
      const contact=contacts.querySelector('[data-page="H22"]');if(contact)contact.className='button quiet v4-footer-contact';
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
