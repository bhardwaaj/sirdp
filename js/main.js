// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all site components
    initSite();
});

// Main initialization function
function initSite() {
    // Add a class to body to help with CSS targeting
    document.body.classList.add('js-loaded');
    
    // Set cursor to none on desktop
    if (window.innerWidth > 768) {
        document.body.style.cursor = 'none';
    }
    
    // Hide preloader
    hidePreloader();
    
    // Initialize all sections
    initNavigation();
    initTimeline();
    initScrollAnimations();
    initMemoriesGrid();
    initGallery();
    
    // Initialize animations
    initScrollReveal();
    initParticles();
    initGalleryParticles();
    initSectionParticles();
    
    // Set up global event listeners
    setupGlobalEventListeners();
}

// Hide preloader when page is loaded
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
}

// Initialize the navigation components
function initNavigation() {
    // Toggle mobile menu
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            
            // Animate menu items
            document.querySelectorAll('.nav-menu li').forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index * 0.1 + 0.3}s`;
                }
            });
        });
    }
    
    // Navbar scroll behavior
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.top-navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('nav-active')) {
                        navMenu.classList.remove('nav-active');
                        if (burger) burger.classList.remove('toggle');
                    }
                }
            }
        });
    });
}

// Initialize timeline animation
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    // Create an observer for timeline items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe each timeline item
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize scroll-based animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-reveal, .scroll-left, .scroll-right, .scroll-zoom');
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each animated element
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize memories grid 
function initMemoriesGrid() {
    const memoryItems = document.querySelectorAll('.memory-item');
    if (!memoryItems.length) return;
    
    // Initialize intersection observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe each memory item
    memoryItems.forEach((item, index) => {
        // Set staggered delay for CSS animations
        item.style.setProperty('--i', index + 1);
        observer.observe(item);
        
        // Add hover effect with mouse events
        item.addEventListener('mouseenter', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.memory-caption');
            
            if (img) {
                img.style.transform = 'scale(1.1)';
                img.style.filter = 'brightness(0.7) contrast(1.1)';
            }
            
            if (caption) {
                caption.style.transform = 'translateY(0)';
            }
            
            item.style.transform = 'translateY(-10px)';
            item.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(213, 0, 249, 0.6)';
        });
        
        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.memory-caption');
            
            if (img) {
                img.style.transform = '';
                img.style.filter = '';
            }
            
            if (caption) {
                caption.style.transform = '';
            }
            
            item.style.transform = '';
            item.style.boxShadow = '';
        });
        
        // Add touch support for mobile
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            // Remove active state from other items
            memoryItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.remove('touch-active');
                    const otherCaption = otherItem.querySelector('.memory-caption');
                    if (otherCaption) otherCaption.style.transform = '';
                }
            });
            
            // Toggle this item
            this.classList.toggle('touch-active');
            
            const caption = this.querySelector('.memory-caption');
            if (caption) {
                if (this.classList.contains('touch-active')) {
                    caption.style.transform = 'translateY(0)';
                } else {
                    caption.style.transform = '';
                }
            }
        });
    });
}

// Initialize photo gallery
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    
    // Initialize intersection observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe each gallery item
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Set up global event listeners
function setupGlobalEventListeners() {
    // Progress bar for scrolling
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Custom cursor effect
    setupCustomCursor();
}

// Show notification function
function showNotification(message, status = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.getElementById('notification-icon');
    
    if (!notification || !notificationMessage || !notificationIcon) return;
    
    notificationMessage.textContent = message;
    
    // Set appropriate status class and icon
    if (status === 'success') {
        notification.classList.add('success');
        notification.classList.remove('error');
        notificationIcon.className = 'fas fa-check-circle';
    } else {
        notification.classList.add('error');
        notification.classList.remove('success');
        notificationIcon.className = 'fas fa-exclamation-circle';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Custom cursor setup
function setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-dot-outline';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);
    
    let cursorVisible = true;
    let cursorEnlarged = false;
    
    // Functions for mouse cursor tracking
    const onMouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        if (cursorVisible) {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    
    // Functions for hiding cursor when it leaves the window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        cursorVisible = false;
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        cursorVisible = true;
    });
    
    // Interactive cursor states
    const applyInteractiveEffects = () => {
        // Links
        const links = document.querySelectorAll('a, .nav-logo, .nav-menu li, .social-icon');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                document.body.classList.add('link-hover');
            });
            
            link.addEventListener('mouseleave', () => {
                document.body.classList.remove('link-hover');
            });
        });
        
        // Buttons
        const buttons = document.querySelectorAll('button, .btn-submit, .nav-button, .btn-wishes, .slider-controls button, .back-to-top');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                document.body.classList.add('button-hover');
            });
            
            button.addEventListener('mouseleave', () => {
                document.body.classList.remove('button-hover');
            });
        });
        
        // Images
        const images = document.querySelectorAll('.memory-item, .gallery-item, .award-card img, .profile-photo, .about-image img');
        images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                document.body.classList.add('image-hover');
            });
            
            image.addEventListener('mouseleave', () => {
                document.body.classList.remove('image-hover');
            });
        });
    };
    
    // Apply interactive effects
    applyInteractiveEffects();
    
    // Add dynamic cursor glow when clicking
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.9)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Ensure cursor is visible on page load
    cursor.style.opacity = '1';
    cursorOutline.style.opacity = '1';
    
    // Make cursor work with dynamically added elements
    const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                applyInteractiveEffects();
            }
        });
    });
    
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize particles.js
function initParticles() {
    if (!window.particlesJS) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 60,  // Reduced number of particles
                "density": {
                    "enable": true,
                    "value_area": 1200  // Increased area for more spacing
                }
            },
            "color": {
                "value": ["#f706cf", "#9c27b0", "#5b56e9", "#6a5acd"]  // More subtle colors
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.4,  // Lower opacity for subtlety
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 0.8,  // Slower animation
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,  // Smaller particles
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "size_min": 0.5,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#d500f9",
                "opacity": 0.2,  // More transparent lines
                "width": 0.7  // Thinner lines
            },
            "move": {
                "enable": true,
                "speed": 1.2,  // Slower movement
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 180,
                    "line_linked": {
                        "opacity": 0.3  // Subtle interaction
                    }
                },
                "bubble": {
                    "distance": 200,
                    "size": 5,
                    "duration": 2,
                    "opacity": 0.4,
                    "speed": 2
                },
                "repulse": {
                    "distance": 150,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 2  // Add fewer particles on click
                },
                "remove": {
                    "particles_nb": 1
                }
            }
        },
        "retina_detect": true
    });
}

// Initialize Gallery Particles with even more subtle effect
function initGalleryParticles() {
    if (!window.particlesJS) return;
    
    particlesJS('gallery-particles', {
        "particles": {
            "number": {
                "value": 30,  // Fewer particles
                "density": {
                    "enable": true,
                    "value_area": 1000
                }
            },
            "color": {
                "value": ["#ffffff", "#d500f9", "#6a5acd"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.3,  // Very transparent
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 0.6,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 2.5,  // Smaller particles
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 0.8,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false  // No connecting lines
            },
            "move": {
                "enable": true,
                "speed": 0.8,  // Very slow movement
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "bubble"
                },
                "onclick": {
                    "enable": true,
                    "mode": "repulse"
                },
                "resize": true
            },
            "modes": {
                "bubble": {
                    "distance": 150,
                    "size": 4,
                    "duration": 2,
                    "opacity": 0.4,
                    "speed": 2
                },
                "repulse": {
                    "distance": 150,
                    "duration": 0.4
                }
            }
        },
        "retina_detect": true
    });
}

// Initialize section-specific particle effects
function initSectionParticles() {
    // Add local particle containers to sections that need them
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        // Only add to every other section to avoid overwhelming the page
        if (index % 2 === 0) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'local-particles-container';
            particlesContainer.id = `local-particles-${index}`;
            section.appendChild(particlesContainer);
            
            // Initialize with even more subtle settings
            if (window.particlesJS) {
                particlesJS(`local-particles-${index}`, {
                    "particles": {
                        "number": {
                            "value": 20,
                            "density": {
                                "enable": true,
                                "value_area": 1500
                            }
                        },
                        "color": {
                            "value": ["#ffffff", "#d500f9"]
                        },
                        "opacity": {
                            "value": 0.2,
                            "random": true
                        },
                        "size": {
                            "value": 2,
                            "random": true
                        },
                        "line_linked": {
                            "enable": false
                        },
                        "move": {
                            "enable": true,
                            "speed": 0.5,
                            "random": true
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": false
                            },
                            "onclick": {
                                "enable": false
                            }
                        }
                    }
                });
            }
        }
    });
} 