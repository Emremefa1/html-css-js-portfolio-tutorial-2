document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Project cards staggered animation
  const projectCards = document.querySelectorAll('.details-container');
  const cardOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      
      // Staggered animation - add delay based on index
      setTimeout(() => {
        entry.target.classList.add('animate');
      }, index * 100); // 100ms delay between each card
      
      observer.unobserve(entry.target);
    });
  }, cardOptions);
  
  projectCards.forEach(card => {
    cardObserver.observe(card);
  });

  // GIF loading management - improved version
  const gifImages = document.querySelectorAll('.gif-container img');
  
  // Function to handle image loading completion
  const handleImageLoaded = (img) => {
    const container = img.closest('.gif-container');
    container.classList.add('loaded');
    img.classList.add('loaded');
  };
  
  // Function to handle image loading error
  const handleImageError = (img) => {
    const container = img.closest('.gif-container');
    container.classList.add('loaded'); // Still mark as loaded to remove loading text
    img.classList.add('loaded');
    console.warn('Image failed to load:', img.src);
  };

  // Create a new Intersection Observer for GIFs
  const gifLoadOptions = {
    rootMargin: "200px", // Start loading even earlier to ensure they're ready
    threshold: 0.1
  };
  
  const gifObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      const img = entry.target;
      
      // Check if image is already complete (might be cached)
      if (img.complete) {
        handleImageLoaded(img);
      } else {
        // Set up the load and error events for images still loading
        img.onload = () => handleImageLoaded(img);
        img.onerror = () => handleImageError(img);
      }
      
      // Unobserve after we start loading
      observer.unobserve(img);
    });
  }, gifLoadOptions);
  
  // Handle all GIF images immediately
  gifImages.forEach(img => {
    // For all images, check if they're loaded and set up event handlers
    if (img.complete) {
      // Image is already loaded, mark it as complete now
      handleImageLoaded(img);
    } else {
      // Add event handlers
      img.onload = () => handleImageLoaded(img);
      img.onerror = () => handleImageError(img);
      
      // Add to observer to start loading when near viewport
      gifObserver.observe(img);
    }
  });
  
  // Shorter fallback timer - if images aren't loaded after 3 seconds, force them to show
  setTimeout(() => {
    document.querySelectorAll('.gif-container:not(.loaded)').forEach(container => {
      container.classList.add('loaded');
      const img = container.querySelector('img');
      if (img) img.classList.add('loaded');
      console.log('Fallback timer applied to:', container);
    });
  }, 3000);

  // Scroll-to-top button functionality
  const scrollToTopBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Initialize particles.js
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#bb86fc"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.3,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#bb86fc",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.6
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
});
