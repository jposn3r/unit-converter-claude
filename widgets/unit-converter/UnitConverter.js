export default class UnitConverter {
    constructor(container) {
        this.container = container;
        this.unitData = {
            length: {
                units: ['meters', 'feet', 'inches', 'centimeters'],
                conversions: {
                    meters: { feet: 3.28084, inches: 39.3701, centimeters: 100 },
                    feet: { meters: 0.3048, inches: 12, centimeters: 30.48 },
                    inches: { meters: 0.0254, feet: 0.0833333, centimeters: 2.54 },
                    centimeters: { meters: 0.01, feet: 0.0328084, inches: 0.393701 }
                }
            },
            weight: {
                units: ['kilograms', 'pounds', 'ounces', 'grams'],
                conversions: {
                    kilograms: { pounds: 2.20462, ounces: 35.274, grams: 1000 },
                    pounds: { kilograms: 0.453592, ounces: 16, grams: 453.592 },
                    ounces: { kilograms: 0.0283495, pounds: 0.0625, grams: 28.3495 },
                    grams: { kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274 }
                }
            },
            temperature: {
                units: ['Celsius', 'Fahrenheit', 'Kelvin'],
                conversions: {
                    Celsius: {
                        Fahrenheit: (c) => c * 9/5 + 32,
                        Kelvin: (c) => c + 273.15
                    },
                    Fahrenheit: {
                        Celsius: (f) => (f - 32) * 5/9,
                        Kelvin: (f) => (f - 32) * 5/9 + 273.15
                    },
                    Kelvin: {
                        Celsius: (k) => k - 273.15,
                        Fahrenheit: (k) => (k - 273.15) * 9/5 + 32
                    }
                }
            },
            time: {
                units: ['seconds', 'minutes', 'hours', 'days'],
                conversions: {
                    seconds: { minutes: 1/60, hours: 1/3600, days: 1/86400 },
                    minutes: { seconds: 60, hours: 1/60, days: 1/1440 },
                    hours: { seconds: 3600, minutes: 60, days: 1/24 },
                    days: { seconds: 86400, minutes: 1440, hours: 24 }
                }
            },
            speed: {
                units: ['m/s', 'km/h', 'mph', 'knots'],
                conversions: {
                    'm/s': { 'km/h': 3.6, 'mph': 2.23694, 'knots': 1.94384 },
                    'km/h': { 'm/s': 1/3.6, 'mph': 0.621371, 'knots': 0.539957 },
                    'mph': { 'm/s': 0.44704, 'km/h': 1.60934, 'knots': 0.868976 },
                    'knots': { 'm/s': 0.514444, 'km/h': 1.852, 'mph': 1.15078 }
                }
            }
        };
        this.conversionIcons = {
            length: '📏',
            weight: '⚖️',
            temperature: '🌡️',
            time: '⏱️',
            speed: '🚀'
        };
        this.MAX_HISTORY_ITEMS = 10;
        this.conversionHistory = [];
    }

    async mount() {
        this.container.innerHTML = `
            <div class="widget-card" id="unit-converter">
                <h2>Unit Converter</h2>
                <div class="converter-content">
                    <select id="unitType">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="temperature">Temperature</option>
                        <option value="time">Time</option>
                        <option value="speed">Speed</option>
                    </select>
                    <div class="conversion-inputs">
                        <input type="number" id="inputValue" placeholder="Enter value">
                        <select id="fromUnit"></select>
                        <select id="toUnit"></select>
                    </div>
                    <button id="convertButton">Convert</button>
                    <div id="result-container">
                        <div id="result"></div>
                        <button id="copy-button" class="copy-button" title="Copy result">Copy</button>
                    </div>
                </div>
                <div id="conversion-history">
                    <h3>Conversion History</h3>
                    <ul id="history-list"></ul>
                </div>
            </div>
        `;

        this.unitTypeSelect = this.container.querySelector('#unitType');
        this.fromUnitSelect = this.container.querySelector('#fromUnit');
        this.toUnitSelect = this.container.querySelector('#toUnit');
        this.inputValue = this.container.querySelector('#inputValue');
        this.convertButton = this.container.querySelector('#convertButton');
        this.resultElement = this.container.querySelector('#result');
        this.copyButton = this.container.querySelector('#copy-button');
        this.historyList = this.container.querySelector('#history-list');

        this.unitTypeSelect.addEventListener('change', () => this.populateUnitSelects());
        this.convertButton.addEventListener('click', () => this.convert());
        this.copyButton.addEventListener('click', () => this.copyToClipboard());

        this.populateUnitSelects();
    }

    async unmount() {
        // Remove event listeners
        this.unitTypeSelect.removeEventListener('change', this.populateUnitSelects);
        this.convertButton.removeEventListener('click', this.convert);
        this.copyButton.removeEventListener('click', this.copyToClipboard);
    }

    populateUnitSelects() {
        const unitType = this.unitTypeSelect.value;
        const units = this.unitData[unitType].units;

        this.fromUnitSelect.innerHTML = '';
        this.toUnitSelect.innerHTML = '';

        units.forEach(unit => {
            this.fromUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
            this.toUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        });

        // Set default 'to' unit to be different from 'from' unit
        if (units.length > 1) {
            this.toUnitSelect.selectedIndex = 1;
        }
    }

    convert(shouldAddToHistory = true) {
        const unitType = this.unitTypeSelect.value;
        const fromValue = parseFloat(this.inputValue.value);
        const fromUnit = this.fromUnitSelect.value;
        const toUnit = this.toUnitSelect.value;
        let result;

        if (isNaN(fromValue)) {
            this.resultElement.textContent = 'Please enter a valid number';
            return;
        }

        if (unitType === 'temperature') {
            if (fromUnit === toUnit) {
                result = fromValue;
            } else {
                result = this.unitData[unitType].conversions[fromUnit][toUnit](fromValue);
            }
        } else {
            if (fromUnit === toUnit) {
                result = fromValue;
            } else {
                result = fromValue * this.unitData[unitType].conversions[fromUnit][toUnit];
            }
        }

        const resultText = `${fromValue} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;
        this.resultElement.textContent = resultText;
        this.copyButton.style.display = 'inline-flex';

        if (shouldAddToHistory) {
            const lastConversion = this.conversionHistory[0];
            const isSameCalculation = lastConversion &&
                Math.abs(parseFloat(lastConversion.fromValue) - fromValue) < 1e-10 &&
                lastConversion.fromUnit === fromUnit &&
                lastConversion.toUnit === toUnit &&
                lastConversion.unitType === unitType;

            if (!isSameCalculation) {
                this.addToHistory(fromValue, fromUnit, result.toFixed(2), toUnit, unitType);
            }
        }
    }

    addToHistory(fromValue, fromUnit, toValue, toUnit, unitType) {
        const historyItem = { fromValue, fromUnit, toValue, toUnit, unitType };
        this.conversionHistory.unshift(historyItem);
        if (this.conversionHistory.length > this.MAX_HISTORY_ITEMS) {
            this.conversionHistory.pop();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.conversionHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${this.conversionIcons[item.unitType]} ${item.fromValue} ${item.fromUnit} = ${item.toValue} ${item.toUnit}`;
            li.addEventListener('click', () => this.recallConversion(index));
            this.historyList.appendChild(li);
        });
    }

    recallConversion(index) {
        const item = this.conversionHistory[index];
        this.unitTypeSelect.value = item.unitType;
        this.populateUnitSelects();
        this.fromUnitSelect.value = item.fromUnit;
        this.toUnitSelect.value = item.toUnit;
        this.inputValue.value = item.fromValue;
        this.convert(false);
    }

    copyToClipboard() {
        const resultText = this.resultElement.textContent;
        const match = resultText.match(/=\s*([\d.]+)/);
        
        if (match && match[1]) {
            const numericalValue = match[1];
            navigator.clipboard.writeText(numericalValue).then(() => {
                const originalText = this.copyButton.textContent;
                this.copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    this.copyButton.textContent = originalText;
                }, 1500);
            }).catch((err) => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            console.error('No numerical value found in the result');
        }
    }
}