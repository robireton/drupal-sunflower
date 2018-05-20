'use strict';

let sunflower

Drupal.behaviors.sunflower = {
  attach: function(context, settings) {
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
    controlPause.addEventListener('click', (function () {this.style.display = 'none'; controlStart.style.display = 'inline-block'; sunflower.draw();}), false)
    controlStart.addEventListener('click', (function () {this.style.display = 'none'; controlPause.style.display = 'inline-block'; if (controlStep.value >= sunflower.limit) controlStep.value = 0; sunflower.draw();}), false)
    controlBegin.addEventListener('click', (function () {controlStep.value = 0; sunflower.draw();}), false)
    controlEnd.addEventListener('click', (function () {controlStep.value = sunflower.limit; sunflower.draw();}), false)

    sunflower.draw()
  }
}

function Sunflower(radius, scale) {
    this.radius = radius
    this.scale  = scale
    this.limit  = Math.floor(Math.pow(radius/scale, 2))

    this.draw = (function () {
        const controlStep = document.getElementById('controlStep')
        if (controlStep.value > this.limit) {
            controlStep.value = this.limit
        }
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(canvas.width/2, canvas.height/2)

        ctx.fillStyle   = 'rgb(128, 128, 0)'
        ctx.strokeStyle = 'rgb(64, 96, 0)'
        ctx.lineWidth = this.scale + (this.scale / 2 * controlStep.value / this.limit)
        ctx.beginPath()
        ctx.arc(0, 0, this.scale * (1 + Math.sqrt(controlStep.value)), 0, 2*Math.PI, false)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.strokeStyle = 'rgb(16, 64, 0)'
        ctx.fillStyle   = 'rgb(200, 200, 0)'
        ctx.lineCap     = 'square'

        for (let seed = 0; seed <= controlStep.value; seed++) {
            this.place(ctx, seed, controlStep.value)
        }
        ctx.restore()

        if (parseInt(controlStep.value, 10) < parseInt(controlStep.max, 10)) {
            if (document.getElementById('controlStart').style.display == 'none') {
                controlStep.value++
                setTimeout((function () {sunflower.draw()}), 20)
            }
        }
        else {
            document.getElementById('controlPause').style.display = 'none'
            document.getElementById('controlStart').style.display = 'inline-block'
        }

        return true
    })

    this.place = function (context, seed, frame) {
        context.save()
        const φ_radians = Math.PI * (1 + Math.sqrt(5))
        const ρ    = this.scale * Math.sqrt(frame-seed)
        const size = this.scale + (this.scale/2 * (frame-seed) / this.limit)

        context.lineWidth = size/3
        context.rotate(seed * φ_radians)
        context.beginPath()
        context.moveTo(ρ-size/2,        0)
        context.lineTo(ρ,          size/2)
        context.lineTo(ρ+size/2,        0)
        context.lineTo(ρ,         -size/2)
        context.lineTo(ρ-size/2,        0)
        context.fill()
        context.stroke()
        context.restore()
    }
}
