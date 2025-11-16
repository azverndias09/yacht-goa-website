// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect with throttling for better performance
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// Smooth scrolling for anchor links with improved performance
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just '#'
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            
            // Use requestAnimationFrame for smoother scrolling
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(bookingForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const date = formData.get('date');
        const packageType = formData.get('package');
        const message = formData.get('message');

        // Create WhatsApp message
        const packageNames = {
            '2hour-mix': '2 Hour Experience (1hr Cruise + 1hr Anchor)',
            '2hour-cruise': '2 Hour Full Cruising',
            'custom': 'Custom Package'
        };

        const whatsappMessage = `Hi, I would like to book Yacht Goa\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Preferred Date: ${date}\n` +
            `Package: ${packageNames[packageType] || packageType}\n` +
            `Message: ${message || 'N/A'}`;

        const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp
        window.open(whatsappURL, '_blank');

        // Show success message
        alert('Thank you for your inquiry! You will be redirected to WhatsApp to complete your booking.');

        // Reset form
        bookingForm.reset();
    });
}

// Gallery lightbox effect (desktop only)
if (window.innerWidth >= 769) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            document.body.appendChild(lightbox);

            // Add lightbox styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 10px;
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 40px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .lightbox-close:hover {
                    color: #d4af37;
                    transform: rotate(90deg);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            // Close lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                    document.head.removeChild(style);
                }, 300);
            });

            // Close on background click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.head.removeChild(style);
                    }, 300);
                }
            });

            // Add fadeOut animation
            const fadeOutStyle = document.createElement('style');
            fadeOutStyle.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(fadeOutStyle);
        });
    });
}

// Enhanced lazy loading for images with progressive loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // Preload the image
            const preloadImage = new Image();
            preloadImage.onload = () => {
                img.classList.add('loaded');
            };
            
            if (img.dataset.src) {
                preloadImage.src = img.dataset.src;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            } else {
                img.classList.add('loaded');
            }
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '100px', // Start loading earlier
    threshold: 0.01
});

// Observe all lazy-loaded images
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// Add loading animation for hero image
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    heroImage.addEventListener('load', () => {
        heroImage.style.opacity = '1';
    });
    // Fallback if image is already cached
    if (heroImage.complete) {
        heroImage.style.opacity = '1';
    }
}

// Parallax effect for hero section with throttling
let parallaxTicking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        const parallax = scrolled * 0.3;
        hero.style.transform = `translateY(${parallax}px)`;
    }
    parallaxTicking = false;
}

window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
}, { passive: true });

// Counter animation for statistics (if needed in future)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.experience-card, .package-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Gallery Video Autoplay on Scroll and Click Handling for all instances
function initGalleryVideos(root = document) {
    const items = root.querySelectorAll('.gallery-video-item');
    items.forEach(videoItem => {
        if (videoItem.dataset.initialized === 'true') return;
        const galleryVideo = videoItem.querySelector('.gallery-video');
        const muteToggle = videoItem.querySelector('.video-mute-toggle');
        if (!galleryVideo) return;

        // Video observer for autoplay on scroll
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    galleryVideo.play().catch(err => {
                        console.log('Auto-play prevented:', err);
                    });
                } else {
                    galleryVideo.pause();
                }
            });
        }, { threshold: 0.5 });
        videoObserver.observe(videoItem);

        // Click to play/pause with unmute
        videoItem.addEventListener('click', (e) => {
            e.stopPropagation();
            if (galleryVideo.paused) {
                galleryVideo.play();
                galleryVideo.muted = false;
                videoItem.classList.add('playing');
                if (muteToggle) {
                    const icon = muteToggle.querySelector('i');
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                }
            } else {
                galleryVideo.pause();
                videoItem.classList.remove('playing');
            }
        });

        // Mute toggle button
        if (muteToggle) {
            muteToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                galleryVideo.muted = !galleryVideo.muted;
                const icon = muteToggle.querySelector('i');
                if (galleryVideo.muted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                }
            });
        }

        // Update playing class when video plays/pauses
        galleryVideo.addEventListener('play', () => {
            videoItem.classList.add('playing');
        });
        galleryVideo.addEventListener('pause', () => {
            if (!galleryVideo.muted) {
                videoItem.classList.remove('playing');
            }
        });

        videoItem.dataset.initialized = 'true';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize any existing gallery video items (desktop grid)
    initGalleryVideos(document);

    // Mobile-only gallery Swiper (page = 2 stacked photos; video takes full page)
    const gallerySwiperEl = document.getElementById('gallery-swiper');
    if (gallerySwiperEl && window.innerWidth <= 576 && window.Swiper) {
        const wrapper = gallerySwiperEl.querySelector('.swiper-wrapper');
        const gridItems = Array.from(document.querySelectorAll('.gallery .gallery-grid > .gallery-item'));

        let i = 0;
        while (i < gridItems.length) {
            const item = gridItems[i];
            const isVideo = item.classList.contains('gallery-video-item');
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const page = document.createElement('div');
            page.className = 'gallery-page' + (isVideo ? ' video-only' : '');

            const clone1 = item.cloneNode(true);
            page.appendChild(clone1);
            i += 1;

            if (!isVideo && i < gridItems.length) {
                const nextItem = gridItems[i];
                if (!nextItem.classList.contains('gallery-video-item')) {
                    const clone2 = nextItem.cloneNode(true);
                    page.appendChild(clone2);
                    i += 1;
                }
            }

            slide.appendChild(page);
            wrapper.appendChild(slide);

            // Ensure lazy images in clones become visible
            slide.querySelectorAll('img[loading="lazy"]').forEach(img => {
                if (typeof imageObserver !== 'undefined') {
                    imageObserver.observe(img);
                }
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => img.classList.add('loaded'));
                }
            });
        }

        // Reveal the swiper
        gallerySwiperEl.hidden = false;
        gallerySwiperEl.setAttribute('aria-hidden', 'false');

        // Init videos inside swiper slides
        initGalleryVideos(gallerySwiperEl);

        // Init Swiper
        try {
            gallerySwiper = new Swiper('#gallery-swiper', {
                slidesPerView: 1,
                spaceBetween: 12,
                pagination: { el: '#gallery-swiper .swiper-pagination', clickable: true },
                autoHeight: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false
                },
                speed: 600
            });

            const handleGallerySlideMedia = () => {
                if (!gallerySwiper) return;
                const slides = gallerySwiper.slides;
                slides.forEach(slide => {
                    slide.querySelectorAll('video.gallery-video').forEach(v => {
                        v.pause();
                    });
                });
                const active = slides[gallerySwiper.activeIndex];
                if (active) {
                    const video = active.querySelector('video.gallery-video');
                    if (video) {
                        video.muted = true; // ensure autoplay
                        video.play().catch(() => {});
                    }
                }
            };

            gallerySwiper.on('init', handleGallerySlideMedia);
            gallerySwiper.on('slideChange', handleGallerySlideMedia);
            // Call once now
            handleGallerySlideMedia();
        } catch (e) {
            console.warn('Gallery Swiper init failed:', e);
        }
    }

    // Autoplay only when sections are in view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'gallery' && gallerySwiper) {
                if (entry.isIntersecting) gallerySwiper.autoplay.start();
                else gallerySwiper.autoplay.stop();
            }
            if (entry.target.classList.contains('testimonials') && testimonialsSwiper) {
                if (entry.isIntersecting) testimonialsSwiper.autoplay.start();
                else testimonialsSwiper.autoplay.stop();
            }
        });
    }, { threshold: 0.3 });

    const gallerySection = document.getElementById('gallery');
    if (gallerySection) sectionObserver.observe(gallerySection);
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) sectionObserver.observe(testimonialsSection);
});

// Add active state to navigation based on scroll position with throttling
let navTicking = false;

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
    
    navTicking = false;
}

window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(updateActiveNav);
        navTicking = true;
    }
}, { passive: true });

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Scroll reveal animation
const scrollReveal = () => {
    const reveals = document.querySelectorAll('[data-aos]');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
};

window.addEventListener('scroll', scrollReveal);
scrollReveal(); // Initial check

// Handle form validation
const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = '#4CAF50';
        }
    });
});

// Console welcome message
console.log('%c Welcome to Yacht Goa! ', 
    'background: #1a3a52; color: #d4af37; font-size: 20px; padding: 10px;');
console.log('%c Experience Luxury on the Waters of Goa ', 
    'color: #2c5f7d; font-size: 14px;');

let testimonialsSwiper = null;
let gallerySwiper = null;

// Initialize Testimonials Swiper
document.addEventListener('DOMContentLoaded', () => {
    if (window.Swiper) {
        try {
            testimonialsSwiper = new Swiper('.testimonials-swiper', {
                slidesPerView: 1,
                spaceBetween: 12,
                autoHeight: true,
                pagination: {
                    el: '.testimonials .swiper-pagination',
                    clickable: true
                },
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false
                },
                speed: 600,
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3, allowTouchMove: false }
                }
            });
        } catch (e) {
            console.warn('Testimonials Swiper init failed:', e);
        }
    }
});

// Toast utility and 'Other Experiences' button handler
function showToast(message, duration = 2200) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('show');
    if (toast._hideTimer) clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
        toast.setAttribute('aria-hidden', 'true');
    }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
    const otherBtn = document.querySelector('.coming-soon-btn');
    if (otherBtn) {
        otherBtn.addEventListener('click', () => {
            showToast('More activities coming soon!');
        });
    }
});