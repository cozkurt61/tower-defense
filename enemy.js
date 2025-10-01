// enemy.js - Enemy sınıfı ve EnemyTypes

export const DamageType = {
  PHYSICAL: 'physical',
  MAGIC: 'magic',
}

export class Enemy {
  constructor(type, path) {
    this.type = type
    this.path = path
    this.pathIndex = 0
    this.x = path[0].x
    this.y = path[0].y
    this.hp = type.hp
    this.speed = type.speed
    this.resist = type.resist
    this.radius = 18
  }
  update() {
    if (this.pathIndex < this.path.length - 1) {
      const target = this.path[this.pathIndex + 1]
      const dx = target.x - this.x
      const dy = target.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < this.speed) {
        this.x = target.x
        this.y = target.y
        this.pathIndex++
      } else {
        this.x += (dx / dist) * this.speed
        this.y += (dy / dist) * this.speed
      }
    }
  }
  draw(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.type.color
    ctx.fill()
    ctx.strokeStyle = '#222'
    ctx.stroke()
    // Gözler
    ctx.beginPath()
    ctx.arc(this.x - 6, this.y - 4, 3, 0, Math.PI * 2)
    ctx.arc(this.x + 6, this.y - 4, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x - 6, this.y - 4, 1.2, 0, Math.PI * 2)
    ctx.arc(this.x + 6, this.y - 4, 1.2, 0, Math.PI * 2)
    ctx.fillStyle = '#222'
    ctx.fill()
    // Ağız
    ctx.beginPath()
    ctx.arc(this.x, this.y + 5, 6, 0, Math.PI)
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 1.2
    ctx.stroke()
    // Zırhlı düşman için halka
    if (this.type.name === 'Zırhlı') {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2)
      ctx.strokeStyle = '#bbb'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    // Büyülü düşman için parıltı
    if (this.type.name === 'Büyülü') {
      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius + 7, 0, Math.PI * 2)
      ctx.fillStyle = '#b6f'
      ctx.fill()
      ctx.restore()
    }
    // Can barı
    ctx.fillStyle = 'red'
    ctx.fillRect(
      this.x - 16,
      this.y - this.radius - 10,
      32 * (this.hp / this.type.hp),
      4
    )
    ctx.restore()
  }
}

export const EnemyTypes = {
  normal: {
    name: 'Normal',
    hp: 100,
    speed: 1.5,
    resist: { physical: 0, magic: 0 },
    color: '#6cf',
  },
  armored: {
    name: 'Zırhlı',
    hp: 180,
    speed: 1.1,
    resist: { physical: 0.5, magic: 0 },
    color: '#888',
  },
  magic: {
    name: 'Büyülü',
    hp: 120,
    speed: 1.3,
    resist: { physical: 0, magic: 0.5 },
    color: '#b6f',
  },
}
