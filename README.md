# Suggestify

_Smarter Input, Faster Typing_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=white&labelColor=gray)]()
[![GitHub stars](https://img.shields.io/github/stars/l1keacat/suggestify?style=social)]()

A lightweight, flexible JavaScript plugin for input suggestions/autocomplete.  
Supports multi-word suggestions, customizable array inputs, keyboard navigation, and optional callbacks.

---

## 📖 Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage Example](#usage-example)
- [Plugin Parameters](#plugin-parameters)
- [Keyboard Navigation](#keyboard-navigation)
- [License](#license)

---

<h2 id="demo">🌐 Demo</h2>

Try the live demo using GitHub Pages:  
[Demo Link](https://l1keacat.github.io/suggestify/)

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

<h2 id="installation">📦 Installation</h2>

Include the plugin JS file in your project:

```html
<script src="suggestify.js"></script>
```

---

<h2 id="usage-example">⚡ Usage Example</h2>

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
    postSelectFunction: (tag) => console.log("Selected:", tag),
    submitFunction: () => console.log("Enter pressed"),
    fallbackOption: null
  });
</script>
```

---

<h2 id="plugin-parameters">📝 Plugin Parameters</h2>

| Option Name          | Type        | Default         | Description                                                                                   |
| -------------------- | ----------- | --------------- | --------------------------------------------------------------------------------------------- |
| `selector`           | string      | `"suggestions"` | ID of the input element or container element with input inside.                               |
| `suggestOptions`     | array       | `[]`            | Array of strings that will be suggested while typing.                                         |
| `arrayInput`         | boolean     | `false`         | If `true`, input can accept multiple entries separated by `arrayDelimiter`.                   |
| `arrayDelimiter`     | string      | `", "`          | Delimiter used when `arrayInput` is `true`. Must not be a whitespace character.               |
| `allowWhitespace`    | boolean     | `false`         | Allows suggestions containing whitespace characters.                                          |
| `allowDuplicates`    | boolean     | `false`         | If `false`, prevents suggesting or inserting duplicate entries.                               |
| `caseSensitive`      | boolean     | `false`         | If `true`, suggestion matching respects case.                                                 |
| `fallbackOption`     | string/null | `null`          | Value to insert if user navigates out of suggestions (optional).                              |
| `postSelectFunction` | function    | `null`          | Callback function executed after a suggestion is selected. Receives selected tag as argument. |
| `submitFunction`     | function    | `null`          | Callback executed when Enter is pressed without selecting a suggestion.                       |

---

<h2 id="keyboard-navigation">⌨️ Keyboard Navigation</h2>

**Arrow Up / Down:** Move selection in the suggestion list

**Enter:** Select highlighted suggestion or execute submitFunction if none selected

---

<h2 id="license">📜 License</h2>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

[⬆ Back to Top](#suggestify)