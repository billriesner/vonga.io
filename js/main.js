// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('nav ul');

// Create backdrop overlay for mobile nav
const navBackdrop = document.createElement('div');
navBackdrop.classList.add('nav-backdrop');
document.body.appendChild(navBackdrop);

function openNav() {
  mobileMenuToggle.classList.add('active');
  navMenu.classList.add('active');
  navBackdrop.classList.add('active');
  document.body.classList.add('nav-open');
}

function closeNav() {
  mobileMenuToggle.classList.remove('active');
  navMenu.classList.remove('active');
  navBackdrop.classList.remove('active');
  document.body.classList.remove('nav-open');
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function() {
    if (navMenu.classList.contains('active')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeNav();
    });
  });

  // Close menu when clicking outside (backdrop)
  navBackdrop.addEventListener('click', function() {
    closeNav();
  });

  // Close menu when clicking outside nav (fallback)
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav') && !e.target.closest('.nav-backdrop')) {
      closeNav();
    }
  });
}

// Form handling — contact form has its own inline handler
// This is a fallback for any other forms on the site
const forms = document.querySelectorAll('form:not(#contactForm)');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    window.location.href = '/contact.html';
  });
});
