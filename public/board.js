console.log("Board Script");
canvas = document.getElementById("white");
let test = document.getElementById("test");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;
 let ctx = canvas.getContext("2d");

var a;
var b;
let mouseDown= false;

window.onmousemove=(e)=>{
    a=e.clientX;
    b=e.clientY;
    if(mouseDown)
    {
     ctx.lineTo(a,b);
     ctx.stroke();
    }  
}

window.onmousedown=(e)=>{
    ctx.moveTo(a,b);
    mouseDown = true;
}

window.onmouseup=(e)=>{
    mouseDown = false;
}