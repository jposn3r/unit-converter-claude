import WeatherWidget from './weather/WeatherWidget.js';
import PasswordGenerator from './password/PasswordGenerator.js';
import UnitConverter from './unit-converter/UnitConverter.js';
import ColorConverter from './color-converter/ColorConverter.js';

export const widgets = {
    weather: {
        name: 'Weather',
        component: WeatherWidget
    },
    passwordGenerator: {
        name: 'Password Generator',
        component: PasswordGenerator
    },
    unitConverter: {
        name: 'Unit Converter',
        component: UnitConverter
    },
    colorConverter: {
        name: 'Color Converter',
        component: ColorConverter
    }
};