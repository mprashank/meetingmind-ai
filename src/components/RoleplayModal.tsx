import React, { useState } from 'react';
import { Contact, Meeting, RoleplayMessage, RoleplayEvaluation } from '../models/entities';
import { MessageSquare, Send, Award } from 'lucide-react';

interface RoleplayModalProps {
  contact: Contact;
  meeting: Meeting;
  onClose: () => void;
  onSendMessage: (text: string, history: RoleplayMessage[]) => Promise<RoleplayMessage>;
  onEvaluate: (history: RoleplayMessage[]) => Promise<RoleplayEvaluation>;
}

export const RoleplayModal: React.FC<RoleplayModalProps> = ({
  contact,
  meeting,
  onClose,
  onSendMessage,
  onEvaluate
}) => {
  const [messages, setMessages] = useState<RoleplayMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: `Hello. Thanks for getting on the call. Before we dive into your demo, I want to address the elephant in the room: back in March you promised our team the SOC 2 Type II report by March 30, and it never arrived. Do you have that documentation today?`,
      timestamp: new Date().toISOString(),
      groundedInFact: 'Grounded in Meeting 2 & 3 missed SOC 2 deliverable.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<RoleplayEvaluation | null>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userText = inputText.trim();
    setInputText('');
    const userMsg: RoleplayMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsSending(true);

    try {
      const reply = await onSendMessage(userText, newHistory);
      setMessages([...newHistory, reply]);
    } catch (err) {
      console.error('Roleplay send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const evalResult = await onEvaluate(messages);
      setEvaluation(evalResult);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-card-enter">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#080b14]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30 shadow-sm">
              <MessageSquare className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Practice Meeting Simulation</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  Grounded Persona
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Roleplaying with <span className="text-white font-medium">{contact.name}</span> ({contact.role}, {contact.companyName})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!evaluation && messages.length >= 2 && (
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 shadow-md shadow-violet-900/25 border border-violet-400/20"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Evaluating...' : 'Finish & Evaluate'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 text-sm rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-1 px-1 flex items-center space-x-1">
                  <span>{isUser ? 'You (Sales Executive)' : contact.name}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-violet-900/25'
                      : 'bg-[#13192f] text-slate-100 rounded-bl-none border border-white/[0.08] shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.groundedInFact && (
                  <span className="text-[10px] text-cyan-400 mt-1 px-1 italic">
                    {msg.groundedInFact}
                  </span>
                )}
              </div>
            );
          })}
          {isSending && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{contact.name} is considering your response...</span>
            </div>
          )}

          {/* Post-Session Evaluation Card */}
          {evaluation && (
            <div className="mt-6 bg-[#080b14] border border-violet-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base">Practice Session Evaluation</h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {evaluation.overallSummary}
              </p>

              {/* 5-Category Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-[#13192f] p-2.5 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 text-[10px]">Clarity</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{evaluation.clarity.score}</div>
                </div>
                <div className="bg-[#13192f] p-2.5 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 text-[10px]">Relevance</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{evaluation.relevance.score}</div>
                </div>
                <div className="bg-[#13192f] p-2.5 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 text-[10px]">Objections</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{evaluation.objectionHandling.score}</div>
                </div>
                <div className="bg-[#13192f] p-2.5 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 text-[10px]">Completeness</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{evaluation.completeness.score}</div>
                </div>
                <div className="bg-[#13192f] p-2.5 rounded-xl border border-white/[0.06] col-span-2 sm:col-span-1">
                  <div className="text-slate-400 text-[10px]">Alignment</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{evaluation.alignmentWithObjective.score}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="bg-cyan-950/20 border border-cyan-500/25 p-3 rounded-xl text-cyan-200 space-y-1">
                  <div className="font-semibold text-cyan-300">Strengths:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-950/20 border border-amber-500/25 p-3 rounded-xl text-amber-200 space-y-1">
                  <div className="font-semibold text-amber-300">Areas to Polish:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {evaluation.areasForImprovement.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        {!evaluation && (
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#080b14]/90 border-t border-white/[0.08] flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your response to Sarah Lin..."
              disabled={isSending}
              className="flex-1 bg-[#0d1222] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-violet-900/25 border border-violet-400/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
