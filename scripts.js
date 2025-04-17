// Paragraph data structure
const paragraphs = [
  {
    id: 0,
    text: "Manipulatie – dat vieze woord waar niemand zich schuldig aan maakt, maar iedereen aan onderworpen is. Alsof we er collectief een hekel aan hebben, maar stiekem allemaal een hoofdstuk uit het handboek geschreven hebben. De vraag is niet óf mensen manipuleren, maar hoe – en vooral: waarom.",
    annotations: []
  },
  {
    id: 1,
    text: "Het fascinerende is dat manipulatie zich vermomt als karakter. De extraverte charmeur? Die haalt alles gedaan met een glimlach waar je pas later vraagtekens bij zet. De rustige denker? Die speelt schaak terwijl jij nog denkt dat jullie ganzenbord doen. En de eeuwige helper, die altijd 'alleen maar wil bijdragen'? Let goed op – daar zit soms de meest geniale vorm van sturing achter. Zacht, subtiel, bijna lief. Maar doeltreffend.",
    annotations: []
  },
  {
    id: 2,
    text: "En ja, het karakter bepaalt de stijl. De controlfreak manipuleert met lijstjes, regels en 'wat-als' scenario's. De nonchalante gast doet het via ontwijking en ongrijpbaarheid – maak hem eerst maar eens vast, dan praten we verder. De perfectionist? Die speelt het spel via schuldgevoel: 'Ik had het ook alleen kunnen doen, hoor.' Auw.",
    annotations: []
  },
  {
    id: 3,
    text: "Toch is het niet per se kwaadaardig. Manipulatie is óók overleven. Beïnvloeden om ruimte te creëren. Spelen met verwachtingen om de wereld een beetje beter te laten dansen naar jouw muziek. Het zit in ons systeem – zoals katten kopjes geven of baby's huilen als ze iets willen. De vraag is niet of het slecht is, maar of je doorhebt wanneer het gebeurt. En of jij de touwtjes vasthoudt – of juist zelf een pop bent in het toneelstuk van iemand anders.",
    annotations: []
  },
  {
    id: 4,
    text: "Dus als iemand zegt: 'Ik ben gewoon eerlijk,' weet dan – dat is soms de mooiste list van allemaal.",
    annotations: []
  }
];

// App state variables
let currentIndex = 0;
let isSpeaking = false;
let currentSpeechUtterance = null;
let wordHighlightTimeout = null;
let currentWordIndex = 0;
let words = [];
let recognition;
let isDictationActive = false;
let finalTranscript = '';
let ignoreOnEnd = false;
let speechInputEnabled = true;
let lastInputLength = 0;
let lastSpokenWord = '';
let speechRate = 1.0;
let fontSize = 1.5;

// DOM elements
const manipulatieText = document.getElementById('manipulatieText');
const leftArrowButton = document.getElementById('leftArrowButton');
const rightArrowButton = document.getElementById('rightArrowButton');
const annotationsContainer = document.getElementById('annotationsContainer');
const annotationInput = document.getElementById('annotationInput');
const saveAnnotationButton = document.getElementById('saveAnnotationButton');
const toggleDictationButton = document.getElementById('toggleDictation');
const dictationStatus = document.getElementById('dictationStatus');
const readParagraphButton = document.getElementById('readParagraphButton');
const stopReadingButton = document.getElementById('stopReadingButton');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importFile = document.getElementById('importFile');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const speechRateInput = document.getElementById('speechRateInput');
const speechRateValue = document.getElementById('speechRateValue');

// Add this near the top of your script with other event listeners
document.addEventListener('keydown', (e) => {
  // Check if the pressed key is '/'
  if (e.key === '/') {
    e.preventDefault(); // Prevent the '/' from appearing in any input field
    document.getElementById('startButton').click();
  }
});

// Initialize the app
function init() {
  loadData();
  updateDisplay();
  setupEventListeners();
  initSpeechRecognition();
  updateSpeechInputUI();
  setupSliders();
  loadSlidersFromStorage();
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem('paragraphsData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    parsedData.forEach((para, index) => {
      if (paragraphs[index]) {
        paragraphs[index].annotations = para.annotations;
      }
    });
  }

  const savedRate = localStorage.getItem('speechRate');
  if (savedRate) {
    speechRate = parseFloat(savedRate);
    if (speechRateInput) {
      speechRateInput.value = speechRate;
      speechRateValue.textContent = speechRate.toFixed(1);
    }
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('paragraphsData', JSON.stringify(paragraphs));
  localStorage.setItem('speechRate', speechRate.toString());
}

// Update display
function updateDisplay() {
  manipulatieText.innerHTML = paragraphs[currentIndex].text;
  renderAnnotations();
}

// Render annotations
function renderAnnotations() {
  annotationsContainer.innerHTML = '';

  if (paragraphs[currentIndex].annotations.length === 0) {
    annotationsContainer.innerHTML = '<p>Geen annotaties voor deze paragraaf.</p>';
    return;
  }

  paragraphs[currentIndex].annotations.forEach((annotation, index) => {
    const annotationDiv = document.createElement('div');
    annotationDiv.classList.add('annotation');
    annotationDiv.setAttribute('data-para-id', currentIndex);
    annotationDiv.setAttribute('data-ann-id', index);
    annotationDiv.innerHTML = `
      <p>${annotation.text}</p>
      <small>${new Date(annotation.timestamp).toLocaleString()}</small>
      <button class="edit-annotation" data-para-id="${currentIndex}" data-ann-id="${index}">✏️</button>
      <button class="delete-annotation" data-para-id="${currentIndex}" data-ann-id="${index}">×</button>
    `;
    annotationsContainer.appendChild(annotationDiv);
  });
}

// Navigation handlers
function setupNavigation() {
  leftArrowButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? paragraphs.length - 1 : currentIndex - 1;
    updateDisplay();
  });

  rightArrowButton.addEventListener('click', () => {
    currentIndex = (currentIndex === paragraphs.length - 1) ? 0 : currentIndex + 1;
    updateDisplay();
  });
}

// Annotation handlers
function setupAnnotationHandlers() {
  saveAnnotationButton.addEventListener('click', () => {
    const text = annotationInput.value.trim();
    if (text) {
      paragraphs[currentIndex].annotations.push({
        text: text,
        timestamp: new Date().toISOString()
      });
      saveData();
      annotationInput.value = '';
      updateDisplay();

      // Stop dictation after saving annotation
      if (isDictationActive) {
        stopDictation();
      }
    }
  });

  // Also modify the Enter key handler to stop dictation
  annotationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAnnotationButton.click(); // This will trigger the save and stop dictation
    }
  });

  annotationsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-annotation')) {
      const paraId = parseInt(e.target.getAttribute('data-para-id'));
      const annId = parseInt(e.target.getAttribute('data-ann-id'));

      if (paragraphs[paraId] && paragraphs[paraId].annotations[annId]) {
        paragraphs[paraId].annotations.splice(annId, 1);
        saveData();
        updateDisplay();
      }
    }

    if (e.target.classList.contains('edit-annotation')) {
      const paraId = parseInt(e.target.getAttribute('data-para-id'));
      const annId = parseInt(e.target.getAttribute('data-ann-id'));
      editAnnotation(paraId, annId);
    }

    // Speak annotation when clicked
    const annotationDiv = e.target.closest('.annotation');
    if (annotationDiv) {
      const paraId = parseInt(annotationDiv.getAttribute('data-para-id'));
      const annId = parseInt(annotationDiv.getAttribute('data-ann-id'));
      const annotationText = paragraphs[paraId].annotations[annId].text;
      speakText(annotationText);
    }
  });
}

// Edit annotation
function editAnnotation(paraId, annId) {
  const annotation = paragraphs[paraId].annotations[annId];
  const annotationDiv = document.querySelector(`.annotation[data-para-id="${paraId}"][data-ann-id="${annId}"]`);

  annotationDiv.innerHTML = `
    <textarea class="annotation-edit-input">${annotation.text}</textarea>
    <div class="annotation-edit-buttons">
      <button class="annotation-edit-save">Opslaan</button>
      <button class="annotation-edit-cancel">Annuleren</button>
    </div>
  `;

  annotationDiv.querySelector('.annotation-edit-save').addEventListener('click', () => {
    const newText = annotationDiv.querySelector('.annotation-edit-input').value.trim();
    if (newText) {
      paragraphs[paraId].annotations[annId].text = newText;
      paragraphs[paraId].annotations[annId].timestamp = new Date().toISOString();
      saveData();
      updateDisplay();
    }
  });

  annotationDiv.querySelector('.annotation-edit-cancel').addEventListener('click', () => {
    updateDisplay();
  });
}

// Speech recognition
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'nl-NL';

  let silenceTimer;

  recognition.onsoundend = () => {
    if (isDictationActive) {
      silenceTimer = setTimeout(() => {
        if (annotationInput.value.trim()) {
          saveAnnotationButton.click();
          speakText("Annotatie automatisch opgeslagen");
        }
        stopDictation();
      }, 3000);
    }
  };

  recognition.onsoundstart = () => {
    clearTimeout(silenceTimer);
  };

  recognition.onstart = () => {
    isDictationActive = true;
    updateSpeechInputUI();
    dictationStatus.textContent = 'Aan het luisteren...';
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
      dictationStatus.textContent = 'Geen spraak gedetecteerd';
    } else if (event.error === 'audio-capture') {
      dictationStatus.textContent = 'Geen microfoon gevonden';
    } else if (event.error === 'not-allowed') {
      dictationStatus.textContent = 'Microfoontoegang geweigerd';
    }

    if (event.error !== 'aborted') {
      stopDictation();
    }
  };

  recognition.onend = () => {
    if (!ignoreOnEnd) {
      dictationStatus.textContent = '';
      if (isDictationActive) {
        recognition.start();
      }
    }
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalDetected = false;

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        finalDetected = true;
      } else {
        interimTranscript += transcript;
      }
    }

    annotationInput.value = finalTranscript + interimTranscript;

    // Auto-submit bij final detection
    if (finalDetected) {
      setTimeout(() => {
        if (annotationInput.value.trim()) {
          saveAnnotationButton.click();
          speakText("Annotatie opgeslagen");
        }
      }, 1000);
    }

    annotationInput.scrollTop = annotationInput.scrollHeight;
  }

  return recognition;
}

// Dictation controls
function setupDictationControls() {
  toggleDictationButton.addEventListener('click', toggleDictation);
  annotationInput.addEventListener('input', handleInputForSpeech);
}

function toggleDictation() {
  if (isDictationActive) {
    stopDictation();
  } else {
    startDictation();
  }
}

function updateSpeechInputUI() {
  if (isDictationActive) {
    toggleDictationButton.classList.add('active');
    toggleDictationButton.textContent = 'Dictatie Uit';
    dictationStatus.textContent = 'Spraakherkenning actief';
  } else {
    toggleDictationButton.classList.remove('active');
    toggleDictationButton.textContent = 'Dictatie Aan';
    dictationStatus.textContent = 'Handmatige invoer (woorden worden uitgesproken)';
  }
}

function handleInputForSpeech() {
  if (!isDictationActive && speechInputEnabled) {
    const text = annotationInput.value;
    const currentLength = text.length;

    // Check if space was added at the end
    if (currentLength > lastInputLength && text.endsWith(' ')) {
      const words = text.trim().split(/\s+/);
      const currentWord = words[words.length - 1];

      if (currentWord && currentWord !== lastSpokenWord) {
        speakWord(currentWord);
        lastSpokenWord = currentWord;
      }
    }

    lastInputLength = currentLength;
  }
}

// Add Enter key handler to annotation input
annotationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    saveAnnotationButton.click();
  }
});

function speakWord(word) {
  if (word.length > 1 && !/[.,!?;:]$/.test(word)) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'nl-NL';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function startDictation() {
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) {
      alert('Spraakherkenning wordt niet ondersteund in deze browser');
      return;
    }
  }

  finalTranscript = '';
  ignoreOnEnd = false;
  recognition.start();
  isDictationActive = true;
  updateSpeechInputUI();
}

function stopDictation() {
  isDictationActive = false;
  // ignoreOnEnd = true;
  if (recognition) {
    recognition.onend = null; // Prevent restarting recognition on end
    recognition.stop();
  }
  updateSpeechInputUI();
}

// Paragraph reading
function setupReadingControls() {
  readParagraphButton.addEventListener('click', readParagraph);
  stopReadingButton.addEventListener('click', stopReading);

  if (speechRateInput) {
    speechRateInput.addEventListener('input', () => {
      speechRate = parseFloat(speechRateInput.value);
      speechRateValue.textContent = speechRate.toFixed(1);
      saveData();
    });
  }
}

function readParagraph() {
  stopReading();

  const paragraph = paragraphs[currentIndex].text;
  words = paragraph.match(/[^\s]+|\s+[^\s\w]*/g) || [];
  currentWordIndex = 0;

  const textElement = document.getElementById('manipulatieText');
  const originalHTML = textElement.innerHTML;
  let currentPosition = 0;

  function highlightAndSpeakWord() {
    if (currentWordIndex >= words.length) {
      textElement.innerHTML = originalHTML;
      return;
    }

    const word = words[currentWordIndex];
    const wordLength = word.length;
    const wordStart = paragraph.indexOf(word, currentPosition);

    if (wordStart === -1) {
      currentWordIndex++;
      highlightAndSpeakWord();
      return;
    }

    const wordEnd = wordStart + wordLength;
    currentPosition = wordEnd;

    const before = originalHTML.substring(0, wordStart);
    const highlighted = `<span class="word-highlight">${originalHTML.substring(wordStart, wordEnd)}</span>`;
    const after = originalHTML.substring(wordEnd);
    textElement.innerHTML = before + highlighted + after;

    currentSpeechUtterance = new SpeechSynthesisUtterance(word.trim());
    currentSpeechUtterance.lang = 'nl-NL';
    currentSpeechUtterance.rate = speechRate;

    currentSpeechUtterance.onend = () => {
      currentWordIndex++;
      const delay = word.endsWith('.') || word.endsWith('!') || word.endsWith('?') ? 500 : 150;
      wordHighlightTimeout = setTimeout(highlightAndSpeakWord, delay);
    };

    speechSynthesis.speak(currentSpeechUtterance);
  }

  highlightAndSpeakWord();
}

function stopReading() {
  if (currentSpeechUtterance) {
    speechSynthesis.cancel();
    currentSpeechUtterance = null;
  }

  if (wordHighlightTimeout) {
    clearTimeout(wordHighlightTimeout);
    wordHighlightTimeout = null;
  }

  const textElement = document.getElementById('manipulatieText');
  textElement.innerHTML = paragraphs[currentIndex].text;
}

// Export/import
function setupExportImport() {
  exportButton.addEventListener('click', exportData);
  importButton.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', handleFileImport);
}

function exportData() {
  const dataStr = JSON.stringify(paragraphs, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `annotaties_${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        importedData.forEach((para, index) => {
          if (paragraphs[index]) {
            paragraphs[index].annotations = para.annotations || [];
          }
        });
        saveData();
        updateDisplay();
        alert('Data succesvol geïmporteerd!');
      } else {
        alert('Ongeldig bestandsformaat.');
      }
    } catch (error) {
      alert('Fout bij het importeren: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Search functionality
function setupSearch() {
  searchButton.addEventListener('click', searchAnnotations);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchAnnotations();
    }
  });
}

// Replace the existing searchAnnotations function with this improved version:
function searchAnnotations() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  // Clear previous highlights
  const textElement = document.getElementById('manipulatieText');
  textElement.innerHTML = paragraphs[currentIndex].text;

  // Count occurrences in current paragraph
  const currentParaText = paragraphs[currentIndex].text.toLowerCase();
  const currentParaMatches = currentParaText.split(searchTerm).length - 1;

  // Highlight in current paragraph text
  if (currentParaMatches > 0) {
    const regex = new RegExp(searchTerm, 'gi');
    textElement.innerHTML =
      paragraphs[currentIndex].text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
  }

  // Highlight in annotations
  const annotations = document.querySelectorAll('.annotation p');
  annotations.forEach(ann => {
    const text = ann.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      const regex = new RegExp(searchTerm, 'gi');
      ann.innerHTML = ann.textContent.replace(regex, match => `<span class="search-highlight">${match}</span>`);
    }
  });

  // Search through all paragraphs
  const results = paragraphs.map(para => {
    const textMatches = (para.text.toLowerCase().split(searchTerm).length - 1);
    let annotationMatches = 0;

    para.annotations.forEach(ann => {
      annotationMatches += (ann.text.toLowerCase().split(searchTerm).length - 1);
    });

    const totalMatches = textMatches + annotationMatches;

    return {
      id: para.id,
      textMatches,
      annotationMatches,
      totalMatches,
      preview: para.text.substring(0, 100) + (para.text.length > 100 ? '...' : '')
    };
  }).filter(result => result.totalMatches > 0);

  if (results.length > 0) {
    let resultMessage = `Zoekresultaten voor "${searchTerm}":\n\n`;

    // Current paragraph results
    resultMessage += `HUIDIGE PARAGRAAF (${currentIndex + 1}):\n`;
    resultMessage += `- ${currentParaMatches} keer in tekst\n`;

    // Count in current paragraph's annotations
    const currentAnnMatches = paragraphs[currentIndex].annotations.reduce((count, ann) => {
      return count + (ann.text.toLowerCase().split(searchTerm).length - 1);
    }, 0);
    resultMessage += `- ${currentAnnMatches} keer in annotaties\n\n`;

    // Results in other paragraphs
    resultMessage += `ANDERE PARAGRAAFEN:\n`;
    results.forEach(result => {
      if (result.id !== currentIndex) {
        resultMessage += `\nPARAGRAAF ${result.id + 1}:\n`;
        resultMessage += `- ${result.textMatches} keer in tekst\n`;
        resultMessage += `- ${result.annotationMatches} keer in annotaties\n`;
        resultMessage += `Voorbeeld: "${result.preview}"\n`;
      }
    });

    alert(resultMessage);
  } else {
    alert(`Zoekterm "${searchTerm}" niet gevonden.`);
  }
}

// Voice commands
function setupVoiceCommands() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const commandRecognition = new SpeechRecognition();
    commandRecognition.lang = 'nl-NL';
    commandRecognition.interimResults = false;
    commandRecognition.maxAlternatives = 1;

    document.getElementById('startButton').addEventListener('click', () => {
      commandRecognition.start();
      document.getElementById('overlay').style.display = 'flex';
    });

    commandRecognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleCommands(command);
    };

    commandRecognition.onerror = (event) => {
      console.error('Command recognition error:', event.error);
    };
  }
}

function handleCommands(command) {
  const outputDiv = document.getElementById('commandOutput');

  if (command.includes("annotatie maken")) {
    // Stop any existing dictation first
    if (isDictationActive) {
      stopDictation();
    }

    // Focus op het annotatieveld en start dictatie
    annotationInput.focus();
    annotationInput.value = ''; // Leeg het veld
    finalTranscript = ''; // Reset transcript

    // Geef auditieve feedback
    speakText("Wat wil je annoteren?");

    // Start dictatie als deze nog niet actief is
    if (!isDictationActive) {
      setTimeout(() => {
        startDictation();
      }, 1500);
    }

    // Update status
    dictationStatus.textContent = "Spraakherkenning actief voor annotatie...";
    outputDiv.textContent = "Klaar voor spraakinvoer...";
  }
}

function speakText(text) {
  stopReading(); // Stop any current speech

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'nl-NL';
  speech.rate = speechRate;
  window.speechSynthesis.speak(speech);
}

// Setup all event listeners
function setupEventListeners() {
  setupNavigation();
  setupAnnotationHandlers();
  setupDictationControls();
  setupReadingControls();
  setupExportImport();
  setupSearch();
  setupVoiceCommands();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    stopDictation();
    stopReading();
  });
}

function setupSliders() {
  const speechRateSlider = document.getElementById('speechRate');
  const fontSizeSlider = document.getElementById('fontSize');

  speechRateSlider.addEventListener('input', (e) => {
    speechRate = parseFloat(e.target.value);
    document.getElementById('speechRateValue').textContent = speechRate.toFixed(1);
    localStorage.setItem('speechRate', speechRate);
  });

  fontSizeSlider.addEventListener('input', (e) => {
    fontSize = parseFloat(e.target.value);
    document.getElementById('fontSizeValue').textContent = fontSize.toFixed(1);
    document.getElementById('manipulatieText').style.fontSize = `${fontSize}rem`;
    localStorage.setItem('fontSize', fontSize);
  });
}

function loadSlidersFromStorage() {
  const savedRate = localStorage.getItem('speechRate');
  const savedSize = localStorage.getItem('fontSize');

  if (savedRate) {
    speechRate = parseFloat(savedRate);
    document.getElementById('speechRate').value = speechRate;
    document.getElementById('speechRateValue').textContent = speechRate.toFixed(1);
  }

  if (savedSize) {
    fontSize = parseFloat(savedSize);
    document.getElementById('fontSize').value = fontSize;
    document.getElementById('fontSizeValue').textContent = fontSize.toFixed(1);
    document.getElementById('manipulatieText').style.fontSize = `${fontSize}rem`;
  }
}

// Initialize the application
init();