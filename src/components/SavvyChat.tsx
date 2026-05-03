import { useState, useRef, useEffect } from 'react';
import { Wallet, TrendingDown, Tag, ShieldCheck, Send, PiggyBank } from "lucide-react";

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const QUICK_ACTIONS = [
  'Spent this week',
  'Runway',
  'Food this month',
  'Can I spend 2k?',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'bot',
    text: "Hey! I’m Savvy. Log an expense like ‘Swiggy 280’ or tell me something like ‘Salary 72000’.",
  },
];

const SUMMARY = {
  balance: '$4,218.50',
  weekSpend: '$487.20',
  topCategory: 'Groceries',
  safeToSpend: '$1,340.00',
};

function BotMessage({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div className="flex items-end gap-2.5 min-w-0 max-w-full lg:max-w-[72%]">
      <div className="w-7 h-7 rounded-lg savvy-accent border border-emerald-500/30 flex items-center justify-center shrink-0 mb-1">
        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
      </div>

      <div className="min-w-0 max-w-[calc(100%-2.5rem)] savvy-surface savvy-border text-slate-200 rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed break-words">
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <span key={i} className="font-semibold savvy-text">
              {part.slice(2, -2)}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="savvy-accent rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-relaxed max-w-[85%] lg:max-w-[70%]">
        {text}
      </div>
    </div>
  );
}

function SummaryCard({
  profileMemory,
  spendMemory,
  mobile = false,
}: {
  profileMemory: any;
  spendMemory: any[];
  mobile?: boolean;
}) {
const totalSpend = spendMemory.reduce((sum, item) => sum + item.amount, 0);

const categoryTotals = spendMemory.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + item.amount;
  return acc;
}, {} as Record<string, number>);

const topCategory =
  Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

const currentBalance =
  (profileMemory.currentBalance || profileMemory.salary || 0) - totalSpend;

const safeToSpend =
  currentBalance - (profileMemory.rent || 0) - (profileMemory.savings || 0);

const items = [
  { label: 'Current balance', value: `₹${currentBalance}`, icon: Wallet, color: 'text-emerald-400' },
  { label: 'This week spend', value: `₹${totalSpend}`, icon: TrendingDown, color: 'text-amber-400' },
  { label: 'Top category', value: topCategory, icon: Tag, color: 'text-sky-400' },
  { label: 'Safe to spend', value: `₹${safeToSpend}`, icon: ShieldCheck, color: 'text-emerald-400' },
  { label: 'Savings', value: `₹${profileMemory.savings || 0}`, icon: PiggyBank, color: 'text-emerald-400' },

    ...Object.entries(categoryTotals).map(([category, amount]) => ({
    label: `${category} total`,
    value: `₹${amount}`,
    icon: Tag,
    color: 'savvy-muted',
  })),
];

  return (
    <div
  className={`flex flex-col ${
    mobile
      ? "w-full"
      : "hidden lg:flex w-72 shrink-0 border-l savvy-border savvy-surface-soft"
  }`}
>
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-sm font-semibold savvy-muted tracking-wide">Summary</h2>
      </div>
      <div className="flex-1 px-5 space-y-1">
        {items.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs savvy-muted leading-none mb-1">{label}</p>
              <p className="text-sm font-semibold savvy-text">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t savvy-border">
        <p className="text-[11px] savvy-muted text-center">Updated just now</p>
      </div>
    </div>
  );
}

export default function Savvy() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(INITIAL_MESSAGES.length + 1);

  const [profileMemory, setProfileMemory] = useState({
  salary: null as number | null,
  rent: null as number | null,
  currentBalance: null as number | null,
  savingsBuffer: null as number | null,
  savings: null as number | null,
});

const [spendMemory, setSpendMemory] = useState<any[]>([]);
const [showSnapshot, setShowSnapshot] = useState(false);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

useEffect(() => {
  const savedProfile = localStorage.getItem("savvy_profile");
  const savedSpends = localStorage.getItem("savvy_spends");
  const savedMessages = localStorage.getItem("savvy_messages");

  if (savedProfile) setProfileMemory(JSON.parse(savedProfile));
  if (savedSpends) setSpendMemory(JSON.parse(savedSpends));
  if (savedMessages) setMessages(JSON.parse(savedMessages));
}, []);

useEffect(() => {
  localStorage.setItem("savvy_profile", JSON.stringify(profileMemory));
}, [profileMemory]);

useEffect(() => {
  localStorage.setItem("savvy_spends", JSON.stringify(spendMemory));
}, [spendMemory]);

useEffect(() => {
  localStorage.setItem("savvy_messages", JSON.stringify(messages));
}, [messages]);

  function interpretMessage(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("salary")) {
    const amount = Number(text.match(/\d+/)?.[0]);
    return { type: "profile_update", field: "salary", value: amount };
  }

  if (lower.includes("rent")) {
    const amount = Number(text.match(/\d+/)?.[0]);
    return { type: "profile_update", field: "rent", value: amount };
  }
  if (lower.includes("savings")) {
  const amount = Number(text.match(/-?\d+/)?.[0]);
  return { type: "profile_update", field: "savings", value: amount };
}

  const txMatch = text.match(/([a-zA-Z]+)\s+(\d+)/);
  if (txMatch) {
    const merchant = txMatch[1];
    const amount = Number(txMatch[2]);

    let category = "Misc";
    if (["swiggy", "zomato","food"].includes(merchant.toLowerCase())) category = "Food";
    if (["uber", "ola", "rapido"].includes(merchant.toLowerCase())) category = "Transport";

    return {
      type: "transaction",
      merchant,
      amount,
      category,
    };
  }

  return { type: "question", text };
}

function getBotReply(text: string, spends = spendMemory) {
    
  const lower = text.toLowerCase();
  if (lower.includes("food")) {
  const total = spends
    .filter((item) => item.category === "Food")
    .reduce((sum, item) => sum + item.amount, 0);

  return `You’ve spent ₹${total} on Food.`;
}

 if (lower === "spent this week") {
  const total = spends.reduce((sum, item) => sum + item.amount, 0);
  return `You’ve spent ₹${total} this week.`;
}

  if (lower === "runway") {
    return "At your current pace, you have 18 safe spending days left this month.";
  }

  if (lower === "food this month") {
    return "You’ve spent ₹8,420 on food this month across 26 orders.";
  }

  if (lower === "can i spend 2k?" || lower === "can i spend 2k") {
    return "Yes — safe, but try to stay under ₹1.8k before rent hits.";
  }

  const match = text.match(/([a-zA-Z]+)\s+(\d+)/);

  if (match) {
    const merchant = match[1].toLowerCase();
    const amount = Number(match[2]);

    let category = "Misc";
    if (["swiggy", "zomato"].includes(merchant)) category = "Food";
    if (["uber", "ola", "rapido"].includes(merchant)) category = "Transport";
    if (merchant === "rent") category = "Rent";

    return `Logged ₹${amount} under ${category}.`;
  }

  return "Try logging something like ‘Swiggy 280’ or ask ‘Spent this week’.";
}

  function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId.current++, sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

setTimeout(() => {
  const parsed = interpretMessage(trimmed);
  let reply = getBotReply(trimmed, spendMemory);

  if (trimmed.toLowerCase().startsWith("reset ")) {
  const target = trimmed.toLowerCase().replace("reset ", "").trim();

  if (["salary", "rent", "currentbalance", "savingsbuffer"].includes(target)) {
    setProfileMemory((prev) => ({
      ...prev,
      [target === "currentbalance"
        ? "currentBalance"
        : target === "savings"
          ? "savings"
        : target]: null,
    }));

    reply = `Cleared ${target} from memory.`;
  } else {
    setSpendMemory((prev) =>
      prev.filter((item) => item.category.toLowerCase() !== target)
    );

    reply = `Cleared ${target} transactions.`;
  }

  const botMsg: Message = {
    id: nextId.current++,
    sender: "bot",
    text: reply,
  };

  setMessages((prev) => [...prev, botMsg]);
  return;
}

  if (trimmed.toLowerCase() === "reset") {
  setProfileMemory({
    salary: null,
    rent: null,
    currentBalance: null,
    savingsBuffer: null,
  });

  setSpendMemory([]);

  localStorage.removeItem("savvy_profile");
  localStorage.removeItem("savvy_spends");

  setMessages([
    {
      id: 1,
      sender: "bot",
      text: "Savvy has been reset. Start fresh — try ‘Salary 72000’ or ‘Swiggy 280’.",
    },
  ]);

  return;
}
if (parsed.type === "profile_update") {
  setProfileMemory((prev) => ({
    ...prev,
    [parsed.field]:
      parsed.field === "savings"
        ? (prev.savings || 0) + parsed.value
        : parsed.value,
  }));

  reply =
    parsed.field === "savings"
      ? `Updated savings to ₹${(profileMemory.savings || 0) + parsed.value}.`
      : `Saved your ${parsed.field} as ₹${parsed.value}.`;
}

  if (parsed.type === "transaction") {
    setSpendMemory((prev) => [
      ...prev,
      {
        merchant: parsed.merchant,
        amount: parsed.amount,
        category: parsed.category,
        date: new Date().toISOString(),
      },
    ]);

    reply = `Logged ₹${parsed.amount} under ${parsed.category}.`;
  }

  const botMsg: Message = {
    id: nextId.current++,
    sender: 'bot',
    text: reply,
  };

  setMessages((prev) => [...prev, botMsg]);
}, 800);
  }

  return (
    <div className="h-[100dvh] w-full savvy-shell overflow-x-hidden overflow-y-hidden">
      <div className="h-full w-full max-w-7xl mx-auto flex">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 w-0 border-l savvy-border overflow-x-hidden">
        {/* Header */}
        <header className="shrink-0 border-b savvy-border savvy-header backdrop-blur-md">
            <div className="w-full px-4 sm:px-6 py-4 flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl savvy-accent-soft flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-emerald-400" />
             </div>

             <div>
               <h1 className="text-lg font-bold tracking-tight savvy-text leading-none">
                Savvy
               </h1>
             <p className="text-xs savvy-muted mt-0.5">Personal money assistant</p>
             </div>
            </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full min-w-0 px-4 sm:px-6 py-6 space-y-4 overflow-x-hidden">
            {messages.map((msg) =>
              msg.sender === 'bot' ? (
                <BotMessage key={msg.id} text={msg.text} />
              ) : (
                <UserMessage key={msg.id} text={msg.text} />
              )
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <button
         onClick={() => setShowSnapshot(true)}
         className="lg:hidden fixed bottom-36 right-4 z-30 savvy-surface border savvy-border rounded-full px-3.5 py-2 text-xs font-medium savvy-text shadow-lg"
        >
         Summary
        </button>

        {/* Quick actions + input */}
        <div className="shrink-0 border-t savvy-border savvy-surface-soft backdrop-blur-md">
          <div className="w-full px-4 sm:px-6 pt-3 pb-2 overflow-hidden">
            <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium savvy-muted bg-zinc-800/80 border border-zinc-700/60 hover:bg-zinc-700/80 hover:border-zinc-600/60 hover:savvy-text transition-all duration-150 cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full px-4 sm:px-6 pb-4">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden bg-slate-900 border savvy-border rounded-2xl px-4 py-2.5 focus-within:border-zinc-600 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your money..."
                className="flex-1 min-w-0 bg-transparent text-base sm:text-sm savvy-text placeholder-zinc-600 outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl savvy-accent hover:bg-emerald-400 disabled:bg-zinc-800 disabled:savvy-muted text-zinc-950 flex items-center justify-center transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary card - desktop only */}
      {showSnapshot && (
       <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowSnapshot(false)}>
        <div
         className="absolute bottom-0 left-0 right-0 rounded-t-3xl savvy-surface p-4 max-h-[75vh] overflow-y-auto"
         onClick={(e) => e.stopPropagation()}
        >
        <div className="w-10 h-1 rounded-full bg-slate-600 mx-auto mb-4" />
        <SummaryCard profileMemory={profileMemory} spendMemory={spendMemory} mobile />
        </div>
      </div>
      )}
      <SummaryCard profileMemory={profileMemory} spendMemory={spendMemory} />
    </div>
    </div>
  );
}
