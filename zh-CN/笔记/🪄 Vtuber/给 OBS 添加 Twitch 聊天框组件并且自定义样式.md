---
tags:
  - 开发/前端
  - 开发/语言/CSS
  - 软件/开源/OBS
  - 网站/Twitch
---
# 给 OBS 添加 Twitch 聊天框组件并且自定义样式

```css
/*
Twitch chat browsersource CSS for OBS
Just set the URL as https://www.twitch.tv/popout/%%TWITCHCHANNEL%%/chat
And paste this entire file into the CSS box
Original by twitch.tv/starvingpoet modified by github.com/Bluscream
Readjusted for new (2019/2020) Twitch by github.com/mjbogusz
General Settings
*/
body {
	color: #FFFFFF !important;
	margin: 0 auto !important;
	overflow: hidden !important;
	text-shadow: unset !important;
}

/* Remove the background */
html, body,
.room-selector, .room-selector__header,
.twilight-minimal-root, .tw-root--theme-light,
.popout-chat-page, .chat-room, .tw-c-background-alt,
.chat-container, .stream-chat-container,
.first-message-highlight-line {
	background: rgba(0, 0, 0, 0) !important;
	background-color: rgba(0, 0, 0, 0) !important;
}

/*
Badge Removal
To remove additional badge types - moderator, bits, etc
- just make a copy of the one of the following badge selectors
and replace the word inbetween the quotes with the hover text
*/

/*
img.badge[alt="Broadcaster"],
img.badge[alt="Moderator"],
img.badge[alt="Subscriber"],
*/
img.badge[alt="Twitch Prime"],
img.badge[alt="Turbo"],
img.badge[alt="Verified"] {
	display: none !important;
}

/* Remove the header and footers*/
.stream-chat .stream-chat-header {
	display: none !important;
}
.stream-chat .chat-room .chat-room__content .chat-input {
	display: none !important;
}
/* Remove the 'welcome to the chat room' message */
.chat-line__status {
	display: none !important;
}
/* Move the actual chat window up */
.stream-chat .chat-room {
	top: 0 !important;
}
.chat-author__intl-login {
	display: none !important;
}

/**
 * Font Size & Color
 */
.chat-line__message {
	font-size: 26px !important;
	line-height: 30px !important;
	color: #FFFFFF !important;
}

.consent-banner {
	display: none !important;
}
```
