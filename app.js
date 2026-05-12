// 설정: 사귀기 시작한 날짜를 입력하세요 (예: 2024-01-01)
const startDate = new Date('2026-01-08'); 

function updateDDay() {
    const now = new Date();
    // 시간차를 밀리초 단위로 계산
    const diff = now - startDate;
    // 밀리초를 일(day) 단위로 변환 (내림 처리)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    
    document.getElementById('dday-counter').innerText = `D+${days}`;
    document.getElementById('anniversary-date').innerText = 
        `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()} ~`;
}

// 초기 실행
updateDDay();