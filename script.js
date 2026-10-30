document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const progress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    // AOS is optional. If its CDN is unavailable, keep every section visible.
    if (window.AOS) {
        AOS.init({ once: true, duration: 700, offset: 70 });
    } else {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    let savedTheme = null;
    try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { }

    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const setTheme = theme => {
        root.dataset.theme = theme;

        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    setTheme(savedTheme || preferredTheme);

    themeToggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';

        setTheme(next);

        try {
            localStorage.setItem('portfolio-theme', next);
        } catch (_) { }
    });

    hamburger?.addEventListener('click', () => {
        const open = navLinks?.classList.toggle('open');

        hamburger.classList.toggle('active', Boolean(open));
        hamburger.setAttribute('aria-expanded', String(Boolean(open)));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks?.classList.remove('open');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
        });
    });

    const onScroll = () => {
        const y = window.scrollY;

        navbar?.classList.toggle('scrolled', y > 40);
        backToTop?.classList.toggle('visible', y > 500);

        const max = document.documentElement.scrollHeight - window.innerHeight;

        if (progress) {
            progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
        }

        let current = 'home';

        document.querySelectorAll('section[id]').forEach(section => {
            if (y >= section.offsetTop - 160) {
                current = section.id;
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    onScroll();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ── TYPING ANIMATION ─────────────────────────────────── */

    const typed = document.getElementById('typed-text');

    const roles = [
        'Channel Associate',
        'Administrative Assistant',
        'UI/UX Designer',
        'Quality Assurance Tester',
        'Project Manager',
        'Business Analyst',
        'Web Developer'
    ];

    let role = 0;
    let letter = 0;
    let deleting = false;

    const type = () => {
        if (!typed) return;

        const value = roles[role];

        letter += deleting ? -1 : 1;

        typed.textContent = value.slice(0, letter);

        let delay = deleting ? 55 : 95;

        if (!deleting && letter === value.length) {
            deleting = true;
            delay = 1400;
        }

        if (deleting && letter === 0) {
            deleting = false;
            role = (role + 1) % roles.length;
            delay = 300;
        }

        window.setTimeout(type, delay);
    };

    type();

    /* ── SKILL BAR ANIMATION ─────────────────────────────── */

    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.getAttribute('data-width');

                        bar.style.width = `${width}%`;

                        observer.unobserve(bar);
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    } else {
        skillBars.forEach(bar => {
            bar.style.width = `${bar.getAttribute('data-width')}%`;
        });
    }

    /* ── FOOTER YEAR ─────────────────────────────────────── */

    const footerYear = document.getElementById('footer-year');

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    /* ── PROJECT FILTER ──────────────────────────────────── */

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            button.classList.add('active');

            const filter = button.dataset.filter || 'all';

            document.querySelectorAll('.project-card').forEach(card => {
                const category = card.dataset.category || '';

                card.style.display =
                    filter === 'all' || category.split(' ').includes(filter)
                        ? ''
                        : 'none';
            });
        });
    });

    /* ── CONTACT FORM: EMAILJS ───────────────────────────── */

    const SERVICE_ID = 'service_0516';
    const TEMPLATE_ID = 'template_660ns12';
    const PUBLIC_KEY = 'Uk1G_2Stfdw1T0Vd1';

    const form = document.getElementById('contact-form');

    if (form) {
        const submitButton = document.getElementById('submit-btn');

        const submitText = submitButton?.querySelector('.submit-text');

        const submitLoading = submitButton?.querySelector('.submit-loading');

        const successMessage = document.getElementById('form-success');

        // Create an error message without modifying the HTML.
        let errorMessage = document.getElementById('form-error');

        if (!errorMessage) {
            errorMessage = document.createElement('div');

            errorMessage.id = 'form-error';
            errorMessage.className = 'form-error-message';

            errorMessage.setAttribute('role', 'alert');

            errorMessage.style.cssText = `
                display: none;
                margin-top: 12px;
                color: #dc2626;
                font-size: 0.875rem;
                text-align: center;
            `;

            form.appendChild(errorMessage);
        }

        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Validate required form fields.
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Prevent duplicate submissions.
            if (submitButton?.disabled) {
                return;
            }

            // Hide previous feedback messages.
            if (successMessage) {
                successMessage.style.display = 'none';
            }

            errorMessage.style.display = 'none';
            errorMessage.textContent = '';

            // Disable the submit button while sending.
            if (submitButton) {
                submitButton.disabled = true;
            }

            // Hide the original button text.
            if (submitText) {
                submitText.style.display = 'none';
            }

            // Display the loading animation.
            if (submitLoading) {
                submitLoading.style.display = 'inline-flex';
            }

            try {
                // Check whether EmailJS loaded correctly.
                if (!window.emailjs?.sendForm) {
                    throw new Error('EmailJS SDK did not load.');
                }

                // Send the message using EmailJS.
                const response = await window.emailjs.sendForm(
                    SERVICE_ID,
                    TEMPLATE_ID,
                    form,
                    {
                        publicKey: PUBLIC_KEY
                    }
                );

                console.log(
                    'Email sent successfully:',
                    response.status,
                    response.text
                );

                // Display success feedback.
                if (successMessage) {
                    successMessage.style.display = 'flex';
                }

                // Clear the form after successful submission.
                form.reset();

            } catch (error) {
                console.error('EmailJS error:', error);

                // Display an error message.
                errorMessage.textContent =
                    'Message could not be sent. Please try again.';

                errorMessage.style.display = 'block';

            } finally {
                // Re-enable the submit button.
                if (submitButton) {
                    submitButton.disabled = false;
                }

                // Restore the button text.
                if (submitText) {
                    submitText.style.display = '';
                }

                // Hide the loading animation.
                if (submitLoading) {
                    submitLoading.style.display = 'none';
                }
            }
        });
    }
});

/* ── PAGE LOADER ─────────────────────────────────────────── */

// Hide the loader after the page finishes loading,
// with a fallback so it cannot stay stuck.

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    if (!loader) return;

    const hideLoader = () => {
        loader.classList.add('hidden');
    };

    // Hide after the page and its resources finish loading.
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader, { once: true });
    }

    // Fallback in case a resource prevents the load event from firing.
    setTimeout(hideLoader, 5000);
});