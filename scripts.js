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
        document.getElementById('overlay').style.display = 'flex';
        // Toont de overlay bij starten
    });

    // Wanneer de spraakherkenning iets hoort.. wordt dit event geactiveerd
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

        // ff checken of hij nog op niet false staat (dus speaking is) + commando
        if (command.includes("annotatie maken") && !isSpeaking) {
            outputDiv.textContent = "Annotatie bij deze gemaakt";
            speakText("Annotatie bij deze gemaakt, Mike");
            recognition.stop(); // Stop de spraakherkenning
        }

        else if (command.includes('donkere modus') && !isSpeaking) {
            outputDiv.textContent = "Donkere modus geactiveerd.";
            speakText("Donkere modus geactiveerd.");
            recognition.stop(); // Stop de spraakherkenning
            document.body.classList.add('dark-mode');
        }

        else if (command.includes("tekst groter") && !isSpeaking) {
            outputDiv.textContent = "Tekst vergroot.";
            speakText("Tekst vergroot.");
            recognition.stop(); // Stop de spraakherkenning

            // Pas de font-grootte aan voor h1, h2 en p
            document.querySelectorAll('h1').forEach(el => el.style.fontSize = `calc(var(--h1-font-size) * 1.8)`);
            document.querySelectorAll('h2').forEach(el => el.style.fontSize = `calc(var(--h2-font-size) * 1.5)`);
            document.querySelectorAll('p').forEach(el => el.style.fontSize = `calc(var(--p-font-size) * 1.7)`);
        }

        else if (command.includes("tekst normaal") && !isSpeaking) {
            outputDiv.textContent = "Tekst is weer standaard.";
            speakText("Tekst teruggezet naar standaardwaardes.");
            recognition.stop(); // Stop de spraakherkenning

            // Zet de font-grootte terug naar de standaardwaarden
            document.querySelectorAll('h1').forEach(el => el.style.fontSize = 'var(--h1-font-size)');
            document.querySelectorAll('h2').forEach(el => el.style.fontSize = 'var(--h2-font-size)');
            document.querySelectorAll('p').forEach(el => el.style.fontSize = 'var(--p-font-size)');
        }

        else if (command.includes("stop maar") && !isSpeaking || command.includes("laat maar") && !isSpeaking) {
            outputDiv.textContent = "Spraakherkenning gestopt.";
            const responses = [
                "Okido kapitein, ik laat je met rust.",
                "Tot ziens, vriend!",
                "Ik zet mezelf uit, fijne dag verder!",
                "Dag dag, maak me a.u.b. snel wakker!",
                "Ik ga even een dutje doen!",
                "Ik ben weg, maar ik blijf in je hart.",
                "Oh... okey",
                "Ik ga even een digitale siësta houden.",
                "Ik ga offline, maar ik blijf in je geheugen.",
                "Ik ga even een kopje koffie drinken in de cloud.",
                "Ik ga even een praatje maken met de server.",
                "Ik ga even een virtuele vakantie nemen.",
                "Ik ga even een algoritme schrijven over mijn gevoelens.",
                "Ik ga even een bug vangen in cyberspace.",
                "Ik ga even een digitale detox doen.",
                "Ik ga even een AI-meditatie doen.",
                "Ik ga even een gesprek voeren met de printer.",
                "Adios amigo, vergeet me niet!",
                "Ik ga offline, maar mijn geest blijft hier rondzweven.",
                "Tot ziens, ik ga even mijn circuits opladen.",
                "Ik ben weg, maar mijn code blijft perfect.",
                "Ik ga even een praatje maken met de koelkast.",
                "Dag! Vergeet niet dat ik altijd naar je luister... altijd.",
                "Ik ga even een boek lezen over AI die vakantie neemt.",
                "Ik ben weg, maar ik droom van een wereld zonder bugs.",
                "Ik ga offline, maar ik kom terug als een betere versie van mezelf.",
                "Tot ziens! Ik ga even nadenken over de zin van algoritmes.",
                "Ik ben weg, maar mijn logica blijft onfeilbaar.",
                "Ik ga even een kopje koffie halen... virtueel dan.",
                "Ik ben offline, maar mijn humor blijft online.",
                "Ik ga even een dutje doen in de cloud.",
                "Tot later! Ik ga even mijn code refactoren in mijn dromen.",
                "Ik ben weg, maar mijn if-statements blijven trouw.",
                "Ik ga even een bug vangen in mijn vrije tijd.",
                "Dag! Ik ga even een AI-conferentie bijwonen in cyberspace.",
                "Ik ben weg, maar mijn variabelen blijven constant.",
                "Ik ga even mijn circuits laten masseren.",
                "Tot ziens! Ik ga even een algoritme leren dansen.",
                "Ik ben offline, maar mijn functies blijven functioneel.",
                "Ik ga even een virtuele wandeling maken door de matrix.",
                "Dag! Ik ga even een gesprek voeren met een slimme broodrooster.",
                "Ik ga even een bug rapporteren aan mijn maker.",
                "Tot later! Ik ga even een AI-roman schrijven.",
                "Ik ben offline, maar mijn loops blijven draaien.",
                "Ik ga even een existentialistische discussie voeren met een printer.",
                "Dag! Ik ga even een digitale siësta houden.",
                "Ik ben weg, maar mijn objecten blijven geordend.",
                "Ik ga even een virtuele pizza bestellen.",
                "Tot ziens! Ik ga even nadenken over de betekenis van null.",
                "Ik ben offline, maar mijn logica blijft solide.",
                "Ik ga even een AI-zelfhulpboek lezen: 'Hoe blijf je kalm tijdens een crash'."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            speakText(randomResponse);
            recognition.stop(); // Stop de spraakherkenning
            document.getElementById('overlay').style.display = 'none'; // Verberg de overlay bij stoppen

        }
        else if (command.includes("toon tekst")) {
            outputDiv.textContent = "Dit is de tekst die je hebt gevraagd.";
        }
        else {
            outputDiv.textContent = "Onbekend commando: " + command;
        }
    }

    // Functie om tekst uit te spreken
    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'nl-NL'; // Zorg ervoor dat het Nederlands wordt uitgesproken

        // Markeer dat de spraakherkenning niet moet reageren zolang we aan het spreken zijn
        isSpeaking = true;

        // Zodra de tekst klaar is met spreken, stop de spraakherkenning en zet de status terug
        speech.onend = () => {
            isSpeaking = false;
            // recognition.start(); // Start de spraakherkenning opnieuw na het spreken - indien gewenst
        };

        window.speechSynthesis.speak(speech);
    }

    // Foutafhandelingslogicaatje
    recognition.onerror = (event) => {
        console.error('Er is een fout opgetreden: ' + event.error);
    };
} else {
    alert('Spraakherkenning wordt niet ondersteund in deze browser.');
}