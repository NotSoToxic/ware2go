# Ware2Go - Multi-Warehouse Procurement & Route Optimization System

Ware2Go is an AI-powered system designed to optimize procurement and routing for multi-warehouse logistics. It suggests the most efficient procurement strategies and optimal routes, leveraging Google Maps API and Gemini AI for enhanced decision-making.

## Features

- **Multi-Warehouse Procurement Optimization**: Recommends the best warehouse for order fulfillment based on stock availability, demand, and cost factors.
- **Route Optimization**: Provides optimal routing suggestions for delivery efficiency.
- **AI-Powered Decision Making**: Utilizes Gemini AI for intelligent procurement and route analysis.
- **Google Maps API Integration**: Enables real-time mapping and navigation.
- **User-Friendly Dashboard**: Intuitive interface built using React for seamless user interaction.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js (Optional, based on future enhancements)
- **APIs**:
  - Google Maps API (for mapping and routing)
  - Gemini API (for AI-driven decision-making)

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ware2go.git
   cd ware2go
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Access the dashboard via `http://localhost:3000`.
- Enter warehouse and order details to receive procurement and route optimization suggestions.
-----------------------------------------------------------------------------------------------
## Project Structure:
```bash
/Ware2Go
├── .idx/
│   ├── 📜 dev.nix
│   └── 📜 integrations.json
├── public/
│   └── 🖼️ vite.svg
├── src/
│   ├── components/
│   │   ├── 🗺️ MapComponent.jsx
│   │   ├── 🌍 MapView.jsx
│   │   ├── 🧭 Navigation.jsx
│   │   ├── 🗺️ RouteMap.jsx
│   │   ├── 🔄 RouteOptimizer.jsx
│   │   ├── 🏢 WarehouseDashboard.jsx
│   │   └── 📝 WarehousRequestForm.jsx
│   ├── config/
│   │   └── ⚙️ config.js
│   ├── pages/
│   │   ├── 🏠 Home.jsx
│   │   ├── 📝 RequestForm.jsx
│   │   └── 📊 Results.jsx
│   ├── 🎨 App.css
│   ├── 🖥️ App.jsx
│   ├── 🎨 index.css
│   ├── 🚀 main.jsx
│   └── 🎨 pages.css
├── 🔒 .env
├── 📜 .gitignore
├── 🔍 eslint.config.js
├── 📄 index.html
├── 📦 package-lock.json
├── 📦 package.json
├── 📖 README.md
├── 🌐 server.js
└── ⚡ vite.config.js
```
