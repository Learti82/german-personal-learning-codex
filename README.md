# DeutschCoach

DeutschCoach është një PWA mobile-first për të mësuar gjermanishten nga A1 në B2, me fokus te të folurit, gjermanishtja profesionale dhe puna në call center. Aplikacioni punon pa backend, pa llogari dhe pa API me pagesë.

## Çfarë përfshin

- kurs i strukturuar A1–B2 me mësime, gramatikë dygjuhëshe dhe ushtrime;
- `Mein Deutsch-Coach`: biseda me degëzim, intent matching dhe feedback transparent;
- simulime call-center për faturim, internet, ankesa dhe kthime;
- Web Speech API për njohjen e gjermanishtes dhe `speechSynthesis` për zërin `de-DE`;
- fjalor me artikull, shumës, shembull, audio, My Words dhe spaced repetition;
- listening, phrasebook, provime praktike, gabimet personale dhe analitika;
- ruajtje lokale me Zustand persistence, eksport/import JSON dhe dark mode;
- PWA e instalueshme me service worker dhe cache offline.

## Zhvillimi lokal

Kërkohet Node.js 20+.

```bash
npm install
npm run dev
```

Hap adresën që shfaq Vite (zakonisht `http://localhost:5173`).

```bash
npm test
npm run build
npm run preview
```

## Vercel

Importo repository-n në Vercel. Framework preset mund të lihet `Vite`; build command është `npm run build` dhe output directory `dist`. `vercel.json` përfshin fallback-un e React Router. Nuk nevojiten environment variables.

## Instalimi në Android

Hap versionin HTTPS në Chrome, përdor menunë **Install app / Add to Home screen**, pastaj hape nga ikona DeutschCoach. Për njohjen e zërit lejo mikrofonin kur kërkohet.

## Arkitektura

```text
src/
  components/        layout dhe komponentë të ripërdorshëm
  data/              mësime, fjalor, gramatikë, ushtrime, skenarë
  engine/            coach lokal, korrigjim, scoring, SRS, speech
  pages/             rrjedhat e përdoruesit
  store/             profil, progres, gabime dhe backup
  types/             kontratat TypeScript
```

UI përdor vetëm `coachService.engine`, i cili implementon `GermanCoachEngine`. Një provider i ardhshëm mund të implementojë të njëjtën kontratë pa ndryshuar ekranet. Versioni aktual përmban vetëm `LocalCoachEngine`; nuk ka OpenAI/Gemini API dhe nuk pretendon analizë NLP shkencore.

### Shto përmbajtje

- Mësim: shto një objekt `Lesson` te `src/data/content.ts` ose ndaje në skedarë sipas nivelit.
- Fjalë: shto një `VocabularyItem`, gjithmonë me artikull dhe shumës për emrat.
- Skenar: shto një `Conversation` me `opening`, `goal` dhe intents me fraza alternative.
- Rregull: shto një rregull të kufizuar, të testueshëm te `src/engine/grammar.ts`.

## Kufizime të sinqerta

- SpeechRecognition nuk mbështetet njësoj në çdo shfletues dhe mund të kërkojë internet sipas motorit të shfletuesit. Chrome në Android jep përvojën më të mirë.
- Vlerësimi i shqiptimit është vetëm një **Übungsscore** nga transkriptimi/fraza e pritur, jo matje fonetike profesionale.
- Zëri gjerman varet nga zërat e instaluar në pajisje.
- LocalCoachEngine punon me rregulla dhe skenarë; nuk është një model i përgjithshëm AI.

## Privatësia dhe kostoja

Nuk ka analytics, reklama, autentikim, backend, cookies marketingu apo sekrete frontend. Progresi ruhet në pajisje dhe funksionimi bazë kushton €0/muaj në hosting statik falas.
