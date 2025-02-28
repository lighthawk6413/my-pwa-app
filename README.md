# [Note] React+Vite TypeScript PWA

### 背景

React で PWA 作ってオフライン動作させたかったが，iOS がクソなので GitHub Pages で公開する

## According to ChatGPT

### 1. Vite プロジェクトの作成

まずは、Vite の React + TypeScript テンプレートを使って新規プロジェクトを作成します。

1. コマンドプロンプトまたはターミナルを開き、任意のディレクトリに移動します。
2. 以下のコマンドを実行してください。

```bash
npm create vite@latest my-pwa-app -- --template react-ts
```

これで `my-pwa-app` という名前のプロジェクトが作成されます。

3. プロジェクトディレクトリに移動し、依存関係をインストールします。

```bash
cd my-pwa-app
npm install
```

### 2. SWC を利用するためのプラグイン導入

Vite のデフォルトは esbuild ですが、ここでは高速な SWC コンパイラを利用します。

1. SWC を利用するため、@vitejs/plugin-react-swc をインストールします。

```bash
npm install -D @vitejs/plugin-react-swc
```

2. プロジェクト直下の `vite.config.ts` を開き、以下のように修正してください。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Enable React with SWC

// PWA 用のプラグインは後ほど追加します

export default defineConfig({
  base: '/my-pwa-app/', // GitHub Pages用: repository名に合わせて変更
  plugins: [
    react() // Use SWC for React fast refresh and compilation
  ]
})
```

※ base オプションは、GitHub Pagesでリポジトリ公開する際に必要です。リポジトリ名に合わせて適宜変更してください。

### 3. PWA 対応の設定（vite-plugin-pwa の導入）

PWA対応を簡単に行うために、`vite-plugin-pwa` を使用します。

1. 以下のコマンドでインストールします。

```bash
npm install -D vite-plugin-pwa
```

2. 先ほどの `vite.config.ts` に PWA プラグインの設定を追加します。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Enable React with SWC
import { VitePWA } from 'vite-plugin-pwa' // Import PWA plugin

export default defineConfig({
  base: '/my-pwa-app/', // Change according to your GitHub repository name
  plugins: [
    react(), // Use SWC for React fast refresh and compilation
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker
      manifest: {
        name: 'My PWA App',
        short_name: 'PWAApp',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

3. アイコンの準備

上記設定で参照している icon-192.png と icon-512.png は、public フォルダに配置してください。  
※アイコン画像は適当なものを用意するか、オンラインのアイコンジェネレーターを利用してください。

### 4. PWA 用のコード修正と登録

通常、PWA ではサービスワーカーの登録が必要です。  
React のエントリーポイント（通常は src/main.tsx）に以下のコードを追加します。

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Register the service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration)
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

※ vite-plugin-pwa が自動でサービスワーカーを生成・登録するため、基本的には追加の実装は不要ですが、手動で登録する場合は上記のようなコードを参考にしてください。

### 5. GitHub リポジトリの作成と初期コミット

#### 6-1. GitHub上で新規リポジトリを作成

1. GitHubにログインし、右上の「＋」ボタンから「New repository」を選択します。
2. リポジトリ名を my-pwa-app（先ほどの base オプションに合わせる）に設定し、その他必要な項目を入力して作成します。

#### 6-2. ローカルリポジトリの初期化とコミット

1. プロジェクトディレクトリ内で Git リポジトリを初期化します。

```bash
git init
```

2. リモートリポジトリを追加します。

```bash
git remote add origin https://github.com/<あなたのユーザー名>/my-pwa-app.git
```

3. 変更をコミットしてプッシュします。

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 6. GitHub Pages へのデプロイ

GitHub Pages にデプロイするためには、ビルドした静的ファイルを専用のブランチ（一般的には `gh-pages`）に配置します。ここでは `gh-pages` パッケージを利用します。

#### 7-1. gh-pages のインストール

```bash
npm install -D gh-pages
```

#### 7-2. package.json の修正

package.json の "scripts" セクションにデプロイスクリプトを追加します。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 7-3. GitHub Pages の設定

1. GitHub のリポジトリページにアクセスし、「Settings」タブを選択。
2. 左側のメニューから「Pages」を選び、「Source」を gh-pages ブランチに設定します。
3. ※初回デプロイ後に自動で公開されるまで数分かかる場合があります。

#### 7-4. デプロイの実行

ビルドしてデプロイします。

```bash
npm run build
npm run deploy
```

これで、`https://<あなたのユーザー名>.github.io/my-pwa-app/` でPWAが公開されます。

## Q. ソースコードを編集したいんだが？

ソースコードの編集は、基本的には以下の手順で行います。

1. コードエディタで編集  
   Visual Studio Code などのお好みのエディタで、プロジェクトフォルダ（例: `my-pwa-app`）を開きます。  
   例: `src/App.tsx` や他の必要なファイルを修正してください。

2. ローカルで動作確認  
   編集後、ターミナルで以下のコマンドを実行し、開発サーバーを起動して変更が反映されているか確認します。

```bash
npm run dev
```

3. Gitで変更を管理  
   編集が完了したら、Git を使って変更をコミットします。  
   ターミナルで以下を実行してください：

```bash
git add .
git commit -m "Describe your changes here"
git push
```

4. GitHub Pages への再デプロイ  
   GitHub Pages に公開している場合、再度ビルドとデプロイを行う必要があります。  
   以下のコマンドで実行してください：

```bash
npm run build
npm run deploy
```

この流れでソースコードを編集・テストし、リモートリポジトリや GitHub Pages に反映させることができます。
