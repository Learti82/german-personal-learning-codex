import type { Conversation, GermanLevel, GrammarTopic, Lesson, Phrase, VocabularyItem } from '../types'
import { expandedExercises, extraConversations, extraGrammar, extraPhrases, extraVocabulary, readingTexts, writingPrompts } from './expandedContent'

export { readingTexts, writingPrompts }

export const levelMeta: Record<GermanLevel, { label: string; color: string; description: string }> = {
  A1: { label: 'Fillimi', color: '#e96d4f', description: 'Bazat e komunikimit të përditshëm' },
  A2: { label: 'Themelor', color: '#e6a93d', description: 'Biseda të zakonshme dhe punë' },
  B1: { label: 'I pavarur', color: '#4f8f7d', description: 'Komunikim i sigurt profesional' },
  B2: { label: 'I avancuar', color: '#365c8d', description: 'Gjermanishte e nuancuar dhe profesionale' },
}

const modules: Record<GermanLevel, string[]> = {
  A1: ['Alphabet & Aussprache','Begrüßungen','Sich vorstellen','Zahlen','Länder & Sprachen','Familie','Tage & Monate','Uhrzeit','Tagesablauf','Essen & Trinken','Einkaufen','Wohnen','Stadt & Wege','Verkehr','Arbeit'],
  A2: ['Erfahrungen','Perfekt','Arbeit & Termine','Gesundheit','Reisen','Wohnen','Beziehungen','Bildung','Technik','Behörden','Dativ & Akkusativ','Nebensätze'],
  B1: ['Meinungen äußern','Arbeitswelt','Komplexe Sätze','Passiv','Konjunktiv II','Formell schreiben','Umwelt','Gesellschaft','Karriere','Medien','Präsentieren','Diskutieren'],
  B2: ['Argumentation','Professionelles Deutsch','Nominalisierung','Indirekte Rede','Nuancen','Kollokationen','Verhandlungen','Interviews','Beschwerden','Präsentationen','Problemlösung','Debatten'],
}

const lessonCopy: Record<GermanLevel, { de: string; sq: string }> = {
  A1: { de: 'Du lernst kurze, klare Sätze und übst sie laut.', sq: 'Mëson fjali të shkurtra e të qarta dhe i ushtron me zë.' },
  A2: { de: 'Du verbindest Sätze und sprichst über Erfahrungen.', sq: 'Lidh fjali dhe flet për përvoja.' },
  B1: { de: 'Du erklärst Meinungen und löst Alltagssituationen.', sq: 'Shpjegon mendime dhe zgjidh situata të përditshme.' },
  B2: { de: 'Du argumentierst präzise und professionell.', sq: 'Argumenton me saktësi dhe në mënyrë profesionale.' },
}

export const lessons: Lesson[] = (Object.keys(modules) as GermanLevel[]).flatMap(level => modules[level].map((title, i) => ({
  id: `${level.toLowerCase()}-${i+1}`, level, module: i+1, title, subtitle: lessonCopy[level].sq, duration: 8 + (i%3)*2,
  skill: (['Wortschatz','Grammatik','Sprechen','Hören'] as const)[i%4], content: [lessonCopy[level].de, lessonCopy[level].sq],
  examples: [{ de: level === 'A1' ? 'Ich lerne heute Deutsch.' : level === 'A2' ? 'Ich habe gestern Deutsch gelernt.' : level === 'B1' ? 'Ich lerne Deutsch, weil ich in einem Callcenter arbeiten möchte.' : 'Je sicherer ich spreche, desto professioneller kann ich reagieren.', sq: level === 'A1' ? 'Sot mësoj gjermanisht.' : level === 'A2' ? 'Dje kam mësuar gjermanisht.' : level === 'B1' ? 'Mësoj gjermanisht sepse dua të punoj në një call center.' : 'Sa më sigurt flas, aq më profesionalisht mund të reagoj.' }],
  goals:[`Theks kryesor: ${title}`,`Formo të paktën 3 fjali të tua`,`Përdore temën në një situatë reale`],
  usefulPhrases: level==='A1'?[{de:'Können Sie das bitte wiederholen?',sq:'A mund ta përsërisni ju lutem?'},{de:'Was bedeutet das?',sq:'Çfarë do të thotë kjo?'}]:level==='A2'?[{de:'Könnten Sie bitte langsamer sprechen?',sq:'A mund të flisni më ngadalë?'},{de:'Ich versuche, ein Beispiel zu geben.',sq:'Po përpiqem të jap një shembull.'}]:level==='B1'?[{de:'Wenn ich Sie richtig verstanden habe, …',sq:'Nëse ju kam kuptuar drejt, …'},{de:'Meiner Meinung nach …',sq:'Sipas mendimit tim …'}]:[{de:'Nach sorgfältiger Abwägung …',sq:'Pas një vlerësimi të kujdesshëm …'},{de:'Damit ist gemeint, dass …',sq:'Me këtë nënkuptohet se …'}],
  coachTip:'Lexoje shembullin, dëgjoje, mbulo përkthimin dhe thuaje sërish pa parë.'
})))

const vocabSeed: Array<[string,string,string,string?,string?]> = [
  ['Begrüßung','Përshëndetje','Hallo'],['Begrüßung','Mirëmëngjes','Guten Morgen'],['Begrüßung','Mirupafshim','Auf Wiedersehen'],
  ['Arbeit','punë','Arbeit','die','Arbeiten'],['Arbeit','koleg','Kollege','der','Kollegen'],['Arbeit','orar','Arbeitszeit','die','Arbeitszeiten'],
  ['Callcenter','faturë','Rechnung','die','Rechnungen'],['Callcenter','numër klienti','Kundennummer','die','Kundennummern'],['Callcenter','problem','Problem','das','Probleme'],
  ['Callcenter','zgjidhje','Lösung','die','Lösungen'],['Callcenter','durim','Geduld','die'],['Callcenter','ankesë','Beschwerde','die','Beschwerden'],
  ['Alltag','shtëpi','Wohnung','die','Wohnungen'],['Alltag','familje','Familie','die','Familien'],['Alltag','kohë','Zeit','die','Zeiten'],
  ['Reise','tren','Zug','der','Züge'],['Reise','aeroport','Flughafen','der','Flughäfen'],['Reise','biletë','Fahrkarte','die','Fahrkarten'],
  ['Gesundheit','mjek','Arzt','der','Ärzte'],['Gesundheit','farmaci','Apotheke','die','Apotheken'],['Gesundheit','dhimbje','Schmerz','der','Schmerzen'],
  ['Technik','internet','Internet','das'],['Technik','lidhje','Verbindung','die','Verbindungen'],['Technik','pajisje','Gerät','das','Geräte'],
  ['Kommunikation','pyetje','Frage','die','Fragen'],['Kommunikation','përgjigje','Antwort','die','Antworten'],['Kommunikation','informacion','Information','die','Informationen'],
  ['Service','ndihmë','Hilfe','die'],['Service','zbritje','Rabatt','der','Rabatte'],['Service','kthim','Rückgabe','die','Rückgaben'],
]
const levelWords: Record<GermanLevel,string[]> = {
 A1:['lernen|mësoj','sprechen|flas','arbeiten|punoj','wohnen|banoj','kommen|vij','machen|bëj','fragen|pyes','antworten|përgjigjem','kaufen|blej','brauchen|kam nevojë'],
 A2:['erklären|shpjegoj','vereinbaren|dakordoj','überprüfen|kontrolloj','verbinden|lidh','entschuldigen|kërkoj falje','helfen|ndihmoj','warten|pres','lösen|zgjidh','bestätigen|konfirmoj','zurückrufen|telefonoj përsëri'],
 B1:['bearbeiten|përpunoj','weiterleiten|përcjell','nachvollziehen|kuptoj','vorschlagen|propozoj','vermeiden|shmang','gewährleisten|garantoj','berücksichtigen|marr parasysh','zustimmen|pajtohem','widersprechen|kundërshtoj','begründen|arsyetoj'],
 B2:['abwägen|peshoj opsionet','beeinträchtigen|ndikoj negativisht','veranlassen|urdhëroj','entgegenkommen|bëj koncesion','hervorheben|theksoj','voraussetzen|parakushtoj','einräumen|pranoj','präzisieren|saktësoj','vermitteln|ndërmjetësoj','erörtern|shqyrtoj']
}
const baseVocabulary: VocabularyItem[] = (Object.keys(levelWords) as GermanLevel[]).flatMap((level, li) => [
  ...vocabSeed.map((v,i) => ({ id:`${level}-n-${i}`, topic:v[0], translation:v[1], word:v[2], article:v[3] as VocabularyItem['article'], plural:v[4], level, example:`${v[3] ? v[3]+' ' : ''}${v[2]} ist heute wichtig.`, difficulty: Math.min(3,li+1) as 1|2|3, frequency:100-i })),
  ...levelWords[level].map((entry,i) => { const [word,translation]=entry.split('|'); return { id:`${level}-v-${i}`,topic:'Verben',word,translation,level,example:`Ich ${word} das gern für Sie.`,difficulty:Math.min(3,li+1) as 1|2|3,frequency:90-i }})
])
export const vocabulary: VocabularyItem[] = [...baseVocabulary, ...extraVocabulary]

const baseGrammarTopics: GrammarTopic[] = [
 { id:'verb-position',level:'A1',title:'Das Verb auf Position 2',de:'Im Hauptsatz steht das konjugierte Verb an zweiter Stelle.',sq:'Në fjalinë kryesore, folja e zgjedhuar qëndron në vendin e dytë.',rule:'Subjekt + Verb + Ergänzung',examples:[{de:'Ich lerne heute Deutsch.',sq:'Sot mësoj gjermanisht.'},{de:'Heute lerne ich Deutsch.',sq:'Sot mësoj gjermanisht.'}],mistake:'Ich heute Deutsch lerne. → Ich lerne heute Deutsch.'},
 { id:'articles',level:'A1',title:'der, die, das',de:'Jedes Nomen hat ein grammatisches Geschlecht.',sq:'Çdo emër ka një gjini gramatikore.',rule:'Maskulin: der · Feminin: die · Neutrum: das',examples:[{de:'der Kunde, die Rechnung, das Problem',sq:'klienti, fatura, problemi'}],mistake:'Ihre Problem → Ihr Problem'},
 { id:'akkusativ',level:'A1',title:'Akkusativ',de:'Der Akkusativ markiert oft das direkte Objekt.',sq:'Akkusativi shpesh shënon kundrinorin e drejtë.',rule:'der → den; ein → einen',examples:[{de:'Ich frage den Kunden.',sq:'E pyes klientin.'}],mistake:'Ich frage der Kunde. → Ich frage den Kunden.'},
 { id:'perfekt',level:'A2',title:'Perfekt',de:'Im Gespräch berichten wir mit haben/sein + Partizip II.',sq:'Në të folur përdorim haben/sein + pjesorja II për të kaluarën.',rule:'haben/sein + Partizip II am Satzende',examples:[{de:'Ich habe die Rechnung geprüft.',sq:'E kam kontrolluar faturën.'}],mistake:'Ich habe prüfen. → Ich habe geprüft.'},
 { id:'dative',level:'A2',title:'Dativ',de:'Der Dativ antwortet oft auf „wem?”.',sq:'Dativi shpesh i përgjigjet pyetjes “kujt?”.',rule:'der/das → dem; die → der',examples:[{de:'Ich helfe dem Kunden.',sq:'E ndihmoj klientin.'}],mistake:'Ich helfe den Kunde. → Ich helfe dem Kunden.'},
 { id:'subordinate',level:'B1',title:'Nebensätze mit weil',de:'Im Nebensatz steht das Verb am Ende.',sq:'Në fjalinë e varur, folja qëndron në fund.',rule:'…, weil + Subjekt + … + Verb',examples:[{de:'Ich rufe an, weil mein Internet nicht funktioniert.',sq:'Telefonoj sepse interneti nuk punon.'}],mistake:'weil ich brauche Hilfe → weil ich Hilfe brauche'},
 { id:'konjunktiv',level:'B1',title:'Höflich mit Konjunktiv II',de:'Würden, könnten und hätten machen Bitten höflicher.',sq:'Würden, könnten dhe hätten i bëjnë kërkesat më të sjellshme.',rule:'Könnten Sie bitte …?',examples:[{de:'Könnten Sie mir Ihre Kundennummer nennen?',sq:'A mund të ma thoni numrin tuaj të klientit?'}],mistake:'Geben Sie Nummer! → Könnten Sie mir bitte Ihre Nummer nennen?'},
 { id:'passive',level:'B2',title:'Passiv im Kundenservice',de:'Das Passiv fokussiert den Vorgang statt die Person.',sq:'Pësorja përqendrohet te veprimi, jo te personi.',rule:'werden + Partizip II',examples:[{de:'Die Anfrage wird sofort bearbeitet.',sq:'Kërkesa do të përpunohet menjëherë.'}],mistake:'Wir bearbeiten gerade. → Ihre Anfrage wird gerade bearbeitet.'},
 { id:'nominalization',level:'B2',title:'Nominalisierung',de:'Nominalisierungen wirken in formellen Texten präzise.',sq:'Emërzimet tingëllojnë më të sakta në tekstet formale.',rule:'prüfen → die Prüfung',examples:[{de:'Nach Prüfung Ihrer Unterlagen melden wir uns.',sq:'Pas kontrollit të dokumenteve tuaja, do t’ju kontaktojmë.'}],mistake:'Nachdem wir prüfen… → Nach der Prüfung…'}
]
export const grammarTopics: GrammarTopic[] = [...baseGrammarTopics.map(topic=>({
 ...topic,
 when: topic.when ?? (topic.level==='A1'?'Për të ndërtuar fjali të sakta në situata të përditshme.':topic.level==='A2'?'Për të treguar përvoja dhe për të lidhur më shumë informacion.':topic.level==='B1'?'Për të komunikuar qartë dhe me mirësjellje në punë.':'Për komunikim të saktë, formal dhe të nuancuar.'),
 formula: topic.formula ?? topic.rule,
 tips: topic.tips ?? ['Lexoje rregullin dhe thuaj shembullin me zë.','Ndrysho vetëm një pjesë të shembullit për të krijuar fjalinë tënde.'],
})), ...extraGrammar]

export const exercises = expandedExercises

const baseConversations: Conversation[] = [
 {id:'intro',title:'Sich vorstellen',level:'A1',category:'Alltag',opening:'Hallo! Ich heiße Mia. Wie heißt du?',goal:'Stelle dich in zwei Sätzen vor.',intents:[{id:'introduce',keywords:['ich heiße','mein name','ich bin'],response:'Freut mich! Woher kommst du?',hint:'Sag: „Ich heiße … und komme aus …”'},{id:'origin',keywords:['komme aus','aus kosovo','wohne in'],response:'Sehr schön! Was machst du beruflich?',hint:'Sag, woher du kommst oder wo du wohnst.'}]},
 {id:'restaurant',title:'Im Restaurant',level:'A1',category:'Alltag',opening:'Guten Abend! Was möchten Sie bestellen?',goal:'Bestelle höflich Essen und ein Getränk.',intents:[{id:'order',keywords:['ich möchte','ich hätte gern','bitte'],response:'Sehr gern. Möchten Sie auch etwas trinken?',hint:'Nutze „Ich hätte gern …, bitte.”'},{id:'drink',keywords:['wasser','kaffee','tee','trinken'],response:'Kommt sofort. Guten Appetit!',hint:'Bestelle ein Getränk.'}]},
 {id:'appointment',title:'Termin vereinbaren',level:'A2',category:'Arbeit',opening:'Guten Tag. Wann passt Ihnen ein Termin?',goal:'Vereinbare und bestätige einen Termin.',intents:[{id:'schedule',keywords:['am montag','am dienstag','um','termin'],response:'Passt Ihnen 14 Uhr?',hint:'Nenne einen Tag und eine Uhrzeit.'},{id:'confirm',keywords:['das passt','einverstanden','bestätige','ja gern'],response:'Perfekt. Dann sehen wir uns am vereinbarten Termin.',hint:'Bestätige den Termin höflich.'}]},
 {id:'billing',title:'Problem mit der Rechnung',level:'B1',category:'Callcenter',mood:'Besorgt',opening:'Guten Tag. Ich habe ein Problem mit meiner Rechnung. Der Betrag ist viel zu hoch.',goal:'Begrüße, identifiziere und beruhige den Kunden.',intents:[{id:'empathy',keywords:['verstehe ihren ärger','tut mir leid','entschuldige','unannehmlichkeiten'],response:'Danke. Ich möchte einfach verstehen, warum die Rechnung so hoch ist.',hint:'Zeige Verständnis: „Ich verstehe Ihren Ärger.”'},{id:'customer_number',keywords:['kundennummer','nummer nennen','wie lautet'],response:'Ja, meine Kundennummer lautet 847291.',hint:'Bitte höflich um die Kundennummer.'},{id:'check',keywords:['überprüfe','prüfe','schaue nach','moment bitte'],response:'Natürlich, ich warte. Vielen Dank.',hint:'Kündige an, dass du die Rechnung prüfst.'}]},
 {id:'internet-angry',title:'Internet ausgefallen',level:'B1',category:'Callcenter',mood:'Verärgert',opening:'Guten Tag! Mein Internet funktioniert schon seit gestern nicht! Das ist wirklich ärgerlich.',goal:'Deeskaliere und beginne die Fehleranalyse.',intents:[{id:'empathy',keywords:['verstehe','ärger','tut mir leid','entschuldige'],response:'Gut, aber ich brauche heute eine Lösung.',hint:'Entschuldige dich und zeige Verständnis.'},{id:'clarify',keywords:['seit wann','router','leuchtet','neu gestartet'],response:'Die rote Lampe am Router blinkt. Neu gestartet habe ich ihn schon.',hint:'Stelle eine konkrete Diagnosefrage.'},{id:'solution',keywords:['techniker','störung','weiterleiten','ticket'],response:'In Ordnung. Wann kann der Techniker kommen?',hint:'Biete den nächsten konkreten Schritt an.'}]},
 {id:'refund',title:'Rückgabe & Erstattung',level:'B2',category:'Callcenter',mood:'Enttäuscht',opening:'Das gelieferte Gerät ist defekt. Ich erwarte eine sofortige Erstattung.',goal:'Kläre Anspruch und erkläre den Prozess präzise.',intents:[{id:'acknowledge',keywords:['bedauere','nachvollziehen','verständnis'],response:'Danke. Wie läuft die Rückgabe jetzt genau ab?',hint:'Erkenne das Problem professionell an.'},{id:'process',keywords:['rücksendeetikett','erstattung','zurücksenden','bearbeitet'],response:'Wie lange dauert es, bis das Geld wieder auf meinem Konto ist?',hint:'Erkläre den Rückgabeprozess.'},{id:'timeline',keywords:['werktage','tage','sobald','eingang'],response:'Gut, damit bin ich einverstanden. Vielen Dank.',hint:'Nenne einen realistischen Zeitrahmen.'}]}
]
export const conversations: Conversation[] = [...baseConversations, ...extraConversations]

const basePhrases: Phrase[] = [
 ['Begrüßung','Guten Tag. Wie kann ich Ihnen helfen?','Mirëdita. Si mund t’ju ndihmoj?'],['Callcenter','Könnten Sie mir bitte Ihre Kundennummer nennen?','A mund të ma thoni numrin tuaj të klientit?'],['Callcenter','Einen Moment bitte. Ich überprüfe das kurz für Sie.','Një moment ju lutem. Po e kontrolloj shkurt për ju.'],['Callcenter','Vielen Dank für Ihre Geduld.','Ju faleminderit për durimin tuaj.'],['Beschwerde','Ich verstehe Ihren Ärger.','E kuptoj zemërimin tuaj.'],['Beschwerde','Ich entschuldige mich für die Unannehmlichkeiten.','Kërkoj falje për shqetësimet.'],['Arbeit','Ich leite Sie an die zuständige Abteilung weiter.','Po ju transferoj te departamenti përgjegjës.'],['Arbeit','Darf ich die Angaben kurz zusammenfassen?','A mund t’i përmbledh shkurt të dhënat?'],['Abschluss','Kann ich sonst noch etwas für Sie tun?','A mund të bëj diçka tjetër për ju?'],['Abschluss','Vielen Dank für Ihren Anruf. Auf Wiederhören!','Faleminderit për telefonatën. Mirupafshim!']
].map((p,i)=>({id:`p${i}`,category:p[0],de:p[1],sq:p[2],level:(i<2?'A1':i<5?'A2':i<8?'B1':'B2') as GermanLevel}))
export const phrases: Phrase[] = [...basePhrases, ...extraPhrases]
