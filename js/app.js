// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    //capturamos elementos del dom
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('preview-output');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    // Variable para controlar el estado de validación
    let isValidationActive = false;

    // funcion para el tema claro obscuro
    function initTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Función para validar contenido (solo espacios vacíos)
    function validateContent(text) {
        // Verifica si el texto contiene solo espacios, tabs, saltos de línea, etc.
        return text.length > 0 && text.trim().length === 0;
    }

    // Función para mostrar alerta personalizada
    function showValidationAlert() {
        // Crear elemento de alerta personalizada
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fee2e2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                max-width: 300px;
                font-size: 14px;
                font-weight: 500;
            ">
                ⚠️ El contenido no puede contener solo espacios vacíos
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover la alerta después de 3 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }

    // Función para limpiar contenido inválido
    function cleanInvalidContent() {
        const currentValue = markdownInput.value;
        if (validateContent(currentValue)) {
            markdownInput.value = '';
            showValidationAlert();
            updateCounters();
            renderMarkdown();
        }
    }

    // Función para actualizar contadores
    function updateCounters() {
        const text = markdownInput.value;
        const characters = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        charCount.textContent = characters.toLocaleString();
        wordCount.textContent = words.toLocaleString();
    }

    // Función para renderizar Markdown a HTML
    function renderMarkdown() {
        const markdownText = markdownInput.value;
        
        if (markdownText.trim() === '') {
            markdownPreview.innerHTML = '<div class="preview-placeholder">La vista previa aparecerá aquí...</div>';
            return;
        }

        try {
            const htmlText = marked.parse(markdownText);
            markdownPreview.innerHTML = htmlText;
        } catch (error) {
            console.error('Error al renderizar Markdown:', error);
            markdownPreview.innerHTML = '<div class="preview-placeholder" style="color: #ef4444;">Error al renderizar el Markdown</div>';
        }
    }

    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Evento principal de input con validación
    markdownInput.addEventListener('input', function() {
        updateCounters();
        renderMarkdown();
    });

    // Evento para validar cuando el usuario deja de escribir (con debounce)
    let validationTimeout;
    markdownInput.addEventListener('input', function() {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
            cleanInvalidContent();
        }, 500); // Espera 500ms después de que el usuario deje de escribir
    });

    // Evento para validar cuando el campo pierde el foco
    markdownInput.addEventListener('blur', function() {
        cleanInvalidContent();
    });

    // Evento para prevenir pegar solo espacios
    markdownInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const pastedContent = markdownInput.value;
            if (validateContent(pastedContent)) {
                e.preventDefault();
                markdownInput.value = '';
                showValidationAlert();
                updateCounters();
                renderMarkdown();
            }
        }, 10);
    });

    
    const form = markdownInput.closest('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (validateContent(markdownInput.value)) {
                e.preventDefault();
                showValidationAlert();
                markdownInput.focus();
            }
        });
    }


    initTheme();
    updateCounters();
    renderMarkdown();
});
       