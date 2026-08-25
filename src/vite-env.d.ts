/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface SpeechRecognitionEvent extends Event { results: SpeechRecognitionResultList }
interface SpeechRecognitionErrorEvent extends Event { error: string }
interface SpeechRecognition extends EventTarget { lang:string;continuous:boolean;interimResults:boolean;start():void;stop():void;onresult:((e:SpeechRecognitionEvent)=>void)|null;onerror:((e:SpeechRecognitionErrorEvent)=>void)|null;onend:(()=>void)|null }
interface SpeechRecognitionConstructor { new():SpeechRecognition }
interface Window { SpeechRecognition?:SpeechRecognitionConstructor;webkitSpeechRecognition?:SpeechRecognitionConstructor }
