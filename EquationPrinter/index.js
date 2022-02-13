$(document).ready(function() {
    print();
})

function print() {
    var canvas = document.getElementById('printer');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        //ctx.scale(1, 1);

        canvas.width = 900;
        canvas.height = 450;

        /*
        // Filled triangle
        ctx.beginPath();
        ctx.moveTo(25,25);
        ctx.lineTo(105,25);
        ctx.lineTo(25,105);
        ctx.fill();

        // Stroked triangle
        ctx.beginPath();
        ctx.moveTo(125,125);
        ctx.lineTo(125,45);
        ctx.lineTo(45,125);
        ctx.closePath();
        ctx.stroke();*/

        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = "3";
        ctx.beginPath();
        ctx.moveTo(0, g(0));
        for (var index = 0; index <= 100; index += 1){
            ctx.lineTo(index + 50, g(index));
        }
        ctx.stroke();

        ctx.strokeStyle = "#0000FF";
        ctx.beginPath();
        ctx.moveTo(0, g(0));
        for (var index = 0; index <= 100; index += 0.001){
            ctx.lineTo(index, g(index));
        }
        ctx.stroke();
    }
    else console.log("Error- 找不到 Canvas (index.js.print())")
}

function f(x) {
    return x + 10;
}

function g(x) {
    return Math.pow(x, 2);
}
