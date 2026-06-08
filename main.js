        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');

        const currentTheme = sessionStorage.getItem('theme');
        if (currentTheme === 'light-mode') {
            document.body.classList.add('light-mode');
            updateThemeIcon();
        }

        themeToggle.addEventListener('click', function () {
            document.body.classList.add('theme-transitioning');
            document.body.classList.toggle('light-mode');

            let theme = 'dark-mode';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light-mode';
            }

            sessionStorage.setItem('theme', theme);
            updateThemeIcon();

            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 600);
        });

        function updateThemeIcon() {
            if (document.body.classList.contains('light-mode')) {
                themeIcon.textContent = '☀️';
            } else {
                themeIcon.textContent = '🌙';
            }
        }

        // Hide Navbar when Footer is visible
        const stickyNavbar = document.querySelector('.navbar');
        const footerSection = document.querySelector('.footer-section');

        if (stickyNavbar && footerSection) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stickyNavbar.classList.add('navbar-hidden');
                    } else {
                        stickyNavbar.classList.remove('navbar-hidden');
                    }
                });
            }, { threshold: 0.1 });

            footerObserver.observe(footerSection);
        }

        // Hamburger Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Slide to Connect Logic
        document.querySelectorAll('.slide-action-btn').forEach(btn => {
            const thumb = btn.querySelector('.slide-thumb');
            const text = btn.querySelector('.slide-text');
            let isDragging = false;
            let startX = 0;
            let maxTranslate = btn.clientWidth - thumb.clientWidth - 12; // 6px padding both sides
            let currentTranslate = 0;
            let rafId = null;

            const handleStart = (e) => {
                isDragging = true;
                startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                thumb.style.transition = 'none';
                text.style.transition = 'none';
            };

            const handleMove = (e) => {
                if (!isDragging) return;
                let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                let diff = clientX - startX;
                currentTranslate = Math.max(0, Math.min(diff, maxTranslate));
                
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    thumb.style.transform = `translateX(${currentTranslate}px)`;
                    let progress = currentTranslate / maxTranslate;
                    text.style.opacity = 1 - progress;
                    text.style.filter = `blur(${progress * 10}px)`;
                });

                if (currentTranslate >= maxTranslate - 5) {
                    isDragging = false;
                    btn.classList.add('success');
                    document.body.classList.add('page-leaving');
                    setTimeout(() => {
                        window.location.href = 'contact.html';
                    }, 400);
                }
            };

            const handleEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                thumb.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                text.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
                if (currentTranslate < maxTranslate - 5) {
                    currentTranslate = 0;
                    thumb.style.transform = `translateX(0px)`;
                    text.style.opacity = 1;
                    text.style.filter = `blur(0px)`;
                }
            };

            thumb.addEventListener('mousedown', handleStart);
            thumb.addEventListener('touchstart', handleStart, { passive: true });

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: true });

            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchend', handleEnd);
        });

        // Circular Gallery Logic
        document.addEventListener('DOMContentLoaded', () => {
            const gallerySection = document.querySelector('.circular-work-section');
            const galleryCylinder = document.getElementById('gallery-cylinder');
            let targetRot = 0;
            let galleryIsDragging = false;
            let galleryStartX = 0;

            if (gallerySection && galleryCylinder) {
                if (window.innerWidth <= 768) {
                    // Mobile: Using CSS transition for lag-free auto-animation
                    galleryCylinder.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';

                    setInterval(() => {
                        targetRot -= 90; // 360deg / 4 items = 90deg gap
                        galleryCylinder.style.transform = `rotateY(${targetRot}deg)`;
                    }, 3000);
                } else {
                    // Desktop: Pure CSS transition for perfectly smooth automated slides, instant response for drag
                    galleryCylinder.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'; // Beautiful smooth slide
                    
                    // Gap-based Auto Scroll (3 second gap then snap to next)
                    setInterval(() => {
                        if (!galleryIsDragging) {
                            targetRot -= 90; // 360deg / 4 items = 90deg gap
                            galleryCylinder.style.transform = `rotateY(${targetRot}deg)`;
                        }
                    }, 3000);

                    const onDragStart = (e) => {
                        galleryIsDragging = true;
                        galleryCylinder.style.transition = 'none'; // Disable transition so it sticks exactly to mouse without delay
                        galleryStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                    };

                    let galleryRafId = null;
                    const onDragMove = (e) => {
                        if (!galleryIsDragging) return;
                        let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                        let diff = clientX - galleryStartX;
                        targetRot += diff * 0.15; // Significantly reduced mouse slide speed (very slow/heavy feel)
                        galleryStartX = clientX; // update frame basis
                        
                        if (galleryRafId) cancelAnimationFrame(galleryRafId);
                        galleryRafId = requestAnimationFrame(() => {
                            galleryCylinder.style.transform = `rotateY(${targetRot}deg)`;
                        });
                    };

                    const onDragEnd = () => {
                        galleryIsDragging = false;
                        targetRot = Math.round(targetRot / 90) * 90; // Calculate nearest card
                        galleryCylinder.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'; // Turn smooth slide back on
                        galleryCylinder.style.transform = `rotateY(${targetRot}deg)`; // Slide perfectly to the snapped card
                    };

                    gallerySection.addEventListener('mousedown', onDragStart);
                    gallerySection.addEventListener('touchstart', onDragStart, { passive: true });
                    window.addEventListener('mousemove', onDragMove);
                    window.addEventListener('touchmove', onDragMove, { passive: true });
                    window.addEventListener('mouseup', onDragEnd);
                    window.addEventListener('touchend', onDragEnd);
                }
            }
        });

        // Page Transition Logic
        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('a[href]');
            links.forEach(link => {
                link.addEventListener('click', function (e) {
                    const target = this.getAttribute('href');

                    if (target.startsWith('http') || target.startsWith('#') || target === '') return;
                    if (this.getAttribute('target') === '_blank') return;

                    e.preventDefault();
                    document.body.classList.add('page-leaving');

                    setTimeout(() => {
                        window.location.href = target;
                    }, 400);
                });
            });
        });

        // Lightbox Logic
        document.addEventListener('DOMContentLoaded', () => {
            const triggers = document.querySelectorAll('.lightbox-trigger');
            if (triggers.length > 0) {
                const lightbox = document.createElement('div');
                lightbox.className = 'image-lightbox';
                lightbox.id = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-overlay"></div>
                    <button class="lightbox-close">&times;</button>
                    <div class="lightbox-content">
                        <img src="" alt="Full View" id="lightbox-img">
                    </div>
                `;
                document.body.appendChild(lightbox);
                
                const closeBtn = lightbox.querySelector('.lightbox-close');
                const overlay = lightbox.querySelector('.lightbox-overlay');
                const img = lightbox.querySelector('#lightbox-img');
                
                const openLightbox = (imageSrc) => {
                    img.src = imageSrc;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                };
                
                const closeLightbox = () => {
                    lightbox.classList.remove('active');
                    setTimeout(() => { img.src = ''; }, 400);
                    document.body.style.overflow = '';
                };
                
                triggers.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const imgSrc = btn.getAttribute('data-img');
                        if (imgSrc) openLightbox(imgSrc);
                    });
                });
                
                closeBtn.addEventListener('click', closeLightbox);
                overlay.addEventListener('click', closeLightbox);
            }
        });
