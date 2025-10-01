// tower.js - Tower sınıfı ve TowerTypes

import { DamageType } from './enemy.js'

export class Tower {
  constructor(type, x, y) {
    this.type = type
    this.x = x
    this.y = y
    this.range = type.range
    this.damage = type.damage
    this.damageType = type.damageType
    this.fireRate = type.fireRate
    this.cooldown = 0
  }
  update(enemies) {
    if (this.cooldown > 0) {
      this.cooldown--
      return
    }
    // En yakın menzildeki düşmanı bul
    let target = null
    let minDist = Infinity
    for (const enemy of enemies) {
      const dx = enemy.x - this.x
      const dy = enemy.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= this.range && enemy.hp > 0 && dist < minDist) {
        minDist = dist
        target = enemy
      }
    }
    if (target) {
      // Hasar uygula (dirençle)
      let resist = target.resist[this.damageType] || 0
      let realDamage = this.damage * (1 - resist)
      target.hp -= realDamage
      this.cooldown = this.fireRate
    }
  }
  draw(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, 22, 0, Math.PI * 2)
    ctx.fillStyle = this.type.color
    ctx.fill()
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 2
    ctx.stroke()
    // Okçu kulesi için yay ve ok
    if (this.type.name === 'Okçu') {
      ctx.beginPath()
      ctx.arc(this.x, this.y, 14, Math.PI * 0.7, Math.PI * 2.3)
      ctx.strokeStyle = '#964B00'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + 14, this.y)
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(this.x + 14, this.y)
      ctx.lineTo(this.x + 10, this.y - 3)
      ctx.moveTo(this.x + 14, this.y)
      ctx.lineTo(this.x + 10, this.y + 3)
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    // Büyücü kulesi için yıldız
    if (this.type.name === 'Büyücü') {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(Math.PI / 8)
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(0, 10)
        ctx.translate(0, 10)
        ctx.rotate((Math.PI * 2) / 10)
        ctx.lineTo(0, -10)
        ctx.translate(0, -10)
        ctx.rotate(-((Math.PI * 6) / 10))
      }
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
    }
    ctx.restore()
  }
}

export const TowerTypes = {
  archer: {
    name: 'Okçu',
    damage: 30,
    damageType: DamageType.PHYSICAL,
    range: 120,
    fireRate: 60, // frame
    color: '#fc3',
  },
  mage: {
    name: 'Büyücü',
    damage: 22,
    damageType: DamageType.MAGIC,
    range: 110,
    fireRate: 50,
    color: '#3cf',
  },
}
