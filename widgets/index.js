import WeatherWidget from './weather/WeatherWidget.js';
import UnitConverter from './unit-converter/UnitConverter.js';
import ColorConverter from './color-converter/ColorConverter.js';
import PasswordGenerator from './password/PasswordGenerator.js';
import TimeZoneConverter from './time-converter/TimeZoneConverter.js';

export const widgets = {
    weather: {
        name: 'Weather',
        component: WeatherWidget
    },
    unitConverter: {
        name: 'Unit Converter',
        component: UnitConverter
    },
    colorConverter: {
        name: 'Color Converter',
        component: ColorConverter
    },
    passwordGenerator: {
        name: 'Password Generator',
        component: PasswordGenerator
    },
    timezoneConverter: {
        name: 'Time Zone Converter',
        component: TimeZoneConverter
    }
};