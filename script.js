
const video=document.getElementById("video");
const canvas=document.getElementById("overlay");
const ctx=canvas.getContext("2d");

let nextNumber=1;
document.getElementById("nextNumber").innerText=nextNumber;

document.getElementById("start").onclick=async()=>{
 const stream=await navigator.mediaDevices.getUserMedia({
   video:{facingMode:"environment"}
 });
 video.srcObject=stream;
};

document.getElementById("scan").onclick=async()=>{
 canvas.width=video.videoWidth;
 canvas.height=video.videoHeight;
 ctx.drawImage(video,0,0);

 const result=await Tesseract.recognize(canvas,"eng");

 ctx.clearRect(0,0,canvas.width,canvas.height);

 result.data.words.forEach(word=>{
   if(word.text.trim()==nextNumber.toString()){
     const b=word.bbox;
     ctx.strokeStyle="red";
     ctx.lineWidth=5;
     ctx.beginPath();
     ctx.arc((b.x0+b.x1)/2,(b.y0+b.y1)/2,
       Math.max(b.x1-b.x0,b.y1-b.y0),
       0,Math.PI*2);
     ctx.stroke();
   }
 });
};

canvas.onclick=()=>{
 nextNumber++;
 document.getElementById("nextNumber").innerText=nextNumber;
};
