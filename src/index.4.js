/**
 * 使用订阅函数，再状态修改完成后自动重新渲染
 * 存在问题：
 *    1、每次修改状态都会触发批量更新，有一部分无用功，严重的性能问题
 * 解决办法：在每次渲染前，对渲染的内容做一次判断，区分新老状态的差别，对渲染进行细粒度控制
 */
// 1. 全局渲染方法
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

// 2. 对状态的修改，交给纯函数
const changeState = (state, action) => {
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
      // 修改屏幕文字
      state.screen.title = action.title;
      break;
    case 'NEXT':
      // 修改屏幕文字
      state.screen.title = action.title;
      break;
    case 'STOP':
      // 修改播放状态
      state.isPlaying = false;
      // 修改按钮
      state.button = {
        className: 'play',
        text: '播放'
      }
      // 修改屏幕文字
      state.screen.title = action.title;
      break;
  }
}

// 3. 定义一个 createStore 的函数，来管理全局状态数据
const createStore = (changeState) => {
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

  // 声明一个监听数组
  let listeners = [];

  // 获取数据
  const getStore = () => state;
  // 提供一个 dispatch 方法，用来修改数据
  const dispatch = (action) => {
    // 修改状态
    changeState(state, action);
    // 调用所有监听
    listeners.forEach(listener => listener());
  };

  // 提供一个“订阅”方法，对特定状态修改进行响应
  const subscribe = (listener) => {
    listeners.push(listener);
  }

  return { getStore, dispatch, subscribe };
}

// 4. 使用createStore函数来创建数据的管理对象
const store = createStore(changeState);

// 当状态发生修改时，执行重新渲染函数
store.subscribe(()=>{
  // 重新渲染的逻辑
  renderApp(store.getStore());
});

// 5. 全局初始化
renderApp(store.getStore());

// 6. 对按钮进行监听，修改状态
document.querySelector('#button').addEventListener('click', (e) =>{
  if(e.target.tagName !== 'BUTTON') return;
  // 判断播放状态
  if(!store.getStore().isPlaying) {
    store.dispatch({type: 'PLAY', title: '精彩继续...'});
    setTimeout(()=>{
      store.dispatch({type: 'NEXT', title: '下一个精彩...'});
    }, 2000);
  } else {
    store.dispatch({type: 'STOP', title: '源码TV'});
  }
})

