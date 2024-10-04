const eye = document.querySelector('.eye');
const pupil = document.querySelector('.pupil');

let isFar = false; // To track whether the cursor is far from the eye

// Function to move the pupil randomly
function movePupilRandomly() {
  const randomAngle = Math.random() * Math.PI * 2; // Random angle
  const maxPupilMovement = 30; // How far the pupil can move
  const pupilX = Math.cos(randomAngle) * maxPupilMovement;
  const pupilY = Math.sin(randomAngle) * maxPupilMovement;
  pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
}

// Function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

document.addEventListener('mousemove', (e) => {
  const eyeRect = eye.getBoundingClientRect();
  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2;

  const distance = calculateDistance(eyeCenterX, eyeCenterY, e.pageX, e.pageY);
  const distanceThreshold = 600; // Set the threshold distance

  if (distance > distanceThreshold) {
    // If mouse is far from the eye, move randomly
    if (!isFar) {
      isFar = true;
      movePupilRandomly();
    }
  } else {
    // Follow the mouse if it's within the threshold
    isFar = false;

    const angle = Math.atan2(e.pageY - eyeCenterY, e.pageX - eyeCenterX);

    const maxPupilMovement = 30; // How far the pupil can move
    const pupilX = Math.cos(angle) * maxPupilMovement;
    const pupilY = Math.sin(angle) * maxPupilMovement;

    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  }
});

// Set an interval for random movement when the mouse is far away
setInterval(() => {
  if (isFar) {
    movePupilRandomly();
  }
}, 1000); // Move randomly every second
