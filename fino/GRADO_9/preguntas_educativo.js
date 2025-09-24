/**
 * =====================================================
 * SISTEMA EDUCATIVO AVANZADO - GRADO 9º
 * JavaScript Educativo con Enfoque Académico
 * Versión Formal y Profesional
 * =====================================================
 */

// === CONFIGURACIÓN EDUCATIVA GLOBAL ===
const EDUCATIONAL_CONFIG = {
    timerEnabled: true,
    detailedFeedback: true,
    showProgress: true,
    enableHints: true,
    academicMode: true,
    subject: 'general'
};

// === ESTADO ACADÉMICO DEL ESTUDIANTE ===
let academicState = {
    score: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    startTime: null,
    questionTimes: [],
    currentStreak: 0,
    maxStreak: 0,
    hintsUsed: 0,
    skipCount: 0,
    performanceData: {
        averageTime: 0,
        accuracy: 0,
        confidenceLevel: 'Principiante',
        strengths: [],
        areasForImprovement: []
    }
};

// === SISTEMA DE RETROALIMENTACIÓN EDUCATIVA ===
const EducationalFeedback = {
    // Retroalimentación basada en rendimiento
    getPerformanceFeedback(accuracy) {
        if (accuracy >= 90) {
            return {
                level: "Excelente",
                message: "Demuestras un dominio excepcional del tema. Tu comprensión está al nivel esperado para continuar con estudios superiores.",
                recommendation: "Considera explorar temas más avanzados para mantener el desafío académico.",
                icon: "🏆"
            };
        } else if (accuracy >= 80) {
            return {
                level: "Muy Bueno",
                message: "Tu comprensión del tema es sólida. Has demostrado un buen manejo de los conceptos fundamentales.",
                recommendation: "Continúa practicando para consolidar tu conocimiento y alcanzar la excelencia.",
                icon: "⭐"
            };
        } else if (accuracy >= 70) {
            return {
                level: "Bueno",
                message: "Muestras una comprensión adecuada del tema con algunas áreas que requieren refuerzo.",
                recommendation: "Revisa los conceptos donde tuviste dificultades y practica ejercicios adicionales.",
                icon: "👍"
            };
        } else if (accuracy >= 60) {
            return {
                level: "Satisfactorio",
                message: "Tu comprensión básica es correcta, pero necesitas fortalecer varios conceptos clave.",
                recommendation: "Dedica tiempo adicional al estudio y busca materiales complementarios.",
                icon: "📚"
            };
        } else {
            return {
                level: "Necesita Mejora",
                message: "Es importante reforzar los fundamentos del tema. No te desanimes, el aprendizaje es un proceso.",
                recommendation: "Consulta con tu profesor y utiliza recursos educativos adicionales para fortalecer tu base.",
                icon: "💪"
            };
        }
    },

    // Análisis de fortalezas y debilidades
    analyzePerformance(questionData) {
        const correctCount = questionData.filter(q => q.correct).length;
        const accuracy = (correctCount / questionData.length) * 100;
        
        return {
            accuracy: accuracy,
            totalTime: questionData.reduce((sum, q) => sum + q.time, 0),
            averageTime: questionData.reduce((sum, q) => sum + q.time, 0) / questionData.length,
            fastestTime: Math.min(...questionData.map(q => q.time)),
            slowestTime: Math.max(...questionData.map(q => q.time)),
            streak: this.calculateBestStreak(questionData)
        };
    },

    calculateBestStreak(questionData) {
        let maxStreak = 0;
        let currentStreak = 0;
        
        questionData.forEach(q => {
            if (q.correct) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        
        return maxStreak;
    }
};

// === INICIALIZACIÓN DEL SISTEMA EDUCATIVO ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Sistema Educativo Avanzado - Grado 9º');
    console.log('🎯 Modo Académico Activado');
    
    initializeEducationalSystem();
    setupAcademicInterface();
    setupEducationalEventListeners();
    
    console.log('✅ Sistema educativo inicializado correctamente');
});

function initializeEducationalSystem() {
    academicState.startTime = Date.now();
    academicState.totalQuestions = document.querySelectorAll('.question').length;
    
    // Configurar sección de control educativo
    const controlSection = createEducationalControls();
    const quizSection = document.querySelector('.quiz-section');
    
    if (quizSection && quizSection.children.length > 0) {
        quizSection.insertBefore(controlSection, quizSection.children[1]);
    }
    
    // Inicializar barra de progreso académica
    createAcademicProgressBar();
    
    // Configurar animaciones suaves para carga
    document.querySelectorAll('.question').forEach((question, index) => {
        question.classList.add('loading');
        question.style.animationDelay = `${index * 0.15}s`;
    });
}

// === INTERFAZ EDUCATIVA ===
function createEducationalControls() {
    const controlSection = document.createElement('div');
    controlSection.className = 'educational-controls';
    controlSection.innerHTML = `
        <div class="academic-header">
            <h3>📊 Panel de Control Académico</h3>
            <div class="academic-stats">
                <div class="stat-item">
                    <span class="stat-label">Progreso:</span>
                    <span id="progress-indicator">0/${academicState.totalQuestions}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Precisión:</span>
                    <span id="accuracy-indicator">0%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiempo:</span>
                    <span id="time-indicator">00:00</span>
                </div>
            </div>
        </div>
        <div class="help-section">
            <button class="help-btn" onclick="showEducationalHint()" title="Obtener ayuda pedagógica">
                💡 Ayuda Académica
            </button>
            <button class="help-btn" onclick="showStudyGuide()" title="Ver guía de estudio">
                📖 Guía de Estudio
            </button>
        </div>
    `;
    
    return controlSection;
}

function createAcademicProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'academic-progress-container';
    progressContainer.innerHTML = `
        <div class="progress-header">
            <h4>📈 Progreso Académico</h4>
        </div>
        <div class="progress-track">
            <div id="academic-progress-bar" style="width: 0%"></div>
        </div>
        <div class="progress-details">
            <span id="question-counter">Pregunta 0 de ${academicState.totalQuestions}</span>
            <span id="success-rate">Tasa de éxito: 0%</span>
        </div>
    `;
    
    const quizSection = document.querySelector('.quiz-section');
    if (quizSection) {
        quizSection.appendChild(progressContainer);
    }
}

// === FUNCIÓN PRINCIPAL DE EVALUACIÓN ACADÉMICA ===
function checkAnswer(button, isCorrect, explanation = '', difficulty = 'normal') {
    if (button.disabled) return;
    
    const questionStartTime = Date.now();
    const responseTime = questionStartTime - (academicState.lastQuestionTime || academicState.startTime);
    academicState.lastQuestionTime = questionStartTime;
    
    // Identificar elementos de la pregunta
    const questionContainer = button.closest('.question');
    const allButtons = questionContainer.querySelectorAll('button');
    
    // Desactivar todos los botones de la pregunta
    allButtons.forEach(btn => btn.disabled = true);
    
    // Registrar datos de la respuesta
    academicState.answeredQuestions++;
    academicState.questionTimes.push({
        questionNumber: academicState.answeredQuestions,
        responseTime: responseTime,
        correct: isCorrect,
        difficulty: difficulty
    });
    
    if (isCorrect) {
        // Respuesta correcta
        button.classList.add('correct');
        academicState.score++;
        academicState.correctAnswers++;
        academicState.currentStreak++;
        academicState.maxStreak = Math.max(academicState.maxStreak, academicState.currentStreak);
        
        showEducationalModal('correct', 'Respuesta Correcta', 
            'Excelente trabajo. Tu comprensión del concepto es clara.', explanation);
    } else {
        // Respuesta incorrecta
        button.classList.add('incorrect');
        academicState.currentStreak = 0;
        
        // Mostrar respuesta correcta
        const correctButton = Array.from(allButtons).find(btn => 
            btn.onclick && btn.onclick.toString().includes('true')
        );
        if (correctButton) {
            correctButton.classList.add('correct');
        }
        
        showEducationalModal('incorrect', 'Respuesta Incorrecta', 
            'No te preocupes. Los errores son parte del proceso de aprendizaje.', explanation);
    }
    
    // Actualizar interfaz académica
    updateAcademicInterface();
    
    // Verificar si se completó la evaluación
    if (academicState.answeredQuestions === academicState.totalQuestions) {
        setTimeout(() => showAcademicResults(), 1500);
    }
}

// === MODAL EDUCATIVO ===
function showEducationalModal(type, title, message, explanation) {
    let modal = document.getElementById('educational-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'educational-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const academicFeedback = generateAcademicFeedback();
    
    modal.innerHTML = `
        <div class="modal-content ${type}">
            <h3 class="${type}">${title}</h3>
            <p class="main-message">${message}</p>
            
            ${explanation ? `
                <div class="explanation-section">
                    <h4>📝 Explicación Académica:</h4>
                    <div class="explanation-text">${explanation}</div>
                </div>
            ` : ''}
            
            <div class="academic-insight">
                <h4>🎓 Perspectiva Educativa:</h4>
                <p>${academicFeedback}</p>
            </div>
            
            <div class="progress-update">
                <p><strong>Progreso:</strong> ${academicState.answeredQuestions}/${academicState.totalQuestions} preguntas completadas</p>
                <p><strong>Precisión actual:</strong> ${Math.round((academicState.correctAnswers / academicState.answeredQuestions) * 100)}%</p>
            </div>
            
            <button class="close-modal" onclick="closeEducationalModal()">
                Continuar con el Aprendizaje →
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeEducationalModal() {
    const modal = document.getElementById('educational-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateAcademicFeedback() {
    const currentAccuracy = (academicState.correctAnswers / academicState.answeredQuestions) * 100;
    const averageTime = academicState.questionTimes.reduce((sum, q) => sum + q.responseTime, 0) / academicState.questionTimes.length;
    
    if (currentAccuracy === 100) {
        return "Mantienes un rendimiento perfecto. Tu metodología de estudio está dando excelentes resultados.";
    } else if (currentAccuracy >= 80) {
        return "Tu comprensión conceptual es sólida. Continúa con este enfoque sistemático de aprendizaje.";
    } else if (currentAccuracy >= 60) {
        return "Estás progresando adecuadamente. Considera repasar los conceptos fundamentales para fortalecer tu base.";
    } else {
        return "Recuerda que el aprendizaje es un proceso gradual. Identifica los conceptos clave que necesitan más práctica.";
    }
}

// === ACTUALIZACIÓN DE INTERFAZ ACADÉMICA ===
function updateAcademicInterface() {
    // Actualizar contador de progreso
    const progressIndicator = document.getElementById('progress-indicator');
    if (progressIndicator) {
        progressIndicator.textContent = `${academicState.answeredQuestions}/${academicState.totalQuestions}`;
    }
    
    // Actualizar precisión
    const accuracyIndicator = document.getElementById('accuracy-indicator');
    if (accuracyIndicator) {
        const accuracy = Math.round((academicState.correctAnswers / academicState.answeredQuestions) * 100);
        accuracyIndicator.textContent = `${accuracy}%`;
    }
    
    // Actualizar tiempo transcurrido
    const timeIndicator = document.getElementById('time-indicator');
    if (timeIndicator) {
        const elapsedTime = Math.floor((Date.now() - academicState.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timeIndicator.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Actualizar barra de progreso
    const progressBar = document.getElementById('academic-progress-bar');
    if (progressBar) {
        const percentage = (academicState.answeredQuestions / academicState.totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    // Actualizar contador de preguntas
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter) {
        questionCounter.textContent = `Pregunta ${academicState.answeredQuestions} de ${academicState.totalQuestions}`;
    }
    
    // Actualizar tasa de éxito
    const successRate = document.getElementById('success-rate');
    if (successRate) {
        const rate = Math.round((academicState.correctAnswers / academicState.answeredQuestions) * 100);
        successRate.textContent = `Tasa de éxito: ${rate}%`;
    }
}

// === RESULTADOS ACADÉMICOS FINALES ===
function showAcademicResults() {
    const totalTime = Date.now() - academicState.startTime;
    const accuracy = (academicState.correctAnswers / academicState.totalQuestions) * 100;
    const averageTime = academicState.questionTimes.reduce((sum, q) => sum + q.responseTime, 0) / academicState.questionTimes.length;
    
    const performanceAnalysis = EducationalFeedback.analyzePerformance(academicState.questionTimes);
    const feedback = EducationalFeedback.getPerformanceFeedback(accuracy);
    
    const resultContainer = document.getElementById('result') || createResultContainer();
    
    resultContainer.innerHTML = `
        <div class="academic-results">
            <h2>📊 Informe Académico de Rendimiento</h2>
            
            <div class="performance-overview">
                <div class="grade-display">
                    <div class="grade-circle ${getGradeClass(accuracy)}">
                        <span class="grade-number">${Math.round(accuracy)}</span>
                        <span class="grade-symbol">%</span>
                    </div>
                    <div class="grade-description">
                        <h3>${feedback.icon} ${feedback.level}</h3>
                        <p>${feedback.message}</p>
                    </div>
                </div>
            </div>
            
            <div class="detailed-metrics">
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="metric-value">${academicState.correctAnswers}/${academicState.totalQuestions}</div>
                        <div class="metric-label">Respuestas Correctas</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${formatTime(averageTime)}</div>
                        <div class="metric-label">Tiempo Promedio</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${academicState.maxStreak}</div>
                        <div class="metric-label">Mejor Racha</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${formatTime(totalTime)}</div>
                        <div class="metric-label">Tiempo Total</div>
                    </div>
                </div>
            </div>
            
            <div class="educational-recommendations">
                <h4>🎯 Recomendaciones Académicas:</h4>
                <div class="recommendation-text">${feedback.recommendation}</div>
            </div>
            
            <div class="action-buttons">
                <button onclick="restartEducationalQuiz()" class="restart-button">
                    🔄 Realizar Nueva Evaluación
                </button>
                <button onclick="goToAcademicMenu()" class="restart-button">
                    🏠 Menú Principal
                </button>
                <button onclick="generateStudyReport()" class="restart-button">
                    📋 Generar Informe de Estudio
                </button>
            </div>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function createResultContainer() {
    const container = document.createElement('div');
    container.id = 'result';
    container.className = 'academic-result-container';
    document.querySelector('.quiz-section').appendChild(container);
    return container;
}

function getGradeClass(accuracy) {
    if (accuracy >= 90) return 'grade-excellent';
    if (accuracy >= 80) return 'grade-good';
    if (accuracy >= 70) return 'grade-satisfactory';
    if (accuracy >= 60) return 'grade-needs-improvement';
    return 'grade-unsatisfactory';
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

// === FUNCIONES DE AYUDA EDUCATIVA ===
function showEducationalHint() {
    if (academicState.hintsUsed >= 3) {
        alert('Has utilizado todas las ayudas disponibles. ¡Confía en tu conocimiento!');
        return;
    }
    
    academicState.hintsUsed++;
    
    const hintModal = document.createElement('div');
    hintModal.className = 'modal';
    hintModal.innerHTML = `
        <div class="modal-content">
            <h3>💡 Ayuda Académica</h3>
            <div class="hint-content">
                <p><strong>Estrategia de Resolución:</strong></p>
                <ul>
                    <li>Lee cuidadosamente toda la pregunta</li>
                    <li>Identifica las palabras clave</li>
                    <li>Elimina las opciones claramente incorrectas</li>
                    <li>Aplica los conceptos que has estudiado</li>
                    <li>Si tienes dudas, selecciona la opción más lógica</li>
                </ul>
                <p><em>Recuerda: El proceso de pensamiento es más importante que la respuesta correcta.</em></p>
            </div>
            <button class="close-modal" onclick="closeHintModal()">
                Entendido - Continuar
            </button>
        </div>
    `;
    
    document.body.appendChild(hintModal);
    hintModal.style.display = 'block';
    
    setTimeout(() => {
        hintModal.remove();
    }, 8000);
}

function closeHintModal() {
    const hintModal = document.querySelector('.modal');
    if (hintModal) {
        hintModal.remove();
    }
}

function showStudyGuide() {
    const currentSubject = getCurrentSubject();
    const guideModal = document.createElement('div');
    guideModal.className = 'modal';
    guideModal.innerHTML = `
        <div class="modal-content study-guide">
            <h3>📖 Guía de Estudio - ${currentSubject}</h3>
            <div class="guide-content">
                <h4>Conceptos Clave a Repasar:</h4>
                <div class="study-topics">
                    ${getStudyTopics(currentSubject)}
                </div>
                <h4>Técnicas de Estudio Recomendadas:</h4>
                <ul>
                    <li>📚 <strong>Lectura Activa:</strong> Subraya conceptos importantes</li>
                    <li>🗂️ <strong>Resúmenes:</strong> Crea esquemas y mapas conceptuales</li>
                    <li>🔄 <strong>Repaso Espaciado:</strong> Revisa el material regularmente</li>
                    <li>✍️ <strong>Práctica:</strong> Resuelve ejercicios similares</li>
                    <li>👥 <strong>Estudio Grupal:</strong> Explica conceptos a otros</li>
                </ul>
            </div>
            <button class="close-modal" onclick="closeStudyGuide()">
                Cerrar Guía
            </button>
        </div>
    `;
    
    document.body.appendChild(guideModal);
    guideModal.style.display = 'block';
}

function closeStudyGuide() {
    const guideModal = document.querySelector('.study-guide').closest('.modal');
    if (guideModal) {
        guideModal.remove();
    }
}

function getStudyTopics(subject) {
    const topics = {
        'MATEMATICAS': `
            <div class="topic-item">• Álgebra y ecuaciones lineales</div>
            <div class="topic-item">• Funciones y gráficas</div>
            <div class="topic-item">• Geometría y trigonometría</div>
            <div class="topic-item">• Probabilidad y estadística</div>
            <div class="topic-item">• Cálculo básico (derivadas e integrales)</div>
        `,
        'ESPAÑOL': `
            <div class="topic-item">• Análisis textual y comprensión lectora</div>
            <div class="topic-item">• Gramática y sintaxis avanzada</div>
            <div class="topic-item">• Literatura y géneros literarios</div>
            <div class="topic-item">• Producción textual argumentativa</div>
            <div class="topic-item">• Comunicación oral y escrita</div>
        `,
        'default': `
            <div class="topic-item">• Conceptos fundamentales de la materia</div>
            <div class="topic-item">• Aplicación práctica de teorías</div>
            <div class="topic-item">• Análisis crítico y reflexivo</div>
            <div class="topic-item">• Resolución de problemas complejos</div>
        `
    };
    
    return topics[subject] || topics['default'];
}

// === FUNCIONES AUXILIARES ===
function getCurrentSubject() {
    const title = document.querySelector('h1');
    if (!title) return 'General';
    
    const titleText = title.textContent.toLowerCase();
    if (titleText.includes('matemáticas') || titleText.includes('matematicas')) return 'MATEMATICAS';
    if (titleText.includes('español') || titleText.includes('espanol')) return 'ESPAÑOL';
    if (titleText.includes('inglés') || titleText.includes('ingles')) return 'INGLES';
    if (titleText.includes('naturales') || titleText.includes('ciencias')) return 'NATURALES';
    if (titleText.includes('sociales') || titleText.includes('social')) return 'SOCIALES';
    
    return 'General';
}

function restartEducationalQuiz() {
    if (confirm('¿Estás seguro de que deseas reiniciar la evaluación? Se perderá todo el progreso actual.')) {
        location.reload();
    }
}

function goToAcademicMenu() {
    window.location.href = 'menu.html';
}

function generateStudyReport() {
    const accuracy = (academicState.correctAnswers / academicState.totalQuestions) * 100;
    const totalTime = Date.now() - academicState.startTime;
    const averageTime = academicState.questionTimes.reduce((sum, q) => sum + q.responseTime, 0) / academicState.questionTimes.length;
    
    const reportContent = `
=== INFORME ACADÉMICO DE RENDIMIENTO ===
Materia: ${getCurrentSubject()}
Fecha: ${new Date().toLocaleDateString()}
Hora: ${new Date().toLocaleTimeString()}

RESULTADOS GENERALES:
- Preguntas respondidas: ${academicState.answeredQuestions}/${academicState.totalQuestions}
- Respuestas correctas: ${academicState.correctAnswers}
- Precisión: ${Math.round(accuracy)}%
- Tiempo total: ${formatTime(totalTime)}
- Tiempo promedio por pregunta: ${formatTime(averageTime)}
- Mejor racha: ${academicState.maxStreak} respuestas consecutivas
- Ayudas utilizadas: ${academicState.hintsUsed}

ANÁLISIS ACADÉMICO:
${EducationalFeedback.getPerformanceFeedback(accuracy).message}

RECOMENDACIONES:
${EducationalFeedback.getPerformanceFeedback(accuracy).recommendation}

=== FIN DEL INFORME ===
    `;
    
    // Crear ventana emergente con el informe
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <html>
            <head>
                <title>Informe Académico de Rendimiento</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 40px; line-height: 1.6; }
                    h1 { color: #1a5276; text-align: center; }
                    pre { background: #f8f9fa; padding: 20px; border-radius: 8px; }
                    .print-btn { 
                        background: #3498db; color: white; border: none; 
                        padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                        margin: 20px 0; 
                    }
                </style>
            </head>
            <body>
                <h1>📊 Informe Académico de Rendimiento</h1>
                <pre>${reportContent}</pre>
                <button class="print-btn" onclick="window.print()">🖨️ Imprimir Informe</button>
                <button class="print-btn" onclick="window.close()">❌ Cerrar</button>
            </body>
        </html>
    `);
}

// === CONFIGURACIÓN DE EVENTOS EDUCATIVOS ===
function setupEducationalEventListeners() {
    // Atajos de teclado educativos
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'Escape':
                closeEducationalModal();
                closeHintModal();
                closeStudyGuide();
                break;
            case 'h':
            case 'H':
                if (event.ctrlKey) {
                    event.preventDefault();
                    showEducationalHint();
                }
                break;
            case 'g':
            case 'G':
                if (event.ctrlKey) {
                    event.preventDefault();
                    showStudyGuide();
                }
                break;
            case 'r':
            case 'R':
                if (event.ctrlKey) {
                    event.preventDefault();
                    restartEducationalQuiz();
                }
                break;
        }
    });
    
    // Actualizar cronómetro cada segundo
    setInterval(() => {
        if (academicState.startTime && academicState.answeredQuestions < academicState.totalQuestions) {
            updateAcademicInterface();
        }
    }, 1000);
    
    console.log('⌨️ Atajos educativos configurados: Ctrl+H (ayuda), Ctrl+G (guía), Ctrl+R (reiniciar), ESC (cerrar modales)');
}

// Exportar funciones principales para compatibilidad
if (typeof window !== 'undefined') {
    window.checkAnswer = checkAnswer;
    window.showEducationalHint = showEducationalHint;
    window.showStudyGuide = showStudyGuide;
    window.restartEducationalQuiz = restartEducationalQuiz;
    window.goToAcademicMenu = goToAcademicMenu;
}