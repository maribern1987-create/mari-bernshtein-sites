(() => {
  const svg = (isChoice=false) => '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + (isChoice?'m6 9 6 6 6-6':'M4 12h15m-6-6 6 6-6 6')+'"/></svg>';
  function topics(section) {
    for(const tile of section.querySelectorAll('.topic-card')) {
      const description = tile.querySelector('span');
      const title = document.createElement('strong');
      const panic = tile.textContent.includes('Панические атаки');
      title.textContent = panic ? 'Панические атаки и тревога' : tile.firstChild.textContent.trim();
      if(panic) description.textContent='Приступы паники, тревожные мысли, постоянное напряжение';
      tile.replaceChildren(title,description);
      tile.insertAdjacentHTML('beforeend', svg(tile.hasAttribute('data-topic-picker')));
    }
    const catalog=section.querySelector('[data-page=TOPICS]');
    catalog.className='v4-text-action';
    catalog.innerHTML='Все темы'+svg();
  }
  function about(section) {
    const heading=section.querySelector('h2'), player=section.querySelector('.about-video');
    const link=section.querySelector('[data-page=H21]');
    const intro=document.createElement('div');
    intro.className='v4-intro-copy';
    intro.append(heading);
    intro.insertAdjacentHTML('beforeend','<p class="lead">Со мной не нужно подбирать «правильные» слова.</p>');
    const body=document.createElement('div');
    body.className='intro-details';
    body.innerHTML='<p>Я Мари Бернштейн, психолог. Веду частную практику с 2024 года. Работаю в репарационной психологии и терапии, использую ДПДГ.</p><p>Вы можете задавать вопросы, сомневаться и говорить, если предложенный способ работы вам не подходит.</p>';
    player.querySelector('.v2-film-caption').textContent='Видео-знакомство · 4:04';
    link.className='v4-text-action v4-intro-link';
    link.innerHTML='Больше обо мне'+svg();
    body.append(link);
    section.querySelector('.about-halves').replaceChildren(intro,player,body);
  }
  window.mountV4 = () => {
    const home=document.querySelector('#HM01');
    document.body.classList.toggle('v4-home',!!home);
    if(home && !home.dataset.v4Shell){
      home.dataset.v4Shell='1';
      topics(document.querySelector('#HM02'));
      about(document.querySelector('#HM03'));
    }
    window.applyV4Body?.(document);
    window.applyV4Ui?.(document);
  };
  document.addEventListener('DOMContentLoaded',window.mountV4,{once:true});
  if(document.readyState!=='loading') window.mountV4();
})();
