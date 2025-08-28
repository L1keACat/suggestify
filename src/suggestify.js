class Suggestify {
    #initialized = false;
    #defaults = {
        allowDuplicates: false,
        allowWhitespace: false,
        arrayInput: false,
        arrayDelimiter: ", ",
        caseSensitive: false,
        fallbackOption: null,
        maxSuggestions: 3,
        postSelectFunction: null,
        selector: 'suggestions',
        submitFunction: null,
        suggestOptions: []
    };
    _options = {};

    #userInput = "";
    #selectionSize = 0;
    #currentSelection = 0;
    #activeTokenIndex = null;
    #isEditingToken = false;
    #insertPosition = 0;

    /*DOM Elements*/
    #targetElement = null;
    #wrapper = null;
    #suggestionList = null;
    #inputField = null;

    #onInput = (e) => { this.#saveUserInput(); this.#showSuggestions(e); }
    #onKeyDown = (e) => this.#keyboardShortcuts(e);
    #onClick = (e) => this.#showSuggestions(e);

    constructor(options) {
        this._options = structuredClone(this.#defaults);
        this.setOptions(this._options, options);
        if (this.#initialized)
            this.#destroy();

        if (!(this.#targetElement = document.getElementById(this._options.selector))) {
            console.error("Suggestions plugin couldn't find an element with the specified ID");
            return this;
        } else if (this.#targetElement.tagName.toLowerCase() === "input") {
            this.#inputField = this.#targetElement;
        } else if (!(this.#inputField = this.#targetElement.getElementsByTagName('input')[0])) {
            console.error("Suggestions plugin couldn't find an input element inside the target element");
            return this;
        }
        if (this.options.arrayInput && this.options.arrayDelimiter === " ") {
            console.error("Array delimiter can't be equal to whitespace character");
            return this;
        }

        this.#buildPlugin();
        this.#initEvents();

        this.#initialized = true;
    }

    get options() {
        return this._options;
    }

    setOptions(defaults, options) {
        if (!options || typeof options !== 'object') return;

        Object.entries(options).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                if (!defaults[key])
                    defaults[key] = {};
                this.setOptions(defaults[key], value);
            } else if (typeof value !== 'undefined') {
                defaults[key] = value;
            }
        });
    }

    #buildPlugin() {
        this.#wrapper = document.createElement('div');
        this.#wrapper.className = 'suggestion-wrapper';
        this.#suggestionList = document.createElement('ul');
        this.#suggestionList.className = 'suggestion-list';
        this.#wrapper.append(this.#suggestionList);
        this.#targetElement.before(this.#wrapper);
        this.#wrapper.prepend(this.#targetElement);
    }

    #initEvents() {
        this.#inputField.addEventListener('input', this.#onInput);
        this.#inputField.addEventListener('keydown', this.#onKeyDown);
        this.#inputField.addEventListener('click', this.#onClick);
        document.addEventListener('click', this.#outsideClickHandler);
    }

    #outsideClickHandler = (event) => {
        if (!this.#wrapper.contains(event.target)) {
            this.#hideSuggestionList();
        }
    }

    #getWord(s, pos) {
        const charPattern = this.options.allowWhitespace ? '[a-zA-Z0-9\\s-_]' : '[a-zA-Z0-9-_]';
        const before = s.slice(0, pos).match(new RegExp(`${charPattern}+$`));
        const after = s.slice(pos).match(new RegExp(`^${charPattern}+`));
        return [(before?.[0] || ''), (after?.[0] || '')].join('');
    }

    #getCurrentWordAndIndex(inputValue, caretPos) {
        const delimiter = this.options.arrayDelimiter.trim();
        const parts = inputValue
            .split(delimiter)
            .map(el => el.trim())
            .filter(s => s !== '');
        const word = this.#getWord(inputValue, caretPos).trim();
        let currentIndex = parts.findLastIndex(el => el === word);

        return {word, index: currentIndex, parts};
    }

    #saveUserInput() {
        this.#userInput = this.#inputField.value;
    }

    #showSuggestions(e) {
        this.#suggestionList.innerHTML = "";
        this.#currentSelection = 0;
        this.#selectionSize = 0;
        this.#resetSelectedChildrenState();

        let {word: currentWord, index: currentIndex, parts: insertedTags} =
            this.#getCurrentWordAndIndex(this.#inputField.value, this.#inputField.selectionStart);
        this.#activeTokenIndex = currentIndex;

        this.#isEditingToken = true;

        if (!this.options.allowWhitespace) {
            if (this.#activeTokenIndex === -1) {
                this.#activeTokenIndex = insertedTags.findIndex(el => el.includes(' '));
                if (this.#activeTokenIndex !== -1) {
                    this.#insertPosition = insertedTags[this.#activeTokenIndex].split(' ').findIndex(el => el === currentWord);
                    insertedTags[this.#activeTokenIndex] = insertedTags[this.#activeTokenIndex].split(' ')[this.#insertPosition ? 0 : 1];
                    this.#isEditingToken = false;
                }
            }
        }
        insertedTags = insertedTags.filter((tag, idx) => !(tag === currentWord && idx === currentIndex) && tag !== "");

        if (currentWord !== '') {
            this.#showSuggestionList();

            let filteredTags = this.options.suggestOptions
                .filter(tag => this.options.caseSensitive
                    ? tag.startsWith(currentWord)
                    : tag.toLowerCase().startsWith(currentWord.toLowerCase()));

            if (!this.options.allowDuplicates) {
                filteredTags = filteredTags.filter(tag => !insertedTags.includes(tag));
            }

            filteredTags = filteredTags.slice(0, this.options.maxSuggestions);

            if (filteredTags.length !== 0) {
                this.#selectionSize = filteredTags.length;
                filteredTags.forEach(tag => {
                    let listItem = document.createElement("li");
                    listItem.classList.add('suggestion-item');
                    let suggestedTag = "<b>" + tag.substring(0, currentWord.length) + "</b>";
                    suggestedTag += tag.substring(currentWord.length);
                    listItem.addEventListener('click', (event) => {
                        this.#selectSuggestion(tag);
                        event.stopPropagation();
                    });
                    listItem.innerHTML = suggestedTag;
                    this.#suggestionList.append(listItem);
                });
                this.#currentSelection = 1;
                this.#handleSelection();
            } else {
                this.#hideSuggestionList();
            }
        } else {
            this.#hideSuggestionList();
        }
    }

    #handleSelection(event) {
        this.#resetSelectedChildrenState();
        if (this.#currentSelection === -1 && this.options.fallbackOption) {
            this.#inputField.value = this.options.fallbackOption;
            this.#hideSuggestionList();
        } else if (this.#currentSelection === 0) {
            this.#inputField.value = this.#userInput;
            this.#showSuggestionList();
        } else {
            if (this.#suggestionList.children.length > 0) {
                this.#suggestionList.children[this.#currentSelection - 1].classList.add('selected');
            }
        }
    }

    #showSuggestionList() {
        this.#suggestionList.classList.add('visible');
    }

    #hideSuggestionList() {
        this.#resetSelectedChildrenState();
        this.#suggestionList.classList.remove('visible');
    }

    #resetSelectedChildrenState() {
        for (const child of this.#suggestionList.children) {
            child.classList.remove("selected");
        }
    }

    #selectSuggestion(tag) {
        const {parts: insertedTags} = this.#getCurrentWordAndIndex(
            this.#inputField.value,
            this.#inputField.selectionStart
        );

        if (this.#activeTokenIndex !== -1) {
            if (this.#isEditingToken) {
                insertedTags[this.#activeTokenIndex] = tag;
            } else {
                insertedTags[this.#activeTokenIndex] = insertedTags[this.#activeTokenIndex].split(' ')[this.#insertPosition ? 0 : 1];
                insertedTags.splice(this.#activeTokenIndex + this.#insertPosition, 0, tag);
            }
        } else {
            insertedTags.push(tag);
        }

        this.#inputField.value = insertedTags.join(this.options.arrayDelimiter);
        this.#currentSelection = 0;
        this.#hideSuggestionList();

        if (this.options.postSelectFunction != null) {
            this.options.postSelectFunction(tag);
        }

        if (this.options.arrayInput) {
            this.#inputField.value += this.options.arrayDelimiter;
        }

        this.#userInput = this.#inputField.value;
        this.#inputField.focus();

        this.#inputField.scrollLeft = this.#inputField.scrollWidth;
    }

    #keyboardShortcuts(event) {
        const {key} = event;
        switch (key) {
            case 'ArrowUp':
                event.preventDefault();
                if (this.#currentSelection > (this.options.fallbackOption === null ? 0 : -1)) this.#currentSelection--;
                this.#handleSelection(event);
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (this.#currentSelection < this.#selectionSize) this.#currentSelection++;
                this.#handleSelection(event);
                break;
            case 'Enter':
                event.preventDefault();
                const selectedEl = document.getElementsByClassName("selected")[0];
                if (selectedEl) {
                    selectedEl.click();
                } else {
                    if (this.options.submitFunction != null) {
                        this.options.submitFunction();
                    }
                }
                break;
        }
    }

    #destroy() {
        alert('Destroy suggestion plugin with selector #' + this.options.selector);
        this.#inputField.removeEventListener('input', this.#onInput);
        this.#inputField.removeEventListener('keydown', this.#onKeyDown);
        this.#inputField.removeEventListener('click', this.#onClick);
        document.removeEventListener('click', this.#outsideClickHandler);

        if (this.#wrapper && this.#wrapper.parentNode) {
            this.#wrapper.replaceWith(this.#targetElement);
        }

        this.#suggestionList = null;
        this.#wrapper = null;
        this.#inputField = null;
        this.#userInput = "";
        this.#selectionSize = 0;
        this.#currentSelection = 0;
        this.#activeTokenIndex = null;
        this.#isEditingToken = false;
        this.#insertPosition = 0;

        this.#initialized = false;
    }
}