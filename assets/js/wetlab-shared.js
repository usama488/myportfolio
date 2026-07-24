/* ==========================================================================
   WET LAB & SEQUENCING SHARED JS INTERACTIVITY (wetlab-shared.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initTocScrollTracking();
  initStepTabs();
  initLightboxModal();
  initComparisonSliders();
  initReadTimeCalculator();
});

/* 1. Reading Progress Bar */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* 2. TOC Scroll Tracking (Intersection Observer) */
function initTocScrollTracking() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.section-anchor');
  if (!tocLinks.length || !sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* 3. Step Tabs/Accordion Switcher */
function initStepTabs() {
  document.querySelectorAll('.step-tabs-wrapper').forEach(wrapper => {
    const tabBtns = wrapper.querySelectorAll('.tab-btn');
    const tabContents = wrapper.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = wrapper.querySelector(`.tab-content[data-tab="${targetTab}"]`);
        if (activeContent) activeContent.classList.add('active');
      });
    });
  });
}

/* 4. Lightbox Gallery Viewer */
let currentLightboxIndex = 0;
let lightboxImages = [];

function initLightboxModal() {
  // Inject modal markup if not present
  if (!document.getElementById('lightbox-modal')) {
    const modalHtml = `
      <div id="lightbox-modal" class="lightbox-modal">
        <button class="lightbox-close" id="lightbox-close">&times;</button>
        <button class="lightbox-nav lightbox-prev" id="lightbox-prev">&#10094;</button>
        <img class="lightbox-content" id="lightbox-img" src="" alt="Lab Photograph">
        <div class="lightbox-caption" id="lightbox-caption"></div>
        <button class="lightbox-nav lightbox-next" id="lightbox-next">&#10095;</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  // Collect all clickable lab images
  lightboxImages = Array.from(document.querySelectorAll('.img-container img, .hero-img-box img'));

  lightboxImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentLightboxIndex = index;
      openLightbox(img);
    });
  });

  function openLightbox(img) {
    modalImg.src = img.src;
    modalCaption.textContent = img.alt || 'Laboratory Photograph';
    modal.classList.add('active');
  }

  function showLightboxIndex(index) {
    if (index < 0) index = lightboxImages.length - 1;
    if (index >= lightboxImages.length) index = 0;
    currentLightboxIndex = index;
    const targetImg = lightboxImages[currentLightboxIndex];
    modalImg.src = targetImg.src;
    modalCaption.textContent = targetImg.alt || 'Laboratory Photograph';
  }

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  prevBtn.addEventListener('click', () => showLightboxIndex(currentLightboxIndex - 1));
  nextBtn.addEventListener('click', () => showLightboxIndex(currentLightboxIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') modal.classList.remove('active');
    if (e.key === 'ArrowLeft') showLightboxIndex(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentLightboxIndex + 1);
  });
}

/* 5. Interactive Comparison Slider (Good vs Bad / Gel Compare) */
function initComparisonSliders() {
  document.querySelectorAll('.comparison-slider-container').forEach(container => {
    const overlay = container.querySelector('.comparison-overlay');
    const handle = container.querySelector('.comparison-handle');
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = container.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      overlay.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}

/* 6. Dynamic Read Time Calculator */
function initReadTimeCalculator() {
  const readTimeEl = document.getElementById('read-time-badge');
  const articleEl = document.querySelector('.main-article');
  if (!readTimeEl || !articleEl) return;

  const text = articleEl.innerText || '';
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200); // Avg 200 words/min
  readTimeEl.textContent = `~${readTime} min read`;
}
