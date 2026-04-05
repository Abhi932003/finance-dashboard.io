# Finance Dashboard UI

A premium, interactive finance dashboard built with React and Vanilla CSS. Part of the GSD (Get Shit Done) workflow evaluation.

## 🚀 Quick Start

1. **Navigate to the directory**:
   ```bash
   cd dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## ✨ Key Features

- **📊 Comprehensive Analytics**:
  - Balance trends over time (Recharts AreaChart).
  - Categorical spending breakdown (Recharts PieChart).
  - Income vs Expense monthly comparison (Insights page).
- **💳 Transaction Management**:
  - Full searchable and filterable database.
  - Type-based toggles (Income/Expense).
- **👤 Role-Based UI (Simulated)**:
  - **Admin**: Can add and delete transactions.
  - **Viewer**: Read-only access to all data.
  - Switch roles instantly via the header toggle.
- **🛡️ State Management**:
  - Centralized context-driven state for Transactions and Roles.
  - Responsive layout that adapts to all screen sizes.
- **🎨 Premium Design**:
  - Clean "Sovereign Ledger" aesthetic.
  - Smooth transitions and hover states.
  - Meaningful micro-animations.

## 📁 GSD Framework Structure
This project follows the GSD planning methodology:
- `.planning/PROJECT.md`: Vision and core value definition.
- `.planning/REQUIREMENTS.md`: Functional and Non-functional specs.
- `.planning/ROADMAP.md`: Multi-phase execution strategy.
- `.planning/STATE.md`: Real-time progress tracking.

## 🛠️ Stack
- **Framework**: React 18
- **Styling**: Vanilla CSS (Flexbox, Grid, CSS Variables)
- **Charts**: Recharts
- **Icons**: Lucide-React
