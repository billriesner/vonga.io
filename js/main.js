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

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
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
