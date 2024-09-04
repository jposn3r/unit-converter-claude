export default class ColorConverter {
    constructor(container) {
        this.container = container;
    }

    async mount() {
        this.container.innerHTML = `
            <div id="color-converter">
                <h2>Color Converter</h2>
                <div class="color-input">
                    <label for="colorPicker">Choose a color:</label>
                    <input type="color" id="colorPicker" value="#000000">
                </div>
                <div class="color-output">
                    <label for="hex">HEX:</label>
                    <input type="text" id="hex" readonly>
                </div>
                <div class="color-output">
                    <label for="rgb">RGB:</label>
                    <input type="text" id="rgb" readonly>
                </div>
                <div class="color-output">
                    <label for="hsl">HSL:</label>
                    <input type="text" id="hsl" readonly>
                </div>
            </div>
        `;

        this.colorPicker = this.container.querySelector('#colorPicker');
        this.hexInput = this.container.querySelector('#hex');
        this.rgbInput = this.container.querySelector('#rgb');
        this.hslInput = this.container.querySelector('#hsl');

        this.colorPicker.addEventListener('input', () => this.updateColor());
        this.updateColor(); // Initial color update
    }

    async unmount() {
        this.colorPicker.removeEventListener('input', this.updateColor);
    }

    updateColor() {
        const color = this.colorPicker.value;
        this.hexInput.value = color;

        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);

        this.rgbInput.value = `rgb(${r}, ${g}, ${b})`;

        const hsl = this.rgbToHsl(r, g, b);
        this.hslInput.value = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
    }

    rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
}