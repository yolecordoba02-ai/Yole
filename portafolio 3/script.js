/* ============================================================
   YOLE — Portfolio JavaScript
   Animations, scroll effects, filtering, and interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ── Elements ──
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const revealElements = document.querySelectorAll('.reveal-up');
    const sections = document.querySelectorAll('section[id]');

    // ── Mobile Navigation ──
    let overlay = null;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMenu);
    }
    createOverlay();

    function openMenu() {
        navToggle.classList.add('is-active');
        navLinks.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navToggle.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on link click
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // ── Navbar Scroll Effect ──
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
    }

    // ── Active Section Tracking ──
    function updateActiveNav() {
        const scrollY = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ── Scroll Reveal (Intersection Observer) ──
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Don't unobserve — keeps it clean
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        }
    );

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ── Portfolio Filtering ──
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('is-hidden');
                    card.classList.add('is-filtering');
                    card.style.animationDelay = `${index * 0.08}s`;

                    // Clean up animation class
                    card.addEventListener('animationend', () => {
                        card.classList.remove('is-filtering');
                    }, { once: true });
                } else {
                    card.classList.add('is-hidden');
                    card.classList.remove('is-filtering');
                }
            });
        });
    });

    // ── Contact Form ──
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = `
        <span>¡Mensaje enviado!</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
            btn.style.background = '#10B981';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.pointerEvents = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Typed/Counter Animation for Hero ──
    function animateHero() {
        const heroElements = document.querySelectorAll('.hero .reveal-up');
        heroElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // Trigger hero animation after small delay
    setTimeout(animateHero, 300);

    // ── Parallax Effect on Hero Shapes ──
    const heroShapes = document.querySelectorAll('.hero-shape');
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        heroShapes.forEach((shape, i) => {
            const speed = (i + 1) * 0.05;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });

        ticking = false;
    }

    // ── Throttled Scroll Handler ──
    function onScroll() {
        handleNavScroll();
        updateActiveNav();

        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Magnetic Button Effect ──
    const buttons = document.querySelectorAll('.btn--primary, .project-cta');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ── Cursor Dot (Desktop Only) ──
    if (window.matchMedia('(hover: hover)').matches) {
        const cursorDot = document.createElement('div');
        cursorDot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: var(--accent-violet);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.15s ease-out, opacity 0.3s;
      opacity: 0;
    `;
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX - 4 + 'px';
            cursorDot.style.top = e.clientY - 4 + 'px';
            cursorDot.style.opacity = '1';
        });

        // Enlarge on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(4)';
                cursorDot.style.opacity = '0.5';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorDot.style.opacity = '1';
            });
        });
    }

    // ── Skill Chips Stagger Animation ──
    const skillChips = document.querySelectorAll('.skill-chip');
    const skillsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chips = entry.target.querySelectorAll('.skill-chip');
                    chips.forEach((chip, i) => {
                        chip.style.opacity = '0';
                        chip.style.transform = 'translateY(10px) scale(0.95)';
                        chip.style.transition = `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`;

                        requestAnimationFrame(() => {
                            chip.style.opacity = '1';
                            chip.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillsObserver.observe(skillsGrid);
    }

    // ── Service Cards Counter/Stagger ──
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        card.style.setProperty('--delay', `${i * 0.1}s`);
    });

    // ── Page Load ──
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
