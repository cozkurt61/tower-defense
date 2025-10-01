import { map } from './map.js'
import { Enemy, EnemyTypes } from './enemy.js'
import { Tower, TowerTypes } from './tower.js'

let enemies = []
let towers = []
let wave = 0
let waveInProgress = false
let waveTimer = 0
const WAVE_INTERVAL = 180 // 3 saniye (60fps)

const canvas = document.getElementById('gameCanvas')
canvas.width = 1200
canvas.height = 700
const ctx = canvas.getContext('2d')

// Oyun döngüsü

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawMap()

  // Dalga yönetimi
  if (!waveInProgress && enemies.length === 0) {
    waveTimer++
    if (waveTimer > WAVE_INTERVAL) {
      startNextWave()
      waveTimer = 0
    }
  }

  // Düşmanları güncelle
  for (const enemy of enemies) {
    enemy.update()
  }
  // Kuleler ateş etsin
  for (const tower of towers) {
    tower.update(enemies)
    tower.draw(ctx)
  }
  // Düşmanları çiz ve ölüleri sil
  enemies = enemies.filter((e) => e.hp > 0)
  for (const enemy of enemies) {
    enemy.draw(ctx)
  }

  // Dalga ve skor bilgisini ekrana yaz
  ctx.save()
  ctx.font = '24px Arial'
  ctx.fillStyle = '#fff'
  ctx.fillText('Dalga: ' + wave, 30, 40)
  ctx.restore()

  requestAnimationFrame(gameLoop)
}

function startNextWave() {
  wave++
  waveInProgress = true
  // Düşman sayısı ve türü dalgaya göre artsın
  let count = 3 + wave
  for (let i = 0; i < count; i++) {
    let type
    if (wave % 3 === 0 && i % 2 === 0) type = EnemyTypes.armored
    else if (wave % 2 === 0 && i % 3 === 0) type = EnemyTypes.magic
    else type = EnemyTypes.normal
    // Düşmanlar aralıklı gelsin diye zamanlayıcı ile ekle
    setTimeout(() => {
      enemies.push(new Enemy(type, map.path))
      if (i === count - 1) waveInProgress = false
    }, i * 500)
  }
}

function drawMap() {
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 32
  ctx.beginPath()
  ctx.moveTo(map.path[0].x, map.path[0].y)
  for (let i = 1; i < map.path.length; i++) {
    ctx.lineTo(map.path[i].x, map.path[i].y)
  }
  ctx.stroke()
  for (const spot of map.towerSpots) {
    ctx.fillStyle = '#555'
    ctx.beginPath()
    ctx.arc(spot.x, spot.y, 28, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Başlangıçta kuleleri ekle
for (let i = 0; i < map.towerSpots.length; i++) {
  // İlk iki kule okçu, diğerleri sırayla okçu/büyücü
  let type
  if (i < 2) type = TowerTypes.archer
  else type = towers.length % 2 === 0 ? TowerTypes.archer : TowerTypes.mage
  towers.push(new Tower(type, map.towerSpots[i].x, map.towerSpots[i].y))
}

startNextWave()
gameLoop()
