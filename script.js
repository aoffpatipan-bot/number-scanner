
const video=document.getElementById("video");
const canvas=document.getElementById("overlay");
const ctx=canvas.getContext("2d");

let nextNumber=1;
document.getElementById("nextNumber").textContent=nextNumber;

document.getElementById("start").onclick=async()=>{
  try{
    const stream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode:{ideal:"environment"}},
      audio:false
    });

    video.srcObject=stream;
    await video.play();

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    alert("เปิดกล้องสำเร็จ 📷");
  }catch(err){
    alert("เปิดกล้องไม่ได้: "+err.message);
  }
};
