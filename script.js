/* ==============================================================
   SHAMIL PORTFOLIO - SCRIPT.JS
   Features: Navbar, Typing, Scroll Animations, Particles,
             Progress Bars, Project Filter, Form, Back-to-top
============================================================== */

(function () {
    'use strict';

    /* ======================================
       IMMEDIATELY REVEAL HERO ELEMENTS
       (They're in the viewport on load)
    ====================================== */
    document.querySelectorAll('.hero .reveal-left, .hero .reveal-right, .hero .reveal-up').forEach(el => {
        el.classList.add('in-view');
    });

    /* ======================================
       SCROLL PROGRESS BAR
    ====================================== */
    const scrollProgress = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    }

    /* ======================================
       NAVBAR: STICKY + ACTIVE LINKS
    ====================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        updateScrollProgress();

        // Sticky glass effect
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let currentId = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 150) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });

        // Back to top visibility
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ======================================
       MOBILE DRAWER
    ====================================== */
    const hamburger = document.getElementById('nav-hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    /* ======================================
       TYPING EFFECT
    ====================================== */
    const typingEl = document.querySelector('.typing-text');
    const words = [
        'Python Developer',
        'AI/ML Engineer',
        'AI Mentor',
        'Data Analyst'
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function runTyping() {
        if (!typingEl) return;

        const word = words[wordIdx];

        if (isDeleting) {
            typingEl.textContent = word.slice(0, --charIdx);
        } else {
            typingEl.textContent = word.slice(0, ++charIdx);
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIdx === word.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            delay = 400;
        }

        setTimeout(runTyping, delay);
    }

    setTimeout(runTyping, 1200);

    /* ======================================
       INTERSECTION OBSERVER — SCROLL REVEAL
    ====================================== */
    const revealTargets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(el => revealObserver.observe(el));



    /* ======================================
       PROJECT FILTER TABS
    ====================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;

                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (show) {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.display = '';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (btn.getAttribute('data-filter') !== 'all' &&
                            card.getAttribute('data-category') !== btn.getAttribute('data-filter')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    /* ======================================
       CONTACT FORM - GOOGLE SHEETS INTEGRATION
    ====================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');

    // IMPORTANT: Replace with your actual Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwa1k78npxtsstPWoEyjkr-mdl4RYANgpXa-XLAgbdOq_KJ6tUtx5rHsboiASwWXiZO/exec';

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            const btnSpan = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            const origText = btnSpan.textContent;

            // Loading state
            submitBtn.disabled = true;
            btnSpan.textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';

            // Prepare non-JSON form data (standard for Apps Script)
            const formData = new FormData(contactForm);

            // Fetch to Google Apps Script
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        // Success state
                        btnSpan.textContent = 'Message Sent!';
                        btnIcon.className = 'fas fa-check';
                        submitBtn.style.background = 'var(--accent)'; // Keep design consistent
                        submitBtn.style.opacity = '0.7';

                        contactForm.reset();

                        setTimeout(() => {
                            btnSpan.textContent = origText;
                            btnIcon.className = 'fas fa-paper-plane';
                            submitBtn.style.opacity = '';
                            submitBtn.disabled = false;
                        }, 4000);
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btnSpan.textContent = 'Error!';
                    btnIcon.className = 'fas fa-exclamation-triangle';

                    setTimeout(() => {
                        btnSpan.textContent = origText;
                        btnIcon.className = 'fas fa-paper-plane';
                        submitBtn.disabled = false;
                    }, 4000);
                });
        });
    }

    /* ======================================
       BACK TO TOP
    ====================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ======================================
       PARTICLES CANVAS
    ====================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        Particle.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(179, 207, 229, ${this.alpha})`;
            ctx.fill();
        };

        function initParticles(count) {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(74, 127, 167, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animId = requestAnimationFrame(animate);
        }

        resizeCanvas();
        initParticles(80);
        animate();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(80);
        });
    }

    /* ======================================
       STAGGERED REVEAL DELAYS
    ====================================== */
    // Skill cards
    document.querySelectorAll('.skill-cat-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    // Tech tags
    document.querySelectorAll('.tech-tag').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.04}s`;
    });

    // Service cards
    document.querySelectorAll('.service-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    // Project cards
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.12}s`;
    });

    /* ======================================
       SMOOTH HOVER: NAV LOGO TILT
    ====================================== */
    document.querySelectorAll('.nav-logo').forEach(logo => {
        logo.addEventListener('mousemove', e => {
            const rect = logo.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            logo.style.transform = `perspective(300px) rotateX(${-y}deg) rotateY(${x}deg)`;
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = '';
        });
    });

    /* ======================================
       CUSTOM CURSOR
    ====================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        window.addEventListener('mousemove', e => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorRing.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        document.querySelectorAll('a, button, input, textarea, select, .nav-logo, .social-icon-btn, .filter-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    /* ======================================
       INITIAL CALL
    ====================================== */
    onScroll();

})();
