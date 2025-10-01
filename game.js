// Temel oyun döngüsü ve ana yapılar
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// Harita verisi (tek harita)
const map = {
  path: [
    { x: 50, y: 300 },
    { x: 200, y: 300 },
    { x: 200, y: 100 },
    { x: 600, y: 100 },
    { x: 600, y: 500 },
    { x: 750, y: 500 },
  ],
  towerSpots: [
    { x: 150, y: 200 },
    { x: 350, y: 150 },
    { x: 500, y: 400 },
    { x: 650, y: 250 },
  ],
}

// Oyun döngüsü
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawMap()
  // ...düşman, kule, mermi çizimleri ve güncellemeleri...
  requestAnimationFrame(gameLoop)
}

function drawMap() {
  // Yol çizimi
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) {
    ctx.lineTo(map.path[i].x, map.path[i].y)
  }
  ctx.stroke()
  // Kule yerleri
  for (const spot of map.towerSpots) {
    ctx.fillStyle = '#555'
    ctx.beginPath()
    ctx.arc(spot.x, spot.y, 20, 0, Math.PI * 2)
    ctx.fill()
  }
}

gameLoop()
