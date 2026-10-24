 // --- 1. EXAM COUNTDOWN TIMER ---
// Set target exam date (e.g., May 1, 2027)
const examDate = new Date("May 1, 2027 09:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = examDate - now;

    if (distance < 0) {
        document.getElementById("countdown-timer").innerText = "EXAM DAY REACHED";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();


// --- 2. FOCUS STOPWATCH ---
let stopwatchInterval;
let secondsElapsed = 0;

function formatTime(totalSeconds) {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function startTimer() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        secondsElapsed++;
        document.getElementById("stopwatch").innerText = formatTime(secondsElapsed);
    }, 1000);
}

function pauseTimer() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetTimer() {
    pauseTimer();
    secondsElapsed = 0;
    document.getElementById("stopwatch").innerText = formatTime(secondsElapsed);
}


// --- 3. SYLLABUS DATA & CHECKLIST ---
const syllabusData = [
    { id: 1, subject: "Physics", name: "Electrostatics & Capacitance", highYield: true, theory: false, practice: false, pyq: false },
    { id: 2, subject: "Physics", name: "Current Electricity & Circuits", highYield: true, theory: false, practice: false, pyq: false },
    { id: 3, subject: "Chemistry", name: "Organic: Reaction Mechanisms", highYield: true, theory: false, practice: false, pyq: false },
    { id: 4, subject: "Chemistry", name: "Coordination Compounds", highYield: false, theory: false, practice: false, pyq: false },
    { id: 5, subject: "Mathematics", name: "Calculus: Integral Calculus", highYield: true, theory: false, practice: false, pyq: false },
    { id: 6, subject: "Mathematics", name: "Vectors & 3D Geometry", highYield: true, theory: false, practice: false, pyq: false }
];

let showHighYieldOnly = false;

function renderSyllabus() {
    const container = document.getElementById("syllabus-container");
    container.innerHTML = "";

    const filtered = showHighYieldOnly ? syllabusData.filter(item => item.highYield) : syllabusData;

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.style.cssText = "background: rgba(30, 41, 59, 0.6); border: 1px solid #334155; padding: 10px; border-radius: 8px; margin-top: 10px;";

        div.innerHTML = `
            <div style="font-weight: 600; font-size: 0.9rem; color: #38bdf8; display: flex; justify-content: space-between;">
                <span>${item.name}</span>
                ${item.highYield ? '<span style="font-size: 0.7rem; background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px;">High-Yield</span>' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 6px;">${item.subject}</div>
            <div style="display: flex; gap: 14px; font-size: 0.8rem;">
                <label><input type="checkbox" ${item.theory ? 'checked' : ''} onclick="toggleTask(${item.id}, 'theory')"> Theory</label>
                <label><input type="checkbox" ${item.practice ? 'checked' : ''} onclick="toggleTask(${item.id}, 'practice')"> Practice</label>
                <label><input type="checkbox" ${item.pyq ? 'checked' : ''} onclick="toggleTask(${item.id}, 'pyq')"> PYQs</label>
            </div>
        `;
        container.appendChild(div);
    });

    updateProgress();
}

function toggleTask(id, taskType) {
    const item = syllabusData.find(ch => ch.id === id);
    if (item) {
        item[taskType] = !item[taskType];
        updateProgress();
    }
}

function toggleHighYield() {
    showHighYieldOnly = !showHighYieldOnly;
    const btn = document.getElementById("filter-high-yield");
    btn.style.borderColor = showHighYieldOnly ? "#f59e0b" : "#334155";
    btn.style.color = showHighYieldOnly ? "#f59e0b" : "#f1f5f9";
    renderSyllabus();
}

function updateProgress() {
    let totalTasks = syllabusData.length * 3;
    let completedTasks = 0;

    syllabusData.forEach(item => {
        if (item.theory) completedTasks++;
        if (item.practice) completedTasks++;
        if (item.pyq) completedTasks++;
    });

    const percent = Math.round((completedTasks / totalTasks) * 100);
    document.getElementById("progress-fill").style.width = percent + "%";
    document.getElementById("progress-text").innerText = `${percent}% Completed (${completedTasks}/${totalTasks} tasks)`;
}

// Initial render
renderSyllabus();


// --- 4. DYNAMIC SCHEDULE GENERATOR ---
function generateAISchedule() {
    const output = document.getElementById("schedule-output");

    // Filter out chapters that still have pending tasks
    const pendingChapters = syllabusData.filter(ch => !ch.theory || !ch.practice || !ch.pyq);

    if (pendingChapters.length === 0) {
        output.innerHTML = `<em>All syllabus chapters completed! Proceed to full mock test revisions.</em>`;
        return;
    }

    // Grab first two pending chapters dynamically
    const ch1 = pendingChapters[0] ? pendingChapters[0].name : "Advanced Core Review";
    const ch2 = pendingChapters[1] ? pendingChapters[1].name : "Formula & PYQ Drills";

    output.innerHTML = `<em><strong>Generated Daily Study Plan:</strong><br>
    • Priority Focus 1: <strong>${ch1}</strong> (Target: Complete Theory & Practice blocks)<br>
    • Priority Focus 2: <strong>${ch2}</strong> (Target: Solve previous years' questions)<br>
    • Status: ${pendingChapters.length} topics remaining in active queue.</em>`;
}

// --- 5. ERROR LOG & ANALYSIS ENGINE ---
function analyzeError() {
    const input = document.getElementById("error-input").value.trim();
    const output = document.getElementById("error-analysis-output");

    if (!input) {
        output.innerHTML = `<em>Please describe a specific mistake or concept gap for analysis.</em>`;
        return;
    }

    let diagnosticTip = "Review fundamental definition principles and re-verify calculation steps.";
    let actionItem = "Solve 3 similar numerical problems immediately.";

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("sign") || lowerInput.includes("plus") || lowerInput.includes("minus")) {
        diagnosticTip = "Arithmetic sign inversion detected during execution.";
        actionItem = "Write out intermediate step brackets explicitly to eliminate sign errors.";
    } else if (lowerInput.includes("formula") || lowerInput.includes("remember") || lowerInput.includes("forgot")) {
        diagnosticTip = "Formula recall delay identified.";
        actionItem = "Derive the core formula from first principles twice before attempting the next set.";
    } else if (lowerInput.includes("integration") || lowerInput.includes("calculus") || lowerInput.includes("diff")) {
        diagnosticTip = "Calculus operator boundary condition or substitution oversight.";
        actionItem = "Perform a quick limits check on your final expression.";
    }

    output.innerHTML = `<em><strong>Error Analysis Report:</strong><br>
    • Logged Input: "${input}"<br>
    • Identified Issue: ${diagnosticTip}<br>
    • Corrective Action: ${actionItem}</em>`;
}


fnrnficwk