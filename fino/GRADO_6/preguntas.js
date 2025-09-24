// Variables globales mejoradas para grado 8
let score = 0;
let totalQuestions = 20;
let answeredQuestions = 0;
let questions = [];
let startTime = 0;
let questionTimes = [];

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    questions = document.querySelectorAll('.question');
    totalQuestions = questions.length;
    startTime = Date.now();
    createModal();
    addProgressBar();
    console.log(`🎯 Sistema de preguntas inicializado para Grado 8 - ${totalQuestions} preguntas`);
});

// Crear el modal dinámicamente con diseño mejorado
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content" id="modal-content">
            <h3 id="modal-title"></h3>
            <p id="modal-message"></p>
            <div id="modal-explanation" style="margin-top: 15px; font-style: italic; color: #7f8c8d;"></div>
            <button id="close-modal" class="close-modal" onclick="closeModal()">Continuar ✨</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Añadir barra de progreso
function addProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.innerHTML = `
        <div style="margin: 20px 0; background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; overflow: hidden;">
            <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #00b894, #55a3ff); width: 0%; transition: width 0.5s ease; border-radius: 10px;"></div>
        </div>
        <div style="text-align: center; color: white; font-weight: 600; margin-bottom: 20px;">
            <span id="progress-text">Pregunta 0 de ${totalQuestions}</span>
        </div>
    `;
    
    const quizSection = document.querySelector('.quiz-section');
    if (quizSection && quizSection.children.length > 1) {
        quizSection.insertBefore(progressContainer, quizSection.children[1]);
    }
}

// Función principal mejorada para verificar respuestas
function checkAnswer(button, isCorrect, explanation = '') {
    // Prevenir múltiples clics
    if (button.disabled) return;
    
    const questionStartTime = Date.now();
    
    // Obtener todos los botones de esta pregunta
    const questionDiv = button.closest('.question');
    const buttons = questionDiv.querySelectorAll('button');
    
    // Desactivar todos los botones de esta pregunta
    buttons.forEach(btn => btn.disabled = true);
    
    // Incrementar contador
    answeredQuestions++;
    
    // Aplicar estilos y efectos según la respuesta
    if (isCorrect) {
        button.classList.add('correct');
        score++;
        
        const encouragements = [
            '¡Excelente! 🌟 Tienes un gran dominio del tema.',
            '¡Correcto! 🎯 Sigues demostrando tu conocimiento.',
            '¡Muy bien! 👏 Respuesta perfecta.',
            '¡Genial! 🚀 Estás en el camino correcto.',
            '¡Fantástico! ⭐ Continúa así.'
        ];
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        showModal('¡Correcto!', randomEncouragement, 'correct', explanation);
        
        // Efecto de confeti virtual
        createConfettiEffect();
        
    } else {
        button.classList.add('incorrect');
        
        // Resaltar la respuesta correcta con animación
        let correctButton = null;
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes('true')) {
                btn.classList.add('correct');
                correctButton = btn;
            }
        });
        
        const motivations = [
            '¡No te preocupes! 💪 Cada error es una oportunidad de aprender.',
            '¡Sigue intentando! 📚 La respuesta correcta está marcada en verde.',
            '¡Casi lo logras! 🎯 Analiza la respuesta correcta para la próxima.',
            '¡No te rindas! 🌟 El aprendizaje es un proceso.',
            '¡Muy cerca! 👍 Revisa la respuesta correcta y continúa.'
        ];
        
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        let message = randomMotivation;
        
        if (correctButton) {
            message += `\n\n🔍 La respuesta correcta es: ${correctButton.textContent}`;
        }
        
        showModal('¡Inténtalo de nuevo!', message, 'incorrect', explanation);
    }
    
    // Actualizar progreso
    updateProgress();
    
    // Registrar tiempo de respuesta
    questionTimes.push({
        question: answeredQuestions,
        time: questionStartTime - startTime,
        correct: isCorrect
    });
    
    // Verificar si se han respondido todas las preguntas
    if (answeredQuestions === totalQuestions) {
        setTimeout(() => {
            showFinalScore();
        }, 2000);
    }
}

// Crear efecto de confeti para respuestas correctas
function createConfettiEffect() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                animation: confettiFall 3s ease-out forwards;
                pointer-events: none;
                z-index: 3000;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 3000);
        }, i * 100);
    }
}

// Agregar animación CSS para el confeti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
@keyframes confettiFall {
    to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(confettiStyle);

// Mostrar modal con feedback mejorado
function showModal(title, message, type, explanation = '') {
    const modal = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalExplanation = document.getElementById('modal-explanation');
    const closeButton = document.getElementById('close-modal');
    
    // Configurar contenido del modal
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalExplanation.textContent = explanation || '';
    modalExplanation.style.display = explanation ? 'block' : 'none';
    
    // Aplicar estilos según el tipo
    modalContent.className = `modal-content ${type}`;
    modalTitle.className = type;
    closeButton.className = `close-modal ${type}`;
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Auto-cerrar después de 3 segundos para respuestas correctas
    if (type === 'correct') {
        setTimeout(() => {
            closeModal();
        }, 2500);
    }
    
    // Enfocar el botón para accesibilidad
    setTimeout(() => {
        closeButton.focus();
    }, 100);
}

// Actualizar barra de progreso
function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        const progressPercent = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = progressPercent + '%';
        progressText.textContent = `Pregunta ${answeredQuestions} de ${totalQuestions}`;
    }
}

// Cerrar modal con efectos
function closeModal() {
    const modal = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.style.animation = 'modalSlideOut 0.3s ease forwards';
    
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.style.animation = '';
    }, 300);
}

// Agregar animación de salida del modal
const modalOutStyle = document.createElement('style');
modalOutStyle.textContent = `
@keyframes modalSlideOut {
    from {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    to {
        transform: translateY(-50px) scale(0.8);
        opacity: 0;
    }
}
`;
document.head.appendChild(modalOutStyle);

// Cerrar modal con tecla Escape o clic fuera
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('feedback-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Mostrar puntuación final mejorada
function showFinalScore() {
    const percentage = Math.round((score / totalQuestions) * 100);
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const avgTime = Math.round(totalTime / totalQuestions);
    
    let message = '';
    let emoji = '';
    let grade = '';
    
    if (percentage >= 95) {
        message = '¡EXCEPCIONAL! Dominio sobresaliente';
        emoji = '🏆';
        grade = 'A+';
    } else if (percentage >= 90) {
        message = '¡EXCELENTE! Muy buen dominio';
        emoji = '🌟';
        grade = 'A';
    } else if (percentage >= 85) {
        message = '¡MUY BIEN! Buen nivel de conocimiento';
        emoji = '🎯';
        grade = 'B+';
    } else if (percentage >= 80) {
        message = '¡BIEN! Nivel satisfactorio';
        emoji = '👍';
        grade = 'B';
    } else if (percentage >= 70) {
        message = 'REGULAR - Puedes mejorar';
        emoji = '📚';
        grade = 'C';
    } else if (percentage >= 60) {
        message = 'NECESITAS ESTUDIAR MÁS';
        emoji = '💪';
        grade = 'D';
    } else {
        message = 'REQUIERE REFUERZO ACADÉMICO';
        emoji = '📖';
        grade = 'F';
    }
    
    const scoreDisplay = document.getElementById('score-display');
    const resultDiv = document.getElementById('result');
    
    if (scoreDisplay && resultDiv) {
        scoreDisplay.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">${emoji}</div>
            <div style="font-size: 28px; margin-bottom: 10px;">Calificación: ${grade}</div>
            <div style="margin-bottom: 15px;">${message}</div>
            <div style="font-size: 24px; margin-bottom: 10px;">
                Puntuación: ${score}/${totalQuestions} (${percentage}%)
            </div>
            <div style="font-size: 16px; opacity: 0.9;">
                ⏱️ Tiempo total: ${Math.floor(totalTime/60)}:${(totalTime%60).toString().padStart(2,'0')}<br>
                📊 Promedio por pregunta: ${avgTime}s
            </div>
        `;
        
        resultDiv.style.display = 'block';
        
        // Scroll suave hacia el resultado
        resultDiv.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Efecto especial para calificaciones altas
        if (percentage >= 90) {
            createCelebrationEffect();
        }
    }
}

// Crear efecto de celebración para altas puntuaciones
function createCelebrationEffect() {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.style.cssText = `
        position: fixed;
        font-size: 60px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: celebrate 2s ease-in-out;
        pointer-events: none;
        z-index: 3000;
    `;
    
    const celebrateStyle = document.createElement('style');
    celebrateStyle.textContent = `
    @keyframes celebrate {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    `;
    
    document.head.appendChild(celebrateStyle);
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        document.body.removeChild(celebration);
        document.head.removeChild(celebrateStyle);
    }, 2000);
}

// Reiniciar cuestionario con confirmación
function restartQuiz() {
    if (answeredQuestions > 0) {
        if (!confirm('¿Estás seguro de que quieres reiniciar el cuestionario? Se perderá todo el progreso actual.')) {
            return;
        }
    }
    
    // Reiniciar variables
    score = 0;
    answeredQuestions = 0;
    startTime = Date.now();
    questionTimes = [];
    
    // Restaurar todos los botones
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (!btn.classList.contains('restart-button')) {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
            btn.style.background = '';
            btn.style.boxShadow = '';
        }
    });
    
    // Resetear progreso
    updateProgress();
    
    // Ocultar resultado
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    
    // Cerrar modal si está abierto
    closeModal();
    
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('🔄 Cuestionario reiniciado');
}

// Funciones de navegación
function goToMenu() {
    if (answeredQuestions > 0) {
        if (!confirm('¿Estás seguro de que quieres volver al menú? Se perderá el progreso actual.')) {
            return;
        }
    }
    window.location.href = 'menu.html';
}

function goBack() {
    window.history.back();
}

// Atajos de teclado mejorados
document.addEventListener('keydown', function(event) {
    // Cerrar modal con Escape
    if (event.key === 'Escape') {
        closeModal();
    }
    
    // Reiniciar con Ctrl+R (prevenir recarga y usar nuestra función)
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        restartQuiz();
    }
    
    // Ir al menú con Ctrl+M
    if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        goToMenu();
    }
    
    // Responder con números 1, 2, 3
    if (['1', '2', '3'].includes(event.key)) {
        const activeQuestion = document.querySelector('.question:not([data-answered="true"])');
        if (activeQuestion) {
            const buttons = activeQuestion.querySelectorAll('button:not(:disabled)');
            const buttonIndex = parseInt(event.key) - 1;
            if (buttons[buttonIndex]) {
                buttons[buttonIndex].click();
            }
        }
    }
});

// Prevenir trampas
document.addEventListener('contextmenu', function(event) {
    if (event.target.tagName === 'BUTTON') {
        event.preventDefault();
        console.log('🚫 Clic derecho deshabilitado en botones');
    }
});

// Detectar si el usuario cambia de pestaña (anti-trampa básica)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && answeredQuestions > 0 && answeredQuestions < totalQuestions) {
        console.log('⚠️ Usuario cambió de pestaña durante el cuestionario');
        // Aquí podrías implementar alguna acción si detectas comportamiento sospechoso
    }
});

// Función para mostrar estadísticas de rendimiento
function showStats() {
    if (questionTimes.length === 0) return;
    
    const correctAnswers = questionTimes.filter(q => q.correct).length;
    const avgTime = questionTimes.reduce((sum, q) => sum + q.time, 0) / questionTimes.length / 1000;
    
    console.log('📊 Estadísticas del cuestionario:');
    console.log(`✅ Respuestas correctas: ${correctAnswers}/${questionTimes.length}`);
    console.log(`⏱️ Tiempo promedio: ${avgTime.toFixed(1)}s`);
    console.log(`🎯 Precisión: ${((correctAnswers/questionTimes.length)*100).toFixed(1)}%`);
}

// Información de debug (solo en desarrollo)
console.log('🚀 Sistema de preguntas ICFES - Grado 8 - Versión Avanzada');
console.log('⌨️ Atajos disponibles:');
console.log('  • ESC: Cerrar modal');
console.log('  • Ctrl+R: Reiniciar cuestionario');
console.log('  • Ctrl+M: Ir al menú');
console.log('  • 1,2,3: Seleccionar respuesta rápida');