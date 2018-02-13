import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { store, State } from './App.store';
import { Link } from 'react-router-dom';
import './App.style.css';
import Input from '../../services/redux-xstore/HOC/Input';


class App extends React.Component<{ state: State } & DispatchProp<any>> {
  render() {
    let state = this.props.state;
    let actions = store.actions;

    return (
      <div className="App">
        <div>数字：{+state.age} <button onClick={actions.setup} >增加</button> </div>
        <div>布尔值：{state.isMale == true ? '是' : '否'} <button onClick={actions.change} >改变</button></div>
        <div>字符串：{state.name} </div>
        <div>
          数组:
          <br />
          {state.pets.map((pet, index) => (
            <Pet pet={pet} key={index}/>
          ))}
          <br />
          <button onClick={actions.addPet} >增加宠物</button>
          <button onClick={actions.addFirstAge} >增加1岁</button>
        </div>
        <div><Link to="/home">go to home</Link></div>
        <button onClick={actions.doFourActions}>批量任务</button>
        <button onClick={actions.longName}>名字加长</button>
        
        <Input value={state.name} store={store} />

        <input type="text" value={state.pets[0].name} onChange={store.syncInput(state.pets[0].name)}/>
        
      </div>
    );
  }
}

class Pet extends React.PureComponent<{pet: State['pets'][0]}>{

  render() {
    let pet = this.props.pet;
    return (
      <span className="pet">
        名字: {pet.name}
        年龄: {+pet.age}
        狗: {pet.isDog == true ? '是' : '否'}
      </span>
    )
  }
}

export default connect((state: any) => ({
    state: state.app
}))(App);
