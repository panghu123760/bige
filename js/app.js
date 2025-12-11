// 应用状态管理器
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

// 页面切换控制器
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

    // 完全隐藏旧页面
    fromPage.style.display = 'none';

    // 显示并淡入新页面
    toPage.style.display = 'flex';
    setTimeout(() => {
      toPage.classList.add('active', 'fade-in');
    }, 50);
    
    fromPage.classList.remove('fade-out');

    return Promise.resolve();
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 页面3控制器
class Page3Controller {
  constructor() {
    this.yesBtn = document.getElementById('yesBtn');
    this.noBtn = document.getElementById('noBtn');
    this.page3Question = document.getElementById('page3Question');
    this.page3Buttons = document.getElementById('page3Buttons');
    this.page3Image = document.querySelector('#page3 .main-image');
    this.noClickCount = 0;
    this.imageFadeDuration = 600; // 0.6秒
  }

  show() {
    // 延迟显示问题和按钮
    setTimeout(() => {
      this.page3Question.classList.add('show');
      this.page3Buttons.classList.add('show');
    }, 500);
  }

  async changeImageWithFade(newImageSrc) {
    // 淡出当前图片
    this.page3Image.classList.add('fade-out-image');
    
    // 等待淡出完成
    await this.wait(this.imageFadeDuration);
    
    // 更换图片
    this.page3Image.src = newImageSrc;
    
    // 淡入新图片
    this.page3Image.classList.remove('fade-out-image');
    this.page3Image.classList.add('fade-in-image');
    
    // 清理class
    setTimeout(() => {
      this.page3Image.classList.remove('fade-in-image');
    }, this.imageFadeDuration);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async handleNoClick() {
    this.noClickCount++;
    
    // 只有当前图片不是2.jpg时才切换图片
    const currentSrc = this.page3Image.src;
    if (!currentSrc.includes('2.jpg')) {
      // 改变页面3的图片为2.jpg，带淡入淡出动画
      await this.changeImageWithFade('images/2.jpg');
    }

    // 缩小"不是"按钮，放大"是"按钮
    const noScale = Math.max(0.3, 1 - this.noClickCount * 0.25);
    const yesScale = 1 + this.noClickCount * 0.25;

    this.noBtn.style.transform = `scale(${noScale})`;
    this.yesBtn.style.transform = `scale(${yesScale})`;
  }

  async handleYesClick() {
    // 改变页面3的图片为4.jpg，带淡入淡出动画
    await this.changeImageWithFade('images/4.jpg');

    // 隐藏问题和按钮
    this.page3Question.classList.add('hidden');
    this.page3Buttons.classList.add('hidden');
    
    // 显示开心的文字
    const happyMessage = document.getElementById('happyMessage');
    happyMessage.classList.remove('hidden');
  }
}

// 主应用控制器
class App {
  constructor() {
    this.stateManager = new AppStateManager();
    this.pageController = new PageTransitionController();
    this.page3Controller = new Page3Controller();
    this.init();
  }

  init() {
    this.preloadImages();
    this.bindEvents();
    this.showInitialPage();
  }

  bindEvents() {
    // 页面1：中份的/大份的按钮
    document.querySelectorAll('#page1 .choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleChoiceClick());
    });

    // 页面2：拜拜按钮
    document.getElementById('byeBtn1').addEventListener('click', () => {
      this.handleByeBtn1Click();
    });

    // 页面3：是/不是按钮
    this.page3Controller.yesBtn.addEventListener('click', () => {
      this.page3Controller.handleYesClick();
    });

    this.page3Controller.noBtn.addEventListener('click', () => {
      this.page3Controller.handleNoClick();
    });
  }

  showInitialPage() {
    const page0 = document.getElementById('page0');
    page0.classList.add('active');
    
    // 开始震动效果
    this.startShakeAnimation();
  }

  async startShakeAnimation() {
    const page0 = document.getElementById('page0');
    
    // 震动三次
    for (let i = 0; i < 3; i++) {
      page0.classList.add('shake');
      await this.wait(500); // 每次震动0.5秒
      page0.classList.remove('shake');
      
      if (i < 2) {
        await this.wait(200); // 震动之间间隔0.2秒
      }
    }
    
    // 震动完成后，等待0.5秒，然后切换到页面1
    await this.wait(500);
    await this.pageController.switchPage('page0', 'page1');
    this.stateManager.setState('page1');
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async handleChoiceClick() {
    await this.pageController.switchPage('page1', 'page2');
    this.stateManager.setState('page2');
  }

  async handleByeBtn1Click() {
    await this.pageController.switchPage('page2', 'page3');
    this.stateManager.setState('page3');
    
    // 页面3显示后，显示问题和按钮
    this.page3Controller.show();
  }

  // 图片预加载
  preloadImages() {
    const imageUrls = [
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/4.jpg',
      'images/5.jpg',
      'images/6.jpg'
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
        console.warn('部分图片可能无法显示，请确保images文件夹中包含所有图片');
      });
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
