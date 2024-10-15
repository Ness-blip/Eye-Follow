const eye = document.querySelector('.eye');
const pupil = document.querySelector('.pupil');
const body = document.body;
const overlay = document.querySelector('.overlay'); // Select overlay element

let isFar = false; // To track whether the cursor is far from the eye
let mouseOutside = false; // To track if the mouse left the screen
let jitterInterval = null; // To manage the jitter effect interval

// Function to move the pupil randomly
function movePupilRandomly() {
  const randomAngle = Math.random() * Math.PI * 2; // Random angle
  const maxPupilMovement = 60; // How far the pupil can move
  const pupilX = Math.cos(randomAngle) * maxPupilMovement;
  const pupilY = Math.sin(randomAngle) * maxPupilMovement;

  pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
}

// Function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to start the jitter effect
function startJitterEffect() {
  // If jitter is already active, do nothing
  if (jitterInterval) return;

  jitterInterval = setInterval(() => {
    const jitterX = (Math.random() - 0.5) * 10; // Random jitter between -5 and 5 pixels
    const jitterY = (Math.random() - 0.5) * 10; // Random jitter between -5 and 5 pixels
    eye.style.transform = `translate(${jitterX}px, ${jitterY}px)`;
  }, 100); // Jitter every 100ms for noticeable effect
}

// Function to stop the jitter effect
function stopJitterEffect() {
  if (jitterInterval) {
    clearInterval(jitterInterval);
    jitterInterval = null;
    eye.style.transform = `translate(0px, 0px)`; // Reset the eye position to avoid any offset
  }
}

document.addEventListener('mousemove', (e) => {
  // Reset if mouse comes back from being outside
  mouseOutside = false;

  const eyeRect = eye.getBoundingClientRect();
  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2;

  const distance = calculateDistance(eyeCenterX, eyeCenterY, e.pageX, e.pageY);
  const distanceThreshold = 600; // Set the threshold distance
  const centerThreshold = 30; // Threshold for when the cursor is close to the eye's center

  if (distance > distanceThreshold) {
    // If mouse is far from the eye, move randomly
    if (!isFar) {
      isFar = true;
      movePupilRandomly();
    }
  } else {
    // Follow the mouse if it's within the threshold
    isFar = false;

    if (distance < centerThreshold) {
      // If the mouse is very close to the center of the eye, center the pupil
      pupil.style.transform = `translate(0px, 0px)`;

      // Add dark mode and glow effect
      body.classList.add('dark-mode');
      eye.classList.add('glow');
      overlay.classList.add('active'); // Show overlay (with transition effect)

      // Start jitter effect
      startJitterEffect();
    } else {
      // Otherwise, calculate the angle to follow the mouse
      body.classList.remove('dark-mode');
      eye.classList.remove('glow');
      overlay.classList.remove('active'); // Hide the overlay

      // Stop jitter effect if active
      stopJitterEffect();

      const angle = Math.atan2(e.pageY - eyeCenterY, e.pageX - eyeCenterX);
      const maxPupilMovement = 70; // How far the pupil can move
      const pupilX = Math.cos(angle) * maxPupilMovement;
      const pupilY = Math.sin(angle) * maxPupilMovement;

      pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }
  }
});

// Detect if the mouse leaves the window and start random movement
document.addEventListener('mouseleave', () => {
  mouseOutside = true;
  movePupilRandomly();

  // Remove glow and dark mode when mouse leaves
  body.classList.remove('dark-mode');
  eye.classList.remove('glow');
  overlay.classList.remove('active'); // Hide the overlay

  // Stop jitter effect if active
  stopJitterEffect();
});

// Detect if the mouse enters the window and stop random movement
document.addEventListener('mouseenter', () => {
  mouseOutside = false;
});

// Set an interval for random movement when the mouse is far away or outside
setInterval(() => {
  if (isFar || mouseOutside) {
    movePupilRandomly();
  }
}, 7000); // Move randomly every 1 second for smoother transitions
