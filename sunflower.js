(function ($) {

    var phi_radians = Math.PI * (1 + Math.sqrt(5))
    var sunflower;

    $(document).ready( function() {
        var canvas = document.getElementById('canvas');
        sunflower = new Sunflower(Math.floor(0.94*Math.min(canvas.width, canvas.height)/2), 8)

        var element = document.getElementById('controlStep');
        if (element.type == 'range') element.style.display = 'block';
        element.max = sunflower.limit;
        element.value = Math.floor(0.38 * sunflower.limit);
        element.style.width = canvas.width + 'px';
        element.addEventListener('change', handleNewRange, false);

        element = document.getElementById('controlPause');
        element.style.display = 'none';
        element.addEventListener('click', (function () {this.style.display = 'none'; document.getElementById('controlStart').style.display = 'inline-block'; sunflower.draw();}), false);

        element = document.getElementById('controlStart');
        element.addEventListener('click', (function () {this.style.display = 'none'; document.getElementById('controlPause').style.display = 'inline-block'; if (document.getElementById('controlStep').value >= sunflower.limit) document.getElementById('controlStep').value = 0; sunflower.draw();}), false);

        element = document.getElementById('controlBegin');
        element.addEventListener('click', (function () {document.getElementById('controlStep').value = 0; sunflower.draw();}), false);

        element = document.getElementById('controlEnd');
        element.addEventListener('click', (function () {document.getElementById('controlStep').value = sunflower.limit; sunflower.draw();}), false);

        element = document.getElementById('buttons');
        element.style.width = canvas.width + 'px';
        element.style.display = 'block';

        sunflower.draw();
    } );

    function handleNewRange() {
        sunflower.draw();
    }

    function Sunflower(radius, scale) {
        this.radius = radius;
        this.scale  = scale;
        this.limit  = Math.floor(Math.pow(radius/scale, 2));

        this.draw = (function () {
            var control = document.getElementById('controlStep');
            if (control.value > this.limit) {
                control.value = this.limit;
            }
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width/2, canvas.height/2);

            ctx.fillStyle   = 'rgb(128, 128, 0)';
            ctx.strokeStyle = 'rgb(64, 96, 0)';
            ctx.lineWidth = this.scale + (this.scale / 2 * control.value / this.limit);
            ctx.beginPath();
            ctx.arc(0, 0, this.scale * (1 + Math.sqrt(control.value)), 0, 2*Math.PI, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = 'rgb(16, 64, 0)';
            ctx.fillStyle   = 'rgb(200, 200, 0)';
            ctx.lineCap     = 'square';

            for (seed = 0; seed <= control.value; seed++) {
                this.place(ctx, seed, control.value);
            }
            ctx.restore();

            if (parseInt(control.value, 10) < parseInt(control.max, 10)) {
                if (document.getElementById('controlStart').style.display == 'none') {
                    control.value++;
                    setTimeout((function () {sunflower.draw()}), 20);
                }
            }
            else {
                document.getElementById('controlPause').style.display = 'none';
                document.getElementById('controlStart').style.display = 'inline-block';
            }

            return true;
        });

        this.place = (function (context, seed, frame) {
            context.save();
            var rho = this.scale * Math.sqrt(frame-seed);
            var size = this.scale + (this.scale/2 * (frame-seed) / this.limit);

            context.lineWidth = size/3;
            context.rotate(seed * phi_radians);
            context.beginPath();
            context.moveTo(rho-size/2,        0);
            context.lineTo(rho,          size/2);
            context.lineTo(rho+size/2,        0);
            context.lineTo(rho,         -size/2);
            context.lineTo(rho-size/2,        0);
            context.fill();
            context.stroke();
            context.restore();
        });
    }
})(jQuery);
