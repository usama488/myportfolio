/**
 * animations.js — High Performance Dark Portfolio Enhancements
 * usama.devsil.com Redesign
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME & FOCUS MODE CONTROLS
     ========================================================================== */
  const savedTheme = localStorage.getItem('usama_portfolio_theme') || 'dark';
  const savedFocus = localStorage.getItem('usama_portfolio_focus') === 'true';

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (savedFocus) {
    document.body.classList.add('focus-mode');
  }

  window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('usama_portfolio_theme', newTheme);
    
    const themeIcon = document.querySelector('.theme-toggle-btn ion-icon');
    if (themeIcon) {
      themeIcon.setAttribute('name', newTheme === 'light' ? 'moon-outline' : 'sunny-outline');
    }
  };

  window.toggleFocusMode = function () {
    const isFocus = document.body.classList.toggle('focus-mode');
    localStorage.setItem('usama_portfolio_focus', isFocus);
    
    const focusBtn = document.querySelector('.focus-toggle-btn');
    if (focusBtn) {
      focusBtn.classList.toggle('active', isFocus);
    }
  };


  /* ==========================================================================
     2. DYNAMIC TIME-BASED GREETING & VOICE INTRO
     ========================================================================== */
  const timeGreetingElem = document.getElementById('time-greeting');
  if (timeGreetingElem) {
    const hour = new Date().getHours();
    let greeting = 'Welcome';
    if (hour < 12) greeting = 'Good Morning ☀️';
    else if (hour < 18) greeting = 'Good Afternoon 🌤️';
    else greeting = 'Good Evening 🌙';
    timeGreetingElem.textContent = `${greeting}, welcome to my portfolio!`;
  }

  window.playVoiceIntro = function () {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const introText = "Hello! Welcome to my portfolio. I am Usama Bin Ali, an MPhil Bioinformatics student, Data Scientist, and AI Engineer specializing in computational biology, machine learning, and healthcare AI solutions.";
      const utterance = new SpeechSynthesisUtterance(introText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voiceBtn = document.querySelector('.voice-intro-btn');
      if (voiceBtn) voiceBtn.classList.add('speaking');

      utterance.onend = () => {
        if (voiceBtn) voiceBtn.classList.remove('speaking');
      };
      utterance.onerror = () => {
        if (voiceBtn) voiceBtn.classList.remove('speaking');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech Synthesis is not supported in your browser.");
    }
  };


  /* ==========================================================================
     3. PARTICLES / NEURAL NETWORK CANVAS BACKGROUND
     ========================================================================== */
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    if (!document.body.classList.contains('focus-mode')) {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isLight ? 0.08 : 0.15);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();


  /* ==========================================================================
     4. TYPEWRITER HERO EFFECT
     ========================================================================== */
  const titleElem = document.querySelector('.sidebar .info-content .title');
  if (titleElem) {
    const titles = [
      'Bioinformatician',
      'Data Scientist',
      'AI Engineer',
      'Computational Biologist',
      'AI Automation Specialist'
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    titleElem.innerHTML = `<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>`;
    const textSpan = titleElem.querySelector('.typewriter-text');

    function typeLoop() {
      const currentFullText = titles[titleIndex];

      if (isDeleting) {
        charIndex--;
        typeSpeed = 40;
      } else {
        charIndex++;
        typeSpeed = 100;
      }

      if (textSpan) {
        textSpan.textContent = currentFullText.substring(0, charIndex);
      }

      if (!isDeleting && charIndex === currentFullText.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }


  /* ==========================================================================
     5. 3D TILT ON HOVER (CARD MOUSE MOVE EFFECT)
     ========================================================================== */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    const tiltElements = document.querySelectorAll('.service-item, .project-item, .content-card, .blog-post-item, .terminal-widget, .ml-demo-card');

    tiltElements.forEach(elem => {
      elem.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('focus-mode')) return;

        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      elem.addEventListener('mouseleave', () => {
        elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }


  /* ==========================================================================
     6. INTERACTIVE TERMINAL WIDGET
     ========================================================================== */
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (terminalInput && terminalOutput) {
    const commands = {
      whoami: `Usama Bin Ali — MPhil Bioinformatics Student | Data Scientist | AI Engineer based in Karak, KPK, Pakistan. Specializing in healthcare AI & genomics.`,
      skills: `[Domain Skills]: Data Analytics (80%), Machine Learning (83%), Generative AI (60%), AI Agents (70%), MLOps (50%)\n[Tech Stack]: Python, SQL, Docker, AWS, Jupyter, Linux, Biopython`,
      projects: `Featured Projects:\n- Bilal Ice Cream Factory Website\n- Clinic Management Pro\n- Optical Character Recognition (OCR)\n- Cardiovascular Disease Prediction App\n- EDA on Gene Expression & Cancer Datasets`,
      contact: `Email: usamabinali132@gmail.com | Phone: +923189204386 | GitHub: github.com/usama488 | LinkedIn: usama-bin-ali`,
      help: `Available commands: whoami, skills, projects, contact, clear, theme`
    };

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        const line = document.createElement('div');
        line.className = 'terminal-line';

        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = 'usama@devsil:~$ ';

        const cmdSpan = document.createElement('span');
        cmdSpan.className = 'terminal-cmd';
        cmdSpan.textContent = cmd;

        line.appendChild(promptSpan);
        line.appendChild(cmdSpan);
        terminalOutput.appendChild(line);

        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-response';

        if (cmd === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        } else if (cmd === 'theme') {
          window.toggleTheme();
          responseLine.textContent = 'Theme toggled successfully.';
        } else if (commands[cmd]) {
          responseLine.innerText = commands[cmd];
        } else if (cmd !== '') {
          responseLine.textContent = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
        }

        if (cmd !== '') {
          terminalOutput.appendChild(responseLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }


  /* ==========================================================================
     7. INTERACTIVE ML DEMO (DISEASE RISK CALCULATOR)
     ========================================================================== */
  window.runMLPredictor = function () {
    const age = parseFloat(document.getElementById('ml-age')?.value || 48);
    const bmi = parseFloat(document.getElementById('ml-bmi')?.value || 27.4);
    const bps = parseFloat(document.getElementById('ml-bps')?.value || 132);
    const chol = parseFloat(document.getElementById('ml-chol')?.value || 210);

    const score = (age * 0.04) + (bmi * 0.06) + (bps * 0.02) + (chol * 0.015) - 6.5;
    const probability = Math.min(Math.max((1 / (1 + Math.exp(-score))) * 100, 5), 98).toFixed(1);

    const resultBox = document.getElementById('ml-result-box');
    const resultScore = document.getElementById('ml-result-score');
    const resultBadge = document.getElementById('ml-result-badge');

    if (resultBox && resultScore && resultBadge) {
      resultBox.style.display = 'block';
      resultScore.textContent = `${probability}%`;

      if (probability < 35) {
        resultBadge.textContent = 'LOW RISK';
        resultBadge.className = 'risk-badge low';
      } else if (probability < 65) {
        resultBadge.textContent = 'MODERATE RISK';
        resultBadge.className = 'risk-badge moderate';
      } else {
        resultBadge.textContent = 'HIGH RISK';
        resultBadge.className = 'risk-badge high';
      }
    }
  };


  /* ==========================================================================
     8. FLOATING AI PORTFOLIO CHATBOT ASSISTANT
     ========================================================================== */
  window.toggleAIChatbot = function () {
    const chatModal = document.getElementById('ai-chatbot-modal');
    if (chatModal) {
      chatModal.classList.toggle('active');
    }
  };

  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');

  const knowledgeBase = [
    { keywords: ['who', 'about', 'bio', 'name', 'background'], response: "Usama Bin Ali is an MPhil Bioinformatics student, Data Scientist, and AI Engineer based in Karak, KPK, Pakistan. He works at the intersection of computational biology, healthcare AI, and machine learning." },
    { keywords: ['project', 'portfolio', 'work'], response: "Usama has completed over 30 projects including Clinic Management Pro, Optical Character Recognition (OCR), Cardiovascular Disease Prediction App, and EDA on Gene Expression/Cancer datasets." },
    { keywords: ['skill', 'python', 'tech', 'stack', 'tool'], response: "Key Skills: Data Analytics (80%), Machine Learning (83%), Generative AI (60%), AI Agents (70%), MLOps (50%). Tech stack: Python, SQL, Docker, AWS, Jupyter, Biopython." },
    { keywords: ['contact', 'email', 'phone', 'hire', 'reach'], response: "You can reach Usama via Email at usamabinali132@gmail.com, Phone: +923189204386, or LinkedIn: linkedin.com/in/usama-bin-ali-40a8502b0/." },
    { keywords: ['education', 'degree', 'university', 'bs'], response: "Usama completed his BS Bioinformatics at Khushal Khan Khattak University Karak and is currently pursuing his MPhil in Bioinformatics." },
    { keywords: ['wet lab', 'lab', 'biology', 'pcr'], response: "Usama offers hands-on Wet Lab services: sample preparation, DNA/RNA extraction, PCR amplification, and sequencing sample prep." },
    { keywords: ['pipeline', 'bioinformatics'], response: "Bioinformatics Pipeline service builds end-to-end computational workflows for raw genomic data preprocessing, alignment, variant calling, and visualization." }
  ];

  window.sendChatMessage = function (userText) {
    const query = (userText || chatbotInput?.value || '').trim().toLowerCase();
    if (!query) return;

    if (chatbotInput) chatbotInput.value = '';

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user-msg';
    userMsg.textContent = query;
    chatbotMessages.appendChild(userMsg);

    let reply = "I'm Usama's AI Assistant! You can ask me about his projects, skills, education, contact info, or bioinformatics services.";
    for (const item of knowledgeBase) {
      if (item.keywords.some(k => query.includes(k))) {
        reply = item.response;
        break;
      }
    }

    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg ai-msg';
      aiMsg.textContent = reply;
      chatbotMessages.appendChild(aiMsg);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 400);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  if (chatbotInput) {
    chatbotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }


  /* ==========================================================================
     9. ANIMATED STATS COUNTER & SKILL BARS ON SCROLL
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const skillFills = document.querySelectorAll('.skill-progress-fill');

  const observerOptions = { threshold: 0.2 };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / countTo));

        const timer = setInterval(() => {
          count++;
          target.textContent = count + '+';
          if (count >= countTo) clearInterval(timer);
        }, stepTime);

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => statsObserver.observe(num));

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const widthVal = fill.getAttribute('data-width') || fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = widthVal;
        }, 100);
      }
    });
  }, observerOptions);

  skillFills.forEach(fill => {
    const currentWidth = fill.style.width;
    fill.setAttribute('data-width', currentWidth);
    skillsObserver.observe(fill);
  });


  /* ==========================================================================
     10. CUSTOM CURSOR GLOW EFFECT (DESKTOP)
     ========================================================================== */
  if (!isTouchDevice) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }


  /* ==========================================================================
     11. EXPLORER ACHIEVEMENT TOAST & PAGE TRANSITIONS
     ========================================================================== */
  const visitedPages = new Set(['about']);
  const totalPagesCount = 5;
  let achievementUnlocked = localStorage.getItem('usama_explorer_unlocked') === 'true';

  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const pageName = link.innerText.toLowerCase();
      visitedPages.add(pageName);

      if (visitedPages.size >= totalPagesCount && !achievementUnlocked) {
        achievementUnlocked = true;
        localStorage.setItem('usama_explorer_unlocked', 'true');
        showAchievementToast();
      }
    });
  });

  function showAchievementToast() {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">⚡</div>
      <div class="toast-content">
        <h4>Explorer Achievement Unlocked!</h4>
        <p>You've explored the full portfolio of Usama Bin Ali.</p>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 200);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }


  /* ==========================================================================
     12. SCROLL TO TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = `<ion-icon name="arrow-up-outline"></ion-icon>`;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
