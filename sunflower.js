'use strict';

let sunflower

Drupal.behaviors.sunflower = {
  attach: (context, settings) => {
    const canvas       = document.getElementById('canvas')
    const controlStep  = document.getElementById('controlStep')
    const controlPause = document.getElementById('controlPause')
    const controlStart = document.getElementById('controlStart')
    const controlBegin = document.getElementById('controlBegin')
    const controlEnd   = document.getElementById('controlEnd')
    const buttons      = document.getElementById('buttons')

    sunflower = new Sunflower(Math.floor(0.94*Math.min(canvas.width, canvas.height)/2), 8)

    if (controlStep.type == 'range') controlStep.style.display = 'block'
    controlStep.max = sunflower.limit
    controlStep.value = Math.floor(0.38 * sunflower.limit)
    controlStep.style.width = canvas.width + 'px'
    controlPause.style.display = 'none'
    buttons.style.width = canvas.width + 'px'
    buttons.style.display = 'block'

    controlStep.addEventListener('change', () => {sunflower.draw()}, false)
    controlPause.addEventListener('click', function () {this.style.display = 'none'; controlStart.style.display = 'inline-block'; sunflower.draw()}, false)
    controlStart.addEventListener('click', function () {this.style.display = 'none'; controlPause.style.display = 'inline-block'; if (controlStep.value >= sunflower.limit) controlStep.value = 0; sunflower.draw()}, false)
    controlBegin.addEventListener('click', () => {controlStep.value = 0; sunflower.draw()}, false)
    controlEnd.addEventListener('click', () => {controlStep.value = sunflower.limit; sunflower.draw()}, false)

    sunflower.draw()
  }
}

class Sunflower {
  constructor(radius, scale) {
    this.radius = radius
    this.scale  = scale
    this.limit  = Math.floor(Math.pow(radius/scale, 2))
    this.step   = document.getElementById('controlStep')
    this.start  = document.getElementById('controlStart')
    this.pause  = document.getElementById('controlPause')
    this.canvas = document.getElementById('canvas')
    this.ctx    = canvas.getContext('2d')
  }

  draw() {
    if (this.step.value > this.limit) {
        this.step.value = this.limit
    }

    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.translate(this.canvas.width/2, this.canvas.height/2)

    this.ctx.fillStyle   = 'rgb(128, 128, 0)'
    this.ctx.strokeStyle = 'rgb(64, 96, 0)'
    this.ctx.lineWidth = this.scale + (this.scale / 2 * this.step.value / this.limit)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.scale * (1 + Math.sqrt(this.step.value)), 0, 2*Math.PI, false)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.strokeStyle = 'rgb(16, 64, 0)'
    this.ctx.fillStyle   = 'rgb(200, 200, 0)'
    this.ctx.lineCap     = 'square'

    for (let seed = 0; seed <= this.step.value; seed++) {
        this.place(seed, this.step.value)
    }
    this.ctx.restore()

    if (parseInt(this.step.value) < parseInt(this.step.max)) {
        if (this.start.style.display == 'none') {
            this.step.value++
            setTimeout( () => sunflower.draw(), 20)
        }
    }
    else {
        this.pause.style.display = 'none'
        this.start.style.display = 'inline-block'
    }
  }

  place(seed, frame) {
      this.ctx.save()
      const φ_radians = Math.PI * (1 + Math.sqrt(5))
      const ρ    = this.scale * Math.sqrt(frame-seed)
      const size = this.scale + (this.scale/2 * (frame-seed) / this.limit)

      this.ctx.lineWidth = size/3
      this.ctx.rotate(seed * φ_radians)
      this.ctx.beginPath()
      this.ctx.moveTo(ρ-size/2,        0)
      this.ctx.lineTo(ρ,          size/2)
      this.ctx.lineTo(ρ+size/2,        0)
      this.ctx.lineTo(ρ,         -size/2)
      this.ctx.lineTo(ρ-size/2,        0)
      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.restore()
  }

}
