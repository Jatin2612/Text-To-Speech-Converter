    
        document.addEventListener('DOMContentLoaded', () => {
            const textInput = document.getElementById('text-to-speech');
            const convertBtn = document.getElementById('convert-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const stopBtn = document.getElementById('stop-btn');
            const clearBtn = document.getElementById('clear-btn');
            const voiceSelector = document.getElementById('voice-selector');
            const rateControl = document.getElementById('rate-control');
            const rateValue = document.getElementById('rate-value');
            const statusIndicator = document.getElementById('status-indicator');
            const statusText = document.getElementById('status-text');
            const errorMessage = document.getElementById('error-message');
            
            const speechSynth = window.speechSynthesis;
            let currentUtterance = null;
            let voices = [];
            
            // Populate voice options
            function loadVoices() {
                voices = speechSynth.getVoices();
                
                // Clear existing options
                voiceSelector.innerHTML = '';
                
                // Filter voices for better UX (you can remove this filter if you want all voices)
                const englishVoices = voices.filter(voice => 
                    voice.lang.includes('en') || voice.lang.includes('Eng')
                );
                
                if (englishVoices.length > 0) {
                    englishVoices.forEach(voice => {
                        const option = document.createElement('option');
                        option.value = voice.name;
                        option.textContent = `${voice.name} (${voice.lang})`;
                        voiceSelector.appendChild(option);
                    });
                } else {
                    voices.forEach(voice => {
                        const option = document.createElement('option');
                        option.value = voice.name;
                        option.textContent = `${voice.name} (${voice.lang})`;
                        voiceSelector.appendChild(option);
                    });
                }
            }
            
            // Event to populate voices when they become available
            speechSynth.onvoiceschanged = loadVoices;
            
            // Initial load
            loadVoices();
            
            // Convert text to speech
            convertBtn.addEventListener('click', () => {
                const enteredText = textInput.value.trim();
                
                if (!enteredText.length) {
                    showError('Nothing to convert! Please enter some text.');
                    return;
                }
                
                if (speechSynth.speaking && currentUtterance) {
                    speechSynth.cancel();
                }
                
                currentUtterance = new SpeechSynthesisUtterance(enteredText);
                
                // Set voice if selected
                const selectedVoice = voices.find(voice => voice.name === voiceSelector.value);
                if (selectedVoice) {
                    currentUtterance.voice = selectedVoice;
                }
                
                // Set rate
                currentUtterance.rate = parseFloat(rateControl.value);
                
                // Update UI
                updateStatus('playing');
                convertBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Playing...';
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                
                // Event listeners for the utterance
                currentUtterance.onend = () => {
                    updateStatus('ready');
                    convertBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Play Speech';
                    pauseBtn.disabled = true;
                    stopBtn.disabled = true;
                };
                
                currentUtterance.onerror = (event) => {
                    showError('An error occurred during speech synthesis: ' + event.error);
                    updateStatus('error');
                    convertBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Try Again';
                    pauseBtn.disabled = true;
                    stopBtn.disabled = true;
                };
                
                speechSynth.speak(currentUtterance);
                hideError();
            });
            
            // Pause/resume functionality
            pauseBtn.addEventListener('click', () => {
                if (speechSynth.paused) {
                    speechSynth.resume();
                    updateStatus('playing');
                    pauseBtn.innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
                } else {
                    speechSynth.pause();
                    updateStatus('paused');
                    pauseBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Resume';
                }
            });
            
            // Stop functionality
            stopBtn.addEventListener('click', () => {
                speechSynth.cancel();
                updateStatus('ready');
                convertBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Play Speech';
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
            });
            
            // Clear text
            clearBtn.addEventListener('click', () => {
                textInput.value = '';
                textInput.focus();
            });
            
            // Rate control
            rateControl.addEventListener('input', () => {
                const rate = rateControl.value;
                rateValue.textContent = `${rate}x`;
                
                if (currentUtterance) {
                    currentUtterance.rate = parseFloat(rate);
                }
            });
            
            // Update status indicator
            function updateStatus(status) {
                switch (status) {
                    case 'ready':
                        statusIndicator.className = 'status-indicator mr-2 w-3 h-3 rounded-full bg-gray-300';
                        statusText.textContent = 'Ready';
                        break;
                    case 'playing':
                        statusIndicator.className = 'status-indicator mr-2 w-3 h-3 rounded-full bg-green-500 animate-pulse';
                        statusText.textContent = 'Playing';
                        break;
                    case 'paused':
                        statusIndicator.className = 'status-indicator mr-2 w-3 h-3 rounded-full bg-yellow-500';
                        statusText.textContent = 'Paused';
                        break;
                    case 'error':
                        statusIndicator.className = 'status-indicator mr-2 w-3 h-3 rounded-full bg-red-500';
                        statusText.textContent = 'Error';
                        break;
                }
            }
            
            // Show error message
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.classList.remove('hidden');
            }
            
            // Hide error message
            function hideError() {
                errorMessage.classList.add('hidden');
            }
            
            // Check for browser support
            if (!window.speechSynthesis) {
                showError('Speech synthesis is not supported in your browser. Please try a modern browser like Chrome, Edge, or Firefox.');
                convertBtn.disabled = true;
            }
        });
    