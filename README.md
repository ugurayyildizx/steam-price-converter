# Steam Price Converter

Steam Price Converter is a browser extension that dynamically converts prices on the Steam store and community pages into your preferred currency (TRY, EUR, USD).

## Features

- **High Availability**: Dual-layer API support. Automatically falls back to **Binance API** if the primary Frankfurter API is unavailable.
- **Multiple Currency Modes**:
  - 🇹🇷 USD ➔ TRY (Default)
  - 🇪🇺 USD ➔ EUR
  - 🇺🇸 EUR ➔ USD
- **Smart Discount Management**:
  - **Show Original Prices**: Display converted price along with the original value (e.g., 150 TL ($4.50)).
  - **Hide Discount Details**: Completely removes discount percentages and original prices, showing only the final converted price for a cleaner look.
- **Optimized UI**: A compact, modern popup interface with flag icons for quick currency switching.
- **Auto-Update**: Fetches real-time exchange rates automatically.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.

## Technical Details

- **Framework**: Pure JavaScript (Manifest V3)
- **Primary API**: [Frankfurter API](https://www.frankfurter.app/)
- **Backup API**: [Binance API](https://api.binance.com/) (Fallback support)
- **Performance**: Uses `MutationObserver` for dynamic content and CSS-based hiding for maximum efficiency.

## License

MIT - Copyright (c) 2026 Uğur Ayyıldız

---
Developed by [ugurayyildizx](https://github.com/ugurayyildizx)
