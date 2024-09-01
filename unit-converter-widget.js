(function () {
    const widgetHTML = `
        <div id="unit-converter">
            <h2>Unit Converter</h2>
            <select id="unitType">
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="time">Time</option>
                <option value="speed">Speed</option>
            </select>
            <input type="number" id="inputValue" placeholder="Enter value">
            <select id="fromUnit"></select>
            <select id="toUnit"></select>
            <button id="convertButton">Convert</button>
            <div id="result-container">
                <span id="result"></span>
                <button id="copy-button" class="copy-button" title="Copy result">
                    <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>
        </div>
        <div id="conversion-history">
            <h3>Recent Conversions</h3>
            <ul id="history-list"></ul>
        </div>
    `;

    const targetElement = document.getElementById('unit-converter-widget');
    if (targetElement) {
        targetElement.innerHTML = widgetHTML;
    }

    const unitData = {
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

    const conversionIcons = {
        length: '📏',
        weight: '⚖️',
        temperature: '🌡️',
        time: '⏱️',
        speed: '🚀'
    };

    const MAX_HISTORY_ITEMS = 10;
    let conversionHistory = [];

    function populateUnitSelects() {
        const unitType = document.getElementById('unitType').value;
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        const inputValue = document.getElementById('inputValue');
        
        inputValue.value = '';
        
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';

        unitData[unitType].units.forEach(function(unit, index) {
            fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        });

        fromUnit.selectedIndex = 0;
        toUnit.selectedIndex = Math.min(1, unitData[unitType].units.length - 1);

        document.getElementById('result').textContent = '';
        document.getElementById('copy-button').style.display = 'none';
    }

    function loadHistory() {
        const savedHistory = localStorage.getItem('conversionHistory');
        if (savedHistory) {
            conversionHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
    }

    function saveHistory() {
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    }

    function addToHistory(fromValue, fromUnit, toValue, toUnit, unitType) {
        conversionHistory.unshift({ fromValue: fromValue.toString(), fromUnit, toValue, toUnit, unitType });
        if (conversionHistory.length > MAX_HISTORY_ITEMS) {
            conversionHistory.pop();
        }
        saveHistory();
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        conversionHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="history-icon">${conversionIcons[item.unitType]}</span>
                <span class="history-text">${item.fromValue} ${item.fromUnit} = ${item.toValue} ${item.toUnit}</span>
            `;
            li.addEventListener('click', () => recallConversion(index));
            historyList.appendChild(li);
        });
    }

    function recallConversion(index) {
        const item = conversionHistory[index];
        document.getElementById('unitType').value = item.unitType;
        populateUnitSelects();
        document.getElementById('fromUnit').value = item.fromUnit;
        document.getElementById('toUnit').value = item.toUnit;
        document.getElementById('inputValue').value = item.fromValue;
        convert(false);
    }

    function convert(shouldAddToHistory = true) {
        const unitType = document.getElementById('unitType').value;
        const fromValue = parseFloat(document.getElementById('inputValue').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        let result;

        if (isNaN(fromValue)) {
            document.getElementById('result').textContent = 'Please enter a valid number';
            return;
        }

        if (unitType === 'temperature') {
            if (fromUnit === toUnit) {
                result = fromValue;
            } else {
                result = unitData[unitType].conversions[fromUnit][toUnit](fromValue);
            }
        } else {
            if (fromUnit === toUnit) {
                result = fromValue;
            } else {
                result = fromValue * unitData[unitType].conversions[fromUnit][toUnit];
            }
        }

        const resultText = `${fromValue} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;
        document.getElementById('result').textContent = resultText;
        document.getElementById('copy-button').style.display = 'inline-flex';

        if (shouldAddToHistory) {
            const lastConversion = conversionHistory[0];
            const isSameCalculation = lastConversion &&
                Math.abs(parseFloat(lastConversion.fromValue) - fromValue) < 1e-10 &&
                lastConversion.fromUnit === fromUnit &&
                lastConversion.toUnit === toUnit &&
                lastConversion.unitType === unitType;

            if (!isSameCalculation) {
                addToHistory(fromValue, fromUnit, result.toFixed(2), toUnit, unitType);
            }
        }
    }

    function initializeCopyToClipboard() {
        const copyButton = document.getElementById('copy-button');
        const resultElement = document.getElementById('result');

        copyButton.addEventListener('click', function() {
            const resultText = resultElement.textContent;
            const match = resultText.match(/=\s*([\d.]+)/);
            
            if (match && match[1]) {
                const numericalValue = match[1];
                navigator.clipboard.writeText(numericalValue).then(function() {
                    showCheckIcon();
                    setTimeout(showCopyIcon, 1500);
                }).catch(function(err) {
                    console.error('Failed to copy text: ', err);
                });
            } else {
                console.error('No numerical value found in the result');
            }
        });
    }

    function showCopyIcon() {
        document.querySelector('.copy-icon').style.display = 'inline';
        document.querySelector('.check-icon').style.display = 'none';
    }

    function showCheckIcon() {
        document.querySelector('.copy-icon').style.display = 'none';
        document.querySelector('.check-icon').style.display = 'inline';
    }

    function initializeWidget() {
        populateUnitSelects();
        document.getElementById('unitType').addEventListener('change', populateUnitSelects);
        document.getElementById('convertButton').addEventListener('click', () => convert(true));
        document.getElementById('inputValue').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                convert(true);
            }
        });
        initializeCopyToClipboard();
        loadHistory();
        updateHistoryDisplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }
})();