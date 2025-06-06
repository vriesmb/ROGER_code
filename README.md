# Inclusive Annotation Tool – README

## De Opdracht

Voor dit project heb ik een annotatietool ontworpen die het maken en terugvinden van aantekeningen in digitale (studie)boeken toegankelijk maakt voor mensen met een visuele beperking, in het speciaal maculadegeneratie. De tool is in dit geval speciaal ontwikkeld op basis van de behoeften van **Roger**, een ervaren bouwkunde expert die rond een jaar of 40 maculadegeneratie heeft opgelopen. Momenteel is hij een filosofiestudent die (volledig) afhankelijk is van een screen reader.

Roger wil tijdens het lezen van studieboeken zinnen of fragmenten kunnen markeren en van een aantekening voorzien, en deze later makkelijk kunnen terugvinden. Mijn tool ondersteunt dit op een inclusieve manier.

---

## ❗ Probleemomschrijving

Roger leest zijn studieboeken digitaal en maakt aantekeningen met behulp van een screen reader. Echter, de meeste bestaande tools zijn niet goed afgestemd op zijn wensen of beperking:

- De meeste websites zijn slecht toegankelijk (geen goede structuur voor screen readers)
- Typen gaat lastig, blind typen is niet mogelijk
- Tekst kopiëren of overnemen met spraakcommando’s werkt beperkt
- Annotaties zijn moeilijk terug te vinden of te onderscheiden van de originele tekst
- Het studeren gaat hem momenteel moeizaam af door de prikkels en de enorme (visuele) inspanning die hij nu moet doen

Roger wil graag:
- In een handomdraai duidelijke, (visueel) herkenbare annotaties
- Een manier om aantekeningen op te slaan tijdens het luisteren naar de tekst
- Annotaties die makkelijk terug te vinden en te sorteren zijn
- Een zo laagdrempelig mogelijke werkwijze / gebruiksvriendelijke ervaring



---

## Oplossing

Mijn oplossing is een digitale annotatie-interface die gebruik maakt van screen reader-ondersteuning, kleurcontrasten volgens WCAG-richtlijnen, toetsenbordnavigatie en spraakfunctionaliteit. Annotaties worden gemaakt met behulp van tekstinvoer en ingesproken feedback bij elke handeling. In de ontwikkeling van de tool is o.a. dus rekening gehouden met:

- Grote, contrastrijke tekst en elementen
- Annotatie herkenning, kleuren en scheiden van te lezen tekst
- Directe feedback via screen reader (wat is geselecteerd, wat is opgeslagen)
- Spraakgestuurd handelingen uitvoeren, om (visuele) uitputting uit te stellen
- Keybind(s) plaatsing, deze zijn geplaatst die hij kan voelen en niet visueel hoeft te zoeken

---


## Testen

Gedurende de ontwerpweek heb ik vier testsessies gehouden met Roger. Roger heeft maculadegeneratie en leest uitsluitend met screenreaders. De tests waren essentieel om te begrijpen wat voor hem wél werkt, en waarom conventionele oplossingen vaak tekortschieten. In dit verslag combineer ik de ruwe notities met reflecties per testmoment.

---

### Test 1: Oriëntatie & behoefteverkenning

#### Notities
- Roger gebruikt NVDA, Supernova en soms Fox PDF Reader.
- Voorkeur voor **tekst overzetten**, niet audio.
- Kan niet blindtypen, maar typt wél, al gaat het traag.
- Screenreader werkt vaak slecht op interactieve websites.
- Voorkeur voor **donker beeld, gele tekst op zwart**.
- Hij wil **onderscheid** tussen zinnen uit het boek en eigen aantekeningen.
- Hij maakt nu foto’s van tekst om dingen te onthouden.
- Letterdikte aanpassen is prettig.
- Spraakberichten naar tekst werkt niet fijn.
- Hij leest via edu-teksten (Word met goede structuur).
- “Het schrikt me soms af als het voorgelezen wordt terwijl ik wil annoteren.”

#### 💭 Reflectie
Deze eerste sessie leverde direct veel input. Roger's workflow was onnodig complex en rommelig. Het werd duidelijk dat de oplossing:
- moet werken met screenreaders,
- spraakherkenning handig is als ik dat kan bieden,
- en duidelijke visuele + auditieve scheiding moet tonen tussen tekst en aantekening.

Dit is de basis geweest voor mijn eerste prototype: eenvoudige interface met zwart/gele kleurstelling, en mogelijkheid om zinnen te annoteren via toetsenbord of spraak.


## 📸 Screenshot van de Tool
![Screenshot van de Inclusieve Annotatietool](./v1.png)
*Figuur 1: Annotatietool met zwart/gele kleurstelling en speech recogn. die commando's kan uitvoeren zoals: kleur donkerder & tekst groter.*
---

### Test 2: Eerste prototype

#### Notities
- Babyblauw als extra highlightkleur is prettig naast geel.
- Liever niet annoteren per *zin*, maar per *onderdeel*.
- Enter gebruiken om notitie te verzenden is fijn.
- Tekst moet **groot** zijn, met evt. letterspacing.
- Annotaties mogen **max 2 zinnen** zijn. Daarna is het vermoeiend.
- Roger wil dat een notitie **duidelijk visueel los staat** van de tekst.
- Hij stelt evt. ‘Home’ en ‘End’ voor om snel te navigeren.
- Een **grote muiscursor** is fijn – kleine ziet hij niet.
- Hij ziet highlight in het midden goed, mits het niet flikkert.
- Hij maakt nu een foto om te herinneren – misschien afbeelding-annotaties toestaan?
- Het idee van **spraakcommando’s** vond hij leuk.
- **Humor** in de tool waardeert hij erg.
- “Ik wil weten *waar* ik ben, dus zeg wat ik tab.”

#### 💭 Reflectie
Deze test leverde veel kleine maar belangrijke verbeteringen op:
- Enter = submit werd toegevoegd.
- Highlight werd groter en kreeg border.
- Annotaties zijn visueel gescheiden van originele tekst (met border + andere kleur).
- ‘Kleine nonsense’ zoals grappige feedback toegevoegd. Als je tegen de speech api zegt 'laat maar' of stop. Dan zegt hij een gek zinnetje terug.

De interface is nu intuïtiever voor Roger. Ik ontdekte dat screenreadergebruikers andere navigatiegewoontes hebben – zoals liever minder scrollen/tabben, en sneller willen weten waar ze zijn.

## 📸 Screenshot van de Tool
![Screenshot van de Inclusieve Annotatietool](./v2.png)
*Figuur 2: UI gemaakt en controls toegevoegd | zoekfunctie | annotaties functie.*

---

### Test 3: Verbeterde versie

#### Notities
- “Super gebruiksvriendelijk.”
- Voorlezen waar je bent werkt goed.
- Bewerken van annotaties is een fijne toevoeging.
- Grotere highlight bij tab/focus maakt het veel overzichtelijker.
- Tabben door zinnen is logisch.
- Hoofdstuknavigatie met sneltoetsen (tab + H) zou top zijn.
- Verschil tussen titel en annotatietekst via kleur is goed gelukt.

#### 💭 Reflectie
De verbeteringen zijn duidelijk voelbaar voor Roger. Deze sessie bevestigde dat mijn ontwerpkeuzes juist waren. Vooral het verschil tussen focus states en zichtbaarheid van annotaties werd gewaardeerd. De tool werd nu gezien als écht bruikbaar in zijn studiepraktijk. Ik zag ook hoe belangrijk **visueel vertrouwen** is: Roger wil direct weten of iets van hem is of van het boek. Dat leidde tot meer nadruk op *identiteit van annotaties*.

## 📸 Screenshot van de Tool
![Screenshot van de Inclusieve Annotatietool](./v3.png)
![Screenshot van de Inclusieve Annotatietool](./v4.png)

*Figuur 3 & 4: Alert bij zoekfunctie toegevoegd | voorlees functie geintegreerd | zoekfunctie highlight nu ook tekst in annotatie  .*
---

### Test 4: Eindtest (nog gepland)

Deze sessie zal de volledige versie van de tool testen, met alle iteraties verwerkt. Ik zal hier o.a. letten op:
- Volledige flow van lezen tot opslaan
- Terugvinden en sorteren van notities
- Gecombineerde input: toetsenbord + spraak
- Feedback op voice feedback: is het niet te druk?

Deze test zal achteraf hier worden aangevuld.

### Eindtest: Resultaten
#### Notities
- Roger zei: “Kan er gewoon bijna helemaal blind doorheen, wat geweldig.”
- Werkt super prettig.
- De functie "lees voor op hover" is een super toevoeging.
- Roger kan zelf een annotatie maken.
- Hij kan ook zelf een annotatie laten afspelen.
- De nieuw toegevoegde mouseover speech-integratie maakt het vinden van controls eenvoudig.
- Tekst inspreken voor annotaties werkt goed.

#### 💭 Reflectie
De eindtest bevestigde dat de tool intuïtief en toegankelijk is voor Roger. De toevoeging van mouseover speech-integratie en de hover-functie voor voorlezen hebben een grote impact gehad op de gebruiksvriendelijkheid, hij vindt ze zelfs geweldig. 


### Aanbeveling
Als ik meer tijd had gehad, had ik graag de mogelijkheid toegevoegd om annotaties voor te laten lezen en een uitgebreide annotatiebibliotheek ontwikkeld waarin Roger al zijn notities makkelijk kan terugvinden. 

## 📸 Screenshot van de Tool
![Screenshot van de Inclusieve Annotatietool](./v5.png)

*Figuur 5: toegevoegd speech op elk interactief element + mouseover speech | command toegevoegd die taken uitvoeren | roger erg enthousiast  .*

---

## 🔄 Overkoepelende inzichten

Over alle sessies heen kwamen de volgende inzichten naar voren:
- Annoteren moet eenvoudig, snel en intuïtief kunnen zonder visuele afleiding.
- Screenreader feedback moet subtiel, niet overweldigend.
- Spraakherkenning is waardevol, mits goed getimed en eenvoudig te activeren.
- Persoonlijke feedback zoals “je aantekening is opgeslagen” helpt bij oriëntatie.
- De scheiding tussen boektekst en aantekening moet altijd duidelijk zijn (visueel én auditief).
- De gebruiker moet weten waar hij is (focus/posities), dus key-based navigatie is essentieel.
- Kleine speelse elementen (humor, kleurgebruik) maken een interface menselijker.


---

## Exclusive Design Principles

Gedurende het project heb ik de **Exclusive Design Principles** toegepast:

### 1. Study Situation ✅
- Ik heb actief geluisterd naar Roger en zijn workflows.
- Zijn situatie (maculadegeneratie) en bestaande hulpmiddelen (NVDA, Supernova, donkere modus) zijn leidend geweest in de ontwerpkeuzes.

### 2. Ignore Conventions ✅
- In plaats van conventionele annotatietools (die meestal visueel of met muis werken), koos ik voor toetsenbord- en spraakgestuurd gebruik.
- Annotaties worden per onderdeel opgeslagen en niet per zin, zoals vaak gebruikelijk is.

### 3. Prioritise Identity ✅
- Roger is filosofiestudent en vindt structuur, onderscheid en humor belangrijk.
- De tool is aangepast aan zijn identiteit: rustige interface, korte tekstfragmenten, en visuele elementen die “van hem” zijn (bijv. border rond zijn annotatie, kleuraanduiding).

### 4. Add Nonsense ✅
- Humor en plezier zijn leuk volgens Roger. Kleine verrassingen (zoals unieke stemmen, grappige animaties of kleurrijke accenten) kunnen de ervaring minder klinisch maken. Ik heb hier in latere versies helaas wat van uit moeten halen ivm errors. Maar in tussenversies had ik grapjes verwerkt zoals: "ik ga even sparren met mijn Ai-genoot", "Rondje lopen op het web" als je tegen de speach recog. zei van 'stop' of 'laat maar'.

---

##  Conclusie

De combinatie van iteratief testen, het toepassen van de Exclusive Design Principles en een sterke focus op toegankelijkheid heeft geleid tot een functionele en toegankelijke annotatietool. De tool is een reflectie van Rogers wensen en zijn situatie – met aandacht voor eenvoud, toegankelijkheid en identiteit.