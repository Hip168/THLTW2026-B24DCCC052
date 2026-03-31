# Project Overview: Club Management System (Base LTW)

This project is a web application built using **Ant Design Pro v5** and **UmiJS v3**, designed for enterprise-level application management, specifically centered around a **Club Management System**.

## 🚀 Tech Stack

- **Framework**: [UmiJS v3](https://umijs.org/)
- **UI Component Library**: [Ant Design (v4)](https://ant.design/)
- **Layout & Pro Components**: [@ant-design/pro-layout](https://procomponents.ant.design/)
- **Language**: TypeScript
- **State Management**: Umi built-in models
- **Networking**: Axios
- **Styling**: Less & Styled-components
- **Visualization**: [ApexCharts](https://apexcharts.com/)
- **Utilities**: 
  - `lodash`
  - `moment` / `moment-timezone`
  - `xlsx` (Excel export/import)
  - `react-beautiful-dnd` (Drag-and-drop)
  - `tinymce` (Rich text editor)

## 📁 Project Structure

```text
.
├── config/             # Route and Umi configuration
├── mock/               # Mock data for local development
├── public/             # Static assets like icons and robots.txt
├── src/
│   ├── .umi/           # Umi generated files (auto-generated)
│   ├── access.ts       # Permission definition
│   ├── app.tsx         # Runtime configuration (initial state, layout)
│   ├── components/     # Global reusable components
│   ├── hooks/          # Custom React hooks
│   ├── locales/        # Internationalization files
│   ├── models/         # Global state management models
│   ├── pages/          # Page components
│   ├── services/       # API interface layer
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   └── typings.d.ts    # TypeScript type definitions
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Main Modules & Features

### 1. 📂 Club Management
- **Club Management (CRUD)**: Create, Read, Update, and Delete operations for club data.
- **Member Management**: Manage club members, including bulk club transfer functionality.
- **Application Management**: Approval/rejection workflows for club join applications with history logging.

### 2. 📊 Dashboard & Home
- **Statistical Overview**: Visual charts using ApexCharts for quick data insights.
- **Home Page (`TrangChu`)**: Main landing area after login.

### 3. 📋 General Utilities
- **TodoList**: A simple task management module.
- **RandomUser**: An example module showcasing data fetching (Random User API).
- **DanhMuc (Categories)**: Management for common data like "Chức vụ" (Positions).
- **ThongBao (Notifications)**: Integration with OneSignal for push notifications.
- **TienIch (Tools)**: Generic utilities such as "Giới thiệu" (About) page.

### 4. 🔐 Security & Infrastructure
- **Authentication**: OIDC client support (`oidc-client-ts`, `react-oidc-context`).
- **Error Tracking**: Integrated with Sentry.
- **Deployment**: Dockerized (`Dockerfile`) and Nginx configuration available.

## 🏃 Getting Started

1. **Install dependencies**: `npm install`
2. **Run in development**: `npm start`
3. **Build for production**: `npm run build`
