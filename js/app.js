// Esperar a que el DOM esté completamente cargado
        document.addEventListener('DOMContentLoaded', function() {
            // Referencias a elementos del DOM
            const themeToggle = document.getElementById('theme-toggle');
            const sunIcon = document.getElementById('sun-icon');
            const moonIcon = document.getElementById('moon-icon');
            const markdownInput = document.getElementById('markdown-input');
            const markdownPreview = document.getElementById('preview-output');
            const charCount = document.getElementById('char-count');
            const wordCount = document.getElementById('word-count');

            // Funcionalidad de cambio de tema
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
            
            markdownInput.addEventListener('input', function() {
                updateCounters();
                renderMarkdown();
            });

            // Inicialización
            initTheme();
            updateCounters();
            renderMarkdown();
        });