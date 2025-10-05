/**
 * Mobile Performance Optimization
 * 移动端性能优化系统
 */

class MobilePerformance {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupIntersectionObserver();
        this.setupDebounce();
        this.setupResourceHints();
        this.monitorPerformance();
    }

    // 懒加载
    setupLazyLoading() {
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // 图片懒加载
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // 背景图懒加载
                    if (element.dataset.bg) {
                        element.style.backgroundImage = `url(${element.dataset.bg})`;
                        element.removeAttribute('data-bg');
                    }
                    
                    // 组件懒加载
                    if (element.dataset.component) {
                        this.loadComponent(element);
                    }
                    
                    lazyLoadObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.01
        });

        // 观察所有懒加载元素
        document.querySelectorAll('[data-src], [data-bg], [data-component]').forEach(el => {
            lazyLoadObserver.observe(el);
        });
    }

    // 图片优化
    setupImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 添加loading="lazy"
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // 添加占位符
            if (!img.src && !img.dataset.src) {
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23141414" width="400" height="300"/%3E%3C/svg%3E';
            }
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.stat-card, .entry-card, .chart-container').forEach(el => {
            animateOnScroll.observe(el);
        });
    }

    // 防抖优化
    setupDebounce() {
        // 滚动事件防抖
        let scrollTimeout;
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const direction = currentScrollY > lastScrollY ? 'down' : 'up';
                
                // 根据滚动方向隐藏/显示header
                if (window.innerWidth <= 768) {
                    const header = document.querySelector('.header');
                    if (direction === 'down' && currentScrollY > 100) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }
                }
                
                lastScrollY = currentScrollY;
            }, 100);
        }, { passive: true });

        // Resize事件防抖
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        }, { passive: true });
    }

    handleResize() {
        // 重新计算视口单位
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // 更新图表尺寸
        window.dispatchEvent(new Event('resize-charts'));
    }

    // 资源预加载提示
    setupResourceHints() {
        // DNS预解析
        const dnsPrefetch = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com',
            'https://cdn.jsdelivr.net'
        ];

        dnsPrefetch.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = url;
            document.head.appendChild(link);
        });

        // 预连接重要资源
        const preconnect = [
            'https://fonts.gstatic.com'
        ];

        preconnect.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // 性能监控
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // 监控长任务
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration.toFixed(2) + 'ms');
                    }
                }
            });

            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // 某些浏览器不支持
            }

            // 监控资源加载
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 1000) {
                        console.warn('⚠️ Slow resource:', entry.name, entry.duration.toFixed(2) + 'ms');
                    }
                }
            });

            resourceObserver.observe({ entryTypes: ['resource'] });
        }

        // Web Vitals监控
        if ('web-vital' in window) {
            this.measureWebVitals();
        }
    }

    measureWebVitals() {
        // FCP - First Contentful Paint
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('📊 FCP:', entry.startTime.toFixed(2) + 'ms');
            }
        });
        observer.observe({ entryTypes: ['paint'] });

        // LCP - Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📊 LCP:', lastEntry.renderTime.toFixed(2) + 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // 组件懒加载
    async loadComponent(element) {
        const componentName = element.dataset.component;
        element.innerHTML = '<div class="loading-skeleton">Loading...</div>';

        try {
            // 模拟异步加载
            await new Promise(resolve => setTimeout(resolve, 300));
            element.classList.add('component-loaded');
        } catch (error) {
            console.error('Failed to load component:', componentName, error);
        }
    }

    // 网络状态优化
    setupNetworkOptimization() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // 根据网络速度调整资源加载
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('slow-network');
                this.enableLowDataMode();
            }

            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.enableLowDataMode();
                } else {
                    this.disableLowDataMode();
                }
            });
        }
    }

    enableLowDataMode() {
        console.log('🐌 Slow network detected - enabling data saver mode');
        // 禁用动画
        document.body.classList.add('reduce-animations');
        // 降低图片质量
        document.querySelectorAll('img[data-src-low]').forEach(img => {
            img.src = img.dataset.srcLow;
        });
    }

    disableLowDataMode() {
        document.body.classList.remove('slow-network', 'reduce-animations');
    }
}

// 内存管理
class MemoryManager {
    constructor() {
        this.maxEntries = 100;
        this.cleanup();
    }

    cleanup() {
        setInterval(() => {
            // 清理未使用的DOM节点
            const hiddenSections = document.querySelectorAll('.section:not(.active)');
            hiddenSections.forEach(section => {
                const charts = section.querySelectorAll('canvas');
                charts.forEach(chart => {
                    const ctx = chart.getContext('2d');
                    ctx.clearRect(0, 0, chart.width, chart.height);
                });
            });

            // 限制历史记录
            const entries = document.querySelectorAll('.entry-item');
            if (entries.length > this.maxEntries) {
                for (let i = this.maxEntries; i < entries.length; i++) {
                    entries[i].remove();
                }
            }

            console.log('🧹 Memory cleanup completed');
        }, 60000); // 每分钟清理一次
    }
}

// 电池优化
class BatteryOptimization {
    constructor() {
        this.init();
    }

    async init() {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            
            this.checkBatteryStatus(battery);
            
            battery.addEventListener('levelchange', () => {
                this.checkBatteryStatus(battery);
            });

            battery.addEventListener('chargingchange', () => {
                this.checkBatteryStatus(battery);
            });
        }
    }

    checkBatteryStatus(battery) {
        const level = battery.level * 100;
        
        if (level < 20 && !battery.charging) {
            console.log('🔋 Low battery - enabling power save mode');
            this.enablePowerSaveMode();
        } else if (level > 20 || battery.charging) {
            this.disablePowerSaveMode();
        }
    }

    enablePowerSaveMode() {
        document.body.classList.add('power-save-mode');
        // 减少动画
        document.body.style.setProperty('--transition-fast', '0.1s');
        // 降低刷新率
        document.querySelectorAll('.auto-refresh').forEach(el => {
            el.dataset.originalRefresh = el.dataset.refresh;
            el.dataset.refresh = '60000'; // 1分钟
        });
    }

    disablePowerSaveMode() {
        document.body.classList.remove('power-save-mode');
        document.body.style.removeProperty('--transition-fast');
        document.querySelectorAll('.auto-refresh').forEach(el => {
            if (el.dataset.originalRefresh) {
                el.dataset.refresh = el.dataset.originalRefresh;
            }
        });
    }
}

// 初始化所有优化
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        new MobilePerformance();
        new MemoryManager();
        new BatteryOptimization();
        console.log('⚡ Mobile performance optimizations activated');
    });
}

// 添加CSS优化类
const perfStyle = document.createElement('style');
perfStyle.textContent = `
    .reduce-animations * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }

    .power-save-mode .mobile-nav-item.active i {
        animation: none !important;
    }

    .slow-network img {
        filter: grayscale(50%);
    }

    .component-loaded {
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .header {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(perfStyle);
