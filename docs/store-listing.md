# Chrome Web Store listing text

The store "Description" is entered per locale in the
[Developer Dashboard](https://chrome.google.com/webstore/devconsole) — it does not
live in the extension package. Keep this file in sync when the listing changes so the
text is version-controlled and easy to update next time.

Update both the version number in the changelog block **and** the feature list when
the extension changes.

The short **"Summary from package"** shown in the dashboard is not edited here — it
comes from the `description` field in `manifests/manifest.v3.json` (and `.v2.json`).
Change it there and re-run `rake upload`.

## English

```
Fastmail Plus makes the Fastmail (https://fastmail.com) web UI easier to use and more productive. Updated for the latest redesigned interface.

Changelog:
0.3.0 Caught up with the redesigned Fastmail UI (app.fastmail.com); restored cursor-key focus, reading-pane buttons, resizable compose, and the right-side panel toggle, plus several fixes
0.2.17.2 Extra buttons overlapping problem fixed
0.2.17 Issues related to the search bar fixed
0.2.16 Badge notification for unread messages dropped
0.2.15 Reload button added to the reading pane button set 🔄

Features:
- Change focus using ⬆️ ⬇️ ⬅️ ➡️ cursor keys
- Faster switch between different search modes 🔁
- Easier button operation in the reading pane
- Extra shortcut keys (Press ? key to show available shortcut keys)
- Fix the problem with Japanese IME in the default search input
- Extra "reply-to" folding
- Maximize the width of message/compose/note panes (default: disabled)
- Resizable compose/note textarea

See README at https://github.com/yohasebe/fastmail-plus
```

## 日本語 (Japanese)

```
Fastmail (https://fastmail.com) のウェブ・インターフェイスを大幅に使いやすくするChrome拡張です。刷新された新しいUIに対応しました。

変更履歴：
0.3.0 刷新されたFastmailの新UI（app.fastmail.com）に対応。カーソルキーでのメッセージ選択、閲覧画面のボタン群、作成欄のリサイズ、右パネルの開閉などを復活し、各種不具合を修正
0.2.17.2 追加ボタンがUndo操作通知の下に来るように変更
0.2.17 検索ボックスまわりの問題を解消
0.2.16 未読メール数のバッジへの表示を廃止（タブ表示があるため）
0.2.15 閲覧画面のボタンセットに再読み込みボタンを追加 🔄

主な機能：
- キーボードのカーソルキー（ ⬆️ ⬇️ ⬅️ ➡️）によるメッセージ選択
- メール検索の範囲をすばやく変更（全体／件名と本文／件名のみ） 🔁
- メール閲覧に役立つボタン群（集中モード、折りたたみ、展開、etc.）
- 便利なショートカットキーの追加（?キー打鍵で利用可能なショートカットキーを表示）
- 検索ボックスで日本語IMEを使用する際に生じる不具合解消
- メール本文の返信部分の折りたたみ機能改善
- メール閲覧ボックスとノート作成ボックスの表示幅を画面の最大幅に変更可能（デフォルトはOFF）
- メール／ノート編集テキストエリアの幅を調整可能

Github README
https://github.com/yohasebe/fastmail-plus
```
