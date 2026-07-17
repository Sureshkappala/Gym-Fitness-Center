/* ==========================================================================
   APEX FITNESS - INTERACTIVE ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initCustomCursor();
    initNavbar();
    initScrollProgress();
    initCountersAndRadialBars();
    initTestimonialSlider();
    initPortfolioFilter();
    initForms();
    initGlowEffects();
    initBackToTop();
    initHeroConsole();
    initDashboard();
    init404Game();
    initFormInputsValidation()
    initDashboardMobileSidebar();
    initDashboardUserCredentials();
    initGymDashboard();
;
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    document.body.style.overflowY = 'hidden';

    // Simulate percentage load
    const percentageText = document.querySelector('.preloader-percentage');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.style.overflowY = 'auto';
            }, 300);
        }
        if (percentageText) {
            percentageText.textContent = `${progress}%`;
        }
    }, 80);

    // Fallback security
    setTimeout(() => {
        clearInterval(interval);
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto';
        }
    }, 3000);
}

/* ==========================================================================
   2. THEME SWITCHER (DARK/LIGHT MODE) WITH HIGH COLOR CONTRAST
   ========================================================================== */
function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-switch');
    if (themeToggles.length === 0) return;

    const currentTheme = localStorage.getItem('theme');
    
    // Default to dark theme, override if light stored
    if (currentTheme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            const theme = document.body.classList.contains('light') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
        });
    });
}

/* ==========================================================================
   3. CUSTOM CURSOR (LERP POINTER DYNAMICS)
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    // Hide custom cursor on mobile touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    // Show on desktops
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';

    let mouseX = 0, mouseY = 0;     // Target coords
    let cursorX = 0, cursorY = 0;   // Lerp coords
    const speed = 0.15;             // Lerp factor

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Lerp loop for organic drag animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover scales
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .card-hover, .class-card, .lookbook-item, .pricing-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

/* ==========================================================================
   4. STICKY NAVBAR & RESPONSIVE MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const drawerClose = document.querySelector('.drawer-close');
    const navbar = document.querySelector('.navbar');

    if (!header) return;

    // Header stickiness on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveNavLink();
    });

    // Mobile Drawer Open
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.add('active');
        });
    }

    // Mobile Drawer Close
    if (drawerClose && navbar) {
        drawerClose.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    }

    // Close drawer when link clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
        });
    });

    // Highlight active link matching current filename
    function highlightActiveNavLink() {
        const currentPath = window.location.pathname;
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === filename) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    highlightActiveNavLink();
}

/* ==========================================================================
   5. SCROLL PROGRESS
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

/* ==========================================================================
   6. DYNAMIC COUNTERS & CIRCULAR PROGRESS RINGS ON SCROLL
   ========================================================================== */
function initCountersAndRadialBars() {
    const counters = document.querySelectorAll('.counter-number');
    const radialBars = document.querySelectorAll('.radial-progress-ring');
    
    if (counters.length === 0 && radialBars.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.classList.contains('counter-number')) {
                    animateCounter(target);
                } else if (target.classList.contains('radial-progress-ring')) {
                    animateRadialBar(target);
                }
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(c => countObserver.observe(c));
    radialBars.forEach(r => countObserver.observe(r));

    // Number tick animation
    function animateCounter(elem) {
        const targetValue = parseInt(elem.getAttribute('data-target'), 10) || 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quadratic
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * targetValue);
            
            elem.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                elem.textContent = targetValue.toLocaleString() + (elem.getAttribute('data-suffix') || '');
            }
        }
        requestAnimationFrame(updateCount);
    }

    // Radial ring animation (updating stroke-dashoffset)
    function animateRadialBar(ring) {
        const circle = ring.querySelector('.progress-circle-fill');
        if (!circle) return;

        const percent = parseInt(ring.getAttribute('data-percentage'), 10) || 0;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        // Force reflow
        circle.getBoundingClientRect();

        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

/* ==========================================================================
   7. TESTIMONIAL SLIDER CAROUSEL
   ========================================================================== */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        
        currentIndex = (index + slides.length) % slides.length;
        
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // Scroll alignment logic inside the slider flexbox container
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });
    }

    // Autoplay cycling
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();
}

/* ==========================================================================
   8. PORTFOLIO & CLASS GRID FILTRATION
   ========================================================================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.filter-item');

    if (filterButtons.length === 0 || items.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            items.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                
                // Hide with transform animation
                if (category === 'all' || itemCat === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   9. FORMS: VALIDATION, NEWSLETTER, ASSESSMENTS
   ========================================================================== */
function initForms() {
    const forms = document.querySelectorAll('form:not(#login-form):not(#register-form)');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic client-side validation
            let isValid = true;
            const requiredInputs = form.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    highlightInputError(input);
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    highlightInputError(input);
                } else {
                    clearInputError(input);
                }
            });

            if (isValid) {
                showFormSuccessDialog(form);
            }
        });
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function highlightInputError(input) {
        input.style.borderColor = 'var(--accent)';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    function clearInputError(input) {
        input.style.borderColor = 'var(--border-glass)';
    }

    function showFormSuccessDialog(form) {
        const originalContent = form.innerHTML;
        form.innerHTML = `
            <div class="form-success-alert" style="text-align: center; padding: 2rem 0; animation: scaleUp 0.4s ease forwards;">
                <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: var(--primary); margin-bottom: 1.5rem; display: block; filter: drop-shadow(0 0 10px var(--primary));"></i>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.6rem; text-transform: uppercase;">Submission Successful!</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Thank you! Our Apex team will contact you shortly.</p>
                <button class="btn btn-secondary btn-sm reset-form-btn">Back to Form</button>
            </div>
        `;

        const resetBtn = form.querySelector('.reset-form-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                form.innerHTML = originalContent;
                initForms(); // Reinitialize
            });
        }
    }
}

/* ==========================================================================
   10. GLOW EFFECTS (CARD RADIAL LIGHT TRACKER)
   ========================================================================== */
function initGlowEffects() {
    const cards = document.querySelectorAll('.hover-glow-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   11. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   12. HERO COMMAND CONSOLE INTERACTIVE BEHAVIORS
   ========================================================================== */
function initHeroConsole() {
    // 1. Live Heart Rate Graph
    const hrPath = document.getElementById('hr-chart-path');
    const hrText = document.getElementById('console-hr-value');
    if (hrPath && hrText) {
        let hrBase = 75;
        let points = [];
        const maxPoints = 35;
        const width = 200;
        const height = 60;

        // Initialize points
        for (let i = 0; i < maxPoints; i++) {
            points.push({ x: (i / (maxPoints - 1)) * width, y: height / 2 });
        }

        let time = 0;
        function updateHeartRate() {
            time += 0.25;
            
            // Fluctuating pulse
            let rateDelta = Math.sin(time * 0.5) * 8 + Math.cos(time * 0.2) * 5;
            let currentHR = Math.round(hrBase + rateDelta + (Math.random() * 2));
            hrText.textContent = currentHR;
            
            // Heartbeat shape spike logic
            let isBeat = Math.round(time * 10) % 8 === 0;
            let spike = 0;
            if (isBeat) {
                spike = (Math.random() > 0.5 ? -25 : 20);
            }
            
            // Shift points left
            for (let i = 0; i < maxPoints - 1; i++) {
                points[i].y = points[i+1].y;
            }
            // Add new point at right
            points[maxPoints - 1].y = (height / 2) + spike + (Math.sin(time) * 3);

            // Construct SVG Path string
            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < maxPoints; i++) {
                d += ` L ${points[i].x} ${points[i].y}`;
            }
            hrPath.setAttribute('d', d);

            setTimeout(updateHeartRate, 150);
        }
        updateHeartRate();
        
        // Console target calorie selector click logic
        const activitySelect = document.getElementById('console-activity');
        const estCalories = document.getElementById('console-est-calories');
        if (activitySelect && estCalories) {
            activitySelect.addEventListener('change', () => {
                const activity = activitySelect.value;
                let cals = 350;
                let hrT = 75;
                if (activity === 'cardio') { cals = 650; hrT = 135; }
                else if (activity === 'strength') { cals = 450; hrT = 110; }
                else if (activity === 'yoga') { cals = 220; hrT = 90; }
                else if (activity === 'combat') { cals = 780; hrT = 145; }
                
                hrBase = hrT;
                estCalories.textContent = cals;
            });
        }
    }

    // 2. Calorie Burn Ticker
    const calTicker = document.getElementById('console-calories-burn');
    if (calTicker) {
        let burned = 385;
        setInterval(() => {
            burned += Math.floor(Math.random() * 3) + 1;
            calTicker.textContent = burned;
        }, 1800);
    }

    // 3. Barbell Weight Selection
    const plates = document.querySelectorAll('.console-weight-plate');
    const targetWeightText = document.getElementById('console-weight-value');
    const musclesText = document.getElementById('console-target-muscles');
    const barbellVisual = document.querySelector('.barbell-graphic-plates');

    if (plates.length > 0 && targetWeightText && musclesText) {
        plates.forEach(plate => {
            plate.addEventListener('change', updateBarbellWeight);
        });

        function updateBarbellWeight() {
            let baseWeight = 45; // barbell bar weight
            let activeMuscles = [];
            let visualHTML = '';

            plates.forEach(plate => {
                if (plate.checked) {
                    const weight = parseInt(plate.getAttribute('data-weight'), 10);
                    baseWeight += (weight * 2); // plate on both sides
                    
                    const muscles = plate.getAttribute('data-muscles').split(',');
                    activeMuscles = activeMuscles.concat(muscles);

                    // Add plates HTML
                    const sizeClass = weight >= 45 ? 'lg' : (weight >= 25 ? 'md' : 'sm');
                    visualHTML += `<span class="weight-visual-plate ${sizeClass}" data-weight="${weight}"></span>`;
                }
            });

            // Update DOM text
            targetWeightText.textContent = `${baseWeight} lbs`;
            
            // Clean active muscles list
            const uniqueMuscles = [...new Set(activeMuscles)];
            musclesText.textContent = uniqueMuscles.length > 0 ? uniqueMuscles.join(', ') : 'None';

            // Update barbell plates graphic
            if (barbellVisual) {
                barbellVisual.innerHTML = visualHTML;
            }
        }
        updateBarbellWeight();
    }

    // 4. Daily Goals Check-in logger
    const logBtn = document.getElementById('console-log-workout-btn');
    const goalCircle = document.getElementById('console-goal-circle');
    const goalValueText = document.getElementById('console-goal-percent');

    if (logBtn && goalCircle && goalValueText) {
        let loggedPercentage = 25;
        
        logBtn.addEventListener('click', () => {
            if (loggedPercentage >= 100) {
                alert('Daily goal already completed! Keep up the apex work!');
                return;
            }
            loggedPercentage += 25;
            goalValueText.textContent = `${loggedPercentage}%`;

            // Circle dash offset animation
            const circle = goalCircle.querySelector('.progress-circle-fill');
            if (circle) {
                const radius = circle.r.baseVal.value;
                const circ = 2 * Math.PI * radius;
                const offset = circ - (loggedPercentage / 100) * circ;
                circle.style.strokeDashoffset = offset;
            }
            
            // Highlight button
            logBtn.classList.add('btn-accent');
            setTimeout(() => logBtn.classList.remove('btn-accent'), 800);
        });
    }
}

/* ==========================================================================
   13. MEMBER LOGIN PORTAL & CLIENT REGISTER
   ========================================================================== */
function initDashboard() {
    // Check if we are on the login page
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formToggleRegister = document.getElementById('toggle-to-register');
    const formToggleLogin = document.getElementById('toggle-to-login');
    const loginWrapper = document.querySelector('.login-card-inner');

    if (formToggleRegister && loginWrapper) {
        formToggleRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginWrapper.classList.add('show-register');
        });
    }

    if (formToggleLogin && loginWrapper) {
        formToggleLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginWrapper.classList.remove('show-register');
        });
    }

    // Handle Register Submit
    if (registerForm) {
        const regPass = document.getElementById('reg-password');
        const regConfirmPass = document.getElementById('reg-confirm-password');

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
                localStorage.setItem('workoutStreak', '1');
                
                // Show dynamic card success screen like in Screenshot 2
                const cardSide = document.querySelector('.login-form-side');
                if (cardSide) {
                    cardSide.innerHTML = `
                        <div class="registration-success-content" style="text-align: center; padding: 2rem 0;">
                            <div style="font-size: 4.5rem; color: #10b981; margin-bottom: 1.5rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h2 style="font-size: 1.8rem; font-weight: 700; color: var(--text-light); margin-bottom: 1rem; text-transform: none;">Registration Complete</h2>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">Your design profile has been created. Redirecting to Login...</p>
                            <a href="login.html" class="btn btn-primary" style="border-radius: var(--radius-full) !important; padding: 0.8rem 2rem; background: #0b0f19; border: 1px solid rgba(255,255,255,0.08);">Proceed to Login</a>
                        </div>
                    `;
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2500);
                }
            }
        });
    }

    // Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            
            if (email && pass) {
                // Mock success login
                const cachedEmail = localStorage.getItem('loggedInUserEmail');
                const cachedName = localStorage.getItem('loggedInUserName');
                
                if (cachedEmail && cachedEmail === email) {
                    // Success cached login
                    alert(`Welcome back, ${cachedName}!`);
                } else {
                    // Initialize generic mock user
                    localStorage.setItem('loggedInUserName', 'Apex Athlete');
                    localStorage.setItem('loggedInUserEmail', email);
                }
                
                window.location.href = 'studio-portal.html';
            }
        });
    }

    // Check if we are on the portal dashboard page
    const dashboardContainer = document.getElementById('portal-dashboard');
    if (dashboardContainer) {
        // Load settings
        const uName = localStorage.getItem('loggedInUserName') || 'Apex Athlete';
        const uEmail = localStorage.getItem('loggedInUserEmail') || 'athlete@apexfitness.com';
        
        // Populate profile info
        const nameFields = document.querySelectorAll('.dashboard-user-name');
        nameFields.forEach(f => f.textContent = uName);
        
        const emailFields = document.querySelectorAll('.dashboard-user-email');
        emailFields.forEach(f => f.textContent = uEmail);

        // Edit Profile settings
        const settingsForm = document.getElementById('dashboard-settings-form');
        if (settingsForm) {
            const inputName = document.getElementById('set-name');
            const inputEmail = document.getElementById('set-email');
            
            if (inputName) inputName.value = uName;
            if (inputEmail) inputEmail.value = uEmail;

            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = inputName.value.trim();
                const newEmail = inputEmail.value.trim();
                
                if (newName && newEmail) {
                    localStorage.setItem('loggedInUserName', newName);
                    localStorage.setItem('loggedInUserEmail', newEmail);
                    
                    // Update display
                    nameFields.forEach(f => f.textContent = newName);
                    emailFields.forEach(f => f.textContent = newEmail);
                    
                    alert('Profile settings saved successfully!');
                }
            });
        }

        // Daily water tracking logger
        const logWaterBtn = document.getElementById('log-water-btn');
        const waterProgress = document.getElementById('water-progress-fill');
        const waterText = document.getElementById('water-count');
        if (logWaterBtn && waterProgress && waterText) {
            let currentOunces = 32;
            const targetOunces = 120;
            
            logWaterBtn.addEventListener('click', () => {
                currentOunces += 16;
                if (currentOunces > targetOunces) {
                    currentOunces = targetOunces;
                    alert('Water intake goal achieved!');
                }
                
                const percentage = (currentOunces / targetOunces) * 100;
                waterProgress.style.height = `${percentage}%`;
                waterText.textContent = `${currentOunces} oz / ${targetOunces} oz`;
            });
        }

        // Workout streak checker click logic
        const streakDays = document.querySelectorAll('.dashboard-streak-day');
        const streakCountText = document.getElementById('streak-count-val');
        if (streakDays.length > 0 && streakCountText) {
            let streakCount = parseInt(localStorage.getItem('workoutStreak') || '1', 10);
            streakCountText.textContent = streakCount;

            streakDays.forEach(day => {
                day.addEventListener('click', () => {
                    if (!day.classList.contains('completed')) {
                        day.classList.add('completed');
                        day.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                        
                        // Increase streak
                        streakCount += 1;
                        streakCountText.textContent = streakCount;
                        localStorage.setItem('workoutStreak', streakCount.toString());
                    }
                });
            });
        }

        // Handle Logout
        const logoutBtn = document.getElementById('dashboard-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('loggedInUserName');
                localStorage.removeItem('loggedInUserEmail');
                window.location.href = 'login.html';
            });
        }
    }
}

/* ==========================================================================
   14. 404 DEAD LIFT MINI-GAME ENGINE
   ========================================================================== */
function init404Game() {
    const gameBtn = document.getElementById('game-lift-btn');
    const barbell = document.getElementById('game-barbell');
    const statusText = document.getElementById('game-status-text');
    const backBtn = document.getElementById('game-home-btn');

    if (!gameBtn || !barbell) return;

    let height = 0;
    let unlocked = false;

    gameBtn.addEventListener('click', () => {
        if (unlocked) return;

        height += 18; // Lift
        if (height > 180) {
            height = 180;
            unlocked = true;
            statusText.innerHTML = 'BARBELL LIFTED! PATH CLEARED! <i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>';
            gameBtn.style.display = 'none';
            if (backBtn) {
                backBtn.classList.remove('btn-secondary');
                backBtn.classList.add('btn-primary');
                backBtn.style.animation = 'pulse 1.5s infinite';
            }
        }
        
        // Translate barbell up
        barbell.style.transform = `translateY(-${height}px) rotate(${height * 0.05}deg)`;
        
        // Mini vibration shake on lift click
        gameBtn.classList.add('shake');
        setTimeout(() => gameBtn.classList.remove('shake'), 150);
    });

    // Barbell slow gravity drops if idle
    setInterval(() => {
        if (unlocked || height === 0) return;
        height -= 5;
        if (height < 0) height = 0;
        barbell.style.transform = `translateY(-${height}px)`;
    }, 400);
}

/* ==========================================================================
   FORM INPUTS VALIDATION (LETTERS ONLY, DIGITS ONLY, PASSWORD STRENGTH)
   ========================================================================== */
function checkPasswordStrength(pass) {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSymbol = /[^a-zA-Z\d]/.test(pass);
    const isMinLen = pass.length >= 8;
    return hasUpper && hasLower && hasDigit && hasSymbol && isMinLen;
}

function initFormInputsValidation() {
    // 1. Name inputs: allow letters and spaces only
    const nameInputs = document.querySelectorAll('#booking-name, #reg-name, #set-name');
    nameInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });

    // 2. Mobile inputs: allow digits only
    const phoneInputs = document.querySelectorAll('#booking-phone, #reg-phone');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    // 3. Register Password Strength Validation
    const regPass = document.getElementById('reg-password');
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

    const loginPass = document.getElementById('login-password');
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
}


/* ==========================================================================
   DASHBOARD CUSTOM ALERT MODAL & SIDEBAR FUNCTIONS
   ========================================================================== */
function showCustomAlert(message, type = 'error') {
    if (document.querySelector('.custom-alert-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal glass-card';
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    const iconColor = type === 'success' ? '#10b981' : '#ef4444';
    
    modal.innerHTML = `
        <div class="custom-alert-icon" style="color: ${iconColor}; font-size: 3.5rem; margin-bottom: 1.5rem; text-align: center;"><i class="fa-solid ${iconClass}"></i></div>
        <p class="custom-alert-message" style="color: var(--text-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; text-align: center;">${message}</p>
        <button class="custom-alert-btn btn btn-primary" style="width: 100px; margin: 0 auto; display: block; border-radius: var(--radius-full) !important;">OK</button>
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
}

function initDashboardUserCredentials() {
    const userNameElements = document.querySelectorAll('.user-name');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    
    const storedName = localStorage.getItem('loggedInUserName');
    const storedEmail = localStorage.getItem('loggedInUserEmail');
    
    if (storedName) {
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
        
        userAvatarElements.forEach(elem => {
            if (elem.tagName !== 'IMG') {
                elem.textContent = initials;
            }
        });
    }
    
    if (storedEmail) {
        const emailInputs = document.querySelectorAll('#profile-email, input[type="email"].db-input');
        emailInputs.forEach(input => {
            input.value = storedEmail;
        });
    }
}

/* ==========================================================================
   GYM ATHLETE DASHBOARD INTERACTIVE HANDLERS
   ========================================================================== */
function initGymDashboard() {
    // 1. Water Cup click toggling
    const waterBtns = document.querySelectorAll('.water-cup-btn');
    const waterCountElem = document.getElementById('water-count');
    if (waterBtns.length > 0 && waterCountElem) {
        waterBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                waterBtns.forEach((b, idx) => {
                    if (idx <= index) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
                waterCountElem.textContent = index + 1;
                showCustomAlert(`Water logged: ${index + 1} cup(s)!`, 'success');
            });
        });
    }

    // 2. Checklist checking (re-calculating calories)
    const checkItems = document.querySelectorAll('.workout-check-item');
    const calBurnedElem = document.getElementById('cal-burned-value');
    const calGoalElem = document.getElementById('cal-goal-value');
    const calFill = document.getElementById('cal-progress-fill');
    
    function updateCalorieProgress() {
        if (!calBurnedElem || !calGoalElem) return;
        let totalBurned = 0;
        checkItems.forEach(item => {
            if (item.checked) {
                totalBurned += parseInt(item.getAttribute('data-cal')) || 0;
            }
        });
        calBurnedElem.textContent = totalBurned;
        
        const goal = parseInt(calGoalElem.textContent) || 2000;
        const percent = Math.min(100, (totalBurned / goal) * 100);
        if (calFill) {
            calFill.style.width = percent + '%';
        }
    }

    if (checkItems.length > 0) {
        checkItems.forEach(item => {
            item.addEventListener('change', () => {
                updateCalorieProgress();
                if (item.checked) {
                    showCustomAlert("Exercise marked as completed!", "success");
                }
            });
        });
        updateCalorieProgress(); // init progress on load
    }

    // 3. Real-time Heart Rate Heartbeat simulator
    const pulseBpm = document.getElementById('pulse-bpm');
    if (pulseBpm) {
        setInterval(() => {
            const variation = Math.floor(Math.random() * 6) - 3; // -3 to +2
            let currentBpm = parseInt(pulseBpm.textContent) || 72;
            currentBpm += variation;
            if (currentBpm < 60) currentBpm = 60;
            if (currentBpm > 100) currentBpm = 100;
            pulseBpm.textContent = currentBpm;
        }, 3000);
    }

    // 4. Settings Form Submissions
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('set-name');
            const weightInput = document.getElementById('set-weight');
            const calInput = document.getElementById('set-calories');
            
            if (nameInput) {
                localStorage.setItem('loggedInUserName', nameInput.value.trim());
                const names = document.querySelectorAll('.user-name');
                names.forEach(n => {
                    if (n.tagName !== 'INPUT') {
                        n.textContent = nameInput.value.trim();
                    }
                });
                const avatar = document.querySelector('.user-avatar');
                if (avatar && avatar.tagName !== 'IMG') {
                    let initials = '';
                    const parts = nameInput.value.trim().split(' ');
                    if (parts[0]) initials += parts[0].charAt(0);
                    if (parts.length > 1 && parts[1]) initials += parts[1].charAt(0);
                    avatar.textContent = initials.toUpperCase();
                }
            }
            
            if (weightInput) {
                const weightVal = document.getElementById('current-weight-val');
                if (weightVal) weightVal.textContent = weightInput.value;
            }
            
            if (calInput && calGoalElem) {
                calGoalElem.textContent = calInput.value;
                updateCalorieProgress();
            }
            
            showCustomAlert("Profile settings updated successfully!", "success");
        });
    }
}
