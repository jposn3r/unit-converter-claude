export default class PasswordGenerator {
    constructor(container) {
        this.container = container;
        this.words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yuzu', 'zucchini'];
    }

    async mount() {
        this.container.innerHTML = `
            <div id="password-generator">
                <h2>Password Generator</h2>
                <div class="password-display">
                    <input type="text" id="password" readonly>
                    <button id="copy-password">Copy</button>
                </div>
                <div class="tabs">
                    <button class="tab-button active" data-tab="random">Random</button>
                    <button class="tab-button" data-tab="memorable">Memorable</button>
                </div>
                <div id="random-options" class="tab-content active">
                    <div class="options">
                        <div class="option">
                            <label for="length">Password length</label>
                            <input type="number" id="length" min="4" max="50" value="20">
                        </div>
                        <div class="option">
                            <label for="uppercase">Include Uppercase</label>
                            <input type="checkbox" id="uppercase" checked>
                        </div>
                        <div class="option">
                            <label for="lowercase">Include Lowercase</label>
                            <input type="checkbox" id="lowercase" checked>
                        </div>
                        <div class="option">
                            <label for="numbers">Include Numbers</label>
                            <input type="checkbox" id="numbers" checked>
                        </div>
                        <div class="option">
                            <label for="symbols">Include Symbols</label>
                            <input type="checkbox" id="symbols" checked>
                        </div>
                    </div>
                </div>
                <div id="memorable-options" class="tab-content">
                    <div class="options">
                        <div class="option">
                            <label for="word-count">Number of Words</label>
                            <input type="number" id="word-count" min="3" max="8" value="4">
                        </div>
                        <div class="option">
                            <label for="separator">Word Separator</label>
                            <select id="separator">
                                <option value="-">Hyphen (-)</option>
                                <option value=".">Period (.)</option>
                                <option value=" ">Space ( )</option>
                                <option value="">None</option>
                            </select>
                        </div>
                        <div class="option">
                            <label for="capitalize">Capitalize Words</label>
                            <input type="checkbox" id="capitalize" checked>
                        </div>
                        <div class="option">
                            <label for="include-number">Include Number</label>
                            <input type="checkbox" id="include-number" checked>
                        </div>
                    </div>
                </div>
                <button id="generate">Generate Password</button>
            </div>
        `;

        this.passwordInput = this.container.querySelector('#password');
        this.copyButton = this.container.querySelector('#copy-password');
        this.generateButton = this.container.querySelector('#generate');
        this.tabButtons = this.container.querySelectorAll('.tab-button');
        this.tabContents = this.container.querySelectorAll('.tab-content');

        this.generateButton.addEventListener('click', () => this.generatePassword());
        this.copyButton.addEventListener('click', () => this.copyPassword());
        this.tabButtons.forEach(button => button.addEventListener('click', (event) => this.switchTab(event)));

        // Generate a password on initial load
        this.generatePassword();
    }

    async unmount() {
        this.generateButton.removeEventListener('click', this.generatePassword);
        this.copyButton.removeEventListener('click', this.copyPassword);
        this.tabButtons.forEach(button => button.removeEventListener('click', this.switchTab));
    }

    generateRandomPassword() {
        const length = parseInt(this.container.querySelector('#length').value);
        const useUppercase = this.container.querySelector('#uppercase').checked;
        const useLowercase = this.container.querySelector('#lowercase').checked;
        const useNumbers = this.container.querySelector('#numbers').checked;
        const useSymbols = this.container.querySelector('#symbols').checked;

        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let chars = '';
        if (useUppercase) chars += uppercaseChars;
        if (useLowercase) chars += lowercaseChars;
        if (useNumbers) chars += numberChars;
        if (useSymbols) chars += symbolChars;

        if (chars === '') {
            alert('Please select at least one character type.');
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }

    generateMemorablePassword() {
        const wordCount = parseInt(this.container.querySelector('#word-count').value);
        const separator = this.container.querySelector('#separator').value;
        const capitalize = this.container.querySelector('#capitalize').checked;
        const includeNumber = this.container.querySelector('#include-number').checked;

        let password = [];
        for (let i = 0; i < wordCount; i++) {
            let word = this.words[Math.floor(Math.random() * this.words.length)];
            if (capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            password.push(word);
        }

        if (includeNumber) {
            const randomNumber = Math.floor(Math.random() * 100);
            password.push(randomNumber);
        }

        return password.join(separator);
    }

    generatePassword() {
        const activeTab = this.container.querySelector('.tab-button.active').dataset.tab;
        let password = '';

        if (activeTab === 'random') {
            password = this.generateRandomPassword();
        } else if (activeTab === 'memorable') {
            password = this.generateMemorablePassword();
        }

        this.passwordInput.value = password;
    }

    copyPassword() {
        this.passwordInput.select();
        document.execCommand('copy');
        this.copyButton.textContent = 'Copied!';
        setTimeout(() => {
            this.copyButton.textContent = 'Copy';
        }, 2000);
    }

    switchTab(event) {
        const selectedTab = event.target.dataset.tab;
        this.tabButtons.forEach(button => button.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        event.target.classList.add('active');
        this.container.querySelector(`#${selectedTab}-options`).classList.add('active');
        this.generatePassword();
    }
}