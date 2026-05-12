const startDate = new Date('2026-01-08'); 

// 1. 한국 시간 보정 함수 (필수!)
function getKST() {
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    return new Date(utc + KR_TIME_DIFF);
}

let date = getKST(); 

function initApp() {
    updateDDay();
    renderCalendar();
}

function updateDDay() {
    const now = getKST();
    
    // 상단 오늘 날짜 표시 로직
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${week[now.getDay()]})`;
    document.getElementById('current-full-date').innerText = dateStr;

    // 디데이 계산 로직 (기존과 동일)
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('dday-count').innerText = `D+${days}`;
}

function renderCalendar() {
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();
    const now = getKST();
    const isThisMonth = (viewYear === now.getFullYear() && viewMonth === now.getMonth());

    document.getElementById('cal-month').innerText = `${viewMonth + 1}월`;
    document.getElementById('cal-year').innerText = viewYear;

    const thisLast = new Date(viewYear, viewMonth + 1, 0);
    const TLDate = thisLast.getDate();
    const prevLast = new Date(viewYear, viewMonth, 0);
    const PLDay = prevLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
            prevDates.push('');
        }
    }

    const remainingBoxes = 42 - (prevDates.length + thisDates.length);
    for (let i = 1; i <= remainingBoxes; i++) {
        nextDates.push('');
    }

    const displayDates = [...prevDates, ...thisDates, ...nextDates];
    const daysContainer = document.getElementById('calendar-days');
    
    daysContainer.innerHTML = displayDates.map((d) => {
        const isToday = (isThisMonth && d === now.getDate()) ? 'today' : '';
        const isEmpty = d === '' ? 'empty' : '';
        return `<div class="day ${isToday} ${isEmpty}">${d}</div>`;
    }).join('');
}

// 이벤트 리스너들
document.getElementById('prev-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

document.getElementById('calendar-days').addEventListener('click', (e) => {
    if (e.target.classList.contains('day') && e.target.innerText !== '') {
        alert(`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${e.target.innerText}일을 선택하셨습니다!`);
    }
});

initApp();