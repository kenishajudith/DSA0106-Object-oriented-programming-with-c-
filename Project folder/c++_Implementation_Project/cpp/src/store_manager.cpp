#include "../include/store_manager.hpp"
#include <algorithm>
#include <cctype>

namespace aura {

StoreManager::StoreManager() {
    initializeDefaultCatalog();
    initializeDefaultReviews();
    wishlistIds = { "necklace-1", "earrings-1" };
}

std::string StoreManager::toLower(const std::string& str) const {
    std::string out = str;
    std::transform(out.begin(), out.end(), out.begin(), [](unsigned char c) {
        return std::tolower(c);
    });
    return out;
}

void StoreManager::initializeDefaultCatalog() {
    catalog = {
        // 1. Celestia Diamond Tear Drop Necklace
        {
            "necklace-1",
            "Celestia Diamond Tear Drop Necklace",
            JewelryCategory::Necklace,
            3490.0,
            4.9,
            42,
            "/jewelry/diamond_necklace.png",
            "/overlays/necklace_diamond_teardrop.png",
            MetalType::WhiteGold,
            GemstoneType::Diamond,
            "2.5 ct",
            18.5,
            StyleType::Bridal,
            "An ethereal tear-drop solitare pendant crafted in 18k White Gold, suspended from a diamond-accented collarbone chain.",
            { "bridal", "festive" },
            "necklace_pendant_1",
            { "neckBase", "shoulders" },
            { 0.95, 0.2, 0.9, 1.0, 1.0 },
            { "2.5 ct", "18K (750 Gold)", "VVS1 / Color D", "18.5g", "42cm Chain Length" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Round, FaceShape::Square, FaceShape::Oval },
            true, false,
            { "bridal", "diamond", "necklace", "luxury" }
        },

        // 2. Imperial Emerald Royal Choker
        {
            "necklace-2",
            "Imperial Emerald Royal Choker",
            JewelryCategory::Necklace,
            4850.0,
            4.95,
            31,
            "/jewelry/emerald_necklace.png",
            "/overlays/necklace_emerald_royal.png",
            MetalType::Gold18K,
            GemstoneType::Emerald,
            "3.8 ct",
            26.2,
            StyleType::Royal,
            "A regal choker set with Colombian emeralds and brilliant-cut diamond halos in warm 18k Yellow Gold.",
            { "bridal", "festive" },
            "necklace_choker_1",
            { "neckBase", "shoulders" },
            { 0.98, 0.9, 0.95, 2.0, 1.1 },
            { "3.8 ct", "18K (750 Gold)", "AAA Natural Emerald", "26.2g", "38cm Choker Width" },
            { SkinTone::WarmGold, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Heart, FaceShape::Diamond },
            true, false,
            { "emerald", "royal", "gold", "choker" }
        },

        // 3. Aura Radiant Solitaire Diamond Pendant
        {
            "necklace-3",
            "Aura Radiant Solitaire Diamond Pendant",
            JewelryCategory::Necklace,
            1850.0,
            4.85,
            56,
            "/jewelry/diamond_pendant.png",
            "/overlays/necklace_sapphire_pendant.png",
            MetalType::Platinum,
            GemstoneType::Diamond,
            "1.2 ct",
            9.8,
            StyleType::Minimalist,
            "A sleek floating solitaire diamond suspended on an ultra-fine platinum chain for effortless everyday luxury.",
            { "everyday", "office" },
            "necklace_minimal_1",
            { "neckBase" },
            { 0.7, 0.1, 0.4, 1.0, 0.8 },
            { "1.2 ct", "Platinum 950", "VS1 / Color E", "9.8g", "40cm Chain" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Round, FaceShape::Heart },
            false, true,
            { "solitaire", "platinum", "minimalist" }
        },

        // 4. Emerald Royal Chandelier Earrings
        {
            "earrings-1",
            "Emerald Royal Chandelier Earrings",
            JewelryCategory::Earrings,
            2650.0,
            4.88,
            38,
            "/jewelry/emerald_earrings.png",
            "/overlays/earring_emerald_chandelier.png",
            MetalType::Gold18K,
            GemstoneType::Emerald,
            "2.2 ct",
            14.2,
            StyleType::Royal,
            "Intricately articulated chandelier earrings showcasing pear-cut Colombian emeralds framed by brilliant diamond pavé.",
            { "bridal", "festive" },
            "earring_chandelier_1",
            { "leftEarlobe", "rightEarlobe" },
            { 0.9, 0.8, 0.85, 2.0, 1.0 },
            { "2.2 ct", "18K Yellow Gold", "VVS Emeralds", "14.2g (Pair)", "5.2cm Length" },
            { SkinTone::WarmGold, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Heart, FaceShape::Diamond },
            true, false,
            { "emerald", "earrings", "royal", "chandelier" }
        },

        // 5. Celestia Brilliant Diamond Huggie Hoops
        {
            "earrings-2",
            "Celestia Brilliant Diamond Huggie Hoops",
            JewelryCategory::Earrings,
            1420.0,
            4.92,
            64,
            "/jewelry/diamond_hoops.png",
            "/overlays/earring_diamond_hoops.png",
            MetalType::Platinum,
            GemstoneType::Diamond,
            "1.0 ct",
            7.5,
            StyleType::Modern,
            "Effortless elegance with channel-set brilliant diamonds inside and outside the platinum huggie loops.",
            { "everyday", "office" },
            "earring_hoop_1",
            { "leftEarlobe", "rightEarlobe" },
            { 0.6, 0.1, 0.5, 1.0, 0.8 },
            { "1.0 ct", "Platinum 950", "VS2 / Color F", "7.5g (Pair)", "1.6cm Diameter" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Square, FaceShape::Diamond, FaceShape::Round },
            true, false,
            { "diamond", "hoops", "modern", "everyday" }
        },

        // 6. Sapphire Royal Solitaire Ring
        {
            "ring-1",
            "Sapphire Royal Solitaire Ring",
            JewelryCategory::Ring,
            3200.0,
            4.95,
            45,
            "/jewelry/sapphire_ring.png",
            "/overlays/ring_solitaire_sapphire.png",
            MetalType::Platinum,
            GemstoneType::Sapphire,
            "3.1 ct",
            8.4,
            StyleType::Royal,
            "A breathtaking deep royal blue Ceylon sapphire mounted on a tapered platinum band encrusted with micropavé diamonds.",
            { "bridal", "festive" },
            "ring_sapphire_1",
            { "selectedFingerPIP", "selectedFingerMCP" },
            { 0.95, 0.3, 0.9, 3.0, 1.0 },
            { "3.1 ct", "Platinum 950", "Royal Blue Natural Sapphire", "8.4g", "US Size 7 (Resizing Free)" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Round, FaceShape::Heart, FaceShape::Square, FaceShape::Diamond },
            true, false,
            { "sapphire", "ring", "solitaire", "royal" }
        },

        // 7. Solitaire Brilliant Cut Diamond Ring
        {
            "ring-2",
            "Solitaire Brilliant Cut Diamond Ring",
            JewelryCategory::Ring,
            4100.0,
            4.97,
            58,
            "/jewelry/diamond_ring.png",
            "/overlays/ring_solitaire_diamond.png",
            MetalType::WhiteGold,
            GemstoneType::Diamond,
            "2.0 ct",
            6.2,
            StyleType::Modern,
            "Classic 6-prong solitaire setting holding an exquisite ideal-cut round brilliant diamond in 18k White Gold.",
            { "bridal", "everyday" },
            "ring_diamond_1",
            { "selectedFingerPIP", "selectedFingerMCP" },
            { 0.92, 0.1, 0.8, 1.0, 1.0 },
            { "2.0 ct", "18K White Gold", "VVS1 / Color D", "6.2g", "US Size 6.5" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Round, FaceShape::Heart, FaceShape::Square, FaceShape::Diamond },
            true, false,
            { "diamond", "ring", "solitaire", "engagement" }
        },

        // 8. Emerald Cut Gold Signet Ring
        {
            "ring-3",
            "Emerald Cut Gold Signet Ring",
            JewelryCategory::Ring,
            2900.0,
            4.82,
            29,
            "/jewelry/gold_emerald_ring.png",
            "/overlays/ring_gold_emerald.png",
            MetalType::Gold18K,
            GemstoneType::Emerald,
            "2.4 ct",
            11.5,
            StyleType::Vintage,
            "A bold solid 18k yellow gold signet ring boasting a bezel-set octagonal emerald with brushed satin shoulders.",
            { "everyday", "festive" },
            "ring_emerald_1",
            { "selectedFingerPIP", "selectedFingerMCP" },
            { 0.85, 0.9, 0.8, 2.0, 1.05 },
            { "2.4 ct", "18K Yellow Gold", "Zambian Emerald", "11.5g", "US Size 8" },
            { SkinTone::WarmGold, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Square, FaceShape::Round },
            false, true,
            { "emerald", "gold", "signet", "vintage" }
        },

        // 9. Sunset Rose Gold Ruby Solitaire Ring
        {
            "ring-4",
            "Sunset Rose Gold Ruby Solitaire Ring",
            JewelryCategory::Ring,
            2750.0,
            4.89,
            33,
            "/jewelry/ruby_ring.png",
            "/overlays/ring_ruby_sunset.png",
            MetalType::RoseGold,
            GemstoneType::Ruby,
            "2.1 ct",
            7.8,
            StyleType::Modern,
            "A romantic cushion-cut pigeon-blood red ruby nestled in a sculpted 18k Rose Gold bypass band.",
            { "bridal", "everyday" },
            "ring_ruby_1",
            { "selectedFingerPIP", "selectedFingerMCP" },
            { 0.88, 0.7, 0.85, 4.0, 1.0 },
            { "2.1 ct", "18K Rose Gold", "Burmese Natural Ruby", "7.8g", "US Size 7" },
            { SkinTone::WarmGold, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Heart, FaceShape::Diamond },
            false, true,
            { "ruby", "rosegold", "ring", "sunset" }
        },

        // 10. Imperial Empress Pearl & Diamond Tiara
        {
            "tiara-1",
            "Imperial Empress Pearl & Diamond Tiara",
            JewelryCategory::Tiara,
            6200.0,
            4.98,
            19,
            "/jewelry/gold_tiara.png",
            "/overlays/tiara_empress_pearl.png",
            MetalType::Gold18K,
            GemstoneType::Pearl,
            "Graduated Pearls + 4.5 ct Diamond",
            68.0,
            StyleType::Royal,
            "An awe-inspiring royal diadem handcrafted with South Sea pearls and arched diamond arches in rich 18k Yellow Gold.",
            { "bridal", "festive" },
            "tiara_crown_1",
            { "foreheadCenter" },
            { 1.0, 0.9, 1.0, 5.0, 1.2 },
            { "Graduated Pearls + 4.5ct Dia", "18K Yellow Gold", "AAA South Sea Cultured Pearls", "68.0g", "Flexible Headband Arc" },
            { SkinTone::WarmGold, SkinTone::NeutralRose, SkinTone::CoolSilver },
            { FaceShape::Oval, FaceShape::Round, FaceShape::Heart },
            true, false,
            { "tiara", "crown", "pearl", "royal", "bridal" }
        },

        // 11. Luxe Pavé Diamond Tennis Bracelet
        {
            "bracelet-1",
            "Luxe Pavé Diamond Tennis Bracelet",
            JewelryCategory::Bracelet,
            3950.0,
            4.91,
            44,
            "/jewelry/diamond_bracelet.png",
            "/overlays/ring_solitaire_diamond.png",
            MetalType::Platinum,
            GemstoneType::Diamond,
            "4.0 ct",
            16.2,
            StyleType::Modern,
            "Continuous line of hand-matched round brilliant diamonds set in articulated platinum prongs with safety clasp.",
            { "everyday", "bridal", "festive" },
            "bracelet_tennis_1",
            { "wristCenter" },
            { 0.85, 0.1, 0.7, 1.0, 1.0 },
            { "4.0 ct", "Platinum 950", "VS1 / Color F", "16.2g", "18cm Length" },
            { SkinTone::CoolSilver, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Round, FaceShape::Heart, FaceShape::Square, FaceShape::Diamond },
            true, false,
            { "bracelet", "diamond", "tennis", "platinum" }
        },

        // 12. Royal Heritage Gold Nose Ring (Nath)
        {
            "nosering-1",
            "Royal Heritage Gold Nose Ring (Nath)",
            JewelryCategory::NoseRing,
            850.0,
            4.79,
            24,
            "/jewelry/gold_nosering.png",
            "/overlays/necklace_diamond_teardrop.png",
            MetalType::Gold18K,
            GemstoneType::Ruby,
            "0.5 ct",
            6.5,
            StyleType::Bridal,
            "Traditional Indian bridal nath accented with red rubies, freshwater seed pearls, and a delicate gold hair chain.",
            { "bridal", "festive" },
            "nosering_nath_1",
            { "nostrilCenter" },
            { 0.95, 0.9, 0.8, 4.0, 0.7 },
            { "0.5 ct Ruby + Seed Pearls", "22K/18K Gold", "Natural Ruby Accents", "6.5g", "3.2cm Ring Diameter" },
            { SkinTone::WarmGold, SkinTone::NeutralRose },
            { FaceShape::Oval, FaceShape::Heart, FaceShape::Round },
            false, false,
            { "nosering", "nath", "bridal", "heritage", "gold" }
        }
    };
}

void StoreManager::initializeDefaultReviews() {
    reviews = {
        { "rev-1", "necklace-1", "Elena Rostova", "", 5, "2026-03-12", "The Celestia necklace is unbelievable in person! The AR try-on matched the collarbone arc perfectly.", SentimentPolarity::Positive, 98, true, { "Accurate AR fit", "Brilliant sparkle", "Solid clasp" }, {}, 14 },
        { "rev-2", "necklace-1", "Sophia Vance", "", 5, "2026-03-08", "Wore this for my wedding! The white gold illuminated my cool undertone exactly as the AI suggested.", SentimentPolarity::Positive, 96, true, { "Stunning clarity", "Fast luxury delivery" }, {}, 9 },
        { "rev-3", "earrings-1", "Camilla Dupond", "", 5, "2026-03-05", "The emerald chandeliers swing gracefully. The live tracking placed them right at my earlobe.", SentimentPolarity::Positive, 95, true, { "Vibrant green color", "Lightweight on ear" }, {}, 7 },
        { "rev-4", "ring-1", "Marcus Sterling", "", 5, "2026-03-01", "The sapphire color is royal and deep. Ring sizer tool accurately called US Size 7.", SentimentPolarity::Positive, 97, true, { "Ring size accuracy", "Impressive packaging" }, {}, 18 },
        { "rev-5", "tiara-1", "Isabella King", "", 5, "2026-02-24", "Looked like a queen for our grand ball. The tiara settled naturally on my forehead in the camera preview.", SentimentPolarity::Positive, 99, true, { "Exquisite pearl lustre", "Comfortable band" }, {}, 21 }
    };
}

std::optional<JewelryItem> StoreManager::getProductById(const std::string& id) const {
    for (const auto& item : catalog) {
        if (item.id == id) return item;
    }
    return std::nullopt;
}

std::vector<JewelryItem> StoreManager::filterProducts(
    const std::string& searchTerm,
    JewelryCategory category,
    MetalType metal,
    GemstoneType gemstone,
    double maxPrice,
    const std::string& sortBy
) const {
    std::string term = toLower(searchTerm);

    std::vector<JewelryItem> out;
    for (const auto& item : catalog) {
        if (!term.empty()) {
            std::string nameLower = toLower(item.name);
            std::string descLower = toLower(item.description);
            bool matchTag = false;
            for (const auto& t : item.tags) {
                if (toLower(t).find(term) != std::string::npos) {
                    matchTag = true;
                    break;
                }
            }
            if (nameLower.find(term) == std::string::npos &&
                descLower.find(term) == std::string::npos &&
                !matchTag) {
                continue;
            }
        }

        if (category != JewelryCategory::Unknown && item.category != category) continue;
        if (metal != MetalType::Unknown && item.metal != metal) continue;
        if (gemstone != GemstoneType::None && item.gemstone != gemstone) continue;
        if (item.price > maxPrice) continue;

        out.push_back(item);
    }

    if (sortBy == "price-low") {
        std::sort(out.begin(), out.end(), [](const JewelryItem& a, const JewelryItem& b) {
            return a.price < b.price;
        });
    } else if (sortBy == "price-high") {
        std::sort(out.begin(), out.end(), [](const JewelryItem& a, const JewelryItem& b) {
            return a.price > b.price;
        });
    } else if (sortBy == "rating") {
        std::sort(out.begin(), out.end(), [](const JewelryItem& a, const JewelryItem& b) {
            return a.rating > b.rating;
        });
    } else { // popular
        std::sort(out.begin(), out.end(), [](const JewelryItem& a, const JewelryItem& b) {
            return a.reviewCount > b.reviewCount;
        });
    }

    return out;
}

std::vector<Review> StoreManager::getReviewsForProduct(const std::string& productId) const {
    std::vector<Review> out;
    for (const auto& r : reviews) {
        if (r.productId == productId) {
            out.push_back(r);
        }
    }
    return out;
}

void StoreManager::addReview(const Review& review) {
    reviews.insert(reviews.begin(), review);
}

void StoreManager::addToCart(const JewelryItem& item, const std::string& size) {
    for (auto& ci : cart) {
        if (ci.item.id == item.id) {
            ci.quantity += 1;
            return;
        }
    }
    cart.push_back({ item, 1, size });
}

void StoreManager::updateCartQuantity(const std::string& itemId, int delta) {
    for (auto it = cart.begin(); it != cart.end();) {
        if (it->item.id == itemId) {
            it->quantity += delta;
            if (it->quantity <= 0) {
                it = cart.erase(it);
                return;
            }
        }
        ++it;
    }
}

void StoreManager::removeFromCart(const std::string& itemId) {
    cart.erase(
        std::remove_if(cart.begin(), cart.end(), [&](const CartItem& ci) {
            return ci.item.id == itemId;
        }),
        cart.end()
    );
}

void StoreManager::clearCart() {
    cart.clear();
}

double StoreManager::getCartSubtotal() const {
    double sum = 0.0;
    for (const auto& ci : cart) {
        sum += ci.item.price * ci.quantity;
    }
    return sum;
}

int StoreManager::getCartTotalCount() const {
    int count = 0;
    for (const auto& ci : cart) {
        count += ci.quantity;
    }
    return count;
}

void StoreManager::toggleWishlist(const std::string& itemId) {
    auto it = std::find(wishlistIds.begin(), wishlistIds.end(), itemId);
    if (it != wishlistIds.end()) {
        wishlistIds.erase(it);
    } else {
        wishlistIds.push_back(itemId);
    }
}

bool StoreManager::isInWishlist(const std::string& itemId) const {
    return std::find(wishlistIds.begin(), wishlistIds.end(), itemId) != wishlistIds.end();
}

std::vector<JewelryItem> StoreManager::getWishlistItems() const {
    std::vector<JewelryItem> out;
    for (const auto& id : wishlistIds) {
        auto prod = getProductById(id);
        if (prod.has_value()) {
            out.push_back(prod.value());
        }
    }
    return out;
}

void StoreManager::logTryOnSession(const SessionTryOnLog& log) {
    sessionLogs.insert(sessionLogs.begin(), log);
}

} // namespace aura

