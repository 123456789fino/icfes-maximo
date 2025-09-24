/**
 * =====================================================
 * SISTEMA ICFES ÉLITE - GRADO 9º
 * JavaScript Avanzado con IA Básica y Gamificación
 * Versión Premium 3.0
 * =====================================================
 */

// === VARIABLES GLOBALES AVANZADAS ===
let gameState = {
    score: 0,
    totalQuestions: 20,
    answeredQuestions: 0,
    correctStreak: 0,
    maxStreak: 0,
    startTime: 0,
    questionTimes: [],
    difficultyLevel: 'normal',
    playerProfile: {
        strengths: [],
        weaknesses: [],
        learningStyle: 'visual',
        confidence: 0.5
    },
    achievements: new Set(),
    powerUps: {
        timeFreeze: 0,
        hintAvailable: 3,
        skipQuestion: 1
    }
};

// === SISTEMA DE LOGROS ===
const ACHIEVEMENTS = {
    SPEED_DEMON: { id: 'speed', name: '⚡ Velocista', desc: 'Responder en menos de 5 segundos' },
    PERFECTIONIST: { id: 'perfect', name: '🏆 Perfeccionista', desc: 'Obtener 100% de aciertos' },
    STREAK_MASTER: { id: 'streak', name: '🔥 Maestro de Rachas', desc: 'Conseguir 10 respuestas correctas seguidas' },
    COMEBACK_KID: { id: 'comeback', name: '💪 Resiliente', desc: 'Recuperarse después de 3 errores seguidos' },
    SCHOLAR: { id: 'scholar', name: '🎓 Erudito', desc: 'Completar sin usar ayudas' },
    EXPLORER: { id: 'explorer', name: '🗺️ Explorador', desc: 'Completar todas las materias' }
};

// === INTELIGENCIA ARTIFICIAL BÁSICA ===
class BasicAI {
    constructor() {
        this.patterns = new Map();
        this.predictions = [];
    }

    analyzePerformance(questionData) {
        const { subject, difficulty, timeSpent, isCorrect } = questionData;
        
        const key = `${subject}_${difficulty}`;
        if (!this.patterns.has(key)) {
            this.patterns.set(key, { correct: 0, total: 0, avgTime: 0 });
        }
        
        const pattern = this.patterns.get(key);
        pattern.total++;
        pattern.avgTime = (pattern.avgTime + timeSpent) / 2;
        
        if (isCorrect) {
            pattern.correct++;
            gameState.playerProfile.confidence = Math.min(1, gameState.playerProfile.confidence + 0.02);
        } else {
            gameState.playerProfile.confidence = Math.max(0, gameState.playerProfile.confidence - 0.05);
        }
    }

    predictDifficulty() {
        const avgPerformance = gameState.score / Math.max(1, gameState.answeredQuestions);
        
        if (avgPerformance > 0.8 && gameState.correctStreak > 5) {
            return 'hard';
        } else if (avgPerformance < 0.4) {
            return 'easy';
        }
        return 'normal';
    }

    generatePersonalizedFeedback() {
        const performance = gameState.score / Math.max(1, gameState.answeredQuestions);
        const confidence = gameState.playerProfile.confidence;
        
        if (performance > 0.9 && confidence > 0.8) {
            return "🌟 ¡Dominio excepcional! Estás listo para desafíos universitarios.";
        } else if (performance > 0.7) {
            return "🎯 ¡Excelente progreso! Tu comprensión está en nivel avanzado.";
        } else if (performance > 0.5) {
            return "📚 Buen trabajo. Con práctica adicional alcanzarás la excelencia.";
        } else {
            return "💪 No te desanimes. Cada error es una oportunidad de aprender más.";
        }
    }
}

const aiSystem = new BasicAI();

// === SISTEMA DE GAMIFICACIÓN ===
class GamificationEngine {
    static checkAchievements(questionTime, isCorrect) {
        // Speed Demon
        if (questionTime < 5000 && isCorrect) {
            this.unlockAchievement('speed');
        }
        
        // Streak Master
        if (gameState.correctStreak >= 10) {
            this.unlockAchievement('streak');
        }
        
        // Perfectionist (check at end)
        if (gameState.answeredQuestions === gameState.totalQuestions && 
            gameState.score === gameState.totalQuestions) {
            this.unlockAchievement('perfect');
        }
    }
    
    static unlockAchievement(achievementId) {
        if (!gameState.achievements.has(achievementId)) {
            gameState.achievements.add(achievementId);
            const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
            this.showAchievementPopup(achievement);
        }
    }
    
    static showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
                <div class="achievement-text">
                    <h4>¡Logro Desbloqueado!</h4>
                    <p>${achievement.name}</p>
                    <small>${achievement.desc}</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.animation = 'achievementSlideOut 0.5s ease-in forwards';
            setTimeout(() => document.body.removeChild(popup), 500);
        }, 3000);
    }
}

// === INICIALIZACIÓN AVANZADA ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema ICFES Élite - Grado 9º - Inicializando...');
    
    initializeGameSystem();
    createAdvancedUI();
    setupEventListeners();
    startPerformanceTracking();
    
    console.log('✨ Sistema inicializado con éxito!');
});

function initializeGameSystem() {
    gameState.startTime = Date.now();
    gameState.totalQuestions = document.querySelectorAll('.question').length;
    
    // Aplicar efectos de carga
    document.querySelectorAll('.question').forEach((q, i) => {
        q.classList.add('loading');
        q.style.animationDelay = `${i * 0.1}s`;
    });
}

// === INTERFAZ AVANZADA ===
function createAdvancedUI() {
    createProgressBar();
    createStatsPanel();
    createPowerUpBar();
    createModal();
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bg">
            <div id="progress-bar"></div>
        </div>
        <div id="progress-text">Pregunta 0 de ${gameState.totalQuestions}</div>
        <div class="stats-mini">
            <span id="streak-counter">🔥 Racha: ${gameState.correctStreak}</span>
            <span id="accuracy-display">📊 Precisión: 0%</span>
        </div>
    `;
    
    const quizSection = document.querySelector('.quiz-section');
    if (quizSection && quizSection.children.length > 1) {
        quizSection.insertBefore(progressContainer, quizSection.children[1]);
    }
}

function createStatsPanel() {
    const statsPanel = document.createElement('div');
    statsPanel.id = 'stats-panel';
    statsPanel.className = 'stats-panel';
    statsPanel.innerHTML = `
        <div class="stats-header">📈 Estadísticas en Vivo</div>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-value" id="current-score">0</span>
                <span class="stat-label">Puntaje</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="avg-time">0s</span>
                <span class="stat-label">Tiempo Promedio</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="confidence-level">50%</span>
                <span class="stat-label">Confianza</span>
            </div>
        </div>
    `;
    
    document.querySelector('.quiz-section').appendChild(statsPanel);
}

function createPowerUpBar() {
    const powerUpBar = document.createElement('div');
    powerUpBar.className = 'powerup-bar';
    powerUpBar.innerHTML = `
        <div class="powerup-title">⚡ Ayudas Disponibles</div>
        <button class="powerup-btn" onclick="useHint()" title="Pista">
            💡 Pistas: ${gameState.powerUps.hintAvailable}
        </button>
        <button class="powerup-btn" onclick="skipQuestion()" title="Saltar pregunta">
            ⏭️ Saltar: ${gameState.powerUps.skipQuestion}
        </button>
    `;
    
    document.querySelector('.quiz-section').appendChild(powerUpBar);
}

// === MODAL AVANZADO ===
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content" id="modal-content">
            <h3 id="modal-title"></h3>
            <p id="modal-message"></p>
            <div id="modal-explanation" class="explanation-text"></div>
            <div id="ai-feedback" class="ai-feedback"></div>
            <div class="modal-actions">
                <button id="close-modal" class="close-modal" onclick="closeModal()">
                    Continuar ✨
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// === FUNCIÓN PRINCIPAL DE RESPUESTA ===
function checkAnswer(button, isCorrect, explanation = '', difficulty = 'normal') {
    if (button.disabled) return;
    
    const questionStartTime = Date.now();
    const questionTime = questionStartTime - (gameState.lastQuestionTime || gameState.startTime);
    gameState.lastQuestionTime = questionStartTime;
    
    // Obtener elementos de la pregunta
    const questionDiv = button.closest('.question');
    const buttons = questionDiv.querySelectorAll('button');
    
    // Desactivar botones
    buttons.forEach(btn => btn.disabled = true);
    
    // Analizar respuesta con IA
    aiSystem.analyzePerformance({
        subject: getCurrentSubject(),
        difficulty: difficulty,
        timeSpent: questionTime,
        isCorrect: isCorrect
    });
    
    // Actualizar estado del juego
    gameState.answeredQuestions++;
    gameState.questionTimes.push({
        question: gameState.answeredQuestions,
        time: questionTime,
        correct: isCorrect,
        difficulty: difficulty
    });
    
    if (isCorrect) {
        // Respuesta correcta
        button.classList.add('correct');
        gameState.score++;
        gameState.correctStreak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.correctStreak);
        
        createAdvancedConfetti();
        playSuccessSound();
        
        const encouragements = [
            '🌟 ¡Brillante! Tu razonamiento es excepcional.',
            '🚀 ¡Fantástico! Dominas este tema completamente.',
            '💎 ¡Perfecto! Demuestras gran madurez académica.',
            '🎯 ¡Excelente! Tu análisis es muy profundo.',
            '⚡ ¡Impresionante! Rapidez y precisión perfectas.'
        ];
        
        showAdvancedModal('¡Excelente Trabajo!', 
            encouragements[Math.floor(Math.random() * encouragements.length)],
            'correct', explanation, aiSystem.generatePersonalizedFeedback());
        
    } else {
        // Respuesta incorrecta
        button.classList.add('incorrect');
        gameState.correctStreak = 0;
        
        // Mostrar respuesta correcta
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes('true')) {
                btn.classList.add('correct');
            }
        });
        
        const motivations = [
            '💪 ¡Tranquilo! Los grandes pensadores aprenden de cada error.',
            '🎓 ¡No te desanimes! Cada equivocación te hace más sabio.',
            '🌱 ¡Sigue adelante! El crecimiento requiere desafíos.',
            '🔬 ¡Analiza! Los errores son datos valiosos para mejorar.',
            '🎯 ¡Persiste! La excelencia se construye paso a paso.'
        ];
        
        showAdvancedModal('Oportunidad de Aprendizaje',
            motivations[Math.floor(Math.random() * motivations.length)],
            'incorrect', explanation, aiSystem.generatePersonalizedFeedback());
    }
    
    // Verificar logros
    GamificationEngine.checkAchievements(questionTime, isCorrect);
    
    // Actualizar interfaz
    updateAdvancedProgress();
    updateStatsPanel();
    
    // Verificar fin del cuestionario
    if (gameState.answeredQuestions === gameState.totalQuestions) {
        setTimeout(() => showAdvancedFinalScore(), 2000);
    }
}

// === MODAL AVANZADO ===
function showAdvancedModal(title, message, type, explanation = '', aiFeedback = '') {
    const modal = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalExplanation = document.getElementById('modal-explanation');
    const aiField = document.getElementById('ai-feedback');
    const closeButton = document.getElementById('close-modal');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalExplanation.textContent = explanation || '';
    aiField.textContent = aiFeedback || '';
    
    modalExplanation.style.display = explanation ? 'block' : 'none';
    aiField.style.display = aiFeedback ? 'block' : 'none';
    
    modalContent.className = `modal-content ${type}`;
    modalTitle.className = type;
    closeButton.className = `close-modal ${type}`;
    
    modal.style.display = 'block';
    
    if (type === 'correct') {
        setTimeout(closeModal, 2500);
    }
}

// === CONFETI AVANZADO ===
function createAdvancedConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                border-radius: ${shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0'};
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 4000);
        }, i * 50);
    }
}

// === ACTUALIZACIÓN DE INTERFAZ ===
function updateAdvancedProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const streakCounter = document.getElementById('streak-counter');
    const accuracyDisplay = document.getElementById('accuracy-display');
    
    if (progressBar && progressText) {
        const progressPercent = (gameState.answeredQuestions / gameState.totalQuestions) * 100;
        progressBar.style.width = progressPercent + '%';
        progressText.textContent = `Pregunta ${gameState.answeredQuestions} de ${gameState.totalQuestions}`;
    }
    
    if (streakCounter) {
        streakCounter.textContent = `🔥 Racha: ${gameState.correctStreak}`;
        streakCounter.style.color = gameState.correctStreak > 5 ? '#ff6b6b' : '';
    }
    
    if (accuracyDisplay) {
        const accuracy = Math.round((gameState.score / Math.max(1, gameState.answeredQuestions)) * 100);
        accuracyDisplay.textContent = `📊 Precisión: ${accuracy}%`;
    }
}

function updateStatsPanel() {
    const currentScore = document.getElementById('current-score');
    const avgTime = document.getElementById('avg-time');
    const confidenceLevel = document.getElementById('confidence-level');
    
    if (currentScore) {
        currentScore.textContent = gameState.score;
    }
    
    if (avgTime && gameState.questionTimes.length > 0) {
        const average = gameState.questionTimes.reduce((sum, q) => sum + q.time, 0) / gameState.questionTimes.length;
        avgTime.textContent = `${Math.round(average / 1000)}s`;
    }
    
    if (confidenceLevel) {
        confidenceLevel.textContent = `${Math.round(gameState.playerProfile.confidence * 100)}%`;
    }
}

// === PUNTUACIÓN FINAL AVANZADA ===
function showAdvancedFinalScore() {
    const percentage = Math.round((gameState.score / gameState.totalQuestions) * 100);
    const totalTime = Math.round((Date.now() - gameState.startTime) / 1000);
    const avgTime = Math.round(totalTime / gameState.totalQuestions);
    
    // Análisis avanzado de rendimiento
    let performanceLevel = '';
    let recommendation = '';
    let emoji = '';
    let grade = '';
    
    if (percentage >= 95) {
        performanceLevel = '🏆 NIVEL UNIVERSITARIO AVANZADO';
        recommendation = 'Estás preparado para desafíos de educación superior. ¡Considera cursos avanzados!';
        emoji = '🎓';
        grade = 'A+';
    } else if (percentage >= 90) {
        performanceLevel = '🌟 NIVEL PREUNIVERSITARIO EXCELENTE';
        recommendation = 'Dominio sobresaliente. Enfócate en perfeccionar áreas específicas.';
        emoji = '🚀';
        grade = 'A';
    } else if (percentage >= 85) {
        performanceLevel = '🎯 NIVEL AVANZADO SÓLIDO';
        recommendation = 'Gran comprensión. Practica casos más complejos para la excelencia.';
        emoji = '⭐';
        grade = 'B+';
    } else if (percentage >= 80) {
        performanceLevel = '👍 NIVEL COMPETENTE';
        recommendation = 'Buen dominio. Refuerza conceptos fundamentales y practica más.';
        emoji = '📚';
        grade = 'B';
    } else if (percentage >= 70) {
        performanceLevel = '📖 NIVEL EN DESARROLLO';
        recommendation = 'Progreso notable. Dedica tiempo extra a temas desafiantes.';
        emoji = '💪';
        grade = 'C';
    } else {
        performanceLevel = '🌱 NIVEL INICIAL';
        recommendation = 'No te desanimes. Cada gran experto empezó desde aquí. ¡Practica con constancia!';
        emoji = '🎯';
        grade = 'D';
    }
    
    // Análisis de fortalezas y debilidades
    const aiAnalysis = generatePerformanceAnalysis();
    
    const scoreDisplay = document.getElementById('score-display');
    const resultDiv = document.getElementById('result');
    
    if (scoreDisplay && resultDiv) {
        scoreDisplay.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${emoji}</div>
            <div style="font-size: 2rem; margin-bottom: 1rem; background: linear-gradient(45deg, #667eea, #764ba2); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">
                ${performanceLevel}
            </div>
            <div style="font-size: 1.5rem; margin-bottom: 1rem;">
                Calificación: ${grade} | ${percentage}% (${gameState.score}/${gameState.totalQuestions})
            </div>
            <div style="margin-bottom: 1.5rem; font-size: 1.1rem;">
                ${recommendation}
            </div>
            <div class="performance-metrics">
                <div class="metric">⏱️ Tiempo Total: ${Math.floor(totalTime/60)}:${(totalTime%60).toString().padStart(2,'0')}</div>
                <div class="metric">📊 Promedio/Pregunta: ${avgTime}s</div>
                <div class="metric">🔥 Mejor Racha: ${gameState.maxStreak}</div>
                <div class="metric">🎯 Nivel de Confianza: ${Math.round(gameState.playerProfile.confidence * 100)}%</div>
            </div>
            ${aiAnalysis}
            ${generateAchievementsSummary()}
        `;
        
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Efectos especiales para altas puntuaciones
        if (percentage >= 90) {
            createCelebrationBurst();
            setTimeout(() => createAdvancedConfetti(), 500);
        }
    }
}

// === ANÁLISIS DE RENDIMIENTO CON IA ===
function generatePerformanceAnalysis() {
    const correctAnswers = gameState.questionTimes.filter(q => q.correct);
    const incorrectAnswers = gameState.questionTimes.filter(q => !q.correct);
    
    let analysis = '<div class="ai-analysis"><h4>🤖 Análisis Inteligente</h4>';
    
    // Análisis de velocidad
    const avgCorrectTime = correctAnswers.reduce((sum, q) => sum + q.time, 0) / correctAnswers.length / 1000;
    if (avgCorrectTime < 10) {
        analysis += '<p>⚡ Excelente velocidad de procesamiento mental</p>';
    } else if (avgCorrectTime > 20) {
        analysis += '<p>🤔 Tomas tiempo para analizar - ¡excelente estrategia reflexiva!</p>';
    }
    
    // Análisis de patrones
    if (gameState.maxStreak > 7) {
        analysis += '<p>🎯 Demuestras consistencia excepcional en tus respuestas</p>';
    }
    
    // Recomendaciones personalizadas
    analysis += '<h5>📝 Recomendaciones Personalizadas:</h5>';
    
    if (gameState.playerProfile.confidence > 0.8) {
        analysis += '<p>• Considera desafíos adicionales y olimpiadas académicas</p>';
    } else if (gameState.playerProfile.confidence < 0.4) {
        analysis += '<p>• Practica con ejercicios de menor complejidad para ganar confianza</p>';
    }
    
    analysis += '</div>';
    return analysis;
}

function generateAchievementsSummary() {
    if (gameState.achievements.size === 0) {
        return '<div class="achievements-summary"><h4>🏅 ¡Sigue practicando para desbloquear logros!</h4></div>';
    }
    
    let summary = '<div class="achievements-summary"><h4>🏅 Logros Desbloqueados</h4><div class="achievement-grid">';
    
    gameState.achievements.forEach(achievementId => {
        const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
        if (achievement) {
            summary += `
                <div class="achievement-badge">
                    <span class="achievement-icon">${achievement.name.split(' ')[0]}</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            `;
        }
    });
    
    summary += '</div></div>';
    return summary;
}

// === EFECTOS ESPECIALES ===
function createCelebrationBurst() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-burst';
    celebration.textContent = '🎉';
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (document.body.contains(celebration)) {
            document.body.removeChild(celebration);
        }
    }, 2000);
}

// === POWER-UPS ===
function useHint() {
    if (gameState.powerUps.hintAvailable <= 0) {
        alert('❌ No tienes pistas disponibles');
        return;
    }
    
    gameState.powerUps.hintAvailable--;
    
    // Encontrar pregunta activa
    const activeQuestion = Array.from(document.querySelectorAll('.question')).find(q => {
        return Array.from(q.querySelectorAll('button')).some(btn => !btn.disabled);
    });
    
    if (activeQuestion) {
        const incorrectButtons = Array.from(activeQuestion.querySelectorAll('button')).filter(btn => {
            return !btn.onclick.toString().includes('true');
        });
        
        if (incorrectButtons.length > 0) {
            const randomIncorrect = incorrectButtons[Math.floor(Math.random() * incorrectButtons.length)];
            randomIncorrect.style.opacity = '0.3';
            randomIncorrect.style.pointerEvents = 'none';
            
            showHintModal('💡 Pista Usada', 'He eliminado una opción incorrecta para ti.');
        }
    }
    
    updatePowerUpDisplay();
}

function skipQuestion() {
    if (gameState.powerUps.skipQuestion <= 0) {
        alert('❌ No tienes saltos disponibles');
        return;
    }
    
    gameState.powerUps.skipQuestion--;
    gameState.answeredQuestions++;
    
    // Encontrar y desactivar pregunta actual
    const activeQuestion = Array.from(document.querySelectorAll('.question')).find(q => {
        return Array.from(q.querySelectorAll('button')).some(btn => !btn.disabled);
    });
    
    if (activeQuestion) {
        const buttons = activeQuestion.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }
    
    updateAdvancedProgress();
    updatePowerUpDisplay();
    
    if (gameState.answeredQuestions >= gameState.totalQuestions) {
        setTimeout(() => showAdvancedFinalScore(), 1000);
    }
}

function updatePowerUpDisplay() {
    const hintBtn = document.querySelector('.powerup-btn');
    const skipBtn = document.querySelectorAll('.powerup-btn')[1];
    
    if (hintBtn) hintBtn.innerHTML = `💡 Pistas: ${gameState.powerUps.hintAvailable}`;
    if (skipBtn) skipBtn.innerHTML = `⏭️ Saltar: ${gameState.powerUps.skipQuestion}`;
}

function showHintModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'hint-modal';
    modal.innerHTML = `
        <div class="hint-modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Entendido</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 3000);
}

// === UTILIDADES ===
function getCurrentSubject() {
    const title = document.querySelector('h1')?.textContent || '';
    if (title.includes('Matemáticas')) return 'math';
    if (title.includes('Español')) return 'spanish';
    if (title.includes('English') || title.includes('Inglés')) return 'english';
    if (title.includes('Naturales') || title.includes('Ciencias')) return 'science';
    if (title.includes('Sociales')) return 'social';
    return 'general';
}

function playSuccessSound() {
    // Crear sonido sintético para respuestas correctas
    if (typeof AudioContext !== 'undefined') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio no disponible');
        }
    }
}

// === EVENTOS Y NAVEGACIÓN ===
function setupEventListeners() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeModal();
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            restartQuiz();
        }
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            goToMenu();
        }
        if (['1', '2', '3'].includes(event.key)) {
            handleKeyboardAnswer(parseInt(event.key) - 1);
        }
        if (event.key === 'h') useHint();
        if (event.key === 's') skipQuestion();
    });
}

function handleKeyboardAnswer(index) {
    const activeQuestion = Array.from(document.querySelectorAll('.question')).find(q => {
        return Array.from(q.querySelectorAll('button')).some(btn => !btn.disabled);
    });
    
    if (activeQuestion) {
        const buttons = Array.from(activeQuestion.querySelectorAll('button')).filter(btn => !btn.disabled);
        if (buttons[index]) {
            buttons[index].click();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (modalContent) {
        modalContent.style.animation = 'modalSlideOut 0.4s ease forwards';
    }
    
    setTimeout(() => {
        modal.style.display = 'none';
        if (modalContent) modalContent.style.animation = '';
    }, 400);
}

function restartQuiz() {
    if (gameState.answeredQuestions > 0) {
        if (!confirm('🔄 ¿Reiniciar el cuestionario? Se perderá todo el progreso actual.')) {
            return;
        }
    }
    
    // Reiniciar estado del juego
    Object.assign(gameState, {
        score: 0,
        answeredQuestions: 0,
        correctStreak: 0,
        maxStreak: 0,
        startTime: Date.now(),
        questionTimes: [],
        achievements: new Set(),
        powerUps: {
            timeFreeze: 0,
            hintAvailable: 3,
            skipQuestion: 1
        }
    });
    
    // Restaurar interfaz
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.classList.contains('restart-button') && !btn.classList.contains('powerup-btn')) {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
            btn.style.opacity = '';
            btn.style.pointerEvents = '';
        }
    });
    
    document.getElementById('result')?.style.setProperty('display', 'none');
    closeModal();
    updateAdvancedProgress();
    updateStatsPanel();
    updatePowerUpDisplay();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToMenu() {
    if (gameState.answeredQuestions > 0) {
        if (!confirm('🏠 ¿Volver al menú? Se perderá el progreso actual.')) {
            return;
        }
    }
    window.location.href = 'menu.html';
}

function startPerformanceTracking() {
    // Monitoreo básico de rendimiento
    setInterval(() => {
        gameState.playerProfile.confidence = Math.max(0, Math.min(1, gameState.playerProfile.confidence));
        updateStatsPanel();
    }, 5000);
}

// === INFORMACIÓN DE SISTEMA ===
console.log(`
🚀 SISTEMA ICFES ÉLITE - GRADO 9º
📊 Funcionalidades Avanzadas:
   • IA básica para análisis de rendimiento
   • Sistema de logros gamificado
   • Power-ups y ayudas inteligentes
   • Análisis predictivo de dificultad
   • Retroalimentación personalizada
   
⌨️ Controles Avanzados:
   • ESC: Cerrar modales
   • Ctrl+R: Reiniciar cuestionario
   • Ctrl+M: Ir al menú
   • 1,2,3: Respuesta rápida
   • H: Usar pista
   • S: Saltar pregunta
   
🎯 ¡Buena suerte en tu simulacro ICFES!
`);