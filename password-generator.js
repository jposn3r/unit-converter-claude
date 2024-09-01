function generatePassword() {
    const length = document.getElementById('length').value;
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let allowedChars = '';
    if (uppercase) allowedChars += chars.uppercase;
    if (lowercase) allowedChars += chars.lowercase;
    if (numbers) allowedChars += chars.numbers;
    if (symbols) allowedChars += chars.symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }

    document.getElementById('password').value = password;
}

document.getElementById('generate').addEventListener('click', generatePassword);
document.getElementById('copy').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    passwordField.select();
    document.execCommand('copy');
});