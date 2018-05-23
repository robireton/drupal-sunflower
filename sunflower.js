"use strict";

Drupal.behaviors.sunflower = {
  attach: (context, settings) => {
    const controlStep  = document.getElementById('controlStep')
    const controlPause = document.getElementById('controlPause')
    const controlStart = document.getElementById('controlStart')
    const controlBegin = document.getElementById('controlBegin')
    const controlEnd   = document.getElementById('controlEnd')
    const sunflower    = new Sunflower(document.getElementById('sunflower-canvas'), 8)
    let timer

    controlStep.max = sunflower.limit
    controlStep.value = sunflower.step

    controlStep.addEventListener('change', event => {sunflower.step = event.target.value})
    controlStep.addEventListener('input', event => {sunflower.step = event.target.value})

    controlStart.addEventListener('click', () => {
      controlStart.style.display = 'none'
      controlPause.style.display = 'inline-block'
      if (controlStep.value == controlStep.max) controlStep.value = 0
      timer = setInterval(() => {
        sunflower.step = controlStep.value++
        if (controlStep.value == controlStep.max) {
          clearInterval(timer)
          controlPause.style.display = 'none'
          controlStart.style.display = 'inline-block'
          sunflower.step = sunflower.limit
        }
      }, 20)
    })

    controlPause.addEventListener('click', () => {
      clearInterval(timer)
      controlPause.style.display = 'none'
      controlStart.style.display = 'inline-block'
    })

    controlBegin.addEventListener('click', () => {
      controlStep.value = 0
      sunflower.step = 0;
    })

    controlEnd.addEventListener('click', () => {
      clearInterval(timer)
      controlPause.style.display = 'none'
      controlStart.style.display = 'inline-block'
      controlStep.value = controlStep.max
      sunflower.step = sunflower.limit
    })

    sunflower.draw()
  }
}

class Sunflower {
  constructor(canvas, scale) {
    this._canvas = canvas
    this._scale  = scale
    this._radius = Math.floor(0.94*Math.min(this._canvas.width, this._canvas.height)/2)
    this._limit  = Math.floor(Math.pow(this._radius/this._scale, 2))
    this._step   = Math.floor(0.38 * this._limit)
    this._ctx    = this._canvas.getContext('2d')
  }

  get step() {
    return this._step;
  }

  set step(τ) {
    this._step = Math.max(0, Math.min(Math.floor(τ), this._limit))
    this.draw()
  }

  get limit() {
    return this._limit
  }

  draw() {
    this._ctx.save()
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    this._ctx.translate(this._canvas.width/2, this._canvas.height/2)

    this._ctx.fillStyle   = 'rgb(128, 128, 0)'
    this._ctx.strokeStyle = 'rgb(64, 96, 0)'
    this._ctx.lineWidth = this._scale + (this._scale / 2 * this._step / this._limit)
    this._ctx.beginPath()
    this._ctx.arc(0, 0, this._scale * (1 + Math.sqrt(this._step)), 0, 2*Math.PI, false)
    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.closePath()

    this._ctx.strokeStyle = 'rgb(16, 64, 0)'
    this._ctx.fillStyle   = 'rgb(200, 200, 0)'
    this._ctx.lineCap     = 'square'

    for (let seed = 0; seed <= this._step; seed++) {
        this.place(seed, this._step)
    }
    this._ctx.restore()

    // if (parseInt(this._step) < parseInt(this._step.max)) {
    //     if (this._start.style.display == 'none') {
    //         this._step++
    //         setTimeout( () => sunflower.draw(), 20)
    //     }
    // }
    // else {
    //     this._pause.style.display = 'none'
    //     this._start.style.display = 'inline-block'
    // }
  }

  place(seed, frame) {
      this._ctx.save()
      const φ_radians = Math.PI * (1 + Math.sqrt(5))
      const ρ    = this._scale * Math.sqrt(frame-seed)
      const size = this._scale + (this._scale/2 * (frame-seed) / this._limit)

      this._ctx.lineWidth = size/3
      this._ctx.rotate(seed * φ_radians)
      this._ctx.beginPath()
      this._ctx.moveTo(ρ-size/2,        0)
      this._ctx.lineTo(ρ,          size/2)
      this._ctx.lineTo(ρ+size/2,        0)
      this._ctx.lineTo(ρ,         -size/2)
      this._ctx.lineTo(ρ-size/2,        0)
      this._ctx.fill()
      this._ctx.stroke()
      this._ctx.restore()
  }

}
