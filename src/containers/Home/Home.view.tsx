import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { store, State } from './Home.store';
import './Home.style.css';

class App extends React.Component<{ state: State } & DispatchProp<any>> {
  render() {
    let state = this.props.state;
    return (
      <div className="Home">
        Home 
        {state.name}
      </div>
    );
  }
}
// 尝试进行语法糖包装
// makeContainer(App, 'home') 一般情况用次即可
// 依赖多个 state 的情况可用这种形式
// makeContainer(App,{
//   state: 'home',
//   info: 'info',
//   data: 'me.data'
// })
// 或接近 redux 原生
// makeContainer(App, (state: any) => ({
//   state: state.home
// }))
export default connect((state: any) => ({
    state: state.home
}))(App);