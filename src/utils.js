

function getColorFromNumber(n)
{
  if(n == 0) return "Grey";   // Nicht gedeckt
  if(n == 1) return "Gold";   // Gold/Entropie
  if(n == 2) return "Indianred";  // Futter
  if(n == 3) return "Dodgerblue"; // Wasser
  if(n == 4) return "Limegreen";  // Land
  if(n == 5) return "SandyBrown";  // Wasser
}


function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  
  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  }
  
  module.exports = { randomIntFromRange, randomColor, distance, getColorFromNumber }
  