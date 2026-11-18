import { useState } from 'react';
import { BarChart3, Star, CheckCircle, MessageSquare, AlertCircle, Sparkles, Send, ShieldCheck } from 'lucide-react';
import type { JewelryItem, Review } from '../types/jewelry';
import { analyzeTextSentiment, generateSentimentSummary } from '../utils/sentiment';

interface ReviewAnalyticsProps {
  products: JewelryItem[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const ReviewAnalytics: React.FC<ReviewAnalyticsProps> = ({
  products,
  reviews,
  onAddReview,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('necklace-1');
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newUserName, setNewUserName] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<boolean>(false);

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const productReviews = reviews.filter((r) => r.productId === selectedProductId);
  const sentimentSummary = generateSentimentSummary(productReviews);

  // Real-time sentiment evaluation of draft text
  const liveSentiment = analyzeTextSentiment(newReviewText);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newUserName.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProductId,
      userName: newUserName,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      text: newReviewText,
      sentiment: liveSentiment.sentiment,
      sentimentScore: liveSentiment.score,
      verified: true,
      pros: liveSentiment.sentiment === 'positive' ? ['High satisfaction', 'Instant AR match'] : [],
      cons: liveSentiment.sentiment === 'negative' ? ['Minor adjustment needed'] : [],
      helpfulCount: 0
    };

    onAddReview(review);
    setNewReviewText('');
    setNewUserName('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Analytics Banner */}
      <div className="bg-[#131B2E] p-8 rounded-3xl border border-amber-500/30 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            AI Sentiment & Review Analytics
          </div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 mb-2">Customer Insights Engine</h1>
          <p className="text-xs text-amber-200/70">NLP analysis of verified buyer feedback, sentiment scores, and quality metrics.</p>
        </div>

        {/* Product Switcher Dropdown */}
        <div className="w-full md:w-auto">
          <label className="text-xs font-semibold text-amber-200/80 block mb-1.5">Select Product Insights:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full md:w-64 bg-[#0B0F19] border border-amber-500/30 text-amber-100 text-xs px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:border-amber-400"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.price})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Overall Score */}
        <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col justify-between">
          <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">AI Sentiment Score</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-amber-400">{sentimentSummary.overallScore}</span>
            <span className="text-xs text-amber-200/50">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Very Positive Sentiment</span>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl md:col-span-2 flex flex-col justify-between">
          <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider mb-2">Sentiment Breakdown</span>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-200">Positive ({sentimentSummary.positivePercent}%)</span>
              </div>
              <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${sentimentSummary.positivePercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-200">Neutral ({sentimentSummary.neutralPercent}%)</span>
              </div>
              <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${sentimentSummary.neutralPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-200">Negative ({sentimentSummary.negativePercent}%)</span>
              </div>
              <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${sentimentSummary.negativePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Rating */}
        <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col justify-between">
          <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">Average Rating</span>
          <div className="my-2 flex items-center gap-2">
            <span className="text-4xl font-serif font-bold text-amber-400">{currentProduct.rating}</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <span className="text-[11px] text-amber-200/60">Based on {currentProduct.reviewCount} reviews</span>
        </div>

      </div>

      {/* AI Review Summary Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#131B2E] to-amber-500/10 p-6 rounded-3xl border border-amber-500/30 shadow-xl mb-8">
        <h3 className="text-sm font-serif font-bold text-amber-200 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Review Digest Summary
        </h3>
        <p className="text-xs text-amber-100/90 leading-relaxed">{sentimentSummary.aiSummary}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-amber-500/20">
          <div>
            <span className="text-xs font-bold text-emerald-400 block mb-1.5">Top Mentioned Pros:</span>
            <ul className="text-xs text-amber-200/80 space-y-1">
              {sentimentSummary.keyPros.map((pro, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400 block mb-1.5">Areas for Attention:</span>
            <ul className="text-xs text-amber-200/80 space-y-1">
              {sentimentSummary.keyCons.map((con, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews List & Write Review Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Customer Reviews Feed (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Verified Customer Reviews ({productReviews.length})
          </h3>

          {productReviews.map((rev) => (
            <div key={rev.id} className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-100">{rev.userName}</span>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-200/50">{rev.date}</span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                  ))}
                </div>
              </div>

              <p className="text-xs text-amber-200/80 leading-relaxed">{rev.text}</p>

              {rev.pros.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {rev.pros.map((p, i) => (
                    <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      + {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Submit Review with Live AI Sentiment (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-[#131B2E] p-6 rounded-3xl border border-amber-500/20 shadow-xl sticky top-28">
            <h3 className="text-base font-serif font-bold text-amber-100 mb-1">Write a Verified Review</h3>
            <p className="text-xs text-amber-200/60 mb-4">Share your try-on experience and product quality feedback.</p>

            {submittedMessage && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Review submitted and processed by AI Sentiment Engine!</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs text-amber-200/80 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Sterling"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-amber-500/30 rounded-xl text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-amber-200/80 block mb-1">Rating</label>
                <div className="flex gap-2 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-amber-200/80 block mb-1">Review Comments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the fit, AR try-on accuracy, metal shine, and comfort..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-3 bg-[#0B0F19] border border-amber-500/30 rounded-xl text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Real-Time Live AI Sentiment Analysis Preview Box */}
              {newReviewText.length > 5 && (
                <div className="p-3 bg-[#0B0F19] rounded-xl border border-amber-500/20 text-xs flex items-center justify-between">
                  <span className="text-amber-200/60">Live AI Sentiment Preview:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    liveSentiment.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {liveSentiment.sentiment.toUpperCase()} ({liveSentiment.score}%)
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
              >
                <Send className="w-4 h-4" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
