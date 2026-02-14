import { getGoals, toggleGoal, getTaskSettings, getWalletBalance, updateWalletBalance, FIXED_HOLIDAYS, getAnniversaries } from './db.js';

let currentSchedulerDate = new Date(); // Tracks the week
let taskSettings = {};

const HOLIDAYS = {
    "01-01": "신정",
    "03-01": "3.1절",
    "05-05": "어린이날",
    "06-06": "현충일",
    "08-15": "광복절",
    "10-03": "개천절",
    "10-09": "한글날",
    "12-25": "크리스마스"
};

// --- Exports ---
export function openScheduler() {
    document.getElementById('scheduler-modal').classList.remove('hidden');
    renderScheduler();
}

export function closeScheduler() {
    document.getElementById('scheduler-modal').classList.add('hidden');
}

export function changeSchedulerDate(weeks) {
    currentSchedulerDate.setDate(currentSchedulerDate.getDate() + (weeks * 7));
    renderScheduler();
}

// --- Rendering ---
async function renderScheduler() {
    const grid = document.getElementById('scheduler-grid');
    if (!grid) return;

    // Find Sunday of current week view
    const startOfWeek = new Date(currentSchedulerDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    grid.innerHTML = '';

    // Day Headers
    const dayNames = ['주일', '월', '화', '수', '목', '금', '토'];
    dayNames.forEach((d, i) => {
        const header = document.createElement('div');
        header.className = `day-header ${i === 0 ? 'sun' : ''} ${i === 6 ? 'sat' : ''}`;
        header.innerText = d;
        grid.appendChild(header);
    });

    const currentChild = window.currentSchedulerChild || '한봄';

    // Load Data Paralelly
    const [tasks, anniversaries, ...weekGoals] = await Promise.all([
        getTaskSettings(currentChild),
        getAnniversaries(),
        ...Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            return getGoals(d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'));
        })
    ]);

    const taskList = tasks || [];
    // Calculate Monthly Total (Requires Fetching entire month? Or just local week?)
    // Requirement: "Wallet resets on 1st". 
    // We will show "This Month's Reward".
    // For performance, we might just calculate based on visible week or fetch month summary?
    // Let's rely on getWalletBalance for "Current Balance" and maybe add a "Reset" button in settings?
    // Or just fetch getWalletBalance as "Total" and say "Start of Month" is handled via manual reset or smart logic.
    // User: "Cumulative amount should reset".
    // I will add logic: new month -> balance becomes 0? No, that deletes money.
    // It means "Monthly Allowance Calculation".
    // I'll stick to displaying current balance. A 'Reset' button is safer.

    // Render 7 Days
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const countDateStr = `${yyyy}-${mm}-${dd}`;
        const holidayKey = `${mm}-${dd}`; // MM-DD

        const col = document.createElement('div');
        col.className = 'day-column';
        if (countDateStr === toDateString(new Date())) col.classList.add('today');

        // 1. Date Label Area (Fixed Height)
        const dateArea = document.createElement('div');
        dateArea.className = 'date-area';
        dateArea.style.minHeight = '60px'; // Ensure space for alignment

        const dateLabel = document.createElement('div');
        dateLabel.className = 'date-label';
        // Color Sunday Red, Saturday Green
        if (d.getDay() === 0) dateLabel.classList.add('sun-text');
        if (d.getDay() === 6) dateLabel.classList.add('sat-text');

        dateLabel.innerText = `${d.getMonth() + 1}.${d.getDate()}`;
        dateArea.appendChild(dateLabel);

        // 2. Check Holidays & Anniversaries
        let holidayText = FIXED_HOLIDAYS[holidayKey] || FIXED_HOLIDAYS[countDateStr];

        // Check Custom Anniversaries
        if (!holidayText && anniversaries) {
            const ann = anniversaries.find(a => a.date === holidayKey);
            if (ann) holidayText = ann.name;
        }

        if (holidayText) {
            const hol = document.createElement('div');
            hol.className = 'holiday-label';
            hol.innerText = holidayText;
            dateArea.appendChild(hol);
            // If holiday, make date red?
            dateLabel.classList.add('sun-text');
        }

        col.appendChild(dateArea);

        // 3. Tasks Area
        const savedData = weekGoals[i] || {};
        const dayData = savedData[dd] && savedData[dd][currentChild] ? savedData[dd][currentChild] : {};

        taskList.forEach(task => {
            const max = task.maxQty || 1;
            const currentVal = dayData[task.id];
            let count = 0;
            if (currentVal === true) count = max;
            else if (typeof currentVal === 'number') count = currentVal;

            const isDone = count >= max;

            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${isDone ? 'done' : ''}`;
            taskItem.id = `task-${yyyy}-${mm}-${dd}-${currentChild}-${task.id}`;

            // Force Quantity UI if requested, or if Max > 1
            if (max > 1) {
                taskItem.innerHTML = `
                    <div class="task-row">
                        <span class="task-name">${task.name}</span>
                        <div class="task-qty-ctrl">
                            <button class="btn-micro qty-minus" onclick="updateTaskQty('${yyyy}', '${mm}', '${dd}', '${currentChild}', '${task.id}', ${task.reward}, -1, ${max})">➖</button>
                            <span class="qty-val">${count}/${max}</span>
                            <button class="btn-micro qty-plus" onclick="updateTaskQty('${yyyy}', '${mm}', '${dd}', '${currentChild}', '${task.id}', ${task.reward}, 1, ${max})">➕</button>
                        </div>
                    </div>
                `;
            } else {
                // Checkbox
                taskItem.innerHTML = `
                    <label class="task-row">
                        <input type="checkbox" class="task-checkbox" ${count >= 1 ? 'checked' : ''} 
                        onchange="updateTaskQty('${yyyy}', '${mm}', '${dd}', '${currentChild}', '${task.id}', ${task.reward}, this.checked ? 1 : -1, 1)">
                        <span class="task-name">${task.name}</span>
                    </label>
                `;
            }
            col.appendChild(taskItem);
        });

        grid.appendChild(col);
    } // End Loop

    // Update Header Info
    const monthBtn = document.getElementById('scheduler-month');
    monthBtn.innerText = `${startOfWeek.getFullYear()}.${startOfWeek.getMonth() + 1}`;
    monthBtn.onclick = () => {
        const newDateStr = prompt("이동할 년-월을 입력하세요 (예: 2026-02)", `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}`);
        if (newDateStr && newDateStr.match(/^\d{4}-\d{2}$/)) {
            const [y, m] = newDateStr.split('-');
            currentSchedulerDate = new Date(parseInt(y), parseInt(m) - 1, 1);
            renderScheduler();
        }
    };

    const balance = await getWalletBalance(currentChild);
    document.getElementById('scheduler-wallet').innerText = balance.toLocaleString() + '원';
}

function toDateString(d) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Global Handler for Qty Update
window.updateTaskQty = async function (yyyy, mm, dd, childName, taskId, reward, delta, max) {
    const elId = `task-${yyyy}-${mm}-${dd}-${childName}-${taskId}`;
    const el = document.getElementById(elId);
    if (!el) return;

    // Get current value from UI for immediate feedback
    let current = 0;
    if (max > 1) {
        const valSpan = el.querySelector('.qty-val');
        current = parseInt(valSpan.innerText.split('/')[0]);
    } else {
        const cb = el.querySelector('.task-checkbox');
        // If checkbox was clicked, 'cb.checked' is the NEW state.
        // We need previous state to calculate delta? 
        // Actually, for checkbox, `onchange` passed explicit 1 or -1 based on NEW state.
        // So we can assume `current` is irrelevant for delta application, 
        // BUT we need `next` value to store.
        // If delta is +1, new is 1. If -1, new is 0. 
        // Let's trust the delta.
        // However, we need to know what the DB value was?
        // Let's assume the UI was in sync.
        // If checkbox is now checked (passed 1), it means it WAS 0.
        current = (delta > 0) ? 0 : 1;
    }

    let next = current + delta;
    if (next < 0) next = 0;
    if (next > max) next = max;

    if (current === next) return;

    // Optimistic UI
    if (max > 1) {
        el.querySelector('.qty-val').innerText = `${next}/${max}`;
        if (next >= max) el.classList.add('done');
        else el.classList.remove('done');
    } else {
        if (next >= 1) el.classList.add('done');
        else el.classList.remove('done');
    }

    // Update DB
    // toggleGoal determines path. We save 'next' (number).
    await toggleGoal(yyyy, mm, dd, childName, taskId, next);

    // Update Wallet
    // Calculate actual change amount
    // If next > current, we add (diff * reward)
    const diff = next - current;
    if (diff !== 0) {
        let balance = parseInt(document.getElementById('scheduler-wallet').innerText.replace(/[^0-9]/g, ''));
        balance += diff * reward;
        document.getElementById('scheduler-wallet').innerText = balance.toLocaleString() + '원';
        await updateWalletBalance(childName, balance);
    }
}


window.currentSchedulerChild = '한봄';
window.switchSchedulerTab = function (childName) {
    window.currentSchedulerChild = childName;
    document.querySelectorAll('.scheduler-tabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.innerText.includes(childName));
    });
    renderScheduler();
}

// Assign globals
window.openScheduler = openScheduler;
window.closeScheduler = closeScheduler;
window.changeSchedulerDate = changeSchedulerDate;
