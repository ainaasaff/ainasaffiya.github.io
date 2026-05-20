/**
 * Portfolio Interaction Script
 * Features: Typewriter, Particle Canvas, Scroll Spy, Timelines, Gallery Filtering & Lightbox, Form Validation & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
    hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is active
    document.body.style.overflow = !isExpanded ? 'hidden' : 'auto';
  };

  hamburgerMenu.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ==========================================================================
  // SCROLL EFFECTS & SCROLL SPY
  // ==========================================================================
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Add scrolled class to header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy: Highlight active nav link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on load

  // ==========================================================================
  // TYPEWRITER EFFECT
  // ==========================================================================
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    'C# & .NET Development',
    'Responsive Web Design',
    'Cross-Platform Development',
    'Full Stack Systems'
  ];
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const newRoleDelay = 2000;
  let roleIndex = 0;
  let charIndex = 0;

  const type = () => {
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  };

  const erase = () => {
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingSpeed + 500);
    }
  };

  if (typedTextSpan) {
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // INTERACTIVE CANVAS PARTICLES
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let particleCount = window.innerWidth < 768 ? 40 : 90; // Reduced density for mobile
  
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Track mouse coordinates
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Resize listener
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCount = window.innerWidth < 768 ? 40 : 90;
    initParticles();
  });

  // Initialize Canvas Size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle Blueprint
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
      this.density = (Math.random() * 20) + 10;
    }

    draw() {
      ctx.fillStyle = 'rgba(251, 113, 133, 0.4)'; // Soft Rose Pink
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      // Movement boundary collision
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }

      // Check mouse proximity interactivity
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius && mouse.x !== null) {
        // Move away from mouse
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * this.density * 0.6;
        let directionY = forceDirectionY * force * this.density * 0.6;

        this.x -= directionX;
        this.y -= directionY;
      } else {
        // Normal random wander
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }
  }

  const initParticles = () => {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      particlesArray.push(new Particle(x, y));
    }
  };

  const connectParticles = () => {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          opacityValue = 1 - (distance / 110);
          ctx.strokeStyle = `rgba(251, 113, 133, ${opacityValue * 0.15})`; // Secondary Accent Rose Gold lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  };

  initParticles();
  animateParticles();

  // ==========================================================================
  // TIMELINE OBSERVER ANIMATION
  // ==========================================================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add styling logic programmatically if needed
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    timelineObserver.observe(item);
  });

  // ==========================================================================
  // GALLERY FILTERING SYSTEM
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let activeFilteredItems = [...galleryItems]; // To keep track of currently active filter items for lightbox

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      activeFilteredItems = [];

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          item.style.transform = 'scale(0.8)';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          }, 50);
          activeFilteredItems.push(item);
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // ==========================================================================
  // LIGHTBOX MODAL HANDLER
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentImgIndex = 0;

  const openLightbox = (index) => {
    currentImgIndex = index;
    const targetItem = activeFilteredItems[currentImgIndex];
    const imgElement = targetItem.querySelector('img');
    const titleText = targetItem.querySelector('.gallery-item-title').textContent;
    const descText = targetItem.querySelector('.gallery-item-description').textContent;

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxCaption.textContent = `${titleText} — ${descText}`;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    // Restore scroll if mobile menu is not active
    if (!navMenu.classList.contains('active')) {
      document.body.style.overflow = 'auto';
    }
  };

  const navigateLightbox = (direction) => {
    if (activeFilteredItems.length <= 1) return;
    
    let newIndex = currentImgIndex + direction;
    if (newIndex < 0) {
      newIndex = activeFilteredItems.length - 1;
    } else if (newIndex >= activeFilteredItems.length) {
      newIndex = 0;
    }
    
    // Add slide fade out effect in JS
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      openLightbox(newIndex);
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 150);
  };

  // Bind click event to Gallery zoom buttons and image overlay clicks
  galleryItems.forEach(item => {
    const zoomBtn = item.querySelector('.gallery-zoom-btn');
    const overlay = item.querySelector('.gallery-overlay');

    const triggerOpen = (e) => {
      e.stopPropagation();
      const relativeIndex = activeFilteredItems.indexOf(item);
      if (relativeIndex > -1) {
        openLightbox(relativeIndex);
      }
    };

    if (zoomBtn) zoomBtn.addEventListener('click', triggerOpen);
    if (overlay) overlay.addEventListener('click', triggerOpen);
  });

  // Lightbox Close Events
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation Click Events
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ==========================================================================
  // CONTACT FORM VALIDATION & TOAST
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  const toastClose = document.getElementById('toast-close');
  const btnSubmit = document.getElementById('btn-submit');

  const showToast = (title, message, isError = false) => {
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    
    if (isError) {
      toast.classList.add('toast-error');
      toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else {
      toast.classList.remove('toast-error');
      toastIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }

    toast.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(hideToast, 4000);
  };

  const hideToast = () => {
    toast.classList.remove('show');
  };

  toastClose.addEventListener('click', hideToast);

  // Real-time error clearance on input focus or change
  const formFields = contactForm.querySelectorAll('input, textarea');
  formFields.forEach(field => {
    const parent = field.closest('.form-group');
    field.addEventListener('input', () => {
      if (parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
      }
    });
  });

  // Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let hasValidationErrors = false;
    
    const nameField = document.getElementById('contact-name');
    const emailField = document.getElementById('contact-email');
    const subjectField = document.getElementById('contact-subject');
    const messageField = document.getElementById('contact-message');

    // Name Validation
    if (!nameField.value.trim()) {
      nameField.closest('.form-group').classList.add('has-error');
      hasValidationErrors = true;
    }

    // Subject Validation
    if (!subjectField.value.trim()) {
      subjectField.closest('.form-group').classList.add('has-error');
      hasValidationErrors = true;
    }

    // Message Validation
    if (!messageField.value.trim()) {
      messageField.closest('.form-group').classList.add('has-error');
      hasValidationErrors = true;
    }

    // Email Validation (Regex checking)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
      emailField.closest('.form-group').classList.add('has-error');
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      showToast('Validation Error', 'Please fill in all fields correctly.', true);
      return;
    }

    // Real-time contact form integration via FormSubmit.co (No API keys needed!)
    btnSubmit.disabled = true;
    const btnText = btnSubmit.querySelector('span');
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending Message...';
    btnSubmit.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

    const formData = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      _subject: subjectField.value.trim() || 'New Portfolio Message',
      message: messageField.value.trim()
    };

    fetch('https://formsubmit.co/ajax/ainasaffiya1703@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('AJAX request failed');
      }
      return response.json();
    })
    .then(data => {
      if (data.success === "true" || data.success === true) {
        showToast('Message Sent', 'Thank you! Your message has been sent successfully.');
        contactForm.reset();
        btnSubmit.disabled = false;
        btnText.textContent = originalText;
        btnSubmit.querySelector('i').className = 'fa-solid fa-paper-plane';
      } else {
        // Fallback to native form submission
        contactForm.submit();
      }
    })
    .catch(() => {
      // Fallback to native form submission (e.g. if blocked by AdBlock or Brave Shields)
      contactForm.submit();
    });
  });
});
