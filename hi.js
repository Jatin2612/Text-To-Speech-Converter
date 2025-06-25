document.addEventListener('DOMContentLoaded', function() {
    const text = document.getElementById("textToConvert");
    const convertBtn = document.getElementById("convertBtn");
    const voiceSelect = document.getElementById("voiceSelect");
    let voices = [];
    
    // Load available voices
    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        
        voices.forEach((voice, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }
    
    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    
    convertBtn.addEventListener('click', function () {
        const speechSynth = window.speechSynthesis;
        const enteredText = text.value;
        const error = document.querySelector('.error-para');
        
        if (!speechSynth.speaking && !enteredText.trim().length) {
            error.textContent = `Nothing to Convert! Enter text in the text area.`;
            return;
        }
        
        if (speechSynth.speaking) {
            speechSynth.cancel();
            convertBtn.textContent = "Play Converted Sound";
            return;
        }
        
        if (!speechSynth.speaking && enteredText.trim().length) {
            error.textContent = "";
            const newUtter = new SpeechSynthesisUtterance(enteredText);
            
            // Set selected voice
            const selectedVoice = voices[voiceSelect.value];
            if (selectedVoice) {
                newUtter.voice = selectedVoice;
            }
            
            // Add some natural variation
            newUtter.rate = 0.9 + Math.random() * 0.2;
            newUtter.pitch = 0.8 + Math.random() * 0.4;
            
            newUtter.onend = function() {
                convertBtn.textContent = "Play Converted Sound";
            };
            
            speechSynth.speak(newUtter);
            convertBtn.textContent = "Stop Playing";
        }
    });
});
