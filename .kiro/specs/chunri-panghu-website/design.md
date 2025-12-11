# 设计文档

## 概述

春日胖虎互动网站是一个基于原生HTML、CSS和JavaScript的单页应用。应用通过状态管理控制三个页面视图的切换，使用CSS过渡实现流畅的淡入淡出动画效果。整体设计注重简洁性和用户体验，采用温馨的视觉风格。

## 架构

### 技术栈选择

- **HTML5**: 语义化标记，提供良好的结构
- **CSS3**: 实现淡入淡出动画、响应式布局和视觉样式
- **原生JavaScript (ES6+)**: 状态管理、事件处理和DOM操作
- **无框架设计**: 考虑到项目简单性，不引入React/Vue等框架，保持轻量

### 应用结构

```
chunri-panghu-website/
├── index.html          # 主HTML文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 应用逻辑
└── images/
    ├── 1.jpg           # 页面1图片
    ├── 2.jpg           # 对话框"不是"背景
    ├── 3.jpg           # 页面2图片
    ├── 4.jpg           # 对话框"是"背景
    └── 5.jpg           # 页面3图片
```

### 状态管理

应用使用简单的状态机模式管理页面状态：

```javascript
const AppState = {
  INITIAL: 'page1',      // 页面1
  SECOND: 'page2',       // 页面2
  FINAL: 'page3',        // 页面3
  DIALOG_ACTIVE: 'dialog' // 对话框激活
};
```

## 组件和接口

### HTML结构设计

```html
<body>
  <!-- 页面1 -->
  <div id="page1" class="page active">
    <div class="content">
      <img src="images/1.jpg" alt="春日胖虎" class="main-image">
      <p class="question">可以给春日胖虎一个笑容吗？</p>
      <div class="button-group">
        <button class="choice-btn" data-choice="medium">中份的</button>
        <button class="choice-btn" data-choice="large">大份的</button>
      </div>
    </div>
  </div>

  <!-- 页面2 -->
  <div id="page2" class="page">
    <div class="content">
      <img src="images/3.jpg" alt="春日胖虎" class="main-image">
      <p class="message">因为怠惰的胖虎只做了这么点，所以要说拜拜啦</p>
      <button class="action-btn" id="byeBtn1">拜拜</button>
    </div>
  </div>

  <!-- 页面3 -->
  <div id="page3" class="page">
    <div class="content">
      <img src="images/5.jpg" alt="春日胖虎" class="main-image">
    </div>
  </div>

  <!-- 对话框 -->
  <div id="dialog" class="dialog hidden">
    <div class="dialog-content">
      <p class="dialog-question">春日胖虎是不是最帅的？</p>
      <div class="dialog-buttons">
        <button id="yesBtn" class="dialog-btn">是</button>
        <button id="noBtn" class="dialog-btn">不是</button>
      </div>
      <button id="byeBtn2" class="dialog-btn bye-btn hidden">拜拜</button>
    </div>
  </div>
</body>
```

### CSS设计模式

#### 1. 布局系统

使用Flexbox实现居中布局：

```css
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 2. 淡入淡出动画

```css
.page {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  pointer-events: none;
}

.page.active {
  opacity: 1;
  pointer-events: auto;
}

.page.fade-out {
  opacity: 0;
}

.page.fade-in {
  opacity: 1;
}
```

#### 3. 图片样式

```css
.main-image {
  max-width: 500px;
  max-height: 500px;
  width: auto;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  object-fit: contain;
}

@media (max-width: 768px) {
  .main-image {
    max-width: 80vw;
    max-height: 60vh;
  }
}
```

#### 4. 按钮样式

```css
.choice-btn, .action-btn, .dialog-btn {
  padding: 12px 30px;
  font-size: 18px;
  border: none;
  border-radius: 25px;
  background: #ff9a9e;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
}

.choice-btn:hover, .action-btn:hover, .dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 154, 158, 0.6);
}
```

#### 5. 对话框样式

```css
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1000;
}

.dialog:not(.hidden) {
  opacity: 1;
  pointer-events: auto;
}

.dialog-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 300px;
}
```

### JavaScript模块设计

#### 1. 应用状态管理器

```javascript
class AppStateManager {
  constructor() {
    this.currentState = 'page1';
    this.dialogButtonScale = { yes: 1, no: 1 };
  }

  setState(newState) {
    this.currentState = newState;
  }

  getState() {
    return this.currentState;
  }

  updateButtonScale(button, scale) {
    this.dialogButtonScale[button] = scale;
  }

  getButtonScale(button) {
    return this.dialogButtonScale[button];
  }
}
```

#### 2. 页面切换控制器

```javascript
class PageTransitionController {
  constructor() {
    this.transitionDuration = 800; // 0.8秒
  }

  async switchPage(fromPageId, toPageId) {
    const fromPage = document.getElementById(fromPageId);
    const toPage = document.getElementById(toPageId);

    // 淡出当前页面
    fromPage.classList.remove('active');
    fromPage.classList.add('fade-out');

    // 等待淡出完成
    await this.wait(this.transitionDuration);

    // 淡入新页面
    toPage.classList.add('active', 'fade-in');
    fromPage.classList.remove('fade-out');

    return Promise.resolve();
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

#### 3. 对话框控制器

```javascript
class DialogController {
  constructor() {
    this.dialog = document.getElementById('dialog');
    this.yesBtn = document.getElementById('yesBtn');
    this.noBtn = document.getElementById('noBtn');
    this.byeBtn2 = document.getElementById('byeBtn2');
    this.noClickCount = 0;
  }

  show() {
    this.dialog.classList.remove('hidden');
  }

  hide() {
    this.dialog.classList.add('hidden');
  }

  handleNoClick() {
    this.noClickCount++;
    
    // 改变背景为2.jpg
    document.body.style.backgroundImage = 'url(images/2.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // 缩小"不是"按钮，放大"是"按钮
    const noScale = Math.max(0.3, 1 - this.noClickCount * 0.25);
    const yesScale = 1 + this.noClickCount * 0.25;

    this.noBtn.style.transform = `scale(${noScale})`;
    this.yesBtn.style.transform = `scale(${yesScale})`;
  }

  handleYesClick() {
    // 改变背景为4.jpg
    document.body.style.backgroundImage = 'url(images/4.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // 隐藏是/不是按钮，显示拜拜按钮
    this.yesBtn.classList.add('hidden');
    this.noBtn.classList.add('hidden');
    this.byeBtn2.classList.remove('hidden');
  }

  closeWindow() {
    window.close();
    // 如果window.close()不起作用（某些浏览器限制），显示提示
    setTimeout(() => {
      alert('请手动关闭此窗口');
    }, 100);
  }
}
```

#### 4. 主应用控制器

```javascript
class App {
  constructor() {
    this.stateManager = new AppStateManager();
    this.pageController = new PageTransitionController();
    this.dialogController = new DialogController();
    this.init();
  }

  init() {
    this.bindEvents();
    this.showInitialPage();
  }

  bindEvents() {
    // 页面1：中份的/大份的按钮
    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleChoiceClick());
    });

    // 页面2：拜拜按钮
    document.getElementById('byeBtn1').addEventListener('click', () => {
      this.handleByeBtn1Click();
    });

    // 对话框：是/不是按钮
    this.dialogController.yesBtn.addEventListener('click', () => {
      this.dialogController.handleYesClick();
    });

    this.dialogController.noBtn.addEventListener('click', () => {
      this.dialogController.handleNoClick();
    });

    // 对话框：拜拜按钮
    this.dialogController.byeBtn2.addEventListener('click', () => {
      this.dialogController.closeWindow();
    });
  }

  showInitialPage() {
    document.getElementById('page1').classList.add('active');
  }

  async handleChoiceClick() {
    await this.pageController.switchPage('page1', 'page2');
    this.stateManager.setState('page2');
  }

  async handleByeBtn1Click() {
    await this.pageController.switchPage('page2', 'page3');
    this.stateManager.setState('page3');
    
    // 页面3显示后，弹出对话框
    setTimeout(() => {
      this.dialogController.show();
    }, 500);
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
```

## 数据模型

由于应用不涉及数据持久化或复杂数据结构，数据模型非常简单：

```javascript
// 应用状态
const state = {
  currentPage: 'page1',           // 当前页面
  dialogVisible: false,           // 对话框是否可见
  noButtonScale: 1.0,            // "不是"按钮缩放比例
  yesButtonScale: 1.0,           // "是"按钮缩放比例
  dialogBackground: null         // 对话框背景图片
};

// 图片资源映射
const images = {
  page1: 'images/1.jpg',
  page2: 'images/3.jpg',
  page3: 'images/5.jpg',
  dialogNo: 'images/2.jpg',
  dialogYes: 'images/4.jpg'
};
```

## 错误处理

### 图片加载失败

```javascript
function preloadImages() {
  const imageUrls = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg'
  ];

  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url;
    });
  });

  Promise.all(promises)
    .then(() => {
      console.log('所有图片加载成功');
    })
    .catch(failedUrl => {
      console.error(`图片加载失败: ${failedUrl}`);
      alert('部分图片加载失败，请刷新页面重试');
    });
}
```

### 浏览器兼容性

```javascript
// 检查浏览器是否支持必要的特性
function checkBrowserSupport() {
  const features = {
    flexbox: CSS.supports('display', 'flex'),
    transitions: CSS.supports('transition', 'opacity 1s'),
    es6: typeof Promise !== 'undefined'
  };

  const unsupported = Object.keys(features).filter(key => !features[key]);

  if (unsupported.length > 0) {
    console.warn('浏览器不支持以下特性:', unsupported);
    // 可以显示降级提示
  }
}
```

## 测试策略

### 1. 手动测试清单

**页面流程测试：**
- [ ] 页面1正确显示1.jpg和两个按钮
- [ ] 点击"中份的"按钮切换到页面2
- [ ] 点击"大份的"按钮切换到页面2
- [ ] 页面2正确显示3.jpg和拜拜按钮
- [ ] 点击页面2的拜拜按钮切换到页面3
- [ ] 页面3正确显示5.jpg并弹出对话框

**对话框交互测试：**
- [ ] 对话框正确显示问题和两个按钮
- [ ] 点击"不是"按钮，背景变为2.jpg
- [ ] 点击"不是"按钮，"不是"按钮缩小，"是"按钮放大
- [ ] 多次点击"不是"按钮，按钮持续变化
- [ ] 点击"是"按钮，背景变为4.jpg
- [ ] 点击"是"按钮后，显示拜拜按钮
- [ ] 点击拜拜按钮，窗口关闭

**动画效果测试：**
- [ ] 页面切换使用淡入淡出效果
- [ ] 动画流畅，无卡顿
- [ ] 按钮缩放动画平滑

**响应式测试：**
- [ ] 在桌面浏览器正常显示
- [ ] 在移动设备正常显示
- [ ] 图片在不同屏幕尺寸下居中且大小合适

### 2. 浏览器兼容性测试

测试浏览器：
- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端Safari (iOS)
- 移动端Chrome (Android)

### 3. 性能测试

- 页面加载时间 < 2秒
- 动画帧率 > 30fps
- 图片优化（文件大小合理）

## 设计决策和理由

### 1. 为什么选择原生JavaScript而不是框架？

**理由：**
- 项目功能简单，不需要复杂的状态管理
- 避免引入额外的依赖和构建工具
- 更快的加载速度和更小的文件体积
- 更容易部署（只需静态文件服务器）

### 2. 为什么使用CSS过渡而不是JavaScript动画？

**理由：**
- CSS过渡由浏览器优化，性能更好
- 代码更简洁，易于维护
- 声明式语法更直观
- 硬件加速支持更好

### 3. 为什么使用Flexbox布局？

**理由：**
- 简单高效的居中方案
- 良好的浏览器支持
- 响应式友好
- 代码量少

### 4. 背景色选择

**选择：** 使用温暖的渐变色（桃粉色到橙色）

**理由：**
- 营造温馨、友好的氛围
- 与"春日胖虎"的主题相符
- 柔和的色彩不会抢夺图片焦点
- 渐变增加视觉层次感

### 5. 图片尺寸设计

**选择：** 最大宽度500px，最大高度500px，移动端80vw/60vh

**理由：**
- 在桌面端提供清晰的视觉效果
- 在移动端自适应屏幕大小
- 保持图片宽高比，避免变形
- 为文字和按钮留出足够空间

## 可访问性考虑

1. **语义化HTML**: 使用适当的HTML标签
2. **键盘导航**: 所有按钮可通过Tab键访问
3. **Alt文本**: 为所有图片提供描述性alt属性
4. **对比度**: 确保文字和背景有足够的对比度
5. **字体大小**: 使用不小于16px的字体，确保可读性

## 部署方案

### 静态文件托管

应用可以部署到任何静态文件托管服务：

1. **GitHub Pages**: 免费，适合个人项目
2. **Netlify**: 免费，支持自动部署
3. **Vercel**: 免费，性能优秀
4. **传统Web服务器**: Apache/Nginx

### 部署步骤

1. 将所有文件上传到托管服务
2. 确保images文件夹包含所有5张图片
3. 访问index.html即可使用

### 文件结构检查

部署前确认：
```
✓ index.html
✓ css/style.css
✓ js/app.js
✓ images/1.jpg
✓ images/2.jpg
✓ images/3.jpg
✓ images/4.jpg
✓ images/5.jpg
```
