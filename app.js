import { widgets } from './widgets/index.js';

class App {
    constructor() {
        this.widgetNav = document.getElementById('widget-nav');
        this.widgetContainer = document.getElementById('widget-container');
        this.menuToggle = document.getElementById('menu-toggle');
        this.currentWidget = null;
    }

    init() {
        this.createNavigation();
        this.loadDefaultWidget();
        this.setupMobileMenu();
    }

    createNavigation() {
        for (const [key, widget] of Object.entries(widgets)) {
            const button = document.createElement('button');
            button.textContent = widget.name;
            button.addEventListener('click', () => {
                this.loadWidget(key);
                if (window.innerWidth <= 768) {
                    this.toggleMobileMenu();
                }
            });
            this.widgetNav.appendChild(button);
        }
    }

    async loadWidget(widgetKey) {
        if (this.currentWidget) {
            await this.currentWidget.unmount();
        }
        this.widgetContainer.innerHTML = '';
        const WidgetClass = widgets[widgetKey].component;
        this.currentWidget = new WidgetClass(this.widgetContainer);
        await this.currentWidget.mount();
    }

    loadDefaultWidget() {
        const defaultWidgetKey = Object.keys(widgets)[0];
        this.loadWidget(defaultWidgetKey);
    }

    setupMobileMenu() {
        this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        this.widgetNav.classList.toggle('open');
    }
}

const app = new App();
app.init();