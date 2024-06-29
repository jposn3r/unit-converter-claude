(function () {
    // Create widget HTML
    var widgetHTML = `
        <div class="unit-converter">
            <h2>Unit Converter</h2>
            <select id="unitType">
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
            </select>
            <input type="number" id="inputValue" placeholder="Enter value">
            <select id="fromUnit"></select>
            <select id="toUnit"></select>
            <button onclick="unitConverterWidget.convert()">Convert</button>
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
    `;

    // Inject widget HTML
    var targetElement = document.getElementById('unit-converter-widget');
    if (targetElement) {
        targetElement.innerHTML = widgetHTML;
    }

    // Add widget styles
    var styleElement = document.createElement('style');
    styleElement.textContent = `
        .unit-converter {
            font-family: Arial, sans-serif;
            max-width: 300px;
            margin: 0 auto;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .unit-converter select, .unit-converter input {
            width: 100%;
            padding: 5px;
            margin: 5px 0;
        }
        .unit-converter button {
            width: 100%;
            padding: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .unit-converter button:hover {
            background-color: #0056b3;
        }
        #result-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 10px;
        }
        #result-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            text-align: center;
        }
        #result {
            display: inline-block;
            margin: 0;
            padding-right: 5px;
        }
        .copy-button {
            display: none;
            align-items: center;
            justify-content: center;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: background-color 0.3s;
            padding: 4px;
            margin-left: 5px;
            max-width: 25px;
        }
        .copy-button:hover {
            background-color: #0056b3;
        }
        .copy-button svg {
            width: 16px;
            height: 16px;
        }
        .check-icon {
            display: none;
        }
    `;
    document.head.appendChild(styleElement);

    // Unit conversion logic
    var unitData = {
        // ... (same as in the original script)
    };

    function populateUnitSelects() {
        // ... (same as in the original script)
    }

    document.getElementById('unitType').addEventListener('change', populateUnitSelects);
    populateUnitSelects();

    // Expose the convert function to the global scope
    window.unitConverterWidget = {
        convert: function () {
            // ... (same as in the original script)
        }
    };
})();