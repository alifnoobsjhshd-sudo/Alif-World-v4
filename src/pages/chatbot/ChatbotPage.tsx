import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownLeft, ArrowLeft, ArrowUp, Compass, RotateCcw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import skyRealm from '../../assets/images/world_sky_realm_nosun_1790945018459.jpg';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const FIRST_MESSAGE =
  "Hello! I am Alif's virtual assistant. I am here to help you learn more about Alif's background, expertise, and professional journey. Additionally, I can answer any questions you have regarding web development. How may I assist you today?";

const STARTING_MESSAGES: Message[] = [{ role: 'assistant', content: FIRST_MESSAGE }];

const SUGGESTIONS = [
  'What kind of work does Alif enjoy?',
  'Tell me about his web development skills',
  'How do I make a site feel more interactive?',
];

export default function ChatbotPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>(STARTING_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isLoading, error, reduceMotion]);

  useEffect(
    () => () => {
      requestRef.current?.abort();
    },
    [],
  );

  const sendMessages = async (history: Message[]) => {
    setIsLoading(true);
    setError('');
    const controller = new AbortController();
    requestRef.current = controller;

    // Insert an empty assistant response slot that fills in live
    setMessages((current) => [...current, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        // The opening assistant greeting is presentation-only, not a model turn.
        body: JSON.stringify({
          messages: history.slice(1).slice(-20),
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const serverMessage = (errorData && typeof errorData.error === 'string')
          ? errorData.error
          : response.status === 429
            ? 'A little too much curiosity at once. Please try again shortly.'
            : 'The signal got a little cloudy. Please try again.';
        throw new Error(serverMessage);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedReply = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedReply += parsed.text;
                setMessages((current) => {
                  const updated = [...current];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {
                      ...last,
                      content: accumulatedReply,
                    };
                  }
                  return updated;
                });
              }
            } catch (jsonErr) {
              // Ignore non-json lines
            }
          }
        }

        if (!accumulatedReply.trim()) {
          throw new Error('The reply did not come through. Please try again.');
        }
      } else {
        const result: any = await response.json().catch(() => null);
        if (!result?.reply) {
          throw new Error('The reply did not come through. Please try again.');
        }
        setMessages((current) => {
          const updated = [...current];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = { role: 'assistant', content: result.reply };
          }
          return updated;
        });
      }
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      // Remove empty assistant placeholder if failed before stream started
      setMessages((current) => {
        const last = current[current.length - 1];
        if (last && last.role === 'assistant' && !last.content) {
          return current.slice(0, -1);
        }
        return current;
      });
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong. Please try again.');
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const submitMessage = async (event?: FormEvent<HTMLFormElement>, preset?: string) => {
    event?.preventDefault();
    const content = (preset ?? draft).trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setDraft('');
    setError('');
    await sendMessages(nextMessages);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  const resetConversation = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setIsLoading(false);
    setError('');
    setMessages(STARTING_MESSAGES);
    setDraft('');
    setShowResetConfirm(false);
  };

  const retryLastRequest = () => {
    if (messages.at(-1)?.role === 'user' && !isLoading) void sendMessages(messages);
  };

  return (
    <main className="alif-chat" aria-label="Chat with Alif's virtual assistant">
      <style>{`
        .alif-chat {
          --chat-ink: #17223b;
          --chat-muted: #63708a;
          --chat-paper: #f8f7f0;
          --chat-sky: #dceeff;
          --chat-coral: #f2a184;
          position: relative;
          isolation: isolate;
          width: 100%;
          height: 100%;
          min-height: 100dvh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 2.5vw, 34px);
          color: var(--chat-ink);
          background: #202c50;
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        }
        .alif-chat *,
        .alif-chat *::before,
        .alif-chat *::after { box-sizing: border-box; }
        .alif-chat__backdrop {
          position: absolute;
          z-index: -2;
          inset: -3%;
          background-image: linear-gradient(90deg, rgba(19, 28, 54, .68), rgba(29, 39, 74, .28) 55%, rgba(20, 29, 54, .54)), url("${skyRealm}");
          background-position: center;
          background-size: cover;
          transform: scale(1.02);
        }
        .alif-chat__stars {
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          opacity: .34;
          background-image: radial-gradient(1px 1px at 11% 21%, #fff 45%, transparent 70%), radial-gradient(1.5px 1.5px at 79% 16%, #fff 45%, transparent 70%), radial-gradient(1px 1px at 68% 77%, #fff 45%, transparent 70%), radial-gradient(1px 1px at 31% 81%, #fff 45%, transparent 70%);
          background-size: 270px 240px, 330px 280px, 390px 320px, 440px 360px;
        }
        .alif-chat__frame {
          position: relative;
          display: grid;
          grid-template-columns: minmax(230px, .73fr) minmax(0, 1.6fr);
          width: min(1200px, 100%);
          height: min(800px, 100%);
          min-height: 520px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.46);
          border-radius: 30px;
          background: rgba(249, 249, 244, .96);
          box-shadow: 0 30px 100px rgba(9, 15, 38, .32), 0 1px 0 rgba(255,255,255,.7) inset;
        }
        .alif-chat__side {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          overflow: hidden;
          padding: clamp(22px, 3vw, 38px);
          color: #f7f8fc;
          background: linear-gradient(155deg, rgba(28, 44, 83, .96), rgba(40, 55, 98, .94) 59%, rgba(31, 47, 82, .98));
        }
        .alif-chat__side::before {
          content: "";
          position: absolute;
          width: 330px;
          height: 330px;
          right: -182px;
          top: 34%;
          border: 1px solid rgba(208, 226, 255, .24);
          border-radius: 50%;
          box-shadow: 0 0 0 26px rgba(208,226,255,.035), 0 0 0 58px rgba(208,226,255,.025);
          pointer-events: none;
        }
        .alif-chat__side::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          top: 48%;
          right: 38px;
          border-radius: 50%;
          background: #f3bd82;
          box-shadow: 0 0 22px 4px rgba(243,189,130,.38);
        }
        .alif-chat__brand {
          position: relative;
          z-index: 1;
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 10px;
          color: inherit;
          text-decoration: none;
        }
        .alif-chat__brand-mark {
          display: grid;
          width: 35px;
          height: 35px;
          place-items: center;
          border: 1px solid rgba(224,235,255,.58);
          border-radius: 12px;
          color: #f3c796;
        }
        .alif-chat__brand-name { font-size: 14px; font-weight: 700; letter-spacing: -.04em; }
        .alif-chat__brand-name span { color: #f3c796; }
        .alif-chat__eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 16px;
          color: #afc5eb;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .alif-chat__eyebrow::before { content: ""; width: 20px; height: 1px; background: #f3bd82; }
        .alif-chat__story {
          position: relative;
          z-index: 1;
          margin-top: auto;
          margin-bottom: auto;
          padding: 52px 0 20px;
        }
        .alif-chat__story h1 {
          max-width: 330px;
          margin: 0;
          font-size: clamp(36px, 4.3vw, 58px);
          font-weight: 500;
          line-height: .99;
          letter-spacing: -.075em;
        }
        .alif-chat__story h1 em {
          color: #efba83;
          font-family: "Gochi Hand", cursive;
          font-size: 1.12em;
          font-style: normal;
          font-weight: 400;
          letter-spacing: -.03em;
        }
        .alif-chat__story-copy {
          max-width: 250px;
          margin: 20px 0 0;
          color: #c4cfe5;
          font-size: 13px;
          line-height: 1.75;
        }
        .alif-chat__orbit-note {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 11px;
          max-width: 258px;
          color: #b7c6df;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 10px;
          line-height: 1.6;
          letter-spacing: .025em;
        }
        .alif-chat__orbit-note svg { flex: 0 0 auto; color: #f3bd82; }
        .alif-chat__main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          background: rgba(250, 250, 246, .96);
        }
        .alif-chat__header {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 82px;
          padding: 17px clamp(18px, 3vw, 34px);
          border-bottom: 1px solid #e7e8e1;
          background: rgba(255,255,252,.54);
        }
        .alif-chat__heading { display: flex; align-items: center; gap: 13px; min-width: 0; }
        .alif-chat__avatar {
          position: relative;
          display: grid;
          flex: 0 0 auto;
          width: 43px;
          height: 43px;
          place-items: center;
          overflow: hidden;
          border: 1px solid #d6d9d0;
          border-radius: 15px;
          color: #334768;
          background: linear-gradient(140deg, #e7f3f4, #e9e5f6);
        }
        .alif-chat__avatar::after {
          content: "";
          position: absolute;
          right: -5px;
          bottom: -7px;
          width: 25px;
          height: 25px;
          border: 1px solid rgba(59,77,110,.3);
          border-radius: 50%;
        }
        .alif-chat__heading h2 { margin: 0; font-size: 15px; font-weight: 700; letter-spacing: -.03em; }
        .alif-chat__presence { display: flex; align-items: center; gap: 7px; margin: 4px 0 0; color: #68738a; font-size: 11px; }
        .alif-chat__presence-dot { width: 6px; height: 6px; border-radius: 50%; background: #87a88d; box-shadow: 0 0 0 3px #e3eee2; }
        .alif-chat__header-actions { display: flex; align-items: center; gap: 8px; }
        .alif-chat__icon-button {
          display: inline-flex;
          min-width: 38px;
          min-height: 38px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 11px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #58657d;
          background: transparent;
          font: inherit;
          font-size: 11px;
          cursor: pointer;
          transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .alif-chat__icon-button:hover { border-color: #e4e5dd; color: #243451; background: #f1f1ea; }
        .alif-chat__icon-button:active { transform: translateY(1px); }
        .alif-chat__icon-button:focus-visible, .alif-chat__suggestion:focus-visible, .alif-chat__send:focus-visible, .alif-chat__textarea:focus-visible, .alif-chat__back:focus-visible, .alif-chat__confirm-button:focus-visible {
          outline: 3px solid rgba(80, 123, 174, .42);
          outline-offset: 3px;
        }
        .alif-chat__feed {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 22px;
          min-height: 0;
          overflow-y: auto;
          padding: 30px clamp(18px, 3vw, 34px) 24px;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
        .alif-chat__date-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 0 3px;
          color: #9ca3ac;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: .13em;
          text-transform: uppercase;
        }
        .alif-chat__date-mark::before, .alif-chat__date-mark::after { content: ""; width: 25px; height: 1px; background: #e2e4df; }
        .alif-chat__message-row { display: flex; align-items: flex-end; gap: 10px; }
        .alif-chat__message-row--user { justify-content: flex-end; }
        .alif-chat__message-mark {
          display: grid;
          flex: 0 0 auto;
          width: 27px;
          height: 27px;
          place-items: center;
          margin-bottom: 3px;
          border: 1px solid #dfe2db;
          border-radius: 10px;
          color: #60718d;
          background: #f3f4ee;
        }
        .alif-chat__bubble {
          max-width: min(580px, 83%);
          padding: 15px 17px;
          border: 1px solid #e5e7df;
          border-radius: 17px 17px 17px 5px;
          color: #354158;
          background: #fffefa;
          box-shadow: 0 3px 12px rgba(33,43,66,.035);
          font-size: 13px;
          line-height: 1.72;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          user-select: text;
        }
        .alif-chat__message-row--user .alif-chat__bubble {
          border-color: #344766;
          border-radius: 17px 17px 5px 17px;
          color: #f8f8f4;
          background: #344766;
        }
        .alif-chat__suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: -7px 0 0 37px;
        }
        .alif-chat__suggestion {
          max-width: 100%;
          padding: 9px 12px;
          border: 1px solid #dfe3dd;
          border-radius: 999px;
          color: #53627b;
          background: rgba(255,255,251,.78);
          font: inherit;
          font-size: 11px;
          text-align: left;
          cursor: pointer;
          transition: border-color .2s ease, color .2s ease, background .2s ease, transform .2s ease;
        }
        .alif-chat__suggestion:hover { transform: translateY(-1px); border-color: #aebdca; color: #263c5d; background: #f3f7f6; }
        .alif-chat__typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-height: 16px;
          color: #738097;
        }
        .alif-chat__typing span { width: 5px; height: 5px; border-radius: 50%; background: #738097; animation: alif-chat-pulse 1.15s ease-in-out infinite; }
        .alif-chat__typing span:nth-child(2) { animation-delay: .15s; }
        .alif-chat__typing span:nth-child(3) { animation-delay: .3s; }
        @keyframes alif-chat-pulse { 0%, 60%, 100% { transform: translateY(0); opacity: .44; } 30% { transform: translateY(-4px); opacity: 1; } }
        .alif-chat__error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: -7px 0 0 37px;
          padding: 10px 12px;
          border: 1px solid #e8c8ba;
          border-radius: 12px;
          color: #824e3d;
          background: #fff5ef;
          font-size: 11px;
          line-height: 1.5;
        }
        .alif-chat__retry { flex: 0 0 auto; padding: 5px 8px; border: 0; border-radius: 7px; color: #70402f; background: #f3ded4; font: inherit; font-weight: 600; cursor: pointer; }
        .alif-chat__retry:hover { background: #ecd0c3; }
        .alif-chat__end { height: 1px; flex: 0 0 auto; }
        .alif-chat__composer-wrap {
          flex: 0 0 auto;
          padding: 0 clamp(18px, 3vw, 34px) 20px;
        }
        .alif-chat__composer {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 10px 10px 10px 17px;
          border: 1px solid #dfe2db;
          border-radius: 18px;
          background: #fffefa;
          box-shadow: 0 5px 20px rgba(34,46,71,.045);
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .alif-chat__composer:focus-within { border-color: #a8b9c4; box-shadow: 0 0 0 3px rgba(141,168,181,.13), 0 5px 20px rgba(34,46,71,.045); }
        .alif-chat__textarea {
          flex: 1 1 auto;
          min-width: 0;
          max-height: 110px;
          resize: none;
          border: 0;
          outline: 0;
          color: #293650;
          background: transparent;
          font: inherit;
          font-size: 13px;
          line-height: 1.6;
          user-select: text;
        }
        .alif-chat__textarea::placeholder { color: #a1a7ad; }
        .alif-chat__send {
          display: grid;
          flex: 0 0 auto;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 0;
          border-radius: 13px;
          color: #fffdf7;
          background: #344766;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease, opacity .2s ease;
        }
        .alif-chat__send:hover:not(:disabled) { transform: translateY(-1px); background: #455c80; }
        .alif-chat__send:disabled { opacity: .42; cursor: not-allowed; }
        .alif-chat__footnote {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 9px 2px 0;
          color: #959ca5;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: .015em;
        }
        .alif-chat__footnote strong { color: #727e8f; font-weight: 500; }
        .alif-chat__reset-overlay {
          position: absolute;
          z-index: 3;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(21, 31, 54, .35);
          backdrop-filter: blur(5px);
        }
        .alif-chat__confirm {
          width: min(350px, 100%);
          padding: 24px;
          border: 1px solid #e3e5dc;
          border-radius: 20px;
          background: #fffefa;
          box-shadow: 0 18px 60px rgba(16,24,42,.2);
        }
        .alif-chat__confirm h3 { margin: 0; color: #25344f; font-size: 18px; letter-spacing: -.04em; }
        .alif-chat__confirm p { margin: 8px 0 19px; color: #657087; font-size: 12px; line-height: 1.65; }
        .alif-chat__confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .alif-chat__confirm-button { padding: 9px 12px; border: 1px solid #dfe2dc; border-radius: 10px; color: #4f5d74; background: #fffefa; font: inherit; font-size: 12px; cursor: pointer; }
        .alif-chat__confirm-button--primary { border-color: #344766; color: #fff; background: #344766; }
        .alif-chat__confirm-button:hover { filter: brightness(.97); }
        .alif-chat :focus-visible { outline-offset: 3px; }
        @media (max-width: 760px) {
          .alif-chat { align-items: stretch; padding: 0; }
          .alif-chat__backdrop { background-position: 54% center; }
          .alif-chat__frame {
            width: 100%;
            height: 100%;
            min-height: 0;
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto minmax(0, 1fr);
            border: 0;
            border-radius: 0;
          }
          .alif-chat__side { min-height: 178px; padding: max(66px, calc(env(safe-area-inset-top) + 58px)) 20px 17px; }
          .alif-chat__side::before { width: 185px; height: 185px; right: -93px; top: -58px; box-shadow: 0 0 0 17px rgba(208,226,255,.035), 0 0 0 39px rgba(208,226,255,.025); }
          .alif-chat__side::after { top: 43px; right: 55px; width: 7px; height: 7px; }
          .alif-chat__brand-mark { width: 31px; height: 31px; border-radius: 10px; }
          .alif-chat__story { margin: 0; padding: 12px 0 0; }
          .alif-chat__eyebrow { margin: 0 0 5px; font-size: 8px; }
          .alif-chat__story h1 { max-width: none; font-size: clamp(25px, 7vw, 34px); line-height: 1.05; }
          .alif-chat__story-copy, .alif-chat__orbit-note { display: none; }
          .alif-chat__main { min-height: 0; }
          .alif-chat__header { min-height: 67px; padding: 11px 15px; }
          .alif-chat__avatar { width: 38px; height: 38px; border-radius: 13px; }
          .alif-chat__icon-button { min-width: 36px; min-height: 36px; padding: 0 8px; }
          .alif-chat__icon-button span { display: none; }
          .alif-chat__feed { gap: 18px; padding: 22px 15px 18px; }
          .alif-chat__bubble { max-width: 88%; padding: 12px 14px; font-size: 12px; }
          .alif-chat__suggestions { margin-left: 0; gap: 7px; }
          .alif-chat__suggestion { font-size: 10px; padding: 8px 10px; }
          .alif-chat__error { margin-left: 0; }
          .alif-chat__composer-wrap { padding: 0 13px max(12px, env(safe-area-inset-bottom)); }
          .alif-chat__composer { padding: 8px 8px 8px 13px; border-radius: 16px; }
          .alif-chat__send { width: 40px; height: 40px; }
          .alif-chat__footnote { font-size: 8px; }
        }
        @media (max-width: 380px) {
          .alif-chat__story h1 { font-size: 25px; }
          .alif-chat__feed { padding-inline: 12px; }
          .alif-chat__composer-wrap { padding-inline: 10px; }
          .alif-chat__footnote span:last-child { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .alif-chat *, .alif-chat *::before, .alif-chat *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="alif-chat__backdrop" aria-hidden="true" />
      <div className="alif-chat__stars" aria-hidden="true" />

      <motion.section
        className="alif-chat__frame"
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : .65, ease: [0.2, 0.75, 0.25, 1] }}
        aria-label="Alif-World conversation"
      >
        <aside className="alif-chat__side">
          <button className="alif-chat__brand alif-chat__back" onClick={() => navigate('/')} aria-label="Back to Alif-World home">
            <span className="alif-chat__brand-mark"><Compass size={19} strokeWidth={1.6} /></span>
            <span className="alif-chat__brand-name">ALIF<span>·</span>WORLD</span>
          </button>
          <div className="alif-chat__story">
            <p className="alif-chat__eyebrow">A curious corner of the world</p>
            <h1>Questions are<br />good <em>launchpads.</em></h1>
            <p className="alif-chat__story-copy">
              A thoughtful guide to Alif’s work, ideas, and the little details that make the web feel alive.
            </p>
          </div>
          <div className="alif-chat__orbit-note">
            <Sparkles size={16} strokeWidth={1.5} />
            <span>Curiosity welcome.<br />Good questions travel far.</span>
          </div>
        </aside>

        <div className="alif-chat__main">
          <header className="alif-chat__header">
            <div className="alif-chat__heading">
              <div className="alif-chat__avatar" aria-hidden="true"><Sparkles size={19} strokeWidth={1.5} /></div>
              <div>
                <h2>Alif’s virtual assistant</h2>
                <p className="alif-chat__presence"><span className="alif-chat__presence-dot" /> Here to explore with you</p>
              </div>
            </div>
            <div className="alif-chat__header-actions">
              <button className="alif-chat__icon-button" onClick={() => navigate('/')} aria-label="Return to Alif-World">
                <ArrowLeft size={15} /><span>World</span>
              </button>
              <button className="alif-chat__icon-button" onClick={() => setShowResetConfirm(true)} aria-label="Start a new conversation">
                <RotateCcw size={14} /><span>New chat</span>
              </button>
            </div>
          </header>

          <div className="alif-chat__feed" ref={feedRef} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation">
            <p className="alif-chat__date-mark">Your conversation starts here</p>
            {messages.map((message, index) => {
              if (message.role === 'assistant' && !message.content) return null;
              return (
                <motion.div
                  key={`${index}-${message.role}`}
                  className={`alif-chat__message-row ${message.role === 'user' ? 'alif-chat__message-row--user' : ''}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 9 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : .28, ease: 'easeOut' }}
                >
                  {message.role === 'assistant' && <div className="alif-chat__message-mark" aria-hidden="true"><Sparkles size={13} strokeWidth={1.7} /></div>}
                  <div className="alif-chat__bubble">{message.content}</div>
                </motion.div>
              );
            })}

            {messages.length === 1 && !isLoading && (
              <div className="alif-chat__suggestions" aria-label="Suggested questions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="alif-chat__suggestion"
                    onClick={() => void submitMessage(undefined, suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (!messages[messages.length - 1]?.content || messages[messages.length - 1]?.role !== 'assistant') && (
              <div className="alif-chat__message-row" aria-label="Assistant is thinking">
                <div className="alif-chat__message-mark" aria-hidden="true"><Sparkles size={13} strokeWidth={1.7} /></div>
                <div className="alif-chat__bubble">
                  <span className="alif-chat__typing" role="status" aria-label="Thinking">
                    <span /><span /><span />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="alif-chat__error" role="alert">
                <span>{error}</span>
                <button className="alif-chat__retry" onClick={retryLastRequest}>Try again</button>
              </div>
            )}
            <div className="alif-chat__end" ref={endRef} />
          </div>

          <div className="alif-chat__composer-wrap">
            <form className="alif-chat__composer" onSubmit={(event) => void submitMessage(event)}>
              <textarea
                className="alif-chat__textarea"
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 4_000))}
                onKeyDown={handleComposerKeyDown}
                placeholder="Ask about Alif, his work, or the web..."
                rows={1}
                maxLength={4_000}
                aria-label="Your message"
                disabled={isLoading}
              />
              <button className="alif-chat__send" type="submit" disabled={!draft.trim() || isLoading} aria-label="Send message">
                <ArrowUp size={19} strokeWidth={2} />
              </button>
            </form>
            <div className="alif-chat__footnote">
              <span><strong>Enter</strong> to send · <strong>Shift + Enter</strong> for a new line</span>
              <span>Replies are generated for this visit only</span>
            </div>
          </div>
        </div>

        {showResetConfirm && (
          <motion.div
            className="alif-chat__reset-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : .16 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowResetConfirm(false);
            }}
          >
            <motion.div
              className="alif-chat__confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="alif-chat-confirm-title"
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : .2 }}
            >
              <h3 id="alif-chat-confirm-title">Begin a fresh orbit?</h3>
              <p>This conversation will be cleared from this page. Nothing is saved between visits.</p>
              <div className="alif-chat__confirm-actions">
                <button className="alif-chat__confirm-button" onClick={() => setShowResetConfirm(false)}>Keep chatting</button>
                <button className="alif-chat__confirm-button alif-chat__confirm-button--primary" onClick={resetConversation}>
                  <ArrowDownLeft size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Start fresh
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </main>
  );
}
