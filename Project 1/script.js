const nav = document.querySelectorAll(".style");
const title = document.querySelectorAll(".title");
const doc = document.querySelectorAll(".doc");

const start = document.querySelectorAll(".start");
const wstep = document.querySelectorAll(".wstep");
const mat = document.querySelectorAll(".mat");
const wzory = document.querySelectorAll(".wzory");
const zegar = document.querySelectorAll(".zegar");
const docu = document.querySelectorAll(".docu");

function draw(){
  var posh = 450;
  var posv = 350;
  var posv_start=posv;
  var prawo=true;
  var lewo=false;
  var gora=true;
  var dol=false;
  var id = setInterval(draw2, 10);
  function draw2(){
    var circle = document.getElementById('wachadlo1');
  	var ctx= circle.getContext('2d');
  	ctx.clearRect(0, 0, 700, 600);
    circle.width = 1;
  	circle.width = 700;

  	ctx.arc(posv, posh, 30, 0, 2*Math.PI, false);
    ctx.rect(300, 30, 100, 30);
    ctx.moveTo(posv_start, 60);
    ctx.lineTo(posv, posh);
  	ctx.strokeStyle = 'rgb(52, 63, 83)';
    ctx.fillStyle = 'rgb(52, 63, 83)';
  	ctx.lineWidth = 1;
    ctx.fill();
  	ctx.stroke();
    if(prawo){
      posv++;
    }
    if(!prawo){
      posv--;
    }
    if(lewo){
      posv--;
    }
    if(!lewo){
      posv++;
    }
    if(gora){
      posh=posh-0.5;
    }
    if(dol){
      posh=posh+0.5;
    }
    if(posv==600){
      prawo=false;
      lewo=true;
    }
    if(posv==100){
      prawo=true;
      lewo=false;
    }
    if(posv==600 || posv==100){
      gora=false;
      dol=true;
    }
    if(posv==350){
      gora=true;
      dol=false;
    }
  }
  var posh2 = 350;
  var posv2 = 150;
  var posv2_start=posv2;
  var prawo2=true;
  var lewo2=false;
  var gora2=true;
  var dol2=false;
  var id2 = setInterval(draw3, 15);
  function draw3(){
    var circle1 = document.getElementById('wachadlo2');
  	var ctx1= circle1.getContext('2d');
  	ctx1.clearRect(0, 0, 300, 400);
    circle1.width = 1;
  	circle1.width = 300;

  	ctx1.arc(posv2, posh2, 20, 0, 2*Math.PI, false);
    ctx1.rect(125, 30, 50, 30);
    ctx1.moveTo(posv2_start, 60);
    ctx1.lineTo(posv2, posh2);
  	ctx1.strokeStyle = 'rgb(52, 63, 83)';
    ctx1.fillStyle = 'rgb(52, 63, 83)';
  	ctx1.lineWidth = 1;
    ctx1.fill();
  	ctx1.stroke();
    if(prawo2){
      posv2++;
    }
    if(!prawo2){
      posv2--;
    }
    if(lewo2){
      posv2--;
    }
    if(!lewo2){
      posv2++;
    }
    if(gora2){
      posh2=posh2-0.5;
    }
    if(dol2){
      posh2=posh2+0.5;
    }
    if(posv2==250){
      prawo2=false;
      lewo2=true;
    }
    if(posv2==50){
      prawo2=true;
      lewo2=false;
    }
    if(posv2==250 || posv2==50){
      gora2=false;
      dol2=true;
    }
    if(posv2==150){
      gora2=true;
      dol2=false;
    }
  }
}

function displ(){
  if(this==nav[0]){
    wstep[0].classList.remove("hide");
    wstep[0].classList.add("show");

    start[0].classList.remove("show");
    start[0].classList.add("hide");
    mat[0].classList.remove("show");
    mat[0].classList.add("hide");
    wzory[0].classList.remove("show");
    wzory[0].classList.add("hide");
    zegar[0].classList.remove("show");
    zegar[0].classList.add("hide");
    docu[0].classList.remove("show");
    docu[0].classList.add("hide");
  }
  if(this==nav[1]){
    mat[0].classList.remove("hide");
    mat[0].classList.add("show");

    start[0].classList.remove("show");
    start[0].classList.add("hide");
    wstep[0].classList.remove("show");
    wstep[0].classList.add("hide");
    wzory[0].classList.remove("show");
    wzory[0].classList.add("hide");
    zegar[0].classList.remove("show");
    zegar[0].classList.add("hide");
    docu[0].classList.remove("show");
    docu[0].classList.add("hide");
  }
  if(this==nav[2]){
    wzory[0].classList.remove("hide");
    wzory[0].classList.add("show");

    start[0].classList.remove("show");
    start[0].classList.add("hide");
    wstep[0].classList.remove("show");
    wstep[0].classList.add("hide");
    mat[0].classList.remove("show");
    mat[0].classList.add("hide");
    zegar[0].classList.remove("show");
    zegar[0].classList.add("hide");
    docu[0].classList.remove("show");
    docu[0].classList.add("hide");
  }
  if(this==nav[3]){
    zegar[0].classList.remove("hide");
    zegar[0].classList.add("show");

    start[0].classList.remove("show");
    start[0].classList.add("hide");
    wstep[0].classList.remove("show");
    wstep[0].classList.add("hide");
    mat[0].classList.remove("show");
    mat[0].classList.add("hide");
    wzory[0].classList.remove("show");
    wzory[0].classList.add("hide");
    docu[0].classList.remove("show");
    docu[0].classList.add("hide");
  }
}

function displ2(){
  start[0].classList.remove("hide");
  start[0].classList.add("show");

  wstep[0].classList.remove("show");
  wstep[0].classList.add("hide");
  mat[0].classList.remove("show");
  mat[0].classList.add("hide");
  wzory[0].classList.remove("show");
  wzory[0].classList.add("hide");
  zegar[0].classList.remove("show");
  zegar[0].classList.add("hide");
  docu[0].classList.remove("show");
  docu[0].classList.add("hide");
}

function displ3(){
  docu[0].classList.remove("hide");
  docu[0].classList.add("show");

  start[0].classList.remove("show");
  start[0].classList.add("hide");
  wstep[0].classList.remove("show");
  wstep[0].classList.add("hide");
  mat[0].classList.remove("show");
  mat[0].classList.add("hide");
  wzory[0].classList.remove("show");
  wzory[0].classList.add("hide");
  zegar[0].classList.remove("show");
  zegar[0].classList.add("hide");
}

window.onload=draw;

nav.forEach(n => n.addEventListener("click",displ));
title.forEach(t => t.addEventListener("click",displ2));
doc.forEach(d => d.addEventListener("click",displ3));
