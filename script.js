const video=document.getElementById("video");
const canvas=document.getElementById("overlay");
const ctx=canvas.getContext("2d");
const status=document.getElementById("status");

let nextNumber=1;

document.getElementById("nextNumber").textContent=nextNumber;

document.getElementById("start").onclick=async()=>{

  try{

    const stream=await navigator.mediaDevices.getUserMedia({
      video:{
        facingMode:{ideal:"environment"}
      },
      audio:false
    });

    video.srcObject=stream;
    await video.play();

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    status.textContent="📷 เปิดกล้องสำเร็จ";

  }catch(err){

    status.textContent="❌ เปิดกล้องไม่ได้: "+err.message;
    console.error(err);

  }

};

document.getElementById("scan").onclick=async()=>{

  if(!video.videoWidth){

    status.textContent="กรุณาเปิดกล้องก่อน";
    return;

  }

  status.textContent="กำลังสแกน...";

  ctx.drawImage(video,0,0,canvas.width,canvas.height);

  const result=await Tesseract.recognize(canvas,"eng");

  ctx.clearRect(0,0,canvas.width,canvas.height);

  let found=false;

  result.data.words.forEach(word=>{

    if(word.text.trim()==String(nextNumber)){

      found=true;

      const b=word.bbox;

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

  status.textContent=found
    ? `พบเลข ${nextNumber} แล้ว`
    : `ไม่พบเลข ${nextNumber}`;

};

canvas.addEventListener("click",()=>{

  nextNumber++;

  document.getElementById("nextNumber").textContent=nextNumber;

});
