// Bank Data Benda dengan nilai bobot relatif
const itemsData = [
    { id: 'gajah', name: 'Gajah', icon: '🐘', weight: 100 },
    { id: 'kucing', name: 'Kucing', icon: '🐱', weight: 20 },
    { id: 'semut', name: 'Semut', icon: '🐜', weight: 1 },
    { id: 'mobil', name: 'Mobil', icon: '🚗', weight: 80 },
    { id: 'sepeda', name: 'Sepeda', icon: '🚲', weight: 15 },
    { id: 'balon', name: 'Balon', icon: '🎈', weight: 2 }
];

let mode = 'heavy-to-light'; // 'heavy-to-light' atau 'light-to-heavy'
let currentItems = [];
let placedItems = [null, null, null];
let soundEnabled = true;

function speakText(text) {
    if (!soundEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startActivity(selectedMode) {
    mode = selectedMode;
    showScreen('screen-activity');
    setupLevel();
}

function setupLevel() {
    placedItems = [null, null, null];
    document.getElementById('feedback-message').classList.add('hidden');
    
    // Pilih 3 benda secara acak
    const shuffled = [...itemsData].sort(() => 0.5 - Math.random());
    currentItems = shuffled.slice(0, 3);

    // Atur Teks Instruksi
    const instructionText = mode === 'heavy-to-light' 
        ? "Urutkan dari yang TERBERAT ke TERINGAN!" 
        : "Urutkan dari yang TERINGAN ke TERBERAT!";
    
    document.getElementById('instruction-text').textContent = instructionText;
    speakText(instructionText);

    renderSourcePool();
    renderSlots();
}

function renderSourcePool() {
    const poolContainer = document.getElementById('source-pool');
    poolContainer.innerHTML = '';

    currentItems.forEach(item => {
        const isPlaced = placedItems.some(p => p && p.id === item.id);
        const card = document.createElement('div');
        card.className = `item-card ${isPlaced ? 'disabled' : ''}`;
        card.innerHTML = `
            <span class="item-emoji">${item.icon}</span>
            <span class="item-name">${item.name}</span>
        `;
        card.onclick = () => selectItem(item);
        poolContainer.appendChild(card);
    });
}

function selectItem(item) {
    // Masukkan ke slot kosong pertama
    const emptyIndex = placedItems.findIndex(p => p === null);
    if (emptyIndex !== -1) {
        placedItems[emptyIndex] = item;
        speakText(item.name);
        renderSourcePool();
        renderSlots();
    }
}

function removeFromSlot(index) {
    if (placedItems[index] !== null) {
        placedItems[index] = null;
        renderSourcePool();
        renderSlots();
    }
}

function renderSlots() {
    const slots = document.querySelectorAll('.slot-box');
    slots.forEach((slot, idx) => {
        const contentArea = slot.querySelector('.slot-content');
        const item = placedItems[idx];
        
        if (item) {
            contentArea.innerHTML = `
                <div class="item-card" style="box-shadow:none; border:none; background:transparent;">
                    <span class="item-emoji">${item.icon}</span>
                    <span class="item-name">${item.name}</span>
                </div>
            `;
        } else {
            contentArea.innerHTML = '';
        }
    });
}

function readInstruction() {
    const text = document.getElementById('instruction-text').textContent;
    speakText(text);
}

function checkOrder() {
    // Pastikan semua slot telah terisi
    if (placedItems.includes(null)) {
        speakText("Isi semua kotak terlebih dahulu!");
        showFeedback("Isi semua 3 kotak urutan!", false);
        return;
    }

    let isCorrect = true;
    if (mode === 'heavy-to-light') {
        isCorrect = (placedItems[0].weight >= placedItems[1].weight) && 
                    (placedItems[1].weight >= placedItems[2].weight);
    } else {
        isCorrect = (placedItems[0].weight <= placedItems[1].weight) && 
                    (placedItems[1].weight <= placedItems[2].weight);
    }

    if (isCorrect) {
        showFeedback("🎉 Luar Biasa! Urutanmu Benar!", true);
        speakText("Luar Biasa! Urutanmu Benar!");
    } else {
        showFeedback("❌ Masih Kurang Tepat, Coba Lagi Ya!", false);
        speakText("Masih Kurang Tepat, Coba Lagi Ya!");
    }
}

function showFeedback(msg, isSuccess) {
    const feedbackBox = document.getElementById('feedback-message');
    feedbackBox.textContent = msg;
    feedbackBox.className = `feedback-box ${isSuccess ? 'correct' : 'wrong'}`;
    feedbackBox.classList.remove('hidden');
}

function resetCurrentLevel() {
    placedItems = [null, null, null];
    document.getElementById('feedback-message').classList.add('hidden');
    renderSourcePool();
    renderSlots();
}

// Global Navigasi
document.getElementById('btn-home').onclick = () => {
    window.speechSynthesis.cancel();
    showScreen('screen-home');
};

document.getElementById('btn-sound').onclick = () => {
    soundEnabled = !soundEnabled;
    document.getElementById('btn-sound').textContent = soundEnabled ? '🔊' : '🔇';
    if (!soundEnabled) window.speechSynthesis.cancel();
};