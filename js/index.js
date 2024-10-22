let radius = 240; //이미지들이 배치되는 원의 반지름
let autoRotate = true; // 자동 회전 값
let rotateSpeed = -60; // 회전 속도
let imgWidth = 120; // 이미지의 너비
let imgHeight = 170; // 이미지의 높이
setTimeout(init, 1000);

const dragContainer = document.getElementById("drag-container");
const spinContainer = document.getElementById("spin-container");

const imgs = spinContainer.getElementsByTagName("img");

const imgElement = [...imgs];

spinContainer.style.width = imgWidth + "px";
spinContainer.style.height = imgHeight + "px";

const ground = document.querySelector(".ground");

ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delaytime) {
  for (let i = 0; i < imgElement.length; ++i) {
    imgElement[i].style.transform =
      "rotateY(" +
      i * (360 / imgElement.length) +
      "deg) translateZ(" +
      radius +
      "px)";

    imgElement[i].style.transition = "transform 1s ease-in-out";
    imgElement[i].style.transitionDelay =
      delaytime || (imgElement.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (rotateY > 180) rotateY = 180;
  if (rotateY < 0) rotateY = 0;
  obj.style.transform =
    "rotateX(" + -rotateY + "deg) rotateY(" + rotateX + "deg)";
}

function playSpin(yes) {
  spinContainer.style.animationPlayState = yes ? "running" : "paused";
}

let startX = 0,
  startY = 0,
  nowX = 0,
  nowY = 0,
  destinationX = 0,
  destinationY = 0,
  rotateX = 0,
  rotateY = 10;
if (autoRotate) {
  let animationName = rotateSpeed > 0 ? "spin" : "spinrevert";
  spinContainer.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
  )}s infinite linear`;
}

document.onpointerdown = function (e) {
  clearInterval(dragContainer.timer);

  e = e || window.event;

  startX = e.clientX;
  startY = e.clientY;
  this.onpointermove = function (e) {
    e = e || window.event;
    nowX = e.clientX;
    nowY = e.clientY;
    destinationX = nowX - startX;
    destinationY = nowY - startY;

    rotateX += destinationX * 0.1;
    rotateY += destinationY * 0.1;

    applyTransform(dragContainer);
    startX = nowX;
    startY = nowY;
  };
  this.onpointerup = function (e) {
    dragContainer.timer = setInterval(function () {
      destinationX *= 0.95;
      destinationY *= 0.95;
      rotateX += destinationX * 0.1;
      rotateY += destinationY * 0.1;

      applyTransform(dragContainer);
      playSpin(false);

      if (Math.abs(destinationX) < 0.5 && Math.abs(destinationY) < 0.5) {
        clearInterval(dragContainer.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

// 마우스 휠 이벤트 크로스브라우저 지원
if (document.addEventListener) {
  document.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
}
document.onmousewheel = mouseWheelHandler;

function mouseWheelHandler(e) {
  e = e || window.event;
  let wheelDeltaValue;

  // 파이어폭스와 다른 브라우저 호환성 처리
  if (e.wheelDelta) {
    wheelDeltaValue = e.wheelDelta / 20;
  } else if (e.detail) {
    wheelDeltaValue = -e.detail;
  }

  radius += wheelDeltaValue;
  init(1);

  // 기본 스크롤 동작 방지
  if (e.preventDefault) {
    e.preventDefault();
  }
}
