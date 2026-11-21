# Chrome Web Store listing text

The store "Description" is entered per locale in the
[Developer Dashboard](https://chrome.google.com/webstore/devconsole) — it does not
live in the extension package. Keep this file in sync when the listing changes so the
text is version-controlled and easy to update next time.

Update both the version number in the changelog block **and** the feature list when
the extension changes.

The short **"Summary from package"** shown in the dashboard is not edited here — it
comes from `extensionDescription` in `_locales/en/messages.json` and
`_locales/ja/messages.json`. Change it there and re-run `rake upload`.

The listing images (screenshot 1280×800, marquee 1400×560, small promo tile 440×280)
are rendered from the SVG mockups in `images/mockups/` with `rake store_images`
(output in `build/store/`).

## English

```
Fastmail Plus makes the Fastmail (https://fastmail.com) web UI easier to use and more productive. Updated for the latest redesigned interface.

Fastmail Plus is an independent open-source project and is not affiliated with or endorsed by Fastmail.

Changelog:
0.6.2 With the reading pane off, ↑/↓ and J/K move through the list without opening messages; → opens and ← goes back to the list
0.6.1 Also works in a conversation opened in its own window
0.6.0 Open messages are resizable and share one width with replies and compose; the compose pane is centred; optional button next to the search box that switches the reading pane (Side / Bottom / Off)
0.5.0 Works again with Fastmail's current web UI; no bundled libraries (jQuery removed); J/K work in the reading pane; inline replies are resizable; ←/→ open and close messages; optional H/L keys that work like ←/→
0.4.2 Reading-pane buttons restyled onto a frosted panel (no longer bleed over the message text); steadier bottom-right placement; smoother collapse/expand
0.4.1 Reliability fixes for the uncluttered view and the reading-pane button icons
0.4.0 Adjustable message body text size (zoom); the compose pane remembers its size; hover help on the reading-pane buttons
0.3.0 Caught up with the redesigned Fastmail UI (app.fastmail.com); restored cursor-key focus, reading-pane buttons, resizable compose, and the right-side panel toggle, plus several fixes
0.2.17.2 Extra buttons overlapping problem fixed
0.2.17 Issues related to the search bar fixed
0.2.16 Badge notification for unread messages dropped
0.2.15 Reload button added to the reading pane button set 🔄

Features:
- Change focus using ⬆️ ⬇️ ⬅️ ➡️ cursor keys
- Faster switch between different search modes 🔁
- Easier button operation in the reading pane
- Extra shortcut keys (hover a button to see what it does)
- Resizable message, compose and note panes sharing one width (remembers its size)
- Adjustable message body text size (zoom the body only, not the whole UI)
- Optional: H/L keys that work like ←/→
- Optional: a button next to the search box that switches the reading pane (Side / Bottom / Off)

See README at https://github.com/yohasebe/fastmail-plus
```

## 日本語 (Japanese)

```
Fastmail (https://fastmail.com) のウェブ・インターフェイスを大幅に使いやすくするChrome拡張です。刷新された新しいUIに対応しました。

Fastmail Plus は個人によるオープンソースのプロジェクトで、Fastmail 社とは関係がなく、同社の公認を受けたものではありません。

変更履歴：
0.6.2 閲覧ペインがオフのとき、↑/↓とJ/Kでメールを開かずに一覧を移動し、→で開いて←で一覧に戻るよう修正
0.6.1 別ウィンドウで開いた会話でも動作するよう修正
0.6.0 開いたメールの幅をドラッグで調整（返信欄・作成欄と同じ幅を共有）；作成欄を中央に配置；閲覧ペインの位置（右／下／なし）を切り替える検索ボックス横のボタンをオプションで追加
0.5.0 現在のFastmailのUIに再対応；外部ライブラリの同梱を廃止（jQueryを削除）；閲覧中のJ/Kでのメール移動；返信欄の幅調整；←/→でのメールの開閉；←/→と同じ働きをするH/Lキーをオプションで追加
0.4.2 閲覧ペインのボタンをすりガラス調のパネルに変更（本文への映り込みを解消）；右下配置を安定化；折りたたみ／展開アニメを改善
0.4.1 集中表示と閲覧ペインのボタンアイコンの信頼性を改善
0.4.0 メール本文の文字サイズ調整（zoom）を追加；作成欄のサイズを記憶；閲覧画面のボタンにホバーで説明を表示
0.3.0 刷新されたFastmailの新UI（app.fastmail.com）に対応。カーソルキーでのメッセージ選択、閲覧画面のボタン群、作成欄のリサイズ、右パネルの開閉などを復活し、各種不具合を修正
0.2.17.2 追加ボタンがUndo操作通知の下に来るように変更
0.2.17 検索ボックスまわりの問題を解消
0.2.16 未読メール数のバッジへの表示を廃止（タブ表示があるため）
0.2.15 閲覧画面のボタンセットに再読み込みボタンを追加 🔄

主な機能：
- キーボードのカーソルキー（ ⬆️ ⬇️ ⬅️ ➡️）によるメッセージ選択
- メール検索の範囲をすばやく変更（全体／件名と本文／件名のみ） 🔁
- メール閲覧に役立つボタン群（集中モード、折りたたみ、展開、etc.）
- 便利なショートカットキーの追加（各ボタンはホバーで説明を表示）
- メール表示・作成・ノートの幅をドラッグで調整可能（同じ幅を共有し、サイズを記憶）
- メール本文だけの文字サイズ調整（UI全体ではなく本文のみ拡大/縮小）
- オプション：←/→と同じ働きをするH/Lキー
- オプション：閲覧ペインの位置（右／下／なし）を切り替える検索ボックス横のボタン

Github README
https://github.com/yohasebe/fastmail-plus
```
