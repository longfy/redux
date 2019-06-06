// 1. 全局渲染方法
const renderApp = (newState, oldState = {}) => {
  if (newState === oldState) return;
  console.log('renderApp...');
  // 渲染屏幕
  renderScreen(newState.screen, oldState.screen);
  // 渲染按钮
  renderButton(newState.button, oldState.button);
}

const renderScreen = (newScreen, oldScreen) => {
  if(newScreen === oldScreen) return;
  console.log('renderScreen...');
  // 获取页面元素
  const screenEl = document.querySelector('#screen');
  // 对页面元素进行渲染
  screenEl.innerHTML = newScreen.title;
}

const renderButton = (newButton, oldButton) => {
  if(newButton === oldButton) return;
  console.log('renderButton...');
  // 获取页面元素
  const buttonEl = document.querySelector('#button');
  // 对页面元素进行渲染
  buttonEl.innerHTML = newButton.text;
  buttonEl.className = newButton.className;
}

// 2. 对状态的修改，交给纯函数
const changeState = (state, action) => {
  // 对操作类型进行判断
  switch (action.type) {
    case 'PLAY':
      return {
        isPlaying: true,
          button: {
            className: 'stop',
            text: '停止'
          },
          screen: {
            title: action.title
          }
      }
    case 'NEXT':
      return {
        ...state,
        screen: {
          title: action.title
        }
      }
    case 'STOP':
      return {
        isPlaying: false,
          button: {
            className: 'play',
            text: '播放'
          },
          screen: {
            title: action.title
          }
      }
    default: 
      return state;
  }
}

// 3. 定义一个 createStore 的函数，来管理全局状态数据
const createStore = (reducer) => {
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
  const getState = () => state;
  // 提供一个 dispatch 方法，用来修改数据
  const dispatch = (action) => {
    // 修改状态
    state = reducer(state, action);
    // 调用所有监听
    listeners.forEach(listener => listener());
  };

  // 提供一个“订阅”方法，对特定状态修改进行响应
  const subscribe = (listener) => {
    listeners.push(listener);
  }

  return {
    getState,
    dispatch,
    subscribe
  };
}

// 4. 使用createStore函数来创建数据的管理对象
const store = createStore(changeState);

// 声明一个老状态
let oldState = store.getState();

// 当状态发生修改时，执行重新渲染函数
store.subscribe(() => {
  // 获取最新状态
  const newState = store.getState();
  // 重新渲染的逻辑
  renderApp(newState, oldState);
  // 更新老状态
  oldState = newState;
});

// 5. 全局初始化
renderApp(store.getState());

// 6. 对按钮进行监听，修改状态
document.querySelector('#button').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  // 判断播放状态
  if (!store.getState().isPlaying) {
    store.dispatch({
      type: 'PLAY',
      title: '精彩继续...'
    });
    setTimeout(() => {
      console.log('测试...');
      store.dispatch({
        type: 'NEXT',
        title: '下一个精彩...'
      });
    }, 2000);
  } else {
    store.dispatch({
      type: 'STOP',
      title: '源码TV'
    });
  }
})
