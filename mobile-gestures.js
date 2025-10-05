/**
 * Mobile Gestures Enhancement
 * 移动端手势交互增强系统
 */

class MobileGestures {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.longPressTimeout = null;
        this.longPressDuration = 500;
        this.init();
    }

    init() {
        this.setupSwipeNavigation();
        this.setupPullToRefresh();
        this.setupLongPress();
        this.setupDoubleTap();
        this.setupEntrySwipe();
        this.setupHapticFeedback();
    }

    // 页面滑动切换
    setupSwipeNavigation() {
        const sections = ['dashboard', 'tracker', 'analytics', 'insights', 'wellness'];
        let currentIndex = 0;

        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            
            const diffX = this.touchStartX - this.touchEndX;
            const diffY = Math.abs(this.touchStartY - this.touchEndY);
            
            // 确保是水平滑动
            if (Math.abs(diffX) > this.minSwipeDistance && diffY < 100) {
                if (diffX > 0 && currentIndex < sections.length - 1) {
                    // 向左滑 - 下一页
                    currentIndex++;
                    this.navigateToSection(sections[currentIndex]);
                } else if (diffX < 0 && currentIndex > 0) {
                    // 向右滑 - 上一页
                    currentIndex--;
                    this.navigateToSection(sections[currentIndex]);
                }
            }
        }, { passive: true });

        // 同步导航按钮状态
        document.querySelectorAll('.mobile-nav-item, .nav-link').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                currentIndex = sections.indexOf(section);
            });
        });
    }

    navigateToSection(sectionId) {
        // 触发震动反馈
        this.vibrate(10);

        // 切换section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');

        // 更新导航状态
        document.querySelectorAll('.mobile-nav-item, .nav-link').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // 添加过渡动画
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.animation = 'none';
            setTimeout(() => {
                section.style.animation = 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);
        }
    }

    // 下拉刷新
    setupPullToRefresh() {
        let startY = 0;
        let pulling = false;
        const threshold = 80;
        const indicator = document.getElementById('pullToRefresh');

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                pulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;

            const currentY = e.touches[0].pageY;
            const distance = currentY - startY;

            if (distance > 0 && distance < threshold * 2) {
                e.preventDefault();
                const opacity = Math.min(distance / threshold, 1);
                indicator.style.opacity = opacity;
                indicator.style.transform = `translate(-50%, ${Math.min(distance - 100, 20)}px)`;

                if (distance > threshold) {
                    indicator.classList.add('ready');
                    indicator.querySelector('.pull-to-refresh-text').textContent = 'Release to refresh';
                } else {
                    indicator.classList.remove('ready');
                    indicator.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (!pulling) return;

            const distance = event.changedTouches[0].pageY - startY;

            if (distance > threshold) {
                this.triggerRefresh(indicator);
            } else {
                this.resetPullIndicator(indicator);
            }

            pulling = false;
        }, { passive: true });
    }

    triggerRefresh(indicator) {
        indicator.classList.add('refreshing');
        indicator.querySelector('.pull-to-refresh-text').textContent = 'Refreshing...';
        this.vibrate([10, 50, 10]);

        // 模拟刷新
        setTimeout(() => {
            this.resetPullIndicator(indicator);
            this.showToast('✨ Data refreshed!', 'success');
        }, 1500);
    }

    resetPullIndicator(indicator) {
        indicator.classList.remove('ready', 'refreshing');
        indicator.style.opacity = '0';
        indicator.style.transform = 'translate(-50%, -100%)';
        indicator.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
    }

    // 长按功能
    setupLongPress() {
        document.querySelectorAll('.entry-card, .stat-card').forEach(element => {
            element.addEventListener('touchstart', (e) => {
                this.longPressTimeout = setTimeout(() => {
                    this.handleLongPress(element, e);
                }, this.longPressDuration);
            }, { passive: true });

            element.addEventListener('touchend', () => {
                clearTimeout(this.longPressTimeout);
            }, { passive: true });

            element.addEventListener('touchmove', () => {
                clearTimeout(this.longPressTimeout);
            }, { passive: true });
        });
    }

    handleLongPress(element, event) {
        this.vibrate(20);
        element.classList.add('haptic-feedback');
        
        // 显示上下文菜单
        if (element.classList.contains('entry-card')) {
            this.showContextMenu(element, event);
        }

        setTimeout(() => {
            element.classList.remove('haptic-feedback');
        }, 200);
    }

    // 双击功能
    setupDoubleTap() {
        let lastTap = 0;
        
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 300 && tapLength > 0) {
                    this.handleDoubleTap(card);
                    e.preventDefault();
                }
                
                lastTap = currentTime;
            }, { passive: false });
        });
    }

    handleDoubleTap(element) {
        this.vibrate(15);
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'cardPop 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
        
        this.showToast('📊 Card details coming soon!', 'info');
    }

    // Entry卡片滑动删除
    setupEntrySwipe() {
        document.querySelectorAll('.entry-item').forEach(entry => {
            let startX = 0;
            let currentX = 0;
            let isSwiping = false;

            entry.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isSwiping = true;
            }, { passive: true });

            entry.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;
                currentX = e.touches[0].clientX;
                const diff = startX - currentX;

                if (diff > 0 && diff < 150) {
                    entry.style.transform = `translateX(-${diff}px)`;
                    entry.style.opacity = 1 - (diff / 300);
                }
            }, { passive: true });

            entry.addEventListener('touchend', () => {
                const diff = startX - currentX;
                
                if (diff > 100) {
                    // 删除动作
                    entry.style.transform = 'translateX(-100%)';
                    entry.style.opacity = '0';
                    this.vibrate(20);
                    
                    setTimeout(() => {
                        entry.remove();
                        this.showToast('Entry deleted', 'success');
                    }, 300);
                } else {
                    // 恢复
                    entry.style.transform = '';
                    entry.style.opacity = '';
                }
                
                isSwiping = false;
                currentX = 0;
            }, { passive: true });
        });
    }

    // 震动反馈
    setupHapticFeedback() {
        // 为按钮添加触觉反馈
        document.querySelectorAll('button, .mood-btn, .tag-btn, .mobile-nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.vibrate(10);
            }, { passive: true });
        });
    }

    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // Toast 通知
    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 上下文菜单
    showContextMenu(element, event) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <button class="context-menu-item">
                <i class="fas fa-edit"></i>
                <span>Edit</span>
            </button>
            <button class="context-menu-item">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </button>
            <button class="context-menu-item danger">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </button>
        `;

        document.body.appendChild(menu);

        // 定位菜单
        const rect = element.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 10}px`;
        menu.style.left = `${rect.left}px`;

        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }
}

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes cardPop {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes toastSlideOut {
        to {
            transform: translateX(-50%) translateY(-40px);
            opacity: 0;
        }
    }

    .context-menu {
        position: fixed;
        background: linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(10, 10, 10, 0.98));
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 12px;
        padding: 8px;
        z-index: 10000;
        animation: menuSlideIn 0.2s ease;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }

    @keyframes menuSlideIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: transparent;
        border: none;
        color: var(--text-primary);
        width: 100%;
        text-align: left;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
    }

    .context-menu-item:hover {
        background: rgba(0, 255, 136, 0.1);
    }

    .context-menu-item.danger {
        color: #ff5252;
    }

    .context-menu-item.danger:hover {
        background: rgba(255, 82, 82, 0.1);
    }
`;
document.head.appendChild(style);

// 初始化手势系统
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileGestures();
        console.log('✨ Mobile gestures initialized');
    });
}
