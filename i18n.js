// ==================== INTERNATIONALIZATION SYSTEM ====================

const i18n = {
    currentLocale: 'en',
    fallbackLocale: 'en',
    userTimezone: null, // User-selected timezone
    
    // Translation dictionaries
    translations: {
        en: {
            // App Header
            appName: 'MoodTracker Pro',
            appTagline: 'Your Personal Mood & Wellness Journal',
            
            // Navigation
            dashboard: 'Dashboard',
            analytics: 'Analytics',
            insights: 'Insights',
            
            // Buttons
            saveMood: 'Save Mood',
            export: 'Export',
            personal: 'Personal',
            clearData: 'Clear Data',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            close: 'Close',
            edit: 'Edit',
            delete: 'Delete',
            
            // Mood Selection
            selectMood: 'How are you feeling today?',
            quickEntry: 'Quick Entry',
            detailedEntry: 'Detailed Entry',
            
            // Mood Labels
            terrible: 'Terrible',
            bad: 'Bad',
            okay: 'Okay',
            good: 'Good',
            amazing: 'Amazing',
            
            // Note Section
            addNote: 'Add a note (optional)',
            notePlaceholder: 'What\'s on your mind?',
            
            // Tags
            tags: 'Tags',
            selectTags: 'Select tags (optional)',
            work: 'Work',
            family: 'Family',
            friends: 'Friends',
            health: 'Health',
            exercise: 'Exercise',
            sleep: 'Sleep',
            stress: 'Stress',
            relaxation: 'Relaxation',
            achievement: 'Achievement',
            challenge: 'Challenge',
            
            // Stats Cards
            totalEntries: 'Total Entries',
            averageMood: 'Average Mood',
            currentStreak: 'Current Streak',
            longestStreak: 'Longest Streak',
            days: 'days',
            
            // Charts
            weeklyTrend: '7-Day Mood Trend',
            moodDistribution: 'Mood Distribution',
            tagAnalysis: 'Tag Analysis',
            moodHeatmap: 'Mood Heatmap',
            
            // Entries
            recentEntries: 'Recent Entries',
            noEntries: 'No mood entries yet',
            startTracking: 'Start tracking your mood today!',
            
            // Export Options
            csvData: 'CSV Data',
            excelWorkbook: 'Excel Workbook',
            htmlReport: 'HTML Report',
            imageReport: 'Image Report',
            markdown: 'Markdown',
            pdfReport: 'PDF Report',
            wordDocument: 'Word Document',
            print: 'Print',
            
            // Personal Settings
            customMoodScale: 'Custom Mood Scale',
            moodReminders: 'Mood Reminders',
            notificationSettings: 'Notification Settings',
            languageSettings: 'Language Settings',
            
            // Insights
            insightsTitle: 'AI-Powered Insights',
            weeklyPattern: 'Weekly Pattern',
            bestDay: 'Best Day',
            challengingDay: 'Challenging Day',
            mostCommonMood: 'Most Common Mood',
            
            // Wellness Tips
            wellnessTips: 'Wellness Tips',
            
            // Data Actions
            autoCleanup: 'Auto Cleanup',
            confirmClearData: 'Are you sure you want to clear all mood data? This action cannot be undone.',
            
            // Toast Messages
            moodSaved: 'Mood entry saved successfully!',
            moodDeleted: 'Mood entry deleted',
            dataCleared: 'All data cleared',
            exportSuccess: 'Export successful!',
            exportFailed: 'Export failed',
            noDataToExport: 'No data to export',
            csvExported: 'CSV exported successfully!',
            excelExported: 'Excel workbook exported successfully!',
            htmlGenerated: 'HTML report generated successfully!',
            imageExported: 'Image report exported successfully!',
            generatingImage: 'Generating image report...',
            libraryNotLoaded: 'Export library not loaded',
            
            // Date & Time
            today: 'Today',
            yesterday: 'Yesterday',
            daysAgo: '{count} days ago',
            justNow: 'Just now',
            minutesAgo: '{count} minutes ago',
            hoursAgo: '{count} hours ago',
            
            // Day names
            sunday: 'Sunday',
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            
            // Month names
            january: 'January',
            february: 'February',
            march: 'March',
            april: 'April',
            may: 'May',
            june: 'June',
            july: 'July',
            august: 'August',
            september: 'September',
            october: 'October',
            november: 'November',
            december: 'December',
            
            // Misc
            entries: 'entries',
            entry: 'entry',
            of: 'of',
            showing: 'Showing',
            all: 'All',
            
            // AI Assistant
            aiAssistant: 'AI Assistant',
            aiOnline: 'Online',
            aiWelcomeTitle: "Hi! I'm your AI Mood Assistant",
            aiWelcomeDesc: "I'm here to help you understand your emotions and provide personalized wellness suggestions.",
            aiAnalyzeMood: 'Analyze My Mood',
            aiSuggestTags: 'Suggest Tags',
            aiWellnessTip: 'Wellness Tips',
            aiInsights: 'Get Insights',
            aiInputPlaceholder: 'Ask me anything about your mood...',
            aiTyping: 'AI is typing...'
        },
        
        zh: {
            // 应用标题
            appName: '心情追踪专业版',
            appTagline: '您的个人情绪与健康日志',
            
            // 导航
            dashboard: '主页',
            analytics: '分析',
            insights: '洞察',
            
            // 按钮
            saveMood: '保存心情',
            export: '导出',
            personal: '个人',
            clearData: '清除数据',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            close: '关闭',
            edit: '编辑',
            delete: '删除',
            
            // 心情选择
            selectMood: '您今天感觉如何？',
            quickEntry: '快速记录',
            detailedEntry: '详细记录',
            
            // 心情标签
            terrible: '很糟',
            bad: '不好',
            okay: '还行',
            good: '不错',
            amazing: '很棒',
            
            // 笔记部分
            addNote: '添加笔记（可选）',
            notePlaceholder: '有什么想说的吗？',
            
            // 标签
            tags: '标签',
            selectTags: '选择标签（可选）',
            work: '工作',
            family: '家庭',
            friends: '朋友',
            health: '健康',
            exercise: '运动',
            sleep: '睡眠',
            stress: '压力',
            relaxation: '放松',
            achievement: '成就',
            challenge: '挑战',
            
            // 统计卡片
            totalEntries: '总记录数',
            averageMood: '平均心情',
            currentStreak: '当前连续',
            longestStreak: '最长连续',
            days: '天',
            
            // 图表
            weeklyTrend: '7天心情趋势',
            moodDistribution: '心情分布',
            tagAnalysis: '标签分析',
            moodHeatmap: '心情热力图',
            
            // 记录
            recentEntries: '最近记录',
            noEntries: '还没有心情记录',
            startTracking: '今天开始记录你的心情吧！',
            
            // 导出选项
            csvData: 'CSV 数据',
            excelWorkbook: 'Excel 工作簿',
            htmlReport: 'HTML 报告',
            imageReport: '图片报告',
            markdown: 'Markdown',
            pdfReport: 'PDF 报告',
            wordDocument: 'Word 文档',
            print: '打印',
            
            // 个人设置
            customMoodScale: '自定义心情量表',
            moodReminders: '心情提醒',
            notificationSettings: '通知设置',
            languageSettings: '语言设置',
            
            // 洞察
            insightsTitle: 'AI 洞察分析',
            weeklyPattern: '每周规律',
            bestDay: '最佳日子',
            challengingDay: '挑战日子',
            mostCommonMood: '最常见心情',
            
            // 健康建议
            wellnessTips: '健康建议',
            
            // 数据操作
            autoCleanup: '自动清理',
            confirmClearData: '确定要清除所有心情数据吗？此操作无法撤销。',
            
            // 提示消息
            moodSaved: '心情记录保存成功！',
            moodDeleted: '心情记录已删除',
            dataCleared: '所有数据已清除',
            exportSuccess: '导出成功！',
            exportFailed: '导出失败',
            noDataToExport: '没有可导出的数据',
            csvExported: 'CSV 导出成功！',
            excelExported: 'Excel 工作簿导出成功！',
            htmlGenerated: 'HTML 报告生成成功！',
            imageExported: '图片报告导出成功！',
            generatingImage: '正在生成图片报告...',
            libraryNotLoaded: '导出库未加载',
            
            // 日期时间
            today: '今天',
            yesterday: '昨天',
            daysAgo: '{count}天前',
            justNow: '刚刚',
            minutesAgo: '{count}分钟前',
            hoursAgo: '{count}小时前',
            
            // 星期
            sunday: '星期日',
            monday: '星期一',
            tuesday: '星期二',
            wednesday: '星期三',
            thursday: '星期四',
            friday: '星期五',
            saturday: '星期六',
            
            // 月份
            january: '一月',
            february: '二月',
            march: '三月',
            april: '四月',
            may: '五月',
            june: '六月',
            july: '七月',
            august: '八月',
            september: '九月',
            october: '十月',
            november: '十一月',
            december: '十二月',
            
            // 其他
            entries: '条记录',
            entry: '条记录',
            of: '共',
            showing: '显示',
            all: '全部',
            
            // AI助手
            aiAssistant: 'AI助手',
            aiOnline: '在线',
            aiWelcomeTitle: '你好！我是你的AI心情助手',
            aiWelcomeDesc: '我在这里帮助你理解情绪，并提供个性化的健康建议。',
            aiAnalyzeMood: '分析我的心情',
            aiSuggestTags: '建议标签',
            aiWellnessTip: '健康建议',
            aiInsights: '获取洞察',
            aiInputPlaceholder: '问我任何关于心情的问题...',
            aiTyping: 'AI正在输入...'
        }
    },
    
    // Initialize i18n system
    init() {
        // Load saved locale from localStorage
        const savedLocale = localStorage.getItem('moodtracker_locale');
        if (savedLocale && this.translations[savedLocale]) {
            this.currentLocale = savedLocale;
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('zh')) {
                this.currentLocale = 'zh';
            }
        }
        
        // Load saved timezone from localStorage
        const savedTimezone = localStorage.getItem('moodtracker_timezone');
        if (savedTimezone) {
            this.userTimezone = savedTimezone;
        } else {
            // Auto-detect and set China timezone for Chinese users
            const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // If system timezone is China-related or user language is Chinese, default to Asia/Shanghai
            if (systemTimezone.startsWith('Asia/Shanghai') || 
                systemTimezone.startsWith('Asia/Chongqing') || 
                systemTimezone.startsWith('Asia/Harbin') ||
                systemTimezone.startsWith('Asia/Hong_Kong') ||
                systemTimezone.startsWith('Asia/Taipei') ||
                this.currentLocale === 'zh') {
                this.userTimezone = 'Asia/Shanghai';
                localStorage.setItem('moodtracker_timezone', 'Asia/Shanghai');
                console.log('⏰ Auto-set timezone to Asia/Shanghai for Chinese users');
            }
        }
        
        console.log('🌐 i18n initialized with locale:', this.currentLocale);
        console.log('⏰ Timezone:', this.getTimezone());
    },
    
    // Get translation
    t(key, params = {}) {
        let text = this.translations[this.currentLocale][key] || 
                   this.translations[this.fallbackLocale][key] || 
                   key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    },
    
    // Change locale
    setLocale(locale) {
        if (this.translations[locale]) {
            this.currentLocale = locale;
            localStorage.setItem('moodtracker_locale', locale);
            console.log('🌐 Locale changed to:', locale);
            return true;
        }
        return false;
    },
    
    // Get current locale
    getLocale() {
        return this.currentLocale;
    },
    
    // Format date based on locale
    formatDate(date, format = 'short') {
        const d = new Date(date);
        const locale = this.currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        
        const options = {
            short: { year: 'numeric', month: 'numeric', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
        };
        
        return d.toLocaleDateString(locale, options[format] || options.short);
    },
    
    // Format time based on locale
    formatTime(date, includeSeconds = false) {
        const d = new Date(date);
        const locale = this.currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        
        const options = includeSeconds 
            ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: this.currentLocale === 'en' }
            : { hour: '2-digit', minute: '2-digit', hour12: this.currentLocale === 'en' };
        
        return d.toLocaleTimeString(locale, options);
    },
    
    // Format datetime based on locale
    formatDateTime(date) {
        return `${this.formatDate(date, 'short')} ${this.formatTime(date)}`;
    },
    
    // Format relative time
    formatRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return this.t('justNow');
        } else if (diffMins < 60) {
            return this.t('minutesAgo', { count: diffMins });
        } else if (diffHours < 24) {
            return this.t('hoursAgo', { count: diffHours });
        } else if (diffDays === 1) {
            return this.t('yesterday');
        } else if (diffDays < 7) {
            return this.t('daysAgo', { count: diffDays });
        } else {
            return this.formatDate(date, 'short');
        }
    },
    
    // Format number based on locale
    formatNumber(number, decimals = 0) {
        const locale = this.currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        return number.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Get day name
    getDayName(dayIndex) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return this.t(days[dayIndex]);
    },
    
    // Get month name
    getMonthName(monthIndex) {
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
        return this.t(months[monthIndex]);
    },
    
    // Get timezone
    getTimezone() {
        // Return user-selected timezone if set, otherwise auto-detect
        return this.userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    
    // Set timezone
    setTimezone(timezone) {
        this.userTimezone = timezone;
        localStorage.setItem('moodtracker_timezone', timezone);
        console.log('⏰ Timezone changed to:', timezone);
    },
    
    // Get timezone offset
    getTimezoneOffset() {
        const timezone = this.getTimezone();
        
        try {
            // Get offset for the specified timezone
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'longOffset'
            });
            
            const parts = formatter.formatToParts(now);
            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            
            if (offsetPart && offsetPart.value.startsWith('GMT')) {
                return offsetPart.value.replace('GMT', '');
            }
        } catch (e) {
            console.warn('Failed to get timezone offset, using local offset');
        }
        
        // Fallback to local offset
        const offset = -new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    },
    
    // Get common timezones
    getCommonTimezones() {
        return [
            // Asia/China timezones first
            { value: 'Asia/Shanghai', label: '🇨🇳 Asia/Shanghai - 中国标准时间 (UTC+08:00)' },
            { value: 'Asia/Hong_Kong', label: '🇭🇰 Asia/Hong Kong - 香港 (UTC+08:00)' },
            { value: 'Asia/Taipei', label: '🇹🇼 Asia/Taipei - 台北 (UTC+08:00)' },
            { value: 'Asia/Macau', label: '🇲🇴 Asia/Macau - 澳门 (UTC+08:00)' },
            { value: 'Asia/Urumqi', label: '🇨🇳 Asia/Urumqi - 乌鲁木齐 (UTC+06:00)' },
            
            // Other Asia timezones
            { value: 'Asia/Tokyo', label: '🇯🇵 Asia/Tokyo - 东京 (UTC+09:00)' },
            { value: 'Asia/Seoul', label: '🇰🇷 Asia/Seoul - 首尔 (UTC+09:00)' },
            { value: 'Asia/Singapore', label: '🇸🇬 Asia/Singapore - 新加坡 (UTC+08:00)' },
            { value: 'Asia/Bangkok', label: '🇹🇭 Asia/Bangkok - 曼谷 (UTC+07:00)' },
            { value: 'Asia/Dubai', label: '🇦🇪 Asia/Dubai - 迪拜 (UTC+04:00)' },
            
            // Americas
            { value: 'America/New_York', label: '🇺🇸 America/New York - 纽约 (UTC-05:00)' },
            { value: 'America/Los_Angeles', label: '🇺🇸 America/Los Angeles - 洛杉矶 (UTC-08:00)' },
            { value: 'America/Chicago', label: '🇺🇸 America/Chicago - 芝加哥 (UTC-06:00)' },
            
            // Europe
            { value: 'Europe/London', label: '🇬🇧 Europe/London - 伦敦 (UTC+00:00)' },
            { value: 'Europe/Paris', label: '🇫🇷 Europe/Paris - 巴黎 (UTC+01:00)' },
            { value: 'Europe/Berlin', label: '🇩🇪 Europe/Berlin - 柏林 (UTC+01:00)' },
            { value: 'Europe/Moscow', label: '🇷🇺 Europe/Moscow - 莫斯科 (UTC+03:00)' },
            
            // Oceania
            { value: 'Australia/Sydney', label: '🇦🇺 Australia/Sydney - 悉尼 (UTC+10:00)' },
            { value: 'Pacific/Auckland', label: '🇳🇿 Pacific/Auckland - 奥克兰 (UTC+12:00)' },
            
            // UTC
            { value: 'UTC', label: '🌍 UTC - 协调世界时 (UTC+00:00)' }
        ];
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    i18n.init();
}
