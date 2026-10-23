(() => {
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const empty = document.querySelector('.gallery-empty');
  let visibleCards = cards.filter(card => !card.hidden);
  let currentIndex = 0;
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const image = lightbox.querySelector('.lightbox-image');
  const category = lightbox.querySelector('.lightbox-caption .gallery-category');
  const title = lightbox.querySelector('.lightbox-caption h2');
  const description = lightbox.querySelector('.lightbox-caption p');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let lastFocused = null;

  function filterCards(filter) {
    cards.forEach(card => {
      const show = filter === 'All' || card.dataset.category === filter;
      card.hidden = !show;
    });
    visibleCards = cards.filter(card => !card.hidden);
    if (empty) empty.hidden = visibleCards.length > 0;
    filters.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  filters.forEach(button => button.addEventListener('click', () => filterCards(button.dataset.filter)));

  function openAt(index, trigger) {
    if (!visibleCards.length) return;
    currentIndex = (index + visibleCards.length) % visibleCards.length;
    const card = visibleCards[currentIndex];
    const cardImage = card.querySelector('img');
    image.src = cardImage.currentSrc || cardImage.src;
    image.alt = cardImage.alt;
    category.textContent = card.dataset.category;
    title.textContent = card.dataset.title;
    description.textContent = card.dataset.description;
    lastFocused = trigger || document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
  cards.forEach(card => {
    const trigger = card.querySelector('.gallery-image-button');
    const details = card.querySelector('.project-view');
    const index = () => visibleCards.indexOf(card);
    trigger.addEventListener('click', () => openAt(Math.max(0, index()), trigger));
    details.addEventListener('click', () => openAt(Math.max(0, index()), details));
  });
  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => openAt(currentIndex - 1, prevButton));
  nextButton.addEventListener('click', () => openAt(currentIndex + 1, nextButton));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') openAt(currentIndex - 1, prevButton);
    if (event.key === 'ArrowRight') openAt(currentIndex + 1, nextButton);
  });
})();
