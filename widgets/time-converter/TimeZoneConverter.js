export default class TimeZoneConverter {
    constructor(container) {
        this.container = container;
        this.commonTimezones = [
            'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
            'Europe/London', 'Europe/Berlin', 'Europe/Moscow', 'Asia/Tokyo', 'Asia/Shanghai',
            'Australia/Sydney', 'Pacific/Auckland'
        ];
    }

    async mount() {
        this.container.innerHTML = `
            <div class="widget-card" id="timezone-converter">
                <h2>Time Zone Converter</h2>
                <div class="converter-content">
                    <div class="input-group">
                        <input type="datetime-local" id="source-time" required>
                        <select id="source-timezone"></select>
                    </div>
                    <div class="input-group">
                        <input type="text" id="converted-time" readonly>
                        <select id="target-timezone"></select>
                    </div>
                    <button id="convert-button">Convert</button>
                </div>
            </div>
        `;

        this.sourceTime = this.container.querySelector('#source-time');
        this.sourceTimezone = this.container.querySelector('#source-timezone');
        this.convertedTime = this.container.querySelector('#converted-time');
        this.targetTimezone = this.container.querySelector('#target-timezone');
        this.convertButton = this.container.querySelector('#convert-button');

        this.populateTimezones();
        this.setDefaultTime();

        this.convertButton.addEventListener('click', () => this.convertTime());
    }

    async unmount() {
        this.convertButton.removeEventListener('click', this.convertTime);
    }

    populateTimezones() {
        [this.sourceTimezone, this.targetTimezone].forEach(select => {
            this.commonTimezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone.replace('_', ' ');
                select.appendChild(option);
            });
        });

        // Set default timezones
        this.sourceTimezone.value = this.getLocalTimezone();
        this.targetTimezone.value = 'UTC';
    }

    getLocalTimezone() {
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return this.commonTimezones.includes(localTimezone) ? localTimezone : 'UTC';
    }

    setDefaultTime() {
        const now = new Date();
        this.sourceTime.value = now.toISOString().slice(0, 16);
    }

    convertTime() {
        const sourceTime = new Date(this.sourceTime.value);
        const sourceTimezone = this.sourceTimezone.value;
        const targetTimezone = this.targetTimezone.value;

        if (isNaN(sourceTime.getTime())) {
            alert('Please enter a valid date and time.');
            return;
        }

        try {
            const convertedTime = new Date(sourceTime.toLocaleString('en-US', {timeZone: targetTimezone}));
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                timeZoneName: 'short' 
            };

            this.convertedTime.value = convertedTime.toLocaleString('en-US', {...options, timeZone: targetTimezone});
        } catch (error) {
            console.error('Error converting time:', error);
            this.convertedTime.value = 'Error converting time';
        }
    }
}