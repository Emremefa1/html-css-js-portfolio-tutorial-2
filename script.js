document.addEventListener('DOMContentLoaded', () => {
  // Matrix Digital Rain Effect - Cyberpunk Variant
  const canvas = document.getElementById('matrix-background');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Binary and hex characters for primary streams
  const binaryChars = '10'.split('');
  // Katakana and special characters for highlight streams
  const katakanaChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∆∇§¥₿¢€£♠♣♥♦★○●◆◇□■△▲▼▽'.split('');

  // Stream types
  const STREAM_TYPES = {
    BINARY: 'binary',
    HIGHLIGHT: 'highlight'
  };

  // Initialize streams
  const streams = [];
  const fontSize = 14;
  const columns = Math.ceil(canvas.width / fontSize);

  for (let i = 0; i < columns; i++) {
    const streamType = Math.random() < 0.15 ? STREAM_TYPES.HIGHLIGHT : STREAM_TYPES.BINARY;
    streams[i] = {
      x: i * fontSize,
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + (streamType === STREAM_TYPES.HIGHLIGHT ? 2 : 1),
      length: Math.floor(Math.random() * 15 + (streamType === STREAM_TYPES.HIGHLIGHT ? 10 : 5)),
      type: streamType,
      chars: [],
      lastUpdate: 0,
      updateInterval: streamType === STREAM_TYPES.HIGHLIGHT ? 50 : 100
    };

    // Initialize characters for each stream
    for (let j = 0; j < streams[i].length; j++) {
      streams[i].chars[j] = {
        value: streamType === STREAM_TYPES.BINARY ? 
          binaryChars[Math.floor(Math.random() * binaryChars.length)] :
          katakanaChars[Math.floor(Math.random() * katakanaChars.length)],
        alpha: 1 - (j / streams[i].length)
      };
    }
  }

  // Drawing function
  function draw(timestamp) {
    // Semi-transparent fade effect
    ctx.fillStyle = 'rgba(10, 15, 13, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    streams.forEach((stream, i) => {
      // Update characters periodically
      if (timestamp - stream.lastUpdate > stream.updateInterval) {
        stream.chars.forEach(char => {
          if (Math.random() < 0.1) {
            char.value = stream.type === STREAM_TYPES.BINARY ?
              binaryChars[Math.floor(Math.random() * binaryChars.length)] :
              katakanaChars[Math.floor(Math.random() * katakanaChars.length)];
          }
        });
        stream.lastUpdate = timestamp;
      }

      // Draw each character in the stream
      stream.chars.forEach((char, j) => {
        const y = stream.y - (j * fontSize);
        
        if (y < canvas.height && y > -fontSize) {
          // Set different styles based on stream type
          if (stream.type === STREAM_TYPES.HIGHLIGHT) {
            // Glowing effect for highlight streams
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00FF9D';
            ctx.fillStyle = `rgba(0, 255, 157, ${char.alpha * 0.9})`;
            ctx.font = `bold ${fontSize}px monospace`;
          } else {
            // Subtle effect for binary streams
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(0, 255, 157, ${char.alpha * 0.5})`;
            ctx.font = `${fontSize}px monospace`;
          }
          
          ctx.fillText(char.value, stream.x, y);
        }
      });

      // Move stream
      stream.y += stream.speed;

      // Reset stream when it goes off screen
      if (stream.y > canvas.height + stream.length * fontSize) {
        stream.y = -stream.length * fontSize;
        stream.speed = Math.random() * 2 + (stream.type === STREAM_TYPES.HIGHLIGHT ? 2 : 1);
        stream.length = Math.floor(Math.random() * 15 + (stream.type === STREAM_TYPES.HIGHLIGHT ? 10 : 5));
        
        // Randomly change stream type when resetting
        if (Math.random() < 0.1) {
          stream.type = Math.random() < 0.15 ? STREAM_TYPES.HIGHLIGHT : STREAM_TYPES.BINARY;
          stream.updateInterval = stream.type === STREAM_TYPES.HIGHLIGHT ? 50 : 100;
        }
      }
    });

    requestAnimationFrame(draw);
  }

  // Start the animation
  draw(0);

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
          value: 40,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: "#00FF9D"  // Updated to match our cyber green
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.2,
          random: true,
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
          distance: 200,
          color: "#00FF9D",  // Updated to match our cyber green
          opacity: 0.15,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.5,
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
            enable: false,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.3
            }
          }
        }
      },
      retina_detect: false
    });
  }
  
  // Initial call to manage video playback
  setTimeout(manageVideoPlayback, 500);
});
