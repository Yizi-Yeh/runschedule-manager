# CLAUDE.md

本檔案為 Claude Code (claude.ai/code) 在此專案中工作時的指引文件。

## 專案概述

RunSchedule Manager (跑步訓練管理系統) 是一個專業的跑步訓練課表管理系統，具備 Google Calendar 同步功能，使用 Next.js 15、React 19 和 TypeScript 建構。應用程式為繁體中文使用者設計，並使用 Material-UI 作為介面框架。

## 架構設計

### 狀態管理
- 使用 **Zustand** 配合持久化功能進行全域狀態管理 (`src/store/useAppStore.ts`)
- 中央儲存庫管理賽季、週次、日程、訓練項目和應用程式設定
- 所有資料自動持久化至 localStorage

### 核心資料結構
- **Season (賽季)**: 頂層容器 (12 週訓練週期)
- **WeekTraining (週訓練)**: 賽季內的個別週次
- **DayTraining (日訓練)**: 具彈性排程的每日訓練
- **TrainingItem (訓練項目)**: 個別練習項目 (暖身/主要/收操類型)

### 主要功能
- 多賽季訓練管理
- 彈性日程安排 (週二/週三互換)
- Google Calendar 整合
- 資料匯入/匯出功能
- 主題支援 (明亮/暗黑)

### 資料夾結構
```
src/
├── app/                 # Next.js App Router 頁面
├── components/          # 依功能組織的 React 元件
│   ├── calendar/        # 日曆同步元件
│   ├── data/           # 資料管理
│   ├── import/         # 匯入功能
│   ├── layout/         # 應用程式佈局元件
│   ├── season/         # 賽季管理
│   ├── settings/       # 設定頁面
│   └── training/       # 訓練課表元件
├── lib/                # 工具函式和常數
├── providers/          # React context providers
├── store/              # Zustand store
├── theme/              # Material-UI 主題
└── types/              # TypeScript 型別定義
```

## 常用指令

### 開發相關
```bash
npm run dev          # 啟動開發伺服器 (使用 Turbopack)
npm run build        # 建構正式版本 (使用 Turbopack)
npm run start        # 啟動正式伺服器
npm run lint         # 執行 ESLint
```

### 路徑別名
- `@/*` 對應至 `src/*` (在 tsconfig.json 中設定)

## 主要依賴套件
- **Next.js 15** 配合 App Router 和 Turbopack
- **React 19** 配合 React Hook Form
- **Material-UI v7** 作為 UI 元件庫
- **Zustand** 用於狀態管理
- **date-fns** 用於日期處理
- **UUID & Lodash** 作為工具函式

## 開發注意事項
- 目前未設定測試框架
- 使用 ESLint 進行程式碼品質檢查
- 啟用嚴格的 TypeScript 設定
- 所有元件皆使用 Material-UI 主題系統