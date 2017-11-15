import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { store, State } from './App.store';
import './App.css';

class App extends React.Component< {state: State} & DispatchProp<any> > {
  render() {
    // 做一个惰性的 computed 值

    // 模式1: 手动转化模式 +, == true
    // 模式2: 自动转化模式

    let state = this.props.state;
    return (
      <div className="App">
        {+state.age}
        {state.isMale == true ? '是' : '否'}
        <button onClick={store.actions.setup} >增加1</button>
        <button onClick={store.actions.change} >改变</button>
      </div>
    );
  }
}

export default connect(state => {
  return {
    state: state as State
  }
})(App);

export { store }
