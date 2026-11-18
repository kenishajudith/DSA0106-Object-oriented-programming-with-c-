#pragma once

#include "jewelry_types.hpp"
#include <string>
#include <vector>

namespace aura {

struct TextSentimentResult {
    SentimentPolarity polarity = SentimentPolarity::Positive;
    int score = 75; // 0 - 100
    std::vector<std::string> highlightedWords;
};

class SentimentEngine {
public:
    SentimentEngine();

    // Analyze raw text and return polarity, score (0-100), and matched sentiment words
    TextSentimentResult analyzeText(const std::string& text) const;

    // Aggregate list of reviews into a complete sentiment dashboard summary
    ProductSentimentSummary generateSummary(const std::vector<Review>& reviews) const;

private:
    std::vector<std::string> positiveWords;
    std::vector<std::string> negativeWords;

    std::vector<std::string> tokenize(const std::string& text) const;
};

} // namespace aura

