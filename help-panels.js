// Help Center Panel Update Methods

function updateFAQPanel(isZh) {
    const content = isZh ? `
        <h3>常见问题</h3>
        <div class="faq-list">
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>如何删除单条心情记录？</strong>
                </div>
                <div class="faq-answer">
                    在Dashboard的"Mood History"部分，每条记录右侧都有删除按钮（垃圾桶图标）。
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>数据存储在哪里？</strong>
                </div>
                <div class="faq-answer">
                    所有数据都存储在您的浏览器本地（localStorage），不会上传到服务器。建议定期导出备份。
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>如何更改语言？</strong>
                </div>
                <div class="faq-answer">
                    点击右上角"Personal"菜单 → "Language / 语言"，可在中英文之间切换。
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>语音输入不工作？</strong>
                </div>
                <div class="faq-answer">
                    语音输入需要浏览器支持Web Speech API。建议使用Chrome或Edge浏览器，并授予麦克风权限。
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>如何备份和恢复数据？</strong>
                </div>
                <div class="faq-answer">
                    在"Personal" → "Backup & Restore"中可以备份所有数据到JSON文件，以及从备份文件恢复数据。
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>插件如何安装？</strong>
                </div>
                <div class="faq-answer">
                    点击Dashboard的"Plugins"按钮，浏览插件市场，点击"Install"即可安装。所有插件都是开源的。
                </div>
            </div>
        </div>
    ` : `
        <h3>Frequently Asked Questions</h3>
        <div class="faq-list">
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>How to delete a single mood entry?</strong>
                </div>
                <div class="faq-answer">
                    In the "Mood History" section of Dashboard, each entry has a delete button (trash icon) on the right.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>Where is my data stored?</strong>
                </div>
                <div class="faq-answer">
                    All data is stored locally in your browser (localStorage) and never uploaded to servers. Regular backups are recommended.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>How to change language?</strong>
                </div>
                <div class="faq-answer">
                    Click "Personal" menu in top-right → "Language / 语言" to switch between English and Chinese.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>Voice input not working?</strong>
                </div>
                <div class="faq-answer">
                    Voice input requires Web Speech API support. Use Chrome or Edge browser and grant microphone permissions.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>How to backup and restore data?</strong>
                </div>
                <div class="faq-answer">
                    In "Personal" → "Backup & Restore", you can backup all data to JSON file and restore from backup.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    <strong>How to install plugins?</strong>
                </div>
                <div class="faq-answer">
                    Click "Plugins" button on Dashboard, browse the marketplace, and click "Install". All plugins are open-source.
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('faqPanel').innerHTML = content;
}

function updateTutorialsPanel(isZh) {
    const content = isZh ? `
        <h3>视频教程</h3>
        <div class="tutorials-grid">
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>快速入门指南</h4>
                    <p>5分钟了解MoodTracker Pro的基本功能</p>
                    <button class="btn-secondary" onclick="window.open('https://www.youtube.com/results?search_query=mood+tracker+tutorial', '_blank')">
                        <i class="fab fa-youtube"></i> 观看教程
                    </button>
                </div>
            </div>
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>数据分析技巧</h4>
                    <p>充分利用图表和分析功能</p>
                    <button class="btn-secondary" onclick="window.open('https://www.youtube.com/results?search_query=mood+tracking+analytics', '_blank')">
                        <i class="fab fa-youtube"></i> 观看教程
                    </button>
                </div>
            </div>
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>插件开发指南</h4>
                    <p>创建自己的MoodTracker插件</p>
                    <button class="btn-secondary" onclick="window.open('https://github.com', '_blank')">
                        <i class="fab fa-github"></i> 查看文档
                    </button>
                </div>
            </div>
        </div>
    ` : `
        <h3>Video Tutorials</h3>
        <div class="tutorials-grid">
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>Quick Start Guide</h4>
                    <p>Learn MoodTracker Pro basics in 5 minutes</p>
                    <button class="btn-secondary" onclick="window.open('https://www.youtube.com/results?search_query=mood+tracker+tutorial', '_blank')">
                        <i class="fab fa-youtube"></i> Watch Tutorial
                    </button>
                </div>
            </div>
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>Data Analytics Tips</h4>
                    <p>Make the most of charts and analytics</p>
                    <button class="btn-secondary" onclick="window.open('https://www.youtube.com/results?search_query=mood+tracking+analytics', '_blank')">
                        <i class="fab fa-youtube"></i> Watch Tutorial
                    </button>
                </div>
            </div>
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-info">
                    <h4>Plugin Development</h4>
                    <p>Create your own MoodTracker plugins</p>
                    <button class="btn-secondary" onclick="window.open('https://github.com', '_blank')">
                        <i class="fab fa-github"></i> View Docs
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('tutorialsPanel').innerHTML = content;
}

function updateFeedbackPanel(isZh) {
    const content = isZh ? `
        <h3>用户反馈</h3>
        <div class="feedback-section">
            <p>我们重视您的反馈！请通过以下方式联系我们：</p>
            
            <div class="feedback-form">
                <div class="form-group">
                    <label for="feedbackType">反馈类型</label>
                    <select id="feedbackType" class="feedback-select">
                        <option value="bug">🐛 Bug报告</option>
                        <option value="feature">💡 功能建议</option>
                        <option value="question">❓ 问题咨询</option>
                        <option value="praise">👍 表扬反馈</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="feedbackSubject">标题</label>
                    <input type="text" id="feedbackSubject" class="feedback-input" placeholder="简要描述您的反馈">
                </div>
                
                <div class="form-group">
                    <label for="feedbackMessage">详细描述</label>
                    <textarea id="feedbackMessage" class="feedback-textarea" rows="5" placeholder="请详细描述您的问题或建议..."></textarea>
                </div>
                
                <button class="btn-primary" id="sendFeedbackBtn">
                    <i class="fas fa-paper-plane"></i> 发送反馈
                </button>
            </div>
            
            <div class="contact-info">
                <h4>其他联系方式</h4>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>邮箱：<a href="mailto:3679044152@qq.com">3679044152@qq.com</a></span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-github"></i>
                    <span>GitHub：<a href="https://github.com" target="_blank">MoodTracker Pro</a></span>
                </div>
            </div>
        </div>
    ` : `
        <h3>User Feedback</h3>
        <div class="feedback-section">
            <p>We value your feedback! Contact us through:</p>
            
            <div class="feedback-form">
                <div class="form-group">
                    <label for="feedbackType">Feedback Type</label>
                    <select id="feedbackType" class="feedback-select">
                        <option value="bug">🐛 Bug Report</option>
                        <option value="feature">💡 Feature Request</option>
                        <option value="question">❓ Question</option>
                        <option value="praise">👍 Praise</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="feedbackSubject">Subject</label>
                    <input type="text" id="feedbackSubject" class="feedback-input" placeholder="Brief description of your feedback">
                </div>
                
                <div class="form-group">
                    <label for="feedbackMessage">Details</label>
                    <textarea id="feedbackMessage" class="feedback-textarea" rows="5" placeholder="Please describe your issue or suggestion..."></textarea>
                </div>
                
                <button class="btn-primary" id="sendFeedbackBtn">
                    <i class="fas fa-paper-plane"></i> Send Feedback
                </button>
            </div>
            
            <div class="contact-info">
                <h4>Other Contact Methods</h4>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>Email: <a href="mailto:3679044152@qq.com">3679044152@qq.com</a></span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-github"></i>
                    <span>GitHub: <a href="https://github.com" target="_blank">MoodTracker Pro</a></span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('feedbackPanel').innerHTML = content;
    
    // Add feedback send handler
    setTimeout(() => {
        const sendBtn = document.getElementById('sendFeedbackBtn');
        if (sendBtn && window.moodTracker) {
            sendBtn.addEventListener('click', () => window.moodTracker.sendFeedback());
        }
    }, 100);
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateFAQPanel, updateTutorialsPanel, updateFeedbackPanel };
}
