const startDate = new Date('2026-01-08'); // 실제 날짜로 수정하세요!

function initApp() {
    updateDDay();
    renderCalendar();
}

function updateDDay() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('dday-count').innerText = `D+${days}`;
    document.getElementById('start-date-display').innerText = 
        `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일부터 시작`;
}

function renderCalendar() {
    const now = new Date();
    const viewYear = now.getFullYear();
    const viewMonth = now.getMonth();

    document.getElementById('cal-month').innerText = `${viewMonth + 1}월`;
    document.getElementById('cal-year').innerText = viewYear;

    // 지난 달 마지막 날, 이번 달 마지막 날 계산
    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();
    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    // 달력 채우기 로직 (간략화)
    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
            prevDates.unshift(' '); // 빈칸 처리
        }
    }

    const displayDates = [...prevDates, ...thisDates];
    const daysContainer = document.getElementById('calendar-days');
    
    daysContainer.innerHTML = displayDates.map(date => 
        `<div class="day">${date}</div>`
    ).join('');
}

// 현재 달력을 보여주는 기준 날짜 변수 (전역)
let date = getKST(); 

function renderCalendar() {
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();
    
    // 오늘 날짜 강조를 위해 실제 '오늘' 정보 따로 저장
    const now = getKST();
    const isThisMonth = (viewYear === now.getFullYear() && viewMonth === now.getMonth());

    document.getElementById('cal-month').innerText = `${viewMonth + 1}월`;
    document.getElementById('cal-year').innerText = viewYear;

    // ... 기존 캘린더 계산 로직 동일 ...

    daysContainer.innerHTML = displayDates.map(d => {
        // 이번 달이면서 오늘 날짜일 때만 today 클래스 추가
        const isToday = (isThisMonth && d === now.getDate()) ? 'today' : '';
        return `<div class="day ${isToday}">${d}</div>`;
    }).join('');
}

// 버튼 이벤트 리스너 추가
document.getElementById('prev-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

initApp();