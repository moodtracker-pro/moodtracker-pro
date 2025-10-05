/**
 * Mobile Theme Switcher
 * 移动端主题切换系统
 */

class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        if (window.innerWidth <= 768) {
            this.createThemeButton();
            this.createThemePanel();
            this.applyTheme(this.currentTheme);
            this.setupEventListeners();
        }
    }

    createThemeButton() {
        const button = document.createElement('button');
        button.className = 'mobile-theme-toggle';
        button.id = 'mobileThemeToggle';
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.setAttribute('aria-label', 'Toggle theme');
        document.body.appendChild(button);
    }

    createThemePanel() {
        const panel = document.createElement('div');
        panel.className = 'theme-selector-panel';
        panel.id = 'themeSelectorPanel';
        panel.innerHTML = `
            <button class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                <i class="fas fa-moon"></i>
                <span>Dark Mode</span>
            </button>
            <button class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                <i class="fas fa-sun"></i>
                <span>Light Mode</span>
            </button>
            <button class="theme-option ${this.currentTheme === 'auto' ? 'active' : ''}" data-theme="auto">
                <i class="fas fa-adjust"></i>
                <span>Auto</span>
            </button>
            <div class="theme-preview">
                <div class="theme-preview-dot dark"></div>
                <div class="theme-preview-dot light"></div>
                <div class="theme-preview-dot accent"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('mobileThemeToggle');
        const panel = document.getElementById('themeSelectorPanel');
        
        // 切换面板显示
        toggleBtn?.addEventListener('click', () => {
            panel?.classList.toggle('active');
            this.vibrate(10);
        });

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!toggleBtn?.contains(e.target) && !panel?.contains(e.target)) {
                panel?.classList.remove('active');
            }
        });

        // 主题选项点击
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                panel?.classList.remove('active');
            });
        });
    }

    switchTheme(theme) {
        // 触发切换动画
        document.body.classList.add('theme-transitioning');
        this.vibrate(15);

        // 延迟应用主题，让动画先播放
        setTimeout(() => {
            this.applyTheme(theme);
            this.currentTheme = theme;
            localStorage.setItem('theme', theme);

            // 更新按钮状态
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
                if (opt.dataset.theme === theme) {
                    opt.classList.add('active');
                }
            });

            // 更新图标
            this.updateThemeIcon(theme);

            // 显示保存提示
            this.showSavedIndicator();

            // 移除动画类
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 600);
        }, 100);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'auto') {
            // 自动模式：根据系统偏好
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        } else {
            html.setAttribute('data-theme', theme);
        }

        // 更新meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'light' ? '#f8f9fa' : '#00ff88');
        }
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#mobileThemeToggle i');
        if (!icon) return;

        const icons = {
            dark: 'fa-moon',
            light: 'fa-sun',
            auto: 'fa-adjust'
        };

        icon.className = `fas ${icons[theme]}`;
    }

    showSavedIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'theme-saved-indicator';
        indicator.innerHTML = '<i class="fas fa-check"></i> Theme saved';
        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }

    vibrate(duration) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
}

// 初始化主题切换器
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeSwitcher();
        console.log('🎨 Theme switcher initialized');
    });
}
