// utils/getRandomDirection.js
export function getRandomDirection() {
    const directions = ['left', 'right', 'up', 'down'];
    const random = Math.random();
  
    if (random < 0.35) return 'left';   // 35%
    if (random < 0.70) return 'right';  // 35%
    if (random < 0.85) return 'up';     // 15%
    return 'down';                      // 15%
  }
  