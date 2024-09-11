function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}


// Function to handle clicks outside the details panel
function handleOutsideClick(event, detailsElement) {
  if (!detailsElement.contains(event.target)) {
    detailsElement.classList.remove('active'); // Hide details if clicked outside
    document.removeEventListener('click', handleOutsideClick); // Remove the listener
  }
}


