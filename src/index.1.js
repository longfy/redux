/**
 * 直接修改全局状态
 * 存在问题：
 *    1、模块（组件）间需要共享的数据是直接暴露在全局的
 *    2、全局的状态依旧可以直接修改，会导致不可预料的结果
 * 解决办法：通过createStore函数管理状态
 */

// 1. 声明一个全局状态
let appState = {
  // 播放状态
  isPlaying: false,
  // 屏幕内容
  screen: {
    title: '源码TV'
  },
  // 操作按钮
  button: {
    className: 'play',
    text: '播放'
  }
}

// 2. 全局渲染方法
const renderApp = (state) => {
  // 渲染屏幕
  renderScreen(state.screen);
  // 渲染按钮
  renderButton(state.button);
}

const renderScreen = (screen) => {
  // 获取页面元素
  const screenEl = document.querySelector('#screen');
  // 对页面元素进行渲染
  screenEl.innerHTML = screen.title;
}

const renderButton = (button) => {
  // 获取页面元素
  const buttonEl = document.querySelector('#button');
  // 对页面元素进行渲染
  buttonEl.innerHTML = button.text;
  buttonEl.className = button.className;
}

// 3. 全局初始化
renderApp(appState);

// 4. 对按钮进行监听，修改状态
document.querySelector('#button').addEventListener('click', (e) =>{
  if(e.target.tagName !== 'BUTTON') return;
  // 判断播放状态
  if(!appState.isPlaying) {
    // 修改播放状态
    appState.isPlaying = true;
    // 修改按钮
    appState.button = {
      className: 'stop',
      text: '停止'
    }
  } else {
    // 修改播放状态
    appState.isPlaying = false;
    // 修改按钮
    appState.button = {
      className: 'play',
      text: '播放'
    }
  }
  renderApp(appState);
})

