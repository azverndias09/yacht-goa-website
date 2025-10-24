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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
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

// Gallery lightbox effect (simple implementation)
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

// Add loading animation for video
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.style.opacity = '1';
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    }
});

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

// Auto-play video handling
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    }
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
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
});

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