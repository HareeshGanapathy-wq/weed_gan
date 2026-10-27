/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { askVoiceAssistant } from '../services/api.ts';
import { VoiceAssistantResponse } from '../types/index.ts';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: VoiceAssistantResponse['action'];
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavigateTab: (tab: string, payload?: any) => void;
  onActionTriggered?: (action: VoiceAssistantResponse['action']) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigateTab,
  onActionTriggered,
}) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello, I am AgriVoice, your precision agronomic copilot. Ask me about weed remedies, field density, training datasets, or say "prune detection history".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize SpeechRecognition safely
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setTranscriptPreview('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscriptPreview(currentTranscript);

        if (event.results[0] && event.results[0].isFinal) {
          handleUserSend(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. You can type queries or enable microphone access.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Please try speaking again or type your question below.');
        } else if (event.error !== 'aborted') {
          setSpeechError(`Speech status: ${event.error}. You can also type below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition initialization error:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcriptPreview, isListening]);

  // Handle SpeechSynthesis (Speaking aloud)
  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) {
      setSpeechError('Your browser environment does not support direct SpeechRecognition. Please type your query.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      stopSpeaking();
      setSpeechError(null);
      setTranscriptPreview('');
      try {
        recognitionRef.current?.start();
      } catch (err: any) {
        console.warn('Recognition start error:', err);
        // If already started, restart
        try {
          recognitionRef.current?.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        } catch (e) {
          setSpeechError('Could not access microphone. Please type below.');
        }
      }
    }
  };

  const handleUserSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Stop listening while processing
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    }
    setTranscriptPreview('');
    setInputText('');
    setSpeechError(null);

    const userMsg: VoiceMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askVoiceAssistant(trimmed, currentTab);

      const assistantMsg: VoiceMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(response.reply);

      // Execute UI actions triggered by voice command
      if (response.action) {
        if (response.action.type === 'NAVIGATE' && response.action.target) {
          onNavigateTab(response.action.target);
        } else if (response.action.type === 'FILTER_REMEDY' && response.action.target) {
          onNavigateTab('remedies', { species: response.action.target });
        }
        if (onActionTriggered) {
          onActionTriggered(response.action);
        }
      }
    } catch (err: any) {
      const errMsg: VoiceMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I could not process that request right now. Please check server connectivity or try asking about Pigweed remedies or history pruning.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg tracking-tight">AgriVoice Copilot</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Precision AI
                </span>
              </div>
              <p className="text-xs text-stone-300">Voice-powered weed detection, remedies & field control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setVoiceMuted(!voiceMuted);
              }}
              title={voiceMuted ? 'Unmute speech output' : 'Mute speech output'}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {voiceMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                if (isListening) recognitionRef.current?.stop();
                onClose();
              }}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status banner */}
        {isSpeaking && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              AgriVoice is speaking...
            </span>
            <button
              onClick={stopSpeaking}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors"
            >
              Stop Audio
            </button>
          </div>
        )}

        {speechError && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.action && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Action: {msg.action.type.replace('_', ' ')}
                    </span>
                    {msg.action.target && (
                      <button
                        onClick={() => {
                          if (msg.action?.type === 'NAVIGATE' && msg.action.target) {
                            onNavigateTab(msg.action.target);
                            onClose();
                          } else if (msg.action?.type === 'FILTER_REMEDY' && msg.action.target) {
                            onNavigateTab('remedies', { species: msg.action.target });
                            onClose();
                          }
                        }}
                        className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2"
                      >
                        Open {msg.action.target} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-300 text-stone-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Live transcript or loading indicator */}
          {isListening && (
            <div className="flex gap-3 items-center p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-sm animate-pulse">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-xs text-emerald-700 uppercase tracking-wider mb-0.5">
                  Listening to your voice...
                </div>
                <div className="italic text-stone-700">
                  {transcriptPreview || 'Speak now (e.g., "What is the remedy for Pigweed?" or "Prune detection history")...'}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex gap-3 items-center text-sm text-stone-500">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span>AgriVoice is analyzing agronomic records...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2.5 bg-stone-100/90 border-t border-stone-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Try asking:
          </span>
          {[
            'What is the remedy for Pigweed?',
            'Prune detection history to 3 items',
            'Show me Crabgrass chemical dosage',
            'Open weed training images database',
            'What is Field Alpha density?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleUserSend(prompt)}
              className="px-2.5 py-1 text-xs rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition-colors whitespace-nowrap shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Controls: Microphone + Text Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-xl transition-all flex items-center justify-center shadow-sm ${
                isListening
                  ? 'bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
              title={isListening ? 'Stop listening' : 'Start microphone speech input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSend(inputText);
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening... (or type your question)'
                    : 'Ask about remedies, detection history, training...'
                }
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-sm bg-stone-50/50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="px-4 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span>
              {speechSupported ? 'Microphone enabled: Click mic to speak' : 'Text mode active (Speech API unavailable)'}
            </span>
            <span>Say "Prune history" to trim old detection scans</span>
          </div>
        </div>
      </div>
    </div>
  );
};
