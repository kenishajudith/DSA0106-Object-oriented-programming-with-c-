#pragma once

#include "jewelry_types.hpp"
#include <vector>
#include <string>
#include <optional>

namespace aura {

class StoreManager {
public:
    StoreManager();

    // Catalog queries
    const std::vector<JewelryItem>& getCatalog() const { return catalog; }
    std::optional<JewelryItem> getProductById(const std::string& id) const;

    std::vector<JewelryItem> filterProducts(
        const std::string& searchTerm = "",
        JewelryCategory category = JewelryCategory::Unknown,
        MetalType metal = MetalType::Unknown,
        GemstoneType gemstone = GemstoneType::None,
        double maxPrice = 100000.0,
        const std::string& sortBy = "popular"
    ) const;

    // Review queries & additions
    const std::vector<Review>& getAllReviews() const { return reviews; }
    std::vector<Review> getReviewsForProduct(const std::string& productId) const;
    void addReview(const Review& review);

    // Shopping Cart Operations
    const std::vector<CartItem>& getCart() const { return cart; }
    void addToCart(const JewelryItem& item, const std::string& size = "");
    void updateCartQuantity(const std::string& itemId, int delta);
    void removeFromCart(const std::string& itemId);
    void clearCart();
    double getCartSubtotal() const;
    int getCartTotalCount() const;

    // Wishlist Operations
    const std::vector<std::string>& getWishlistIds() const { return wishlistIds; }
    void toggleWishlist(const std::string& itemId);
    bool isInWishlist(const std::string& itemId) const;
    std::vector<JewelryItem> getWishlistItems() const;

    // Try-on Session Logs
    const std::vector<SessionTryOnLog>& getSessionLogs() const { return sessionLogs; }
    void logTryOnSession(const SessionTryOnLog& log);

private:
    std::vector<JewelryItem> catalog;
    std::vector<Review> reviews;
    std::vector<CartItem> cart;
    std::vector<std::string> wishlistIds;
    std::vector<SessionTryOnLog> sessionLogs;

    void initializeDefaultCatalog();
    void initializeDefaultReviews();
    std::string toLower(const std::string& str) const;
};

} // namespace aura

