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

  // Enhanced Media Loading - Handles both videos and GIF images
  const gifContainers = document.querySelectorAll('.gif-container');
  
  // Function to handle media loading completion
  const handleMediaLoaded = (media, container) => {
    if (!container) container = media.closest('.gif-container');
    container.classList.add('loaded');
    media.classList.add('loaded');
  };
  
  // Function to handle media loading error
  const handleMediaError = (media, container) => {
    if (!container) container = media.closest('.gif-container');
    container.classList.add('loaded'); // Still mark as loaded to remove loading text
    media.classList.add('loaded');
    console.warn('Media failed to load:', media.src || media.currentSrc);
    
    // If video fails, try showing the fallback image
    if (media.tagName === 'VIDEO') {
      const fallbackImg = media.querySelector('img');
      if (fallbackImg) {
        fallbackImg.style.display = 'block';
        if (fallbackImg.complete) {
          handleMediaLoaded(fallbackImg, container);
        } else {
          fallbackImg.onload = () => handleMediaLoaded(fallbackImg, container);
          fallbackImg.onerror = () => console.warn('Both video and fallback image failed to load');
        }
      }
    }
  };

  // Helper to check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= -rect.height && 
      rect.left >= -rect.width && 
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height && 
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
    );
  };

  // Create a new Intersection Observer for media elements
  const mediaLoadOptions = {
    rootMargin: "300px", // Load media well before it's visible
    threshold: 0.01
  };
  
  const mediaObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      const container = entry.target;
      const media = container.querySelector('video') || container.querySelector('img');
      
      if (!media) return;
      
      if (media.tagName === 'VIDEO') {
        // For videos
        if (media.readyState >= 3) { // HAVE_FUTURE_DATA
          handleMediaLoaded(media, container);
        } else {
          media.addEventListener('loadeddata', () => handleMediaLoaded(media, container), { once: true });
          media.addEventListener('error', () => handleMediaError(media, container), { once: true });
          
          // Try to preload video metadata to speed up loading
          media.preload = 'metadata';
          media.load();
        }
      } else {
        // For images
        if (media.complete) {
          handleMediaLoaded(media, container);
        } else {
          media.onload = () => handleMediaLoaded(media, container);
          media.onerror = () => handleMediaError(media, container);
        }
      }
      
      observer.unobserve(container);
    });
  }, mediaLoadOptions);
  
  // Handle all media containers
  gifContainers.forEach(container => {
    mediaObserver.observe(container);
  });
  
  // Handle video playback based on visibility
  const manageVideoPlayback = () => {
    document.querySelectorAll('.gif-container video.loaded').forEach(video => {
      if (isElementInViewport(video)) {
        if (video.paused) video.play().catch(() => {});
      } else {
        if (!video.paused) video.pause();
      }
    });
  };
  
  // Throttle function to limit scroll event frequency
  const throttle = (callback, limit) => {
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  };
  
  // Add throttled scroll listener for video management
  window.addEventListener('scroll', throttle(manageVideoPlayback, 200));
  
  // Check video playback on resize too
  window.addEventListener('resize', throttle(manageVideoPlayback, 200));
  
  // Manage videos when document becomes visible/invisible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause all videos when tab is not visible
      document.querySelectorAll('video').forEach(video => {
        if (!video.paused) video.pause();
      });
    } else {
      // Resume video playback when tab becomes visible again
      manageVideoPlayback();
    }
  });
  
  // Shorter fallback timer - if media aren't loaded after 3 seconds, force them to show
  setTimeout(() => {
    document.querySelectorAll('.gif-container:not(.loaded)').forEach(container => {
      container.classList.add('loaded');
      const media = container.querySelector('video, img');
      if (media) media.classList.add('loaded');
      console.log('Fallback timer applied to:', container);
    });
  }, 3000);

  // Scroll-to-top button functionality
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  // Use throttled scroll handler for better performance
  window.addEventListener('scroll', throttle(() => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  }, 150));

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Optimized particles.js configuration
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 40, // Reduced from 80
          density: {
            enable: true,
            value_area: 1000 // Increased to reduce particle density
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
            enable: false, // Disabled animation for better performance
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false, // Disabled animation for better performance
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 200, // Increased to reduce the number of connections
          color: "#bb86fc",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.5, // Reduced speed for better performance
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
            enable: false, // Disabled for better performance
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
          }
        }
      },
      retina_detect: false // Disabled for better performance on high DPI displays
    });
  }
  
  // Initial call to manage video playback
  setTimeout(manageVideoPlayback, 500);
});
