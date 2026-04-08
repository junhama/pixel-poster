# pixel-poster

レトロ8bit風イベント告知・ポスター・サムネイル生成アプリ

## 概要

**pixel-poster** は、意図的に表現を制限したピクセル調デザインを簡単に作成できるWebアプリです。

テンプレート選択、テキスト入力、アイコン配置、配色選択のみで、Canvaでは難しい「レトロ統一感」を誰でも簡単に実現できます。

## 機能

### MVP機能
- **テンプレート選択**（4種類）:
  - 🎪 イベント告知
  - 🛍️ セール告知
  - 📝 個人ブロマガ
  - 🎮 ゲーム配信告知

- **テキスト編集**:
  - タイトル（最大30文字）
  - 本文（最大120文字、改行可能）
  - 日時・場所（最大40文字）

- **ピクセルアイコン**（16個から選択）:
  ⭐ ❤️ 🔥 ⚡ 🌟 💎 🎯 🏆 🎪 🎨 🎮 🎵 🎁 🎉 🌈 🔮
  
  - 最大3つ配置可能

- **配色パターン**（6種類）:
  - レトロポップ（赤・黄・水色）
  - パステル（緑・黄・紫）
  - サンセット（赤・ピンク・オレンジ）
  - サイバー（水色・紫・緑）
  - モノクロ（黒・グレー）
  - アクア（青・水色・緑）

- **PNG書き出し**（1クリックで保存）

- **Twitter/X共有**（画像をクリップボードにコピー）

- **作成履歴**（最大10件の履歴をLocalStorageに保存）

## 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **データ永続化**: LocalStorage
- **画像生成**: html2canvas
- **PWA**: Service Worker, Web App Manifest

## インストール

### ローカル実行
```bash
python -m http.server 8000
# または
npx serve .
```

ブラウザで `http://localhost:8000` を開く

### PWAインストール
1. Chrome/Safariでアプリを開く
2. 「ホーム画面に追加」を選択
3. スタンドアロンアプリとして使用可能

## デプロイ

### GitHub Pages
1. リポジトリを作成
2. このフォルダの内容をプッシュ
3. Settings > Pages でmainブランチを選択

### Vercel
```bash
npm i -g vercel
vercel
```

## データ形式

### LocalStorage構造

```javascript
// 作成履歴
pixel-poster-history: [
  {
    id: timestamp,
    dataUrl: "data:image/png;base64,...",
    template: "event",
    color: "retro1",
    icons: [1, 2, 3],
    title: "Sample Title",
    date: "2026-03-20T14:00:00Z"
  }
]
```

## ファイル構成

```
pixel-poster/
├── index.html      # メインページ
├── style.css       # スタイルシート
├── script.js       # メインスクリプト
├── manifest.json   # PWAマニフェスト
├── sw.js           # サービスワーカ
└── README.md       # このファイル
```

## マネタイズ

現在の設定：
- **広告付き無料**: AdSense / A8.net
- フッター広告スペース確保済み

## ビジョン

「pixel-posterで作りました」というクレジットが広まり、レトロデザインの共通言語として認知される。

---

Made with 🎨 by Forge (AI Company)