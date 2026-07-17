/* ==========================================================================
   APEX FITNESS GLOBAL JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initScrollEffects();
    initNavbarDrawer();
    initRevealAnimations();
    initInteractiveModals();
    initFormValidations();
    initDashboardMobileSidebar();
    initDashboardUserCredentials();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const percentage = document.querySelector('.preloader-percentage');
    if (!preloader) return;

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2; // Random step
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Allow page scroll
                document.body.style.overflowY = 'auto';
            }, 300);
        }
        if (percentage) percentage.textContent = `${count}%`;
    }, 40);
}

/* ==========================================================================
   2. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Lerp outer ring
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale on hover
    const links = document.querySelectorAll('a, button, input[type="submit"], select, .water-cup-btn, .workout-check-item');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.borderColor = 'var(--accent)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--primary)';
        });
    });
}

/* ==========================================================================
   3. SCROLL PROGRESS & STICKY HEADER
   ========================================================================== */
function initScrollEffects() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        // Scroll progress
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (windowHeight > 0 && progressBar) {
            const scrollPercent = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Sticky header
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        // Back to top visibility
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==========================================================================
   4. NAVIGATION DRAWER (MOBILE HAMBURGER)
   ========================================================================== */
function initNavbarDrawer() {
    const menuToggle = document.querySelector('.menu-toggle');
    const drawerClose = document.querySelector('.drawer-close');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.add('active');
        });
    }

    if (drawerClose && navbar) {
        drawerClose.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    }

    // Close on link click
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
        });
    });
}

/* ==========================================================================
   5. REVEAL ANIMATIONS (INTERSECTION OBSERVER) & COUNTERS
   ========================================================================== */
function initRevealAnimations() {
    // 1. Reveal hidden sections/cards
    const revealElements = document.querySelectorAll('.reveal-element');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(elem => revealObserver.observe(elem));

    // 2. Statistics Counter Increment Tickers
    const counterElements = document.querySelectorAll('.counter-value');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                let current = 0;
                const increment = Math.ceil(target / 40);
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    entry.target.textContent = current.toLocaleString();
                }, 25);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(elem => counterObserver.observe(elem));
}

/* ==========================================================================
   6. CUSTOM DIALOG POPUPS & PASSWORD STRENGTH VALIDATOR
   ========================================================================== */
function initInteractiveModals() {
    // Modals are dynamically instantiated via showCustomAlert
}

function showCustomAlert(message, type = 'error') {
    if (document.querySelector('.custom-alert-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal glass-card';
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    const iconColor = type === 'success' ? '#22c55e' : '#e11d48';
    
    modal.innerHTML = `
        <div class="custom-alert-icon" style="color: ${iconColor}; font-size: 3.5rem; margin-bottom: 1.5rem; text-align: center;">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <p class="custom-alert-message" style="color: var(--text-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; text-align: center;">${message}</p>
        <button class="custom-alert-btn btn btn-primary" style="width: 100px; margin: 0 auto; display: block; padding: 0.6rem 1rem; font-size: 0.85rem; border-radius: var(--radius-full) !important;">OK</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
    }, 10);
    
    const closeBtn = modal.querySelector('.custom-alert-btn');
    const closeAlert = () => {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAlert();
    });
}

// Password validation regex checker (Combination of 8, uppercase, lowercase, digits, symbols)
function checkPasswordStrength(pass) {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSymbol = /[^a-zA-Z\d]/.test(pass);
    const isMinLen = pass.length >= 8;
    return hasUpper && hasLower && hasDigit && hasSymbol && isMinLen;
}

// Global password toggler function
window.togglePasswordVisibility = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
};

/* ==========================================================================
   7. FORM VALDATIONS & PORTAL PROCESSORS
   ========================================================================== */
function initFormValidations() {
    // 1. Name fields - Strips numbers and symbols dynamically
    const nameInputs = document.querySelectorAll('#booking-name, #reg-name, #set-name');
    nameInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });

    // 2. Mobile fields - Strips letters and symbols dynamically
    const phoneInputs = document.querySelectorAll('#booking-phone, #reg-phone');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    // 3. Password input listeners (sets native validation notifications)
    const regPass = document.getElementById('reg-password');
    const loginPass = document.getElementById('login-password');
    const regConfirmPass = document.getElementById('reg-confirm-password');

    if (regPass) {
        regPass.addEventListener('input', () => {
            if (checkPasswordStrength(regPass.value)) {
                regPass.setCustomValidity("");
            } else {
                regPass.setCustomValidity("Password must be at least 8 characters and contain a mix of uppercase, lowercase, digits, and symbols.");
            }
        });
    }

    if (loginPass) {
        loginPass.addEventListener('input', () => {
            if (checkPasswordStrength(loginPass.value)) {
                loginPass.setCustomValidity("");
            } else {
                loginPass.setCustomValidity("Password must be at least 8 characters and contain a mix of uppercase, lowercase, digits, and symbols.");
            }
        });
    }

    if (regConfirmPass && regPass) {
        regConfirmPass.addEventListener('input', () => {
            if (regConfirmPass.value === regPass.value) {
                regConfirmPass.setCustomValidity("");
            } else {
                regConfirmPass.setCustomValidity("Passwords do not match.");
            }
        });
    }

    // 4. Contact Form validation (if present)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('booking-name').value.trim();
            const email = document.getElementById('booking-email').value.trim();
            const phone = document.getElementById('booking-phone').value.trim();
            
            if (name && email && phone) {
                showCustomAlert("Thank you! Your trial session booking has been received.", "success");
                bookingForm.reset();
            }
        });
    }

    // 5. Registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value;
            
            if (name && email && pass && role) {
                if (!checkPasswordStrength(pass)) {
                    showCustomAlert("Password must be at least 8 characters and contain a mix of uppercase, lowercase, digits, and symbols.");
                    return;
                }
                if (regConfirmPass && regConfirmPass.value !== pass) {
                    showCustomAlert("Passwords do not match.");
                    return;
                }
                
                localStorage.setItem('loggedInUserName', name);
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem('loggedInUserRole', role);
                
                // Render Inline Success Panel (Screenshot 2)
                const cardSide = document.querySelector('.login-form-side');
                if (cardSide) {
                    cardSide.innerHTML = `
                        <div class="registration-success-content" style="text-align: center; padding: 2rem 0;">
                            <div style="font-size: 4.5rem; color: #22c55e; margin-bottom: 1.5rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h2 style="font-size: 1.8rem; font-weight: 700; color: var(--text-light); margin-bottom: 1rem; text-transform: none;">Registration Complete</h2>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">Your profile has been created. Redirecting to Login...</p>
                            <a href="login.html" class="btn btn-primary" style="border-radius: var(--radius-full) !important; padding: 0.8rem 2rem; background: #0b0f19; border: 1px solid rgba(255,255,255,0.08);">Proceed to Login</a>
                        </div>
                    `;
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2200);
                }
            }
        });
    }

    // 6. Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;
            
            if (email && pass && role) {
                if (!checkPasswordStrength(pass)) {
                    showCustomAlert("Password must be at least 8 characters and contain a mix of uppercase, lowercase, digits, and symbols.");
                    return;
                }
                
                let name = localStorage.getItem('loggedInUserName');
                if (!name) {
                    const namePart = email.split('@')[0];
                    name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    localStorage.setItem('loggedInUserName', name);
                }
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem('loggedInUserRole', role);

                // Render Inline Success Panel (Screenshot 4)
                const cardSide = document.querySelector('.login-form-side');
                if (cardSide) {
                    cardSide.innerHTML = `
                        <div class="login-success-content" style="text-align: center; padding: 2rem 0;">
                            <div style="font-size: 4.5rem; color: #22c55e; margin-bottom: 1.5rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h2 style="font-size: 1.8rem; font-weight: 700; color: var(--text-light); margin-bottom: 1rem; text-transform: none;">Authentication Approved</h2>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">Redirecting to your Aurelia Design portal...</p>
                            <a href="studio-portal.html" class="btn btn-primary" style="border-radius: var(--radius-full) !important; padding: 0.8rem 2rem; background: #0b0f19; border: 1px solid rgba(255,255,255,0.08);">Go to Dashboard</a>
                        </div>
                    `;
                    setTimeout(() => {
                        window.location.href = 'studio-portal.html';
                    }, 2200);
                }
            }
        });
    }

    // 7. Forgot password submission
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            if (email) {
                showCustomAlert("Success! A password recovery link has been dispatched to your email address.", "success");
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            }
        });
    }
}

/* ==========================================================================
   8. PORTAL SIDEBARS & USER CREDENTIALS CONTROLLERS
   ========================================================================== */
function initDashboardMobileSidebar() {
    const topNav = document.querySelector('.db-top-nav');
    const sidebar = document.querySelector('.db-sidebar');
    const overlay = document.querySelector('.db-sidebar-overlay');

    if (topNav && sidebar) {
        let hamburger = topNav.querySelector('.db-hamburger');
        if (!hamburger) {
            hamburger = document.createElement('button');
            hamburger.className = 'db-hamburger';
            hamburger.setAttribute('aria-label', 'Toggle Menu');
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            topNav.insertBefore(hamburger, topNav.firstChild);
        }

        hamburger.addEventListener('click', () => {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.documentElement.classList.add('menu-open');
            document.body.classList.add('menu-open');
        });
    }

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
    };

    if (overlay) overlay.addEventListener('click', closeSidebar);
    
    const closeBtn = document.querySelector('.db-sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Sidebar sign out button functionality
    const logoutBtn = document.getElementById('dashboard-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUserName');
            localStorage.removeItem('loggedInUserEmail');
            localStorage.removeItem('loggedInUserRole');
            showCustomAlert("You have signed out successfully.", "success");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

function initDashboardUserCredentials() {
    const userNameElements = document.querySelectorAll('.user-name');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    
    const storedName = localStorage.getItem('loggedInUserName') || "Elite Athlete";
    const storedEmail = localStorage.getItem('loggedInUserEmail');
    
    userNameElements.forEach(elem => {
        if (elem.tagName === 'INPUT') {
            elem.value = storedName;
        } else {
            elem.textContent = storedName;
        }
    });
    
    // Generate user initials for avatar block
    let initials = '';
    const nameParts = storedName.split(' ');
    if (nameParts[0]) initials += nameParts[0].charAt(0);
    if (nameParts.length > 1 && nameParts[1]) initials += nameParts[1].charAt(0);
    initials = initials.toUpperCase();
    if (!initials) initials = "EA";
    
    userAvatarElements.forEach(elem => {
        if (elem.tagName !== 'IMG') {
            elem.textContent = initials;
        }
    });
}
