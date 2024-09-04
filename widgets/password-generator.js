document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const copyButton = document.getElementById('copy-password');
    const generateButton = document.getElementById('generate');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Random password options
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');

    // Memorable password options
    const wordCountInput = document.getElementById('word-count');
    const separatorSelect = document.getElementById('separator');
    const capitalizeCheckbox = document.getElementById('capitalize');
    const includeNumberCheckbox = document.getElementById('include-number');

    // Sample word list (you should use a more comprehensive list)
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yuzu', 'zucchini'];

    function generateRandomPassword() {
        const length = parseInt(lengthInput.value);
        const useUppercase = uppercaseCheckbox.checked;
        const useLowercase = lowercaseCheckbox.checked;
        const useNumbers = numbersCheckbox.checked;
        const useSymbols = symbolsCheckbox.checked;

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

    function generateMemorablePassword() {
        const wordCount = parseInt(wordCountInput.value);
        const separator = separatorSelect.value;
        const capitalize = capitalizeCheckbox.checked;
        const includeNumber = includeNumberCheckbox.checked;

        let password = [];
        for (let i = 0; i < wordCount; i++) {
            let word = words[Math.floor(Math.random() * words.length)];
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

    function generatePassword() {
        const activeTab = document.querySelector('.tab-button.active').dataset.tab;
        let password = '';

        if (activeTab === 'random') {
            password = generateRandomPassword();
        } else if (activeTab === 'memorable') {
            password = generateMemorablePassword();
        }

        passwordInput.value = password;
    }

    function copyPassword() {
        passwordInput.select();
        document.execCommand('copy');
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy';
        }, 2000);
    }

    function switchTab(event) {
        const selectedTab = event.target.dataset.tab;
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById(`${selectedTab}-options`).classList.add('active');
        generatePassword();
    }

    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
    tabButtons.forEach(button => button.addEventListener('click', switchTab));

    // Generate a password on page load
    generatePassword();
});