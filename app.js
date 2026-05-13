// 1. Firebase 설정 및 초기화
const firebaseConfig = {
    apiKey: "AIzaSyDPI2xYO4gaQXNg2jRevkDpXfcOaRscD9c",
    authDomain: "our-love-63211.firebaseapp.com",
    projectId: "our-love-63211",
    // ★ Realtime Database 주소 (이게 있어야 실시간 저장됨)
    databaseURL: "https://our-love-63211-default-rtdb.firebaseio.com", 
    storageBucket: "our-love-63211.firebasestorage.app",
    messagingSenderId: "704864492182",
    appId: "1:704864492182:web:7a381b107576bd55b980b7",
    measurementId: "G-YXXB4WYBR0"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. 기본 설정 데이터
const startDate = new Date('2026-01-08'); 

function getKST() {
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    return new Date(utc + KR_TIME_DIFF);
}

let date = getKST(); 

// 3. 앱 초기화 함수
function initApp() {
    updateDDay();
    renderCalendar();
    loadRealtimeTodos(); // 실시간 데이터 로드 시작
}

// 4. D-Day 및 상단 날짜 로직
function updateDDay() {
    const now = getKST();
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${week[now.getDay()]})`;
    document.getElementById('current-full-date').innerText = dateStr;

    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('dday-count').innerText = `D+${days}`;
}

// 5. 달력 로직 (기존과 동일)
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
        for (let i = 0; i < PLDay + 1; i++) { prevDates.push(''); }
    }

    const remainingBoxes = 42 - (prevDates.length + thisDates.length);
    for (let i = 1; i <= remainingBoxes; i++) { nextDates.push(''); }

    const displayDates = [...prevDates, ...thisDates, ...nextDates];
    const daysContainer = document.getElementById('calendar-days');
    
    daysContainer.innerHTML = displayDates.map((d) => {
        const isToday = (isThisMonth && d === now.getDate()) ? 'today' : '';
        const isEmpty = d === '' ? 'empty' : '';
        return `<div class="day ${isToday} ${isEmpty}">${d}</div>`;
    }).join('');
}

// 6. ★ Firebase 실시간 리스트 로직 (중요 수정 부분)
function loadRealtimeTodos() {
    // DB의 'todos' 경로를 계속 감시함
    database.ref('todos').on('value', (snapshot) => {
        const data = snapshot.val();
        const todoList = document.getElementById('todo-list');
        if (!todoList) return;

        todoList.innerHTML = '';
        if (data) {
            // 데이터를 시간순(timestamp)으로 정렬하여 표시
            const sortedKeys = Object.keys(data).sort((a, b) => data[a].timestamp - data[b].timestamp);

            sortedKeys.forEach((key) => {
                const todo = data[key];
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div>
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                               onchange="toggleTodoRemote('${key}', ${todo.completed})">
                        <span>${todo.text}</span>
                    </div>
                    <span class="delete-btn" onclick="deleteTodoRemote('${key}')">[삭제]</span>
                `;
                todoList.appendChild(li);
            });
        }
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === '') return;
    
    // 로컬 배열 대신 Firebase에 바로 밀어넣기
    database.ref('todos').push({
        text: input.value,
        completed: false,
        timestamp: Date.now()
    });
    input.value = '';
}

function toggleTodoRemote(key, currentStatus) {
    database.ref('todos/' + key).update({
        completed: !currentStatus
    });
}

function deleteTodoRemote(key) {
    if(confirm('이 추억을 삭제할까요?')) {
        database.ref('todos/' + key).remove();
    }
}

// 7. 이벤트 리스너 및 초기 실행
document.getElementById('prev-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-btn').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

document.getElementById('add-btn').addEventListener('click', addTodo);
document.getElementById('todo-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

initApp();