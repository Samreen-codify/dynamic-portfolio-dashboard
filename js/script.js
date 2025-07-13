// ===== PROJECTS SECTION (Your Version) ===== //

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.createElement('div');
modal.className = 'modal';
document.body.appendChild(modal);

// Fetch projects data
async function fetchProjects() {
    try {
        const response = await fetch('js/data/projects.json');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Render projects
function renderProjects(projects) {
    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('article');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        projectCard.innerHTML = `
            <figure class="project-figure">
                <img src="${project.imageUrl}" alt="${project.title}" class="project-image" loading="lazy">
            </figure>
            <div class="project-content">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.shortDescription}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="technology-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        projectCard.addEventListener('click', () => openModal(project));
        projectsGrid.appendChild(projectCard);
    });
}

// Filter projects
function filterProjects(category) {
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });

    const allProjects = document.querySelectorAll('.project-card');
    allProjects.forEach(project => {
        project.style.display = (category === 'all' || project.dataset.category === category)
            ? 'block'
            : 'none';
    });
}

// Open modal
function openModal(project) {
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <img src="${project.imageUrl}" alt="${project.title}" class="modal-image">
            <span class="modal-category">${project.category}</span>
            <h3 class="modal-title">${project.title}</h3>
            <span class="modal-date">${new Date(project.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</span>
            <p class="modal-description">${project.longDescription}</p>
            <div class="modal-technologies"></div>
        </div>
    `;

    // Add close event to the close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const technologiesContainer = modal.querySelector('.modal-technologies');
    technologiesContainer.innerHTML = '';
    project.technologies.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'technology-tag';
        techTag.textContent = tech;
        technologiesContainer.appendChild(techTag);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Initialize projects
function initProjects() {
    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterProjects(button.dataset.filter);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

// ===== REST OF YOUR APPLICATION ===== //

// Mobile Navigation
function toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', !isExpanded);
    navList.setAttribute('data-visible', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
}

function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');

    navToggle.addEventListener('click', toggleMobileMenu);

    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle.getAttribute('aria-expanded') === 'true') {
                toggleMobileMenu();
            }
        });
    });
}

// Smooth Scrolling
function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle.getAttribute('aria-expanded') === 'true') {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Form Validation
function validateForm() {
    const form = document.getElementById('contact-form');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    let isValid = true;

    // Reset errors
    [nameError, emailError, subjectError, messageError].forEach(el => el.style.display = 'none');
    [name, email, subject, message].forEach(el => el.classList.remove('error'));

    // Validate name
    if (name.value.trim() === '') {
        nameError.textContent = 'Name is required';
        nameError.style.display = 'block';
        name.classList.add('error');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        email.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.style.display = 'block';
        email.classList.add('error');
        isValid = false;
    }

    // Validate subject
    if (subject.value.trim() === '') {
        subjectError.textContent = 'Subject is required';
        subjectError.style.display = 'block';
        subject.classList.add('error');
        isValid = false;
    }

    // Validate message
    if (message.value.trim() === '') {
        messageError.textContent = 'Message is required';
        messageError.style.display = 'block';
        message.classList.add('error');
        isValid = false;
    }

    // If form is valid, show success message
    if (isValid) {
        formSuccess.textContent = 'Thank you for your message! I will get back to you soon.';
        formSuccess.style.display = 'block';
        form.reset();

        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }

    return false;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize mobile menu
    initMobileMenu();

    // Initialize smooth scrolling
    smoothScrolling();

    // Initialize projects
    initProjects();
    const projects = await fetchProjects();
    renderProjects(projects);

    // Initialize form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateForm();
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorId = input.id + '-error';
                    document.getElementById(errorId).style.display = 'none';
                }
            });
        });
    }

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
// Animate skill bars when section comes into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const level = bar.dataset.level;
        bar.style.width = `${level}%`;
    });
}

// Intersection Observer for skill bars
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}
// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.dataset.count;
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Intersection Observer for counters
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe about section
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}
// Form Validation
function validateForm() {
    const form = document.getElementById('contact-form');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    let isValid = true;

    // Reset errors
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    subjectError.style.display = 'none';
    messageError.style.display = 'none';
    name.classList.remove('error');
    email.classList.remove('error');
    subject.classList.remove('error');
    message.classList.remove('error');

    // Validate name
    if (name.value.trim() === '') {
        nameError.textContent = 'Name is required';
        nameError.style.display = 'block';
        name.classList.add('error');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        email.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.style.display = 'block';
        email.classList.add('error');
        isValid = false;
    }

    // Validate subject
    if (subject.value.trim() === '') {
        subjectError.textContent = 'Subject is required';
        subjectError.style.display = 'block';
        subject.classList.add('error');
        isValid = false;
    }

    // Validate message
    if (message.value.trim() === '') {
        messageError.textContent = 'Message is required';
        messageError.style.display = 'block';
        message.classList.add('error');
        isValid = false;
    }

    // If form is valid, show success message
    if (isValid) {
        formSuccess.textContent = 'Thank you for your message! I will get back to you soon.';
        formSuccess.style.display = 'block';
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }

    return false; // Prevent form submission for demo
}

// Add form submit event
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        validateForm();
    });

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                const errorId = input.id + '-error';
                document.getElementById(errorId).style.display = 'none';
            }
        });
    });
}
// Parallax Effect
function parallaxEffect() {
    const parallaxImages = document.querySelectorAll('.parallax-image');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;

        parallaxImages.forEach(image => {
            const speed = parseFloat(image.dataset.speed) || 0.1;
            const yPos = scrollPosition * speed;
            image.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Smooth Scrolling for Anchor Links
function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle.getAttribute('aria-expanded') === 'true') {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Initialize effects
parallaxEffect();
smoothScrolling();
// Mobile Navigation
function toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', !isExpanded);
    navList.setAttribute('data-visible', !isExpanded);

    // Toggle body scroll
    document.body.style.overflow = isExpanded ? '' : 'hidden';
}

// Initialize mobile menu
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on nav links
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle.getAttribute('aria-expanded') === 'true') {
                toggleMobileMenu();
            }
        });
    });
}

initMobileMenu();
// Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
        const headings = section.querySelectorAll('h2, h3, p');

        headings.forEach((heading, i) => {
            heading.classList.add('animate-on-scroll');
            heading.style.setProperty('--animation-order', i);
        });
    });
}

// Initialize animations
addAnimationClasses();
initScrollAnimations();
