// Data Cerita & Kuis (Fase B Pendidikan Khusus)
const stories = {
    1: {
        title: "Kucing Kiki",
        pages: [
            { text: "Ini Kiki. Kiki adalah kucing yang lucu.", icon: "🐱" },
            { text: "Kiki punya bulu berwarna oranye.", icon: "🐈" },
            { text: "Kiki sangat suka makan ikan segar.", icon: "🐟" }
        ],
        quiz: {
            question: "Apa makanan kesukaan Kiki?",
            options: ["Roti", "Ikan", "Ayam"],
            answer: 1 // Indeks jawaban benar
        }
    },
    2: {
        title: "Kelinci Melompat",
        pages: [
            { text: "Loli adalah kelinci yang ramah.", icon: "🐰" },
            { text: "Loli suka melompat di taman bunga.", icon: "🌸" },
            { text: "Makanan favorit Loli adalah wortel manis.", icon: "🥕" }
        ],
        quiz: {
            question: "Di mana Loli suka melompat?",
            options: ["Di taman bunga", "Di dalam kamar", "Di atas meja"],
            answer: 0
        }
    }
};

let currentStoryId = null;
let currentPageIndex = 0;
let soundEnabled = true;

// Fitur Text to Speech bawaan IFP / Browser
function speakText(text) {
    if (!soundEnabled) return;
    window.speechSynthesis.cancel(); // Hentikan audio sebelumnya
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.85; // Kecepatan agak lambat cocok untuk PDBK Fase B
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
}

// Navigasi Layar
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Memulai Cerita
function startStory(id) {
    currentStoryId = id;
    currentPageIndex = 0;
    showScreen('screen-reader');
    updateStoryPage();
}

// Update Konten Halaman
function updateStoryPage() {
    const story = stories[currentStoryId];
    const page = story.pages[currentPageIndex];

    document.getElementById('story-text').textContent = page.text;
    document.getElementById('story-image').textContent = page.icon;
    document.getElementById('page-indicator').textContent = `${currentPageIndex + 1} / ${story.pages.length}`;

    // Otomatis bacakan teks saat halaman berganti
    speakText(page.text);

    // Update Tombol Navigasi
    document.getElementById('btn-prev').style.visibility = currentPageIndex === 0 ? 'hidden' : 'visible';
}

function readCurrentText() {
    const text = document.getElementById('story-text').textContent;
    speakText(text);
}

function nextPage() {
    const story = stories[currentStoryId];
    if (currentPageIndex < story.pages.length - 1) {
        currentPageIndex++;
        updateStoryPage();
    } else {
        // Jika cerita selesai, masuk ke kuis
        loadQuiz();
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updateStoryPage();
    }
}

// Modul Kuis Interaktif
function loadQuiz() {
    showScreen('screen-quiz');
    const quiz = stories[currentStoryId].quiz;
    
    document.getElementById('quiz-question').textContent = quiz.question;
    speakText("Pertanyaan: " + quiz.question);

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    const feedbackBox = document.getElementById('quiz-feedback');
    feedbackBox.classList.add('hidden');

    quiz.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'touch-btn option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index, quiz.answer);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, correctIndex) {
    const feedbackBox = document.getElementById('quiz-feedback');
    feedbackBox.classList.remove('hidden');

    if (selectedIndex === correctIndex) {
        feedbackBox.textContent = "🎉 Hebat! Jawabanmu Benar!";
        feedbackBox.className = "feedback-box correct";
        speakText("Hebat! Jawabanmu Benar!");
        
        setTimeout(() => {
            showScreen('screen-home');
        }, 3000);
    } else {
        feedbackBox.textContent = "❌ Coba Lagi Ya!";
        feedbackBox.className = "feedback-box wrong";
        speakText("Coba Lagi Ya!");
    }
}

// Global Event Listeners
document.getElementById('btn-home').onclick = () => {
    window.speechSynthesis.cancel();
    showScreen('screen-home');
};

document.getElementById('btn-sound').onclick = () => {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (!soundEnabled) window.speechSynthesis.cancel();
};