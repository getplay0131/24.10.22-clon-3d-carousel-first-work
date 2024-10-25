/**
 * 3D 이미지 캐러셀 구현
 *
 * 이 코드는 이미지들을 3D 공간에서 회전하는 캐러셀(회전목마)을 구현합니다.
 * 주요 기능: 자동 회전, 마우스 드래그로 회전, 마우스 휠로 확대/축소
 */

// ---------- 1. 기본 설정값 정의 ----------
let radius = 240; // 이미지들이 배치되는 원의 반지름 (px 단위)
let autoRotate = true; // 자동 회전 활성화 여부
let rotateSpeed = -60; // 회전 속도 (음수: 반시계 방향, 양수: 시계 방향)
let imgWidth = 120; // 개별 이미지의 너비 (px)
let imgHeight = 170; // 개별 이미지의 높이 (px)

// 1초 후에 초기화 함수 실행 (이미지 로딩 시간 확보)
setTimeout(init, 1000);

// ---------- 2. DOM 요소 선택 ----------
// 전체 컨테이너 (드래그 이벤트를 처리할 요소)
const dragContainer = document.getElementById("drag-container");
// 실제로 회전하는 컨테이너
const spinContainer = document.getElementById("spin-container");
// 모든 이미지 요소 선택
const imgs = spinContainer.getElementsByTagName("img");
// 이미지 요소들을 배열로 변환 (더 쉬운 처리를 위해)
const imgElement = [...imgs];

// ---------- 3. 컨테이너 크기 설정 ----------
// 회전하는 컨테이너의 크기를 이미지 크기에 맞춤
spinContainer.style.width = imgWidth + "px";
spinContainer.style.height = imgHeight + "px";

// 바닥 원판 요소 선택 및 크기 설정
const ground = document.querySelector(".ground");
// 바닥 원판은 이미지가 회전하는 반지름의 3배로 설정 (시각적 효과)
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// ---------- 4. 이미지 초기화 함수 ----------
/**
 * 이미지들을 3D 공간에 원형으로 배치하는 함수
 * @param {number} delaytime - 각 이미지의 전환 효과 지연 시간
 */
function init(delaytime) {
  for (let i = 0; i < imgElement.length; ++i) {
    // 각 이미지를 360도를 이미지 개수로 나눈 각도만큼 회전하여 배치
    imgElement[i].style.transform =
      "rotateY(" + // Y축을 기준으로 회전
      i * (360 / imgElement.length) + // 균등한 각도 계산
      "deg) translateZ(" + // Z축으로 이동 (원의 반지름)
      radius +
      "px)";

    // 부드러운 전환 효과 설정
    imgElement[i].style.transition = "transform 1s ease-in-out";
    // 각 이미지마다 다른 지연 시간 적용 (계단식 효과)
    imgElement[i].style.transitionDelay =
      delaytime || (imgElement.length - i) / 4 + "s";
  }
}

// ---------- 5. 회전 변환 적용 함수 ----------
/**
 * 마우스 드래그에 따른 회전 변환을 적용하는 함수
 * @param {HTMLElement} obj - 회전할 DOM 요소
 */
function applyTransform(obj) {
  // Y축 회전 각도 제한 (180도 이상 회전 방지)
  if (rotateY > 180) rotateY = 180;
  if (rotateY < 0) rotateY = 0;

  // 실제 회전 변환 적용
  obj.style.transform =
    "rotateX(" + -rotateY + "deg) rotateY(" + rotateX + "deg)";
}

// ---------- 6. 자동 회전 제어 함수 ----------
/**
 * 자동 회전을 제어하는 함수
 * @param {boolean} yes - 회전 활성화 여부
 */
function playSpin(yes) {
  spinContainer.style.animationPlayState = yes ? "running" : "paused";
}

// ---------- 7. 마우스 드래그 관련 변수들 ----------
let startX = 0, // 드래그 시작 X 좌표
  startY = 0, // 드래그 시작 Y 좌표
  nowX = 0, // 현재 마우스 X 좌표
  nowY = 0, // 현재 마우스 Y 좌표
  destinationX = 0, // X축 이동 거리
  destinationY = 0, // Y축 이동 거리
  rotateX = 0, // X축 회전 각도
  rotateY = 10; // Y축 회전 각도

// ---------- 8. 자동 회전 설정 ----------
if (autoRotate) {
  // 회전 방향에 따른 애니메이션 이름 설정
  let animationName = rotateSpeed > 0 ? "spin" : "spinrevert";
  // CSS 애니메이션 적용
  spinContainer.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
  )}s infinite linear`;
}

// ---------- 9. 마우스 이벤트 핸들러 ----------
// 마우스 버튼을 눌렀을 때
document.onpointerdown = function (e) {
  clearInterval(dragContainer.timer);
  e = e || window.event;

  // 드래그 시작 좌표 저장
  startX = e.clientX;
  startY = e.clientY;

  // 마우스 이동 중 처리
  this.onpointermove = function (e) {
    e = e || window.event;
    // 현재 좌표 갱신
    nowX = e.clientX;
    nowY = e.clientY;
    // 이동 거리 계산
    destinationX = nowX - startX;
    destinationY = nowY - startY;

    // 회전 각도 갱신 (이동 거리의 10%를 회전 각도로 사용)
    rotateX += destinationX * 0.1;
    rotateY += destinationY * 0.1;

    // 회전 변환 적용
    applyTransform(dragContainer);
    // 시작 좌표 갱신
    startX = nowX;
    startY = nowY;
  };

  // 마우스 버튼을 뗐을 때
  this.onpointerup = function (e) {
    // 관성 효과를 위한 타이머 설정
    dragContainer.timer = setInterval(function () {
      // 이동 거리를 점차 감소 (관성)
      destinationX *= 0.95;
      destinationY *= 0.95;
      // 회전 각도 갱신
      rotateX += destinationX * 0.1;
      rotateY += destinationY * 0.1;

      // 회전 변환 적용
      applyTransform(dragContainer);
      playSpin(false);

      // 거의 멈추면 자동 회전 재개
      if (Math.abs(destinationX) < 0.5 && Math.abs(destinationY) < 0.5) {
        clearInterval(dragContainer.timer);
        playSpin(true);
      }
    }, 17); // 약 60fps

    // 이벤트 핸들러 제거
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

// ---------- 10. 마우스 휠 이벤트 처리 ----------
// 크로스 브라우저 지원을 위한 이벤트 리스너 등록
if (document.addEventListener) {
  document.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
}
document.onmousewheel = mouseWheelHandler;

/**
 * 마우스 휠 이벤트 처리 함수
 * @param {Event} e - 휠 이벤트 객체
 */
function mouseWheelHandler(e) {
  e = e || window.event;
  let wheelDeltaValue;

  // 브라우저별 휠 이벤트 값 처리
  if (e.wheelDelta) {
    wheelDeltaValue = e.wheelDelta / 20;
  } else if (e.detail) {
    wheelDeltaValue = -e.detail;
  }

  // 반지름 조절
  radius += wheelDeltaValue;
  init(1);

  // 기본 스크롤 동작 방지
  if (e.preventDefault) {
    e.preventDefault();
  }
}
