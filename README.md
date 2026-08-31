# Beautify Africa - React Native Mobile App

A luxury African botanical e-commerce mobile application built with React Native and Expo. It translates all web functionalities into a native iOS & Android shopping experience.

---

## 🌟 Key Mobile Features

- **Discover (Home Screen)**:
  - Hero editorial banners showcasing African botanical harvests.
  - Interactive collection categories carousel (Skincare, Haircare, Body, Serums).
  - Bestselling rituals and new botanical harvest feeds.
  - African beauty wisdom journal & fair-trade origin stories.

- **Catalog & Smart Filters (Shop Screen)**:
  - Fast live search by ingredients, product title, and ritual name.
  - Interactive Filter Bottom Sheet: filter by category, target skin types (Dry, Oily, Sensitive, Mature), and sort criteria.
  - Dynamic product card tiles with high-resolution imagery, pricing, and ratings.

- **Product Detail & Rituals**:
  - Image slider with pagination indicator.
  - Tabbed ritual information: *Ritual & Benefits*, *Botanicals / Clean Ingredients*, *Application / How to Use*, and *Customer Reviews*.
  - Floating wishlist toggle and interactive quantity picker.
  - Guaranteed clean formulation and fair-trade badges.

- **Shopping Bag (Cart Screen)**:
  - Free shipping progress calculator ($50 threshold).
  - Promo code engine with instant discount calculations (e.g., `AFRICA15`, `GLOW20`).
  - Item quantity controls, removal actions, and order breakdown.

- **Multi-Step Checkout & Payment**:
  - Delivery address input with country/city selectors.
  - Payment method options: Credit/Debit Card, Mobile Money / M-Pesa, Apple/Google Pay, and Cash on Delivery.
  - End-to-end simulated order processing with validation.

- **Order Tracking (Track Orders)**:
  - Real-time shipment status lookup by Order ID or Tracking Number.
  - Stepper timeline from order placement to doorstep delivery.

- **Wishlist & Account**:
  - Wishlist management with offline `AsyncStorage` persistence.
  - User authentication (Sign In & Sign Up) with JWT token storage.
  - Profile management, notification toggles, and loyalty points tracker.

---

## 📁 Project Structure

```
BeautifyAfrica_Mobile/
├── App.js                         # Root application entry point
├── app.json                       # Expo configuration & permissions
├── package.json                   # Mobile dependencies
├── babel.config.js                # Babel preset configuration
└── src/
    ├── theme/
    │   └── colors.js              # Terracotta, warm sand, and desert ochre design tokens
    ├── services/
    │   ├── apiConfig.js           # API base URL & storage keys
    │   ├── mockData.js            # Offline fallback botanical catalog & orders
    │   ├── productsApi.js         # Products fetching & filtering API
    │   ├── authApi.js             # User authentication service
    │   ├── cartApi.js             # Cart management service
    │   └── ordersApi.js           # Order creation & shipment tracking service
    ├── context/
    │   ├── AuthContext.js         # Authentication state & persistent session
    │   ├── CartContext.js         # Cart state, promos, and shipping calculations
    │   └── WishlistContext.js     # Saved items & favorites state
    ├── components/
    │   ├── Header.js              # Standardized mobile header with search & bag badges
    │   ├── CustomButton.js        # Reusable button with variants & loading states
    │   ├── ProductCard.js         # Optimized product display card with quick-add
    │   ├── RatingStars.js         # Star rating renderer
    │   ├── Badge.js               # Status badges (Bestseller, New, Sale)
    │   └── FilterBottomSheet.js   # Bottom sheet filter dialog
    ├── screens/
    │   ├── HomeScreen.js          # Curated discovery & editorial stories
    │   ├── ShopScreen.js          # Catalog, search & filtering
    │   ├── ProductDetailScreen.js # Full ritual specs, tabs, reviews & cart actions
    │   ├── CartScreen.js          # Bag management, promo codes & totals
    │   ├── CheckoutScreen.js      # Address & payment forms
    │   ├── OrderSuccessScreen.js  # Order confirmation & receipt
    │   ├── TrackOrdersScreen.js   # Live order tracking stepper
    │   ├── WishlistScreen.js      # Saved favorites grid
    │   ├── ProfileScreen.js       # User account, loyalty points & settings
    │   ├── AuthScreen.js          # Sign in & registration modal
    │   └── AboutBrandScreen.js    # Ethical pledges & origin story
    └── navigation/
        ├── TabNavigator.js        # Bottom tabs (Discover, Shop, Bag, Wishlist, Account)
        └── RootNavigator.js       # Stack navigation with modal & detail transitions
```

---

## 🚀 How to Run the Mobile App

1. Navigate to the mobile folder:
   ```bash
   cd BeautifyAfrica_Mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code using the **Expo Go** app on iOS or Android, or press `a` for Android Emulator / `i` for iOS Simulator.
