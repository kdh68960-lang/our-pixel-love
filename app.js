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
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();
    
    const now = getKST();
    const isThisMonth = (viewYear === now.getFullYear() && viewMonth === now.getMonth());

    document.getElementById('cal-month').innerText = `${viewMonth + 1}월`;
    document.getElementById('cal-year').innerText = viewYear;

    // 1. 이번 달 마지막 날짜 객체
    const thisLast = new Date(viewYear, viewMonth + 1, 0);
    const TLDate = thisLast.getDate(); // 이번 달 마지막 일 (예: 31)

    // 2. 지난 달 마지막 날짜 객체 (시작 요일을 찾기 위함)
    const prevLast = new Date(viewYear, viewMonth, 0);
    const PLDay = prevLast.getDay(); // 지난 달 마지막 요일

    // 3. 날짜 배열 생성
    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    // 지난 달 날짜 채우기 (일요일 시작 기준)
    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
            prevDates.push(''); // 빈칸으로 두거나 prevLast.getDate() - i 로 채울 수 있음
        }
    }

    // 다음 달 날짜 채우기 (달력을 항상 6줄로 유지하기 위함 - 선택사항)
    // 7일 * 6주 = 42칸에서 현재까지 찬 칸수를 뺍니다.
    const remainingBoxes = 42 - (prevDates.length + thisDates.length);
    for (let i = 1; i <= remainingBoxes; i++) {
        nextDates.push('');
    }

    const displayDates = [...prevDates, ...thisDates, ...nextDates];
    const daysContainer = document.getElementById('calendar-days');
    
    daysContainer.innerHTML = displayDates.map((d, index) => {
        const isToday = (isThisMonth && d === now.getDate()) ? 'today' : '';
        // 빈칸일 경우 'empty' 클래스를 주어 디자인을 다르게 할 수 있음
        const isEmpty = d === '' ? 'empty' : '';
        return `<div class="day ${isToday} ${isEmpty}">${d}</div>`;
    }).join('');
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