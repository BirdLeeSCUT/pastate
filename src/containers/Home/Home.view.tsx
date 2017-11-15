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

export default connect(state => ({
    state: state.home
}))(App);