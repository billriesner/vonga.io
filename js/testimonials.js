// Vonga Testimonials Database
const testimonials = [
  {
    id: 1,
    quote: "We distributed 500 shirts at homecoming. Within 48 hours, 312 unique taps and 89 social shares. But the real win? Fans kept coming back. The engagement didn't stop after the game.",
    author: "Director of Marketing, State University"
  },
  {
    id: 2,
    quote: "Our average merchandise revenue per fan increased 34%. But more than that, we finally have proof that our fans are engaged. Our sponsors can see the connection in real time.",
    author: "Athletic Director, Regional College"
  },
  {
    id: 3,
    quote: "The data we're capturing through Vonga has transformed how we approach fan engagement. We're making decisions based on actual behavior, not assumptions.",
    author: "VP of Marketing, Professional Sports Team"
  },
  {
    id: 4,
    quote: "We launched with 300 shirts as a pilot. Within the first month, we saw engagement rates 20 times higher than our social media campaigns.",
    author: "Community Manager, University Athletics"
  },
  {
    id: 5,
    quote: "Our sponsors finally have proof of value. They can see exactly how many fans are engaging with their activations and where.",
    author: "Partnership Director, Minor League Team"
  }
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Render testimonials into a container
function renderTestimonials(containerId, count = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Get random testimonials
  const shuffled = shuffleArray(testimonials);
  const selected = shuffled.slice(0, count);
  
  // Determine grid class
  const gridClass = count === 2 ? 'grid-2' : 'grid-3';
  
  // Build HTML
  const html = `
    <div class="grid ${gridClass}">
      ${selected.map(t => `
        <div class="testimonial">
          <p>"${t.quote}"</p>
          <div class="testimonial-author">${t.author}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  container.innerHTML = html;
}

// Auto-initialize testimonials on page load
document.addEventListener('DOMContentLoaded', function() {
  // Find all testimonial containers and render them
  document.querySelectorAll('[data-testimonials]').forEach(container => {
    const count = parseInt(container.getAttribute('data-testimonials')) || 3;
    renderTestimonials(container.id, count);
  });
});
