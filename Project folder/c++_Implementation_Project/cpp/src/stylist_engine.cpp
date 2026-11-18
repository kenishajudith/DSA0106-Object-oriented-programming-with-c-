#include "../include/stylist_engine.hpp"
#include <algorithm>
#include <cctype>

namespace aura {

std::string StylistEngine::toLower(const std::string& s) const {
    std::string out = s;
    std::transform(out.begin(), out.end(), out.begin(), [](unsigned char c) {
        return std::tolower(c);
    });
    return out;
}

StylistResponse StylistEngine::consultStylist(
    const std::string& queryText,
    const std::vector<JewelryItem>& catalog
) const {
    std::string lower = toLower(queryText);

    std::string reply = "I recommend exploring our fine diamond and gold solitaires for timeless radiance.";
    std::vector<JewelryItem> recs;
    std::string tag = "all";

    if (lower.find("rose gold") != std::string::npos || lower.find("rose") != std::string::npos) {
        reply = "Rose gold rings pair gorgeously with warm-toned ruby cascade necklaces and delicate diamond huggie hoops for a modern romantic look!";
        for (const auto& p : catalog) {
            if (p.metal == MetalType::RoseGold || p.gemstone == GemstoneType::Ruby) {
                recs.push_back(p);
            }
        }
        tag = "rosegold";
    } else if (lower.find("green") != std::string::npos || lower.find("emerald") != std::string::npos || lower.find("dress") != std::string::npos) {
        reply = "For an emerald or dark gown, warm 18k Yellow Gold and natural Emerald chandelier dangles create a rich royal harmony!";
        for (const auto& p : catalog) {
            if (p.gemstone == GemstoneType::Emerald || p.metal == MetalType::Gold18K) {
                recs.push_back(p);
            }
        }
        tag = "emerald";
    } else if (lower.find("bridal") != std::string::npos || lower.find("wedding") != std::string::npos || lower.find("crown") != std::string::npos) {
        reply = "For your special wedding day, our Imperial Empress Pearl Tiara paired with the Celestia Diamond Teardrop Necklace offers breathtaking splendor.";
        for (const auto& p : catalog) {
            bool isBridalOccasion = std::find(p.occasionTags.begin(), p.occasionTags.end(), "bridal") != p.occasionTags.end();
            if (isBridalOccasion || p.category == JewelryCategory::Tiara || p.category == JewelryCategory::Necklace) {
                recs.push_back(p);
            }
        }
        tag = "bridal";
    } else if (lower.find("ring") != std::string::npos || lower.find("sapphire") != std::string::npos || lower.find("finger") != std::string::npos) {
        reply = "A cushion-cut Sapphire solitaire encircled with diamond halos elongates the silhouette of your hand beautifully.";
        for (const auto& p : catalog) {
            if (p.category == JewelryCategory::Ring) {
                recs.push_back(p);
            }
        }
        tag = "ring";
    } else {
        for (const auto& p : catalog) {
            if (p.rating >= 4.9) {
                recs.push_back(p);
            }
        }
    }

    if (recs.empty() && !catalog.empty()) {
        for (size_t i = 0; i < std::min<size_t>(3, catalog.size()); ++i) {
            recs.push_back(catalog[i]);
        }
    }

    if (recs.size() > 3) {
        recs.resize(3);
    }

    return { reply, recs, tag };
}

} // namespace aura

