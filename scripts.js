// Controleer of de SpeechRecognition API beschikbaar is
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    // Maak een nieuwe SpeechRecognition instantie aan
    const recognition = new SpeechRecognition();

    // Zet de taal op Nederlands
    recognition.lang = 'nl-NL';

    // Stel in dat de spraakherkenning continu moet luisteren
    recognition.continuous = true;

    // Zorg ervoor dat interim results beschikbaar zijn (live updates)
    recognition.interimResults = true;

    // Flag om te controleren of de spraak al is uitgesproken
    let isSpeaking = false;

    // Start de spraakherkenning als de knop wordt ingedrukt
    document.getElementById('startButton').addEventListener('click', () => {
        recognition.start();
        document.getElementById('overlay').style.display = 'flex'; // Toon de overlay bij starten
    });

    // Wanneer de spraakherkenning iets hoort, wordt dit event geactiveerd
    recognition.onresult = (event) => {
        let transcript = '';

        // Loop door alle herkende resultaten (definitieve en interim)
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                transcript += result[0].transcript + ' ';
            } else {
                transcript += result[0].transcript + ' (in progress)... ';
            }
        }

        // Werk de live tekst in de overlay bij
        document.getElementById('liveTranscript').textContent = "Live Transcript: " + transcript;

        // Hier stel je je commando's in
        handleCommands(transcript); // Functie aanroepen om de commando's af te handelen
    };

    // Functie om commando's af te handelen
    function handleCommands(command) {
        const outputDiv = document.getElementById('commandOutput');

        if (command.includes("annotatie") && !isSpeaking) {
            outputDiv.textContent = "Annotatie bij deze gemaakt, Mike";
            speakText("Annotatie bij deze gemaakt, Mike");
        } else if (command.includes("stop")) {
            outputDiv.textContent = "Spraakherkenning gestopt.";
            recognition.stop(); // Stop de spraakherkenning
            document.getElementById('overlay').style.display = 'none'; // Verberg de overlay bij stoppen
        } else if (command.includes("toon tekst")) {
            outputDiv.textContent = "Dit is de tekst die je hebt gevraagd.";
        } else {
            outputDiv.textContent = "Onbekend commando: " + command;
        }
    }

    // Functie om tekst uit te spreken
    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'nl-NL'; // Zorg ervoor dat het Nederlands wordt uitgesproken

        // Markeer dat de spraakherkenning niet moet reageren zolang we aan het spreken zijn
        isSpeaking = true;

        // Zodra de tekst klaar is met spreken, stop de spraakherkenning en zet de vlag terug
        speech.onend = () => {
            isSpeaking = false;
            recognition.start(); // Start de spraakherkenning opnieuw na het spreken
        };

        window.speechSynthesis.speak(speech);
    }

    // Foutafhandelingslogica
    recognition.onerror = (event) => {
        console.error('Er is een fout opgetreden: ' + event.error);
    };
} else {
    alert('Spraakherkenning wordt niet ondersteund in deze browser.');
}