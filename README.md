# Suggestify

_Smarter Input, Faster Typing_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=white&labelColor=gray)]()
[![GitHub stars](https://img.shields.io/github/stars/l1keacat/suggestify?style=social)]()

📥 [Download the latest release](https://github.com/l1keacat/suggestify/releases)

A lightweight, flexible JavaScript plugin for input suggestions/autocomplete.  
Supports multi-word suggestions, customizable array inputs, keyboard navigation, and optional callbacks.

---

## 📖 Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Usage Example](#usage-example)
- [Matching Behavior](#matching)
- [Plugin Parameters](#plugin-parameters)
- [Styling](#styling)
- [Keyboard Navigation](#keyboard-navigation)
- [License](#license)

---

<h2 id="demo">🌐 Demo</h2>

You can try Suggestify live on GitHub Pages:  
👉 [Live Demo](https://l1keacat.github.io/suggestify/)

---

<h2 id="features">✨ Features</h2>

- Show suggestions while typing in an input field
- Supports multiple-word entries and optional whitespace in suggestions
- Optional prevention of duplicate entries
- Configurable array input with custom delimiter
- Keyboard navigation: Arrow Up/Down, Enter
- Post-select and submit callback functions
- Easy to integrate and lightweight

---

<h2 id="usage-example">📦 Usage Example</h2>

Include the plugin JS file in your project:

```html

<script src="suggestify.js"></script>
```

Initialize Suggestify:

```html
<input type="text" id="suggestify">

<script>
    const suggestify = new Suggestify({
        selector: "suggestify",
        suggestOptions: ["apple", "banana", "orange"],
        arrayInput: true,
        arrayDelimiter: ", ",
        allowWhitespace: true,
        allowDuplicates: false,
        caseSensitive: false,
        matchPrefix: false,
        matchWordStart: true,
        postSelectFunction: (tag) => console.log("Selected:", tag),
        submitFunction: () => console.log("Enter pressed"),
        fallbackOption: "fruit"
    });
</script>
```

💡 *See the [🎨 Styling](#styling) section to learn how to customize the look of the suggestion list.*

---

<h2 id="matching">🔍 Matching Behavior</h2>

Suggestify supports multiple matching strategies that can be combined.

### Matching modes

- **Prefix match (`matchPrefix: true`)**
    - Matches suggestions that start with the input
    - Example: `app` → `apple`, `application`

- **Substring match (`matchPrefix: false`)**
  - Matches input anywhere inside the suggestion
  - Example: `ap` → `apple`, `clap`, `staple`

- **Word-start match (`matchWordStart: true`)**
    - Matches the beginning of any word in multi-word entries
    - Requires `allowWhitespace: true`
    - Example: `app` → `green apple`, `mobile application`

### Priority

When multiple modes are enabled, results are sorted by priority:

1. Prefix matches
2. Word-start matches
3. Substring matches

---

<h2 id="plugin-parameters">📝 Plugin Parameters</h2>

| Option Name          | Type        | Default         | Description                                                                                                                 |
|----------------------|-------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------|
| `selector`           | string      | `"suggestions"` | ID of the input element or container element with input inside.                                                             |
| `suggestOptions`     | array       | `[]`            | Array of strings that will be suggested while typing.                                                                       |
| `arrayInput`         | boolean     | `false`         | If `true`, input can accept multiple entries separated by `arrayDelimiter`.                                                 |
| `arrayDelimiter`     | string      | `", "`          | Delimiter used when `arrayInput` is `true`. Must not be a whitespace character.                                             |
| `allowWhitespace`    | boolean     | `false`         | Allows suggestions containing whitespace characters.                                                                        |
| `allowDuplicates`    | boolean     | `false`         | If `false`, prevents suggesting or inserting duplicate entries.                                                             |
| `caseSensitive`      | boolean     | `false`         | If `true`, suggestion matching respects case.                                                                               |
| `fallbackOption`     | string/null | `null`          | A custom value to insert when the user navigates upward past the first suggestion.                                          |
| `matchPrefix`        | boolean     | `false`         | If `true`, matches suggestions that start with the input value (prefix match).                                              |
| `matchWordStart`     | boolean     | `false`         | If `true`, matches the beginning of any word inside multi-word suggestions. <br> **Note: requires `allowWhitespace: true`** |
| `maxSuggestions`     | number      | `3`             | Maximum number of suggestions displayed.                                                                                    |
| `postSelectFunction` | function    | `null`          | Callback function executed after a suggestion is selected. Receives selected tag as argument.                               |
| `submitFunction`     | function    | `null`          | Callback executed when Enter is pressed without selecting a suggestion.                                                     |

---

<h2 id="styling">🎨 Styling</h2>

Suggestify comes with **minimal default styles** to make the suggestion list look clean and usable out of the box.  
These styles are deliberately simple and neutral, so you can easily override them in your own CSS if you need a custom
look.

### Default styles

```css
.suggestion-wrapper {
  position: relative;
}

.suggestion-list {
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;
  visibility: hidden;
  z-index: 99;
  top: 110%;
  opacity: 0;
  background: #2e2e2e;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  border-radius: 0 0 5px 5px;
  transition: all .2s;
}

.suggestion-list.visible {
  visibility: visible;
  top: 100%;
  opacity: 1;
}

.suggestion-item {
  cursor: pointer;
  padding: 5px 10px;
  transition: all .1s;
}

.suggestion-item:hover, .suggestion-item.selected {
  background-color: coral;
  color: white;
}

.suggestion-item:last-child {
  border-radius: 0 0 5px 5px;
}
```

### Tip

- `.suggestion-wrapper` → container of the whole element (including input field)
- `.suggestion-list` → container of the dropdown list
- `.suggestion-item` → one item of the list
- `.selected` → item currently highlighted with keyboard navigation

---

<h2 id="keyboard-navigation">⌨️ Keyboard Navigation</h2>

**Arrow Up / Down:** Move selection in the suggestion list

**Enter:** Select highlighted suggestion or execute submitFunction if none selected

---

<h2 id="license">📜 License</h2>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

[⬆ Back to Top](#suggestify)
