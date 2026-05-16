/**
 * Круговая карусель отзывов (адаптация CircularTestimonials под vanilla JS)
 */
(function () {
  var testimonials = [
    {
      quote:
        'Собрали лендинг и сценарий с ИИ за три недели — конверсия заявок выросла заметно. Всё выглядит цельно: от копирайта до анимации.',
      name: 'Анна Крылова',
      designation: 'Основатель edtech-стартапа',
      src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
    },
    {
      quote:
        'Telegram-бот с диагностикой реально разгрузил мастеров. Запускали MVP без лишней бюрократии — быстро, понятно, с поддержкой после релиза.',
      name: 'Дмитрий Волков',
      designation: 'Руководитель автосервиса',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop'
    },
    {
      quote:
        'Панель автоматизации и интерфейс с ИИ ощущаются как один продукт, а не набор экранов. Команда сразу поняла логику — это редкость.',
      name: 'Елена Сафонова',
      designation: 'Продуктовый менеджер',
      src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop'
    }
  ];

  var AUToplay_MS = 5000;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function calculateGap(width) {
    var minWidth = 1024;
    var maxWidth = 1456;
    var minGap = 60;
    var maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
  }

  function boot() {
    var root = document.getElementById('testimonialsCarousel');
    if (!root) return;

    var imagesEl = document.getElementById('testimonialsImages');
    var nameEl = document.getElementById('testimonialsName');
    var designationEl = document.getElementById('testimonialsDesignation');
    var quoteEl = document.getElementById('testimonialsQuoteText');
    var dotsEl = document.getElementById('testimonialsDots');
    var prevBtn = document.getElementById('testimonialsPrev');
    var nextBtn = document.getElementById('testimonialsNext');

    if (!imagesEl || !nameEl || !designationEl || !quoteEl) return;

    var activeIndex = 0;
    var containerWidth = 1200;
    var autoplayTimer = null;
    var length = testimonials.length;
    var imgEls = [];

    testimonials.forEach(function (item, index) {
      var img = document.createElement('img');
      img.className = 'testimonials-image';
      img.src = item.src;
      img.alt = item.name;
      img.width = 800;
      img.height = 1000;
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.dataset.index = String(index);
      imagesEl.appendChild(img);
      imgEls.push(img);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonials-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Отзыв: ' + item.name);
      dot.dataset.index = String(index);
      dotsEl.appendChild(dot);
    });

    var dotEls = dotsEl.querySelectorAll('.testimonials-dot');

    function getImageStyle(index) {
      var gap = calculateGap(containerWidth);
      var maxStickUp = gap * 0.8;
      var isActive = index === activeIndex;
      var isLeft = (activeIndex - 1 + length) % length === index;
      var isRight = (activeIndex + 1) % length === index;

      if (isActive) {
        return {
          zIndex: '3',
          opacity: '1',
          pointerEvents: 'auto',
          transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)'
        };
      }
      if (isLeft) {
        return {
          zIndex: '2',
          opacity: '1',
          pointerEvents: 'auto',
          transform:
            'translateX(-' + gap + 'px) translateY(-' + maxStickUp + 'px) scale(0.85) rotateY(15deg)'
        };
      }
      if (isRight) {
        return {
          zIndex: '2',
          opacity: '1',
          pointerEvents: 'auto',
          transform:
            'translateX(' + gap + 'px) translateY(-' + maxStickUp + 'px) scale(0.85) rotateY(-15deg)'
        };
      }
      return {
        zIndex: '1',
        opacity: '0',
        pointerEvents: 'none',
        transform: 'translateX(0) scale(0.7)'
      };
    }

    function applyImageStyles() {
      imgEls.forEach(function (img, index) {
        var style = getImageStyle(index);
        Object.keys(style).forEach(function (key) {
          img.style[key] = style[key];
        });
      });
    }

    function renderQuoteWords(text) {
      quoteEl.innerHTML = '';
      var words = text.split(/\s+/);
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'testimonials-word';
        span.textContent = word;
        if (prefersReducedMotion) {
          span.style.opacity = '1';
          span.style.filter = 'none';
          span.style.transform = 'none';
        } else {
          span.style.animationDelay = 0.025 * i + 's';
        }
        quoteEl.appendChild(span);
        if (i < words.length - 1) quoteEl.appendChild(document.createTextNode(' '));
      });
    }

    function updateContent() {
      var item = testimonials[activeIndex];
      nameEl.textContent = item.name;
      designationEl.textContent = item.designation;
      renderQuoteWords(item.quote);

      dotEls.forEach(function (dot, i) {
        var isActive = i === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      applyImageStyles();
    }

    function resetAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(function () {
        goTo((activeIndex + 1) % length);
      }, AUToplay_MS);
    }

    function goTo(index) {
      activeIndex = ((index % length) + length) % length;
      updateContent();
      resetAutoplay();
    }

    function handleResize() {
      containerWidth = imagesEl.offsetWidth || 1200;
      applyImageStyles();
    }

    prevBtn.addEventListener('click', function () {
      goTo(activeIndex - 1);
    });
    nextBtn.addEventListener('click', function () {
      goTo(activeIndex + 1);
    });

    dotsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.testimonials-dot');
      if (!btn) return;
      goTo(parseInt(btn.dataset.index, 10));
    });

    window.addEventListener('keydown', function (e) {
      if (!root.contains(document.activeElement) && document.activeElement !== document.body) {
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeIndex + 1);
      }
    });

    window.addEventListener('resize', handleResize);
    handleResize();
    updateContent();
    resetAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
