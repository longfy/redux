/**
 * 通过createStore函数管理状态
 * 存在问题：
 *    1、在createStore函数中，dispatch函数的操作代码写死在内部，不利于扩展
 * 解决办法：把dispatch函数的执行方法抽离出去，在创建store时动态传入
 */
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

// 3. 定义一个 createStore 的函数，来管理全局状态数据
const createStore = () => {
  // 初始化数据
  let state = {
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
  // 获取数据
  const getStore = () => state;
  //提供一个 dispatch 方法，用来修改数据
  const dispatch = (action) => {
    // 对操作类型进行判断
    switch (action.type) {
      case 'PLAY':
        // 修改播放状态
        state.isPlaying = true;
        // 修改按钮
        state.button = {
          className: 'stop',
          text: '停止'
        }
        break;
      case 'STOP':
        // 修改播放状态
        state.isPlaying = false;
        // 修改按钮
        state.button = {
          className: 'play',
          text: '播放'
        }
        break;
    }
  }
  return { getStore, dispatch }
}

// 4. 使用createStore函数来创建数据的管理对象
const store = createStore();

// 5. 全局初始化
renderApp(store.getStore());

// 4. 对按钮进行监听，修改状态
document.querySelector('#button').addEventListener('click', (e) =>{
  if(e.target.tagName !== 'BUTTON') return;
  // 判断播放状态
  if(!store.getStore().isPlaying) {
    store.dispatch({type: 'PLAY'});
  } else {
    store.dispatch({type: 'STOP'});
  }
  renderApp(store.getStore());
})

