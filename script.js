// =============================================
// 1. THEME TOGGLE (default: dark mode)
// =============================================
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Apply saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.textContent = 'dark_mode';
} else {
    themeIcon.textContent = 'light_mode';
}

const roles = [
    "Quality Assurance Enthusiast",
    "Software Tester",
    "Bug Hunter",
    "Test Documentation Writer",
    "IT Student @ LSPU"
];

const heroRoleText = document.getElementById('hero-role-text');

if (heroRoleText) {
    let roleIndex = 0;
    let isAnimating = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        heroRoleText.textContent = roles[0];
    } else {
        const updateRole = () => {
            if (isAnimating) return;
            isAnimating = true;
            heroRoleText.classList.add('is-fading');

            window.setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                heroRoleText.textContent = roles[roleIndex];
                heroRoleText.classList.remove('is-fading');
                isAnimating = false;
            }, 260);
        };

        window.setInterval(updateRole, 2600);
    }
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeIcon.textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
    }
});

// =============================================
// 2. SCROLL PROGRESS BAR
// =============================================
const scrollBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
});

// =============================================
// 3. NAVBAR SCROLL SHADOW + ACTIVE LINK
// =============================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    // Shadow on scroll
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    let current = '';
    sections.forEach(sec => {
        const offset = sec.getBoundingClientRect().top;
        if (offset <= 100) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// =============================================
// 4. SCROLL REVEAL (IntersectionObserver)
// =============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Once shown, no need to observe anymore
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

// =============================================
// 5. CURSOR GLOW EFFECT
// =============================================
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// =============================================
// 6. CERTIFICATION CAROUSEL LOOP
// =============================================
const certTrack = document.querySelector('.cert-track');

if (certTrack) {
    const certCards = Array.from(certTrack.children);
    certCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        certTrack.appendChild(clone);
    });
}

// =============================================
// 7. CERTIFICATION CARD TILT EFFECT
// =============================================
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// =============================================
// 8. HERO SUBTITLE
// =============================================
// Intentionally left static (uses the <header><h2> text from index.html).

// =============================================
// 9. SMOOTH NAV LINK CLICK
// =============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            if (section) {
                const scrollTarget = (href === '#projects' || href === '#achievements')
                    ? section.querySelector('.section-header-container') || section
                    : section;
                const navOffset = (navbar ? navbar.offsetHeight : 0) + 16;
                const targetTop = window.pageYOffset + scrollTarget.getBoundingClientRect().top - navOffset;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
        }
    });
});

// =============================================
// 10. PROJECT CARD GLOW ON HOVER
// =============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});

// =============================================
// 11. PROJECT SWITCHER (toggle between cards)
// =============================================
const projectSwitcher = document.querySelector('.project-switcher');
const projectSlides = Array.from(document.querySelectorAll('.project-slide'));
const projectNextButtons = Array.from(document.querySelectorAll('.project-next-btn'));

if (projectSwitcher && projectSlides.length > 1 && projectNextButtons.length) {
    let activeIndex = projectSlides.findIndex(slide => slide.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;

    const switchToNext = () => {
        const currentSlide = projectSlides[activeIndex];
        const nextIndex = (activeIndex + 1) % projectSlides.length;
        const nextSlide = projectSlides[nextIndex];

        projectNextButtons.forEach(btn => (btn.disabled = true));

        currentSlide.classList.add('is-exit-left');
        currentSlide.classList.remove('is-active');

        nextSlide.classList.remove('is-exit-left');
        nextSlide.classList.add('is-active');

        window.setTimeout(() => {
            currentSlide.classList.remove('is-exit-left');
            activeIndex = nextIndex;
            projectNextButtons.forEach(btn => (btn.disabled = false));
        }, 580);
    };

    projectNextButtons.forEach(btn => btn.addEventListener('click', switchToNext));
}

// =============================================
// 12. TOUCH FEEDBACK FOR MOBILE
// =============================================
const touchLikeDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0;

if (touchLikeDevice) {
    const addTouchFeedback = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            let touchTimer = null;

            const clearTouch = () => {
                if (touchTimer) {
                    window.clearTimeout(touchTimer);
                    touchTimer = null;
                }
                el.classList.remove('touch-active');
            };

            el.addEventListener('pointerdown', (event) => {
                if (event.pointerType && event.pointerType !== 'touch' && event.pointerType !== 'pen') {
                    return;
                }
                el.classList.add('touch-active');
            });

            el.addEventListener('pointerup', () => {
                touchTimer = window.setTimeout(clearTouch, 220);
            });

            el.addEventListener('pointercancel', clearTouch);
            el.addEventListener('pointerleave', clearTouch);
            el.addEventListener('blur', clearTouch);
        });
    };

    addTouchFeedback('.skill-card');
    addTouchFeedback('.project-card');
    addTouchFeedback('.project-next-btn');
    addTouchFeedback('.menu-toggle');
    addTouchFeedback('.theme-toggle');
}

// =============================================
// 13. HAMBURGER MENU
// =============================================
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        menuBtn.classList.toggle('open');
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            if (navMenu.classList.contains('open')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuBtn.classList.remove('open');
            const icon = menuBtn.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'menu';
        });
    });
}
