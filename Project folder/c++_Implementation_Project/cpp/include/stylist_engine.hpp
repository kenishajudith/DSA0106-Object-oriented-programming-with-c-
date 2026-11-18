#pragma once

#include "jewelry_types.hpp"
#include <string>
#include <vector>

namespace aura {

struct StylistResponse {
    std::string text;
    std::vector<JewelryItem> recommendedItems;
    std::string suggestedFilterTag;
};

class StylistEngine {
public:
    StylistEngine() = default;

    // Process user query and generate contextual AI stylist response with tailored products
    StylistResponse consultStylist(
        const std::string& queryText,
        const std::vector<JewelryItem>& catalog
    ) const;

private:
    std::string toLower(const std::string& s) const;
};

} // namespace aura

