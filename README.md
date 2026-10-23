# 盤上対戦ルーム

オセロ・五目並べ・将棋・チェス・花札(こいこい)を、部屋コードで友だちとオンライン対戦できるWebサイトです。
GitHub Pages で公開し、対戦データの共有には Firebase(Cloud Firestore)を使います。どちらも無料枠で動きます。

## ファイル

| ファイル | 役割 |
|---|---|
| `index.html` | サイト本体 |
| `firebase-config.js` | 自分の Firebase プロジェクトの設定を書くファイル |
| `firestore.rules` | データベースの安全ルール(Firebase コンソールに貼り付ける) |

## 公開の手順

### 1. Firebase の準備(10分くらい)

1. https://console.firebase.google.com/ で「プロジェクトを作成」。Google アナリティクスはオフで大丈夫です。
2. 左メニュー「構築 → Authentication」→「始める」→「ログイン方法」で **匿名** を有効にする。
3. 左メニュー「構築 → Firestore Database」→「データベースを作成」。場所は `asia-northeast1`(東京)がおすすめ。本番環境モードで作成。
4. Firestore の「ルール」タブを開き、`firestore.rules` の中身をそのまま貼り付けて「公開」。
5. 「プロジェクトの設定(歯車)→ 全般 → マイアプリ」で **ウェブアプリ(</>)** を追加し、表示される `firebaseConfig` の値を `firebase-config.js` に書き写す。

### 2. GitHub Pages で公開

1. GitHub で新しいリポジトリを作る(例: `board-game-room`、Public)。
2. この3つのファイル(`index.html`、`firebase-config.js`、`firestore.rules`)と README をアップロードする。
3. リポジトリの「Settings → Pages」で、Source を「Deploy from a branch」、Branch を `main` / `(root)` にして保存。
4. 1〜2分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で開けるようになります。

### 3. Firebase に公開先を登録

Firebase コンソールの「Authentication → 設定 → 承認済みドメイン」に `<ユーザー名>.github.io` を追加します。
これをしないと匿名ログインが失敗し、オンライン対戦が使えません。

## 注意

- 花札の手札や山札の順番は画面には出ませんが、データベースに置いているため、開発者ツールを使えば見ることができます。友だち同士で遊ぶ前提の作りです。
- 遊び終わった部屋のデータは自動では消えません。たまっても無料枠で困ることはほぼありませんが、気になる場合は Firestore の画面から `games` を削除できます。
