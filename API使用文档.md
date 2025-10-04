# 🚀 MoodTracker Pro - API 使用文档

## 📋 目录
1. [JavaScript API](#javascript-api)
2. [iCal日历导出](#ical日历导出)
3. [Webhook集成](#webhook集成)
4. [插件系统](#插件系统)
5. [使用示例](#使用示例)

---

## 🔌 JavaScript API

MoodTracker Pro 提供了完整的 JavaScript API，允许外部脚本、插件或浏览器控制台访问应用数据和功能。

### 访问方式

```javascript
// API 在页面加载完成后自动可用
window.MoodTrackerAPI
```

### API 版本

```javascript
MoodTrackerAPI.getVersion()  // 返回: "1.0.0"
```

---

## 📊 数据操作

### 获取所有心情记录

```javascript
// 获取所有心情数据
const moods = MoodTrackerAPI.getMoods();

console.log(moods);
// 返回数组，每个条目包含：
// {
//   id: 1733308800000,
//   date: "2025-10-04T10:00:00.000Z",
//   mood: 5,
//   note: "今天心情很好！",
//   tags: ["工作", "运动"],
//   images: [],
//   timestamp: 1733308800000
// }
```

### 根据ID获取单条记录

```javascript
const moodId = 1733308800000;
const mood = MoodTrackerAPI.getMoodById(moodId);

console.log(mood);
```

### 添加新的心情记录

```javascript
const newMood = MoodTrackerAPI.addMood({
    mood: 4,                    // 必需：1-5
    note: "下午去跑步了",        // 可选
    tags: ["运动", "健康"],      // 可选
    date: new Date().toISOString()  // 可选，默认当前时间
});

console.log(newMood);  // 返回创建的记录
```

### 更新现有记录

```javascript
const updated = MoodTrackerAPI.updateMood(1733308800000, {
    mood: 5,
    note: "更新后的笔记",
    tags: ["新标签"]
});

console.log(updated);
```

### 删除记录

```javascript
const deleted = MoodTrackerAPI.deleteMood(1733308800000);

console.log(deleted);  // 返回被删除的记录
```

---

## 📈 统计数据

### 获取完整统计

```javascript
const stats = MoodTrackerAPI.getStats();

console.log(stats);
// 返回：
// {
//   totalEntries: 45,
//   averageMood: "4.2",
//   currentStreak: 7,
//   longestStreak: 14,
//   moodTrend: "Improving",
//   bestDay: "2025-10-01",
//   worstDay: "2025-09-25",
//   moodVariance: "0.85"
// }
```

### 获取心情分布

```javascript
const distribution = MoodTrackerAPI.getMoodDistribution();

console.log(distribution);
// 返回: [2, 5, 10, 18, 10]
// 对应: [Very Bad, Bad, Neutral, Good, Excellent]
```

---

## 💾 导出功能

### 导出为JSON

```javascript
MoodTrackerAPI.exportJSON();
// 自动下载 mood-data-YYYY-MM-DD.json 文件
```

### 导出为iCal日历

```javascript
MoodTrackerAPI.exportICalendar();
// 自动下载 moodtracker-calendar-YYYY-MM-DD.ics 文件
// 可导入到 Google Calendar、Apple Calendar、Outlook 等
```

### 获取导出数据对象

```javascript
const data = MoodTrackerAPI.exportData();

console.log(data);
// 返回：
// {
//   moods: [...],
//   stats: {...},
//   exportDate: "2025-10-04T10:00:00.000Z"
// }

// 可用于自定义处理
const jsonString = JSON.stringify(data, null, 2);
```

---

## 🎨 UI操作

### 切换页面

```javascript
// 切换到不同的页面
MoodTrackerAPI.showSection('dashboard');   // 仪表板
MoodTrackerAPI.showSection('tracker');     // 心情追踪
MoodTrackerAPI.showSection('analytics');   // 数据分析
MoodTrackerAPI.showSection('insights');    // AI洞察
```

### 显示提示消息

```javascript
MoodTrackerAPI.showToast('操作成功！');
MoodTrackerAPI.showToast('This is a notification');
```

---

## 🔗 Webhook集成

### 配置Webhook

```javascript
MoodTrackerAPI.configureWebhook({
    enabled: true,
    url: 'https://your-webhook-url.com/endpoint',
    secret: 'your-secret-key',  // 可选，用于签名验证
    events: {
        moodSaved: true,           // 心情保存时触发
        streakMilestone: true,     // 达成连续记录里程碑
        lowMoodDetected: false     // 检测到低落心情
    }
});
```

### 测试Webhook

```javascript
MoodTrackerAPI.testWebhook();
// 发送测试请求到配置的 Webhook URL
```

### 手动触发Webhook

```javascript
MoodTrackerAPI.triggerWebhook('custom', {
    message: '自定义事件',
    data: { any: 'data' }
});
```

### Webhook Payload 格式

```json
{
  "event": "moodSaved",
  "timestamp": "2025-10-04T10:00:00.000Z",
  "data": {
    "mood": {
      "id": 1733308800000,
      "mood": 4,
      "note": "今天心情不错",
      "tags": ["工作"]
    },
    "stats": {
      "currentStreak": 7,
      "averageMood": "4.2"
    }
  },
  "app": "MoodTracker Pro",
  "version": "1.0.0",
  "signature": "abc123..."  // 如果配置了secret
}
```

---

## 🎧 事件系统

### 订阅事件

```javascript
// 监听心情保存事件
MoodTrackerAPI.on('moodSaved', (data) => {
    console.log('新心情已保存:', data);
});

// 监听心情更新事件
MoodTrackerAPI.on('moodUpdated', (data) => {
    console.log('心情已更新:', data);
});

// 监听心情删除事件
MoodTrackerAPI.on('moodDeleted', (data) => {
    console.log('心情已删除:', data);
});
```

### 取消订阅

```javascript
const handler = (data) => {
    console.log(data);
};

MoodTrackerAPI.on('moodSaved', handler);
MoodTrackerAPI.off('moodSaved', handler);  // 取消订阅
```

### 触发自定义事件

```javascript
MoodTrackerAPI.emit('customEvent', {
    message: 'Hello from custom event!'
});
```

---

## 🧩 插件系统

### 创建插件

```javascript
const myPlugin = {
    name: 'Weather Integration',
    version: '1.0.0',
    
    init: (api) => {
        console.log('插件初始化');
        
        // 监听心情保存事件
        api.on('moodSaved', async (data) => {
            const weather = await fetchWeather();
            console.log('当前天气:', weather);
        });
    }
};
```

### 注册插件

```javascript
MoodTrackerAPI.registerPlugin(myPlugin);
// 控制台输出: Plugin registered: Weather Integration
```

### 查看已安装插件

```javascript
console.log(MoodTrackerAPI.plugins);
```

---

## 📝 使用示例

### 示例1：自动备份到服务器

```javascript
// 每天自动备份数据到服务器
setInterval(async () => {
    const data = MoodTrackerAPI.exportData();
    
    try {
        await fetch('https://your-backup-server.com/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        console.log('备份成功！');
    } catch (error) {
        console.error('备份失败:', error);
    }
}, 24 * 60 * 60 * 1000);  // 每24小时
```

### 示例2：心情趋势监控

```javascript
// 监控连续3天低落心情
let lowMoodCount = 0;

MoodTrackerAPI.on('moodSaved', (data) => {
    if (data.mood.mood <= 2) {
        lowMoodCount++;
        
        if (lowMoodCount >= 3) {
            // 发送警报
            MoodTrackerAPI.showToast('⚠️ 连续3天心情低落，建议寻求支持');
            
            // 触发webhook通知
            MoodTrackerAPI.triggerWebhook('alert', {
                type: 'consecutive_low_mood',
                count: lowMoodCount
            });
        }
    } else {
        lowMoodCount = 0;  // 重置计数
    }
});
```

### 示例3：集成Discord机器人

```javascript
// 配置 Discord Webhook
MoodTrackerAPI.configureWebhook({
    enabled: true,
    url: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN',
    events: {
        streakMilestone: true
    }
});

// Discord 会收到如下消息格式（需要在服务端转换）
```

### 示例4：数据分析插件

```javascript
const analyticsPlugin = {
    name: 'Advanced Analytics',
    version: '1.0.0',
    
    init: (api) => {
        // 添加新的统计方法
        api.getWeeklyTrend = () => {
            const moods = api.getMoods();
            const lastWeek = moods.filter(m => {
                const date = new Date(m.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo;
            });
            
            return {
                count: lastWeek.length,
                average: lastWeek.reduce((sum, m) => sum + m.mood, 0) / lastWeek.length,
                trend: this.calculateTrend(lastWeek)
            };
        };
        
        console.log('Analytics plugin loaded!');
    },
    
    calculateTrend: (moods) => {
        // 简单趋势计算
        if (moods.length < 2) return 'insufficient_data';
        
        const firstHalf = moods.slice(0, Math.floor(moods.length / 2));
        const secondHalf = moods.slice(Math.floor(moods.length / 2));
        
        const firstAvg = firstHalf.reduce((s, m) => s + m.mood, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((s, m) => s + m.mood, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 0.5) return 'improving';
        if (secondAvg < firstAvg - 0.5) return 'declining';
        return 'stable';
    }
};

// 注册插件
MoodTrackerAPI.registerPlugin(analyticsPlugin);

// 使用新功能
const weeklyTrend = MoodTrackerAPI.getWeeklyTrend();
console.log('本周趋势:', weeklyTrend);
```

### 示例5：IFTTT集成

```javascript
// 使用 IFTTT Webhooks 集成多个服务
MoodTrackerAPI.configureWebhook({
    enabled: true,
    url: 'https://maker.ifttt.com/trigger/mood_saved/with/key/YOUR_IFTTT_KEY',
    events: {
        moodSaved: true,
        streakMilestone: true
    }
});

// IFTTT 可以将通知转发到：
// - Google Sheets (自动记录)
// - Telegram / WhatsApp (消息通知)
// - Google Calendar (添加事件)
// - Email (发送邮件)
// - iOS/Android 推送通知
```

---

## 🔒 安全建议

### Webhook签名验证

```javascript
// 配置 secret
MoodTrackerAPI.configureWebhook({
    enabled: true,
    url: 'https://your-server.com/webhook',
    secret: 'your-secret-key-here',
    events: { moodSaved: true }
});

// 在服务端验证签名（Node.js示例）
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
    const data = JSON.stringify(payload) + secret;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash === signature;
}
```

### 本地存储安全

```javascript
// API 不直接暴露敏感设置
// Webhook secret 存储在 localStorage，建议：
// 1. 使用 HTTPS
// 2. 不在公共计算机上使用
// 3. 定期更换 secret
// 4. 使用强密码保护设备
```

---

## 🌐 跨域和CORS

由于浏览器安全限制，Webhook请求可能遇到CORS问题：

### 解决方案

1. **使用支持CORS的服务**
   - Discord Webhooks ✅
   - Slack Webhooks ✅
   - 大多数现代webhook服务 ✅

2. **使用代理服务**
   ```javascript
   // 使用 CORS代理（仅用于开发测试）
   const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
   MoodTrackerAPI.configureWebhook({
       url: proxyUrl + 'https://your-api.com/endpoint'
   });
   ```

3. **搭建自己的后端**
   - 部署简单的转发服务器
   - 添加CORS头部
   - 进行签名验证

---

## 📚 完整API参考

### 数据操作
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `getMoods()` | - | Array | 获取所有心情记录 |
| `getMoodById(id)` | id: Number | Object\|null | 根据ID获取记录 |
| `addMood(data)` | data: Object | Object | 添加新记录 |
| `updateMood(id, updates)` | id: Number, updates: Object | Object\|null | 更新记录 |
| `deleteMood(id)` | id: Number | Object\|null | 删除记录 |

### 统计数据
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `getStats()` | - | Object | 获取统计数据 |
| `getMoodDistribution()` | - | Array | 获取心情分布 |

### 导出功能
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `exportJSON()` | - | void | 导出JSON文件 |
| `exportICalendar()` | - | void | 导出iCal日历 |
| `exportData()` | - | Object | 获取导出数据对象 |

### UI操作
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `showSection(name)` | name: String | void | 切换页面 |
| `showToast(msg)` | msg: String | void | 显示提示 |

### Webhook
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `configureWebhook(config)` | config: Object | void | 配置Webhook |
| `testWebhook()` | - | void | 测试Webhook |
| `triggerWebhook(event, data)` | event: String, data: Object | void | 触发Webhook |

### 事件系统
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `on(event, callback)` | event: String, callback: Function | void | 订阅事件 |
| `off(event, callback)` | event: String, callback: Function | void | 取消订阅 |
| `emit(event, data)` | event: String, data: any | void | 触发事件 |

### 插件系统
| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `registerPlugin(plugin)` | plugin: Object | void | 注册插件 |
| `plugins` | - | Array | 已安装插件列表 |

---

## 🎓 学习资源

- **iCal格式规范**: [RFC 5545](https://tools.ietf.org/html/rfc5545)
- **Webhook最佳实践**: [Webhook.site](https://webhook.site/)
- **IFTTT Webhooks**: [IFTTT Maker Webhooks](https://ifttt.com/maker_webhooks)
- **Discord Webhooks**: [Discord Webhook Guide](https://discord.com/developers/docs/resources/webhook)

---

## 🐛 故障排除

### Webhook未触发

1. 检查控制台错误
2. 验证URL格式正确
3. 确认事件已启用
4. 测试网络连接

### CORS错误

```
Access to fetch at '...' has been blocked by CORS policy
```

**解决方案**：
- 使用支持CORS的服务
- 或使用代理/后端转发

### API方法未定义

```
TypeError: MoodTrackerAPI.someMethod is not a function
```

**解决方案**：
- 确保页面完全加载
- 检查浏览器控制台是否有错误
- 验证API版本

---

## 💡 提示和技巧

1. **在浏览器控制台测试API**
   ```javascript
   // 打开开发者工具（F12）
   MoodTrackerAPI.getMoods()
   ```

2. **使用localStorage检查配置**
   ```javascript
   // 查看Webhook配置
   localStorage.getItem('webhookUrl')
   localStorage.getItem('webhookEnabled')
   ```

3. **调试Webhook**
   - 使用 [Webhook.site](https://webhook.site/) 创建临时URL
   - 配置该URL并发送测试请求
   - 查看实际发送的payload

4. **性能优化**
   ```javascript
   // 批量操作时暂时禁用UI更新
   const moods = MoodTrackerAPI.getMoods();
   // 进行批量处理...
   ```

---

**版本**: 1.0.0  
**最后更新**: 2025-10-04  
**项目**: MoodTracker Pro

如有问题或建议，请访问项目仓库或联系开发团队。
