# Fastmail Plus (Browser Extension)

A Chrome/Firefox extension to make **Fastmail** (https://fastmail.com) web UI more usable and productive

<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/fastmail-plus-1400.png?raw=true?raw=true' width="700" />

## Features

- [Change focus using `↑` `↓` `←` `→` cursor keys](#change-focus-using-updown-cursor-keys)
- [Badge notification for unread messages to Inbox](#badge-notification-for-unread-messages-to-inbox)
- [Faster switch between different search modes](#faster-switch-between-search-modes) (anywhere/subject and body/subject only)
- [Easier button operation in reading pane](#easier-button-operation-in-reading-pane)
- [Extra shortcut keys](#extra-shortcut-keys)
- [Fix problem with IME in default search input](#fix-problem-in-using-ime-inside-search-box)
- [Extra "reply-to" folding](#extra-reply-to-folding)
- [Maximize reading pane width](#maximize-reading-pane-width) (default: disabled)
- Light/Dark theme support
- Resizable compose/note panes

## Installation

### Chrome Web Store

https://chrome.google.com/webstore/detail/fastmail-plus/ibgnnkojbkconppocnmdobeodcaijmfm

### Firefox Browser Add-ons

https://addons.mozilla.org/en-US/firefox/addon/fastmail-plus/

### Manual Installation (Chrome)

1. Clone this repository
2. Build the package with `$ rake build`
3. Open `chrome://extensions/` and turn on "Developer mode"
4. Drag and drop `fastmail-plus-chrome.zip` or  to the extensions page

### Manual Installation (Firefox)

1. Clone this repository
2. Build the package with `$ rake build`
3. Open `about:debugging` and click on "Load Temporary Add-on..."
4. Load `fastmail-plus-firefox.zip` 

## Options

<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/fastmail-screenshot-05.png?raw=true' width="700" />

## Description/Usage

### Change Focus Using Up/Down Cursor Keys

When **Show reading pane** is selected in Fastmail Settings:

Press `←` to select mailbox pane, and `→` to select reading pane.

`↑` and `↓` cursor keys can be used (in addition to `J` and `K`) to change focus inside mailbox pane.

`↑` and `↓` cursor keys can be used (in addition to `P` and `N`) to change focus inside reading pane.


When **Hide reading pane** is selected in Fastmail Settings:

`↑` and `↓` cursor keys can be used (in addition to `J` and `K`) to change focus inside mailbox pane. 

`↑` and `↓` cursor keys can be used (in addition to `P` and `N`) to change focus inside reading pane.

### Badge notification for unread messages to Inbox

The number of unread messages to Inbox appears in icon badge and is updated when the browser is having a tab for Fastmail.

<img width="36" alt="badge" src="https://github.com/yohasebe/fastmail-plus/blob/main/images/badge-inactive.png?raw=true"> <br />
Inactive / No unread messages

<img width="36" alt="badge" src="https://github.com/yohasebe/fastmail-plus/blob/main/images/badge-inbox-one.png?raw=true"><br />
One unread message in Inbox

### Faster Switch between Search Modes

Pressing the "repeat arrow" button cyclically switches three different search modes:

- Search anywhere (default)
- Search in subject and body
- Search in subject only

<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/search-input-01.png?raw=true' width="700" />
<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/search-input-02.png?raw=true' width="700" />
<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/search-input-03.png?raw=true' width="700" />

<br />

### Easier Button Operation in Reading Pane

Requirement: `Group messages with their replies` is enabled in Fastmail Settings

An set of extra control buttons are presented on the right-bottom corner of the window. The following will be included (from left to right)

- Add uncluttered-view mode
- Focus previous message in conversation
- Focus next message in conversation
- Toggle currently focused message
- Ungroup/Expand messages
- Collapse messages
- Toggle show/hide extra control

<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/reading-pane-buttons.png?raw=true' width="500" />

<img src='https://user-images.githubusercontent.com/18207/156918099-274bb6ea-aa2f-4202-9ce9-7923e3ca0c61.gif' width="700" />

### Extra Shortcut Keys

If enabled, extra shortcut keys view will be added

- Switch between search modes: `Control + Shift + M`
- Toggle uncluttered-view mode: `Control + Shift + L`
- Toggle show/hide extra control: `Control + ,`
- Toggle currently focused message: `Enter` (in addition to the default `E`)
- Ungroup/Expand messages: `Shift + Enter` (in addition to the default `Shift + E`)
- Collapse messages: `Shift + Option/Alt + Enter` (in addition to the default `Shift + Option/Alt + E`)
- Show/hide right-hand side panel: `Shift + Control + I` (in addition to the default `Shift + Command + I`)
- Prev in Calendar view: `Control + ↑` (in addition to `K`)
- Next in Calendar view: `Control + ↓` (in addition to `J`)

### Fix Problem in Using IME inside Search Box

When entering Japanese (or some other language) in Fastmail's search input, using the IME to enter text requires pressing the Enter key before completing the input. Fastmail's Web UI performs the search at the moment the Enter key is hit even though the search string is completed. Fastmail Plus fixes this problem.

### Extra Reply-to Folding

Fold the "reply-to" part of messages (when the message's  div has an `id` containing `appendonsend`)


### Maximize Reading-pane Width

When enabled, the message/compose/notes panes are maximized to the actual window width. This option is disabled by default.

<img src='https://github.com/yohasebe/fastmail-plus/blob/main/images/max-width.png?raw=true?raw=true' width="700" />

## Advertisement

Sign up for Fastmail via this link and get 10% off for 1 year.

[https://ref.fm/u27773408](https://ref.fm/u27773408)

## Author

Yoichiro Hasebe

## Contributor

Stanislav (Stas) Katkov

## License

The MIT License

## Disclaimer

Fastmail Plus Browser Extension is not officially endorsed by Fastmail. Use this open source software at your own risk and do not contact Fastmail for support.
