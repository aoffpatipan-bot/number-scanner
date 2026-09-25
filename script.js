
const video=document.getElementById("video");
const canvas=document.getElementById("overlay");
const ctx=canvas.getContext("2d");

let nextNumber=1;
let busy=false;

document.getElementById("nextNumber").textContent=nextNumber;

document.getElementById("start").onclick=async()=>{

const stream=await navigator.mediaDevices.getUserMedia({
video:{facingMode:{ideal:"environment"}},
audio:false
});

video.srcObject=stream;
await video.play();

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

setInterval(scanFrame,100);

};

async function scanFrame(){

if(busy||!video.videoWidth)return;

busy=true;

ctx.drawImage(video,0,0,canvas.width,canvas.height);

const result=await Tesseract.recognize(canvas,"eng");

ctx.clearRect(0,0,canvas.width,canvas.height);

result.data.words.forEach(w=>{

if(w.text.trim()==String(nextNumber)){

const b=w.bbox;

ctx.strokeStyle="red";
ctx.lineWidth=6;

ctx.beginPath();

ctx.arc(
(b.x0+b.x1)/2,
(b.y0+b.y1)/2,
Math.max(b.x1-b.x0,b.y1-b.y0),
0,
Math.PI*2
);

ctx.stroke();

}

});

busy=false;

}

canvas.addEventListener("click",()=>{

nextNumber++;

document.getElementById("nextNumber").textContent=nextNumber;

});
