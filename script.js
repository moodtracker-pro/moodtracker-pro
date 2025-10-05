// MoodTracker Pro - Enterprise Mood Tracking System
class MoodTracker {
    constructor() {
        this.currentMood = null;
        this.selectedTags = new Set();
        this.charts = {};
        this.moodData = this.loadMoodData();
        this.autoCleanupDays = this.loadAutoCleanupSetting();
        this.editingEntryId = null;
        
        // Search and Filter state
        this.searchQuery = '';
        this.activeFilters = {
            dateFrom: null,
            dateTo: null,
            moodMin: 1,
            moodMax: 5,
            tags: new Set()
        };
        this.searchHistory = this.loadSearchHistory();
        this.filteredResults = [];
        
        // Quick Input Mode state
        this.isQuickMode = this.loadQuickModePreference();
        
        // Note Templates
        this.customTemplates = this.loadCustomTemplates();
        
        // Image Attachments
        this.attachedImages = [];
        this.maxImages = 5;
        this.maxImageSize = 5 * 1024 * 1024; // 5MB
        
        // Markdown Editor
        this.markdownMode = 'edit'; // 'edit' or 'preview'
        
        // Initialize data
        this.moodData = JSON.parse(localStorage.getItem('moodData')) || [];
        this.currentMood = null;
        this.editingEntryId = null;
        this.charts = {};
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        
        // Dashboard customization
        this.isCustomizeMode = false;
        this.draggedElement = null;
        this.widgetOrder = JSON.parse(localStorage.getItem('dashboardWidgetOrder')) || ['total-entries', 'average-mood', 'current-streak', 'mood-trend'];
        
        // Available widgets
        this.availableWidgets = {
            'total-entries': { icon: 'calendar-day', label: 'Total Entries', defaultEnabled: true },
            'average-mood': { icon: 'smile', label: 'Average Mood', defaultEnabled: true },
            'current-streak': { icon: 'fire', label: 'Day Streak', defaultEnabled: true },
            'mood-trend': { icon: 'chart-line', label: 'Mood Trend', defaultEnabled: true },
            'best-day': { icon: 'star', label: 'Best Day', defaultEnabled: false },
            'worst-day': { icon: 'frown', label: 'Worst Day', defaultEnabled: false },
            'mood-variance': { icon: 'wave-square', label: 'Mood Variance', defaultEnabled: false },
            'total-tags': { icon: 'tags', label: 'Total Tags', defaultEnabled: false }
        };
        
        this.activeWidgets = JSON.parse(localStorage.getItem('activeWidgets')) || ['total-entries', 'average-mood', 'current-streak', 'mood-trend'];
        
        // Theme system
        this.currentTheme = localStorage.getItem('appTheme') || 'classic-green';
        this.availableThemes = {
            'classic-green': { name: 'Classic Green', nameZh: '经典绿', primary: '#00ff88', secondary: '#00cc6a' },
            'neon-green': { name: 'Neon Green', nameZh: '霓虹绿', primary: '#39ff14', secondary: '#2ed90f' },
            'emerald': { name: 'Emerald', nameZh: '翡翠绿', primary: '#50c878', secondary: '#3ba05f' },
            'mint': { name: 'Mint', nameZh: '薄荷绿', primary: '#98ff98', secondary: '#7cdf7c' },
            'forest': { name: 'Forest Green', nameZh: '森林绿', primary: '#228b22', secondary: '#1a6b1a' },
            'teal': { name: 'Teal', nameZh: '青绿色', primary: '#008080', secondary: '#006666' }
        };
        
        // View density
        this.viewDensity = localStorage.getItem('viewDensity') || 'comfortable'; // 'compact' or 'comfortable'
        
        // Backup & Restore
        this.lastBackupTime = localStorage.getItem('lastBackupTime') || null;
        
        // Data Sync
        this.syncEnabled = localStorage.getItem('syncEnabled') !== 'false'; // Default enabled
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || null;
        this.isSyncing = false;
        
        // Data Encryption
        this.encryptionEnabled = localStorage.getItem('encryptionEnabled') === 'true';
        this.encryptionKey = null; // Stored in memory only, never persisted
        
        // Batch Operations
        this.batchModeEnabled = false;
        this.selectedEntries = new Set();
        
        // Goals
        this.goals = this.loadGoals();
        
        // Achievements
        this.achievements = this.loadAchievements();
        this.allBadges = this.initializeBadges();
        
        // Keyboard Shortcuts
        this.keyboardShortcutsEnabled = localStorage.getItem('keyboardShortcutsEnabled') !== 'false';
        this.shortcutHelpVisible = false;
        
        // Accessibility Features
        this.highContrastMode = localStorage.getItem('highContrastMode') === 'true';
        this.fontSize = localStorage.getItem('fontSize') || 'medium'; // 'small', 'medium', 'large', 'x-large'
        this.colorBlindMode = localStorage.getItem('colorBlindMode') || 'none'; // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
        
        // Webhook Integration
        this.webhookEnabled = localStorage.getItem('webhookEnabled') === 'true';
        this.webhookUrl = localStorage.getItem('webhookUrl') || '';
        this.webhookEvents = JSON.parse(localStorage.getItem('webhookEvents') || '{"moodSaved":true,"streakMilestone":true,"lowMoodDetected":false}');
        this.webhookSecret = localStorage.getItem('webhookSecret') || '';
        
        // Plugin System
        this.installedPlugins = JSON.parse(localStorage.getItem('installedPlugins') || '[]');
        this.pluginRegistry = 'https://raw.githubusercontent.com/moodtracker-pro/plugins/main/plugins.json';
        
        this.init();
    }

    init() {
        // Initialize i18n
        if (typeof i18n !== 'undefined') {
            this.updateUILanguage();
            this.updateTimezoneInfo();
        }
        
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.applyViewDensity(this.viewDensity);
        this.applyAccessibilitySettings();
        this.initWellnessCenter();
        this.initVoiceInput();
        this.initHelpSystem();
        this.setupDataSync();
        this.updateDashboard();
        this.loadWidgetOrder();
        this.initializeCharts();
        this.generateInsights();
        this.showSection('dashboard');
        this.updateAutoCleanupUI();
        this.performAutoCleanup();
        this.updateMoodButtons();
        this.initializeReminders();
        this.initializeHeatmap();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateNavigation(link);
            });
        });

        // Mood Selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMood(btn);
            });
            
            // Keyboard navigation for mood selection
            btn.addEventListener('keydown', (e) => {
                this.handleMoodKeyboardNavigation(e, btn);
            });
        });

        // Tag Selection
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleTag(btn);
            });
        });
        
        // Custom Tag Input
        const customTagInput = document.getElementById('customTagInput');
        const addCustomTagBtn = document.getElementById('addCustomTagBtn');
        const tagAutocomplete = document.getElementById('tagAutocomplete');
        
        if (customTagInput) {
            customTagInput.addEventListener('input', (e) => {
                this.handleTagAutocomplete(e.target.value);
            });
            
            customTagInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addCustomTag(customTagInput.value.trim());
                }
            });
            
            customTagInput.addEventListener('blur', () => {
                setTimeout(() => this.hideTagAutocomplete(), 200);
            });
        }
        
        if (addCustomTagBtn) {
            addCustomTagBtn.addEventListener('click', () => {
                const tagValue = customTagInput.value.trim();
                if (tagValue) {
                    this.addCustomTag(tagValue);
                }
            });
        }
        
        // Note Templates
        const noteTemplateBtn = document.getElementById('noteTemplateBtn');
        const saveTemplateBtn = document.getElementById('saveTemplateBtn');
        
        if (noteTemplateBtn) {
            noteTemplateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTemplateMenu();
            });
        }
        
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', () => {
                this.saveCustomTemplate();
            });
        }
        
        // Template item selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                const templateId = item.dataset.template;
                this.applyTemplate(templateId);
                this.hideTemplateMenu();
            });
        });
        
        // Close template menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.note-actions')) {
                this.hideTemplateMenu();
            }
        });
        
        // Advanced Analytics Tabs
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAnalyticsTab(tabName);
            });
        });
        
        // Period Comparison
        const runComparisonBtn = document.getElementById('runComparison');
        if (runComparisonBtn) {
            runComparisonBtn.addEventListener('click', () => {
                this.runPeriodComparison();
            });
        }
        
        // Image Attachments
        const uploadImageBtn = document.getElementById('uploadImageBtn');
        const imageFileInput = document.getElementById('imageFileInput');
        const dropZone = document.getElementById('dropZone');
        
        if (uploadImageBtn && imageFileInput) {
            uploadImageBtn.addEventListener('click', () => {
                imageFileInput.click();
            });
            
            imageFileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });
        }
        
        if (dropZone) {
            dropZone.addEventListener('click', () => {
                imageFileInput.click();
            });
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this.handleImageUpload(e.dataTransfer.files);
            });
        }
        
        // Make entire note section support drag and drop
        const noteSection = document.querySelector('.image-attachment-section');
        if (noteSection) {
            noteSection.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            noteSection.addEventListener('drop', (e) => {
                e.preventDefault();
                this.handleImageUpload(e.dataTransfer.files);
            });
        }
        
        // Markdown Mode Toggle
        const markdownEditBtn = document.getElementById('markdownEditBtn');
        const markdownPreviewBtn = document.getElementById('markdownPreviewBtn');
        
        if (markdownEditBtn) {
            markdownEditBtn.addEventListener('click', () => {
                this.switchMarkdownMode('edit');
            });
        }
        
        if (markdownPreviewBtn) {
            markdownPreviewBtn.addEventListener('click', () => {
                this.switchMarkdownMode('preview');
            });
        }
        
        // Markdown Toolbar
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.applyMarkdownFormat(action);
            });
        });
        
        // Keyboard shortcuts for Markdown
        const moodNote = document.getElementById('moodNote');
        if (moodNote) {
            moodNote.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    if (e.key === 'b') {
                        e.preventDefault();
                        this.applyMarkdownFormat('bold');
                    } else if (e.key === 'i') {
                        e.preventDefault();
                        this.applyMarkdownFormat('italic');
                    }
                }
            });
        }

        // Save Mood
        document.getElementById('saveMood').addEventListener('click', () => {
            this.saveMoodEntry();
        });

        // Export Dropdown
        document.getElementById('exportDropdownBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExportMenu();
        });
        
        // Export Format Selection
        document.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const format = btn.dataset.format;
                this.closeExportMenu();
                await this.handleExport(format);
            });
        });
        
        // Close export menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                this.closeExportMenu();
            }
        });

        // Clear Data
        document.getElementById('clearData').addEventListener('click', () => {
            this.clearData();
        });

        // Auto Cleanup
        document.getElementById('autoCleanupBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleAutoCleanupMenu();
        });

        document.querySelectorAll('.cleanup-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const days = parseInt(option.dataset.days);
                this.setAutoCleanup(days);
                this.hideAutoCleanupMenu();
            });
        });

        // Personal Settings
        document.getElementById('personalDropdownBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePersonalMenu();
        });

        document.getElementById('customMoodScale').addEventListener('click', () => {
            this.showCustomMoodScaleModal();
            this.hidePersonalMenu();
        });

        document.getElementById('moodReminders').addEventListener('click', () => {
            this.showMoodRemindersModal();
            this.hidePersonalMenu();
        });

        document.getElementById('notificationSettings').addEventListener('click', () => {
            this.showNotificationSettingsModal();
            this.hidePersonalMenu();
        });
        
        document.getElementById('languageSettings').addEventListener('click', () => {
            this.toggleLanguage();
            this.hidePersonalMenu();
        });
        
        document.getElementById('timezoneSettings').addEventListener('click', () => {
            this.showTimezoneSelector();
            this.hidePersonalMenu();
        });
        
        document.getElementById('themeSettings').addEventListener('click', () => {
            this.showThemeSelector();
            this.hidePersonalMenu();
        });
        
        document.getElementById('goalsSettings').addEventListener('click', () => {
            this.showGoalsModal();
            this.hidePersonalMenu();
        });
        
        document.getElementById('achievementsSettings').addEventListener('click', () => {
            this.showAchievementsModal();
            this.hidePersonalMenu();
        });
        
        document.getElementById('importDataSettings').addEventListener('click', () => {
            this.showImportDataModal();
            this.hidePersonalMenu();
        });
        
        document.getElementById('backupRestoreSettings').addEventListener('click', () => {
            this.showBackupRestoreModal();
            this.hidePersonalMenu();
        });
        
        // Batch Operations
        document.getElementById('bulkOperationsBtn').addEventListener('click', () => {
            this.toggleBatchMode();
        });
        
        document.getElementById('selectAllEntries').addEventListener('change', (e) => {
            this.selectAllEntries(e.target.checked);
        });
        
        document.getElementById('batchEditTagsBtn').addEventListener('click', () => {
            this.showBatchEditTagsModal();
        });
        
        document.getElementById('batchDeleteBtn').addEventListener('click', () => {
            this.batchDeleteEntries();
        });
        
        document.getElementById('cancelBatchBtn').addEventListener('click', () => {
            this.toggleBatchMode();
        });
        
        // Dashboard customization
        document.getElementById('viewDensityBtn').addEventListener('click', () => {
            this.toggleViewDensity();
        });
        
        document.getElementById('widgetManagerBtn').addEventListener('click', () => {
            this.showWidgetManager();
        });
        
        document.getElementById('customizeLayoutBtn').addEventListener('click', () => {
            this.toggleCustomizeMode();
        });
        
        document.getElementById('accessibilityBtn').addEventListener('click', () => {
            this.showAccessibilitySettings();
        });
        
        document.getElementById('webhookBtn').addEventListener('click', () => {
            this.showWebhookSettings();
        });
        
        document.getElementById('pluginMarketplaceBtn').addEventListener('click', () => {
            this.showPluginMarketplace();
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.auto-cleanup-dropdown')) {
                this.hideAutoCleanupMenu();
            }
            if (!e.target.closest('.personal-dropdown')) {
                this.hidePersonalMenu();
            }
        });

        // Time Range Change
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateAnalytics(parseInt(e.target.value));
        });

        // Heatmap Year Navigation
        const prevYearBtn = document.getElementById('prevYear');
        const nextYearBtn = document.getElementById('nextYear');
        if (prevYearBtn) {
            prevYearBtn.addEventListener('click', () => {
                this.heatmapYear--;
                this.updateHeatmapYear();
                this.renderHeatmap();
            });
        }
        if (nextYearBtn) {
            nextYearBtn.addEventListener('click', () => {
                this.heatmapYear++;
                this.updateHeatmapYear();
                this.renderHeatmap();
            });
        }
        
        // Heatmap Export
        const exportHeatmapBtn = document.getElementById('exportHeatmapBtn');
        if (exportHeatmapBtn) {
            exportHeatmapBtn.addEventListener('click', () => this.exportHeatmapAsImage());
        }

        // Search and Filter Event Listeners
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const clearResultsBtn = document.getElementById('clearResultsBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Search input with debounce
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const value = e.target.value;
                
                // Show/hide clear button
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = value ? 'flex' : 'none';
                }
                
                // Show search history when empty
                if (!value) {
                    this.showSearchHistory();
                } else {
                    this.hideSearchHistory();
                }
                
                // Debounced search
                searchTimeout = setTimeout(() => {
                    this.performSearch(value);
                }, 300);
            });
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
            
            // Show search history on focus
            searchInput.addEventListener('focus', () => {
                if (!searchInput.value) {
                    this.showSearchHistory();
                }
            });
        }
        
        // Clear search button
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                this.clearSearch();
            });
        }
        
        // Filter toggle button
        if (filterToggleBtn) {
            filterToggleBtn.addEventListener('click', () => {
                const filtersPanel = document.getElementById('filtersPanel');
                if (filtersPanel) {
                    const isVisible = filtersPanel.style.display === 'block';
                    filtersPanel.style.display = isVisible ? 'none' : 'block';
                    filterToggleBtn.classList.toggle('active', !isVisible);
                }
            });
        }
        
        // Apply filters button
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Clear filters button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Clear results button
        if (clearResultsBtn) {
            clearResultsBtn.addEventListener('click', () => {
                this.clearSearch();
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            });
        }
        
        // Clear history button
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearSearchHistory();
            });
        }
        
        // Mood range sliders
        const moodMinRange = document.getElementById('moodMinRange');
        const moodMaxRange = document.getElementById('moodMaxRange');
        const moodMinLabel = document.getElementById('moodMinLabel');
        const moodMaxLabel = document.getElementById('moodMaxLabel');
        
        if (moodMinRange && moodMaxRange) {
            moodMinRange.addEventListener('input', (e) => {
                const min = parseInt(e.target.value);
                const max = parseInt(moodMaxRange.value);
                if (min > max) {
                    moodMaxRange.value = min;
                    if (moodMaxLabel) moodMaxLabel.textContent = min;
                }
                if (moodMinLabel) moodMinLabel.textContent = min;
            });
            
            moodMaxRange.addEventListener('input', (e) => {
                const max = parseInt(e.target.value);
                const min = parseInt(moodMinRange.value);
                if (max < min) {
                    moodMinRange.value = max;
                    if (moodMinLabel) moodMinLabel.textContent = max;
                }
                if (moodMaxLabel) moodMaxLabel.textContent = max;
            });
        }
        
        // Initialize available tags for filter
        this.updateAvailableTagsFilter();
        
        // Quick Input Mode Event Listeners
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        if (modeToggleBtn) {
            modeToggleBtn.addEventListener('click', () => {
                this.toggleInputMode();
            });
        }
        
        // Quick mood buttons
        document.querySelectorAll('.quick-mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mood = parseInt(btn.dataset.quickMood);
                const label = btn.dataset.label;
                this.saveQuickMoodEntry(mood, label, btn);
            });
        });
        
        // Initialize mode on load
        this.initializeInputMode();
        
        // Mobile Bottom Navigation
        document.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.dataset.section;
                this.showSection(section);
                this.updateMobileNavActive(section);
            });
        });
        
        // Initialize mobile features
        this.initMobileFeatures();
        
        // Keyboard Shortcuts
        this.setupKeyboardShortcuts();
    }

    // Navigation
    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
        });
        
        const activeSection = document.getElementById(sectionId);
        activeSection.classList.add('active');
        activeSection.setAttribute('aria-hidden', 'false');
        
        // Update ARIA navigation states
        this.updateNavigationAria(sectionId);
        
        // Announce section change to screen readers
        const sectionNames = {
            'dashboard': 'Dashboard',
            'tracker': 'Track Mood',
            'analytics': 'Analytics',
            'insights': 'Insights'
        };
        this.announceToScreenReader(`Navigated to ${sectionNames[sectionId]} section`);

        // Update charts when switching to analytics
        if (sectionId === 'analytics') {
            setTimeout(() => this.updateAnalyticsCharts(), 100);
        }
    }

    updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Mood Selection
    selectMood(btn) {
        document.querySelectorAll('.mood-btn').forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
            b.setAttribute('tabindex', '-1');
        });
        
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        btn.setAttribute('tabindex', '0');
        btn.focus();
        
        this.currentMood = {
            value: parseInt(btn.dataset.mood),
            label: btn.dataset.label
        };
        
        // Announce to screen readers
        this.announceToScreenReader(`Selected ${this.currentMood.label} mood, level ${this.currentMood.value} of 5`);
        
        this.updateSaveButton();
    }

    // Tag Selection
    toggleTag(btn) {
        const tag = btn.dataset.tag;
        if (this.selectedTags.has(tag)) {
            this.selectedTags.delete(tag);
            btn.classList.remove('selected');
        } else {
            this.selectedTags.add(tag);
            btn.classList.add('selected');
        }
        this.updateSelectedTagsDisplay();
    }
    
    // Custom Tag Management
    addCustomTag(tagValue) {
        if (!tagValue || tagValue.length === 0) return;
        
        // Clean and normalize tag
        const tag = tagValue.toLowerCase().trim();
        
        if (tag.length > 30) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '标签太长（最多30个字符）' : 'Tag is too long (max 30 characters)';
            this.showToast(msg);
            return;
        }
        
        if (this.selectedTags.has(tag)) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '标签已存在' : 'Tag already added';
            this.showToast(msg);
            return;
        }
        
        // Add tag
        this.selectedTags.add(tag);
        this.updateSelectedTagsDisplay();
        
        // Clear input
        const input = document.getElementById('customTagInput');
        if (input) input.value = '';
        
        this.hideTagAutocomplete();
    }
    
    removeTag(tag) {
        this.selectedTags.delete(tag);
        
        // Unselect preset tag button if exists
        const tagBtn = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
        if (tagBtn) {
            tagBtn.classList.remove('selected');
        }
        
        this.updateSelectedTagsDisplay();
    }
    
    updateSelectedTagsDisplay() {
        const container = document.getElementById('selectedTagsDisplay');
        if (!container) return;
        
        if (this.selectedTags.size === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = Array.from(this.selectedTags).map(tag => `
            <div class="selected-tag-chip">
                <span>${tag}</span>
                <span class="remove-tag" data-tag="${tag}">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        `).join('');
        
        // Add remove listeners
        container.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeTag(btn.dataset.tag);
            });
        });
    }
    
    // Tag Autocomplete
    handleTagAutocomplete(input) {
        if (!input || input.length === 0) {
            this.hideTagAutocomplete();
            return;
        }
        
        const suggestions = this.getTagSuggestions(input);
        
        if (suggestions.length === 0) {
            this.hideTagAutocomplete();
            return;
        }
        
        this.showTagAutocomplete(suggestions);
    }
    
    getTagSuggestions(input) {
        const query = input.toLowerCase().trim();
        
        // Get all unique tags from existing entries
        const allTags = new Map();
        this.moodData.forEach(entry => {
            entry.tags.forEach(tag => {
                const count = allTags.get(tag) || 0;
                allTags.set(tag, count + 1);
            });
        });
        
        // Filter and sort by relevance
        const matches = Array.from(allTags.entries())
            .filter(([tag]) => tag.toLowerCase().includes(query) && !this.selectedTags.has(tag))
            .sort((a, b) => {
                // Prioritize exact matches
                if (a[0].toLowerCase() === query) return -1;
                if (b[0].toLowerCase() === query) return 1;
                
                // Then by frequency
                return b[1] - a[1];
            })
            .slice(0, 8)
            .map(([tag, count]) => ({ tag, count }));
        
        return matches;
    }
    
    showTagAutocomplete(suggestions) {
        const dropdown = document.getElementById('tagAutocomplete');
        if (!dropdown) return;
        
        dropdown.innerHTML = suggestions.map(({ tag, count }) => `
            <div class="tag-autocomplete-item" data-tag="${tag}">
                <i class="fas fa-tag tag-icon"></i>
                <span>${tag}</span>
                <span class="tag-count">${count} ${count === 1 ? 'time' : 'times'}</span>
            </div>
        `).join('');
        
        // Add click listeners
        dropdown.querySelectorAll('.tag-autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addCustomTag(item.dataset.tag);
            });
        });
        
        dropdown.style.display = 'block';
    }
    
    hideTagAutocomplete() {
        const dropdown = document.getElementById('tagAutocomplete');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    // ==================== NOTE TEMPLATES ====================
    
    noteTemplates = {
        daily: `📅 Daily Reflection

🌅 Morning:
- 

☀️ Afternoon:
- 

🌙 Evening:
- 

💭 Overall thoughts:
- `,
        
        gratitude: `🙏 Gratitude Journal

Today I'm grateful for:
1. 
2. 
3. 

💖 Something that made me smile:
- 

✨ A small win today:
- `,
        
        goals: `🎯 Goals & Progress

✅ Completed today:
- 

🔄 In progress:
- 

📋 Tomorrow's priorities:
- 

🚀 Long-term goal update:
- `,
        
        anxiety: `🧠 Anxiety Relief

😰 What's making me anxious:
- 

🔍 Reality check:
- 

💪 What I can control:
- 

🌈 Positive affirmations:
- 

😌 Coping strategies used:
- `,
        
        success: `🏆 Success Diary

🎉 Achievement today:
- 

💪 Skills I used:
- 

📚 What I learned:
- 

🔥 How I felt:
- 

🚀 Next steps:
- `
    };
    
    toggleTemplateMenu() {
        const menu = document.getElementById('noteTemplateMenu');
        if (!menu) return;
        
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
            this.renderCustomTemplates();
        } else {
            menu.style.display = 'none';
        }
    }
    
    hideTemplateMenu() {
        const menu = document.getElementById('noteTemplateMenu');
        if (menu) {
            menu.style.display = 'none';
        }
    }
    
    applyTemplate(templateId) {
        const textarea = document.getElementById('moodNote');
        if (!textarea) return;
        
        const template = this.noteTemplates[templateId] || this.customTemplates[templateId];
        if (template) {
            textarea.value = template;
            textarea.focus();
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '模板已应用' : 'Template applied';
            this.showToast(msg);
        }
    }
    
    saveCustomTemplate() {
        const textarea = document.getElementById('moodNote');
        if (!textarea || !textarea.value.trim()) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '请先写一些内容再保存为模板' : 'Write some content first to save as template';
            this.showToast(msg);
            return;
        }
        
        const templateName = prompt('Enter a name for this template:');
        if (!templateName || !templateName.trim()) return;
        
        const cleanName = templateName.trim();
        const templateId = `custom_${Date.now()}`;
        
        this.customTemplates[templateId] = {
            name: cleanName,
            content: textarea.value,
            created: new Date().toISOString()
        };
        
        this.saveCustomTemplatesToStorage();
        this.renderCustomTemplates();
        this.showToast(`Template "${cleanName}" saved`);
    }
    
    deleteCustomTemplate(templateId) {
        if (!confirm('Delete this template?')) return;
        
        delete this.customTemplates[templateId];
        this.saveCustomTemplatesToStorage();
        this.renderCustomTemplates();
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '模板已删除' : 'Template deleted';
        this.showToast(msg);
    }
    
    renderCustomTemplates() {
        const container = document.getElementById('customTemplates');
        if (!container) return;
        
        const templates = Object.entries(this.customTemplates);
        
        if (templates.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = templates.map(([id, template]) => `
            <div class="custom-template-item" data-template-id="${id}">
                <i class="fas fa-file-alt"></i>
                <span class="template-name">${template.name}</span>
                <span class="delete-template" data-template-id="${id}">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `).join('');
        
        // Add click listeners
        container.querySelectorAll('.custom-template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-template')) {
                    const templateId = item.dataset.templateId;
                    const template = this.customTemplates[templateId];
                    if (template) {
                        const textarea = document.getElementById('moodNote');
                        if (textarea) {
                            textarea.value = template.content;
                            this.hideTemplateMenu();
                            this.showToast('Template applied');
                        }
                    }
                }
            });
        });
        
        container.querySelectorAll('.delete-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCustomTemplate(btn.dataset.templateId);
            });
        });
    }
    
    loadCustomTemplates() {
        try {
            const saved = localStorage.getItem('moodtracker_custom_templates');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading custom templates:', error);
            return {};
        }
    }
    
    saveCustomTemplatesToStorage() {
        try {
            localStorage.setItem('moodtracker_custom_templates', JSON.stringify(this.customTemplates));
        } catch (error) {
            console.error('Error saving custom templates:', error);
        }
    }
    
    // ==================== END NOTE TEMPLATES ====================
    
    // ==================== IMAGE ATTACHMENTS ====================
    
    handleImageUpload(files) {
        if (!files || files.length === 0) return;
        
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '请选择图片文件' : 'Please select image files only';
            this.showToast(msg);
            return;
        }
        
        if (this.attachedImages.length + imageFiles.length > this.maxImages) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? `最多允许${this.maxImages}张图片` : `Maximum ${this.maxImages} images allowed`;
            this.showToast(msg);
            return;
        }
        
        imageFiles.forEach(file => {
            if (file.size > this.maxImageSize) {
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? `图片${file.name}太大（最大5MB）` : `Image ${file.name} is too large (max 5MB)`;
                this.showToast(msg);
                return;
            }
            
            this.processImage(file);
        });
        
        // Clear input
        const input = document.getElementById('imageFileInput');
        if (input) input.value = '';
    }
    
    processImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageData = {
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                data: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            };
            
            this.attachedImages.push(imageData);
            this.renderImagePreviews();
        };
        
        reader.onerror = () => {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '读取图片失败' : 'Failed to read image file';
            this.showToast(msg);
        };
        
        reader.readAsDataURL(file);
    }
    
    renderImagePreviews() {
        const container = document.getElementById('imagePreviewContainer');
        const dropZone = document.getElementById('dropZone');
        
        if (!container) return;
        
        if (this.attachedImages.length === 0) {
            container.innerHTML = '';
            if (dropZone) dropZone.style.display = 'block';
            return;
        }
        
        if (dropZone) dropZone.style.display = 'none';
        
        container.innerHTML = this.attachedImages.map(image => `
            <div class="image-preview-item" data-image-id="${image.id}">
                <img src="${image.data}" alt="${image.name}">
                <button class="remove-image" data-image-id="${image.id}" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add click listeners for preview
        container.querySelectorAll('.image-preview-item img').forEach(img => {
            img.addEventListener('click', () => {
                this.showImageModal(img.src);
            });
        });
        
        // Add remove listeners
        container.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeImage(btn.dataset.imageId);
            });
        });
    }
    
    removeImage(imageId) {
        this.attachedImages = this.attachedImages.filter(img => img.id !== imageId);
        this.renderImagePreviews();
    }
    
    showImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <img src="${imageSrc}" alt="Preview">
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(modal);
        
        // Close on click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close-modal')) {
                document.body.removeChild(modal);
            }
        });
        
        // Close on Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
    
    clearImages() {
        this.attachedImages = [];
        this.renderImagePreviews();
    }
    
    // ==================== END IMAGE ATTACHMENTS ====================
    
    // ==================== MARKDOWN EDITOR ====================
    
    switchMarkdownMode(mode) {
        this.markdownMode = mode;
        
        const textarea = document.getElementById('moodNote');
        const preview = document.getElementById('markdownPreview');
        const editBtn = document.getElementById('markdownEditBtn');
        const previewBtn = document.getElementById('markdownPreviewBtn');
        
        if (!textarea || !preview || !editBtn || !previewBtn) return;
        
        if (mode === 'edit') {
            textarea.style.display = 'block';
            preview.style.display = 'none';
            editBtn.classList.add('active');
            previewBtn.classList.remove('active');
        } else {
            textarea.style.display = 'none';
            preview.style.display = 'block';
            editBtn.classList.remove('active');
            previewBtn.classList.add('active');
            
            // Render markdown
            this.renderMarkdown(textarea.value);
        }
    }
    
    renderMarkdown(text) {
        const preview = document.getElementById('markdownPreview');
        if (!preview) return;
        
        if (!text || text.trim() === '') {
            preview.innerHTML = '<p style="color: var(--gray-500); font-style: italic;">Nothing to preview</p>';
            return;
        }
        
        let html = this.parseMarkdown(text);
        preview.innerHTML = html;
    }
    
    parseMarkdown(text) {
        // Escape HTML to prevent XSS
        text = text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;');
        
        // Headers (must be at start of line)
        text = text.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
        text = text.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
        text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
        text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        text = text.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        text = text.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
        
        // Horizontal rules
        text = text.replace(/^---$/gm, '<hr>');
        text = text.replace(/^\*\*\*$/gm, '<hr>');
        
        // Code blocks (must come before inline code)
        text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // Blockquotes
        text = text.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Images
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        // Unordered lists
        text = text.replace(/^[*+-]\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Ordered lists
        text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        
        // Paragraphs (lines that aren't already wrapped)
        const lines = text.split('\n');
        const processed = lines.map(line => {
            line = line.trim();
            if (line === '') return '<br>';
            if (line.match(/^<(h[1-6]|hr|pre|code|blockquote|ul|ol|li|table|img)/)) {
                return line;
            }
            if (line === '<br>') return line;
            return `<p>${line}</p>`;
        });
        
        return processed.join('\n');
    }
    
    applyMarkdownFormat(action) {
        const textarea = document.getElementById('moodNote');
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        
        let replacement = '';
        let cursorOffset = 0;
        
        switch(action) {
            case 'bold':
                replacement = `**${selectedText || 'bold text'}**`;
                cursorOffset = selectedText ? 0 : -2;
                break;
                
            case 'italic':
                replacement = `*${selectedText || 'italic text'}*`;
                cursorOffset = selectedText ? 0 : -1;
                break;
                
            case 'heading':
                const lineStart = beforeText.lastIndexOf('\n') + 1;
                const lineEnd = afterText.indexOf('\n');
                const currentLine = textarea.value.substring(lineStart, lineEnd === -1 ? textarea.value.length : end + lineEnd);
                replacement = `## ${currentLine.replace(/^#+\s*/, '')}`;
                textarea.value = textarea.value.substring(0, lineStart) + replacement + (lineEnd === -1 ? '' : afterText.substring(lineEnd));
                textarea.setSelectionRange(lineStart + replacement.length, lineStart + replacement.length);
                textarea.focus();
                return;
                
            case 'list':
                const lines = selectedText.split('\n');
                replacement = lines.map(line => `- ${line}`).join('\n') || '- List item';
                cursorOffset = selectedText ? 0 : 0;
                break;
                
            case 'ordered-list':
                const oLines = selectedText.split('\n');
                replacement = oLines.map((line, i) => `${i + 1}. ${line}`).join('\n') || '1. List item';
                cursorOffset = selectedText ? 0 : 0;
                break;
                
            case 'checkbox':
                const cLines = selectedText.split('\n');
                replacement = cLines.map(line => `- [ ] ${line}`).join('\n') || '- [ ] Task item';
                cursorOffset = selectedText ? 0 : 0;
                break;
                
            case 'link':
                replacement = `[${selectedText || 'link text'}](url)`;
                cursorOffset = selectedText ? -4 : -9;
                break;
                
            case 'code':
                if (selectedText.includes('\n')) {
                    replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
                    cursorOffset = selectedText ? 0 : -4;
                } else {
                    replacement = `\`${selectedText || 'code'}\``;
                    cursorOffset = selectedText ? 0 : -1;
                }
                break;
                
            case 'quote':
                const qLines = selectedText.split('\n');
                replacement = qLines.map(line => `> ${line}`).join('\n') || '> Quote';
                cursorOffset = selectedText ? 0 : 0;
                break;
                
            default:
                return;
        }
        
        textarea.value = beforeText + replacement + afterText;
        
        const newCursorPos = start + replacement.length + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
    }
    
    // ==================== END MARKDOWN EDITOR ====================

    updateSaveButton() {
        const saveBtn = document.getElementById('saveMood');
        const isDisabled = !this.currentMood;
        
        saveBtn.disabled = isDisabled;
        saveBtn.setAttribute('aria-disabled', isDisabled.toString());
        
        if (!isDisabled) {
            saveBtn.setAttribute('aria-label', 'Save mood entry - Click to save');
        } else {
            saveBtn.setAttribute('aria-label', 'Save mood entry - Please select a mood first');
        }
    }

    // Save Mood Entry
    saveMoodEntry() {
        if (!this.currentMood) return;

        const currentLocale = i18n?.getLocale() || 'en';
        let entry;

        // Check if we're editing an existing entry
        if (this.editingEntryId) {
            const entryIndex = this.moodData.findIndex(e => e.id === this.editingEntryId);
            if (entryIndex !== -1) {
                // Update existing entry
                this.moodData[entryIndex] = {
                    ...this.moodData[entryIndex],
                    mood: this.currentMood,
                    note: document.getElementById('moodNote').value.trim(),
                    tags: Array.from(this.selectedTags)
                };
                entry = this.moodData[entryIndex];
                const msg = currentLocale === 'zh' ? '条目已更新！' : 'Entry updated successfully!';
                this.showToast(msg);
            }
            this.editingEntryId = null;
        } else {
            // Create new entry
            entry = {
                id: Date.now(),
                date: new Date().toISOString(),
                mood: this.currentMood,
                note: document.getElementById('moodNote').value.trim(),
                tags: Array.from(this.selectedTags),
                images: [...this.attachedImages],
                timestamp: Date.now()
            };
            this.moodData.push(entry);
            const msg = currentLocale === 'zh' ? '心情记录已保存！' : 'Mood entry saved successfully!';
            this.showToast(msg);
        }

        this.saveMoodData(); // Save to localStorage
        if (entry) {
            this.trackSpecialStats(entry.date); // Track special stats for achievements
        }
        this.updateDashboard();
        this.generateInsights();
        this.performAutoCleanup();
        this.checkAndUnlockAchievements(); // Check for new achievements
        
        // Trigger webhook for mood saved event
        if (entry) {
            this.triggerWebhook('moodSaved', {
                mood: entry,
                stats: this.generateStats()
            });
            
            // Check for low mood
            if (entry.mood.value <= 2) {
                this.triggerWebhook('lowMoodDetected', {
                    mood: entry,
                    consecutiveLowMoods: this.checkConsecutiveLowMoods()
                });
            }
        }
        
        // Check for streak milestone
        const stats = this.generateStats();
        if (stats.currentStreak > 0 && [7, 14, 30, 60, 100].includes(stats.currentStreak)) {
            this.triggerWebhook('streakMilestone', {
                streak: stats.currentStreak,
                date: new Date().toISOString()
            });
        }
        
        this.resetForm();
        
        // Switch to dashboard
        this.showSection('dashboard');
        this.updateNavigation(document.querySelector('[data-section="dashboard"]'));
    }

    resetForm() {
        this.currentMood = null;
        this.selectedTags.clear();
        this.editingEntryId = null;
        
        // Clear all mood button states and aria attributes
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-checked', 'false');
            btn.setAttribute('tabindex', '-1');
        });
        
        // Clear all tag button states
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Clear note input
        const moodNote = document.getElementById('moodNote');
        if (moodNote) moodNote.value = '';
        
        // Clear custom tag input
        const customTagInput = document.getElementById('customTagInput');
        if (customTagInput) customTagInput.value = '';
        
        // Clear selected tags display
        this.updateSelectedTagsDisplay();
        this.hideTagAutocomplete();
        
        // Clear images
        this.clearImages();
        
        // Reset save button text and state
        const saveBtn = document.getElementById('saveMood');
        if (saveBtn) {
            const currentLocale = i18n?.getLocale() || 'en';
            const saveBtnText = currentLocale === 'zh' ? '保存记录' : 'Save Entry';
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${saveBtnText}`;
        }
        
        this.updateSaveButton();
    }

    // Data Management
    loadMoodData() {
        try {
            const data = localStorage.getItem('moodTracker_data');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading mood data:', error);
            return [];
        }
    }

    saveMoodData() {
        try {
            let dataToSave = JSON.stringify(this.moodData);
            
            // Encrypt if encryption is enabled and key is available
            if (this.encryptionEnabled && this.encryptionKey) {
                dataToSave = this.simpleEncrypt(dataToSave, this.encryptionKey);
            }
            
            localStorage.setItem('moodData', dataToSave);
            // Keep old key for backward compatibility
            localStorage.setItem('moodTracker_data', dataToSave);
        } catch (error) {
            console.error('Error saving mood data:', error);
        }
    }

    // Export Menu Functions
    toggleExportMenu() {
        const menu = document.getElementById('exportMenu');
        const btn = document.getElementById('exportDropdownBtn');
        
        menu.classList.toggle('show');
        btn.classList.toggle('active');
    }

    closeExportMenu() {
        const menu = document.getElementById('exportMenu');
        const btn = document.getElementById('exportDropdownBtn');
        
        menu.classList.remove('show');
        btn.classList.remove('active');
    }

    // Enhanced Export Function
    exportData(format = 'json') {
        try {
            const timestamp = new Date().toISOString().split('T')[0];
            
            switch (format) {
                case 'json':
                    this.exportJSON(timestamp);
                    break;
                case 'markdown':
                    this.exportMarkdown(timestamp);
                    break;
                case 'pdf':
                    this.exportPDF(timestamp);
                    break;
                case 'docx':
                    this.exportDOCX(timestamp);
                    break;
                default:
                    this.exportJSON(timestamp);
            }
        } catch (error) {
            console.error('Export error:', error);
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '导出失败，请重试' : 'Export failed. Please try again.';
            this.showToast(msg);
        }
    }

    exportJSON(timestamp) {
        const dataStr = JSON.stringify(this.moodData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-data-${timestamp}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? 'JSON数据导出成功！' : 'JSON data exported successfully!';
        this.showToast(msg);
    }

    exportICalendar(timestamp) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        // Generate iCal file content
        let ical = 'BEGIN:VCALENDAR\r\n';
        ical += 'VERSION:2.0\r\n';
        ical += 'PRODID:-//MoodTracker Pro//Mood Journal//EN\r\n';
        ical += 'CALSCALE:GREGORIAN\r\n';
        ical += 'METHOD:PUBLISH\r\n';
        ical += 'X-WR-CALNAME:MoodTracker Pro - Mood Records\r\n';
        ical += 'X-WR-TIMEZONE:UTC\r\n';
        ical += 'X-WR-CALDESC:Your mood tracking history exported from MoodTracker Pro\r\n';
        
        // Add each mood entry as an event
        this.moodData.forEach(entry => {
            const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
            const moodLabels = isZh 
                ? ['非常糟糕', '糟糕', '一般', '良好', '极好']
                : ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
            
            const moodLabel = moodLabels[entry.mood - 1] || 'Unknown';
            const moodEmoji = moodEmojis[entry.mood - 1] || '😐';
            
            // Create event date (all-day event)
            const eventDate = new Date(entry.date);
            const dateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const dateOnly = eventDate.toISOString().split('T')[0].replace(/-/g, '');
            
            // Generate unique UID
            const uid = `mood-${entry.id || entry.date}-${Date.now()}@moodtracker.pro`;
            
            // Event summary
            const summary = `${moodEmoji} ${isZh ? '心情' : 'Mood'}: ${moodLabel}`;
            
            // Event description
            let description = `${isZh ? '心情评分' : 'Mood Rating'}: ${entry.mood}/5\\n`;
            if (entry.note) {
                description += `${isZh ? '笔记' : 'Note'}: ${entry.note.replace(/\n/g, '\\n')}\\n`;
            }
            if (entry.tags && entry.tags.length > 0) {
                description += `${isZh ? '标签' : 'Tags'}: ${entry.tags.join(', ')}`;
            }
            
            ical += 'BEGIN:VEVENT\r\n';
            ical += `UID:${uid}\r\n`;
            ical += `DTSTAMP:${dateStr}\r\n`;
            ical += `DTSTART;VALUE=DATE:${dateOnly}\r\n`;
            ical += `DTEND;VALUE=DATE:${dateOnly}\r\n`;
            ical += `SUMMARY:${summary}\r\n`;
            ical += `DESCRIPTION:${description}\r\n`;
            ical += `STATUS:CONFIRMED\r\n`;
            ical += `TRANSP:TRANSPARENT\r\n`;
            
            // Add categories
            if (entry.tags && entry.tags.length > 0) {
                ical += `CATEGORIES:${entry.tags.join(',')}\r\n`;
            }
            
            ical += 'END:VEVENT\r\n';
        });
        
        ical += 'END:VCALENDAR\r\n';
        
        // Create and download file
        const blob = new Blob([ical], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `moodtracker-calendar-${timestamp}.ics`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        const msg = isZh 
            ? `已导出 ${this.moodData.length} 条心情记录到日历文件！` 
            : `Exported ${this.moodData.length} mood records to calendar file!`;
        this.showToast(msg);
    }

    exportMarkdown(timestamp) {
        const stats = this.generateStats();
        const recentEntries = this.moodData.slice(-10).reverse();
        const distribution = this.getMoodDistribution();
        const moodLabels = ['😢 Very Bad', '😞 Bad', '😐 Neutral', '😊 Good', '😄 Excellent'];
        const moodEmojis = ['😢', '😞', '😐', '😊', '😄'];
        
        let markdown = `# 🧠 MoodTracker Pro Report\n\n`;
        markdown += `> **Generated on:** ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n\n`;
        
        markdown += `---\n\n`;
        
        // Statistics with visual elements
        markdown += `## 📊 Your Emotional Journey\n\n`;
        markdown += `| Metric | Value | Status |\n`;
        markdown += `|--------|-------|--------|\n`;
        markdown += `| 📅 **Total Entries** | ${stats.totalEntries} | ${stats.totalEntries >= 30 ? '🏆 Excellent' : stats.totalEntries >= 7 ? '✅ Good' : '🌱 Getting Started'} |\n`;
        markdown += `| 💝 **Average Mood** | ${stats.averageMood}/5.0 | ${parseFloat(stats.averageMood) >= 4 ? '😄 Great' : parseFloat(stats.averageMood) >= 3 ? '😊 Good' : '💪 Keep Going'} |\n`;
        markdown += `| 🔥 **Current Streak** | ${stats.currentStreak} days | ${stats.currentStreak >= 30 ? '🏆 Amazing' : stats.currentStreak >= 7 ? '⭐ Excellent' : '🌟 Building'} |\n`;
        markdown += `| 📈 **Mood Trend** | ${stats.moodTrend} | ${stats.moodTrend === 'Improving' ? '📈 Trending Up' : stats.moodTrend === 'Declining' ? '📉 Needs Attention' : '📊 Stable'} |\n\n`;
        
        // Mood Distribution with visual bars
        markdown += `## 🎯 Mood Distribution\n\n`;
        distribution.forEach((count, index) => {
            const percentage = stats.totalEntries > 0 ? ((count / stats.totalEntries) * 100).toFixed(1) : 0;
            const barLength = Math.round(percentage / 5);
            const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
            markdown += `**${moodLabels[index]}**\n`;
            markdown += `\`${bar}\` ${percentage}% (${count} entries)\n\n`;
        });
        
        // Recent Entries with beautiful formatting
        markdown += `## 📝 Recent Mood Entries\n\n`;
        if (recentEntries.length > 0) {
            recentEntries.forEach((entry, index) => {
                const date = new Date(entry.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    weekday: 'short'
                });
                const moodEmoji = moodEmojis[entry.mood.value - 1];
                
                markdown += `### ${moodEmoji} ${formattedDate} - ${entry.mood.label}\n\n`;
                
                if (entry.note) {
                    markdown += `> *"${entry.note}"*\n\n`;
                }
                
                if (entry.tags.length > 0) {
                    markdown += `**Tags:** `;
                    entry.tags.forEach(tag => {
                        const tagEmoji = {
                            'work': '💼',
                            'family': '👨‍👩‍👧‍👦',
                            'health': '🏥',
                            'social': '👥',
                            'exercise': '🏃‍♂️',
                            'sleep': '😴',
                            'stress': '😰',
                            'achievement': '🏆'
                        };
                        markdown += `\`${tagEmoji[tag] || '🏷️'} ${tag}\` `;
                    });
                    markdown += `\n\n`;
                }
                
                if (index < recentEntries.length - 1) {
                    markdown += `---\n\n`;
                }
            });
        } else {
            markdown += `> 🌱 No entries yet. Start tracking your mood to see your journey!\n\n`;
        }
        
        // Insights with actionable advice
        markdown += `## 💡 AI-Powered Insights\n\n`;
        
        if (stats.totalEntries >= 7) {
            const weeklyPattern = this.getWeeklyPatternData();
            const bestDayIndex = weeklyPattern.indexOf(Math.max(...weeklyPattern));
            const bestDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][bestDayIndex];
            
            markdown += `### 🔍 Pattern Analysis\n\n`;
            markdown += `- 🌟 **Best Day:** Your mood tends to be highest on **${bestDay}**\n`;
            
            if (stats.moodTrend === 'Improving') {
                markdown += `- 📈 **Trend:** Your mood has been **improving** - keep up the great work!\n`;
            } else if (stats.moodTrend === 'Declining') {
                markdown += `- 📉 **Trend:** Your mood has been **declining** - consider what might help\n`;
            } else {
                markdown += `- 📊 **Trend:** Your mood has been **stable** - consistency is good!\n`;
            }
            
            // Tag insights
            const tagMoodCorrelation = this.getTagMoodCorrelation();
            if (tagMoodCorrelation.positive.length > 0) {
                markdown += `- ✨ **Mood Boosters:** Activities like "${tagMoodCorrelation.positive[0]}" tend to improve your mood\n`;
            }
        } else {
            markdown += `### 🌱 Getting Started\n\n`;
            markdown += `Keep tracking for at least a week to unlock personalized insights about your emotional patterns!\n\n`;
        }
        
        // Recommendations
        markdown += `### 🎯 Personalized Recommendations\n\n`;
        const avgMood = parseFloat(stats.averageMood);
        
        if (avgMood >= 4) {
            markdown += `- 🎉 **You're doing great!** Your average mood is excellent\n`;
            markdown += `- 📝 **Share your success:** Consider what's working well for you\n`;
            markdown += `- 🤝 **Help others:** Your positive strategies could benefit others\n`;
        } else if (avgMood >= 3) {
            markdown += `- 👍 **Good progress!** You're maintaining a positive outlook\n`;
            markdown += `- 🎯 **Small improvements:** Look for opportunities to boost your mood\n`;
            markdown += `- 🏃‍♂️ **Stay active:** Regular exercise can help maintain good mood\n`;
        } else {
            markdown += `- 🤗 **Self-care focus:** Prioritize activities that bring you joy\n`;
            markdown += `- 🧘‍♀️ **Mindfulness:** Try meditation or deep breathing exercises\n`;
            markdown += `- 👥 **Connect:** Reach out to friends, family, or professionals for support\n`;
        }
        
        if (stats.currentStreak >= 7) {
            markdown += `- 🔥 **Streak master!** ${stats.currentStreak} days of consistent tracking\n`;
        } else {
            markdown += `- 📅 **Build consistency:** Try to track daily for better insights\n`;
        }
        
        markdown += `\n---\n\n`;
        markdown += `<div align="center">\n\n`;
        markdown += `**🧠 Generated by MoodTracker Pro**\n\n`;
        markdown += `*Your mental health matters. This report is for personal insights only.*\n\n`;
        markdown += `*For professional support, please consult qualified healthcare providers.*\n\n`;
        markdown += `</div>`;
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-report-${timestamp}.md`;
        link.click();
        
        URL.revokeObjectURL(url);
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? 'Markdown报告导出成功！' : 'Beautiful Markdown report exported successfully!';
        this.showToast(msg);
    }

    exportPDF(timestamp) {
        // Check multiple ways jsPDF might be loaded
        let jsPDFClass;
        if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
            jsPDFClass = window.jspdf.jsPDF;
        } else if (typeof jsPDF !== 'undefined') {
            jsPDFClass = jsPDF;
        } else if (typeof window.jsPDF !== 'undefined') {
            jsPDFClass = window.jsPDF;
        } else {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? 'PDF库未加载，请刷新页面' : 'PDF library not loaded. Please refresh the page.';
            this.showToast(msg);
            return;
        }

        try {
            const doc = new jsPDFClass();
            const stats = this.generateStats();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            
            // Header background
            doc.setFillColor(10, 10, 10);
            doc.rect(0, 0, pageWidth, 50, 'F');
            
            // Title with gradient effect
            doc.setFontSize(24);
            doc.setTextColor(0, 255, 136);
            doc.text('MoodTracker Pro Report', 20, 25);
            
            // Subtitle
            doc.setFontSize(12);
            doc.setTextColor(200, 200, 200);
            const fullDate = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            doc.text(`Generated on ${fullDate}`, 20, 40);
            
            let yPos = 70;
            
            // Statistics Section with boxes
            doc.setFillColor(245, 245, 245);
            doc.rect(15, yPos - 10, pageWidth - 30, 80, 'F');
            
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 0);
            doc.text('Your Emotional Journey', 20, yPos);
            
            yPos += 20;
            
            // Statistics in a grid layout
            const statBoxWidth = (pageWidth - 50) / 2;
            const statBoxHeight = 25;
            
            // Box 1: Total Entries
            doc.setFillColor(230, 255, 230);
            doc.rect(20, yPos, statBoxWidth - 5, statBoxHeight, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Total Entries', 25, yPos + 8);
            doc.setFontSize(16);
            doc.setTextColor(0, 150, 80);
            doc.text(`${stats.totalEntries}`, 25, yPos + 18);
            
            // Box 2: Average Mood
            doc.setFillColor(230, 255, 230);
            doc.rect(20 + statBoxWidth, yPos, statBoxWidth - 5, statBoxHeight, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Average Mood', 25 + statBoxWidth, yPos + 8);
            doc.setFontSize(16);
            doc.setTextColor(0, 150, 80);
            doc.text(`${stats.averageMood}/5.0`, 25 + statBoxWidth, yPos + 18);
            
            yPos += 30;
            
            // Box 3: Streak
            doc.setFillColor(255, 248, 220);
            doc.rect(20, yPos, statBoxWidth - 5, statBoxHeight, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Current Streak', 25, yPos + 8);
            doc.setFontSize(16);
            doc.setTextColor(200, 100, 0);
            doc.text(`${stats.currentStreak} days`, 25, yPos + 18);
            
            // Box 4: Trend
            doc.setFillColor(230, 240, 255);
            doc.rect(20 + statBoxWidth, yPos, statBoxWidth - 5, statBoxHeight, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Mood Trend', 25 + statBoxWidth, yPos + 8);
            doc.setFontSize(16);
            doc.setTextColor(50, 100, 200);
            doc.text(`${stats.moodTrend}`, 25 + statBoxWidth, yPos + 18);
            
            yPos += 50;
            
            // Mood Distribution with visual bars
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 0);
            doc.text('Mood Distribution', 20, yPos);
            
            yPos += 15;
            const distribution = this.getMoodDistribution();
            const moodLabels = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
            const moodColors = [[220, 53, 69], [253, 126, 20], [255, 193, 7], [40, 167, 69], [0, 255, 136]];
            
            distribution.forEach((count, index) => {
                const percentage = stats.totalEntries > 0 ? ((count / stats.totalEntries) * 100).toFixed(1) : 0;
                
                // Label
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`${moodLabels[index]}`, 25, yPos + 8);
                
                // Progress bar background
                doc.setFillColor(240, 240, 240);
                doc.rect(100, yPos, 80, 10, 'F');
                
                // Progress bar fill
                const barWidth = (percentage / 100) * 80;
                doc.setFillColor(...moodColors[index]);
                doc.rect(100, yPos, barWidth, 10, 'F');
                
                // Percentage text
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`${percentage}% (${count})`, 185, yPos + 7);
                
                yPos += 18;
            });
            
            // Check if we need a new page
            if (yPos > 220) {
                doc.addPage();
                yPos = 30;
            }
            
            // Recent Entries Section
            yPos += 10;
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 0);
            doc.text('Recent Mood Entries', 20, yPos);
            
            yPos += 15;
            const recentEntries = this.moodData.slice(-5).reverse();
            const moodEmojis = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
            
            recentEntries.forEach((entry, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 30;
                }
                
                // Entry box
                doc.setFillColor(248, 249, 250);
                doc.rect(20, yPos - 5, pageWidth - 40, 35, 'F');
                
                const date = new Date(entry.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    weekday: 'short'
                });
                const moodLabel = moodEmojis[entry.mood.value - 1];
                
                // Date and mood
                doc.setFontSize(14);
                doc.setTextColor(0, 150, 80);
                doc.text(`${formattedDate} - ${entry.mood.label}`, 25, yPos + 5);
                
                // Note
                if (entry.note) {
                    doc.setFontSize(10);
                    doc.setTextColor(80, 80, 80);
                    const lines = doc.splitTextToSize(`"${entry.note}"`, 140);
                    doc.text(lines, 25, yPos + 15);
                }
                
                // Tags
                if (entry.tags.length > 0) {
                    doc.setFontSize(9);
                    doc.setTextColor(120, 120, 120);
                    const tagText = `Tags: ${entry.tags.join(', ')}`;
                    doc.text(tagText, 25, yPos + 25);
                }
                
                yPos += 45;
            });
            
            // Footer
            if (yPos > 250) {
                doc.addPage();
                yPos = 30;
            }
            
            yPos = pageHeight - 30;
            doc.setFillColor(10, 10, 10);
            doc.rect(0, yPos - 10, pageWidth, 40, 'F');
            
            doc.setFontSize(10);
            doc.setTextColor(0, 255, 136);
            doc.text('Generated by MoodTracker Pro', 20, yPos);
            doc.setTextColor(200, 200, 200);
            doc.text('Your mental health matters. For professional support, consult healthcare providers.', 20, yPos + 10);
            
            doc.save(`mood-report-${timestamp}.pdf`);
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? 'PDF报告导出成功！' : 'Beautiful PDF report exported successfully!';
            this.showToast(msg);
        } catch (error) {
            console.error('PDF export error:', error);
            this.showToast('PDF export failed: ' + error.message);
        }
    }

    exportDOCX(timestamp) {
        // Check if libraries are loaded
        if (typeof window.docx === 'undefined' && typeof docx === 'undefined') {
            // Fallback: Export as rich text format instead
            this.exportRTF(timestamp);
            return;
        }
        
        if (typeof saveAs === 'undefined') {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '文件保存库未加载，请刷新页面' : 'FileSaver library not loaded. Please refresh the page.';
            this.showToast(msg);
            return;
        }

        try {
            const stats = this.generateStats();
            const recentEntries = this.moodData.slice(-8).reverse();
            const distribution = this.getMoodDistribution();
            const moodLabels = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
            const moodEmojis = ['😢', '😞', '😐', '😊', '😄'];
            
            // Use the global docx object or the imported one
            const docxLib = window.docx || docx;
            
            const fullDate = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            // Create statistics table
            const statsTable = new docxLib.Table({
                rows: [
                    new docxLib.TableRow({
                        children: [
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: "📅 Total Entries", bold: true, size: 24 })]
                                })],
                                shading: { fill: "E8F5E8" }
                            }),
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: `${stats.totalEntries}`, size: 24, color: "006644" })]
                                })]
                            })
                        ]
                    }),
                    new docxLib.TableRow({
                        children: [
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: "💝 Average Mood", bold: true, size: 24 })]
                                })],
                                shading: { fill: "E8F5E8" }
                            }),
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: `${stats.averageMood}/5.0`, size: 24, color: "006644" })]
                                })]
                            })
                        ]
                    }),
                    new docxLib.TableRow({
                        children: [
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: "🔥 Current Streak", bold: true, size: 24 })]
                                })],
                                shading: { fill: "E8F5E8" }
                            }),
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: `${stats.currentStreak} days`, size: 24, color: "006644" })]
                                })]
                            })
                        ]
                    }),
                    new docxLib.TableRow({
                        children: [
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: "📈 Mood Trend", bold: true, size: 24 })]
                                })],
                                shading: { fill: "E8F5E8" }
                            }),
                            new docxLib.TableCell({
                                children: [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: `${stats.moodTrend}`, size: 24, color: "006644" })]
                                })]
                            })
                        ]
                    })
                ],
                width: { size: 100, type: docxLib.WidthType.PERCENTAGE }
            });

            const doc = new docxLib.Document({
                sections: [{
                    children: [
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: "🧠 MoodTracker Pro Report",
                                    bold: true,
                                    size: 36,
                                    color: "00FF88"
                                })
                            ],
                            alignment: docxLib.AlignmentType.CENTER,
                            spacing: { after: 200 }
                        }),
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: `Generated on ${fullDate}`,
                                    size: 24,
                                    color: "888888",
                                    italics: true
                                })
                            ],
                            alignment: docxLib.AlignmentType.CENTER,
                            spacing: { after: 400 }
                        }),
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: "📊 Your Emotional Journey",
                                    bold: true,
                                    size: 32,
                                    color: "006644"
                                })
                            ],
                            spacing: { after: 300 }
                        }),
                        statsTable,
                        new docxLib.Paragraph({
                            children: [new docxLib.TextRun({ text: "", size: 24 })],
                            spacing: { after: 400 }
                        }),
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: "📝 Recent Mood Entries",
                                    bold: true,
                                    size: 32,
                                    color: "006644"
                                })
                            ],
                            spacing: { after: 300 }
                        }),
                        ...recentEntries.map(entry => {
                            const date = new Date(entry.date);
                            const formattedDate = date.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                            });
                            const moodEmoji = moodEmojis[entry.mood.value - 1];
                            
                            return [
                                new docxLib.Paragraph({
                                    children: [
                                        new docxLib.TextRun({
                                            text: `${moodEmoji} ${formattedDate} - ${entry.mood.label}`,
                                            bold: true,
                                            size: 26,
                                            color: "006644"
                                        })
                                    ],
                                    spacing: { after: 100 }
                                }),
                                ...(entry.note ? [new docxLib.Paragraph({
                                    children: [
                                        new docxLib.TextRun({
                                            text: `"${entry.note}"`,
                                            size: 22,
                                            italics: true,
                                            color: "444444"
                                        })
                                    ],
                                    spacing: { after: 100 }
                                })] : []),
                                ...(entry.tags.length > 0 ? [new docxLib.Paragraph({
                                    children: [
                                        new docxLib.TextRun({
                                            text: `Tags: ${entry.tags.join(', ')}`,
                                            size: 20,
                                            color: "888888"
                                        })
                                    ],
                                    spacing: { after: 200 }
                                })] : [new docxLib.Paragraph({
                                    children: [new docxLib.TextRun({ text: "", size: 20 })],
                                    spacing: { after: 200 }
                                })])
                            ];
                        }).flat(),
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: "🧠 Generated by MoodTracker Pro",
                                    bold: true,
                                    size: 24,
                                    color: "00FF88"
                                })
                            ],
                            alignment: docxLib.AlignmentType.CENTER,
                            spacing: { after: 200 }
                        }),
                        new docxLib.Paragraph({
                            children: [
                                new docxLib.TextRun({
                                    text: "Your mental health matters. For professional support, consult healthcare providers.",
                                    size: 20,
                                    color: "666666",
                                    italics: true
                                })
                            ],
                            alignment: docxLib.AlignmentType.CENTER
                        })
                    ]
                }]
            });

            docxLib.Packer.toBlob(doc).then(blob => {
                saveAs(blob, `mood-report-${timestamp}.docx`);
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? 'Word文档导出成功！' : 'Professional Word document exported successfully!';
                this.showToast(msg);
            }).catch(error => {
                console.error('DOCX export error:', error);
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? 'DOCX导出失败，请重试' : 'DOCX export failed. Please try again.';
                this.showToast(msg);
            });
        } catch (error) {
            console.error('DOCX creation error:', error);
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '创建DOCX文档失败，请重试' : 'Failed to create DOCX document. Please try again.';
            this.showToast(msg);
        }
    }

    // Fallback RTF export when DOCX library fails
    exportRTF(timestamp) {
        const stats = this.generateStats();
        const recentEntries = this.moodData.slice(-10).reverse();
        
        let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
        rtf += '\\f0\\fs24 ';
        
        // Title
        rtf += '{\\b\\fs32\\cf2 MoodTracker Pro Report}\\par\\par';
        
        // Date
        rtf += '{\\i Generated: ' + new Date().toLocaleDateString() + '}\\par\\par\\par';
        
        // Statistics
        rtf += '{\\b\\fs28 Statistics}\\par\\par';
        rtf += 'Total Entries: ' + stats.totalEntries + '\\par';
        rtf += 'Average Mood: ' + stats.averageMood + '/5\\par';
        rtf += 'Current Streak: ' + stats.currentStreak + ' days\\par';
        rtf += 'Mood Trend: ' + stats.moodTrend + '\\par\\par\\par';
        
        // Recent Entries
        rtf += '{\\b\\fs28 Recent Entries}\\par\\par';
        
        recentEntries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            rtf += '{\\b\\cf3 ' + date + ' - ' + entry.mood.label + '}\\par';
            
            if (entry.note) {
                rtf += entry.note.replace(/\n/g, '\\par') + '\\par';
            }
            
            if (entry.tags.length > 0) {
                rtf += '{\\i Tags: ' + entry.tags.join(', ') + '}\\par';
            }
            rtf += '\\par';
        });
        
        rtf += '}';
        
        const blob = new Blob([rtf], { type: 'application/rtf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-report-${timestamp}.rtf`;
        link.click();
        
        URL.revokeObjectURL(url);
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '文档已导出RTF格式！' : 'Document exported as RTF format (Word compatible)!';
        this.showToast(msg);
    }

    generateStats() {
        const totalEntries = this.moodData.length;
        const averageMood = totalEntries > 0 
            ? (this.moodData.reduce((sum, entry) => sum + entry.mood.value, 0) / totalEntries).toFixed(1)
            : '0.0';
        const currentStreak = this.calculateStreak();
        const moodTrend = this.calculateMoodTrend();
        
        return {
            totalEntries,
            averageMood,
            currentStreak,
            moodTrend
        };
    }

    clearData() {
        const currentLocale = i18n.getLocale();
        const confirmMsg = currentLocale === 'zh'
            ? '确定要清空所有心情数据吗？此操作不可恢复。'
            : 'Are you sure you want to clear all mood data? This action cannot be undone.';
        if (confirm(confirmMsg)) {
            this.moodData = [];
            this.saveMoodData();
            this.updateDashboard();
            this.generateInsights();
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '所有数据已清空！' : 'All data cleared successfully!';
            this.showToast(msg);
        }
    }

    // Auto Cleanup Functions
    toggleAutoCleanupMenu() {
        const menu = document.getElementById('autoCleanupMenu');
        menu.classList.toggle('show');
    }

    hideAutoCleanupMenu() {
        const menu = document.getElementById('autoCleanupMenu');
        menu.classList.remove('show');
    }

    setAutoCleanup(days) {
        this.autoCleanupDays = days;
        localStorage.setItem('moodTracker_autoCleanup', days.toString());
        this.updateAutoCleanupUI();
        
        const currentLocale = i18n.getLocale();
        if (days === 0) {
            const msg = currentLocale === 'zh' ? '自动清理已禁用' : 'Auto cleanup disabled';
            this.showToast(msg);
        } else {
            const label = this.getCleanupLabel(days);
            const msg = currentLocale === 'zh' ? `自动清理设置为${label}` : `Auto cleanup set to ${label}`;
            this.showToast(msg);
        }
        this.performAutoCleanup();
    }

    loadAutoCleanupSetting() {
        const saved = localStorage.getItem('moodTracker_autoCleanup');
        return saved ? parseInt(saved) : 0;
    }

    updateAutoCleanupUI() {
        const options = document.querySelectorAll('.cleanup-option');
        options.forEach(option => {
            const days = parseInt(option.dataset.days);
            if (days === this.autoCleanupDays) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Update button text
        const btn = document.getElementById('autoCleanupBtn');
        const label = this.getCleanupLabel(this.autoCleanupDays);
        btn.innerHTML = `
            <i class="fas fa-clock"></i>
            <span class="btn-text">Auto Clean: ${label}</span>
            <i class="fas fa-chevron-down"></i>
        `;
    }

    getCleanupLabel(days) {
        switch (days) {
            case 0: return 'Disabled';
            case 7: return '7 Days';
            case 30: return '30 Days';
            case 90: return '3 Months';
            case 365: return '1 Year';
            default: return `${days} Days`;
        }
    }

    performAutoCleanup() {
        if (this.autoCleanupDays === 0) return;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.autoCleanupDays);
        
        const originalCount = this.moodData.length;
        this.moodData = this.moodData.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= cutoffDate;
        });

        const removedCount = originalCount - this.moodData.length;
        if (removedCount > 0) {
            this.saveMoodData();
            this.updateDashboard();
            this.generateInsights();
            console.log(`Auto cleanup: Removed ${removedCount} old entries`);
        }
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateStats();
        this.updateRecentEntries();
        this.updateWeeklyChart();
        this.updateGoalsProgress();
        this.checkGoalReminders();
    }

    updateStats() {
        const totalEntries = this.moodData.length;
        const averageMoodNum = totalEntries > 0 
            ? this.moodData.reduce((sum, entry) => sum + entry.mood.value, 0) / totalEntries
            : 0;
        const averageMood = this.formatNumberLocalized(averageMoodNum, 1);
        
        const currentStreak = this.calculateStreak();
        const moodTrend = this.calculateMoodTrend();
        const bestDay = this.getBestDay();
        const worstDay = this.getWorstDay();
        const moodVariance = this.calculateMoodVariance();
        const totalTags = this.getTotalUniqueTags();

        // Update widgets safely (only if they exist)
        this.updateWidgetValue('totalEntries', this.formatNumberLocalized(totalEntries));
        this.updateWidgetValue('averageMood', averageMood);
        this.updateWidgetValue('currentStreak', this.formatNumberLocalized(currentStreak));
        this.updateWidgetValue('moodTrend', moodTrend);
        this.updateWidgetValue('bestDay', bestDay);
        this.updateWidgetValue('worstDay', worstDay);
        this.updateWidgetValue('moodVariance', moodVariance);
        this.updateWidgetValue('totalTags', this.formatNumberLocalized(totalTags));
    }
    
    updateWidgetValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
    
    getBestDay() {
        if (this.moodData.length === 0) return 'N/A';
        
        const bestEntry = this.moodData.reduce((best, entry) => 
            entry.mood.value > best.mood.value ? entry : best
        );
        
        const date = new Date(bestEntry.date);
        const currentLocale = i18n.getLocale();
        
        if (currentLocale === 'zh') {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    getWorstDay() {
        if (this.moodData.length === 0) return 'N/A';
        
        const worstEntry = this.moodData.reduce((worst, entry) => 
            entry.mood.value < worst.mood.value ? entry : worst
        );
        
        const date = new Date(worstEntry.date);
        const currentLocale = i18n.getLocale();
        
        if (currentLocale === 'zh') {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    calculateMoodVariance() {
        if (this.moodData.length === 0) return 'N/A';
        
        const values = this.moodData.map(entry => entry.mood.value);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        const currentLocale = i18n.getLocale();
        
        if (stdDev < 0.5) {
            return currentLocale === 'zh' ? '很稳定' : 'Very Stable';
        } else if (stdDev < 1.0) {
            return currentLocale === 'zh' ? '稳定' : 'Stable';
        } else if (stdDev < 1.5) {
            return currentLocale === 'zh' ? '中等' : 'Moderate';
        } else {
            return currentLocale === 'zh' ? '波动大' : 'High';
        }
    }
    
    getTotalUniqueTags() {
        const allTags = new Set();
        this.moodData.forEach(entry => {
            if (entry.tags) {
                entry.tags.forEach(tag => allTags.add(tag));
            }
        });
        return allTags.size;
    }

    calculateStreak() {
        if (this.moodData.length === 0) return 0;

        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const hasEntry = this.moodData.some(entry => 
                entry.date.split('T')[0] === dateStr
            );

            if (hasEntry) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    calculateMoodTrend() {
        if (this.moodData.length < 2) return 'Insufficient Data';

        const recent = this.moodData.slice(-7);
        const older = this.moodData.slice(-14, -7);

        if (older.length === 0) return 'Stable';

        const recentAvg = recent.reduce((sum, entry) => sum + entry.mood.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, entry) => sum + entry.mood.value, 0) / older.length;

        const diff = recentAvg - olderAvg;

        if (diff > 0.5) return 'Improving';
        if (diff < -0.5) return 'Declining';
        return 'Stable';
    }

    updateRecentEntries() {
        const container = document.getElementById('recentEntriesList');
        const recentEntries = this.moodData.slice(-5).reverse();

        if (recentEntries.length === 0) {
            const noEntriesText = typeof i18n !== 'undefined' ? i18n.t('noEntries') : 'No entries yet';
            container.innerHTML = `<p style="color: var(--gray-400); text-align: center;">${noEntriesText}</p>`;
            return;
        }

        container.innerHTML = recentEntries.map(entry => {
            const date = new Date(entry.date);
            const moodIcon = this.getMoodIcon(entry.mood.value);
            const formattedDate = this.formatRelativeTimeLocalized(entry.date);
            const hasImages = entry.images && entry.images.length > 0;
            const isChecked = this.selectedEntries.has(entry.id);
            
            return `
                <div class="entry-item" data-entry-id="${entry.id}" style="${this.batchModeEnabled ? 'padding-left: 3rem;' : ''}">
                    ${this.batchModeEnabled ? `
                        <div style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);">
                            <input type="checkbox" class="entry-checkbox" data-entry-id="${entry.id}" ${isChecked ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        </div>
                    ` : ''}
                    <div class="entry-content">
                        <div class="entry-date">${formattedDate}</div>
                        <div class="entry-mood">
                            <i class="${moodIcon}"></i>
                            <span>${entry.mood.label}</span>
                        </div>
                        ${entry.note ? `<div class="entry-note">${entry.note.substring(0, 100)}${entry.note.length > 100 ? '...' : ''}</div>` : ''}
                        ${entry.tags && entry.tags.length > 0 ? `
                            <div class="entry-tags" style="margin-top: 0.5rem; display: flex; gap: 0.25rem; flex-wrap: wrap;">
                                ${entry.tags.map(tag => `<span class="tag" style="background: rgba(0, 255, 136, 0.15); color: var(--primary-green); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${hasImages ? `
                            <div class="entry-images-preview">
                                ${entry.images.slice(0, 3).map(img => `
                                    <img src="${img.data}" alt="${img.name}" class="entry-thumbnail">
                                `).join('')}
                                ${entry.images.length > 3 ? `<span class="more-images">+${entry.images.length - 3}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                    ${!this.batchModeEnabled ? `
                        <div class="entry-actions">
                            <button class="entry-action-btn edit-btn" data-entry-id="${entry.id}" title="${typeof i18n !== 'undefined' ? i18n.t('edit') : 'Edit'}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="entry-action-btn delete-btn" data-entry-id="${entry.id}" title="${typeof i18n !== 'undefined' ? i18n.t('delete') : 'Delete'}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Add event listeners for edit and delete buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const entryId = parseInt(btn.dataset.entryId);
                this.editEntry(entryId);
            });
        });
        
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const entryId = parseInt(btn.dataset.entryId);
                this.deleteEntry(entryId);
            });
        });
        
        // Add click listeners for image thumbnails
        container.querySelectorAll('.entry-thumbnail').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showImageModal(img.src);
            });
        });
        
        // Add event listeners for checkboxes in batch mode
        if (this.batchModeEnabled) {
            container.querySelectorAll('.entry-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    const entryId = checkbox.dataset.entryId;
                    this.handleEntryCheckboxChange(entryId, checkbox.checked);
                });
            });
        }
    }

    getMoodIcon(moodValue) {
        const icons = {
            1: 'fas fa-sad-cry',
            2: 'fas fa-frown',
            3: 'fas fa-meh',
            4: 'fas fa-smile',
            5: 'fas fa-laugh-beam'
        };
        return icons[moodValue] || 'fas fa-meh';
    }

    // Edit Entry Function
    editEntry(entryId) {
        const entry = this.moodData.find(e => e.id === entryId);
        if (!entry) return;

        // Switch to tracker section
        this.showSection('tracker');
        this.updateNavigation(document.querySelector('[data-section="tracker"]'));

        // Populate form with entry data
        document.getElementById('moodNote').value = entry.note || '';

        // Select the mood button
        const moodBtn = document.querySelector(`.mood-btn[data-mood="${entry.mood.value}"]`);
        if (moodBtn) {
            this.selectMood(moodBtn);
        }

        // Select tags
        this.selectedTags.clear();
        entry.tags.forEach(tag => {
            const tagBtn = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
            if (tagBtn) {
                this.selectedTags.add(tag);
                tagBtn.classList.add('selected');
            }
        });

        // Store the entry ID for updating
        this.editingEntryId = entryId;

        // Update save button text
        const saveBtn = document.getElementById('saveMood');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Entry';

        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '编辑条目 - 修改后点击保存' : 'Editing entry - make your changes and save';
        this.showToast(msg);
    }

    // Delete Entry Function
    deleteEntry(entryId) {
        const entry = this.moodData.find(e => e.id === entryId);
        if (!entry) return;

        const currentLocale = i18n.getLocale();
        const date = new Date(entry.date).toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : 'en-US');
        const confirmMsg = currentLocale === 'zh'
            ? `确定要删除 ${date} 的条目 (${entry.mood.label}) 吗？`
            : `Are you sure you want to delete the entry from ${date} (${entry.mood.label})?`;
        if (confirm(confirmMsg)) {
            this.moodData = this.moodData.filter(e => e.id !== entryId);
            this.saveMoodData();
            this.updateDashboard();
            this.generateInsights();
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '条目已删除！' : 'Entry deleted successfully!';
            this.showToast(msg);
        }
    }

    // Personal Settings Menu Management
    togglePersonalMenu() {
        const menu = document.getElementById('personalMenu');
        menu.classList.toggle('show');
    }

    hidePersonalMenu() {
        const menu = document.getElementById('personalMenu');
        menu.classList.remove('show');
    }

    // Custom Mood Scale Modal
    showCustomMoodScaleModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '自定义心情量表' : 'Custom Mood Scale';
        const description = currentLocale === 'zh' ? '自定义您的心情等级标签和图标：' : 'Customize your mood scale labels and icons:';
        const saveBtn = currentLocale === 'zh' ? '保存更改' : 'Save Changes';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        const levelText = currentLocale === 'zh' ? '等级' : 'Level';
        
        // Load existing custom scale
        const customScale = JSON.parse(localStorage.getItem('customMoodScale') || '{}');
        const defaultLabels = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
        const defaultIcons = ['😭', '🙁', '😐', '🙂', '😄'];
        
        const modalHTML = `
            <div class="modal-overlay" id="customMoodScaleModal" style="display: flex;">
                <div class="modal-content" style="max-width: 650px; max-height: 90vh; display: flex; flex-direction: column;">
                    <div class="modal-header">
                        <h2><i class="fas fa-sliders-h"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('customMoodScaleModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${Array.from({length: 5}, (_, i) => i + 1).map(i => {
                                const label = customScale[i]?.label || defaultLabels[i-1];
                                const icon = customScale[i]?.icon || defaultIcons[i-1];
                                return `
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px;">
                                        <div style="min-width: 70px; padding: 0.5rem; background: rgba(0, 255, 136, 0.1); border-radius: 8px; text-align: center; color: var(--primary-green); font-weight: 600;">${levelText} ${i}</div>
                                        <input type="text" id="moodLabel${i}" placeholder="Enter mood label" value="${label}" 
                                               style="flex: 1; padding: 0.75rem; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 1rem;">
                                        <div style="display: flex; align-items: center;">
                                            <input type="text" id="moodIcon${i}" class="icon-input" value="${icon}" readonly 
                                                   style="width: 60px; padding: 0.75rem; text-align: center; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px 0 0 8px; color: var(--gray-300); font-size: 1.5rem; cursor: pointer;">
                                            <button type="button" class="icon-picker-btn" data-level="${i}" 
                                                    style="padding: 0.75rem 1rem; background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); border-left: none; border-radius: 0 8px 8px 0; color: var(--primary-green); cursor: pointer; transition: all 0.2s;">
                                                <i class="fas fa-chevron-down"></i>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('customMoodScaleModal').remove()">
                            ${cancelBtn}
                        </button>
                        <button class="btn-primary" id="saveCustomMoodScaleBtn">
                            <i class="fas fa-save"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('customMoodScaleModal');
        if (existingModal) existingModal.remove();
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup icon picker dropdowns
        this.setupIconPickers();
        
        // Add save button handler
        document.getElementById('saveCustomMoodScaleBtn').addEventListener('click', () => {
            this.saveCustomMoodScale();
        });
        
        // Close on overlay click
        document.getElementById('customMoodScaleModal').addEventListener('click', (e) => {
            if (e.target.id === 'customMoodScaleModal') {
                document.getElementById('customMoodScaleModal').remove();
            }
        });
    }

    setupIconPickers() {
        // Add event listeners for icon picker buttons
        document.querySelectorAll('.icon-picker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const level = btn.dataset.level;
                this.showIconPicker(level, btn);
            });
        });
    }

    showIconPicker(level, triggerBtn) {
        // Remove any existing picker
        const existingPicker = document.querySelector('.icon-picker-dropdown');
        if (existingPicker) {
            existingPicker.remove();
        }

        const iconOptions = [
            '😭', '😦', '😫', '🙁', '😐', '😵', '🙄', '🤔',
            '🙂', '😉', '😀', '😄', '😍', '🤩', '😊', '😌',
            '🥰', '😎', '🤗', '😇', '🥳', '😋', '🤤', '😴',
            '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🤯',
            '🥺', '😤', '😡', '😱', '😨', '😰', '🤑', '🤠'
        ];

        const picker = document.createElement('div');
        picker.className = 'icon-picker-dropdown';
        picker.innerHTML = `
            <div class="icon-picker-grid">
                ${iconOptions.map(icon => `
                    <button type="button" class="icon-option" data-icon="${icon}" data-level="${level}">
                        ${icon}
                    </button>
                `).join('')}
            </div>
        `;

        // Better positioning - next to the button
        const rect = triggerBtn.getBoundingClientRect();
        const modalRect = document.querySelector('.modal-content').getBoundingClientRect();
        
        picker.style.position = 'fixed';
        
        // Calculate optimal position
        let topPos = rect.bottom + 10;
        let leftPos = rect.left - 250;
        
        // Adjust if going off-screen
        if (topPos + 300 > window.innerHeight) {
            topPos = rect.top - 310;
        }
        if (leftPos < 20) {
            leftPos = 20;
        }
        if (leftPos + 320 > window.innerWidth) {
            leftPos = window.innerWidth - 340;
        }
        
        picker.style.top = `${topPos}px`;
        picker.style.left = `${leftPos}px`;
        picker.style.zIndex = '10001';

        document.body.appendChild(picker);

        // Add click handlers for icon options
        picker.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedIcon = option.dataset.icon;
                const targetLevel = option.dataset.level;
                const iconInput = document.getElementById(`moodIcon${targetLevel}`);
                if (iconInput) {
                    iconInput.value = selectedIcon;
                }
                picker.remove();
            });
        });

        // Close picker when clicking outside
        setTimeout(() => {
            const closeHandler = function(e) {
                if (!picker.contains(e.target) && !e.target.closest('.icon-picker-btn')) {
                    picker.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    createCustomMoodScaleModal() {
        const modal = document.createElement('div');
        modal.id = 'customMoodScaleModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Custom Mood Scale</h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Customize your mood scale labels and icons:</p>
                    <div class="mood-scale-editor">
                        ${Array.from({length: 5}, (_, i) => i + 1).map(i => `
                            <div class="mood-item-editor" data-mood="${i}">
                                <div class="mood-level-indicator">Level ${i}</div>
                                <input type="text" id="moodLabel${i}" placeholder="Enter mood label" value="${['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'][i-1]}">
                                <div class="icon-picker-container">
                                    <input type="text" id="moodIcon${i}" class="icon-input" value="${['😭', '🙁', '😐', '🙂', '😄'][i-1]}" readonly>
                                    <button type="button" class="icon-picker-btn" data-level="${i}">
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                    <button class="btn-primary" onclick="moodTracker.saveCustomMoodScale()">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveCustomMoodScale() {
        const customScale = {};
        for (let i = 1; i <= 5; i++) {
            const label = document.getElementById(`moodLabel${i}`).value;
            const icon = document.getElementById(`moodIcon${i}`).value;
            customScale[i] = { label, icon };
        }
        
        localStorage.setItem('customMoodScale', JSON.stringify(customScale));
        document.getElementById('customMoodScaleModal').remove();
        this.updateMoodButtons(); // Update buttons immediately
        
        const currentLocale = i18n.getLocale();
        const successMsg = currentLocale === 'zh' ? '自定义心情量表已保存！' : 'Custom mood scale saved!';
        this.showToast(successMsg);
    }

    updateMoodButtons() {
        const customScale = JSON.parse(localStorage.getItem('customMoodScale') || '{}');
        const selectedMood = this.currentMood;
        
        document.querySelectorAll('.mood-btn').forEach(btn => {
            const mood = btn.dataset.mood;
            if (customScale[mood]) {
                const iconSpan = btn.querySelector('.mood-icon');
                const textSpan = btn.querySelector('.mood-text');
                
                if (iconSpan) {
                    iconSpan.textContent = customScale[mood].icon;
                }
                if (textSpan) {
                    textSpan.textContent = customScale[mood].label;
                }
                btn.dataset.label = customScale[mood].label;
            }
            
            // Re-attach event listener to ensure it works after update
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                this.selectMood(newBtn);
            });
            
            newBtn.addEventListener('keydown', (e) => {
                this.handleMoodKeyboardNavigation(e, newBtn);
            });
            
            // Restore selected state if this was the selected mood
            if (selectedMood && parseInt(newBtn.dataset.mood) === selectedMood.value) {
                newBtn.classList.add('selected');
                newBtn.setAttribute('aria-checked', 'true');
                newBtn.setAttribute('tabindex', '0');
            }
        });
        
        // Update save button state
        this.updateSaveButton();
    }

    // Mood Reminders Modal
    showMoodRemindersModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '心情提醒' : 'Mood Reminders';
        const enableLabel = currentLocale === 'zh' ? '启用每日提醒' : 'Enable Daily Reminders';
        const timesLabel = currentLocale === 'zh' ? '提醒时间：' : 'Reminder Times:';
        const morningLabel = currentLocale === 'zh' ? '早晨' : 'Morning';
        const eveningLabel = currentLocale === 'zh' ? '晚上' : 'Evening';
        const messageLabel = currentLocale === 'zh' ? '提醒消息：' : 'Reminder Message:';
        const messagePlaceholder = currentLocale === 'zh' ? '今天感觉如何？花点时间记录您的心情。' : 'How are you feeling today? Take a moment to track your mood.';
        const saveBtn = currentLocale === 'zh' ? '保存设置' : 'Save Settings';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        
        // Load existing settings
        const settings = JSON.parse(localStorage.getItem('moodReminderSettings') || '{}');
        const enabled = settings.enabled || false;
        const morningTime = settings.morningTime || '09:00';
        const eveningTime = settings.eveningTime || '20:00';
        const message = settings.message || messagePlaceholder;
        
        const modalHTML = `
            <div class="modal-overlay" id="moodRemindersModal" style="display: flex;">
                <div class="modal-content" style="max-width: 550px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-bell"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('moodRemindersModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div class="reminder-settings">
                            <div class="setting-group" style="margin-bottom: 1.5rem;">
                                <label class="setting-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="enableReminders" ${enabled ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                                    <span style="color: var(--gray-300); font-weight: 500;">${enableLabel}</span>
                                </label>
                            </div>
                            <div class="setting-group" style="margin-bottom: 1.5rem;">
                                <label style="display: block; margin-bottom: 0.75rem; color: var(--gray-300); font-weight: 500;">${timesLabel}</label>
                                <div class="time-inputs" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                                    <input type="time" id="morningTime" value="${morningTime}" 
                                           style="flex: 1; padding: 0.75rem; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300);">
                                    <label style="color: var(--gray-400); min-width: 80px;">${morningLabel}</label>
                                </div>
                                <div class="time-inputs" style="display: flex; align-items: center; gap: 1rem;">
                                    <input type="time" id="eveningTime" value="${eveningTime}" 
                                           style="flex: 1; padding: 0.75rem; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300);">
                                    <label style="color: var(--gray-400); min-width: 80px;">${eveningLabel}</label>
                                </div>
                            </div>
                            <div class="setting-group">
                                <label style="display: block; margin-bottom: 0.75rem; color: var(--gray-300); font-weight: 500;">${messageLabel}</label>
                                <textarea id="reminderMessage" placeholder="${messagePlaceholder}" 
                                          style="width: 100%; min-height: 100px; padding: 0.75rem; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-family: inherit; resize: vertical;">${message}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('moodRemindersModal').remove()">
                            ${cancelBtn}
                        </button>
                        <button class="btn-primary" id="saveMoodRemindersBtn">
                            <i class="fas fa-save"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('moodRemindersModal');
        if (existingModal) existingModal.remove();
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add save button handler
        document.getElementById('saveMoodRemindersBtn').addEventListener('click', () => {
            this.saveMoodReminders();
        });
        
        // Close on overlay click
        document.getElementById('moodRemindersModal').addEventListener('click', (e) => {
            if (e.target.id === 'moodRemindersModal') {
                document.getElementById('moodRemindersModal').remove();
            }
        });
    }

    createMoodRemindersModal() {
        const modal = document.createElement('div');
        modal.id = 'moodRemindersModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Mood Reminders</h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="reminder-settings">
                        <div class="setting-group">
                            <label class="setting-label">
                                <input type="checkbox" id="enableReminders"> Enable Daily Reminders
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>Reminder Times:</label>
                            <div class="time-inputs">
                                <input type="time" id="morningTime" value="09:00">
                                <label>Morning</label>
                            </div>
                            <div class="time-inputs">
                                <input type="time" id="eveningTime" value="20:00">
                                <label>Evening</label>
                            </div>
                        </div>
                        <div class="setting-group">
                            <label>Reminder Message:</label>
                            <textarea id="reminderMessage" placeholder="How are you feeling today? Take a moment to track your mood.">How are you feeling today? Take a moment to track your mood.</textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                    <button class="btn-primary" onclick="moodTracker.saveMoodReminders()">Save Settings</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadReminderSettings();
    }

    loadReminderSettings() {
        const settings = JSON.parse(localStorage.getItem('moodReminderSettings') || '{}');
        if (settings.enabled) document.getElementById('enableReminders').checked = true;
        if (settings.morningTime) document.getElementById('morningTime').value = settings.morningTime;
        if (settings.eveningTime) document.getElementById('eveningTime').value = settings.eveningTime;
        if (settings.message) document.getElementById('reminderMessage').value = settings.message;
    }

    saveMoodReminders() {
        const settings = {
            enabled: document.getElementById('enableReminders').checked,
            morningTime: document.getElementById('morningTime').value,
            eveningTime: document.getElementById('eveningTime').value,
            message: document.getElementById('reminderMessage').value
        };
        
        localStorage.setItem('moodReminderSettings', JSON.stringify(settings));
        
        if (settings.enabled) {
            this.scheduleReminders(settings);
        } else {
            this.clearReminders();
        }
        
        document.getElementById('moodRemindersModal').remove();
        
        const currentLocale = i18n.getLocale();
        const successMsg = currentLocale === 'zh' ? '提醒设置已保存！' : 'Reminder settings saved!';
        this.showToast(successMsg);
    }

    scheduleReminders(settings) {
        // Clear existing reminders
        this.clearReminders();
        
        // Schedule new reminders
        this.scheduleNextReminder(settings.morningTime, settings.message);
        this.scheduleNextReminder(settings.eveningTime, settings.message);
    }

    scheduleNextReminder(time, message) {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        
        const timeoutId = setTimeout(() => {
            this.showReminderNotification(message);
            // Schedule next day's reminder
            this.scheduleNextReminder(time, message);
        }, timeUntilReminder);
        
        // Store timeout ID for cleanup
        if (!this.reminderTimeouts) this.reminderTimeouts = [];
        this.reminderTimeouts.push(timeoutId);
    }

    clearReminders() {
        if (this.reminderTimeouts) {
            this.reminderTimeouts.forEach(id => clearTimeout(id));
            this.reminderTimeouts = [];
        }
    }

    showReminderNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MoodTracker Pro', {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        } else {
            this.showToast(message);
        }
    }

    // Notification Settings Modal
    showNotificationSettingsModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '通知设置' : 'Notification Settings';
        const statusLabel = currentLocale === 'zh' ? '检查通知权限...' : 'Checking notification permissions...';
        const browserLabel = currentLocale === 'zh' ? '浏览器通知' : 'Browser Notifications';
        const soundLabel = currentLocale === 'zh' ? '声音通知' : 'Sound Notifications';
        const testBtn = currentLocale === 'zh' ? '测试通知' : 'Test Notification';
        const saveBtn = currentLocale === 'zh' ? '保存设置' : 'Save Settings';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        
        // Load existing settings
        const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        const browserChecked = settings.browser || false;
        const soundChecked = settings.sound || false;
        
        const modalHTML = `
            <div class="modal-overlay" id="notificationSettingsModal" style="display: flex;">
                <div class="modal-content" style="max-width: 550px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-cog"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('notificationSettingsModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div class="notification-status" style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(0, 255, 136, 0.05); border-radius: 8px; border: 1px solid rgba(0, 255, 136, 0.2);">
                            <p id="notificationStatus" style="margin: 0; color: var(--gray-300);">${statusLabel}</p>
                            <button id="requestPermission" class="btn-primary" style="display: none; margin-top: 0.75rem;">
                                <i class="fas fa-bell"></i> ${currentLocale === 'zh' ? '启用通知' : 'Enable Notifications'}
                            </button>
                        </div>
                        <div class="notification-options">
                            <div class="setting-group" style="margin-bottom: 1rem;">
                                <label class="setting-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="browserNotifications" ${browserChecked ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                                    <span style="color: var(--gray-300); font-weight: 500;">${browserLabel}</span>
                                </label>
                            </div>
                            <div class="setting-group" style="margin-bottom: 1.5rem;">
                                <label class="setting-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="soundNotifications" ${soundChecked ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                                    <span style="color: var(--gray-300); font-weight: 500;">${soundLabel}</span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <button class="btn-secondary" id="testNotificationBtn">
                                    <i class="fas fa-vial"></i> ${testBtn}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('notificationSettingsModal').remove()">
                            ${closeBtn}
                        </button>
                        <button class="btn-primary" id="saveNotificationSettingsBtn">
                            <i class="fas fa-save"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('notificationSettingsModal');
        if (existingModal) existingModal.remove();
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Check notification permission
        this.checkNotificationPermission();
        
        // Add test button handler
        document.getElementById('testNotificationBtn').addEventListener('click', () => {
            this.testNotification();
        });
        
        // Add save button handler
        document.getElementById('saveNotificationSettingsBtn').addEventListener('click', () => {
            this.saveNotificationSettings();
        });
        
        // Close on overlay click
        document.getElementById('notificationSettingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'notificationSettingsModal') {
                document.getElementById('notificationSettingsModal').remove();
            }
        });
    }

    createNotificationSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'notificationSettingsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Notification Settings</h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="notification-status">
                        <p id="notificationStatus">Checking notification permissions...</p>
                        <button id="requestPermission" class="btn-primary" style="display: none;">
                            Enable Notifications
                        </button>
                    </div>
                    <div class="notification-options">
                        <div class="setting-group">
                            <label class="setting-label">
                                <input type="checkbox" id="browserNotifications"> Browser Notifications
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">
                                <input type="checkbox" id="soundNotifications"> Sound Notifications
                            </label>
                        </div>
                        <div class="setting-group">
                            <button class="btn-secondary" onclick="moodTracker.testNotification()">
                                Test Notification
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">Close</button>
                    <button class="btn-primary" onclick="moodTracker.saveNotificationSettings()">Save Settings</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.checkNotificationPermission();
    }

    checkNotificationPermission() {
        const status = document.getElementById('notificationStatus');
        const button = document.getElementById('requestPermission');
        const currentLocale = i18n.getLocale();
        
        if (!status) return;
        
        if (!('Notification' in window)) {
            status.textContent = currentLocale === 'zh' ? '此浏览器不支持通知。' : 'This browser does not support notifications.';
            return;
        }
        
        switch (Notification.permission) {
            case 'granted':
                status.textContent = currentLocale === 'zh' ? '✅ 通知已启用' : '✅ Notifications are enabled';
                status.style.color = 'var(--primary-green)';
                break;
            case 'denied':
                status.textContent = currentLocale === 'zh' 
                    ? '❌ 通知已被阻止。请在浏览器设置中启用。' 
                    : '❌ Notifications are blocked. Please enable them in your browser settings.';
                status.style.color = '#ff4444';
                break;
            case 'default':
                status.textContent = currentLocale === 'zh' ? '⚠️ 尚未授予通知权限。' : '⚠️ Notification permission not granted yet.';
                status.style.color = '#ffaa00';
                if (button) {
                    button.style.display = 'block';
                    button.onclick = () => this.requestNotificationPermission();
                }
                break;
        }
    }

    requestNotificationPermission() {
        Notification.requestPermission().then(permission => {
            this.checkNotificationPermission();
        });
    }

    testNotification() {
        this.showReminderNotification('This is a test notification from MoodTracker Pro!');
    }

    saveNotificationSettings() {
        const settings = {
            browser: document.getElementById('browserNotifications').checked,
            sound: document.getElementById('soundNotifications').checked
        };
        
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        document.getElementById('notificationSettingsModal').remove();
        
        const currentLocale = i18n.getLocale();
        const successMsg = currentLocale === 'zh' ? '通知设置已保存！' : 'Notification settings saved!';
        this.showToast(successMsg);
    }

    // Initialize reminders on app start
    initializeReminders() {
        const settings = JSON.parse(localStorage.getItem('moodReminderSettings') || '{}');
        if (settings.enabled) {
            this.scheduleReminders(settings);
        }
    }
    
    // ==================== DASHBOARD CUSTOMIZATION ====================
    
    toggleCustomizeMode() {
        this.isCustomizeMode = !this.isCustomizeMode;
        const statsGrid = document.getElementById('statsGrid');
        const btn = document.getElementById('customizeLayoutBtn');
        const btnText = document.getElementById('customizeLayoutText');
        const currentLocale = i18n.getLocale();
        
        if (this.isCustomizeMode) {
            // Enter customize mode
            statsGrid.classList.add('customize-mode');
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            btnText.textContent = currentLocale === 'zh' ? '完成' : 'Done';
            btn.innerHTML = `<i class="fas fa-check"></i><span id="customizeLayoutText">${btnText.textContent}</span>`;
            
            // Show drag handles and enable dragging
            document.querySelectorAll('.stat-card').forEach(card => {
                card.draggable = true;
                const handle = card.querySelector('.drag-handle');
                if (handle) handle.style.display = 'block';
            });
            
            // Setup drag events
            this.setupDragEvents();
            
            const msg = currentLocale === 'zh' ? '拖动卡片以重新排列' : 'Drag cards to reorder';
            this.showToast(msg);
        } else {
            // Exit customize mode
            statsGrid.classList.remove('customize-mode');
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btnText.textContent = currentLocale === 'zh' ? '自定义' : 'Customize';
            btn.innerHTML = `<i class="fas fa-grip-vertical"></i><span id="customizeLayoutText">${btnText.textContent}</span>`;
            
            // Hide drag handles and disable dragging
            document.querySelectorAll('.stat-card').forEach(card => {
                card.draggable = false;
                const handle = card.querySelector('.drag-handle');
                if (handle) handle.style.display = 'none';
                card.classList.remove('dragging', 'drag-over');
            });
            
            // Save order
            this.saveWidgetOrder();
            
            const msg = currentLocale === 'zh' ? '布局已保存' : 'Layout saved';
            this.showToast(msg);
        }
    }
    
    setupDragEvents() {
        const cards = document.querySelectorAll('.stat-card');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
            card.addEventListener('dragover', (e) => this.handleDragOver(e));
            card.addEventListener('drop', (e) => this.handleDrop(e));
            card.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }
    
    handleDragStart(e) {
        this.draggedElement = e.currentTarget;
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    }
    
    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        
        // Remove all drag-over classes
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.remove('drag-over');
        });
    }
    
    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        
        e.dataTransfer.dropEffect = 'move';
        
        const targetCard = e.currentTarget;
        if (targetCard !== this.draggedElement) {
            targetCard.classList.add('drag-over');
        }
        
        return false;
    }
    
    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        
        const targetCard = e.currentTarget;
        
        if (this.draggedElement !== targetCard) {
            const statsGrid = document.getElementById('statsGrid');
            const allCards = [...statsGrid.querySelectorAll('.stat-card')];
            
            const draggedIndex = allCards.indexOf(this.draggedElement);
            const targetIndex = allCards.indexOf(targetCard);
            
            if (draggedIndex < targetIndex) {
                targetCard.parentNode.insertBefore(this.draggedElement, targetCard.nextSibling);
            } else {
                targetCard.parentNode.insertBefore(this.draggedElement, targetCard);
            }
        }
        
        targetCard.classList.remove('drag-over');
        
        return false;
    }
    
    saveWidgetOrder() {
        const statsGrid = document.getElementById('statsGrid');
        const cards = statsGrid.querySelectorAll('.stat-card');
        const order = Array.from(cards).map(card => card.dataset.widgetId);
        
        this.widgetOrder = order;
        localStorage.setItem('dashboardWidgetOrder', JSON.stringify(order));
    }
    
    loadWidgetOrder() {
        const savedOrder = JSON.parse(localStorage.getItem('dashboardWidgetOrder'));
        if (!savedOrder || savedOrder.length === 0) return;
        
        const statsGrid = document.getElementById('statsGrid');
        const cards = statsGrid.querySelectorAll('.stat-card');
        
        // Create a map of widget-id to card element
        const cardMap = {};
        cards.forEach(card => {
            cardMap[card.dataset.widgetId] = card;
        });
        
        // Reorder cards based on saved order
        savedOrder.forEach(widgetId => {
            if (cardMap[widgetId]) {
                statsGrid.appendChild(cardMap[widgetId]);
            }
        });
    }
    
    // Widget Manager
    showWidgetManager() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '管理小部件' : 'Manage Widgets';
        const description = currentLocale === 'zh' ? '选择要显示在仪表板上的统计小部件：' : 'Select which statistics widgets to display on your dashboard:';
        const saveBtn = currentLocale === 'zh' ? '应用更改' : 'Apply Changes';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        
        const widgetItems = Object.entries(this.availableWidgets).map(([id, widget]) => {
            const isActive = this.activeWidgets.includes(id);
            const labelText = currentLocale === 'zh' ? this.getWidgetLabelZh(id) : widget.label;
            
            return `
                <div class="widget-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; transition: all 0.2s;">
                    <input type="checkbox" id="widget-${id}" ${isActive ? 'checked' : ''} 
                           style="width: 20px; height: 20px; cursor: pointer;" data-widget-id="${id}">
                    <label for="widget-${id}" style="flex: 1; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: var(--gray-300);">
                        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(0, 255, 136, 0.1); border-radius: 8px; color: var(--primary-green);">
                            <i class="fas fa-${widget.icon}"></i>
                        </div>
                        <span style="font-weight: 500; font-size: 1rem;">${labelText}</span>
                    </label>
                </div>
            `;
        }).join('');
        
        const modalHTML = `
            <div class="modal-overlay" id="widgetManagerModal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-th"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('widgetManagerModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${widgetItems}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('widgetManagerModal').remove()">
                            ${closeBtn}
                        </button>
                        <button class="btn-primary" id="applyWidgetsBtn">
                            <i class="fas fa-check"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('widgetManagerModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('applyWidgetsBtn').addEventListener('click', () => {
            this.applyWidgetChanges();
        });
        
        document.getElementById('widgetManagerModal').addEventListener('click', (e) => {
            if (e.target.id === 'widgetManagerModal') {
                document.getElementById('widgetManagerModal').remove();
            }
        });
    }
    
    getWidgetLabelZh(widgetId) {
        const labels = {
            'total-entries': '总记录数',
            'average-mood': '平均心情',
            'current-streak': '当前连续',
            'mood-trend': '心情趋势',
            'best-day': '最佳日子',
            'worst-day': '最差日子',
            'mood-variance': '心情波动',
            'total-tags': '标签总数'
        };
        return labels[widgetId] || widgetId;
    }
    
    applyWidgetChanges() {
        const checkboxes = document.querySelectorAll('#widgetManagerModal input[type="checkbox"]');
        const newActiveWidgets = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                newActiveWidgets.push(checkbox.dataset.widgetId);
            }
        });
        
        if (newActiveWidgets.length === 0) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '至少需要选择一个小部件' : 'Please select at least one widget';
            this.showToast(msg);
            return;
        }
        
        this.activeWidgets = newActiveWidgets;
        localStorage.setItem('activeWidgets', JSON.stringify(newActiveWidgets));
        
        this.refreshDashboardWidgets();
        
        document.getElementById('widgetManagerModal').remove();
        
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '小部件已更新' : 'Widgets updated';
        this.showToast(msg);
    }
    
    refreshDashboardWidgets() {
        const statsGrid = document.getElementById('statsGrid');
        
        // Remove all existing widgets
        statsGrid.innerHTML = '';
        
        // Add active widgets
        this.activeWidgets.forEach(widgetId => {
            const widget = this.createWidget(widgetId);
            if (widget) {
                statsGrid.appendChild(widget);
            }
        });
        
        // Update stats
        this.updateStats();
    }
    
    createWidget(widgetId) {
        const widgetDef = this.availableWidgets[widgetId];
        if (!widgetDef) return null;
        
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.dataset.widgetId = widgetId;
        card.draggable = false;
        
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.style.display = 'none';
        dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
        
        const icon = document.createElement('div');
        icon.className = 'stat-icon';
        icon.innerHTML = `<i class="fas fa-${widgetDef.icon}"></i>`;
        
        const content = document.createElement('div');
        content.className = 'stat-content';
        
        const valueElement = document.createElement('h3');
        valueElement.id = this.getWidgetValueId(widgetId);
        valueElement.textContent = '0';
        
        const labelElement = document.createElement('p');
        const currentLocale = i18n.getLocale();
        labelElement.textContent = currentLocale === 'zh' ? this.getWidgetLabelZh(widgetId) : widgetDef.label;
        
        content.appendChild(valueElement);
        content.appendChild(labelElement);
        
        card.appendChild(dragHandle);
        card.appendChild(icon);
        card.appendChild(content);
        
        return card;
    }
    
    getWidgetValueId(widgetId) {
        const idMap = {
            'total-entries': 'totalEntries',
            'average-mood': 'averageMood',
            'current-streak': 'currentStreak',
            'mood-trend': 'moodTrend',
            'best-day': 'bestDay',
            'worst-day': 'worstDay',
            'mood-variance': 'moodVariance',
            'total-tags': 'totalTags'
        };
        return idMap[widgetId] || widgetId;
    }
    
    // ==================== THEME SYSTEM ====================
    
    showThemeSelector() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '选择主题' : 'Select Theme';
        const description = currentLocale === 'zh' ? '选择您喜欢的配色方案（所有主题均基于黑绿色调）：' : 'Choose your preferred color scheme (all themes maintain black-green aesthetics):';
        const currentLabel = currentLocale === 'zh' ? '当前主题' : 'Current Theme';
        const applyBtn = currentLocale === 'zh' ? '应用主题' : 'Apply Theme';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        
        const themeCards = Object.entries(this.availableThemes).map(([id, theme]) => {
            const isActive = this.currentTheme === id;
            const themeName = currentLocale === 'zh' ? theme.nameZh : theme.name;
            
            return `
                <div class="theme-card ${isActive ? 'active' : ''}" data-theme-id="${id}" 
                     style="position: relative; padding: 1.5rem; background: rgba(0, 0, 0, 0.4); border: 2px solid ${isActive ? theme.primary : 'rgba(255, 255, 255, 0.1)'}; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                    ${isActive ? `<div style="position: absolute; top: 10px; right: 10px; color: ${theme.primary};"><i class="fas fa-check-circle"></i></div>` : ''}
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); border-radius: 10px; box-shadow: 0 0 20px ${theme.primary}40;"></div>
                        <div>
                            <h4 style="color: ${theme.primary}; margin: 0; font-size: 1.1rem;">${themeName}</h4>
                            ${isActive ? `<span style="font-size: 0.85rem; color: var(--gray-400);">${currentLabel}</span>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <div style="flex: 1; height: 30px; background: ${theme.primary}; border-radius: 6px; opacity: 0.8;"></div>
                        <div style="flex: 1; height: 30px; background: ${theme.secondary}; border-radius: 6px; opacity: 0.6;"></div>
                        <div style="flex: 1; height: 30px; background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); border-radius: 6px; opacity: 0.4;"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        const modalHTML = `
            <div class="modal-overlay" id="themeSelectorModal" style="display: flex;">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-palette"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('themeSelectorModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                            ${themeCards}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('themeSelectorModal').remove()">
                            ${closeBtn}
                        </button>
                        <button class="btn-primary" id="applyThemeBtn">
                            <i class="fas fa-check"></i> ${applyBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('themeSelectorModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add click handlers for theme cards
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
        
        // Apply button handler
        document.getElementById('applyThemeBtn').addEventListener('click', () => {
            const selectedCard = document.querySelector('.theme-card.active');
            if (selectedCard) {
                const themeId = selectedCard.dataset.themeId;
                this.applyTheme(themeId);
                this.currentTheme = themeId;
                localStorage.setItem('appTheme', themeId);
                
                document.getElementById('themeSelectorModal').remove();
                
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? '主题已应用' : 'Theme applied';
                this.showToast(msg);
            }
        });
        
        // Close on overlay click
        document.getElementById('themeSelectorModal').addEventListener('click', (e) => {
            if (e.target.id === 'themeSelectorModal') {
                document.getElementById('themeSelectorModal').remove();
            }
        });
    }
    
    applyTheme(themeId) {
        const theme = this.availableThemes[themeId];
        if (!theme) return;
        
        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--primary-green', theme.primary);
        root.style.setProperty('--secondary-green', theme.secondary);
        root.style.setProperty('--neon-green', theme.primary);
        root.style.setProperty('--accent-green', theme.secondary);
        
        // Calculate tertiary color (lighter version)
        const tertiary = this.adjustColorBrightness(theme.primary, 30);
        root.style.setProperty('--tertiary-green', tertiary);
        
        // Update glow effects
        root.style.setProperty('--glow-primary', `0 0 30px ${theme.primary}50, 0 0 60px ${theme.primary}30`);
        root.style.setProperty('--glow-secondary', `0 0 20px ${theme.primary}40, 0 0 40px ${theme.primary}20`);
        root.style.setProperty('--glow-subtle', `0 0 10px ${theme.primary}20`);
    }
    
    adjustColorBrightness(hex, percent) {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // Adjust brightness
        const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
        const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
        const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    // ==================== WEBHOOK INTEGRATION ====================
    
    async triggerWebhook(eventType, data) {
        // Check if webhooks are enabled and configured
        if (!this.webhookEnabled || !this.webhookUrl) {
            return;
        }
        
        // Check if this event type is enabled
        if (!this.webhookEvents[eventType]) {
            return;
        }
        
        try {
            const payload = {
                event: eventType,
                timestamp: new Date().toISOString(),
                data: data,
                app: 'MoodTracker Pro',
                version: '1.0.0'
            };
            
            // Add signature if secret is configured
            if (this.webhookSecret) {
                payload.signature = await this.generateWebhookSignature(payload);
            }
            
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'MoodTracker-Pro/1.0'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log(`Webhook triggered: ${eventType}`);
            } else {
                console.warn(`Webhook failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Webhook error:', error);
        }
    }
    
    async generateWebhookSignature(payload) {
        // Simple hash for webhook signature
        const data = JSON.stringify(payload) + this.webhookSecret;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    checkConsecutiveLowMoods() {
        // Check last 3 entries for consecutive low moods
        const recentMoods = this.moodData.slice(-3);
        return recentMoods.filter(entry => entry.mood <= 2).length;
    }
    
    testWebhook() {
        const currentLocale = i18n?.getLocale() || 'en';
        
        if (!this.webhookUrl) {
            const msg = currentLocale === 'zh' ? '请先配置Webhook URL' : 'Please configure Webhook URL first';
            this.showToast(msg);
            return;
        }
        
        this.triggerWebhook('test', {
            message: currentLocale === 'zh' ? '这是一条测试消息' : 'This is a test message',
            timestamp: new Date().toISOString()
        });
        
        const msg = currentLocale === 'zh' ? '测试Webhook已发送！' : 'Test webhook sent!';
        this.showToast(msg);
    }
    
    saveWebhookSettings(settings) {
        this.webhookEnabled = settings.enabled;
        this.webhookUrl = settings.url;
        this.webhookEvents = settings.events;
        this.webhookSecret = settings.secret || '';
        
        localStorage.setItem('webhookEnabled', this.webhookEnabled);
        localStorage.setItem('webhookUrl', this.webhookUrl);
        localStorage.setItem('webhookEvents', JSON.stringify(this.webhookEvents));
        localStorage.setItem('webhookSecret', this.webhookSecret);
        
        const currentLocale = i18n?.getLocale() || 'en';
        const msg = currentLocale === 'zh' ? 'Webhook设置已保存！' : 'Webhook settings saved!';
        this.showToast(msg);
    }
    
    showWebhookSettings() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        let modal = document.getElementById('webhookSettingsModal');
        if (!modal) {
            modal = this.createWebhookSettingsModal();
            document.body.appendChild(modal);
        }
        
        // Update current settings display
        document.getElementById('webhookEnabled').checked = this.webhookEnabled;
        document.getElementById('webhookUrl').value = this.webhookUrl;
        document.getElementById('webhookSecret').value = this.webhookSecret;
        document.getElementById('eventMoodSaved').checked = this.webhookEvents.moodSaved;
        document.getElementById('eventStreakMilestone').checked = this.webhookEvents.streakMilestone;
        document.getElementById('eventLowMood').checked = this.webhookEvents.lowMoodDetected;
        
        modal.style.display = 'flex';
    }
    
    createWebhookSettingsModal() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        const modal = document.createElement('div');
        modal.id = 'webhookSettingsModal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content webhook-modal">
                <div class="modal-header">
                    <h2>
                        <i class="fas fa-webhook"></i>
                        ${isZh ? 'Webhook设置' : 'Webhook Settings'}
                    </h2>
                    <button class="modal-close" onclick="document.getElementById('webhookSettingsModal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="webhook-info">
                        <i class="fas fa-info-circle"></i>
                        <p>${isZh ? 'Webhook允许您在特定事件发生时向外部服务发送通知' : 'Webhooks allow you to send notifications to external services when specific events occur'}</p>
                    </div>
                    
                    <!-- Enable Toggle -->
                    <div class="setting-row">
                        <label class="setting-label">
                            <i class="fas fa-toggle-on"></i>
                            ${isZh ? '启用Webhook' : 'Enable Webhook'}
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="webhookEnabled">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Webhook URL -->
                    <div class="setting-row">
                        <label class="setting-label">
                            <i class="fas fa-link"></i>
                            ${isZh ? 'Webhook URL' : 'Webhook URL'}
                        </label>
                        <input type="url" id="webhookUrl" class="input-field" 
                               placeholder="https://your-webhook-url.com/endpoint">
                    </div>
                    
                    <!-- Secret (Optional) -->
                    <div class="setting-row">
                        <label class="setting-label">
                            <i class="fas fa-key"></i>
                            ${isZh ? '密钥（可选）' : 'Secret (Optional)'}
                        </label>
                        <input type="password" id="webhookSecret" class="input-field" 
                               placeholder="${isZh ? '用于签名验证' : 'For signature verification'}">
                    </div>
                    
                    <!-- Event Selection -->
                    <div class="setting-section">
                        <h3>${isZh ? '触发事件' : 'Trigger Events'}</h3>
                        <div class="event-list">
                            <label class="event-item">
                                <input type="checkbox" id="eventMoodSaved" checked>
                                <div class="event-info">
                                    <i class="fas fa-save"></i>
                                    <div>
                                        <strong>${isZh ? '心情保存' : 'Mood Saved'}</strong>
                                        <p>${isZh ? '每次保存心情记录时触发' : 'Triggered when a mood entry is saved'}</p>
                                    </div>
                                </div>
                            </label>
                            
                            <label class="event-item">
                                <input type="checkbox" id="eventStreakMilestone" checked>
                                <div class="event-info">
                                    <i class="fas fa-trophy"></i>
                                    <div>
                                        <strong>${isZh ? '连续记录里程碑' : 'Streak Milestone'}</strong>
                                        <p>${isZh ? '达成7/14/30/60/100天连续记录时触发' : 'Triggered at 7/14/30/60/100 day streaks'}</p>
                                    </div>
                                </div>
                            </label>
                            
                            <label class="event-item">
                                <input type="checkbox" id="eventLowMood">
                                <div class="event-info">
                                    <i class="fas fa-heart-broken"></i>
                                    <div>
                                        <strong>${isZh ? '低落心情检测' : 'Low Mood Detected'}</strong>
                                        <p>${isZh ? '记录低落心情(≤2)时触发' : 'Triggered when low mood (≤2) is recorded'}</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Popular Services -->
                    <div class="setting-section">
                        <h3>${isZh ? '热门服务' : 'Popular Services'}</h3>
                        <div class="service-buttons">
                            <button class="service-btn" data-service="discord">
                                <i class="fab fa-discord"></i>
                                Discord
                            </button>
                            <button class="service-btn" data-service="slack">
                                <i class="fab fa-slack"></i>
                                Slack
                            </button>
                            <button class="service-btn" data-service="ifttt">
                                <i class="fas fa-bolt"></i>
                                IFTTT
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="testWebhookBtn">
                        <i class="fas fa-vial"></i> ${isZh ? '测试' : 'Test'}
                    </button>
                    <button class="btn-secondary" onclick="document.getElementById('webhookSettingsModal').style.display='none'">
                        ${isZh ? '取消' : 'Cancel'}
                    </button>
                    <button class="btn-primary" id="saveWebhookBtn">
                        <i class="fas fa-save"></i> ${isZh ? '保存' : 'Save'}
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Save button
        modal.querySelector('#saveWebhookBtn').addEventListener('click', () => {
            const settings = {
                enabled: document.getElementById('webhookEnabled').checked,
                url: document.getElementById('webhookUrl').value.trim(),
                secret: document.getElementById('webhookSecret').value.trim(),
                events: {
                    moodSaved: document.getElementById('eventMoodSaved').checked,
                    streakMilestone: document.getElementById('eventStreakMilestone').checked,
                    lowMoodDetected: document.getElementById('eventLowMood').checked
                }
            };
            
            this.saveWebhookSettings(settings);
            modal.style.display = 'none';
        });
        
        // Test button
        modal.querySelector('#testWebhookBtn').addEventListener('click', () => {
            this.testWebhook();
        });
        
        // Service buttons
        modal.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                this.showWebhookServiceInfo(service);
            });
        });
        
        return modal;
    }
    
    showWebhookServiceInfo(service) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        const serviceInfo = {
            discord: {
                name: 'Discord',
                instructions: isZh 
                    ? '1. 在Discord服务器设置中创建Webhook\n2. 复制Webhook URL\n3. 粘贴到上方URL字段'
                    : '1. Create a Webhook in Discord Server Settings\n2. Copy the Webhook URL\n3. Paste it in the URL field above',
                url: 'https://support.discord.com/hc/en-us/articles/228383668'
            },
            slack: {
                name: 'Slack',
                instructions: isZh
                    ? '1. 在Slack中创建新的Incoming Webhook\n2. 选择频道\n3. 复制Webhook URL'
                    : '1. Create a new Incoming Webhook in Slack\n2. Choose a channel\n3. Copy the Webhook URL',
                url: 'https://api.slack.com/messaging/webhooks'
            },
            ifttt: {
                name: 'IFTTT',
                instructions: isZh
                    ? '1. 在IFTTT中创建新的Applet\n2. 选择Webhooks作为触发器\n3. 复制Webhook URL'
                    : '1. Create a new Applet in IFTTT\n2. Choose Webhooks as trigger\n3. Copy the Webhook URL',
                url: 'https://ifttt.com/maker_webhooks'
            }
        };
        
        const info = serviceInfo[service];
        if (info) {
            alert(`${info.name}\n\n${info.instructions}\n\n${isZh ? '了解更多' : 'Learn more'}: ${info.url}`);
        }
    }
    
    // ==================== WELLNESS CENTER ====================
    
    initWellnessCenter() {
        // Wellness tab switching
        document.querySelectorAll('.wellness-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.wellnessTab;
                this.switchWellnessTab(targetTab);
            });
        });
        
        // Initialize breathing exercise
        this.initBreathingExercise();
        
        // Initialize meditation library
        this.initMeditationLibrary();
        
        // Initialize resources
        this.initHealthResources();
        
        // Initialize music player
        this.initMusicPlayer();
    }
    
    switchWellnessTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.wellness-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.wellnessTab === tabName);
        });
        
        // Update content panels
        document.querySelectorAll('.wellness-content').forEach(content => {
            content.classList.toggle('active', content.dataset.wellnessContent === tabName);
        });
    }
    
    // ==================== BREATHING EXERCISE ====================
    
    initBreathingExercise() {
        this.breathingActive = false;
        this.breathingInterval = null;
        
        const startBtn = document.getElementById('startBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startBreathing());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopBreathing());
        }
    }
    
    startBreathing() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        // Get settings
        const inhaleTime = parseInt(document.getElementById('inhaleTime').value) * 1000;
        const holdTime = parseInt(document.getElementById('holdTime').value) * 1000;
        const exhaleTime = parseInt(document.getElementById('exhaleTime').value) * 1000;
        
        this.breathingActive = true;
        
        // Update UI
        document.getElementById('startBreathingBtn').style.display = 'none';
        document.getElementById('stopBreathingBtn').style.display = 'inline-flex';
        
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        
        // Breathing cycle
        const breatheCycle = () => {
            if (!this.breathingActive) return;
            
            // Inhale phase
            circle.style.transform = 'scale(1.5)';
            circle.style.transition = `transform ${inhaleTime}ms ease-in-out`;
            text.textContent = isZh ? '吸气' : 'Inhale';
            circle.style.background = 'radial-gradient(circle, rgba(0, 255, 136, 0.3), rgba(0, 255, 136, 0.1))';
            
            setTimeout(() => {
                if (!this.breathingActive) return;
                
                // Hold phase
                text.textContent = isZh ? '保持' : 'Hold';
                circle.style.background = 'radial-gradient(circle, rgba(0, 204, 255, 0.3), rgba(0, 204, 255, 0.1))';
                
                setTimeout(() => {
                    if (!this.breathingActive) return;
                    
                    // Exhale phase
                    circle.style.transform = 'scale(1)';
                    circle.style.transition = `transform ${exhaleTime}ms ease-in-out`;
                    text.textContent = isZh ? '呼气' : 'Exhale';
                    circle.style.background = 'radial-gradient(circle, rgba(138, 43, 226, 0.3), rgba(138, 43, 226, 0.1))';
                    
                    setTimeout(() => {
                        if (!this.breathingActive) return;
                        breatheCycle(); // Continue cycle
                    }, exhaleTime);
                }, holdTime);
            }, inhaleTime);
        };
        
        breatheCycle();
    }
    
    stopBreathing() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        this.breathingActive = false;
        
        // Reset UI
        document.getElementById('startBreathingBtn').style.display = 'inline-flex';
        document.getElementById('stopBreathingBtn').style.display = 'none';
        
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        
        circle.style.transform = 'scale(1)';
        circle.style.transition = 'transform 0.5s ease-in-out';
        text.textContent = isZh ? '呼吸' : 'Breathe';
        circle.style.background = 'radial-gradient(circle, rgba(0, 255, 136, 0.2), transparent)';
    }
    
    // ==================== MEDITATION LIBRARY ====================
    
    initMeditationLibrary() {
        const meditations = [
            {
                id: 1,
                title: 'Mindful Breathing',
                titleZh: '正念呼吸',
                duration: '5 min',
                type: 'Beginner',
                typeZh: '初级',
                description: 'A simple guided meditation focusing on breath awareness',
                descriptionZh: '专注于呼吸觉知的简单引导冥想',
                audioUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
                icon: 'fas fa-wind'
            },
            {
                id: 2,
                title: 'Body Scan',
                titleZh: '身体扫描',
                duration: '10 min',
                type: 'Intermediate',
                typeZh: '中级',
                description: 'Progressive relaxation through body awareness',
                descriptionZh: '通过身体觉知的渐进式放松',
                audioUrl: 'https://www.youtube.com/watch?v=ihO02wUzgkc',
                icon: 'fas fa-user'
            },
            {
                id: 3,
                title: 'Loving Kindness',
                titleZh: '慈爱冥想',
                duration: '8 min',
                type: 'Intermediate',
                typeZh: '中级',
                description: 'Cultivate compassion for yourself and others',
                descriptionZh: '培养对自己和他人的慈悲心',
                audioUrl: 'https://www.youtube.com/watch?v=sz7cpV7ERsM',
                icon: 'fas fa-heart'
            },
            {
                id: 4,
                title: 'Sleep Meditation',
                titleZh: '睡眠冥想',
                duration: '15 min',
                type: 'All Levels',
                typeZh: '所有级别',
                description: 'Deep relaxation to help you fall asleep',
                descriptionZh: '深度放松帮助入睡',
                audioUrl: 'https://www.youtube.com/watch?v=aEqlQvczMJQ',
                icon: 'fas fa-moon'
            },
            {
                id: 5,
                title: 'Stress Relief',
                titleZh: '压力释放',
                duration: '12 min',
                type: 'All Levels',
                typeZh: '所有级别',
                description: 'Release tension and anxiety',
                descriptionZh: '释放紧张和焦虑',
                audioUrl: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
                icon: 'fas fa-spa'
            },
            {
                id: 6,
                title: 'Morning Energy',
                titleZh: '晨间活力',
                duration: '7 min',
                type: 'Beginner',
                typeZh: '初级',
                description: 'Start your day with positive energy',
                descriptionZh: '以积极能量开始新的一天',
                audioUrl: 'https://www.youtube.com/watch?v=EOvObEKh5V8',
                icon: 'fas fa-sun'
            }
        ];
        
        this.renderMeditations(meditations);
    }
    
    renderMeditations(meditations) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        const container = document.getElementById('meditationGrid');
        
        if (!container) return;
        
        let html = '';
        
        meditations.forEach(med => {
            html += `
                <div class="meditation-card">
                    <div class="meditation-icon">
                        <i class="${med.icon}"></i>
                    </div>
                    <div class="meditation-info">
                        <h3>${isZh ? med.titleZh : med.title}</h3>
                        <div class="meditation-meta">
                            <span class="meditation-duration"><i class="fas fa-clock"></i> ${med.duration}</span>
                            <span class="meditation-type">${isZh ? med.typeZh : med.type}</span>
                        </div>
                        <p>${isZh ? med.descriptionZh : med.description}</p>
                    </div>
                    <button class="btn-primary meditation-play-btn" data-audio-url="${med.audioUrl}">
                        <i class="fab fa-youtube"></i> ${isZh ? '播放' : 'Play'}
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners
        container.querySelectorAll('.meditation-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const audioUrl = btn.dataset.audioUrl;
                window.open(audioUrl, '_blank');
            });
        });
    }
    
    // ==================== HEALTH RESOURCES ====================
    
    initHealthResources() {
        const resources = [
            {
                id: 1,
                title: 'Understanding Anxiety',
                titleZh: '理解焦虑',
                category: 'Mental Health',
                categoryZh: '心理健康',
                description: 'Learn about anxiety disorders and coping strategies',
                descriptionZh: '了解焦虑症及应对策略',
                url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
                icon: 'fas fa-brain',
                color: '#ff6b6b'
            },
            {
                id: 2,
                title: 'Depression Support',
                titleZh: '抑郁症支持',
                category: 'Mental Health',
                categoryZh: '心理健康',
                description: 'Resources and support for managing depression',
                descriptionZh: '管理抑郁症的资源和支持',
                url: 'https://www.nimh.nih.gov/health/topics/depression',
                icon: 'fas fa-heart-broken',
                color: '#4ecdc4'
            },
            {
                id: 3,
                title: 'Stress Management',
                titleZh: '压力管理',
                category: 'Wellness',
                categoryZh: '健康',
                description: 'Effective techniques for managing daily stress',
                descriptionZh: '管理日常压力的有效技巧',
                url: 'https://www.apa.org/topics/stress',
                icon: 'fas fa-weight-hanging',
                color: '#95e1d3'
            },
            {
                id: 4,
                title: 'Sleep Hygiene',
                titleZh: '睡眠卫生',
                category: 'Wellness',
                categoryZh: '健康',
                description: 'Tips for better sleep quality',
                descriptionZh: '改善睡眠质量的建议',
                url: 'https://www.sleepfoundation.org/sleep-hygiene',
                icon: 'fas fa-bed',
                color: '#a8e6cf'
            },
            {
                id: 5,
                title: 'Mindfulness Practices',
                titleZh: '正念练习',
                category: 'Meditation',
                categoryZh: '冥想',
                description: 'Introduction to mindfulness and meditation',
                descriptionZh: '正念和冥想入门',
                url: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
                icon: 'fas fa-om',
                color: '#ffd93d'
            },
            {
                id: 6,
                title: 'Healthy Relationships',
                titleZh: '健康关系',
                category: 'Social',
                categoryZh: '社交',
                description: 'Building and maintaining healthy relationships',
                descriptionZh: '建立和维持健康的人际关系',
                url: 'https://www.psychologytoday.com/us/basics/relationships',
                icon: 'fas fa-users',
                color: '#ffaaa5'
            },
            {
                id: 7,
                title: 'Self-Care Basics',
                titleZh: '自我关怀基础',
                category: 'Wellness',
                categoryZh: '健康',
                description: 'Essential self-care practices for mental health',
                descriptionZh: '心理健康的基本自我关怀实践',
                url: 'https://www.mentalhealth.org.uk/our-work/public-engagement/self-care',
                icon: 'fas fa-hand-holding-heart',
                color: '#ff8b94'
            },
            {
                id: 8,
                title: 'Crisis Resources',
                titleZh: '危机资源',
                category: 'Emergency',
                categoryZh: '紧急',
                description: 'Immediate help and crisis hotlines',
                descriptionZh: '即时帮助和危机热线',
                url: 'https://988lifeline.org/',
                icon: 'fas fa-phone-volume',
                color: '#ff6b6b'
            }
        ];
        
        this.renderHealthResources(resources);
    }
    
    renderHealthResources(resources) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        const container = document.getElementById('resourcesGrid');
        
        if (!container) return;
        
        let html = '';
        
        resources.forEach(res => {
            html += `
                <div class="resource-card" style="--resource-color: ${res.color}">
                    <div class="resource-icon">
                        <i class="${res.icon}"></i>
                    </div>
                    <div class="resource-info">
                        <div class="resource-category">${isZh ? res.categoryZh : res.category}</div>
                        <h3>${isZh ? res.titleZh : res.title}</h3>
                        <p>${isZh ? res.descriptionZh : res.description}</p>
                    </div>
                    <button class="btn-secondary resource-link-btn" data-url="${res.url}">
                        <i class="fas fa-external-link-alt"></i> ${isZh ? '查看' : 'View'}
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners
        container.querySelectorAll('.resource-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.url;
                window.open(url, '_blank');
            });
        });
    }
    
    // ==================== USER HELP SYSTEM ====================
    
    initHelpSystem() {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        
        if (!hasSeenOnboarding) {
            // Show onboarding tour after a short delay
            setTimeout(() => this.startOnboarding(), 1000);
        }
        
        // Help center button
        const helpBtn = document.getElementById('helpCenterBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelpCenter());
        }
        
        // Onboarding controls
        document.getElementById('onboardingNext')?.addEventListener('click', () => this.nextOnboardingStep());
        document.getElementById('onboardingPrev')?.addEventListener('click', () => this.prevOnboardingStep());
        document.getElementById('onboardingSkip')?.addEventListener('click', () => this.skipOnboarding());
        document.getElementById('onboardingClose')?.addEventListener('click', () => this.skipOnboarding());
    }
    
    // ==================== ONBOARDING TOUR ====================
    
    startOnboarding() {
        this.onboardingStep = 0;
        this.onboardingSteps = [
            {
                target: '.nav-link[data-section="dashboard"]',
                title: 'Dashboard',
                titleZh: '仪表盘',
                message: 'View your mood statistics and trends on the dashboard',
                messageZh: '在仪表盘查看您的心情统计和趋势',
                position: 'bottom'
            },
            {
                target: '.nav-link[data-section="tracker"]',
                title: 'Track Your Mood',
                titleZh: '记录心情',
                message: 'Click here to record your daily mood with notes and tags',
                messageZh: '点击这里记录每天的心情，添加笔记和标签',
                position: 'bottom'
            },
            {
                target: '.nav-link[data-section="analytics"]',
                title: 'Analytics',
                titleZh: '分析',
                message: 'Explore detailed charts and insights about your emotional patterns',
                messageZh: '探索关于情绪模式的详细图表和洞察',
                position: 'bottom'
            },
            {
                target: '.nav-link[data-section="wellness"]',
                title: 'Wellness Center',
                titleZh: '健康中心',
                message: 'Access breathing exercises, meditation, and mental health resources',
                messageZh: '访问呼吸练习、冥想和心理健康资源',
                position: 'bottom'
            },
            {
                target: '#exportDropdownBtn',
                title: 'Export Your Data',
                titleZh: '导出数据',
                message: 'Export your mood data in various formats (CSV, PDF, iCal)',
                messageZh: '以多种格式导出心情数据（CSV、PDF、iCal）',
                position: 'bottom-left'
            },
            {
                target: '#helpCenterBtn',
                title: 'Help Center',
                titleZh: '帮助中心',
                message: 'Need help? Access tutorials, FAQs, and contact support anytime',
                messageZh: '需要帮助？随时访问教程、常见问题和联系支持',
                position: 'bottom-left'
            }
        ];
        
        this.showOnboardingStep(0);
    }
    
    showOnboardingStep(stepIndex) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        if (stepIndex < 0 || stepIndex >= this.onboardingSteps.length) {
            this.completeOnboarding();
            return;
        }
        
        this.onboardingStep = stepIndex;
        const step = this.onboardingSteps[stepIndex];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextOnboardingStep();
            return;
        }
        
        // Show overlay
        const overlay = document.getElementById('onboardingOverlay');
        overlay.style.display = 'block';
        
        // Position spotlight
        const rect = target.getBoundingClientRect();
        const spotlight = overlay.querySelector('.onboarding-spotlight');
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
        
        // Position tooltip
        const tooltip = overlay.querySelector('.onboarding-tooltip');
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = rect.bottom + 20;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Adjust position based on step.position
        if (step.position === 'bottom-left') {
            left = rect.right - tooltipRect.width;
        }
        
        // Keep tooltip within viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = rect.top - tooltipRect.height - 20;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        
        // Update content
        document.getElementById('onboardingTitle').textContent = isZh ? step.titleZh : step.title;
        document.getElementById('onboardingMessage').textContent = isZh ? step.messageZh : step.message;
        document.getElementById('onboardingStep').textContent = `${stepIndex + 1} / ${this.onboardingSteps.length}`;
        
        // Update buttons
        const prevBtn = document.getElementById('onboardingPrev');
        const nextBtn = document.getElementById('onboardingNext');
        
        prevBtn.style.display = stepIndex > 0 ? 'inline-flex' : 'none';
        nextBtn.textContent = stepIndex === this.onboardingSteps.length - 1 
            ? (isZh ? '完成' : 'Finish') 
            : (isZh ? '下一步' : 'Next');
    }
    
    nextOnboardingStep() {
        this.showOnboardingStep(this.onboardingStep + 1);
    }
    
    prevOnboardingStep() {
        this.showOnboardingStep(this.onboardingStep - 1);
    }
    
    skipOnboarding() {
        this.completeOnboarding();
    }
    
    completeOnboarding() {
        const overlay = document.getElementById('onboardingOverlay');
        overlay.style.display = 'none';
        localStorage.setItem('hasSeenOnboarding', 'true');
    }
    
    // ==================== HELP CENTER ====================
    
    showHelpCenter() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        let modal = document.getElementById('helpCenterModal');
        if (!modal) {
            modal = this.createHelpCenterModal();
            document.body.appendChild(modal);
        }
        
        // Display modal with proper positioning
        modal.style.display = 'flex';
        
        // Update content based on language
        this.updateHelpCenterContent(isZh);
    }
    
    createHelpCenterModal() {
        const modal = document.createElement('div');
        modal.id = 'helpCenterModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content help-center-modal">
                <div class="modal-header">
                    <h2 id="helpCenterTitle">Help Center</h2>
                    <button class="modal-close" id="helpCenterClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="help-tabs">
                        <button class="help-tab active" data-tab="getting-started">
                            <i class="fas fa-rocket"></i>
                            <span>Getting Started</span>
                        </button>
                        <button class="help-tab" data-tab="features">
                            <i class="fas fa-star"></i>
                            <span>Features</span>
                        </button>
                        <button class="help-tab" data-tab="faq">
                            <i class="fas fa-question-circle"></i>
                            <span>FAQ</span>
                        </button>
                        <button class="help-tab" data-tab="tutorials">
                            <i class="fas fa-video"></i>
                            <span>Tutorials</span>
                        </button>
                        <button class="help-tab" data-tab="feedback">
                            <i class="fas fa-comment-dots"></i>
                            <span>Feedback</span>
                        </button>
                    </div>
                    
                    <div class="help-content">
                        <div class="help-panel active" data-panel="getting-started" id="gettingStartedPanel"></div>
                        <div class="help-panel" data-panel="features" id="featuresPanel"></div>
                        <div class="help-panel" data-panel="faq" id="faqPanel"></div>
                        <div class="help-panel" data-panel="tutorials" id="tutorialsPanel"></div>
                        <div class="help-panel" data-panel="feedback" id="feedbackPanel"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.querySelector('#helpCenterClose').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Tab switching
        modal.querySelectorAll('.help-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                modal.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.help-panel').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                modal.querySelector(`[data-panel="${tabName}"]`).classList.add('active');
            });
        });
        
        return modal;
    }
    
    updateHelpCenterContent(isZh) {
        // Getting Started
        document.getElementById('gettingStartedPanel').innerHTML = isZh ? `
            <h3>快速开始</h3>
            <div class="help-section">
                <h4><i class="fas fa-play-circle"></i> 欢迎使用 MoodTracker Pro</h4>
                <p>MoodTracker Pro 是一个全面的情绪追踪和心理健康应用，帮助您：</p>
                <ul>
                    <li>📊 记录和追踪每日心情</li>
                    <li>📈 分析情绪模式和趋势</li>
                    <li>🧘 访问健康资源和练习</li>
                    <li>📤 导出和备份数据</li>
                </ul>
            </div>
            <div class="help-section">
                <h4><i class="fas fa-lightbulb"></i> 基础操作</h4>
                <ol>
                    <li><strong>记录心情：</strong>点击 "Track Mood" 选择心情等级，添加笔记和标签</li>
                    <li><strong>查看统计：</strong>在 "Dashboard" 查看心情趋势图表</li>
                    <li><strong>深度分析：</strong>在 "Analytics" 探索详细的数据分析</li>
                    <li><strong>健康资源：</strong>访问 "Wellness" 使用呼吸练习和冥想</li>
                </ol>
            </div>
            <div class="help-section">
                <button class="btn-primary" onclick="moodTracker.startOnboarding()">
                    <i class="fas fa-redo"></i> 重新开始引导教程
                </button>
            </div>
        ` : `
            <h3>Getting Started</h3>
            <div class="help-section">
                <h4><i class="fas fa-play-circle"></i> Welcome to MoodTracker Pro</h4>
                <p>MoodTracker Pro is a comprehensive mood tracking and mental health app that helps you:</p>
                <ul>
                    <li>📊 Track and record daily moods</li>
                    <li>📈 Analyze emotional patterns and trends</li>
                    <li>🧘 Access wellness resources and exercises</li>
                    <li>📤 Export and backup your data</li>
                </ul>
            </div>
            <div class="help-section">
                <h4><i class="fas fa-lightbulb"></i> Basic Operations</h4>
                <ol>
                    <li><strong>Track Mood:</strong> Click "Track Mood" to select mood level, add notes and tags</li>
                    <li><strong>View Stats:</strong> Check mood trends on the "Dashboard"</li>
                    <li><strong>Deep Analysis:</strong> Explore detailed analytics in "Analytics"</li>
                    <li><strong>Wellness:</strong> Visit "Wellness" for breathing exercises and meditation</li>
                </ol>
            </div>
            <div class="help-section">
                <button class="btn-primary" onclick="moodTracker.startOnboarding()">
                    <i class="fas fa-redo"></i> Restart Tour
                </button>
            </div>
        `;
        
        // Features (to be continued in next step)
        this.updateFeaturesPanel(isZh);
        this.updateFAQPanel(isZh);
        this.updateTutorialsPanel(isZh);
        this.updateFeedbackPanel(isZh);
    }
    
    updateFeaturesPanel(isZh) {
        document.getElementById('featuresPanel').innerHTML = isZh ? `
            <h3>功能介绍</h3>
            <div class="feature-grid">
                <div class="feature-item">
                    <i class="fas fa-chart-line"></i>
                    <h4>心情追踪</h4>
                    <p>记录每日心情等级、添加笔记和标签，支持语音输入</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-analytics"></i>
                    <h4>数据分析</h4>
                    <p>热力图、趋势图、标签分析等多维度数据可视化</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-brain"></i>
                    <h4>AI 洞察</h4>
                    <p>智能分析情绪模式，提供个性化建议</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-spa"></i>
                    <h4>健康资源</h4>
                    <p>呼吸练习、冥想指导、放松音乐、心理健康资源</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-download"></i>
                    <h4>数据导出</h4>
                    <p>支持CSV、PDF、Word、iCal等多种格式导出</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-webhook"></i>
                    <h4>第三方集成</h4>
                    <p>Webhook、插件系统，支持扩展功能</p>
                </div>
            </div>
        ` : `
            <h3>Features</h3>
            <div class="feature-grid">
                <div class="feature-item">
                    <i class="fas fa-chart-line"></i>
                    <h4>Mood Tracking</h4>
                    <p>Record daily mood levels, add notes and tags, voice input supported</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-analytics"></i>
                    <h4>Data Analytics</h4>
                    <p>Heatmaps, trend charts, tag analysis and multi-dimensional visualization</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-brain"></i>
                    <h4>AI Insights</h4>
                    <p>Smart pattern analysis with personalized recommendations</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-spa"></i>
                    <h4>Wellness Resources</h4>
                    <p>Breathing exercises, meditation guides, relaxation music, mental health resources</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-download"></i>
                    <h4>Data Export</h4>
                    <p>Export in multiple formats: CSV, PDF, Word, iCal</p>
                </div>
                <div class="feature-item">
                    <i class="fas fa-webhook"></i>
                    <h4>Third-party Integration</h4>
                    <p>Webhooks and plugin system for extended functionality</p>
                </div>
            </div>
        `;
    }
    
    updateFAQPanel(isZh) {
        if (typeof updateFAQPanel === 'function') {
            updateFAQPanel(isZh);
        }
    }
    
    updateTutorialsPanel(isZh) {
        if (typeof updateTutorialsPanel === 'function') {
            updateTutorialsPanel(isZh);
        }
    }
    
    updateFeedbackPanel(isZh) {
        if (typeof updateFeedbackPanel === 'function') {
            updateFeedbackPanel(isZh);
        }
    }
    
    sendFeedback() {
        const type = document.getElementById('feedbackType')?.value;
        const subject = document.getElementById('feedbackSubject')?.value;
        const message = document.getElementById('feedbackMessage')?.value;
        
        if (!subject || !message) {
            const currentLocale = i18n?.getLocale() || 'en';
            const isZh = currentLocale === 'zh';
            this.showToast(isZh ? '请填写标题和详细描述' : 'Please fill in subject and details');
            return;
        }
        
        // Create mailto link
        const emailSubject = encodeURIComponent(`[${type.toUpperCase()}] ${subject}`);
        const emailBody = encodeURIComponent(message);
        const mailtoLink = `mailto:3679044152@qq.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        this.showToast(isZh ? '正在打开邮件客户端...' : 'Opening email client...');
    }

    // ==================== VOICE INPUT ====================
    
    initVoiceInput() {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            const voiceBtn = document.getElementById('voiceInputBtn');
            if (voiceBtn) {
                voiceBtn.style.display = 'none';
                console.warn('Speech Recognition not supported in this browser');
            }
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.isRecording = false;
        
        // Configure recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        
        // Set language based on current locale
        const currentLocale = i18n?.getLocale() || 'en';
        this.recognition.lang = currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        
        // Event listeners
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceStopBtn = document.getElementById('voiceStopBtn');
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.startVoiceInput());
        }
        
        if (voiceStopBtn) {
            voiceStopBtn.addEventListener('click', () => this.stopVoiceInput());
        }
        
        // Keyboard shortcut: Ctrl+Shift+V
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                if (this.isRecording) {
                    this.stopVoiceInput();
                } else {
                    this.startVoiceInput();
                }
            }
        });
        
        // Recognition event handlers
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript) {
                this.appendToNote(finalTranscript);
            }
            
            // Update UI with interim results
            const voiceText = document.querySelector('.voice-text');
            if (voiceText && interimTranscript) {
                voiceText.textContent = interimTranscript;
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            const currentLocale = i18n?.getLocale() || 'en';
            const isZh = currentLocale === 'zh';
            
            let errorMsg = '';
            switch (event.error) {
                case 'no-speech':
                    errorMsg = isZh ? '未检测到语音' : 'No speech detected';
                    break;
                case 'audio-capture':
                    errorMsg = isZh ? '无法访问麦克风' : 'Cannot access microphone';
                    break;
                case 'not-allowed':
                    errorMsg = isZh ? '麦克风权限被拒绝' : 'Microphone permission denied';
                    break;
                default:
                    errorMsg = isZh ? '语音识别错误' : 'Speech recognition error';
            }
            
            this.showToast(errorMsg);
            this.stopVoiceInput();
        };
        
        this.recognition.onend = () => {
            if (this.isRecording) {
                // Restart if still recording (continuous mode)
                try {
                    this.recognition.start();
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                    this.stopVoiceInput();
                }
            }
        };
    }
    
    startVoiceInput() {
        if (this.isRecording) return;
        
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        try {
            this.recognition.start();
            this.isRecording = true;
            
            // Update UI
            const voiceBtn = document.getElementById('voiceInputBtn');
            const voiceStatus = document.getElementById('voiceInputStatus');
            const voiceText = document.querySelector('.voice-text');
            
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
            }
            
            if (voiceStatus) {
                voiceStatus.style.display = 'flex';
            }
            
            if (voiceText) {
                voiceText.textContent = isZh ? '正在聆听...' : 'Listening...';
            }
            
            // Focus on textarea
            const noteTextarea = document.getElementById('moodNote');
            if (noteTextarea) {
                noteTextarea.focus();
            }
            
        } catch (error) {
            console.error('Failed to start voice input:', error);
            const msg = isZh ? '无法启动语音输入' : 'Failed to start voice input';
            this.showToast(msg);
        }
    }
    
    stopVoiceInput() {
        if (!this.isRecording) return;
        
        try {
            this.recognition.stop();
            this.isRecording = false;
            
            // Update UI
            const voiceBtn = document.getElementById('voiceInputBtn');
            const voiceStatus = document.getElementById('voiceInputStatus');
            
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
            }
            
            if (voiceStatus) {
                voiceStatus.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Failed to stop voice input:', error);
        }
    }
    
    appendToNote(text) {
        const noteTextarea = document.getElementById('moodNote');
        if (!noteTextarea) return;
        
        const currentText = noteTextarea.value;
        const newText = currentText ? currentText + ' ' + text : text;
        noteTextarea.value = newText;
        
        // Trigger input event for any listeners
        noteTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // ==================== MUSIC PLAYER ====================
    
    initMusicPlayer() {
        const sounds = [
            {
                id: 1,
                name: 'Ocean Waves',
                nameZh: '海浪声',
                description: 'Calming ocean sounds',
                descriptionZh: '平静的海浪声',
                icon: 'fas fa-water',
                color: '#4ecdc4',
                url: 'https://www.youtube.com/watch?v=WHPEKLQID4U'
            },
            {
                id: 2,
                name: 'Rain Sounds',
                nameZh: '雨声',
                description: 'Gentle rainfall ambience',
                descriptionZh: '轻柔的雨声氛围',
                icon: 'fas fa-cloud-rain',
                color: '#95e1d3',
                url: 'https://www.youtube.com/watch?v=nDq6TstdEi8'
            },
            {
                id: 3,
                name: 'Forest Nature',
                nameZh: '森林自然',
                description: 'Birds and forest sounds',
                descriptionZh: '鸟鸣和森林声音',
                icon: 'fas fa-tree',
                color: '#a8e6cf',
                url: 'https://www.youtube.com/watch?v=xNN7iTA57jM'
            },
            {
                id: 4,
                name: 'White Noise',
                nameZh: '白噪音',
                description: 'Pure white noise for focus',
                descriptionZh: '纯白噪音助专注',
                icon: 'fas fa-broadcast-tower',
                color: '#dfe4ea',
                url: 'https://www.youtube.com/watch?v=nMfPqeZjc2c'
            },
            {
                id: 5,
                name: 'Piano Meditation',
                nameZh: '钢琴冥想',
                description: 'Peaceful piano melodies',
                descriptionZh: '平和的钢琴旋律',
                icon: 'fas fa-music',
                color: '#ffd93d',
                url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4'
            },
            {
                id: 6,
                name: 'Tibetan Bowls',
                nameZh: '藏式颂钵',
                description: 'Healing bowl sounds',
                descriptionZh: '疗愈的颂钵声',
                icon: 'fas fa-om',
                color: '#ffaaa5',
                url: 'https://www.youtube.com/watch?v=3_4E69o5b1E'
            }
        ];
        
        this.renderMusicPlayer(sounds);
    }
    
    renderMusicPlayer(sounds) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        const container = document.getElementById('musicPlayer');
        
        if (!container) return;
        
        let html = '<div class="music-grid">';
        
        sounds.forEach(sound => {
            html += `
                <div class="music-card" style="--music-color: ${sound.color}">
                    <div class="music-icon">
                        <i class="${sound.icon}"></i>
                    </div>
                    <div class="music-info">
                        <h3>${isZh ? sound.nameZh : sound.name}</h3>
                        <p>${isZh ? sound.descriptionZh : sound.description}</p>
                    </div>
                    <button class="btn-primary music-play-btn" data-audio-url="${sound.url}">
                        <i class="fab fa-youtube"></i> ${isZh ? '播放' : 'Play'}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        
        container.innerHTML = html;
        
        // Add event listeners
        container.querySelectorAll('.music-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const audioUrl = btn.dataset.audioUrl;
                window.open(audioUrl, '_blank');
            });
        });
    }

    // ==================== PLUGIN MARKETPLACE ====================
    
    showPluginMarketplace() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        let modal = document.getElementById('pluginMarketplaceModal');
        if (!modal) {
            modal = this.createPluginMarketplaceModal();
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        
        // Load plugins from registry
        this.loadPluginRegistry();
    }
    
    async loadPluginRegistry() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        try {
            // 使用GitHub作为免费托管平台
            const response = await fetch(this.pluginRegistry);
            const plugins = await response.json();
            
            this.renderPluginList(plugins);
        } catch (error) {
            console.error('Failed to load plugin registry:', error);
            
            // 如果无法从GitHub加载，使用本地示例
            const fallbackPlugins = this.getFallbackPlugins();
            this.renderPluginList(fallbackPlugins);
        }
    }
    
    getFallbackPlugins() {
        return [
            {
                id: 'weather-integration',
                name: 'Weather Integration',
                author: 'MoodTracker Team',
                version: '1.0.0',
                description: 'Automatically record weather conditions with mood entries',
                category: 'integration',
                icon: 'fas fa-cloud-sun',
                repository: 'https://github.com/moodtracker-pro/weather-plugin',
                main: 'https://raw.githubusercontent.com/moodtracker-pro/weather-plugin/main/plugin.js',
                downloads: 125,
                rating: 4.5,
                verified: true
            },
            {
                id: 'github-commits',
                name: 'GitHub Commits',
                author: 'GitHubDev',
                version: '1.0.0',
                description: 'Track GitHub commits alongside your mood data',
                category: 'integration',
                icon: 'fab fa-github',
                repository: 'https://github.com/community/github-commits-plugin',
                main: 'https://cdn.example.com/github-plugin.js',
                downloads: 89,
                rating: 4.2,
                verified: false
            },
            {
                id: 'advanced-charts',
                name: 'Advanced Charts',
                author: 'ChartsDev',
                version: '1.0.0',
                description: 'Add heatmaps, radar charts, and more visualization options',
                category: 'analytics',
                icon: 'fas fa-chart-pie',
                repository: 'https://github.com/community/advanced-charts',
                main: 'https://cdn.example.com/charts-plugin.js',
                downloads: 203,
                rating: 4.8,
                verified: true
            },
            {
                id: 'auto-backup',
                name: 'Auto Backup',
                author: 'BackupDev',
                version: '1.0.0',
                description: 'Automatically backup your data to cloud storage',
                category: 'utility',
                icon: 'fas fa-cloud-upload-alt',
                repository: 'https://github.com/community/auto-backup',
                main: 'https://cdn.example.com/backup-plugin.js',
                downloads: 156,
                rating: 4.6,
                verified: false
            }
        ];
    }
    
    renderPluginList(plugins) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        const container = document.getElementById('pluginListContainer');
        
        if (!container) return;
        
        const categories = {
            integration: isZh ? '集成' : 'Integration',
            analytics: isZh ? '分析' : 'Analytics',
            utility: isZh ? '工具' : 'Utility',
            theme: isZh ? '主题' : 'Theme'
        };
        
        let html = '';
        
        // Group by category
        const grouped = {};
        plugins.forEach(plugin => {
            if (!grouped[plugin.category]) {
                grouped[plugin.category] = [];
            }
            grouped[plugin.category].push(plugin);
        });
        
        // Render each category
        for (const [category, categoryPlugins] of Object.entries(grouped)) {
            html += `
                <div class="plugin-category">
                    <h3 class="category-title">${categories[category] || category}</h3>
                    <div class="plugin-grid">
            `;
            
            categoryPlugins.forEach(plugin => {
                const isInstalled = this.isPluginInstalled(plugin.id);
                const stars = this.renderStars(plugin.rating);
                
                html += `
                    <div class="plugin-card" data-plugin-id="${plugin.id}">
                        <div class="plugin-header">
                            <div class="plugin-icon">
                                <i class="${plugin.icon}"></i>
                            </div>
                            ${plugin.verified ? '<span class="verified-badge" title="Verified"><i class="fas fa-check-circle"></i></span>' : ''}
                        </div>
                        <div class="plugin-body">
                            <h4 class="plugin-name">${plugin.name}</h4>
                            <p class="plugin-author">by ${plugin.author}</p>
                            <p class="plugin-description">${plugin.description}</p>
                            <div class="plugin-meta">
                                <span class="plugin-rating">${stars} ${plugin.rating}</span>
                                <span class="plugin-downloads"><i class="fas fa-download"></i> ${plugin.downloads}</span>
                            </div>
                        </div>
                        <div class="plugin-footer">
                            ${isInstalled 
                                ? `<button class="btn-danger plugin-action-btn" data-action="uninstall" data-plugin-id="${plugin.id}">
                                    <i class="fas fa-trash"></i> ${isZh ? '卸载' : 'Uninstall'}
                                   </button>`
                                : `<button class="btn-primary plugin-action-btn" data-action="install" data-plugin-id="${plugin.id}">
                                    <i class="fas fa-download"></i> ${isZh ? '安装' : 'Install'}
                                   </button>`
                            }
                            <button class="btn-secondary" onclick="window.open('${plugin.repository}', '_blank')">
                                <i class="fab fa-github"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Add event listeners
        container.querySelectorAll('.plugin-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const pluginId = e.currentTarget.dataset.pluginId;
                const plugin = plugins.find(p => p.id === pluginId);
                
                if (action === 'install') {
                    this.installPlugin(plugin);
                } else if (action === 'uninstall') {
                    this.uninstallPlugin(pluginId);
                }
            });
        });
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    isPluginInstalled(pluginId) {
        return this.installedPlugins.some(p => p.id === pluginId);
    }
    
    async installPlugin(plugin) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        try {
            // Load plugin script
            const script = document.createElement('script');
            script.src = plugin.main;
            script.async = true;
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            
            // Save to installed plugins
            this.installedPlugins.push(plugin);
            localStorage.setItem('installedPlugins', JSON.stringify(this.installedPlugins));
            
            const msg = isZh ? `${plugin.name} 安装成功！` : `${plugin.name} installed successfully!`;
            this.showToast(msg);
            
            // Reload plugin list
            this.loadPluginRegistry();
        } catch (error) {
            console.error('Failed to install plugin:', error);
            const msg = isZh ? '插件安装失败' : 'Failed to install plugin';
            this.showToast(msg);
        }
    }
    
    uninstallPlugin(pluginId) {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        // Remove from installed plugins
        this.installedPlugins = this.installedPlugins.filter(p => p.id !== pluginId);
        localStorage.setItem('installedPlugins', JSON.stringify(this.installedPlugins));
        
        // Remove from API plugins array
        if (window.MoodTrackerAPI && window.MoodTrackerAPI.plugins) {
            const pluginIndex = window.MoodTrackerAPI.plugins.findIndex(p => p.name === pluginId || p.id === pluginId);
            if (pluginIndex > -1) {
                const plugin = window.MoodTrackerAPI.plugins[pluginIndex];
                if (typeof plugin.destroy === 'function') {
                    plugin.destroy();
                }
                window.MoodTrackerAPI.plugins.splice(pluginIndex, 1);
            }
        }
        
        const msg = isZh ? '插件已卸载，刷新页面生效' : 'Plugin uninstalled. Refresh to complete removal.';
        this.showToast(msg);
        
        // Reload plugin list
        this.loadPluginRegistry();
    }
    
    createPluginMarketplaceModal() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        const modal = document.createElement('div');
        modal.id = 'pluginMarketplaceModal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="modal-content plugin-marketplace-modal">
                <div class="modal-header">
                    <h2>
                        <i class="fas fa-puzzle-piece"></i>
                        ${isZh ? '插件市场' : 'Plugin Marketplace'}
                    </h2>
                    <button class="modal-close" onclick="document.getElementById('pluginMarketplaceModal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="marketplace-header">
                        <div class="marketplace-stats">
                            <span><i class="fas fa-puzzle-piece"></i> ${isZh ? '已安装' : 'Installed'}: <strong id="installedCount">0</strong></span>
                            <span><i class="fas fa-store"></i> ${isZh ? '可用' : 'Available'}: <strong id="availableCount">0</strong></span>
                        </div>
                        <button class="btn-secondary" id="refreshPluginsBtn">
                            <i class="fas fa-sync-alt"></i> ${isZh ? '刷新' : 'Refresh'}
                        </button>
                    </div>
                    
                    <div class="marketplace-notice">
                        <i class="fas fa-info-circle"></i>
                        <p>${isZh 
                            ? '所有插件均由社区开发者创建。安装前请查看源代码和评分。' 
                            : 'All plugins are created by community developers. Review source code and ratings before installation.'}
                        </p>
                    </div>
                    
                    <div id="pluginListContainer" class="plugin-list-container">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>${isZh ? '加载中...' : 'Loading...'}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="window.open('https://github.com/moodtracker-pro/plugins', '_blank')">
                        <i class="fab fa-github"></i> ${isZh ? '提交插件' : 'Submit Plugin'}
                    </button>
                    <button class="btn-secondary" onclick="document.getElementById('pluginMarketplaceModal').style.display='none'">
                        ${isZh ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Refresh button
        modal.querySelector('#refreshPluginsBtn').addEventListener('click', () => {
            this.loadPluginRegistry();
        });
        
        return modal;
    }

    // ==================== ACCESSIBILITY FEATURES ====================
    
    applyAccessibilitySettings() {
        this.applyHighContrastMode(this.highContrastMode);
        this.applyFontSize(this.fontSize);
        this.applyColorBlindMode(this.colorBlindMode);
    }
    
    toggleHighContrastMode() {
        this.highContrastMode = !this.highContrastMode;
        localStorage.setItem('highContrastMode', this.highContrastMode);
        this.applyHighContrastMode(this.highContrastMode);
        
        const currentLocale = i18n?.getLocale() || 'en';
        const msg = this.highContrastMode
            ? (currentLocale === 'zh' ? '高对比度模式已启用' : 'High contrast mode enabled')
            : (currentLocale === 'zh' ? '高对比度模式已禁用' : 'High contrast mode disabled');
        this.showToast(msg);
    }
    
    applyHighContrastMode(enabled) {
        const root = document.documentElement;
        
        if (enabled) {
            document.body.classList.add('high-contrast');
            
            // Increase contrast colors
            root.style.setProperty('--primary-black', '#000000');
            root.style.setProperty('--secondary-black', '#0d0d0d');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#e0e0e0');
            
            // Enhance borders
            root.style.setProperty('--border-width', '2px');
            
            // Stronger shadows
            root.style.setProperty('--shadow-lg', '0 10px 40px rgba(0, 0, 0, 0.8)');
        } else {
            document.body.classList.remove('high-contrast');
            
            // Reset to default values
            root.style.setProperty('--primary-black', '#0a0a0a');
            root.style.setProperty('--secondary-black', '#141414');
            root.style.setProperty('--text-primary', '#e0e0e0');
            root.style.setProperty('--text-secondary', '#adb5bd');
            root.style.setProperty('--border-width', '1px');
            root.style.setProperty('--shadow-lg', '0 10px 40px rgba(0, 0, 0, 0.5)');
        }
    }
    
    setFontSize(size) {
        this.fontSize = size;
        localStorage.setItem('fontSize', size);
        this.applyFontSize(size);
        
        const currentLocale = i18n?.getLocale() || 'en';
        const sizeNames = {
            'small': currentLocale === 'zh' ? '小' : 'Small',
            'medium': currentLocale === 'zh' ? '中' : 'Medium',
            'large': currentLocale === 'zh' ? '大' : 'Large',
            'x-large': currentLocale === 'zh' ? '特大' : 'Extra Large'
        };
        
        const msg = currentLocale === 'zh' 
            ? `字体大小: ${sizeNames[size]}`
            : `Font size: ${sizeNames[size]}`;
        this.showToast(msg);
    }
    
    applyFontSize(size) {
        const root = document.documentElement;
        
        // Remove all font size classes
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-x-large');
        document.body.classList.add(`font-${size}`);
        
        const fontSizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px',
            'x-large': '20px'
        };
        
        root.style.setProperty('--base-font-size', fontSizes[size]);
    }
    
    setColorBlindMode(mode) {
        this.colorBlindMode = mode;
        localStorage.setItem('colorBlindMode', mode);
        this.applyColorBlindMode(mode);
        
        const currentLocale = i18n?.getLocale() || 'en';
        const modeNames = {
            'none': currentLocale === 'zh' ? '无' : 'None',
            'protanopia': currentLocale === 'zh' ? '红色盲' : 'Protanopia',
            'deuteranopia': currentLocale === 'zh' ? '绿色盲' : 'Deuteranopia',
            'tritanopia': currentLocale === 'zh' ? '蓝色盲' : 'Tritanopia'
        };
        
        const msg = currentLocale === 'zh'
            ? `色盲模式: ${modeNames[mode]}`
            : `Color blind mode: ${modeNames[mode]}`;
        this.showToast(msg);
    }
    
    applyColorBlindMode(mode) {
        const root = document.documentElement;
        
        // Remove all color blind classes
        document.body.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
        
        if (mode !== 'none') {
            document.body.classList.add(`cb-${mode}`);
            
            // Add patterns and shapes to mood buttons
            this.addColorBlindPatterns();
        } else {
            this.removeColorBlindPatterns();
        }
    }
    
    addColorBlindPatterns() {
        // Add visual patterns to mood buttons for color blind users
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach((btn, index) => {
            if (!btn.querySelector('.cb-pattern')) {
                const pattern = document.createElement('span');
                pattern.className = 'cb-pattern';
                
                // Different patterns for each mood level
                const patterns = ['◆', '▲', '●', '★', '◉'];
                pattern.textContent = patterns[index] || '●';
                pattern.setAttribute('aria-hidden', 'true');
                
                btn.appendChild(pattern);
            }
        });
    }
    
    removeColorBlindPatterns() {
        document.querySelectorAll('.cb-pattern').forEach(el => el.remove());
    }
    
    showAccessibilitySettings() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        let modal = document.getElementById('accessibilityModal');
        if (!modal) {
            modal = this.createAccessibilityModal();
            document.body.appendChild(modal);
        }
        
        // Update current settings display
        document.getElementById('highContrastToggle').checked = this.highContrastMode;
        document.getElementById('fontSizeSelect').value = this.fontSize;
        document.getElementById('colorBlindSelect').value = this.colorBlindMode;
        
        modal.style.display = 'flex';
    }
    
    createAccessibilityModal() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        const modal = document.createElement('div');
        modal.id = 'accessibilityModal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content accessibility-modal">
                <div class="modal-header">
                    <h2>
                        <i class="fas fa-universal-access"></i>
                        ${isZh ? '无障碍设置' : 'Accessibility Settings'}
                    </h2>
                    <button class="modal-close" onclick="document.getElementById('accessibilityModal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- High Contrast Mode -->
                    <div class="accessibility-option">
                        <div class="option-header">
                            <i class="fas fa-adjust"></i>
                            <div class="option-info">
                                <h3>${isZh ? '高对比度模式' : 'High Contrast Mode'}</h3>
                                <p>${isZh ? '增强文字和元素的对比度' : 'Enhance contrast for text and elements'}</p>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="highContrastToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Font Size -->
                    <div class="accessibility-option">
                        <div class="option-header">
                            <i class="fas fa-text-height"></i>
                            <div class="option-info">
                                <h3>${isZh ? '字体大小' : 'Font Size'}</h3>
                                <p>${isZh ? '调整应用程序的文字大小' : 'Adjust application text size'}</p>
                            </div>
                        </div>
                        <select id="fontSizeSelect" class="select-input">
                            <option value="small">${isZh ? '小' : 'Small'}</option>
                            <option value="medium">${isZh ? '中' : 'Medium'}</option>
                            <option value="large">${isZh ? '大' : 'Large'}</option>
                            <option value="x-large">${isZh ? '特大' : 'Extra Large'}</option>
                        </select>
                    </div>
                    
                    <!-- Color Blind Mode -->
                    <div class="accessibility-option">
                        <div class="option-header">
                            <i class="fas fa-eye"></i>
                            <div class="option-info">
                                <h3>${isZh ? '色盲友好模式' : 'Color Blind Friendly'}</h3>
                                <p>${isZh ? '添加图案和形状辅助区分' : 'Add patterns and shapes for differentiation'}</p>
                            </div>
                        </div>
                        <select id="colorBlindSelect" class="select-input">
                            <option value="none">${isZh ? '无' : 'None'}</option>
                            <option value="protanopia">${isZh ? '红色盲' : 'Protanopia (Red-blind)'}</option>
                            <option value="deuteranopia">${isZh ? '绿色盲' : 'Deuteranopia (Green-blind)'}</option>
                            <option value="tritanopia">${isZh ? '蓝色盲' : 'Tritanopia (Blue-blind)'}</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="document.getElementById('accessibilityModal').style.display='none'">
                        ${isZh ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // High contrast toggle
        modal.querySelector('#highContrastToggle').addEventListener('change', (e) => {
            this.toggleHighContrastMode();
        });
        
        // Font size change
        modal.querySelector('#fontSizeSelect').addEventListener('change', (e) => {
            this.setFontSize(e.target.value);
        });
        
        // Color blind mode change
        modal.querySelector('#colorBlindSelect').addEventListener('change', (e) => {
            this.setColorBlindMode(e.target.value);
        });
        
        return modal;
    }

    // ==================== VIEW DENSITY ====================
    
    toggleViewDensity() {
        this.viewDensity = this.viewDensity === 'compact' ? 'comfortable' : 'compact';
        localStorage.setItem('viewDensity', this.viewDensity);
        this.applyViewDensity(this.viewDensity);
        
        const currentLocale = i18n.getLocale();
        const msg = this.viewDensity === 'compact' 
            ? (currentLocale === 'zh' ? '紧凑视图已启用' : 'Compact view enabled')
            : (currentLocale === 'zh' ? '宽松视图已启用' : 'Comfortable view enabled');
        this.showToast(msg);
    }
    
    applyViewDensity(density) {
        const root = document.documentElement;
        const btn = document.getElementById('viewDensityBtn');
        const icon = document.getElementById('viewDensityIcon');
        const text = document.getElementById('viewDensityText');
        const currentLocale = i18n.getLocale();
        
        if (density === 'compact') {
            // Compact mode - reduced spacing
            root.style.setProperty('--spacing-xs', '0.25rem');
            root.style.setProperty('--spacing-sm', '0.5rem');
            root.style.setProperty('--spacing-md', '0.75rem');
            root.style.setProperty('--spacing-lg', '1rem');
            root.style.setProperty('--spacing-xl', '1.5rem');
            
            document.body.classList.add('compact-view');
            document.body.classList.remove('comfortable-view');
            
            if (icon) icon.className = 'fas fa-expand-alt';
            if (text) text.textContent = currentLocale === 'zh' ? '宽松' : 'Comfortable';
        } else {
            // Comfortable mode - default spacing
            root.style.setProperty('--spacing-xs', '0.5rem');
            root.style.setProperty('--spacing-sm', '1rem');
            root.style.setProperty('--spacing-md', '1.5rem');
            root.style.setProperty('--spacing-lg', '2rem');
            root.style.setProperty('--spacing-xl', '3rem');
            
            document.body.classList.add('comfortable-view');
            document.body.classList.remove('compact-view');
            
            if (icon) icon.className = 'fas fa-compress-alt';
            if (text) text.textContent = currentLocale === 'zh' ? '紧凑' : 'Compact';
        }
    }
    
    // ==================== BACKUP & RESTORE ====================
    
    showBackupRestoreModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '备份与恢复' : 'Backup & Restore';
        const description = currentLocale === 'zh' ? '管理您的数据备份和恢复操作' : 'Manage your data backup and restore operations';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        
        const lastBackupText = this.lastBackupTime 
            ? new Date(parseInt(this.lastBackupTime)).toLocaleString(currentLocale === 'zh' ? 'zh-CN' : 'en-US')
            : (currentLocale === 'zh' ? '从未备份' : 'Never');
        
        const lastSyncText = this.lastSyncTime
            ? new Date(parseInt(this.lastSyncTime)).toLocaleString(currentLocale === 'zh' ? 'zh-CN' : 'en-US')
            : (currentLocale === 'zh' ? '从未同步' : 'Never');
        
        const syncStatusText = this.syncEnabled 
            ? (currentLocale === 'zh' ? '已启用' : 'Enabled')
            : (currentLocale === 'zh' ? '已禁用' : 'Disabled');
        
        const syncStatusColor = this.syncEnabled ? 'var(--primary-green)' : '#ff4444';
        
        const modalHTML = `
            <div class="modal-overlay" id="backupRestoreModal" style="display: flex;">
                <div class="modal-content" style="max-width: 650px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-database"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('backupRestoreModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        
                        <!-- Status Cards -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <!-- Backup Status -->
                            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px;">
                                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                                    <i class="fas fa-clock" style="color: var(--primary-green);"></i>
                                    <span style="color: var(--gray-300); font-weight: 500; font-size: 0.9rem;">${currentLocale === 'zh' ? '最后备份' : 'Last Backup'}</span>
                                </div>
                                <div style="color: var(--gray-400); font-size: 0.85rem; padding-left: 2rem;">${lastBackupText}</div>
                            </div>
                            
                            <!-- Sync Status -->
                            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px;">
                                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                                    <i class="fas fa-sync-alt" style="color: ${syncStatusColor};"></i>
                                    <span style="color: var(--gray-300); font-weight: 500; font-size: 0.9rem;">${currentLocale === 'zh' ? '数据同步' : 'Data Sync'}</span>
                                </div>
                                <div style="color: ${syncStatusColor}; font-size: 0.85rem; padding-left: 2rem; font-weight: 600;">${syncStatusText}</div>
                            </div>
                        </div>
                        
                        <!-- Sync Control -->
                        <div style="padding: 1rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; margin-bottom: 1.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    <div style="color: var(--gray-300); font-weight: 500; margin-bottom: 0.25rem;">
                                        <i class="fas fa-exchange-alt"></i> ${currentLocale === 'zh' ? '跨标签同步' : 'Cross-Tab Sync'}
                                    </div>
                                    <div style="color: var(--gray-400); font-size: 0.85rem;">
                                        ${currentLocale === 'zh' ? '在多个浏览器标签页间自动同步数据' : 'Automatically sync data across browser tabs'}
                                    </div>
                                    ${this.lastSyncTime ? `<div style="color: var(--gray-500); font-size: 0.8rem; margin-top: 0.25rem;">${currentLocale === 'zh' ? '最后同步' : 'Last sync'}: ${lastSyncText}</div>` : ''}
                                </div>
                                <label class="sync-toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
                                    <input type="checkbox" id="syncToggle" ${this.syncEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                    <span class="sync-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: 0.3s; border-radius: 26px; border: 1px solid rgba(0, 255, 136, 0.3);"></span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Encryption Control -->
                        <div style="padding: 1rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; margin-bottom: 1.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="flex: 1;">
                                    <div style="color: var(--gray-300); font-weight: 500; margin-bottom: 0.25rem;">
                                        <i class="fas fa-lock"></i> ${currentLocale === 'zh' ? '数据加密' : 'Data Encryption'}
                                    </div>
                                    <div style="color: var(--gray-400); font-size: 0.85rem;">
                                        ${this.encryptionEnabled 
                                            ? (currentLocale === 'zh' ? '心情数据已加密存储' : 'Mood data is encrypted')
                                            : (currentLocale === 'zh' ? '使用密码保护敏感数据' : 'Protect sensitive data with password')}
                                    </div>
                                </div>
                                ${this.encryptionEnabled 
                                    ? `<button class="btn-secondary" id="disableEncryptionBtn" style="padding: 0.5rem 1rem;">
                                        <i class="fas fa-unlock"></i> ${currentLocale === 'zh' ? '禁用' : 'Disable'}
                                    </button>`
                                    : `<button class="btn-primary" id="enableEncryptionModalBtn" style="padding: 0.5rem 1rem;">
                                        <i class="fas fa-lock"></i> ${currentLocale === 'zh' ? '启用' : 'Enable'}
                                    </button>`
                                }
                            </div>
                        </div>
                        
                        <!-- Backup Section -->
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem;">
                                <i class="fas fa-download"></i> ${currentLocale === 'zh' ? '备份数据' : 'Backup Data'}
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <button class="btn-primary" id="backupToLocalBtn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem;">
                                    <i class="fas fa-file-download"></i>
                                    <span>${currentLocale === 'zh' ? '本地备份' : 'Local Backup'}</span>
                                </button>
                                <button class="btn-secondary" id="backupToCloudBtn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem;" disabled title="${currentLocale === 'zh' ? '云备份功能即将推出' : 'Cloud backup coming soon'}">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>${currentLocale === 'zh' ? '云端备份' : 'Cloud Backup'}</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Restore Section -->
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem;">
                                <i class="fas fa-upload"></i> ${currentLocale === 'zh' ? '恢复数据' : 'Restore Data'}
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <label for="restoreFileInput" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; margin: 0; cursor: pointer;">
                                    <i class="fas fa-file-upload"></i>
                                    <span>${currentLocale === 'zh' ? '从本地恢复' : 'Restore from File'}</span>
                                </label>
                                <input type="file" id="restoreFileInput" accept=".json" style="display: none;">
                                <button class="btn-secondary" id="restoreFromCloudBtn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem;" disabled title="${currentLocale === 'zh' ? '云恢复功能即将推出' : 'Cloud restore coming soon'}">
                                    <i class="fas fa-cloud-download-alt"></i>
                                    <span>${currentLocale === 'zh' ? '从云端恢复' : 'Restore from Cloud'}</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Import Section -->
                        <div>
                            <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem;">
                                <i class="fas fa-file-import"></i> ${currentLocale === 'zh' ? '导入数据' : 'Import Data'}
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <label for="importJsonInput" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; margin: 0; cursor: pointer;">
                                    <i class="fas fa-file-code"></i>
                                    <span>${currentLocale === 'zh' ? '导入JSON' : 'Import JSON'}</span>
                                </label>
                                <input type="file" id="importJsonInput" accept=".json" style="display: none;">
                                <label for="importCsvInput" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; margin: 0; cursor: pointer;">
                                    <i class="fas fa-file-csv"></i>
                                    <span>${currentLocale === 'zh' ? '导入CSV' : 'Import CSV'}</span>
                                </label>
                                <input type="file" id="importCsvInput" accept=".csv" style="display: none;">
                            </div>
                        </div>
                        
                        <!-- Info Message -->
                        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 200, 0, 0.1); border: 1px solid rgba(255, 200, 0, 0.3); border-radius: 8px;">
                            <div style="display: flex; gap: 0.75rem;">
                                <i class="fas fa-info-circle" style="color: #ffc800; margin-top: 0.2rem;"></i>
                                <div style="color: var(--gray-300); font-size: 0.9rem;">
                                    ${currentLocale === 'zh' 
                                        ? '备份文件包含您的所有心情记录、设置和个性化配置。请妈善保管备份文件。' 
                                        : 'Backup file contains all your mood entries, settings, and personalization. Keep it safe.'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('backupRestoreModal').remove()">
                            ${closeBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('backupRestoreModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event handlers
        document.getElementById('backupToLocalBtn').addEventListener('click', () => {
            this.backupToLocal();
        });
        
        document.getElementById('restoreFileInput').addEventListener('change', (e) => {
            this.restoreFromFile(e.target.files[0]);
        });
        
        // Import handlers
        document.getElementById('importJsonInput').addEventListener('change', (e) => {
            this.importJsonFile(e.target.files[0]);
            e.target.value = ''; // Reset input
        });
        
        document.getElementById('importCsvInput').addEventListener('change', (e) => {
            this.importCsvFile(e.target.files[0]);
            e.target.value = ''; // Reset input
        });
        
        // Sync toggle handler
        document.getElementById('syncToggle').addEventListener('change', (e) => {
            this.toggleDataSync(e.target.checked);
            // Refresh modal to show updated status
            setTimeout(() => {
                document.getElementById('backupRestoreModal').remove();
                this.showBackupRestoreModal();
            }, 500);
        });
        
        // Encryption button handlers
        const enableEncryptionBtn = document.getElementById('enableEncryptionModalBtn');
        if (enableEncryptionBtn) {
            enableEncryptionBtn.addEventListener('click', () => {
                this.showEncryptionSetupModal();
            });
        }
        
        const disableEncryptionBtn = document.getElementById('disableEncryptionBtn');
        if (disableEncryptionBtn) {
            disableEncryptionBtn.addEventListener('click', () => {
                const currentLocale = i18n.getLocale();
                const confirmMsg = currentLocale === 'zh'
                    ? '确定要禁用数据加密吗？数据将以明文形式存储。'
                    : 'Are you sure you want to disable data encryption? Data will be stored in plain text.';
                
                if (confirm(confirmMsg)) {
                    this.toggleEncryption(false);
                    setTimeout(() => {
                        document.getElementById('backupRestoreModal').remove();
                        this.showBackupRestoreModal();
                    }, 300);
                }
            });
        }
        
        // Close on overlay click
        document.getElementById('backupRestoreModal').addEventListener('click', (e) => {
            if (e.target.id === 'backupRestoreModal') {
                document.getElementById('backupRestoreModal').remove();
            }
        });
    }
    
    backupToLocal() {
        const currentLocale = i18n.getLocale();
        
        // Collect all data
        const backupData = {
            version: '1.0',
            timestamp: Date.now(),
            moodData: this.moodData,
            settings: {
                customMoodScale: localStorage.getItem('customMoodScale'),
                autoCleanupEnabled: localStorage.getItem('autoCleanupEnabled'),
                autoCleanupDays: localStorage.getItem('autoCleanupDays'),
                moodReminderSettings: localStorage.getItem('moodReminderSettings'),
                notificationSettings: localStorage.getItem('notificationSettings'),
                locale: localStorage.getItem('locale'),
                timezone: localStorage.getItem('userTimezone'),
                appTheme: localStorage.getItem('appTheme'),
                viewDensity: localStorage.getItem('viewDensity'),
                dashboardWidgetOrder: localStorage.getItem('dashboardWidgetOrder'),
                activeWidgets: localStorage.getItem('activeWidgets')
            },
            metadata: {
                totalEntries: this.moodData.length,
                dateRange: {
                    first: this.moodData.length > 0 ? this.moodData[0].date : null,
                    last: this.moodData.length > 0 ? this.moodData[this.moodData.length - 1].date : null
                }
            }
        };
        
        // Create JSON file
        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        a.href = url;
        a.download = `moodtracker-backup-${timestamp}.json`;
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Update last backup time
        this.lastBackupTime = Date.now().toString();
        localStorage.setItem('lastBackupTime', this.lastBackupTime);
        
        // Show success message
        const successMsg = currentLocale === 'zh' ? '备份成功！' : 'Backup successful!';
        this.showToast(successMsg);
        
        // Track export for achievements
        this.incrementExportCount();
        
        // Refresh modal to show new backup time
        document.getElementById('backupRestoreModal').remove();
        setTimeout(() => this.showBackupRestoreModal(), 300);
    }
    
    restoreFromFile(file) {
        if (!file) return;
        
        const currentLocale = i18n.getLocale();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                // Validate backup data
                if (!backupData.version || !backupData.moodData) {
                    throw new Error('Invalid backup file format');
                }
                
                // Confirm restore
                const confirmMsg = currentLocale === 'zh' 
                    ? `确定要恢复数据吗？\n\n备份时间：${new Date(backupData.timestamp).toLocaleString('zh-CN')}\n记录数：${backupData.metadata.totalEntries}\n\n当前数据将被覆盖！`
                    : `Are you sure you want to restore data?\n\nBackup Date: ${new Date(backupData.timestamp).toLocaleString('en-US')}\nEntries: ${backupData.metadata.totalEntries}\n\nCurrent data will be overwritten!`;
                
                if (!confirm(confirmMsg)) return;
                
                // Restore mood data
                this.moodData = backupData.moodData;
                this.saveMoodData();
                
                // Restore settings
                if (backupData.settings) {
                    Object.entries(backupData.settings).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            localStorage.setItem(key, value);
                        }
                    });
                }
                
                // Reload page to apply all changes
                const msg = currentLocale === 'zh' ? '数据恢复成功！页面将自动刷新...' : 'Data restored successfully! Page will reload...';
                this.showToast(msg);
                
                setTimeout(() => {
                    location.reload();
                }, 1500);
                
            } catch (error) {
                console.error('Restore error:', error);
                const errorMsg = currentLocale === 'zh' ? '恢复失败：无效的备份文件' : 'Restore failed: Invalid backup file';
                this.showToast(errorMsg);
            }
        };
        
        reader.readAsText(file);
    }
    
    // ==================== DATA IMPORT ====================
    
    importJsonFile(file) {
        if (!file) return;
        
        const currentLocale = i18n.getLocale();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!Array.isArray(importedData)) {
                    throw new Error('Invalid JSON format: expected an array of entries');
                }
                
                // Show import preview modal
                this.showImportPreviewModal(importedData, 'json');
                
            } catch (error) {
                console.error('Import error:', error);
                const errorMsg = currentLocale === 'zh' ? `导入失败：${error.message}` : `Import failed: ${error.message}`;
                this.showToast(errorMsg);
            }
        };
        
        reader.readAsText(file);
    }
    
    importCsvFile(file) {
        if (!file) return;
        
        const currentLocale = i18n.getLocale();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const entries = this.parseCsvToEntries(csvText);
                
                if (entries.length === 0) {
                    throw new Error('No valid entries found in CSV file');
                }
                
                // Show import preview modal
                this.showImportPreviewModal(entries, 'csv');
                
            } catch (error) {
                console.error('Import error:', error);
                const errorMsg = currentLocale === 'zh' ? `导入失败：${error.message}` : `Import failed: ${error.message}`;
                this.showToast(errorMsg);
            }
        };
        
        reader.readAsText(file);
    }
    
    parseCsvToEntries(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const entries = [];
        
        // Expected columns: date, mood, note, tags
        const dateIndex = headers.findIndex(h => h.includes('date'));
        const moodIndex = headers.findIndex(h => h.includes('mood'));
        const noteIndex = headers.findIndex(h => h.includes('note'));
        const tagsIndex = headers.findIndex(h => h.includes('tag'));
        
        if (dateIndex === -1 || moodIndex === -1) {
            throw new Error('CSV must contain at least "date" and "mood" columns');
        }
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCsvLine(lines[i]);
            if (values.length < 2) continue;
            
            const dateStr = values[dateIndex];
            const moodValue = parseInt(values[moodIndex]);
            
            if (!dateStr || isNaN(moodValue) || moodValue < 1 || moodValue > 5) continue;
            
            const entry = {
                id: Date.now() + i,
                date: new Date(dateStr).toISOString(),
                mood: {
                    value: moodValue,
                    label: this.getMoodLabel(moodValue)
                },
                note: noteIndex !== -1 ? values[noteIndex] : '',
                tags: tagsIndex !== -1 ? values[tagsIndex].split(';').map(t => t.trim()).filter(t => t) : [],
                images: []
            };
            
            entries.push(entry);
        }
        
        return entries;
    }
    
    parseCsvLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }
    
    getMoodLabel(value) {
        const labels = {
            1: 'Very Bad',
            2: 'Bad',
            3: 'Okay',
            4: 'Good',
            5: 'Excellent'
        };
        return labels[value] || 'Unknown';
    }
    
    showImportPreviewModal(entries, format) {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '导入预览' : 'Import Preview';
        const description = currentLocale === 'zh'
            ? `发现 ${entries.length} 个条目。选择导入方式：`
            : `Found ${entries.length} entries. Choose import method:`;
        const appendBtn = currentLocale === 'zh' ? '追加到现有数据' : 'Append to Existing';
        const replaceBtn = currentLocale === 'zh' ? '替换所有数据' : 'Replace All Data';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        
        // Show sample entries
        const sampleEntries = entries.slice(0, 5);
        const sampleHtml = sampleEntries.map(entry => {
            const date = new Date(entry.date).toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : 'en-US');
            return `
                <div style="padding: 0.75rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 8px; margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="color: var(--gray-400); font-size: 0.85rem;">${date}</span>
                            <span style="color: var(--primary-green); font-weight: 600; margin-left: 1rem;">😊 ${entry.mood.label} (${entry.mood.value})</span>
                        </div>
                        ${entry.tags.length > 0 ? `<div style="font-size: 0.75rem; color: var(--gray-500);">${entry.tags.join(', ')}</div>` : ''}
                    </div>
                    ${entry.note ? `<div style="color: var(--gray-400); font-size: 0.85rem; margin-top: 0.25rem;">${entry.note.substring(0, 80)}${entry.note.length > 80 ? '...' : ''}</div>` : ''}
                </div>
            `;
        }).join('');
        
        const modalHTML = `
            <div class="modal-overlay" id="importPreviewModal" style="display: flex;">
                <div class="modal-content" style="max-width: 650px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-file-import"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('importPreviewModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: var(--gray-400); margin-bottom: 1rem;">${description}</p>
                        
                        <div style="max-height: 300px; overflow-y: auto; margin-bottom: 1.5rem;">
                            ${sampleHtml}
                            ${entries.length > 5 ? `<div style="text-align: center; color: var(--gray-500); padding: 0.5rem;">... ${currentLocale === 'zh' ? '还有' : 'and'} ${entries.length - 5} ${currentLocale === 'zh' ? '个条目' : 'more entries'}</div>` : ''}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button class="btn-primary" id="appendImportBtn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem;">
                                <i class="fas fa-plus"></i>
                                <span>${appendBtn}</span>
                            </button>
                            <button class="btn-secondary" id="replaceImportBtn" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: rgba(255, 200, 0, 0.2); border-color: #ffc800;">
                                <i class="fas fa-sync-alt"></i>
                                <span>${replaceBtn}</span>
                            </button>
                        </div>
                        
                        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 200, 0, 0.1); border: 1px solid rgba(255, 200, 0, 0.3); border-radius: 8px;">
                            <div style="display: flex; gap: 0.75rem;">
                                <i class="fas fa-exclamation-triangle" style="color: #ffc800; margin-top: 0.2rem;"></i>
                                <div style="color: var(--gray-300); font-size: 0.85rem;">
                                    ${currentLocale === 'zh'
                                        ? '"替换"将删除所有现有数据！建议先备份。'
                                        : '"Replace" will delete all existing data! Backup recommended.'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('importPreviewModal').remove()">
                            ${cancelBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('importPreviewModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Append button handler
        document.getElementById('appendImportBtn').addEventListener('click', () => {
            this.performImport(entries, 'append');
        });
        
        // Replace button handler
        document.getElementById('replaceImportBtn').addEventListener('click', () => {
            const confirmMsg = currentLocale === 'zh'
                ? `确定要替换所有数据吗？当前的 ${this.moodData.length} 个条目将被删除！此操作不可恢复。`
                : `Are you sure you want to replace all data? Current ${this.moodData.length} entries will be deleted! This action cannot be undone.`;
            
            if (confirm(confirmMsg)) {
                this.performImport(entries, 'replace');
            }
        });
        
        // Close on overlay click
        document.getElementById('importPreviewModal').addEventListener('click', (e) => {
            if (e.target.id === 'importPreviewModal') {
                document.getElementById('importPreviewModal').remove();
            }
        });
    }
    
    performImport(entries, mode) {
        const currentLocale = i18n.getLocale();
        
        if (mode === 'replace') {
            this.moodData = entries;
        } else {
            // Append mode - add to existing data
            // Update IDs to avoid conflicts
            const maxId = this.moodData.length > 0 ? Math.max(...this.moodData.map(e => e.id)) : 0;
            entries.forEach((entry, index) => {
                entry.id = maxId + index + 1;
            });
            this.moodData = [...this.moodData, ...entries];
        }
        
        // Sort by date
        this.moodData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        this.saveMoodData();
        this.updateDashboard();
        this.generateInsights();
        
        document.getElementById('importPreviewModal').remove();
        
        const msg = currentLocale === 'zh'
            ? `成功导入 ${entries.length} 个条目！`
            : `Successfully imported ${entries.length} entries!`;
        this.showToast(msg);
        
        // Close backup modal and show dashboard
        const backupModal = document.getElementById('backupRestoreModal');
        if (backupModal) backupModal.remove();
        
        this.showSection('dashboard');
    }
    
    showImportDataModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '数据导入' : 'Import Data';
        const description = currentLocale === 'zh' ? '从JSON或CSV文件导入历史心情记录' : 'Import historical mood entries from JSON or CSV files';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        
        const modalHTML = `
            <div class="modal-overlay" id="importDataModal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-file-import"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('importDataModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        
                        <!-- JSON Import -->
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem;">
                                <i class="fas fa-file-code"></i> ${currentLocale === 'zh' ? 'JSON格式导入' : 'JSON Format Import'}
                            </h3>
                            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; margin-bottom: 1rem;">
                                <div style="color: var(--gray-400); font-size: 0.85rem; margin-bottom: 0.5rem;">
                                    ${currentLocale === 'zh' ? '支持标准JSON数组格式，包含date、mood、note、tags等字段' : 'Supports standard JSON array format with date, mood, note, tags fields'}
                                </div>
                                <code style="display: block; background: rgba(0, 0, 0, 0.4); padding: 0.5rem; border-radius: 4px; color: var(--primary-green); font-size: 0.8rem; overflow-x: auto;">
                                    [{"date":"2025-01-01","mood":{"value":5},"note":"..."}]
                                </code>
                            </div>
                            <label for="importJsonModalInput" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; margin: 0; cursor: pointer; width: 100%;">
                                <i class="fas fa-file-code"></i>
                                <span>${currentLocale === 'zh' ? '选择JSON文件' : 'Choose JSON File'}</span>
                            </label>
                            <input type="file" id="importJsonModalInput" accept=".json" style="display: none;">
                        </div>
                        
                        <!-- CSV Import -->
                        <div>
                            <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem;">
                                <i class="fas fa-file-csv"></i> ${currentLocale === 'zh' ? 'CSV格式导入' : 'CSV Format Import'}
                            </h3>
                            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; margin-bottom: 1rem;">
                                <div style="color: var(--gray-400); font-size: 0.85rem; margin-bottom: 0.5rem;">
                                    ${currentLocale === 'zh' ? '必需列：date, mood｜可选列：note, tags（用分号分隔）' : 'Required: date, mood | Optional: note, tags (semicolon-separated)'}
                                </div>
                                <code style="display: block; background: rgba(0, 0, 0, 0.4); padding: 0.5rem; border-radius: 4px; color: var(--primary-green); font-size: 0.8rem; overflow-x: auto;">
                                    date,mood,note,tags<br>2025-01-01,5,Great day!,work;happy
                                </code>
                            </div>
                            <label for="importCsvModalInput" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; margin: 0; cursor: pointer; width: 100%;">
                                <i class="fas fa-file-csv"></i>
                                <span>${currentLocale === 'zh' ? '选择CSV文件' : 'Choose CSV File'}</span>
                            </label>
                            <input type="file" id="importCsvModalInput" accept=".csv" style="display: none;">
                        </div>
                        
                        <!-- Info Message -->
                        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px;">
                            <div style="display: flex; gap: 0.75rem;">
                                <i class="fas fa-info-circle" style="color: var(--primary-green); margin-top: 0.2rem;"></i>
                                <div style="color: var(--gray-300); font-size: 0.85rem;">
                                    ${currentLocale === 'zh'
                                        ? '导入后将显示预览，您可以选择追加到现有数据或替换所有数据。'
                                        : 'After import, a preview will be shown where you can choose to append or replace existing data.'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('importDataModal').remove()">
                            ${closeBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('importDataModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event handlers
        document.getElementById('importJsonModalInput').addEventListener('change', (e) => {
            this.importJsonFile(e.target.files[0]);
            e.target.value = ''; // Reset input
            document.getElementById('importDataModal').remove();
        });
        
        document.getElementById('importCsvModalInput').addEventListener('change', (e) => {
            this.importCsvFile(e.target.files[0]);
            e.target.value = ''; // Reset input
            document.getElementById('importDataModal').remove();
        });
        
        // Close on overlay click
        document.getElementById('importDataModal').addEventListener('click', (e) => {
            if (e.target.id === 'importDataModal') {
                document.getElementById('importDataModal').remove();
            }
        });
    }
    
    // ==================== DATA SYNC ====================
    
    setupDataSync() {
        if (!this.syncEnabled) return;
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            this.handleStorageChange(e);
        });
        
        // Periodic sync check (every 30 seconds)
        setInterval(() => {
            this.checkAndSync();
        }, 30000);
    }
    
    handleStorageChange(e) {
        if (this.isSyncing) return; // Prevent sync loops
        
        // Only sync if moodData changed
        if (e.key === 'moodData' && e.newValue) {
            this.isSyncing = true;
            
            try {
                const newData = JSON.parse(e.newValue);
                
                // Check if data is different
                if (JSON.stringify(this.moodData) !== JSON.stringify(newData)) {
                    this.moodData = newData;
                    this.lastSyncTime = Date.now().toString();
                    localStorage.setItem('lastSyncTime', this.lastSyncTime);
                    
                    // Update UI
                    this.updateDashboard();
                    this.generateInsights();
                    
                    const currentLocale = i18n.getLocale();
                    const msg = currentLocale === 'zh' ? '数据已同步' : 'Data synced';
                    this.showToast(msg);
                }
            } catch (error) {
                console.error('Sync error:', error);
            } finally {
                this.isSyncing = false;
            }
        }
    }
    
    checkAndSync() {
        if (!this.syncEnabled || this.isSyncing) return;
        
        // Check if localStorage has newer data
        const storedData = localStorage.getItem('moodData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (JSON.stringify(this.moodData) !== JSON.stringify(parsedData)) {
                    this.moodData = parsedData;
                    this.updateDashboard();
                }
            } catch (error) {
                console.error('Sync check error:', error);
            }
        }
    }
    
    toggleDataSync(enabled) {
        this.syncEnabled = enabled;
        localStorage.setItem('syncEnabled', enabled.toString());
        
        const currentLocale = i18n.getLocale();
        const msg = enabled 
            ? (currentLocale === 'zh' ? '数据同步已启用' : 'Data sync enabled')
            : (currentLocale === 'zh' ? '数据同步已禁用' : 'Data sync disabled');
        this.showToast(msg);
        
        if (enabled) {
            this.setupDataSync();
        }
    }
    
    // ==================== DATA ENCRYPTION ====================
    
    // Simple encryption using Base64 and XOR cipher (for demo purposes)
    // In production, use Web Crypto API with proper AES-GCM encryption
    simpleEncrypt(text, key) {
        if (!key) return text;
        
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }
        return btoa(encrypted); // Base64 encode
    }
    
    simpleDecrypt(encrypted, key) {
        if (!key) return encrypted;
        
        try {
            const decoded = atob(encrypted); // Base64 decode
            let decrypted = '';
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                decrypted += String.fromCharCode(charCode);
            }
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
    
    toggleEncryption(enabled, password = null) {
        const currentLocale = i18n.getLocale();
        
        if (enabled && !password) {
            const msg = currentLocale === 'zh' ? '请先设置加密密码' : 'Please set encryption password first';
            this.showToast(msg);
            return false;
        }
        
        if (enabled) {
            // Enable encryption
            this.encryptionEnabled = true;
            this.encryptionKey = password;
            localStorage.setItem('encryptionEnabled', 'true');
            
            // Re-save data with encryption
            this.saveMoodData();
            
            const msg = currentLocale === 'zh' ? '数据加密已启用' : 'Data encryption enabled';
            this.showToast(msg);
        } else {
            // Disable encryption
            this.encryptionEnabled = false;
            this.encryptionKey = null;
            localStorage.setItem('encryptionEnabled', 'false');
            
            // Re-save data without encryption
            this.saveMoodData();
            
            const msg = currentLocale === 'zh' ? '数据加密已禁用' : 'Data encryption disabled';
            this.showToast(msg);
        }
        
        return true;
    }
    
    showEncryptionSetupModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '设置加密密码' : 'Setup Encryption Password';
        const description = currentLocale === 'zh' 
            ? '设置密码以加密您的心情数据。请牢记密码，丢失后无法恢复数据。'
            : 'Set a password to encrypt your mood data. Remember it well - lost passwords cannot be recovered.';
        const placeholderPwd = currentLocale === 'zh' ? '输入密码' : 'Enter password';
        const placeholderConfirm = currentLocale === 'zh' ? '确认密码' : 'Confirm password';
        const enableBtn = currentLocale === 'zh' ? '启用加密' : 'Enable Encryption';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        
        const modalHTML = `
            <div class="modal-overlay" id="encryptionSetupModal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-lock"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('encryptionSetupModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="padding: 1rem; background: rgba(255, 200, 0, 0.1); border: 1px solid rgba(255, 200, 0, 0.3); border-radius: 8px; margin-bottom: 1.5rem;">
                            <div style="display: flex; gap: 0.75rem;">
                                <i class="fas fa-exclamation-triangle" style="color: #ffc800; margin-top: 0.2rem;"></i>
                                <div style="color: var(--gray-300); font-size: 0.9rem;">${description}</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                <i class="fas fa-key"></i> ${placeholderPwd}
                            </label>
                            <input type="password" id="encryptPassword" 
                                   style="width: 100%; padding: 0.75rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 1rem;"
                                   placeholder="${placeholderPwd}">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                <i class="fas fa-key"></i> ${placeholderConfirm}
                            </label>
                            <input type="password" id="encryptPasswordConfirm" 
                                   style="width: 100%; padding: 0.75rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 1rem;"
                                   placeholder="${placeholderConfirm}">
                        </div>
                        
                        <div id="passwordStrength" style="display: none; padding: 0.5rem; border-radius: 6px; margin-top: 0.5rem; font-size: 0.85rem;"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('encryptionSetupModal').remove()">
                            ${cancelBtn}
                        </button>
                        <button class="btn-primary" id="enableEncryptionBtn">
                            <i class="fas fa-check"></i> ${enableBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('encryptionSetupModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Password strength indicator
        document.getElementById('encryptPassword').addEventListener('input', (e) => {
            const password = e.target.value;
            const strengthDiv = document.getElementById('passwordStrength');
            
            if (password.length === 0) {
                strengthDiv.style.display = 'none';
                return;
            }
            
            strengthDiv.style.display = 'block';
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            const strengthText = currentLocale === 'zh' 
                ? ['弱', '一般', '良好', '强', '很强']
                : ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
            
            const strengthColors = ['#ff4444', '#ff8800', '#ffcc00', '#88ff00', '#00ff88'];
            
            strengthDiv.textContent = `${currentLocale === 'zh' ? '密码强度' : 'Password strength'}: ${strengthText[strength]}`;
            strengthDiv.style.backgroundColor = `${strengthColors[strength]}20`;
            strengthDiv.style.border = `1px solid ${strengthColors[strength]}60`;
            strengthDiv.style.color = strengthColors[strength];
        });
        
        // Enable button handler
        document.getElementById('enableEncryptionBtn').addEventListener('click', () => {
            const password = document.getElementById('encryptPassword').value;
            const confirm = document.getElementById('encryptPasswordConfirm').value;
            
            if (!password || password.length < 6) {
                const msg = currentLocale === 'zh' ? '密码长度至少6位' : 'Password must be at least 6 characters';
                this.showToast(msg);
                return;
            }
            
            if (password !== confirm) {
                const msg = currentLocale === 'zh' ? '两次密码输入不一致' : 'Passwords do not match';
                this.showToast(msg);
                return;
            }
            
            if (this.toggleEncryption(true, password)) {
                document.getElementById('encryptionSetupModal').remove();
                // Refresh backup modal
                setTimeout(() => {
                    const backupModal = document.getElementById('backupRestoreModal');
                    if (backupModal) {
                        backupModal.remove();
                        this.showBackupRestoreModal();
                    }
                }, 300);
            }
        });
        
        // Close on overlay click
        document.getElementById('encryptionSetupModal').addEventListener('click', (e) => {
            if (e.target.id === 'encryptionSetupModal') {
                document.getElementById('encryptionSetupModal').remove();
            }
        });
    }
    
    // ==================== BATCH OPERATIONS ====================
    
    toggleBatchMode() {
        this.batchModeEnabled = !this.batchModeEnabled;
        this.selectedEntries.clear();
        
        const toolbar = document.getElementById('batchOperationsToolbar');
        if (!toolbar) {
            console.error('Batch operations toolbar not found');
            return;
        }
        
        const currentLocale = i18n.getLocale();
        const bulkBtn = document.getElementById('bulkOperationsBtn');
        
        if (this.batchModeEnabled) {
            toolbar.style.display = 'block';
            if (bulkBtn) {
                const btnText = currentLocale === 'zh' ? '取消批量编辑' : 'Cancel Batch Edit';
                bulkBtn.querySelector('span').textContent = btnText;
                bulkBtn.style.background = 'rgba(255, 68, 68, 0.2)';
                bulkBtn.style.borderColor = '#ff4444';
            }
            this.updateRecentEntries(); // Refresh to show checkboxes
        } else {
            toolbar.style.display = 'none';
            const selectAllCheckbox = document.getElementById('selectAllEntries');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
            if (bulkBtn) {
                const btnText = currentLocale === 'zh' ? '批量编辑' : 'Batch Edit';
                bulkBtn.querySelector('span').textContent = btnText;
                bulkBtn.style.background = '';
                bulkBtn.style.borderColor = '';
            }
            this.updateRecentEntries(); // Refresh to hide checkboxes
        }
        
        this.updateBatchButtonStates();
    }
    
    selectAllEntries(checked) {
        const checkboxes = document.querySelectorAll('.entry-checkbox');
        
        if (checked) {
            checkboxes.forEach(cb => {
                cb.checked = true;
                // Convert to number to match entry.id type
                const numericId = parseInt(cb.dataset.entryId);
                this.selectedEntries.add(numericId);
            });
        } else {
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
            this.selectedEntries.clear();
        }
        
        this.updateBatchButtonStates();
    }
    
    handleEntryCheckboxChange(entryId, checked) {
        // Convert to number to match entry.id type
        const numericId = parseInt(entryId);
        
        if (checked) {
            this.selectedEntries.add(numericId);
        } else {
            this.selectedEntries.delete(numericId);
        }
        
        // Update select all checkbox state
        const allCheckboxes = document.querySelectorAll('.entry-checkbox');
        const checkedCheckboxes = document.querySelectorAll('.entry-checkbox:checked');
        document.getElementById('selectAllEntries').checked = allCheckboxes.length === checkedCheckboxes.length;
        
        this.updateBatchButtonStates();
    }
    
    updateBatchButtonStates() {
        const count = this.selectedEntries.size;
        const currentLocale = i18n.getLocale();
        
        // Update count display
        const countText = currentLocale === 'zh' ? `已选择 ${count} 项` : `${count} selected`;
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = countText;
        }
        
        // Enable/disable buttons
        const editBtn = document.getElementById('batchEditTagsBtn');
        const deleteBtn = document.getElementById('batchDeleteBtn');
        
        if (!editBtn || !deleteBtn) {
            console.error('Batch buttons not found');
            return;
        }
        
        if (count > 0) {
            editBtn.disabled = false;
            deleteBtn.disabled = false;
            editBtn.style.opacity = '1';
            deleteBtn.style.opacity = '1';
            editBtn.style.cursor = 'pointer';
            deleteBtn.style.cursor = 'pointer';
        } else {
            editBtn.disabled = true;
            deleteBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            deleteBtn.style.opacity = '0.5';
            editBtn.style.cursor = 'not-allowed';
            deleteBtn.style.cursor = 'not-allowed';
        }
    }
    
    showBatchEditTagsModal() {
        if (this.selectedEntries.size === 0) return;
        
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '批量编辑标签' : 'Batch Edit Tags';
        const description = currentLocale === 'zh' 
            ? `为 ${this.selectedEntries.size} 个条目添加或移除标签`
            : `Add or remove tags for ${this.selectedEntries.size} entries`;
        const addTagsLabel = currentLocale === 'zh' ? '添加标签' : 'Add Tags';
        const removeTagsLabel = currentLocale === 'zh' ? '移除标签' : 'Remove Tags';
        const applyBtn = currentLocale === 'zh' ? '应用更改' : 'Apply Changes';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        const placeholderAdd = currentLocale === 'zh' ? '输入要添加的标签，用逗号分隔' : 'Enter tags to add, separated by commas';
        const placeholderRemove = currentLocale === 'zh' ? '输入要移除的标签，用逗号分隔' : 'Enter tags to remove, separated by commas';
        
        const modalHTML = `
            <div class="modal-overlay" id="batchEditTagsModal" style="display: flex;">
                <div class="modal-content" style="max-width: 550px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-tags"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('batchEditTagsModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                <i class="fas fa-plus-circle" style="color: var(--primary-green);"></i> ${addTagsLabel}
                            </label>
                            <input type="text" id="batchAddTags" 
                                   style="width: 100%; padding: 0.75rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 1rem;"
                                   placeholder="${placeholderAdd}">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                <i class="fas fa-minus-circle" style="color: #ff4444;"></i> ${removeTagsLabel}
                            </label>
                            <input type="text" id="batchRemoveTags" 
                                   style="width: 100%; padding: 0.75rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 68, 68, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 1rem;"
                                   placeholder="${placeholderRemove}">
                        </div>
                        
                        <div style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 8px; margin-top: 1rem;">
                            <div style="color: var(--gray-400); font-size: 0.85rem;">
                                <i class="fas fa-info-circle" style="color: var(--primary-green);"></i>
                                ${currentLocale === 'zh' 
                                    ? '添加和移除操作将同时应用于所有选中的条目。'
                                    : 'Add and remove operations will be applied to all selected entries simultaneously.'}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('batchEditTagsModal').remove()">
                            ${cancelBtn}
                        </button>
                        <button class="btn-primary" id="applyBatchTagsBtn">
                            <i class="fas fa-check"></i> ${applyBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('batchEditTagsModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Apply button handler
        document.getElementById('applyBatchTagsBtn').addEventListener('click', () => {
            this.applyBatchTagChanges();
        });
        
        // Close on overlay click
        document.getElementById('batchEditTagsModal').addEventListener('click', (e) => {
            if (e.target.id === 'batchEditTagsModal') {
                document.getElementById('batchEditTagsModal').remove();
            }
        });
    }
    
    applyBatchTagChanges() {
        const addTagsInput = document.getElementById('batchAddTags').value;
        const removeTagsInput = document.getElementById('batchRemoveTags').value;
        
        const tagsToAdd = addTagsInput ? addTagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
        const tagsToRemove = removeTagsInput ? removeTagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
        
        if (tagsToAdd.length === 0 && tagsToRemove.length === 0) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '请输入要添加或移除的标签' : 'Please enter tags to add or remove';
            this.showToast(msg);
            return;
        }
        
        let modifiedCount = 0;
        
        this.selectedEntries.forEach(entryId => {
            const entry = this.moodData.find(e => e.id === entryId);
            if (entry) {
                if (!entry.tags) entry.tags = [];
                
                // Add tags
                tagsToAdd.forEach(tag => {
                    if (!entry.tags.includes(tag)) {
                        entry.tags.push(tag);
                    }
                });
                
                // Remove tags
                tagsToRemove.forEach(tag => {
                    entry.tags = entry.tags.filter(t => t !== tag);
                });
                
                modifiedCount++;
            }
        });
        
        this.saveMoodData();
        this.updateDashboard();
        this.generateInsights();
        
        document.getElementById('batchEditTagsModal').remove();
        
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' 
            ? `已更新 ${modifiedCount} 个条目的标签`
            : `Updated tags for ${modifiedCount} entries`;
        this.showToast(msg);
        
        // Exit batch mode
        this.toggleBatchMode();
    }
    
    batchDeleteEntries() {
        if (this.selectedEntries.size === 0) return;
        
        const currentLocale = i18n.getLocale();
        const confirmMsg = currentLocale === 'zh'
            ? `确定要删除选中的 ${this.selectedEntries.size} 个条目吗？此操作不可恢复！`
            : `Are you sure you want to delete ${this.selectedEntries.size} selected entries? This action cannot be undone!`;
        
        if (!confirm(confirmMsg)) return;
        
        const deletedCount = this.selectedEntries.size;
        
        // Remove selected entries
        this.moodData = this.moodData.filter(entry => !this.selectedEntries.has(entry.id));
        
        this.saveMoodData();
        this.updateDashboard();
        this.generateInsights();
        
        const msg = currentLocale === 'zh'
            ? `已删除 ${deletedCount} 个条目`
            : `Deleted ${deletedCount} entries`;
        this.showToast(msg);
        
        // Exit batch mode
        this.toggleBatchMode();
    }
    
    // ==================== GOALS SYSTEM ====================
    
    loadGoals() {
        try {
            const data = localStorage.getItem('moodTrackerGoals');
            return data ? JSON.parse(data) : {
                moodAverage: {
                    enabled: false,
                    target: 4,
                    period: 'week' // 'week' or 'month'
                },
                consecutiveDays: {
                    enabled: false,
                    target: 7
                }
            };
        } catch (error) {
            console.error('Error loading goals:', error);
            return {
                moodAverage: { enabled: false, target: 4, period: 'week' },
                consecutiveDays: { enabled: false, target: 7 }
            };
        }
    }
    
    saveGoals() {
        try {
            localStorage.setItem('moodTrackerGoals', JSON.stringify(this.goals));
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    }
    
    showGoalsModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '目标设置' : 'Goals Settings';
        const description = currentLocale === 'zh' 
            ? '设置心情目标，追踪您的进度，养成良好习惯'
            : 'Set mood goals, track your progress, and build healthy habits';
        const closeBtn = currentLocale === 'zh' ? '关闭' : 'Close';
        const saveBtn = currentLocale === 'zh' ? '保存' : 'Save';
        
        const modalHTML = `
            <div class="modal-overlay" id="goalsModal" style="display: flex;">
                <div class="modal-content" style="max-width: 650px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-bullseye"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('goalsModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: var(--gray-400); margin-bottom: 1.5rem;">${description}</p>
                        
                        <!-- Mood Average Goal -->
                        <div style="padding: 1.5rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; margin-bottom: 1.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="color: var(--primary-green); margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                                        <i class="fas fa-smile"></i> ${currentLocale === 'zh' ? '平均情绪目标' : 'Average Mood Goal'}
                                    </h3>
                                    <div style="color: var(--gray-400); font-size: 0.85rem;">
                                        ${currentLocale === 'zh' ? '设置您想要达到的平均情绪值' : 'Set your target average mood value'}
                                    </div>
                                </div>
                                <label class="sync-toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
                                    <input type="checkbox" id="moodGoalEnabled" ${this.goals.moodAverage.enabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                    <span class="sync-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: 0.3s; border-radius: 26px; border: 1px solid rgba(0, 255, 136, 0.3);"></span>
                                </label>
                            </div>
                            
                            <div id="moodGoalSettings" style="${this.goals.moodAverage.enabled ? '' : 'display: none;'}">
                                <div style="margin-bottom: 1rem;">
                                    <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                        ${currentLocale === 'zh' ? '目标值' : 'Target Value'}: <span id="moodTargetValue" style="color: var(--primary-green);">${this.goals.moodAverage.target}</span>
                                    </label>
                                    <input type="range" id="moodTargetSlider" min="1" max="5" step="0.5" value="${this.goals.moodAverage.target}" 
                                           style="width: 100%; accent-color: var(--primary-green);">
                                    <div style="display: flex; justify-content: space-between; color: var(--gray-500); font-size: 0.75rem; margin-top: 0.25rem;">
                                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                        ${currentLocale === 'zh' ? '统计周期' : 'Period'}
                                    </label>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                        <button class="period-btn" data-period="week" style="padding: 0.75rem; background: ${this.goals.moodAverage.period === 'week' ? 'var(--primary-green)' : 'rgba(0, 0, 0, 0.4)'}; border: 1px solid ${this.goals.moodAverage.period === 'week' ? 'var(--primary-green)' : 'rgba(0, 255, 136, 0.3)'}; border-radius: 8px; color: ${this.goals.moodAverage.period === 'week' ? 'var(--primary-black)' : 'var(--gray-300)'}; cursor: pointer; transition: all 0.3s;">
                                            ${currentLocale === 'zh' ? '每周' : 'Weekly'}
                                        </button>
                                        <button class="period-btn" data-period="month" style="padding: 0.75rem; background: ${this.goals.moodAverage.period === 'month' ? 'var(--primary-green)' : 'rgba(0, 0, 0, 0.4)'}; border: 1px solid ${this.goals.moodAverage.period === 'month' ? 'var(--primary-green)' : 'rgba(0, 255, 136, 0.3)'}; border-radius: 8px; color: ${this.goals.moodAverage.period === 'month' ? 'var(--primary-black)' : 'var(--gray-300)'}; cursor: pointer; transition: all 0.3s;">
                                            ${currentLocale === 'zh' ? '每月' : 'Monthly'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Consecutive Days Goal -->
                        <div style="padding: 1.5rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="color: var(--primary-green); margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                                        <i class="fas fa-fire"></i> ${currentLocale === 'zh' ? '连续记录目标' : 'Streak Goal'}
                                    </h3>
                                    <div style="color: var(--gray-400); font-size: 0.85rem;">
                                        ${currentLocale === 'zh' ? '设置连续记录的天数目标' : 'Set your target consecutive days'}
                                    </div>
                                </div>
                                <label class="sync-toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
                                    <input type="checkbox" id="streakGoalEnabled" ${this.goals.consecutiveDays.enabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                    <span class="sync-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: 0.3s; border-radius: 26px; border: 1px solid rgba(0, 255, 136, 0.3);"></span>
                                </label>
                            </div>
                            
                            <div id="streakGoalSettings" style="${this.goals.consecutiveDays.enabled ? '' : 'display: none;'}">
                                <div>
                                    <label style="display: block; color: var(--gray-300); margin-bottom: 0.5rem; font-weight: 500;">
                                        ${currentLocale === 'zh' ? '目标天数' : 'Target Days'}: <span id="streakTargetValue" style="color: var(--primary-green);">${this.goals.consecutiveDays.target}</span> ${currentLocale === 'zh' ? '天' : 'days'}
                                    </label>
                                    <input type="range" id="streakTargetSlider" min="3" max="365" step="1" value="${this.goals.consecutiveDays.target}" 
                                           style="width: 100%; accent-color: var(--primary-green);">
                                    <div style="display: flex; justify-content: space-between; color: var(--gray-500); font-size: 0.75rem; margin-top: 0.25rem;">
                                        <span>3</span><span>30</span><span>100</span><span>365</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('goalsModal').remove()">
                            ${closeBtn}
                        </button>
                        <button class="btn-primary" id="saveGoalsBtn">
                            <i class="fas fa-check"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('goalsModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event handlers
        const moodGoalToggle = document.getElementById('moodGoalEnabled');
        const moodGoalSettings = document.getElementById('moodGoalSettings');
        moodGoalToggle.addEventListener('change', (e) => {
            moodGoalSettings.style.display = e.target.checked ? 'block' : 'none';
        });
        
        const streakGoalToggle = document.getElementById('streakGoalEnabled');
        const streakGoalSettings = document.getElementById('streakGoalSettings');
        streakGoalToggle.addEventListener('change', (e) => {
            streakGoalSettings.style.display = e.target.checked ? 'block' : 'none';
        });
        
        // Mood target slider
        const moodSlider = document.getElementById('moodTargetSlider');
        const moodValue = document.getElementById('moodTargetValue');
        moodSlider.addEventListener('input', (e) => {
            moodValue.textContent = e.target.value;
        });
        
        // Streak target slider
        const streakSlider = document.getElementById('streakTargetSlider');
        const streakValue = document.getElementById('streakTargetValue');
        streakSlider.addEventListener('input', (e) => {
            streakValue.textContent = e.target.value;
        });
        
        // Period buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = btn.dataset.period;
                document.querySelectorAll('.period-btn').forEach(b => {
                    b.style.background = 'rgba(0, 0, 0, 0.4)';
                    b.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                    b.style.color = 'var(--gray-300)';
                });
                btn.style.background = 'var(--primary-green)';
                btn.style.borderColor = 'var(--primary-green)';
                btn.style.color = 'var(--primary-black)';
            });
        });
        
        // Save button
        document.getElementById('saveGoalsBtn').addEventListener('click', () => {
            this.saveGoalsSettings();
        });
        
        // Close on overlay click
        document.getElementById('goalsModal').addEventListener('click', (e) => {
            if (e.target.id === 'goalsModal') {
                document.getElementById('goalsModal').remove();
            }
        });
    }
    
    saveGoalsSettings() {
        const currentLocale = i18n.getLocale();
        
        // Update mood average goal
        this.goals.moodAverage.enabled = document.getElementById('moodGoalEnabled').checked;
        this.goals.moodAverage.target = parseFloat(document.getElementById('moodTargetSlider').value);
        
        const selectedPeriodBtn = document.querySelector('.period-btn[style*="background: var(--primary-green)"]');
        if (selectedPeriodBtn) {
            this.goals.moodAverage.period = selectedPeriodBtn.dataset.period;
        }
        
        // Update consecutive days goal
        this.goals.consecutiveDays.enabled = document.getElementById('streakGoalEnabled').checked;
        this.goals.consecutiveDays.target = parseInt(document.getElementById('streakTargetSlider').value);
        
        this.saveGoals();
        
        const msg = currentLocale === 'zh' ? '目标设置已保存！' : 'Goals settings saved!';
        this.showToast(msg);
        
        document.getElementById('goalsModal').remove();
        
        // Refresh dashboard if goals are enabled
        if (this.goals.moodAverage.enabled || this.goals.consecutiveDays.enabled) {
            this.updateDashboard();
        }
    }
    
    updateGoalsProgress() {
        const currentLocale = i18n.getLocale();
        
        // Update mood goal progress
        if (this.goals.moodAverage.enabled) {
            const moodGoalCard = document.getElementById('moodGoalCard');
            if (moodGoalCard) {
                moodGoalCard.style.display = 'block';
                
                const currentAverage = this.calculatePeriodAverage(this.goals.moodAverage.period);
                const target = this.goals.moodAverage.target;
                const progress = Math.min((currentAverage / target) * 100, 100);
                
                document.getElementById('moodGoalProgress').textContent = `${currentAverage.toFixed(1)} / ${target}`;
                document.getElementById('moodGoalBar').style.width = `${progress}%`;
                
                const periodText = this.goals.moodAverage.period === 'week'
                    ? (currentLocale === 'zh' ? '周平均目标' : 'Weekly Goal')
                    : (currentLocale === 'zh' ? '月平均目标' : 'Monthly Goal');
                document.getElementById('moodGoalLabel').textContent = periodText;
                
                // Change color based on progress
                const bar = document.getElementById('moodGoalBar');
                if (progress >= 100) {
                    bar.style.background = 'var(--primary-green)';
                } else if (progress >= 80) {
                    bar.style.background = '#88ff00';
                } else if (progress >= 50) {
                    bar.style.background = '#ffcc00';
                } else {
                    bar.style.background = '#ff8800';
                }
            }
        } else {
            const moodGoalCard = document.getElementById('moodGoalCard');
            if (moodGoalCard) moodGoalCard.style.display = 'none';
        }
        
        // Update streak goal progress
        if (this.goals.consecutiveDays.enabled) {
            const streakGoalCard = document.getElementById('streakGoalCard');
            if (streakGoalCard) {
                streakGoalCard.style.display = 'block';
                
                const currentStreak = this.calculateCurrentStreak();
                const target = this.goals.consecutiveDays.target;
                const progress = Math.min((currentStreak / target) * 100, 100);
                
                document.getElementById('streakGoalProgress').textContent = `${currentStreak} / ${target}`;
                document.getElementById('streakGoalBar').style.width = `${progress}%`;
                
                const streakLabel = currentLocale === 'zh' ? '连续记录目标' : 'Streak Goal';
                document.getElementById('streakGoalLabel').textContent = streakLabel;
                
                // Change color based on progress
                const bar = document.getElementById('streakGoalBar');
                if (progress >= 100) {
                    bar.style.background = 'var(--primary-green)';
                } else if (progress >= 80) {
                    bar.style.background = '#88ff00';
                } else if (progress >= 50) {
                    bar.style.background = '#ffcc00';
                } else {
                    bar.style.background = '#ff8800';
                }
            }
        } else {
            const streakGoalCard = document.getElementById('streakGoalCard');
            if (streakGoalCard) streakGoalCard.style.display = 'none';
        }
    }
    
    calculatePeriodAverage(period) {
        if (this.moodData.length === 0) return 0;
        
        const now = new Date();
        const periodStart = new Date();
        
        if (period === 'week') {
            periodStart.setDate(now.getDate() - 7);
        } else {
            periodStart.setMonth(now.getMonth() - 1);
        }
        
        const periodEntries = this.moodData.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= periodStart && entryDate <= now;
        });
        
        if (periodEntries.length === 0) return 0;
        
        const sum = periodEntries.reduce((acc, entry) => acc + entry.mood.value, 0);
        return sum / periodEntries.length;
    }
    
    calculateCurrentStreak() {
        if (this.moodData.length === 0) return 0;
        
        // Sort entries by date descending
        const sorted = [...this.moodData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const entry of sorted) {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
            } else if (diffDays > streak) {
                break;
            }
        }
        
        return streak;
    }
    
    checkGoalReminders() {
        const currentLocale = i18n.getLocale();
        
        // Check mood goal
        if (this.goals.moodAverage.enabled) {
            const currentAverage = this.calculatePeriodAverage(this.goals.moodAverage.period);
            const target = this.goals.moodAverage.target;
            const progress = (currentAverage / target) * 100;
            
            // Goal achieved!
            if (progress >= 100 && !this.hasShownGoalAchievement('mood', this.goals.moodAverage.period)) {
                const msg = currentLocale === 'zh'
                    ? `🎉 恭喜！您已达成${this.goals.moodAverage.period === 'week' ? '本周' : '本月'}平均情绪目标 ${target}！`
                    : `🎉 Congratulations! You've achieved your ${this.goals.moodAverage.period}ly mood goal of ${target}!`;
                this.showToast(msg, 'success');
                this.markGoalAchievement('mood', this.goals.moodAverage.period);
            }
            // Encourage if below 50%
            else if (progress < 50 && this.shouldShowEncouragement('mood')) {
                const msg = currentLocale === 'zh'
                    ? `💪 继续加油！当前平均${currentAverage.toFixed(1)}，距离目标${target}还差一点点！`
                    : `💪 Keep going! Current average ${currentAverage.toFixed(1)}, you're getting closer to ${target}!`;
                this.showToast(msg, 'info');
                this.markEncouragementShown('mood');
            }
        }
        
        // Check streak goal
        if (this.goals.consecutiveDays.enabled) {
            const currentStreak = this.calculateCurrentStreak();
            const target = this.goals.consecutiveDays.target;
            const progress = (currentStreak / target) * 100;
            
            // Goal achieved!
            if (currentStreak >= target && !this.hasShownGoalAchievement('streak', currentStreak)) {
                const msg = currentLocale === 'zh'
                    ? `🔥 太棒了！您已连续记录${currentStreak}天，达成目标！`
                    : `🔥 Amazing! You've reached ${currentStreak} days streak, goal achieved!`;
                this.showToast(msg, 'success');
                this.markGoalAchievement('streak', currentStreak);
            }
            // Milestone reminders (every 7 days)
            else if (currentStreak > 0 && currentStreak % 7 === 0 && !this.hasShownMilestone('streak', currentStreak)) {
                const msg = currentLocale === 'zh'
                    ? `🎯 已连续${currentStreak}天！距离目标${target}天还有${target - currentStreak}天！`
                    : `🎯 ${currentStreak} days streak! ${target - currentStreak} days to go!`;
                this.showToast(msg, 'info');
                this.markMilestoneShown('streak', currentStreak);
            }
        }
    }
    
    hasShownGoalAchievement(type, period) {
        const key = `goalAchieved_${type}_${period}`;
        const lastShown = localStorage.getItem(key);
        if (!lastShown) return false;
        
        // Reset weekly achievements on Monday, monthly on 1st
        const now = new Date();
        const lastShownDate = new Date(parseInt(lastShown));
        
        if (type === 'mood') {
            if (period === 'week') {
                return now.getDay() === lastShownDate.getDay();
            } else {
                return now.getDate() <= 7 && lastShownDate.getMonth() === now.getMonth();
            }
        } else if (type === 'streak') {
            return lastShownDate.toDateString() === now.toDateString();
        }
        
        return false;
    }
    
    markGoalAchievement(type, period) {
        const key = `goalAchieved_${type}_${period}`;
        localStorage.setItem(key, Date.now().toString());
    }
    
    shouldShowEncouragement(type) {
        const key = `encouragementShown_${type}`;
        const lastShown = localStorage.getItem(key);
        if (!lastShown) return true;
        
        // Show encouragement once per day
        const lastShownDate = new Date(parseInt(lastShown));
        const now = new Date();
        return lastShownDate.toDateString() !== now.toDateString();
    }
    
    markEncouragementShown(type) {
        const key = `encouragementShown_${type}`;
        localStorage.setItem(key, Date.now().toString());
    }
    
    hasShownMilestone(type, value) {
        const key = `milestone_${type}_${value}`;
        return localStorage.getItem(key) === 'true';
    }
    
    markMilestoneShown(type, value) {
        const key = `milestone_${type}_${value}`;
        localStorage.setItem(key, 'true');
    }
    
    // ==================== ACHIEVEMENTS SYSTEM ====================
    
    initializeBadges() {
        return [
            // Streak Badges
            {
                id: 'streak_7',
                name: { zh: '初心者', en: 'Beginner' },
                description: { zh: '连续记录7天', en: 'Log for 7 consecutive days' },
                icon: '🌱',
                category: 'streak',
                condition: { type: 'streak', value: 7 },
                rarity: 'common',
                hidden: false
            },
            {
                id: 'streak_30',
                name: { zh: '坚持者', en: 'Committed' },
                description: { zh: '连续记录30天', en: 'Log for 30 consecutive days' },
                icon: '🌿',
                category: 'streak',
                condition: { type: 'streak', value: 30 },
                rarity: 'rare',
                hidden: false
            },
            {
                id: 'streak_100',
                name: { zh: '百日大师', en: 'Centurion' },
                description: { zh: '连续记录100天', en: 'Log for 100 consecutive days' },
                icon: '🌳',
                category: 'streak',
                condition: { type: 'streak', value: 100 },
                rarity: 'epic',
                hidden: false
            },
            {
                id: 'streak_365',
                name: { zh: '年度传奇', en: 'Legend' },
                description: { zh: '连续记录365天', en: 'Log for 365 consecutive days' },
                icon: '🏆',
                category: 'streak',
                condition: { type: 'streak', value: 365 },
                rarity: 'legendary',
                hidden: false
            },
            
            // Entry Count Badges
            {
                id: 'entries_10',
                name: { zh: '新手记录者', en: 'Novice Logger' },
                description: { zh: '记录10次心情', en: 'Log 10 mood entries' },
                icon: '📝',
                category: 'entries',
                condition: { type: 'totalEntries', value: 10 },
                rarity: 'common',
                hidden: false
            },
            {
                id: 'entries_50',
                name: { zh: '经验记录者', en: 'Experienced Logger' },
                description: { zh: '记录50次心情', en: 'Log 50 mood entries' },
                icon: '📚',
                category: 'entries',
                condition: { type: 'totalEntries', value: 50 },
                rarity: 'common',
                hidden: false
            },
            {
                id: 'entries_100',
                name: { zh: '专业记录者', en: 'Professional Logger' },
                description: { zh: '记录100次心情', en: 'Log 100 mood entries' },
                icon: '📖',
                category: 'entries',
                condition: { type: 'totalEntries', value: 100 },
                rarity: 'rare',
                hidden: false
            },
            {
                id: 'entries_500',
                name: { zh: '大师记录者', en: 'Master Logger' },
                description: { zh: '记录500次心情', en: 'Log 500 mood entries' },
                icon: '📕',
                category: 'entries',
                condition: { type: 'totalEntries', value: 500 },
                rarity: 'epic',
                hidden: false
            },
            
            // Mood Average Badges
            {
                id: 'mood_perfect_week',
                name: { zh: '完美一周', en: 'Perfect Week' },
                description: { zh: '一周平均心情达到4.5', en: 'Average mood 4.5+ for a week' },
                icon: '⭐',
                category: 'mood',
                condition: { type: 'weeklyAverage', value: 4.5 },
                rarity: 'rare',
                hidden: false
            },
            {
                id: 'mood_perfect_month',
                name: { zh: '完美一月', en: 'Perfect Month' },
                description: { zh: '一月平均心情达到4.5', en: 'Average mood 4.5+ for a month' },
                icon: '🌟',
                category: 'mood',
                condition: { type: 'monthlyAverage', value: 4.5 },
                rarity: 'epic',
                hidden: false
            },
            
            // Special/Hidden Badges
            {
                id: 'night_owl',
                name: { zh: '夜猫子', en: 'Night Owl' },
                description: { zh: '在午夜后记录10次', en: 'Log 10 times after midnight' },
                icon: '🦉',
                category: 'special',
                condition: { type: 'lateNightEntries', value: 10 },
                rarity: 'rare',
                hidden: true
            },
            {
                id: 'early_bird',
                name: { zh: '早起鸟', en: 'Early Bird' },
                description: { zh: '在早上6点前记录10次', en: 'Log 10 times before 6 AM' },
                icon: '🐦',
                category: 'special',
                condition: { type: 'earlyMorningEntries', value: 10 },
                rarity: 'rare',
                hidden: true
            },
            {
                id: 'emoji_master',
                name: { zh: '表情大师', en: 'Emoji Master' },
                description: { zh: '使用自定义心情量表', en: 'Use custom mood scale' },
                icon: '🎭',
                category: 'special',
                condition: { type: 'customScale', value: 1 },
                rarity: 'rare',
                hidden: true
            },
            {
                id: 'comeback_king',
                name: { zh: '东山再起', en: 'Comeback King' },
                description: { zh: '中断30天后重新开始连续记录7天', en: 'Resume logging after 30-day break' },
                icon: '👑',
                category: 'special',
                condition: { type: 'comeback', value: 7 },
                rarity: 'epic',
                hidden: true
            },
            {
                id: 'data_hoarder',
                name: { zh: '数据收集者', en: 'Data Hoarder' },
                description: { zh: '导出数据5次', en: 'Export data 5 times' },
                icon: '💾',
                category: 'special',
                condition: { type: 'exports', value: 5 },
                rarity: 'rare',
                hidden: true
            }
        ];
    }
    
    loadAchievements() {
        try {
            const data = localStorage.getItem('moodTrackerAchievements');
            return data ? JSON.parse(data) : {
                unlockedBadges: [],
                unlockedAt: {},
                stats: {
                    lateNightEntries: 0,
                    earlyMorningEntries: 0,
                    exports: 0
                }
            };
        } catch (error) {
            console.error('Error loading achievements:', error);
            return {
                unlockedBadges: [],
                unlockedAt: {},
                stats: {
                    lateNightEntries: 0,
                    earlyMorningEntries: 0,
                    exports: 0
                }
            };
        }
    }
    
    saveAchievements() {
        try {
            localStorage.setItem('moodTrackerAchievements', JSON.stringify(this.achievements));
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    }
    
    checkAndUnlockAchievements() {
        const newlyUnlocked = [];
        
        this.allBadges.forEach(badge => {
            // Skip if already unlocked
            if (this.achievements.unlockedBadges.includes(badge.id)) return;
            
            let conditionMet = false;
            
            switch (badge.condition.type) {
                case 'streak':
                    const currentStreak = this.calculateCurrentStreak();
                    conditionMet = currentStreak >= badge.condition.value;
                    break;
                    
                case 'totalEntries':
                    conditionMet = this.moodData.length >= badge.condition.value;
                    break;
                    
                case 'weeklyAverage':
                    const weekAvg = this.calculatePeriodAverage('week');
                    conditionMet = weekAvg >= badge.condition.value;
                    break;
                    
                case 'monthlyAverage':
                    const monthAvg = this.calculatePeriodAverage('month');
                    conditionMet = monthAvg >= badge.condition.value;
                    break;
                    
                case 'lateNightEntries':
                    conditionMet = this.achievements.stats.lateNightEntries >= badge.condition.value;
                    break;
                    
                case 'earlyMorningEntries':
                    conditionMet = this.achievements.stats.earlyMorningEntries >= badge.condition.value;
                    break;
                    
                case 'customScale':
                    const customScale = localStorage.getItem('customMoodScale');
                    conditionMet = customScale !== null;
                    break;
                    
                case 'exports':
                    conditionMet = this.achievements.stats.exports >= badge.condition.value;
                    break;
                    
                case 'comeback':
                    // Check if user had a 30+ day break and now has 7 day streak
                    conditionMet = this.checkComebackCondition();
                    break;
            }
            
            if (conditionMet) {
                this.unlockBadge(badge.id);
                newlyUnlocked.push(badge);
            }
        });
        
        // Show notifications for newly unlocked badges
        if (newlyUnlocked.length > 0) {
            this.showBadgeUnlockNotification(newlyUnlocked);
        }
    }
    
    unlockBadge(badgeId) {
        if (!this.achievements.unlockedBadges.includes(badgeId)) {
            this.achievements.unlockedBadges.push(badgeId);
            this.achievements.unlockedAt[badgeId] = Date.now();
            this.saveAchievements();
        }
    }
    
    showBadgeUnlockNotification(badges) {
        const currentLocale = i18n.getLocale();
        
        badges.forEach((badge, index) => {
            setTimeout(() => {
                const name = badge.name[currentLocale] || badge.name.en;
                const msg = currentLocale === 'zh'
                    ? `🎊 成就解锁！${badge.icon} ${name}`
                    : `🎊 Achievement Unlocked! ${badge.icon} ${name}`;
                
                this.showToast(msg, 'achievement', 4000);
            }, index * 1000); // Stagger notifications
        });
    }
    
    checkComebackCondition() {
        if (this.moodData.length < 8) return false;
        
        const sorted = [...this.moodData].sort((a, b) => new Date(a.date) - new Date(b.date));
        const recent7 = sorted.slice(-7);
        const before7 = sorted.slice(0, -7);
        
        if (before7.length === 0) return false;
        
        // Check if there's a 30+ day gap
        const lastOldEntry = new Date(before7[before7.length - 1].date);
        const firstRecentEntry = new Date(recent7[0].date);
        const daysDiff = (firstRecentEntry - lastOldEntry) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 30) return false;
        
        // Check if recent 7 days are consecutive
        for (let i = 1; i < recent7.length; i++) {
            const prev = new Date(recent7[i - 1].date);
            const curr = new Date(recent7[i].date);
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diff > 2) return false; // Allow 1 day gap
        }
        
        return true;
    }
    
    trackSpecialStats(entryDate) {
        const date = new Date(entryDate);
        const hour = date.getHours();
        
        // Track late night entries (after midnight, before 3 AM)
        if (hour >= 0 && hour < 3) {
            this.achievements.stats.lateNightEntries++;
        }
        
        // Track early morning entries (before 6 AM)
        if (hour >= 3 && hour < 6) {
            this.achievements.stats.earlyMorningEntries++;
        }
        
        this.saveAchievements();
    }
    
    incrementExportCount() {
        this.achievements.stats.exports++;
        this.saveAchievements();
        this.checkAndUnlockAchievements();
    }
    
    showAchievementsModal() {
        const currentLocale = i18n.getLocale();
        const title = currentLocale === 'zh' ? '成就徽章' : 'Achievements';
        const description = currentLocale === 'zh'
            ? '解锁徽章，追踪您的成就'
            : 'Unlock badges and track your achievements';
        
        const unlockedCount = this.achievements.unlockedBadges.length;
        const totalCount = this.allBadges.filter(b => !b.hidden).length;
        const totalWithHidden = this.allBadges.length;
        
        const categories = {
            streak: { zh: '连续记录', en: 'Streak', icon: '🔥' },
            entries: { zh: '记录统计', en: 'Entries', icon: '📝' },
            mood: { zh: '心情成就', en: 'Mood', icon: '😊' },
            special: { zh: '特殊成就', en: 'Special', icon: '⭐' }
        };
        
        const rarityColors = {
            common: '#888888',
            rare: '#3498db',
            epic: '#9b59b6',
            legendary: '#f39c12'
        };
        
        const rarityNames = {
            common: { zh: '普通', en: 'Common' },
            rare: { zh: '稀有', en: 'Rare' },
            epic: { zh: '史诗', en: 'Epic' },
            legendary: { zh: '传说', en: 'Legendary' }
        };
        
        // Group badges by category
        const badgesByCategory = {};
        this.allBadges.forEach(badge => {
            if (!badgesByCategory[badge.category]) {
                badgesByCategory[badge.category] = [];
            }
            badgesByCategory[badge.category].push(badge);
        });
        
        // Generate badges HTML
        let badgesHTML = '';
        Object.keys(categories).forEach(categoryKey => {
            const category = categories[categoryKey];
            const badges = badgesByCategory[categoryKey] || [];
            
            if (badges.length === 0) return;
            
            const categoryName = category[currentLocale] || category.en;
            
            badgesHTML += `
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-green); margin-bottom: 1rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>${category.icon}</span>
                        <span>${categoryName}</span>
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;">
            `;
            
            badges.forEach(badge => {
                const isUnlocked = this.achievements.unlockedBadges.includes(badge.id);
                const isHidden = badge.hidden && !isUnlocked;
                const badgeName = badge.name[currentLocale] || badge.name.en;
                const badgeDesc = badge.description[currentLocale] || badge.description.en;
                const rarityName = rarityNames[badge.rarity][currentLocale] || rarityNames[badge.rarity].en;
                const rarityColor = rarityColors[badge.rarity];
                
                if (isHidden) {
                    // Hidden badge
                    badgesHTML += `
                        <div class="badge-card" style="padding: 1rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; text-align: center; opacity: 0.5; position: relative;">
                            <div style="font-size: 3rem; filter: grayscale(100%) blur(4px);">❓</div>
                            <div style="color: var(--gray-500); font-size: 0.85rem; margin-top: 0.5rem;">${currentLocale === 'zh' ? '隐藏徽章' : 'Hidden'}</div>
                            <div style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0, 0, 0, 0.6); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; color: ${rarityColor};">
                                ${rarityName}
                            </div>
                        </div>
                    `;
                } else if (isUnlocked) {
                    const unlockedDate = new Date(this.achievements.unlockedAt[badge.id]);
                    const dateStr = unlockedDate.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : 'en-US');
                    
                    badgesHTML += `
                        <div class="badge-card unlocked" style="padding: 1rem; background: linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 0, 0, 0.4) 100%); border: 1px solid var(--primary-green); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s; position: relative;" title="${badgeDesc}">
                            <div style="font-size: 3rem;">${badge.icon}</div>
                            <div style="color: var(--primary-green); font-weight: 600; font-size: 0.9rem; margin-top: 0.5rem;">${badgeName}</div>
                            <div style="color: var(--gray-400); font-size: 0.75rem; margin-top: 0.25rem;">${dateStr}</div>
                            <div style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0, 0, 0, 0.6); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; color: ${rarityColor};">
                                ${rarityName}
                            </div>
                            <div class="share-badge-btn" data-badge-id="${badge.id}" style="position: absolute; bottom: 0.5rem; right: 0.5rem; background: rgba(0, 255, 136, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; color: var(--primary-green); cursor: pointer;" title="${currentLocale === 'zh' ? '分享' : 'Share'}">
                                <i class="fas fa-share-alt"></i>
                            </div>
                        </div>
                    `;
                } else {
                    // Locked badge
                    badgesHTML += `
                        <div class="badge-card locked" style="padding: 1rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; text-align: center; opacity: 0.5; position: relative;" title="${badgeDesc}">
                            <div style="font-size: 3rem; filter: grayscale(100%);">${badge.icon}</div>
                            <div style="color: var(--gray-500); font-size: 0.9rem; margin-top: 0.5rem;">${badgeName}</div>
                            <div style="color: var(--gray-600); font-size: 0.75rem; margin-top: 0.25rem;">${badgeDesc}</div>
                            <div style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0, 0, 0, 0.6); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; color: ${rarityColor};">
                                ${rarityName}
                            </div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; opacity: 0.3;">
                                <i class="fas fa-lock"></i>
                            </div>
                        </div>
                    `;
                }
            });
            
            badgesHTML += `
                    </div>
                </div>
            `;
        });
        
        const modalHTML = `
            <div class="modal-overlay" id="achievementsModal" style="display: flex;">
                <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h2><i class="fas fa-trophy"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('achievementsModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%); border: 1px solid var(--primary-green); border-radius: 12px; margin-bottom: 2rem; text-align: center;">
                            <div style="font-size: 3rem; font-weight: 700; color: var(--primary-green); margin-bottom: 0.5rem;">
                                ${unlockedCount} / ${totalCount}
                            </div>
                            <div style="color: var(--gray-400); font-size: 1rem;">
                                ${description}
                            </div>
                            <div style="width: 100%; height: 12px; background: rgba(0, 0, 0, 0.4); border-radius: 6px; margin-top: 1rem; overflow: hidden;">
                                <div style="height: 100%; background: linear-gradient(90deg, var(--primary-green) 0%, #88ff00 100%); width: ${(unlockedCount / totalCount * 100)}%; transition: width 0.5s ease;"></div>
                            </div>
                        </div>
                        
                        ${badgesHTML}
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('achievementsModal').remove()">
                            ${currentLocale === 'zh' ? '关闭' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('achievementsModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add share button event listeners
        document.querySelectorAll('.share-badge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const badgeId = btn.dataset.badgeId;
                this.shareBadge(badgeId);
            });
        });
        
        // Add hover effect for unlocked badges
        document.querySelectorAll('.badge-card.unlocked').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            });
        });
        
        // Close on overlay click
        document.getElementById('achievementsModal').addEventListener('click', (e) => {
            if (e.target.id === 'achievementsModal') {
                document.getElementById('achievementsModal').remove();
            }
        });
    }
    
    shareBadge(badgeId) {
        const badge = this.allBadges.find(b => b.id === badgeId);
        if (!badge) return;
        
        const currentLocale = i18n.getLocale();
        const badgeName = badge.name[currentLocale] || badge.name.en;
        const badgeDesc = badge.description[currentLocale] || badge.description.en;
        
        const shareText = currentLocale === 'zh'
            ? `我在MoodTracker Pro中解锁了成就：${badge.icon} ${badgeName} - ${badgeDesc}！`
            : `I unlocked the achievement in MoodTracker Pro: ${badge.icon} ${badgeName} - ${badgeDesc}!`;
        
        // Try to use Web Share API
        if (navigator.share) {
            navigator.share({
                title: currentLocale === 'zh' ? '成就解锁' : 'Achievement Unlocked',
                text: shareText
            }).catch(err => {
                console.log('Share cancelled:', err);
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                const msg = currentLocale === 'zh'
                    ? '已复制到剪贴板！'
                    : 'Copied to clipboard!';
                this.showToast(msg);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }

    // Update mood buttons with custom scale
    updateMoodButtons() {
        const customScale = JSON.parse(localStorage.getItem('customMoodScale') || 'null');
        if (!customScale) return;

        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach((btn, index) => {
            if (customScale[index + 1]) {
                const iconSpan = btn.querySelector('.mood-icon');
                const textSpan = btn.querySelector('.mood-text');
                
                if (iconSpan) {
                    iconSpan.textContent = customScale[index + 1].icon;
                }
                if (textSpan) {
                    textSpan.textContent = customScale[index + 1].label;
                }
                
                // Update data attributes
                btn.setAttribute('data-label', customScale[index + 1].label);
            }
        });
    }

    // Toast Notifications
    initializeCharts() {
        // Add error handling for Chart.js
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }
        this.updateWeeklyChart();
    }

    updateWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        const last7Days = this.getLast7DaysData();
        
        this.charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(d => d.label),
                datasets: [{
                    label: 'Mood Level',
                    data: last7Days.map(d => d.mood),
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#0a0a0a',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    }
                }
            }
        });
    }

    getLast7DaysData() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEntries = this.moodData.filter(entry => 
                entry.date.split('T')[0] === dateStr
            );
            
            const avgMood = dayEntries.length > 0
                ? dayEntries.reduce((sum, entry) => sum + entry.mood.value, 0) / dayEntries.length
                : 0;
            
            // Use localized day names
            const locale = typeof i18n !== 'undefined' && i18n.getLocale() === 'zh' ? 'zh-CN' : 'en-US';
            const label = date.toLocaleDateString(locale, { weekday: 'short' });
            
            days.push({
                label: label,
                mood: avgMood,
                date: dateStr
            });
        }
        
        return days;
    }

    // Analytics Charts
    updateAnalyticsCharts() {
        try {
            if (typeof Chart === 'undefined') {
                console.error('Chart.js not loaded');
                return;
            }
            this.updateMoodDistributionChart();
            this.updateMonthlyTrendChart();
            this.updateTagAnalysisChart();
            this.updateWeeklyPatternChart();
            this.updateRadarChart();
            this.updateAreaChart();
            this.updateScatterChart();
            this.setupChartExport();
        } catch (error) {
            console.error('Error updating analytics charts:', error);
        }
    }

    updateAnalytics(days) {
        setTimeout(() => this.updateAnalyticsCharts(), 100);
    }

    updateMoodDistributionChart() {
        try {
            const ctx = document.getElementById('moodDistributionChart');
            if (!ctx) {
                console.warn('moodDistributionChart canvas not found');
                return;
            }

            if (this.charts.moodDistribution) {
                this.charts.moodDistribution.destroy();
            }

            const distribution = this.getMoodDistribution();
            
            this.charts.moodDistribution = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'],
                    datasets: [{
                        data: distribution,
                        backgroundColor: [
                            '#dc3545',
                            '#fd7e14',
                            '#ffc107',
                            '#28a745',
                            '#00ff88'
                        ],
                        borderColor: '#1a1a1a',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#adb5bd',
                                padding: 20
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating mood distribution chart:', error);
        }
    }

    getMoodDistribution() {
        const distribution = [0, 0, 0, 0, 0];
        this.moodData.forEach(entry => {
            distribution[entry.mood.value - 1]++;
        });
        return distribution;
    }

    updateMonthlyTrendChart() {
        const ctx = document.getElementById('monthlyTrendChart');
        if (!ctx) return;

        if (this.charts.monthlyTrend) {
            this.charts.monthlyTrend.destroy();
        }

        const monthlyData = this.getMonthlyTrendData();
        
        this.charts.monthlyTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [{
                    label: 'Average Mood',
                    data: monthlyData.map(d => d.avgMood),
                    backgroundColor: 'rgba(0, 255, 136, 0.8)',
                    borderColor: '#00ff88',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    }
                }
            }
        });
    }

    getMonthlyTrendData() {
        const monthlyData = {};
        
        this.moodData.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    total: 0,
                    count: 0,
                    month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                };
            }
            
            monthlyData[monthKey].total += entry.mood.value;
            monthlyData[monthKey].count++;
        });
        
        return Object.values(monthlyData)
            .map(data => ({
                month: data.month,
                avgMood: data.total / data.count
            }))
            .slice(-6); // Last 6 months
    }

    updateTagAnalysisChart() {
        const ctx = document.getElementById('tagAnalysisChart');
        if (!ctx) return;

        if (this.charts.tagAnalysis) {
            this.charts.tagAnalysis.destroy();
        }

        const tagData = this.getTagAnalysisData();
        
        this.charts.tagAnalysis = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tagData.map(d => d.tag),
                datasets: [{
                    label: 'Frequency',
                    data: tagData.map(d => d.count),
                    backgroundColor: 'rgba(0, 255, 136, 0.8)',
                    borderColor: '#00ff88',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    }
                }
            }
        });
    }

    getTagAnalysisData() {
        const tagCounts = {};
        
        this.moodData.forEach(entry => {
            entry.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }

    updateWeeklyPatternChart() {
        const ctx = document.getElementById('weeklyPatternChart');
        if (!ctx) return;

        if (this.charts.weeklyPattern) {
            this.charts.weeklyPattern.destroy();
        }

        const weeklyData = this.getWeeklyPatternData();
        
        this.charts.weeklyPattern = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Average Mood',
                    data: weeklyData,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#0a0a0a',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        pointLabels: {
                            color: '#adb5bd'
                        },
                        ticks: {
                            color: '#adb5bd',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }

    getWeeklyPatternData() {
        const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
        const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
        
        this.moodData.forEach(entry => {
            const date = new Date(entry.date);
            const dayOfWeek = (date.getDay() + 6) % 7; // Convert to Mon=0, Sun=6
            
            weeklyData[dayOfWeek] += entry.mood.value;
            weeklyCounts[dayOfWeek]++;
        });
        
        return weeklyData.map((total, index) => 
            weeklyCounts[index] > 0 ? total / weeklyCounts[index] : 0
        );
    }

    // Radar Chart - Multi-dimensional mood assessment
    updateRadarChart() {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        if (this.charts.radar) {
            this.charts.radar.destroy();
        }

        const radarData = this.getRadarData();
        const currentLocale = i18n?.getLocale() || 'en';
        
        const labels = currentLocale === 'zh' 
            ? ['工作', '家庭', '社交', '健康', '睡眠', '运动']
            : ['Work', 'Family', 'Social', 'Health', 'Sleep', 'Exercise'];
        
        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: currentLocale === 'zh' ? '平均心情' : 'Average Mood',
                    data: radarData,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    borderWidth: 3,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#0a0a0a',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#adb5bd',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        titleColor: '#00ff88',
                        bodyColor: '#e0e0e0',
                        borderColor: '#00ff88',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '/5.0';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            color: '#adb5bd',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        pointLabels: {
                            color: '#00ff88',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    getRadarData() {
        const dimensions = ['work', 'family', 'social', 'health', 'sleep', 'exercise'];
        const dimData = dimensions.map(() => ({ total: 0, count: 0 }));
        
        this.moodData.forEach(entry => {
            if (entry.tags && entry.tags.length > 0) {
                entry.tags.forEach(tag => {
                    const tagLower = tag.toLowerCase();
                    const index = dimensions.findIndex(dim => tagLower.includes(dim));
                    if (index !== -1) {
                        dimData[index].total += entry.mood.value;
                        dimData[index].count++;
                    }
                });
            }
        });
        
        return dimData.map(dim => dim.count > 0 ? dim.total / dim.count : 2.5);
    }

    // Area Chart - Mood trend over time
    updateAreaChart() {
        const ctx = document.getElementById('areaChart');
        if (!ctx) return;

        if (this.charts.area) {
            this.charts.area.destroy();
        }

        const areaData = this.getAreaChartData();
        const currentLocale = i18n?.getLocale() || 'en';
        
        this.charts.area = new Chart(ctx, {
            type: 'line',
            data: {
                labels: areaData.labels,
                datasets: [{
                    label: currentLocale === 'zh' ? '心情趋势' : 'Mood Trend',
                    data: areaData.data,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.3)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#0a0a0a',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#adb5bd',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        titleColor: '#00ff88',
                        bodyColor: '#e0e0e0',
                        borderColor: '#00ff88',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 136, 0.05)'
                        },
                        ticks: {
                            color: '#adb5bd',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    getAreaChartData() {
        const days = 30;
        const labels = [];
        const data = [];
        const today = new Date();
        const currentLocale = i18n?.getLocale() || 'en';
        const locale = currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEntries = this.moodData.filter(entry => 
                entry.date.split('T')[0] === dateStr
            );
            
            const avgMood = dayEntries.length > 0
                ? dayEntries.reduce((sum, entry) => sum + entry.mood.value, 0) / dayEntries.length
                : null;
            
            const label = date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
            labels.push(label);
            data.push(avgMood);
        }
        
        return { labels, data };
    }

    // Setup chart export functionality
    setupChartExport() {
        document.querySelectorAll('.chart-export-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        document.querySelectorAll('.chart-export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartName = btn.dataset.chart;
                this.exportChartAsImage(chartName);
            });
        });
    }

    async exportChartAsImage(chartName) {
        if (typeof html2canvas === 'undefined') {
            const currentLocale = i18n?.getLocale() || 'en';
            const msg = currentLocale === 'zh' ? '图片导出库未加载' : 'Image export library not loaded';
            this.showToast(msg);
            return;
        }
        
        const chartMap = {
            'moodDistribution': 'moodDistributionChart',
            'monthlyTrend': 'monthlyTrendChart',
            'radarChart': 'radarChart',
            'tagAnalysis': 'tagAnalysisChart',
            'weeklyPattern': 'weeklyPatternChart',
            'areaChart': 'areaChart',
            'scatterChart': 'scatterChart'
        };
        
        const canvasId = chartMap[chartName];
        if (!canvasId) return;
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const chartPanel = canvas.closest('.chart-panel');
        if (!chartPanel) return;
        
        const currentLocale = i18n?.getLocale() || 'en';
        const msg = currentLocale === 'zh' ? '正在生成图表...' : 'Generating chart...';
        this.showToast(msg);
        
        try {
            const chartCanvas = await html2canvas(chartPanel, {
                backgroundColor: '#0a0a0a',
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            chartCanvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${chartName}-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                const successMsg = currentLocale === 'zh' ? '图表导出成功！' : 'Chart exported successfully!';
                this.showToast(successMsg);
            });
        } catch (error) {
            console.error('Error exporting chart:', error);
            const errorMsg = currentLocale === 'zh' ? '导出失败' : 'Export failed';
            this.showToast(errorMsg);
        }
    }

    // Scatter Chart - Tag and Mood correlation
    updateScatterChart() {
        const ctx = document.getElementById('scatterChart');
        if (!ctx) return;

        if (this.charts.scatter) {
            this.charts.scatter.destroy();
        }

        const scatterData = this.getScatterData();
        const currentLocale = i18n?.getLocale() || 'en';
        
        this.charts.scatter = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: scatterData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: '#adb5bd',
                            font: {
                                size: 11
                            },
                            usePointStyle: true,
                            padding: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        titleColor: '#00ff88',
                        bodyColor: '#e0e0e0',
                        borderColor: '#00ff88',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const x = context.parsed.x;
                                const y = context.parsed.y.toFixed(1);
                                return `${label}: Entry #${x}, Mood ${y}/5.0`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        title: {
                            display: true,
                            text: currentLocale === 'zh' ? '心情值' : 'Mood Value',
                            color: '#00ff88',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 255, 136, 0.1)'
                        },
                        ticks: {
                            color: '#adb5bd',
                            stepSize: 1
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: currentLocale === 'zh' ? '记录编号' : 'Entry Number',
                            color: '#00ff88',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 255, 136, 0.05)'
                        },
                        ticks: {
                            color: '#adb5bd'
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const datasetIndex = elements[0].datasetIndex;
                        const index = elements[0].index;
                        const tag = scatterData.datasets[datasetIndex].label;
                        const entryData = scatterData.datasets[datasetIndex].data[index];
                        this.showScatterPointDetails(tag, entryData, scatterData.entriesMap[tag][index]);
                    }
                }
            }
        });
    }

    getScatterData() {
        const tagColors = {
            'work': '#dc3545',
            'family': '#28a745',
            'social': '#ffc107',
            'health': '#17a2b8',
            'sleep': '#6f42c1',
            'exercise': '#00ff88',
            'stress': '#fd7e14',
            'achievement': '#20c997',
            'default': '#adb5bd'
        };

        const tagData = {};
        const entriesMap = {};
        
        this.moodData.forEach((entry, index) => {
            if (entry.tags && entry.tags.length > 0) {
                entry.tags.forEach(tag => {
                    const tagLower = tag.toLowerCase();
                    if (!tagData[tagLower]) {
                        tagData[tagLower] = [];
                        entriesMap[tagLower] = [];
                    }
                    tagData[tagLower].push({
                        x: index + 1,
                        y: entry.mood.value
                    });
                    entriesMap[tagLower].push(entry);
                });
            }
        });

        const datasets = Object.keys(tagData).slice(0, 8).map(tag => ({
            label: tag.charAt(0).toUpperCase() + tag.slice(1),
            data: tagData[tag],
            backgroundColor: tagColors[tag] || tagColors.default,
            borderColor: tagColors[tag] || tagColors.default,
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7
        }));

        return { datasets, entriesMap };
    }

    showScatterPointDetails(tag, point, entry) {
        const currentLocale = i18n?.getLocale() || 'en';
        const date = new Date(entry.date);
        const locale = currentLocale === 'zh' ? 'zh-CN' : 'en-US';
        const formattedDate = date.toLocaleString(locale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const title = currentLocale === 'zh' ? '记录详情' : 'Entry Details';
        const moodLabel = currentLocale === 'zh' ? '心情' : 'Mood';
        const tagLabel = currentLocale === 'zh' ? '标签' : 'Tag';
        const noteLabel = currentLocale === 'zh' ? '笔记' : 'Note';
        
        let content = `<div class="scatter-detail">`;
        content += `<h4>${title}</h4>`;
        content += `<p><strong>${currentLocale === 'zh' ? '日期' : 'Date'}:</strong> ${formattedDate}</p>`;
        content += `<p><strong>${moodLabel}:</strong> ${entry.mood.label} (${entry.mood.value}/5)</p>`;
        content += `<p><strong>${tagLabel}:</strong> ${tag}</p>`;
        if (entry.note) {
            content += `<p><strong>${noteLabel}:</strong> ${entry.note}</p>`;
        }
        if (entry.tags && entry.tags.length > 1) {
            const otherTags = entry.tags.filter(t => t.toLowerCase() !== tag.toLowerCase());
            if (otherTags.length > 0) {
                content += `<p><strong>${currentLocale === 'zh' ? '其他标签' : 'Other Tags'}:</strong> ${otherTags.join(', ')}</p>`;
            }
        }
        content += `</div>`;

        this.showChartDetailModal(content);
    }

    showChartDetailModal(content) {
        let modal = document.getElementById('chartDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'chartDetailModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Details</h2>
                        <button class="modal-close" onclick="document.getElementById('chartDetailModal').style.display='none'">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="chartDetailContent"></div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('chartDetailModal').style.display='none'">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        document.getElementById('chartDetailContent').innerHTML = content;
        modal.style.display = 'flex';
    }

    // AI Insights Generation
    generateInsights() {
        this.generatePatternInsights();
        this.generateRecommendations();
        this.generateAchievements();
        this.generateDailyTips();
        
        // Initialize advanced analytics
        this.renderTagCorrelation();
        this.renderAnomalies();
    }

    generatePatternInsights() {
        const container = document.getElementById('patternInsights');
        
        if (this.moodData.length < 7) {
            container.innerHTML = 'Keep tracking for at least a week to see meaningful patterns.';
            return;
        }

        const insights = [];
        
        // Mood trend analysis
        const trend = this.calculateMoodTrend();
        if (trend === 'Improving') {
            insights.push('📈 Your mood has been trending upward over the past week. Keep up the great work!');
        } else if (trend === 'Declining') {
            insights.push('📉 Your mood has been declining recently. Consider what factors might be contributing to this.');
        }

        // Best day analysis
        const weeklyPattern = this.getWeeklyPatternData();
        const bestDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][
            weeklyPattern.indexOf(Math.max(...weeklyPattern))
        ];
        insights.push(`🌟 ${bestDay} tends to be your best day of the week.`);

        // Tag correlation
        const tagMoodCorrelation = this.getTagMoodCorrelation();
        if (tagMoodCorrelation.positive.length > 0) {
            insights.push(`✨ Activities like "${tagMoodCorrelation.positive[0]}" tend to boost your mood.`);
        }

        container.innerHTML = insights.join('<br><br>');
    }

    getTagMoodCorrelation() {
        const tagMoods = {};
        
        this.moodData.forEach(entry => {
            entry.tags.forEach(tag => {
                if (!tagMoods[tag]) {
                    tagMoods[tag] = [];
                }
                tagMoods[tag].push(entry.mood.value);
            });
        });

        const correlations = Object.entries(tagMoods)
            .map(([tag, moods]) => ({
                tag,
                avgMood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length
            }))
            .sort((a, b) => b.avgMood - a.avgMood);

        return {
            positive: correlations.slice(0, 3).map(c => c.tag),
            negative: correlations.slice(-3).map(c => c.tag)
        };
    }
    
    // ==================== ADVANCED ANALYTICS ====================
    
    getDetailedTagAnalysis() {
        const tagStats = {};
        
        this.moodData.forEach(entry => {
            entry.tags.forEach(tag => {
                if (!tagStats[tag]) {
                    tagStats[tag] = {
                        tag: tag,
                        count: 0,
                        moods: [],
                        avgMood: 0,
                        minMood: 5,
                        maxMood: 1,
                        dates: []
                    };
                }
                
                tagStats[tag].count++;
                tagStats[tag].moods.push(entry.mood.value);
                tagStats[tag].dates.push(new Date(entry.date));
                tagStats[tag].minMood = Math.min(tagStats[tag].minMood, entry.mood.value);
                tagStats[tag].maxMood = Math.max(tagStats[tag].maxMood, entry.mood.value);
            });
        });
        
        // Calculate statistics
        Object.values(tagStats).forEach(stat => {
            stat.avgMood = stat.moods.reduce((sum, m) => sum + m, 0) / stat.moods.length;
            
            // Calculate standard deviation
            const variance = stat.moods.reduce((sum, m) => sum + Math.pow(m - stat.avgMood, 2), 0) / stat.moods.length;
            stat.stdDev = Math.sqrt(variance);
            
            // Calculate frequency (entries per week)
            const daySpan = (Math.max(...stat.dates) - Math.min(...stat.dates)) / (1000 * 60 * 60 * 24);
            stat.frequency = daySpan > 0 ? (stat.count / daySpan) * 7 : stat.count;
            
            // Impact score (weighted by frequency and mood effect)
            stat.impactScore = (stat.avgMood - 3) * Math.log(stat.count + 1);
        });
        
        return Object.values(tagStats).sort((a, b) => b.impactScore - a.impactScore);
    }
    
    detectMoodAnomalies() {
        if (this.moodData.length < 7) return [];
        
        const anomalies = [];
        const recentData = this.moodData.slice(-30); // Last 30 entries
        
        // Calculate baseline statistics
        const moods = recentData.map(e => e.mood.value);
        const avgMood = moods.reduce((sum, m) => sum + m, 0) / moods.length;
        const variance = moods.reduce((sum, m) => sum + Math.pow(m - avgMood, 2), 0) / moods.length;
        const stdDev = Math.sqrt(variance);
        
        // Detect sudden drops (more than 1.5 std dev below average)
        recentData.forEach((entry, index) => {
            const deviation = entry.mood.value - avgMood;
            
            if (Math.abs(deviation) > 1.5 * stdDev) {
                anomalies.push({
                    date: entry.date,
                    mood: entry.mood,
                    deviation: deviation,
                    severity: Math.abs(deviation) > 2 * stdDev ? 'high' : 'medium',
                    type: deviation < 0 ? 'drop' : 'spike',
                    note: entry.note
                });
            }
        });
        
        // Detect sustained low mood (3+ consecutive days below average)
        let lowStreak = 0;
        recentData.forEach((entry, index) => {
            if (entry.mood.value < avgMood - 0.5) {
                lowStreak++;
                if (lowStreak >= 3) {
                    anomalies.push({
                        date: entry.date,
                        mood: entry.mood,
                        type: 'sustained_low',
                        severity: 'high',
                        streak: lowStreak
                    });
                }
            } else {
                lowStreak = 0;
            }
        });
        
        return anomalies;
    }
    
    compareTimePeriods(period1Start, period1End, period2Start, period2End) {
        const period1Data = this.moodData.filter(e => {
            const date = new Date(e.date);
            return date >= period1Start && date <= period1End;
        });
        
        const period2Data = this.moodData.filter(e => {
            const date = new Date(e.date);
            return date >= period2Start && date <= period2End;
        });
        
        const calculateStats = (data) => {
            if (data.length === 0) return null;
            
            const moods = data.map(e => e.mood.value);
            const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
            const max = Math.max(...moods);
            const min = Math.min(...moods);
            const variance = moods.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) / moods.length;
            
            // Tag distribution
            const tagCounts = {};
            data.forEach(e => {
                e.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
            
            return {
                count: data.length,
                avgMood: avg,
                maxMood: max,
                minMood: min,
                stdDev: Math.sqrt(variance),
                topTags: Object.entries(tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([tag, count]) => ({ tag, count }))
            };
        };
        
        const p1Stats = calculateStats(period1Data);
        const p2Stats = calculateStats(period2Data);
        
        if (!p1Stats || !p2Stats) return null;
        
        return {
            period1: p1Stats,
            period2: p2Stats,
            comparison: {
                moodChange: p2Stats.avgMood - p1Stats.avgMood,
                moodChangePercent: ((p2Stats.avgMood - p1Stats.avgMood) / p1Stats.avgMood) * 100,
                entriesChange: p2Stats.count - p1Stats.count,
                stabilityChange: p1Stats.stdDev - p2Stats.stdDev // Positive = more stable in period 2
            }
        };
    }
    
    predictMoodTrend(daysAhead = 7) {
        if (this.moodData.length < 14) return null;
        
        // Use simple moving average for prediction
        const recentMoods = this.moodData.slice(-14).map(e => e.mood.value);
        
        // Calculate 7-day moving average
        const movingAvg = recentMoods.slice(-7).reduce((sum, m) => sum + m, 0) / 7;
        
        // Calculate trend (linear regression slope)
        const n = recentMoods.length;
        const xMean = (n - 1) / 2;
        const yMean = recentMoods.reduce((sum, m) => sum + m, 0) / n;
        
        let numerator = 0;
        let denominator = 0;
        
        recentMoods.forEach((mood, i) => {
            numerator += (i - xMean) * (mood - yMean);
            denominator += Math.pow(i - xMean, 2);
        });
        
        const slope = numerator / denominator;
        const intercept = yMean - slope * xMean;
        
        // Predict future values
        const predictions = [];
        for (let i = 1; i <= daysAhead; i++) {
            const predictedValue = intercept + slope * (n + i - 1);
            // Clamp between 1 and 5
            const clampedValue = Math.max(1, Math.min(5, predictedValue));
            
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + i);
            
            predictions.push({
                date: futureDate.toISOString().split('T')[0],
                predictedMood: clampedValue,
                confidence: Math.max(0.3, 1 - (i * 0.1)) // Confidence decreases with distance
            });
        }
        
        return {
            predictions,
            currentTrend: slope > 0.05 ? 'improving' : slope < -0.05 ? 'declining' : 'stable',
            trendStrength: Math.abs(slope)
        };
    }
    
    switchAnalyticsTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.analytics-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const contentMap = {
            'correlation': 'correlationTab',
            'anomalies': 'anomaliesTab',
            'comparison': 'comparisonTab',
            'prediction': 'predictionTab'
        };
        
        const contentId = contentMap[tabName];
        if (contentId) {
            document.getElementById(contentId).classList.add('active');
            
            // Load content for the selected tab
            if (tabName === 'correlation') {
                this.renderTagCorrelation();
            } else if (tabName === 'anomalies') {
                this.renderAnomalies();
            } else if (tabName === 'prediction') {
                this.renderPrediction();
            }
        }
    }
    
    renderTagCorrelation() {
        const container = document.getElementById('tagCorrelationChart');
        if (!container) return;
        
        const tagAnalysis = this.getDetailedTagAnalysis();
        
        if (tagAnalysis.length === 0) {
            container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Not enough data. Start tracking with tags to see correlations.</p>';
            return;
        }
        
        container.innerHTML = tagAnalysis.slice(0, 10).map(stat => {
            const moodPercent = ((stat.avgMood - 1) / 4) * 100;
            const impactIcon = stat.impactScore > 0 ? '📈' : stat.impactScore < 0 ? '📉' : '➖';
            
            return `
                <div class="correlation-item">
                    <div class="correlation-tag">
                        <span style="font-size: 1.5rem;">${impactIcon}</span>
                        <span class="tag-name">#${stat.tag}</span>
                    </div>
                    <div class="correlation-stats">
                        <div class="stat-item">
                            <span class="stat-label">Avg Mood</span>
                            <span class="stat-value">${stat.avgMood.toFixed(2)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Entries</span>
                            <span class="stat-value">${stat.count}</span>
                        </div>
                        <div class="mood-bar">
                            <div class="mood-bar-fill" style="width: ${moodPercent}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderAnomalies() {
        const container = document.getElementById('anomaliesContainer');
        if (!container) return;
        
        const anomalies = this.detectMoodAnomalies();
        
        if (anomalies.length === 0) {
            container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">✅ No unusual patterns detected. Your mood has been stable.</p>';
            return;
        }
        
        container.innerHTML = anomalies.map(anomaly => {
            const date = new Date(anomaly.date).toLocaleDateString();
            const iconMap = {
                'drop': '⚠️',
                'spike': '⚡',
                'sustained_low': '🔴'
            };
            
            const descriptionMap = {
                'drop': `Sudden mood drop detected (${anomaly.deviation.toFixed(1)} points below average)`,
                'spike': `Unusual mood spike detected (${anomaly.deviation.toFixed(1)} points above average)`,
                'sustained_low': `Extended low mood period (${anomaly.streak} days)`
            };
            
            return `
                <div class="anomaly-item severity-${anomaly.severity}">
                    <div class="anomaly-icon">${iconMap[anomaly.type]}</div>
                    <div class="anomaly-content">
                        <div class="anomaly-date">${date}</div>
                        <div class="anomaly-description">${descriptionMap[anomaly.type]}</div>
                        ${anomaly.note ? `<div style="font-size: 0.85rem; color: var(--gray-400); font-style: italic;">"${anomaly.note.substring(0, 100)}..."</div>` : ''}
                        <span class="anomaly-badge">${anomaly.severity.toUpperCase()} ALERT</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    runPeriodComparison() {
        const comparisonType = document.getElementById('comparisonType').value;
        const container = document.getElementById('comparisonResults');
        
        if (!container) return;
        
        let period1Start, period1End, period2Start, period2End;
        const now = new Date();
        
        if (comparisonType === 'week') {
            // This week vs last week
            period2End = new Date(now);
            period2Start = new Date(now);
            period2Start.setDate(now.getDate() - 7);
            
            period1End = new Date(period2Start);
            period1Start = new Date(period1End);
            period1Start.setDate(period1End.getDate() - 7);
        } else if (comparisonType === 'month') {
            // This month vs last month
            period2End = new Date(now);
            period2Start = new Date(now.getFullYear(), now.getMonth(), 1);
            
            period1End = new Date(period2Start);
            period1End.setDate(period1End.getDate() - 1);
            period1Start = new Date(period1End.getFullYear(), period1End.getMonth(), 1);
        }
        
        const comparison = this.compareTimePeriods(period1Start, period1End, period2Start, period2End);
        
        if (!comparison) {
            container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Not enough data for comparison.</p>';
            return;
        }
        
        const changeIcon = comparison.comparison.moodChange > 0 ? '📈' : comparison.comparison.moodChange < 0 ? '📉' : '➖';
        const changeClass = comparison.comparison.moodChange > 0 ? 'positive' : comparison.comparison.moodChange < 0 ? 'negative' : '';
        
        container.innerHTML = `
            <div class="period-card">
                <h4>Period 1 (Earlier)</h4>
                <div class="period-stats">
                    <div class="period-stat">
                        <span>Entries</span>
                        <span style="font-weight: 600;">${comparison.period1.count}</span>
                    </div>
                    <div class="period-stat">
                        <span>Average Mood</span>
                        <span style="font-weight: 600; color: var(--primary-green);">${comparison.period1.avgMood.toFixed(2)}</span>
                    </div>
                    <div class="period-stat">
                        <span>Mood Range</span>
                        <span style="font-weight: 600;">${comparison.period1.minMood} - ${comparison.period1.maxMood}</span>
                    </div>
                    <div class="period-stat">
                        <span>Top Tags</span>
                        <span style="font-size: 0.85rem;">${comparison.period1.topTags.map(t => `#${t.tag}`).join(', ')}</span>
                    </div>
                </div>
            </div>
            
            <div class="period-card">
                <h4>Period 2 (Recent)</h4>
                <div class="period-stats">
                    <div class="period-stat">
                        <span>Entries</span>
                        <span style="font-weight: 600;">${comparison.period2.count}</span>
                    </div>
                    <div class="period-stat">
                        <span>Average Mood</span>
                        <span style="font-weight: 600; color: var(--primary-green);">${comparison.period2.avgMood.toFixed(2)}</span>
                    </div>
                    <div class="period-stat">
                        <span>Mood Range</span>
                        <span style="font-weight: 600;">${comparison.period2.minMood} - ${comparison.period2.maxMood}</span>
                    </div>
                    <div class="period-stat">
                        <span>Top Tags</span>
                        <span style="font-size: 0.85rem;">${comparison.period2.topTags.map(t => `#${t.tag}`).join(', ')}</span>
                    </div>
                </div>
            </div>
            
            <div class="comparison-summary">
                <h4>Comparison Summary</h4>
                <div class="comparison-change ${changeClass}">
                    ${changeIcon} ${comparison.comparison.moodChange > 0 ? '+' : ''}${comparison.comparison.moodChange.toFixed(2)} points
                </div>
                <p style="color: var(--gray-300); font-size: 1.1rem;">
                    ${comparison.comparison.moodChange > 0 
                        ? `Your mood improved by ${comparison.comparison.moodChangePercent.toFixed(1)}%!` 
                        : comparison.comparison.moodChange < 0
                        ? `Your mood decreased by ${Math.abs(comparison.comparison.moodChangePercent).toFixed(1)}%`
                        : 'Your mood remained stable'}
                </p>
                <p style="color: var(--gray-400); margin-top: 1rem;">
                    ${comparison.comparison.stabilityChange > 0
                        ? '✅ Your mood has become more stable'
                        : comparison.comparison.stabilityChange < 0
                        ? '⚠️ Your mood has become more variable'
                        : '➖ Mood stability unchanged'}
                </p>
            </div>
        `;
    }
    
    renderPrediction() {
        const container = document.getElementById('predictionChart');
        if (!container) return;
        
        const prediction = this.predictMoodTrend(7);
        
        if (!prediction) {
            container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Need at least 14 days of data for predictions.</p>';
            return;
        }
        
        const trendIcon = prediction.currentTrend === 'improving' ? '📈' : prediction.currentTrend === 'declining' ? '📉' : '➖';
        const trendText = prediction.currentTrend === 'improving' ? 'Improving trend' : prediction.currentTrend === 'declining' ? 'Declining trend' : 'Stable trend';
        
        container.innerHTML = `
            <div style="text-align: center; padding: 1rem; margin-bottom: 1.5rem; background: rgba(0, 255, 136, 0.05); border-radius: var(--radius-md);">
                <span style="font-size: 1.5rem; margin-right: 0.5rem;">${trendIcon}</span>
                <span style="font-size: 1.1rem; color: var(--primary-green); font-weight: 600;">${trendText}</span>
            </div>
            ${prediction.predictions.map(pred => {
                const date = new Date(pred.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const moodPercent = ((pred.predictedMood - 1) / 4) * 100;
                const confidencePercent = (pred.confidence * 100).toFixed(0);
                
                return `
                    <div class="prediction-item">
                        <div class="prediction-date">${date}</div>
                        <div class="prediction-bar-container">
                            <div class="prediction-bar-fill" style="width: ${moodPercent}%"></div>
                        </div>
                        <div class="prediction-value">
                            ${pred.predictedMood.toFixed(1)}
                            <span class="confidence-indicator">${confidencePercent}%</span>
                        </div>
                    </div>
                `;
            }).join('')}
            <p style="color: var(--gray-500); font-size: 0.85rem; margin-top: 1.5rem; text-align: center;">
                <i class="fas fa-info-circle"></i> Predictions based on recent 14-day trend analysis. Confidence decreases for later dates.
            </p>
        `;
    }
    
    // ==================== END ADVANCED ANALYTICS ====================
    
    // ==================== ACCESSIBILITY FUNCTIONS ====================
    
    announceToScreenReader(message) {
        // Create or get the live region
        let liveRegion = document.getElementById('sr-live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'sr-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        // Clear and set new message
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
    
    updateNavigationAria(activeSection) {
        // Update desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.section === activeSection) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        
        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(btn => {
            if (btn.dataset.section === activeSection) {
                btn.setAttribute('aria-current', 'page');
            } else {
                btn.removeAttribute('aria-current');
            }
        });
    }
    
    handleMoodKeyboardNavigation(e, currentBtn) {
        const moodButtons = Array.from(document.querySelectorAll('.mood-btn'));
        const currentIndex = moodButtons.indexOf(currentBtn);
        let targetIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = (currentIndex + 1) % moodButtons.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = (currentIndex - 1 + moodButtons.length) % moodButtons.length;
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = moodButtons.length - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectMood(currentBtn);
                return;
            default:
                return;
        }
        
        // Move focus to target button
        if (targetIndex !== currentIndex) {
            moodButtons[targetIndex].focus();
            moodButtons[targetIndex].setAttribute('tabindex', '0');
            currentBtn.setAttribute('tabindex', '-1');
        }
    }
    
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                // Close modal/dropdown if applicable
                const closeBtn = element.querySelector('.close-btn, .modal-close');
                if (closeBtn) closeBtn.click();
            }
        });
    }
    
    // ==================== END ACCESSIBILITY ====================

    generateRecommendations() {
        const container = document.getElementById('recommendations');
        const recommendations = [];

        if (this.moodData.length === 0) {
            container.innerHTML = 'Start tracking your mood to receive personalized recommendations.';
            return;
        }

        const avgMood = this.moodData.reduce((sum, entry) => sum + entry.mood.value, 0) / this.moodData.length;
        const recentAvg = this.moodData.slice(-7).reduce((sum, entry) => sum + entry.mood.value, 0) / Math.min(7, this.moodData.length);

        if (avgMood < 3) {
            recommendations.push('🧘 Consider incorporating mindfulness or meditation into your daily routine.');
            recommendations.push('🏃 Regular exercise can significantly improve mood and mental health.');
            recommendations.push('👥 Reach out to friends or family for social support.');
        } else if (avgMood >= 4) {
            recommendations.push('🎯 You\'re doing great! Consider what\'s working well and maintain those habits.');
            recommendations.push('📝 Share your positive strategies with others who might benefit.');
        }

        if (recentAvg < avgMood - 0.5) {
            recommendations.push('🔍 Reflect on recent changes in your routine or environment.');
            recommendations.push('💤 Ensure you\'re getting adequate sleep and rest.');
        }

        const streak = this.calculateStreak();
        if (streak >= 7) {
            recommendations.push('🔥 Excellent consistency! Your tracking habit is well-established.');
        } else if (streak < 3) {
            recommendations.push('📅 Try to track your mood daily for better insights.');
        }

        container.innerHTML = recommendations.join('<br><br>');
    }

    generateAchievements() {
        const container = document.getElementById('achievements');
        const achievements = [];

        const totalEntries = this.moodData.length;
        const streak = this.calculateStreak();
        const avgMood = totalEntries > 0 ? this.moodData.reduce((sum, entry) => sum + entry.mood.value, 0) / totalEntries : 0;

        if (totalEntries >= 1) achievements.push('🎯 First Entry - You\'ve started your mood tracking journey!');
        if (totalEntries >= 7) achievements.push('📅 Week Warrior - 7 days of mood tracking completed!');
        if (totalEntries >= 30) achievements.push('📊 Monthly Master - 30 days of consistent tracking!');
        if (totalEntries >= 100) achievements.push('💯 Century Club - 100 mood entries recorded!');

        if (streak >= 3) achievements.push('🔥 3-Day Streak - Building a healthy habit!');
        if (streak >= 7) achievements.push('⭐ Week Streak - One week of consistent tracking!');
        if (streak >= 30) achievements.push('🏆 Monthly Streak - 30 days in a row!');

        if (avgMood >= 4) achievements.push('😊 Positive Vibes - Your average mood is excellent!');
        if (avgMood >= 4.5) achievements.push('🌟 Mood Master - Consistently high mood levels!');

        const hasAllTags = ['work', 'family', 'health', 'social'].every(tag => 
            this.moodData.some(entry => entry.tags.includes(tag))
        );
        if (hasAllTags) achievements.push('🏷️ Tag Explorer - You\'ve used multiple mood tags!');

        if (achievements.length === 0) {
            achievements.push('🌱 Keep tracking to unlock achievements!');
        }

        container.innerHTML = achievements.join('<br><br>');
    }

    generateDailyTips() {
        const container = document.getElementById('dailyTips');
        if (!container) return;

        // Use the external wellness tips database
        if (typeof WELLNESS_TIPS === 'undefined') {
            container.innerHTML = `
                <div class="tip-item">
                    <div class="tip-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="tip-content">
                        <div class="tip-category">Loading</div>
                        <div class="tip-text">Wellness tips are loading...</div>
                    </div>
                </div>
            `;
            return;
        }

        // Use date-based selection for true daily variation
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const dailyTip = WELLNESS_TIPS[dayOfYear % WELLNESS_TIPS.length];
        
        container.innerHTML = `
            <div class="tip-item">
                <div class="tip-icon">
                    <i class="${dailyTip.icon}"></i>
                </div>
                <div class="tip-content">
                    <div class="tip-category">${dailyTip.category}</div>
                    <div class="tip-text">${dailyTip.content}</div>
                </div>
            </div>
        `;
    }

    // ==================== HEATMAP CALENDAR METHODS ====================
    
    initializeHeatmap() {
        this.heatmapYear = new Date().getFullYear();
        this.updateHeatmapYear();
        this.renderHeatmap();
    }

    updateHeatmapYear() {
        const yearSpan = document.getElementById('heatmapYear');
        if (yearSpan) {
            yearSpan.textContent = this.heatmapYear;
        }
    }

    renderHeatmap() {
        const container = document.getElementById('heatmapCalendar');
        if (!container) return;

        container.innerHTML = '';

        // Create month containers
        const months = [];
        for (let month = 0; month < 12; month++) {
            const monthData = this.getMonthHeatmapData(this.heatmapYear, month);
            months.push(this.createMonthHeatmap(monthData, month));
        }

        // Create grid layout
        const grid = document.createElement('div');
        grid.className = 'heatmap-grid';
        months.forEach(monthEl => grid.appendChild(monthEl));
        container.appendChild(grid);

        // Create tooltip
        this.createHeatmapTooltip();
    }

    getMonthHeatmapData(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' });

        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push({ empty: true });
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEntries = this.moodData.filter(entry => 
                entry.date.split('T')[0] === dateStr
            );

            const avgMood = dayEntries.length > 0
                ? dayEntries.reduce((sum, entry) => sum + entry.mood.value, 0) / dayEntries.length
                : null;

            days.push({
                day,
                date: dateStr,
                mood: avgMood,
                count: dayEntries.length,
                entries: dayEntries
            });
        }

        return { monthName, days };
    }

    createMonthHeatmap(monthData, monthIndex) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'heatmap-month';

        // Month label
        const monthLabel = document.createElement('div');
        monthLabel.className = 'heatmap-month-label';
        monthLabel.textContent = monthData.monthName;
        monthContainer.appendChild(monthLabel);

        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'heatmap-days-grid';

        monthData.days.forEach(dayData => {
            const dayCell = document.createElement('div');
            
            if (dayData.empty) {
                dayCell.className = 'heatmap-day empty';
            } else {
                dayCell.className = 'heatmap-day';
                dayCell.dataset.date = dayData.date;
                dayCell.dataset.day = dayData.day;
                
                if (dayData.mood !== null) {
                    const level = this.getMoodLevel(dayData.mood);
                    dayCell.classList.add(`level-${level}`);
                    dayCell.dataset.mood = dayData.mood.toFixed(1);
                    dayCell.dataset.count = dayData.count;
                } else {
                    dayCell.classList.add('no-data');
                }

                // Add hover effect
                dayCell.addEventListener('mouseenter', (e) => this.showHeatmapTooltip(e, dayData));
                dayCell.addEventListener('mouseleave', () => this.hideHeatmapTooltip());
                
                // Click to view entries
                if (dayData.count > 0) {
                    dayCell.style.cursor = 'pointer';
                    dayCell.addEventListener('click', () => this.showDayEntries(dayData));
                }
            }

            daysGrid.appendChild(dayCell);
        });

        monthContainer.appendChild(daysGrid);
        return monthContainer;
    }

    getMoodLevel(mood) {
        if (mood === null) return 0;
        if (mood <= 1) return 1;
        if (mood <= 2) return 2;
        if (mood <= 3) return 3;
        if (mood <= 4) return 4;
        return 5;
    }

    createHeatmapTooltip() {
        let tooltip = document.getElementById('heatmapTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'heatmapTooltip';
            tooltip.className = 'heatmap-tooltip';
            document.body.appendChild(tooltip);
        }
    }

    showHeatmapTooltip(e, dayData) {
        const tooltip = document.getElementById('heatmapTooltip');
        if (!tooltip) return;

        const date = new Date(dayData.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let content = `<strong>${formattedDate}</strong><br>`;
        
        if (dayData.mood !== null) {
            const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
            const moodIndex = Math.min(Math.floor(dayData.mood) - 1, 4);
            const emoji = moodEmojis[moodIndex] || '😐';
            
            content += `${emoji} Mood: ${dayData.mood.toFixed(1)}/5.0<br>`;
            content += `📊 ${dayData.count} ${dayData.count === 1 ? 'entry' : 'entries'}`;
            
            if (dayData.entries.length > 0 && dayData.entries[0].tags.length > 0) {
                const uniqueTags = [...new Set(dayData.entries.flatMap(e => e.tags))];
                content += `<br>🏷️ ${uniqueTags.join(', ')}`;
            }
        } else {
            content += 'No mood data';
        }

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';

        // Position tooltip
        const rect = e.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Keep tooltip on screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    hideHeatmapTooltip() {
        const tooltip = document.getElementById('heatmapTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    showDayEntries(dayData) {
        const date = new Date(dayData.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let content = `<h3>${formattedDate}</h3>`;
        content += `<div class="day-entries-list">`;

        dayData.entries.forEach(entry => {
            const time = new Date(entry.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
            const emoji = moodEmojis[entry.mood.value - 1];

            content += `
                <div class="day-entry-item">
                    <div class="entry-time">${time}</div>
                    <div class="entry-mood-info">
                        <span class="entry-emoji">${emoji}</span>
                        <span class="entry-mood-label">${entry.mood.label}</span>
                    </div>
                    ${entry.note ? `<div class="entry-note-preview">${entry.note}</div>` : ''}
                    ${entry.tags.length > 0 ? `<div class="entry-tags">${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>` : ''}
                </div>
            `;
        });

        content += `</div>`;

        // Create modal for day entries
        this.showDayEntriesModal(content);
    }

    showDayEntriesModal(content) {
        let modal = document.getElementById('dayEntriesModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dayEntriesModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content day-entries-modal">
                    <div class="modal-header">
                        <h2>Day Details</h2>
                        <button class="modal-close" onclick="document.getElementById('dayEntriesModal').style.display='none'">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="dayEntriesContent"></div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('dayEntriesModal').style.display='none'">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        document.getElementById('dayEntriesContent').innerHTML = content;
        modal.style.display = 'flex';
    }

    async exportHeatmapAsImage() {
        if (typeof html2canvas === 'undefined') {
            const currentLocale = i18n?.getLocale() || 'en';
            const msg = currentLocale === 'zh' ? '图片导出库未加载' : 'Image export library not loaded';
            this.showToast(msg);
            return;
        }
        
        const heatmapSection = document.querySelector('.heatmap-section');
        if (!heatmapSection) return;
        
        const currentLocale = i18n?.getLocale() || 'en';
        const msg = currentLocale === 'zh' ? '正在生成热力图...' : 'Generating heatmap...';
        this.showToast(msg);
        
        // Clone the section for export
        const clone = heatmapSection.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = heatmapSection.offsetWidth + 'px';
        clone.style.background = 'linear-gradient(135deg, #0a0a0a, #141414)';
        
        // Remove export button from clone
        const exportBtn = clone.querySelector('#exportHeatmapBtn');
        if (exportBtn) exportBtn.remove();
        
        // Hide tooltips
        const tooltip = document.getElementById('heatmapTooltip');
        const originalDisplay = tooltip ? tooltip.style.display : 'none';
        if (tooltip) tooltip.style.display = 'none';
        
        document.body.appendChild(clone);
        
        try {
            const canvas = await html2canvas(clone, {
                backgroundColor: '#0a0a0a',
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `mood-heatmap-${this.heatmapYear}-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                const successMsg = currentLocale === 'zh' ? '热力图导出成功！' : 'Heatmap exported successfully!';
                this.showToast(successMsg);
            });
        } catch (error) {
            console.error('Error exporting heatmap:', error);
            const errorMsg = currentLocale === 'zh' ? '导出失败：' + error.message : 'Export failed: ' + error.message;
            this.showToast(errorMsg);
        } finally {
            document.body.removeChild(clone);
            if (tooltip) tooltip.style.display = originalDisplay;
        }
    }

    // ==================== END HEATMAP METHODS ====================

    // ==================== SEARCH AND FILTER METHODS ====================
    
    performSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        if (!this.searchQuery) {
            this.clearSearch();
            return;
        }
        
        // Add to search history
        this.addToSearchHistory(query);
        
        // Perform search across all mood data
        this.filteredResults = this.moodData.filter(entry => {
            // Search in note
            const noteMatch = entry.note && entry.note.toLowerCase().includes(this.searchQuery);
            
            // Search in tags
            const tagMatch = entry.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            
            // Search in mood label
            const moodMatch = entry.mood.label.toLowerCase().includes(this.searchQuery);
            
            // Search in date
            const dateStr = new Date(entry.date).toLocaleDateString('en-US');
            const dateMatch = dateStr.includes(this.searchQuery);
            
            return noteMatch || tagMatch || moodMatch || dateMatch;
        });
        
        // Apply any active filters
        this.filteredResults = this.applyActiveFilters(this.filteredResults);
        
        // Update UI
        this.displaySearchResults();
    }
    
    applyActiveFilters(data = this.moodData) {
        let filtered = [...data];
        
        console.log('🔍 Applying filters to', data.length, 'entries');
        console.log('Active filters:', this.activeFilters);
        
        // Show sample entry dates for debugging
        if (data.length > 0) {
            console.log('📋 Sample entry dates (first 3):');
            data.slice(0, 3).forEach((entry, i) => {
                const entryDate = new Date(entry.date);
                console.log(`  Entry ${i + 1}:`, {
                    raw: entry.date,
                    parsed: entryDate.toLocaleString(),
                    timestamp: entryDate.getTime()
                });
            });
        }
        
        // Date range filter
        if (this.activeFilters.dateFrom) {
            try {
                // Parse date string as local date (YYYY-MM-DD format)
                const [year, month, day] = this.activeFilters.dateFrom.split('-').map(Number);
                const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
                const fromTimestamp = fromDate.getTime();
                
                console.log('📅 From Date Filter:', {
                    input: this.activeFilters.dateFrom,
                    year, month, day,
                    fromDate: fromDate.toLocaleString(),
                    timestamp: fromTimestamp
                });
                
                const beforeFilter = filtered.length;
                filtered = filtered.filter(entry => {
                    const entryDate = new Date(entry.date);
                    const entryTimestamp = entryDate.getTime();
                    const passes = entryTimestamp >= fromTimestamp;
                    
                    if (!passes) {
                        console.log('❌ Filtered out:', {
                            entryDate: entryDate.toLocaleString(),
                            timestamp: entryTimestamp,
                            reason: 'before fromDate'
                        });
                    }
                    
                    return passes;
                });
                console.log(`Filtered ${beforeFilter} → ${filtered.length} entries (from date)`);
            } catch (error) {
                console.error('❌ Error parsing dateFrom:', error);
            }
        }
        
        if (this.activeFilters.dateTo) {
            try {
                // Parse date string as local date (YYYY-MM-DD format)
                const [year, month, day] = this.activeFilters.dateTo.split('-').map(Number);
                const toDate = new Date(year, month - 1, day, 23, 59, 59, 999);
                const toTimestamp = toDate.getTime();
                
                console.log('📅 To Date Filter:', {
                    input: this.activeFilters.dateTo,
                    year, month, day,
                    toDate: toDate.toLocaleString(),
                    timestamp: toTimestamp
                });
                
                const beforeFilter = filtered.length;
                filtered = filtered.filter(entry => {
                    const entryDate = new Date(entry.date);
                    const entryTimestamp = entryDate.getTime();
                    const passes = entryTimestamp <= toTimestamp;
                    
                    if (!passes) {
                        console.log('❌ Filtered out:', {
                            entryDate: entryDate.toLocaleString(),
                            timestamp: entryTimestamp,
                            reason: 'after toDate'
                        });
                    }
                    
                    return passes;
                });
                console.log(`Filtered ${beforeFilter} → ${filtered.length} entries (to date)`);
            } catch (error) {
                console.error('❌ Error parsing dateTo:', error);
            }
        }
        
        // Mood range filter
        filtered = filtered.filter(entry => {
            return entry.mood.value >= this.activeFilters.moodMin && 
                   entry.mood.value <= this.activeFilters.moodMax;
        });
        
        // Tags filter
        if (this.activeFilters.tags.size > 0) {
            filtered = filtered.filter(entry => {
                return entry.tags.some(tag => this.activeFilters.tags.has(tag));
            });
        }
        
        return filtered;
    }
    
    applyFilters() {
        // Get filter values
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const moodMin = parseInt(document.getElementById('moodMinRange').value);
        const moodMax = parseInt(document.getElementById('moodMaxRange').value);
        
        // Get selected tags
        const selectedTags = new Set();
        document.querySelectorAll('.filter-tag-item.selected').forEach(tag => {
            selectedTags.add(tag.dataset.tag);
        });
        
        // Update active filters
        this.activeFilters = {
            dateFrom: dateFrom || null,
            dateTo: dateTo || null,
            moodMin,
            moodMax,
            tags: selectedTags
        };
        
        // Count active filters
        let filterCount = 0;
        if (dateFrom || dateTo) filterCount++;
        if (moodMin > 1 || moodMax < 5) filterCount++;
        if (selectedTags.size > 0) filterCount += selectedTags.size;
        
        // Update filter badge
        const filterBadge = document.getElementById('filterBadge');
        if (filterBadge) {
            if (filterCount > 0) {
                filterBadge.textContent = filterCount;
                filterBadge.style.display = 'flex';
            } else {
                filterBadge.style.display = 'none';
            }
        }
        
        // Apply filters
        if (this.searchQuery) {
            this.performSearch(this.searchQuery);
        } else {
            this.filteredResults = this.applyActiveFilters();
            this.displaySearchResults();
        }
        
        // Close filter panel
        const filtersPanel = document.getElementById('filtersPanel');
        if (filtersPanel) filtersPanel.style.display = 'none';
        
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        if (filterToggleBtn) filterToggleBtn.classList.remove('active');
        
        this.showToast(`Filters applied: ${filterCount} active`);
    }
    
    clearFilters() {
        // Reset filter inputs
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('moodMinRange').value = 1;
        document.getElementById('moodMaxRange').value = 5;
        document.getElementById('moodMinLabel').textContent = 1;
        document.getElementById('moodMaxLabel').textContent = 5;
        
        // Clear selected tags
        document.querySelectorAll('.filter-tag-item.selected').forEach(tag => {
            tag.classList.remove('selected');
        });
        
        // Reset active filters
        this.activeFilters = {
            dateFrom: null,
            dateTo: null,
            moodMin: 1,
            moodMax: 5,
            tags: new Set()
        };
        
        // Hide filter badge
        const filterBadge = document.getElementById('filterBadge');
        if (filterBadge) filterBadge.style.display = 'none';
        
        // Reapply search if active
        if (this.searchQuery) {
            this.performSearch(this.searchQuery);
        } else {
            this.clearSearch();
        }
        
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '筛选已清除' : 'Filters cleared';
        this.showToast(msg);
    }
    
    clearSearch() {
        this.searchQuery = '';
        this.filteredResults = [];
        
        // Hide search results info
        const searchResultsInfo = document.getElementById('searchResultsInfo');
        if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        
        // Show all entries
        this.updateRecentEntries();
        
        this.hideSearchHistory();
    }
    
    displaySearchResults() {
        const resultsCount = document.getElementById('resultsCount');
        const searchResultsInfo = document.getElementById('searchResultsInfo');
        const entriesList = document.getElementById('recentEntriesList');
        
        // Update results count
        if (resultsCount) {
            const count = this.filteredResults.length;
            resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
        }
        
        // Show results info
        if (searchResultsInfo) {
            searchResultsInfo.style.display = 'flex';
        }
        
        // Display filtered entries
        if (entriesList) {
            if (this.filteredResults.length === 0) {
                entriesList.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No results found</p>
                        <span>Try adjusting your search or filters</span>
                    </div>
                `;
            } else {
                this.displayEntries(this.filteredResults, entriesList);
            }
        }
    }
    
    displayEntries(entries, container) {
        container.innerHTML = entries.map(entry => {
            const date = new Date(entry.date);
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
            const emoji = moodEmojis[entry.mood.value - 1];
            
            // Highlight search term in note
            let noteHtml = entry.note || '<em>No note</em>';
            if (this.searchQuery && entry.note) {
                const regex = new RegExp(`(${this.searchQuery})`, 'gi');
                noteHtml = entry.note.replace(regex, '<mark>$1</mark>');
            }
            
            return `
                <div class="entry-item" data-entry-id="${entry.id}">
                    <div class="entry-mood">
                        <span class="entry-emoji">${emoji}</span>
                        <span class="entry-mood-label">${entry.mood.label}</span>
                    </div>
                    <div class="entry-details">
                        <p class="entry-note">${noteHtml}</p>
                        ${entry.tags.length > 0 ? `
                            <div class="entry-tags">
                                ${entry.tags.map(tag => {
                                    const highlighted = this.searchQuery && tag.toLowerCase().includes(this.searchQuery);
                                    return `<span class="entry-tag ${highlighted ? 'highlighted' : ''}">${tag}</span>`;
                                }).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="entry-meta">
                        <span class="entry-time">
                            <i class="fas fa-clock"></i> ${timeStr}
                        </span>
                        <span class="entry-date">
                            <i class="fas fa-calendar"></i> ${dateStr}
                        </span>
                    </div>
                    <div class="entry-actions">
                        <button class="entry-action-btn" onclick="moodTracker.editEntry('${entry.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="entry-action-btn" onclick="moodTracker.deleteEntry('${entry.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateAvailableTagsFilter() {
        const container = document.getElementById('availableTagsFilter');
        if (!container) return;
        
        // Get all unique tags
        const allTags = new Set();
        this.moodData.forEach(entry => {
            entry.tags.forEach(tag => allTags.add(tag));
        });
        
        if (allTags.size === 0) {
            container.innerHTML = '<p class="no-tags-message">No tags available</p>';
            return;
        }
        
        container.innerHTML = Array.from(allTags).map(tag => {
            return `
                <div class="filter-tag-item" data-tag="${tag}">
                    <i class="fas fa-tag"></i>
                    <span>${tag}</span>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        container.querySelectorAll('.filter-tag-item').forEach(tagEl => {
            tagEl.addEventListener('click', () => {
                tagEl.classList.toggle('selected');
            });
        });
    }
    
    // Search History Management
    loadSearchHistory() {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    }
    
    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
    
    addToSearchHistory(query) {
        if (!query || query.length < 2) return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Limit to 10 items
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
        
        this.saveSearchHistory();
    }
    
    showSearchHistory() {
        const searchHistory = document.getElementById('searchHistory');
        const searchHistoryList = document.getElementById('searchHistoryList');
        
        if (!searchHistory || !searchHistoryList || this.searchHistory.length === 0) return;
        
        searchHistoryList.innerHTML = this.searchHistory.map(query => `
            <div class="search-history-item" data-query="${query}">
                <i class="fas fa-history"></i>
                <span>${query}</span>
            </div>
        `).join('');
        
        // Add click handlers
        searchHistoryList.querySelectorAll('.search-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = query;
                    this.performSearch(query);
                }
            });
        });
        
        searchHistory.style.display = 'block';
    }
    
    hideSearchHistory() {
        const searchHistory = document.getElementById('searchHistory');
        if (searchHistory) searchHistory.style.display = 'none';
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.hideSearchHistory();
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '搜索历史已清除' : 'Search history cleared';
        this.showToast(msg);
    }
    
    // ==================== END SEARCH AND FILTER METHODS ====================

    // ==================== QUICK INPUT MODE METHODS ====================
    
    loadQuickModePreference() {
        const pref = localStorage.getItem('quickModeEnabled');
        return pref === 'true';
    }
    
    saveQuickModePreference() {
        localStorage.setItem('quickModeEnabled', this.isQuickMode);
    }
    
    initializeInputMode() {
        const quickInputMode = document.getElementById('quickInputMode');
        const normalTrackerForm = document.getElementById('normalTrackerForm');
        const modeToggleText = document.getElementById('modeToggleText');
        
        if (this.isQuickMode) {
            if (quickInputMode) quickInputMode.style.display = 'block';
            if (normalTrackerForm) normalTrackerForm.style.display = 'none';
            if (modeToggleText) modeToggleText.textContent = 'Normal Mode';
            this.updateTodayQuickEntries();
        } else {
            if (quickInputMode) quickInputMode.style.display = 'none';
            if (normalTrackerForm) normalTrackerForm.style.display = 'block';
            if (modeToggleText) modeToggleText.textContent = 'Quick Mode';
        }
    }
    
    toggleInputMode() {
        this.isQuickMode = !this.isQuickMode;
        this.saveQuickModePreference();
        
        const quickInputMode = document.getElementById('quickInputMode');
        const normalTrackerForm = document.getElementById('normalTrackerForm');
        const modeToggleText = document.getElementById('modeToggleText');
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        
        if (this.isQuickMode) {
            // Switch to Quick Mode
            if (quickInputMode) {
                quickInputMode.style.display = 'none';
                setTimeout(() => {
                    quickInputMode.style.display = 'block';
                    quickInputMode.classList.add('fade-in');
                }, 50);
            }
            if (normalTrackerForm) normalTrackerForm.style.display = 'none';
            if (modeToggleText) modeToggleText.textContent = 'Normal Mode';
            if (modeToggleBtn) modeToggleBtn.classList.add('quick-mode-active');
            
            this.updateTodayQuickEntries();
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '快速模式已启用！⚡ 点击任意心情即可保存' : 'Quick Mode enabled! ⚡ Click any mood to save instantly.';
            this.showToast(msg);
        } else {
            // Switch to Normal Mode
            if (normalTrackerForm) {
                normalTrackerForm.style.display = 'none';
                setTimeout(() => {
                    normalTrackerForm.style.display = 'block';
                    normalTrackerForm.classList.add('fade-in');
                }, 50);
            }
            if (quickInputMode) quickInputMode.style.display = 'none';
            if (modeToggleText) modeToggleText.textContent = 'Quick Mode';
            if (modeToggleBtn) modeToggleBtn.classList.remove('quick-mode-active');
            
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '普通模式已启用。添加详细条目。' : 'Normal Mode enabled. Add detailed entries.';
            this.showToast(msg);
        }
    }
    
    saveQuickMoodEntry(moodValue, moodLabel, btnElement) {
        // Add visual feedback
        btnElement.classList.add('saving');
        
        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mood: {
                value: moodValue,
                label: moodLabel
            },
            note: '',
            tags: [],
            quickEntry: true
        };
        
        this.moodData.unshift(entry);
        this.saveMoodData();
        
        // Show success animation
        setTimeout(() => {
            btnElement.classList.remove('saving');
            btnElement.classList.add('saved');
            
            // Reset after animation
            setTimeout(() => {
                btnElement.classList.remove('saved');
            }, 1000);
        }, 300);
        
        // Update UI
        this.updateDashboard();
        this.updateTodayQuickEntries();
        
        // Show toast with undo option
        const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
        const emoji = moodEmojis[moodValue - 1];
        this.showToast(`${emoji} ${moodLabel} logged! Entry saved.`);
        
        // Trigger celebration for positive moods
        if (moodValue >= 4) {
            this.triggerCelebration(btnElement);
        }
    }
    
    updateTodayQuickEntries() {
        const quickEntriesList = document.getElementById('quickEntriesList');
        if (!quickEntriesList) return;
        
        // Get today's entries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayEntries = this.moodData.filter(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        });
        
        if (todayEntries.length === 0) {
            quickEntriesList.innerHTML = `
                <div class="no-quick-entries">
                    <i class="fas fa-inbox"></i>
                    <p>No entries yet today</p>
                </div>
            `;
            return;
        }
        
        const moodEmojis = ['😭', '🙁', '😐', '🙂', '😄'];
        
        quickEntriesList.innerHTML = todayEntries.slice(0, 10).map(entry => {
            const time = new Date(entry.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const emoji = moodEmojis[entry.mood.value - 1];
            
            return `
                <div class="quick-entry-item">
                    <span class="quick-entry-emoji">${emoji}</span>
                    <div class="quick-entry-info">
                        <span class="quick-entry-label">${entry.mood.label}</span>
                        <span class="quick-entry-time">${time}</span>
                    </div>
                    <button class="quick-entry-delete" onclick="moodTracker.deleteEntry('${entry.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
    
    triggerCelebration(element) {
        // Create confetti effect
        const colors = ['#00ff88', '#00cc6a', '#00ff99', '#00ddaa'];
        const confettiCount = 15;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
            confetti.style.setProperty('--ty', `${-Math.random() * 200 - 50}px`);
            confetti.style.setProperty('--r', `${Math.random() * 360}deg`);
            
            element.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 1000);
        }
    }
    
    // ==================== END QUICK INPUT MODE METHODS ====================

    // ==================== KEYBOARD SHORTCUTS ====================
    
    setupKeyboardShortcuts() {
        if (!this.keyboardShortcutsEnabled) return;
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
    }
    
    handleKeyboardShortcut(e) {
        // Don't trigger shortcuts when typing in input fields
        const isInputField = e.target.tagName === 'INPUT' || 
                            e.target.tagName === 'TEXTAREA' || 
                            e.target.isContentEditable;
        
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        const alt = e.altKey;
        
        // Ctrl+Z: New entry (open tracker)
        if (ctrl && e.key === 'z' && !isInputField) {
            e.preventDefault();
            this.showSection('tracker');
            const firstMoodBtn = document.querySelector('.mood-btn');
            if (firstMoodBtn) firstMoodBtn.focus();
            this.showShortcutToast('New Entry Mode');
            return;
        }
        
        // Ctrl+S: Save entry
        if (ctrl && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.getElementById('saveMood');
            if (saveBtn && !saveBtn.disabled) {
                saveBtn.click();
                this.showShortcutToast('Entry Saved');
            }
            return;
        }
        
        // Ctrl+F: Search
        if (ctrl && e.key === 'f') {
            e.preventDefault();
            this.showSection('dashboard');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                this.showShortcutToast('Search Mode');
            }
            return;
        }
        
        // Ctrl+/: Show keyboard shortcuts help
        if (ctrl && e.key === '/') {
            e.preventDefault();
            this.toggleShortcutHelp();
            return;
        }
        
        // Ctrl+K: Quick command palette
        if (ctrl && e.key === 'k') {
            e.preventDefault();
            this.showShortcutToast('Quick Actions');
            // Focus on AI assistant toggle
            const aiToggle = document.getElementById('aiChatToggle');
            if (aiToggle) aiToggle.click();
            return;
        }
        
        // Esc: Close modals, deselect, clear
        if (e.key === 'Escape') {
            this.handleEscapeKey();
            return;
        }
        
        // Number keys 1-5: Quick mood selection (when tracker is active)
        if (!isInputField && !ctrl && !alt && !shift) {
            const activeSection = document.querySelector('.section.active');
            if (activeSection?.id === 'tracker') {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 5) {
                    e.preventDefault();
                    const moodBtns = document.querySelectorAll('.mood-btn');
                    if (moodBtns[num - 1]) {
                        this.selectMood(moodBtns[num - 1]);
                        this.showShortcutToast(`Mood ${num} Selected`);
                    }
                    return;
                }
            }
        }
        
        // Ctrl+1,2,3,4: Navigate sections
        if (ctrl && !isInputField) {
            const sections = ['dashboard', 'tracker', 'analytics', 'insights'];
            const num = parseInt(e.key);
            if (num >= 1 && num <= 4) {
                e.preventDefault();
                this.showSection(sections[num - 1]);
                const navLinks = document.querySelectorAll('.nav-link');
                this.updateNavigation(navLinks[num - 1]);
                this.showShortcutToast(`${sections[num - 1].charAt(0).toUpperCase() + sections[num - 1].slice(1)}`);
                return;
            }
        }
        
        // Ctrl+E: Export data
        if (ctrl && e.key === 'e' && !isInputField) {
            e.preventDefault();
            this.exportJSON();
            this.showShortcutToast('Exporting Data...');
            return;
        }
        
        // Ctrl+D: Download PDF
        if (ctrl && e.key === 'd' && !isInputField) {
            e.preventDefault();
            this.generatePDFReport();
            this.showShortcutToast('Generating PDF...');
            return;
        }
    }
    
    handleEscapeKey() {
        // Close any open modals
        const modals = document.querySelectorAll('.modal[style*="display: flex"], .modal[style*="display: block"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Close AI chat if open
        const aiChat = document.querySelector('.ai-chat-container.active');
        if (aiChat && window.aiAssistant) {
            window.aiAssistant.toggleChat();
        }
        
        // Clear search if active
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            this.clearSearch();
        }
        
        // Deselect current mood
        if (this.currentMood) {
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.currentMood = null;
        }
        
        this.showShortcutToast('Cleared');
    }
    
    toggleShortcutHelp() {
        this.shortcutHelpVisible = !this.shortcutHelpVisible;
        
        let modal = document.getElementById('shortcutHelpModal');
        if (!modal) {
            modal = this.createShortcutHelpModal();
            document.body.appendChild(modal);
        }
        
        modal.style.display = this.shortcutHelpVisible ? 'flex' : 'none';
    }
    
    createShortcutHelpModal() {
        const currentLocale = i18n?.getLocale() || 'en';
        const isZh = currentLocale === 'zh';
        
        const shortcuts = [
            { keys: 'Ctrl+Z', action: isZh ? '新建记录' : 'New Entry', icon: 'plus' },
            { keys: 'Ctrl+S', action: isZh ? '保存记录' : 'Save Entry', icon: 'save' },
            { keys: 'Ctrl+F', action: isZh ? '搜索' : 'Search', icon: 'search' },
            { keys: 'Ctrl+/', action: isZh ? '显示快捷键' : 'Show Shortcuts', icon: 'keyboard' },
            { keys: 'Ctrl+K', action: isZh ? 'AI助手' : 'AI Assistant', icon: 'robot' },
            { keys: 'Ctrl+E', action: isZh ? '导出JSON' : 'Export JSON', icon: 'download' },
            { keys: 'Ctrl+D', action: isZh ? '生成PDF' : 'Generate PDF', icon: 'file-pdf' },
            { keys: '1-5', action: isZh ? '快速选择心情' : 'Quick Mood Select', icon: 'smile' },
            { keys: 'Ctrl+1-4', action: isZh ? '切换页面' : 'Navigate Sections', icon: 'compass' },
            { keys: 'Esc', action: isZh ? '取消/关闭' : 'Cancel/Close', icon: 'times' }
        ];
        
        const modal = document.createElement('div');
        modal.id = 'shortcutHelpModal';
        modal.className = 'modal';
        
        let shortcutsList = '';
        shortcuts.forEach(s => {
            shortcutsList += `
                <div class="shortcut-item">
                    <div class="shortcut-keys">
                        <kbd>${s.keys}</kbd>
                    </div>
                    <div class="shortcut-action">
                        <i class="fas fa-${s.icon}"></i>
                        <span>${s.action}</span>
                    </div>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-content shortcut-help-modal">
                <div class="modal-header">
                    <h2>
                        <i class="fas fa-keyboard"></i>
                        ${isZh ? '键盘快捷键' : 'Keyboard Shortcuts'}
                    </h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="shortcuts-list">
                        ${shortcutsList}
                    </div>
                    <div class="shortcut-tip">
                        <i class="fas fa-lightbulb"></i>
                        <span>${isZh ? '提示：在Mac上使用Cmd键代替Ctrl键' : 'Tip: Use Cmd key instead of Ctrl on Mac'}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">
                        ${isZh ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.shortcutHelpVisible = false;
            }
        });
        
        return modal;
    }
    
    showShortcutToast(message) {
        const currentLocale = i18n?.getLocale() || 'en';
        const prefix = currentLocale === 'zh' ? '⌨️ ' : '⌨️ ';
        this.showToast(prefix + message);
    }

    // ==================== MOBILE RESPONSIVE METHODS ====================
    
    initMobileFeatures() {
        // Check if mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (this.isMobile) {
            // Setup pull to refresh
            this.setupPullToRefresh();
            
            // Setup swipe gestures for entries
            this.setupSwipeGestures();
            
            // Add touch-friendly classes
            document.body.classList.add('mobile-device');
        }
        
        // Update mobile nav on section change
        const currentSection = document.querySelector('.section.active')?.id || 'dashboard';
        this.updateMobileNavActive(currentSection);
    }
    
    updateMobileNavActive(sectionId) {
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    setupPullToRefresh() {
        const main = document.querySelector('.main');
        const pullToRefresh = document.getElementById('pullToRefresh');
        
        if (!main || !pullToRefresh) return;
        
        let touchStartY = 0;
        let touchCurrentY = 0;
        
        main.addEventListener('touchstart', (e) => {
            // Only trigger if scrolled to top
            if (main.scrollTop === 0) {
                touchStartY = e.touches[0].clientY;
                this.isPulling = true;
            }
        }, { passive: true });
        
        main.addEventListener('touchmove', (e) => {
            if (!this.isPulling || this.isRefreshing) return;
            
            touchCurrentY = e.touches[0].clientY;
            const pullDistance = touchCurrentY - touchStartY;
            
            if (pullDistance > 0 && pullDistance < 150) {
                pullToRefresh.style.transform = `translateY(${pullDistance}px)`;
                pullToRefresh.style.opacity = pullDistance / 150;
                
                if (pullDistance > 80) {
                    pullToRefresh.classList.add('ready');
                    pullToRefresh.querySelector('.pull-to-refresh-text').textContent = 'Release to refresh';
                } else {
                    pullToRefresh.classList.remove('ready');
                    pullToRefresh.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
                }
            }
        }, { passive: true });
        
        main.addEventListener('touchend', (e) => {
            if (!this.isPulling) return;
            
            const pullDistance = touchCurrentY - touchStartY;
            
            if (pullDistance > 80 && !this.isRefreshing) {
                this.triggerRefresh();
            } else {
                this.resetPullToRefresh();
            }
            
            this.isPulling = false;
            touchStartY = 0;
            touchCurrentY = 0;
        }, { passive: true });
    }
    
    triggerRefresh() {
        const pullToRefresh = document.getElementById('pullToRefresh');
        if (!pullToRefresh) return;
        
        this.isRefreshing = true;
        pullToRefresh.classList.add('refreshing');
        pullToRefresh.querySelector('.pull-to-refresh-text').textContent = 'Refreshing...';
        
        // Simulate refresh - update dashboard and charts
        setTimeout(() => {
            this.updateDashboard();
            this.updateRecentEntries();
            
            if (document.getElementById('analytics').classList.contains('active')) {
                this.initializeCharts();
            }
            
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '仪表板已刷新！' : 'Dashboard refreshed!';
            this.showToast(msg);
            this.resetPullToRefresh();
            this.isRefreshing = false;
        }, 1500);
    }
    
    resetPullToRefresh() {
        const pullToRefresh = document.getElementById('pullToRefresh');
        if (!pullToRefresh) return;
        
        pullToRefresh.style.transform = 'translateY(-100%)';
        pullToRefresh.style.opacity = '0';
        pullToRefresh.classList.remove('ready', 'refreshing');
        pullToRefresh.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
    }
    
    setupSwipeGestures() {
        // Add swipe to delete for entry items
        const setupEntrySwipe = () => {
            const entryItems = document.querySelectorAll('.entry-item');
            
            entryItems.forEach(item => {
                if (item.dataset.swipeEnabled) return; // Already set up
                
                let startX = 0;
                let currentX = 0;
                let isSwiping = false;
                
                item.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    isSwiping = true;
                }, { passive: true });
                
                item.addEventListener('touchmove', (e) => {
                    if (!isSwiping) return;
                    
                    currentX = e.touches[0].clientX;
                    const diffX = currentX - startX;
                    
                    // Only allow swipe left
                    if (diffX < 0 && diffX > -100) {
                        item.style.transform = `translateX(${diffX}px)`;
                        item.style.transition = 'none';
                    }
                }, { passive: true });
                
                item.addEventListener('touchend', (e) => {
                    if (!isSwiping) return;
                    
                    const diffX = currentX - startX;
                    
                    item.style.transition = 'transform 0.3s ease';
                    
                    if (diffX < -60) {
                        // Show delete button
                        item.style.transform = 'translateX(-80px)';
                        item.classList.add('swiped');
                        
                        // Close other swiped items
                        document.querySelectorAll('.entry-item.swiped').forEach(other => {
                            if (other !== item) {
                                other.style.transform = 'translateX(0)';
                                other.classList.remove('swiped');
                            }
                        });
                    } else {
                        // Reset
                        item.style.transform = 'translateX(0)';
                        item.classList.remove('swiped');
                    }
                    
                    isSwiping = false;
                    startX = 0;
                    currentX = 0;
                }, { passive: true });
                
                item.dataset.swipeEnabled = 'true';
            });
        };
        
        // Setup initially and observe for new entries
        setupEntrySwipe();
        
        // Re-setup when entries are updated
        const observer = new MutationObserver(() => {
            setupEntrySwipe();
        });
        
        const entriesList = document.getElementById('recentEntriesList');
        if (entriesList) {
            observer.observe(entriesList, { childList: true });
        }
    }
    
    // Close swiped entries when clicking outside
    closeSwipedEntries() {
        document.querySelectorAll('.entry-item.swiped').forEach(item => {
            item.style.transform = 'translateX(0)';
            item.classList.remove('swiped');
        });
    }
    
    // ==================== END MOBILE RESPONSIVE METHODS ====================

    // ==================== EXPORT METHODS ====================
    
    async exportToCSV() {
        if (this.moodData.length === 0) {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '没有数据可导出' : 'No data to export';
            this.showToast(msg);
            return;
        }
        
        // CSV header
        const headers = ['Date', 'Time', 'Mood Value', 'Mood Label', 'Note', 'Tags'];
        
        // Convert data to CSV format
        const csvRows = [headers.join(',')];
        
        this.moodData.forEach(entry => {
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            const note = `"${(entry.note || '').replace(/"/g, '""')}"`; // Escape quotes
            const tags = `"${entry.tags.join(', ')}"`;
            
            const row = [
                dateStr,
                timeStr,
                entry.mood.value,
                entry.mood.label,
                note,
                tags
            ];
            
            csvRows.push(row.join(','));
        });
        
        // Create CSV file
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = `MoodTracker_Data_${new Date().toISOString().split('T')[0]}.csv`;
        
        // Use FileSaver.js if available, otherwise use fallback
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? 'CSV导出成功！' : 'CSV exported successfully!';
        this.showToast(msg);
    }
    
    async exportToImage() {
        if (typeof html2canvas === 'undefined') {
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '图片导出库未加载' : 'Image export library not loaded';
            this.showToast(msg);
            return;
        }
        
        const currentLocale = i18n.getLocale();
        const msg = currentLocale === 'zh' ? '正在生成图片报告...' : 'Generating image report...';
        this.showToast(msg);
        
        // Get the dashboard element
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;
        
        // Clone the dashboard
        const clone = dashboard.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = '1200px';
        clone.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
        clone.style.padding = '40px';
        document.body.appendChild(clone);
        
        try {
            // Convert all canvas elements to images before capturing
            const canvases = dashboard.querySelectorAll('canvas');
            const clonedCanvases = clone.querySelectorAll('canvas');
            
            canvases.forEach((canvas, index) => {
                if (clonedCanvases[index]) {
                    const ctx = clonedCanvases[index].getContext('2d');
                    // Copy the original canvas content to the cloned canvas
                    clonedCanvases[index].width = canvas.width;
                    clonedCanvases[index].height = canvas.height;
                    ctx.drawImage(canvas, 0, 0);
                }
            });
            
            // Wait a moment for canvas to be ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const renderedCanvas = await html2canvas(clone, {
                backgroundColor: '#0a0a0a',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: false,
                imageTimeout: 0,
                removeContainer: false
            });
            
            renderedCanvas.toBlob((blob) => {
                const filename = `MoodTracker_Report_${new Date().toISOString().split('T')[0]}.png`;
                if (typeof saveAs !== 'undefined') {
                    saveAs(blob, filename);
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? '图片报告导出成功！' : 'Image report exported successfully!';
                this.showToast(msg);
            });
        } catch (error) {
            console.error('Error generating image:', error);
            const currentLocale = i18n.getLocale();
            const msg = currentLocale === 'zh' ? '生成图片报告失败：' + error.message : 'Failed to generate image report: ' + error.message;
            this.showToast(msg);
        } finally {
            document.body.removeChild(clone);
        }
    }
    
    handlePrint() {
        window.print();
    }
    
    async handleExport(format) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        switch (format) {
            case 'csv':
                await this.exportToCSV();
                break;
            case 'icalendar':
                this.exportICalendar(timestamp);
                break;
            case 'image':
                await this.exportToImage();
                break;
            case 'markdown':
                this.exportMarkdown(timestamp);
                break;
            case 'pdf':
                this.exportPDF(timestamp);
                break;
            case 'docx':
                this.exportDOCX(timestamp);
                break;
            case 'print':
                this.handlePrint();
                break;
            default:
                const currentLocale = i18n.getLocale();
                const msg = currentLocale === 'zh' ? '导出格式暂不支持' : 'Export format not supported yet';
                this.showToast(msg);
        }
    }
    
    // ==================== END EXPORT METHODS ====================
    
    // ==================== INTERNATIONALIZATION METHODS ====================
    
    toggleLanguage() {
        if (typeof i18n === 'undefined') return;
        
        const currentLocale = i18n.getLocale();
        const newLocale = currentLocale === 'en' ? 'zh' : 'en';
        
        i18n.setLocale(newLocale);
        this.updateUILanguage();
        this.updateTimezoneInfo();
        this.updateDashboard();
        this.initializeCharts();
        this.generateInsights();
        
        // Update AI Assistant i18n
        if (window.aiAssistant && typeof window.aiAssistant.updateI18n === 'function') {
            window.aiAssistant.updateI18n();
        }
        
        const langName = newLocale === 'zh' ? '中文' : 'English';
        this.showToast(`${newLocale === 'zh' ? '语言已切换至' : 'Language changed to'} ${langName}`);
    }
    
    showTimezoneSelector() {
        const currentLocale = i18n.getLocale();
        const currentTimezone = i18n.getTimezone();
        const timezones = i18n.getCommonTimezones();
        
        const title = currentLocale === 'zh' ? '选择时区' : 'Select Timezone';
        const currentLabel = currentLocale === 'zh' ? '当前时区：' : 'Current timezone: ';
        const selectLabel = currentLocale === 'zh' ? '选择新时区：' : 'Select new timezone:';
        const autoDetectLabel = currentLocale === 'zh' ? '自动检测' : 'Auto Detect';
        const saveBtn = currentLocale === 'zh' ? '保存' : 'Save';
        const cancelBtn = currentLocale === 'zh' ? '取消' : 'Cancel';
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="timezoneModal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-globe"></i> ${title}</h2>
                        <button class="modal-close" onclick="document.getElementById('timezoneModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(0, 255, 136, 0.05); border-radius: 8px;">
                            <div style="font-size: 0.9rem; color: var(--gray-400); margin-bottom: 4px;">${currentLabel}</div>
                            <div style="font-weight: 600; color: var(--primary-green);">${currentTimezone}</div>
                        </div>
                        
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--gray-300);">${selectLabel}</label>
                        <select id="timezoneSelect" style="width: 100%; padding: 0.75rem; background: var(--secondary-black); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; color: var(--gray-300); font-size: 0.95rem;">
                            <option value="auto">${autoDetectLabel}</option>
                            ${timezones.map(tz => `
                                <option value="${tz.value}" ${tz.value === currentTimezone ? 'selected' : ''}>
                                    ${tz.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="document.getElementById('timezoneModal').remove()">
                            ${cancelBtn}
                        </button>
                        <button class="btn-primary" id="saveTimezoneBtn">
                            <i class="fas fa-save"></i> ${saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('timezoneModal');
        if (existingModal) existingModal.remove();
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add save button handler
        document.getElementById('saveTimezoneBtn').addEventListener('click', () => {
            const select = document.getElementById('timezoneSelect');
            const selectedTimezone = select.value;
            
            if (selectedTimezone === 'auto') {
                // Clear user timezone to use auto-detect
                localStorage.removeItem('moodtracker_timezone');
                i18n.userTimezone = null;
            } else {
                i18n.setTimezone(selectedTimezone);
            }
            
            this.updateTimezoneInfo();
            document.getElementById('timezoneModal').remove();
            
            const successMsg = currentLocale === 'zh' ? '时区已更新' : 'Timezone updated';
            this.showToast(successMsg);
        });
        
        // Close on overlay click
        document.getElementById('timezoneModal').addEventListener('click', (e) => {
            if (e.target.id === 'timezoneModal') {
                document.getElementById('timezoneModal').remove();
            }
        });
    }
    
    updateUILanguage() {
        if (typeof i18n === 'undefined') return;
        
        // Update header
        const logo = document.querySelector('.logo span');
        if (logo) logo.textContent = i18n.t('appName');
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks[0]) navLinks[0].querySelector('span').textContent = i18n.t('dashboard');
        if (navLinks[1]) navLinks[1].querySelector('span').textContent = i18n.t('analytics');
        if (navLinks[2]) navLinks[2].querySelector('span').textContent = i18n.t('insights');
        
        // Update buttons
        const saveMoodBtn = document.querySelector('#saveMood');
        if (saveMoodBtn) saveMoodBtn.innerHTML = `<i class="fas fa-save"></i> ${i18n.t('saveMood')}`;
        
        const exportBtn = document.querySelector('#exportDropdownBtn .btn-text');
        if (exportBtn) exportBtn.textContent = i18n.t('export');
        
        const personalBtn = document.querySelector('#personalDropdownBtn .btn-text');
        if (personalBtn) personalBtn.textContent = i18n.t('personal');
        
        const clearBtn = document.querySelector('#clearData .btn-text');
        if (clearBtn) clearBtn.textContent = i18n.t('clearData');
        
        // Update export menu
        const exportOptions = document.querySelectorAll('.export-option');
        exportOptions.forEach(option => {
            const format = option.dataset.format;
            const span = option.querySelector('span');
            if (span && format) {
                const translations = {
                    'csv': 'csvData',
                    'image': 'imageReport',
                    'markdown': 'markdown',
                    'pdf': 'pdfReport',
                    'docx': 'wordDocument',
                    'print': 'print'
                };
                if (translations[format]) {
                    span.textContent = i18n.t(translations[format]);
                }
            }
        });
        
        // Update personal menu
        const personalOptions = document.querySelectorAll('.personal-option');
        if (personalOptions[0]) personalOptions[0].querySelector('span').textContent = i18n.t('customMoodScale');
        if (personalOptions[1]) personalOptions[1].querySelector('span').textContent = i18n.t('moodReminders');
        if (personalOptions[2]) personalOptions[2].querySelector('span').textContent = i18n.t('notificationSettings');
        
        // Update mood selection text
        const moodQuestion = document.querySelector('.mood-selection h2');
        if (moodQuestion) moodQuestion.textContent = i18n.t('selectMood');
        
        // Update note section
        const noteLabel = document.querySelector('.note-section label');
        if (noteLabel) noteLabel.textContent = i18n.t('addNote');
        
        const noteTextarea = document.querySelector('#moodNote');
        if (noteTextarea) noteTextarea.placeholder = i18n.t('notePlaceholder');
        
        // Update tags section
        const tagsLabel = document.querySelector('.tags-section label');
        if (tagsLabel) tagsLabel.textContent = i18n.t('selectTags');
        
        // Update chart titles
        const chartTitles = document.querySelectorAll('.chart-container h3, .chart-panel h3');
        if (chartTitles[0]) chartTitles[0].textContent = i18n.t('weeklyTrend');
        if (chartTitles[1]) chartTitles[1].textContent = i18n.t('moodDistribution');
        if (chartTitles[2]) chartTitles[2].textContent = i18n.t('tagAnalysis');
        
        // Update section titles
        const dashboardTitle = document.querySelector('#dashboard .section-header h1');
        if (dashboardTitle) dashboardTitle.textContent = i18n.t('dashboard');
        
        const recentEntriesTitle = document.querySelector('.entries-section h3');
        if (recentEntriesTitle) recentEntriesTitle.textContent = i18n.t('recentEntries');
        
        const analyticsTitle = document.querySelector('#analytics .section-header h1');
        if (analyticsTitle) analyticsTitle.textContent = i18n.t('analytics');
        
        const insightsTitle = document.querySelector('#insights .section-header h1');
        if (insightsTitle) insightsTitle.textContent = i18n.t('insightsTitle');
        
        // Update stat labels
        this.updateStatLabels();
    }
    
    updateStatLabels() {
        if (typeof i18n === 'undefined') return;
        
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels[0]) statLabels[0].textContent = i18n.t('totalEntries');
        if (statLabels[1]) statLabels[1].textContent = i18n.t('averageMood');
        if (statLabels[2]) statLabels[2].textContent = i18n.t('currentStreak');
        if (statLabels[3]) statLabels[3].textContent = i18n.t('longestStreak');
    }
    
    formatDateLocalized(date) {
        if (typeof i18n !== 'undefined') {
            return i18n.formatDateTime(date);
        }
        return new Date(date).toLocaleString();
    }
    
    formatRelativeTimeLocalized(date) {
        if (typeof i18n !== 'undefined') {
            return i18n.formatRelativeTime(date);
        }
        return new Date(date).toLocaleString();
    }
    
    formatNumberLocalized(number, decimals = 0) {
        if (typeof i18n !== 'undefined') {
            return i18n.formatNumber(number, decimals);
        }
        return number.toFixed(decimals);
    }
    
    updateTimezoneInfo() {
        if (typeof i18n === 'undefined') return;
        
        const timezoneElement = document.getElementById('timezoneInfo');
        if (!timezoneElement) return;
        
        const timezone = i18n.getTimezone();
        const offset = i18n.getTimezoneOffset();
        const currentLocale = i18n.getLocale();
        
        if (currentLocale === 'zh') {
            timezoneElement.textContent = `时区: ${timezone} (UTC${offset})`;
        } else {
            timezoneElement.textContent = `Timezone: ${timezone} (UTC${offset})`;
        }
    }
    
    // ==================== END INTERNATIONALIZATION METHODS ====================

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        // Clear any existing timeout
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        // Force hide first
        toast.classList.remove('show');
        
        // Set new message
        toastMessage.textContent = message;
        
        // Show toast after brief delay
        this.toastTimeout = setTimeout(() => {
            toast.classList.add('show');
            
            // Hide toast after 3 seconds
            this.hideTimeout = setTimeout(() => {
                toast.classList.remove('show');
                this.toastTimeout = null;
                this.hideTimeout = null;
            }, 3000);
        }, 50);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodTrackerInstance = new MoodTracker();
    
    // Expose public API
    window.MoodTrackerAPI = {
        // Data operations
        getMoods: () => {
            return window.moodTrackerInstance.moodData;
        },
        
        getMoodById: (id) => {
            return window.moodTrackerInstance.moodData.find(entry => entry.id === id);
        },
        
        addMood: (moodData) => {
            const entry = {
                id: Date.now(),
                date: moodData.date || new Date().toISOString(),
                mood: moodData.mood,
                note: moodData.note || '',
                tags: moodData.tags || [],
                images: moodData.images || [],
                timestamp: Date.now()
            };
            window.moodTrackerInstance.moodData.push(entry);
            window.moodTrackerInstance.saveMoodData();
            window.moodTrackerInstance.updateDashboard();
            return entry;
        },
        
        updateMood: (id, updates) => {
            const index = window.moodTrackerInstance.moodData.findIndex(entry => entry.id === id);
            if (index !== -1) {
                window.moodTrackerInstance.moodData[index] = {
                    ...window.moodTrackerInstance.moodData[index],
                    ...updates
                };
                window.moodTrackerInstance.saveMoodData();
                window.moodTrackerInstance.updateDashboard();
                return window.moodTrackerInstance.moodData[index];
            }
            return null;
        },
        
        deleteMood: (id) => {
            const index = window.moodTrackerInstance.moodData.findIndex(entry => entry.id === id);
            if (index !== -1) {
                const deleted = window.moodTrackerInstance.moodData.splice(index, 1)[0];
                window.moodTrackerInstance.saveMoodData();
                window.moodTrackerInstance.updateDashboard();
                return deleted;
            }
            return null;
        },
        
        // Statistics
        getStats: () => {
            return window.moodTrackerInstance.generateStats();
        },
        
        getMoodDistribution: () => {
            return window.moodTrackerInstance.getMoodDistribution();
        },
        
        // Export functions
        exportJSON: () => {
            const timestamp = new Date().toISOString().split('T')[0];
            window.moodTrackerInstance.exportJSON(timestamp);
        },
        
        exportICalendar: () => {
            const timestamp = new Date().toISOString().split('T')[0];
            window.moodTrackerInstance.exportICalendar(timestamp);
        },
        
        exportData: () => {
            return {
                moods: window.moodTrackerInstance.moodData,
                stats: window.moodTrackerInstance.generateStats(),
                exportDate: new Date().toISOString()
            };
        },
        
        // UI operations
        showSection: (sectionName) => {
            window.moodTrackerInstance.showSection(sectionName);
        },
        
        showToast: (message) => {
            window.moodTrackerInstance.showToast(message);
        },
        
        // Webhook operations
        configureWebhook: (config) => {
            window.moodTrackerInstance.saveWebhookSettings(config);
        },
        
        testWebhook: () => {
            window.moodTrackerInstance.testWebhook();
        },
        
        triggerWebhook: (eventType, data) => {
            window.moodTrackerInstance.triggerWebhook(eventType, data);
        },
        
        // Event subscription
        on: (eventName, callback) => {
            if (!window.MoodTrackerAPI._listeners) {
                window.MoodTrackerAPI._listeners = {};
            }
            if (!window.MoodTrackerAPI._listeners[eventName]) {
                window.MoodTrackerAPI._listeners[eventName] = [];
            }
            window.MoodTrackerAPI._listeners[eventName].push(callback);
        },
        
        off: (eventName, callback) => {
            if (window.MoodTrackerAPI._listeners && window.MoodTrackerAPI._listeners[eventName]) {
                const index = window.MoodTrackerAPI._listeners[eventName].indexOf(callback);
                if (index > -1) {
                    window.MoodTrackerAPI._listeners[eventName].splice(index, 1);
                }
            }
        },
        
        emit: (eventName, data) => {
            if (window.MoodTrackerAPI._listeners && window.MoodTrackerAPI._listeners[eventName]) {
                window.MoodTrackerAPI._listeners[eventName].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`Event listener error for ${eventName}:`, error);
                    }
                });
            }
        },
        
        // Plugin system
        plugins: [],
        
        registerPlugin: (plugin) => {
            if (typeof plugin.init === 'function') {
                plugin.init(window.MoodTrackerAPI);
                window.MoodTrackerAPI.plugins.push(plugin);
                console.log(`Plugin registered: ${plugin.name || 'Unknown'}`);
            } else {
                console.error('Plugin must have an init function');
            }
        },
        
        // Utility
        version: '1.0.0',
        
        getVersion: () => {
            return window.MoodTrackerAPI.version;
        }
    };
    
    // Log API availability
    console.log('%c🧠 MoodTracker Pro API Ready!', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%cAccess via: window.MoodTrackerAPI', 'color: #00ff88;');
    console.log('%cDocumentation: https://github.com/moodtracker-pro/api-docs', 'color: #adb5bd;');
    
    // Initialize AI Assistant after MoodTracker is ready
    setTimeout(() => {
        window.aiAssistant = new AIAssistant(window.moodTrackerInstance);
        console.log('🤖 AI Assistant initialized');
    }, 500);
});

// ==================== PWA FUNCTIONALITY ====================

let deferredPrompt;
let swRegistration = null;

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                swRegistration = registration;
                console.log('✅ Service Worker registered successfully:', registration.scope);
                
                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 New Service Worker found, installing...');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
        
        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed, reloading...');
            window.location.reload();
        });
    });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 PWA install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
});

// App Installed Event
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
    hideInstallPrompt();
    showToastMessage('MoodTracker Pro installed! You can now use it offline. 🎉');
});

// Show PWA Install Prompt
function showInstallPrompt() {
    const installBanner = document.createElement('div');
    installBanner.id = 'pwaInstallBanner';
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
        <div class="install-banner-content">
            <div class="install-icon">📱</div>
            <div class="install-text">
                <strong>Install MoodTracker Pro</strong>
                <p>Get quick access and work offline</p>
            </div>
            <div class="install-actions">
                <button class="btn-primary" id="installBtn">Install</button>
                <button class="btn-secondary" id="dismissInstallBtn">Not Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Show banner with animation
    setTimeout(() => installBanner.classList.add('show'), 100);
    
    // Install button
    document.getElementById('installBtn').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        
        deferredPrompt = null;
        hideInstallPrompt();
    });
    
    // Dismiss button
    document.getElementById('dismissInstallBtn').addEventListener('click', () => {
        hideInstallPrompt();
        // Remember dismissal for 7 days
        localStorage.setItem('pwaInstallDismissed', Date.now() + (7 * 24 * 60 * 60 * 1000));
    });
}

function hideInstallPrompt() {
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
    }
}

// Check if install was previously dismissed
function shouldShowInstallPrompt() {
    const dismissedUntil = localStorage.getItem('pwaInstallDismissed');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
        return false;
    }
    return true;
}

// Show Update Notification
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwaUpdateBanner';
    updateBanner.className = 'pwa-update-banner';
    updateBanner.innerHTML = `
        <div class="update-banner-content">
            <div class="update-icon">🔄</div>
            <div class="update-text">
                <strong>Update Available</strong>
                <p>A new version of MoodTracker Pro is ready</p>
            </div>
            <div class="update-actions">
                <button class="btn-primary" id="updateBtn">Update Now</button>
                <button class="btn-secondary" id="dismissUpdateBtn">Later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(updateBanner);
    setTimeout(() => updateBanner.classList.add('show'), 100);
    
    // Update button
    document.getElementById('updateBtn').addEventListener('click', () => {
        if (swRegistration && swRegistration.waiting) {
            swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    });
    
    // Dismiss button
    document.getElementById('dismissUpdateBtn').addEventListener('click', () => {
        updateBanner.classList.remove('show');
        setTimeout(() => updateBanner.remove(), 300);
    });
}

// Online/Offline Status Detection
window.addEventListener('online', () => {
    console.log('🌐 Back online');
    showToastMessage('You\'re back online! ✅');
    updateOnlineStatus(true);
});

window.addEventListener('offline', () => {
    console.log('📴 Gone offline');
    showToastMessage('You\'re offline. App will work with cached data. 📴');
    updateOnlineStatus(false);
});

function updateOnlineStatus(isOnline) {
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `online-status-indicator ${isOnline ? 'online' : 'offline'}`;
    statusIndicator.innerHTML = `
        <i class="fas fa-${isOnline ? 'wifi' : 'wifi-slash'}"></i>
        <span>${isOnline ? 'Online' : 'Offline'}</span>
    `;
    
    // Remove existing indicator
    const existing = document.querySelector('.online-status-indicator');
    if (existing) existing.remove();
    
    document.body.appendChild(statusIndicator);
    
    // Auto-hide after 3 seconds if online
    if (isOnline) {
        setTimeout(() => {
            statusIndicator.style.opacity = '0';
            setTimeout(() => statusIndicator.remove(), 300);
        }, 3000);
    }
}

// Helper function for toast messages
function showToastMessage(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Also announce to screen readers
    announceToScreenReader(message);
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Helper function to announce to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.id = 'screen-reader-announcement';
    announcement.textContent = message;
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 3000);
}

// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// Log PWA status
if (isPWA()) {
    console.log('🚀 Running as PWA (installed app)');
} else {
    console.log('🌐 Running in browser');
}

// ==================== END PWA FUNCTIONALITY ====================

// ==================== AI CHAT ASSISTANT ====================

class AIAssistant {
    constructor(moodTracker) {
        this.moodTracker = moodTracker;
        this.chatContainer = document.getElementById('aiChatContainer');
        this.chatToggle = document.getElementById('aiChatToggle');
        this.chatWindow = document.getElementById('aiChatWindow');
        this.messagesContainer = document.getElementById('aiMessages');
        this.chatInput = document.getElementById('aiChatInput');
        this.sendBtn = document.getElementById('aiSendBtn');
        this.resetBtn = document.getElementById('aiResetBtn');
        this.minimizeBtn = document.getElementById('aiMinimizeBtn');
        this.closeBtn = document.getElementById('aiCloseBtn');
        this.typingIndicator = document.getElementById('aiTypingIndicator');
        this.notificationBadge = document.getElementById('aiNotificationBadge');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.conversationHistory = [];
        
        this.initializeEventListeners();
        this.loadConversationHistory();
        this.updateI18n();
    }
    
    initializeEventListeners() {
        // Toggle chat window
        this.chatToggle?.addEventListener('click', () => this.toggleChat());
        
        // Reset conversation button
        this.resetBtn?.addEventListener('click', () => this.resetConversation());
        
        // Close button
        this.closeBtn?.addEventListener('click', () => this.closeChat());
        
        // Minimize button
        this.minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
        
        // Send message
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.chatInput?.addEventListener('input', () => this.autoResizeInput());
        
        // Quick action buttons
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatContainer.contains(e.target) && !this.chatToggle.contains(e.target)) {
                // Don't close if minimized
                if (!this.isMinimized) {
                    this.closeChat();
                }
            }
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('active');
        this.chatToggle.style.transform = 'scale(0.8)';
        this.chatInput?.focus();
        
        // Hide notification badge
        if (this.notificationBadge) {
            this.notificationBadge.style.display = 'none';
        }
        
        // If no messages, show welcome
        if (this.conversationHistory.length === 0) {
            this.showWelcomeMessage();
        }
    }
    
    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.chatContainer.classList.remove('active', 'minimized');
        this.chatToggle.style.transform = 'scale(1)';
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.chatContainer.classList.add('minimized');
        } else {
            this.chatContainer.classList.remove('minimized');
        }
    }
    
    resetConversation() {
        if (!confirm('Are you sure you want to clear the conversation? This cannot be undone.')) {
            return;
        }
        
        console.log('🔄 Starting conversation reset...');
        
        try {
            // Clear messages container
            if (this.messagesContainer) {
                this.messagesContainer.innerHTML = '';
                console.log('✅ Messages container cleared');
            } else {
                console.warn('⚠️ Messages container not found');
            }
            
            // Clear conversation history
            this.conversationHistory = [];
            
            // Save empty history
            this.saveConversationHistory();
            console.log('✅ Conversation history cleared');
            
            // Show welcome message with avatar and quick actions
            // Try multiple methods to ensure compatibility
            this.showWelcomeMessage();
            
            // Alternative method if querySelector fails
            setTimeout(() => {
                const welcomeMessage = document.querySelector('.ai-welcome-message');
                if (welcomeMessage) {
                    welcomeMessage.style.display = 'block';
                    console.log('✅ Welcome message displayed');
                } else {
                    console.warn('⚠️ Welcome message element not found, trying alternative...');
                    // Try with getElementById as fallback
                    const chatBody = document.getElementById('aiChatBody');
                    if (chatBody) {
                        const welcomeInBody = chatBody.querySelector('.ai-welcome-message');
                        if (welcomeInBody) {
                            welcomeInBody.style.display = 'block';
                            console.log('✅ Welcome message displayed (alternative method)');
                        }
                    }
                }
            }, 100);
            
            // Clear input
            if (this.chatInput) {
                this.chatInput.value = '';
                this.autoResizeInput();
                console.log('✅ Input cleared');
            } else {
                console.warn('⚠️ Chat input not found');
            }
            
            // Scroll to top to show welcome message
            const chatBody = document.getElementById('aiChatBody');
            if (chatBody) {
                chatBody.scrollTop = 0;
                console.log('✅ Scrolled to top');
            } else {
                console.warn('⚠️ Chat body not found for scrolling');
            }
            
            console.log('✅ AI conversation reset completed - Welcome screen restored');
        } catch (error) {
            console.error('❌ Error during conversation reset:', error);
            alert('Failed to reset conversation. Please refresh the page and try again.');
        }
    }
    
    autoResizeInput() {
        if (!this.chatInput) return;
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.autoResizeInput();
        
        // Show typing indicator
        this.showTyping();
        
        // Get AI response
        const response = await this.getAIResponse(message);
        
        // Hide typing indicator
        this.hideTyping();
        
        // Add AI response
        this.addMessage(response, 'ai');
        
        // Save conversation
        this.saveConversationHistory();
    }
    
    addMessage(content, sender = 'ai') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        const currentLocale = i18n?.getLocale() || 'en';
        const time = new Date().toLocaleTimeString(currentLocale === 'zh' ? 'zh-CN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="ai-message-content">
                ${content}
                <span class="ai-message-time">${time}</span>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        
        // Hide welcome message if exists
        const welcomeMsg = document.querySelector('.ai-welcome-message');
        if (welcomeMsg && this.conversationHistory.length === 0) {
            welcomeMsg.style.display = 'none';
        }
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add to history
        this.conversationHistory.push({ content, sender, timestamp: Date.now() });
    }
    
    showTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }
    
    hideTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }
    
    scrollToBottom() {
        const chatBody = document.getElementById('aiChatBody');
        if (chatBody) {
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);
        }
    }
    
    showWelcomeMessage() {
        const welcomeMsg = document.querySelector('.ai-welcome-message');
        if (welcomeMsg) {
            welcomeMsg.style.display = 'block';
        }
    }
    
    async handleQuickAction(action) {
        const currentLocale = i18n?.getLocale() || 'en';
        
        switch (action) {
            case 'analyze':
                await this.analyzeMood();
                break;
            case 'suggest-tags':
                await this.suggestTags();
                break;
            case 'wellness-tip':
                await this.getWellnessTip();
                break;
            case 'insights':
                await this.getInsights();
                break;
        }
    }
    
    async analyzeMood() {
        const currentLocale = i18n?.getLocale() || 'en';
        const userMsg = currentLocale === 'zh' ? '分析我的心情' : 'Analyze my mood';
        
        this.addMessage(userMsg, 'user');
        this.showTyping();
        
        await this.delay(1500);
        
        const moodData = this.moodTracker.moodData || [];
        const recentMoods = moodData.slice(-7);
        
        let response;
        if (recentMoods.length === 0) {
            response = currentLocale === 'zh' 
                ? '您还没有记录任何心情数据。开始记录您的心情，我就能为您提供深入的分析和见解！' 
                : "You haven't logged any mood data yet. Start tracking your moods, and I'll provide insightful analysis!";
        } else {
            const avgMood = (recentMoods.reduce((sum, e) => sum + e.mood.value, 0) / recentMoods.length).toFixed(1);
            const trend = this.calculateTrend(recentMoods);
            
            if (currentLocale === 'zh') {
                response = `根据最近${recentMoods.length}条记录分析：\n\n` +
                    `📊 平均心情指数：${avgMood}/5\n` +
                    `📈 趋势：${trend === 'up' ? '上升 ↗️' : trend === 'down' ? '下降 ↘️' : '稳定 →'}\n\n` +
                    `${this.getMoodInsight(avgMood, trend, 'zh')}`;
            } else {
                response = `Based on your last ${recentMoods.length} entries:\n\n` +
                    `📊 Average Mood: ${avgMood}/5\n` +
                    `📈 Trend: ${trend === 'up' ? 'Improving ↗️' : trend === 'down' ? 'Declining ↘️' : 'Stable →'}\n\n` +
                    `${this.getMoodInsight(avgMood, trend, 'en')}`;
            }
        }
        
        this.hideTyping();
        this.addMessage(response, 'ai');
        this.saveConversationHistory();
    }
    
    async suggestTags() {
        const currentLocale = i18n?.getLocale() || 'en';
        const userMsg = currentLocale === 'zh' ? '建议标签' : 'Suggest tags';
        
        this.addMessage(userMsg, 'user');
        this.showTyping();
        
        await this.delay(1000);
        
        const suggestedTags = currentLocale === 'zh'
            ? ['运动', '冥想', '社交', '工作', '学习', '娱乐', '家庭', '放松']
            : ['exercise', 'meditation', 'social', 'work', 'study', 'entertainment', 'family', 'relaxation'];
        
        const randomTags = this.shuffleArray(suggestedTags).slice(0, 4);
        
        const response = currentLocale === 'zh'
            ? `💡 基于您的活动模式，我建议使用这些标签：\n\n${randomTags.map(t => `• ${t}`).join('\n')}\n\n使用标签可以帮助您更好地追踪不同活动对心情的影响！`
            : `💡 Based on your activity patterns, I suggest these tags:\n\n${randomTags.map(t => `• ${t}`).join('\n')}\n\nUsing tags helps you track how different activities affect your mood!`;
        
        this.hideTyping();
        this.addMessage(response, 'ai');
        this.saveConversationHistory();
    }
    
    async getWellnessTip() {
        const currentLocale = i18n?.getLocale() || 'en';
        const userMsg = currentLocale === 'zh' ? '给我一个健康建议' : 'Give me a wellness tip';
        
        this.addMessage(userMsg, 'user');
        this.showTyping();
        
        await this.delay(1200);
        
        const tips = currentLocale === 'zh' ? [
            '🧘\u200d♀️ 每天花10分钟冥想可以显著减少压力和焦虑。',
            '🚶\u200d♂️ 每天步行30分钟可以改善情绪和整体健康。',
            '💤 保持规律的睡眠时间表对情绪稳定至关重要。',
            '🌿 在大自然中度过时光已被证明能提升心理健康。',
            '📱 减少屏幕时间，特别是睡前，可以改善睡眠质量。',
            '🤝 与朋友和家人保持联系对情感健康很重要。',
            '📝 写日记可以帮助处理情绪和减轻压力。',
            '🎵 听音乐可以立即改善心情和减少焦虑。'
        ] : [
            '🧘\u200d♀️ Just 10 minutes of daily meditation can significantly reduce stress and anxiety.',
            '🚶\u200d♂️ A 30-minute daily walk can improve mood and overall well-being.',
            '💤 Maintaining a regular sleep schedule is crucial for emotional stability.',
            '🌿 Spending time in nature has been proven to boost mental health.',
            '📱 Reducing screen time, especially before bed, can improve sleep quality.',
            '🤝 Staying connected with friends and family is vital for emotional wellness.',
            '📝 Journaling can help process emotions and reduce stress.',
            '🎵 Listening to music can instantly improve mood and reduce anxiety.'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        this.hideTyping();
        this.addMessage(randomTip, 'ai');
        this.saveConversationHistory();
    }
    
    async getInsights() {
        const currentLocale = i18n?.getLocale() || 'en';
        const userMsg = currentLocale === 'zh' ? '给我一些见解' : 'Give me insights';
        
        this.addMessage(userMsg, 'user');
        this.showTyping();
        
        await this.delay(1500);
        
        const moodData = this.moodTracker.moodData || [];
        
        let response;
        if (moodData.length < 5) {
            response = currentLocale === 'zh'
                ? '记录至少5条心情数据后，我就能为您提供更深入的见解和模式分析。继续记录吧！'
                : "Log at least 5 mood entries, and I'll provide deeper insights and pattern analysis. Keep tracking!";
        } else {
            const stats = this.calculateStats(moodData);
            
            if (currentLocale === 'zh') {
                response = `📊 您的心情数据洞察：\n\n` +
                    `• 总记录数：${stats.total}\n` +
                    `• 平均心情：${stats.average}/5\n` +
                    `• 最常见心情：${stats.mostCommon}\n` +
                    `• 连续记录天数：${stats.streak}\n\n` +
                    `💡 ${stats.insight}`;
            } else {
                response = `📊 Your Mood Data Insights:\n\n` +
                    `• Total Entries: ${stats.total}\n` +
                    `• Average Mood: ${stats.average}/5\n` +
                    `• Most Common: ${stats.mostCommon}\n` +
                    `• Current Streak: ${stats.streak} days\n\n` +
                    `💡 ${stats.insight}`;
            }
        }
        
        this.hideTyping();
        this.addMessage(response, 'ai');
        this.saveConversationHistory();
    }
    
    async getAIResponse(message) {
        const currentLocale = i18n?.getLocale() || 'en';
        await this.delay(1000);
        
        const lowerMsg = message.toLowerCase();
        
        // Pattern matching for responses
        if (lowerMsg.includes('心情') || lowerMsg.includes('mood') || lowerMsg.includes('feeling')) {
            return currentLocale === 'zh'
                ? '我很高兴您想讨论您的心情！😊 记录和理解您的情绪是心理健康的重要一步。您今天感觉如何？'
                : "I'm glad you want to discuss your mood! 😊 Tracking and understanding your emotions is an important step for mental wellness. How are you feeling today?";
        }
        
        if (lowerMsg.includes('帮助') || lowerMsg.includes('help')) {
            return currentLocale === 'zh'
                ? '我可以帮您：\n• 分析心情趋势\n• 建议合适的标签\n• 提供健康建议\n• 检测情绪异常\n\n点击上方的快捷按钮或直接问我！'
                : 'I can help you with:\n• Analyzing mood trends\n• Suggesting relevant tags\n• Providing wellness tips\n• Detecting emotional patterns\n\nClick the quick action buttons above or just ask me!';
        }
        
        if (lowerMsg.includes('压力') || lowerMsg.includes('stress') || lowerMsg.includes('焦虑') || lowerMsg.includes('anxiety')) {
            return currentLocale === 'zh'
                ? '感到压力或焦虑是正常的。🌸 试试这些方法：\n• 深呼吸练习\n• 短暂的休息\n• 与朋友聊天\n• 轻度运动\n\n如果持续困扰，请考虑寻求专业帮助。'
                : "Feeling stressed or anxious is normal. 🌸 Try these:\n• Deep breathing exercises\n• Take a short break\n• Talk to a friend\n• Light exercise\n\nIf it persists, consider seeking professional help.";
        }
        
        // Default response
        const responses = currentLocale === 'zh' ? [
            '这是个很好的观察！继续记录您的心情，我会帮您发现更多模式。',
            '我明白了。您想深入讨论这个话题吗？',
            '谢谢分享！记录这些细节对了解您的情绪模式很有帮助。',
            '有趣！您可以使用快捷操作按钮获取更多见解。'
        ] : [
            "That's a great observation! Keep tracking your mood, and I'll help you discover more patterns.",
            "I understand. Would you like to explore this topic further?",
            "Thanks for sharing! Tracking these details helps understand your emotional patterns.",
            "Interesting! You can use the quick action buttons for more insights."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Helper methods
    calculateTrend(moods) {
        if (moods.length < 2) return 'stable';
        const recent = moods.slice(-3).reduce((sum, e) => sum + e.mood.value, 0) / Math.min(3, moods.length);
        const older = moods.slice(0, -3).reduce((sum, e) => sum + e.mood.value, 0) / Math.max(1, moods.length - 3);
        
        if (recent > older + 0.5) return 'up';
        if (recent < older - 0.5) return 'down';
        return 'stable';
    }
    
    getMoodInsight(avgMood, trend, locale) {
        if (locale === 'zh') {
            if (avgMood >= 4) return '您的心情很好！继续保持积极的生活方式。✨';
            if (avgMood >= 3) return '您的心情整体不错。注意保持生活平衡。🌟';
            if (trend === 'up') return '虽然心情偏低，但正在改善！继续加油！💪';
            return '建议多关注自我关怀，必要时寻求支持。💙';
        } else {
            if (avgMood >= 4) return "You're doing great! Keep up the positive lifestyle. ✨";
            if (avgMood >= 3) return "Your mood is generally good. Keep maintaining balance. 🌟";
            if (trend === 'up') return "Though mood is lower, it's improving! Keep going! 💪";
            return 'Consider focusing on self-care and seeking support if needed. 💙';
        }
    }
    
    calculateStats(moodData) {
        const total = moodData.length;
        const average = (moodData.reduce((sum, e) => sum + e.mood.value, 0) / total).toFixed(1);
        
        const moodCounts = {};
        moodData.forEach(e => {
            const label = e.mood.label;
            moodCounts[label] = (moodCounts[label] || 0) + 1;
        });
        const mostCommon = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
        
        const streak = this.moodTracker.calculateStreak ? this.moodTracker.calculateStreak() : 1;
        
        const currentLocale = i18n?.getLocale() || 'en';
        let insight;
        if (average >= 4) {
            insight = currentLocale === 'zh' ? '您保持着很好的心情状态！' : "You're maintaining excellent mood levels!";
        } else if (average >= 3) {
            insight = currentLocale === 'zh' ? '整体状态良好，继续保持！' : 'Overall doing well, keep it up!';
        } else {
            insight = currentLocale === 'zh' ? '考虑增加更多积极活动。' : 'Consider adding more positive activities.';
        }
        
        return { total, average, mostCommon, streak, insight };
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    saveConversationHistory() {
        try {
            const data = JSON.stringify(this.conversationHistory);
            localStorage.setItem('ai_conversation_history', data);
            console.log('💾 Conversation history saved:', this.conversationHistory.length, 'messages');
        } catch (e) {
            console.error('❌ Failed to save conversation history:', e);
            // Try sessionStorage as fallback
            try {
                sessionStorage.setItem('ai_conversation_history', JSON.stringify(this.conversationHistory));
                console.log('💾 Saved to sessionStorage instead');
            } catch (e2) {
                console.error('❌ SessionStorage also failed:', e2);
                // Store in memory only
                console.warn('⚠️ Using in-memory storage only (data will be lost on refresh)');
            }
        }
    }
    
    loadConversationHistory() {
        try {
            // Try localStorage first
            let saved = null;
            try {
                saved = localStorage.getItem('ai_conversation_history');
            } catch (e) {
                console.warn('⚠️ localStorage not accessible, trying sessionStorage...');
                try {
                    saved = sessionStorage.getItem('ai_conversation_history');
                } catch (e2) {
                    console.error('❌ Both localStorage and sessionStorage failed');
                }
            }
            
            if (saved) {
                try {
                    this.conversationHistory = JSON.parse(saved);
                    console.log('📥 Loaded conversation history:', this.conversationHistory.length, 'messages');
                    
                    // Restore messages
                    if (this.conversationHistory.length > 0) {
                        this.conversationHistory.forEach(msg => {
                            if (msg.sender && msg.content) {
                                this.addMessageToDOM(msg.content, msg.sender);
                            }
                        });
                        
                        // Hide welcome message
                        setTimeout(() => {
                            const welcomeMsg = document.querySelector('.ai-welcome-message');
                            if (welcomeMsg) {
                                welcomeMsg.style.display = 'none';
                                console.log('✅ Welcome message hidden (history exists)');
                            }
                        }, 100);
                    } else {
                        console.log('✅ No conversation history, showing welcome message');
                    }
                } catch (parseError) {
                    console.error('❌ Failed to parse conversation history:', parseError);
                    // Clear corrupted data
                    try {
                        localStorage.removeItem('ai_conversation_history');
                        sessionStorage.removeItem('ai_conversation_history');
                    } catch (e) {
                        console.error('❌ Failed to clear corrupted data:', e);
                    }
                    this.conversationHistory = [];
                }
            } else {
                console.log('ℹ️ No saved conversation history');
                this.conversationHistory = [];
            }
        } catch (e) {
            console.error('❌ Failed to load conversation history:', e);
            this.conversationHistory = [];
        }
    }
    
    addMessageToDOM(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="ai-message-content">
                ${content}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
    }
    
    // Update internationalization
    updateI18n() {
        if (typeof i18n === 'undefined') return;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = i18n.t(key);
            }
        });
        
        // Update placeholder
        const input = document.getElementById('aiChatInput');
        if (input) {
            const placeholderKey = input.getAttribute('data-i18n-placeholder');
            if (placeholderKey) {
                input.placeholder = i18n.t(placeholderKey);
            }
        }
    }
}


// ==================== END AI CHAT ASSISTANT ====================
