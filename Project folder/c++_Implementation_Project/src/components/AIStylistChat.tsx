import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Camera, User, Bot } from 'lucide-react';
import type { JewelryItem } from '../types/jewelry';

interface AIStylistChatProps {
  products: JewelryItem[];
  onSelectForTryOn: (item: JewelryItem) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedItems?: JewelryItem[];
  timestamp: string;
}

export const AIStylistChat: React.FC<AIStylistChatProps> = ({
  products,
  onSelectForTryOn,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings! I am Aura, your personal AI Luxury Stylist. Tell me about your upcoming event, dress color, or desired jewelry look and I will curate perfect recommendations for your AR try-on session!',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI Response synthesis using styleVector & occasionTags
    setTimeout(() => {
      let reply = "I recommend exploring our fine diamond and gold solitaires for timeless radiance.";
      let recs: JewelryItem[] = [products[0], products[1]];

      const lower = text.toLowerCase();
      if (lower.includes('rose gold') || lower.includes('rose')) {
        reply = "Rose gold rings pair gorgeously with warm-toned ruby cascade necklaces and delicate diamond huggie hoops for a modern romantic look!";
        recs = products.filter((p) => p.metal === 'Rose Gold' || p.gemstone === 'Ruby');
      } else if (lower.includes('green') || lower.includes('emerald') || lower.includes('dress')) {
        reply = "For an emerald or dark gown, warm 18k Yellow Gold and natural Emerald chandelier dangles create a rich royal harmony!";
        recs = products.filter((p) => p.gemstone === 'Emerald' || p.metal === '18K Gold');
      } else if (lower.includes('bridal') || lower.includes('wedding') || lower.includes('crown')) {
        reply = "For your special wedding day, our Imperial Empress Pearl Tiara paired with the Celestia Diamond Teardrop Necklace offers breathtaking splendor.";
        recs = products.filter((p) => p.occasionTags.includes('bridal') || p.category === 'tiara' || p.category === 'necklace');
      } else if (lower.includes('ring') || lower.includes('sapphire') || lower.includes('finger')) {
        reply = "A cushion-cut Sapphire solitaire encircled with diamond halos elongates the silhouette of your hand beautifully.";
        recs = products.filter((p) => p.category === 'ring');
      } else {
        recs = products.filter(p => p.rating >= 4.9);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        recommendedItems: recs.slice(0, 3),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev: ChatMessage[]) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="bg-[#131B2E] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        
        {/* Chat Header */}
        <div className="bg-[#0B0F19] p-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-amber-100 text-base">Aura • AI Jewelry Stylist</h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Fashion Advisor
              </span>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#0B0F19]/50 p-2.5 border-b border-amber-500/10 flex items-center gap-2 overflow-x-auto">
          {[
            'Jewelry for Emerald Gown',
            'Bridal Earring & Tiara Set',
            'Sapphire Ring Flattery Tips',
            'Everyday Minimalist Choker'
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs whitespace-nowrap hover:bg-amber-500/20 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-indigo-950 border border-amber-500/30 text-amber-300'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-[#0B0F19] text-amber-100 border border-amber-500/20 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Integrated Interactive Recommended Item Cards */}
                {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {msg.recommendedItems.map((item) => (
                      <div key={item.id} className="bg-[#0B0F19] p-3 rounded-2xl border border-amber-500/20 text-xs">
                        <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                        <h4 className="font-serif font-bold text-amber-100 truncate">{item.name}</h4>
                        <span className="font-bold text-amber-400 block mb-2">${item.price}</span>
                        <button
                          onClick={() => onSelectForTryOn(item)}
                          className="w-full py-2 bg-amber-500/20 text-amber-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/30"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Try On AR</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-amber-200/40 block px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 text-amber-400 text-xs items-center animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Aura is typing style recommendations...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0B0F19] border-t border-amber-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Aura about dress matching, ring sizing, or jewelry trends..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#131B2E] border border-amber-500/30 rounded-2xl text-amber-100 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-2xl hover:brightness-110 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
