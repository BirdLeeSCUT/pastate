import * as React from 'react';
import { DispatchProp } from 'react-redux';
import { store, State } from './App.store';
import './App.style.css';
import { makeContainer, Input, Radiobox } from '../../pastate';


const options1 = ["o1", "o2", "o3"]
const options2 = [
  {value: "o1", disabled: false},
  {value: "o2", disabled: true},
  {value: "o3", disabled: false}
]

class App extends React.Component<{ state: State } & DispatchProp<any>> {

  handleBeforeTextChange(newValue: string, oldValue: string): string {
    return newValue;
  }

  handleAfterTextChange(newValue: string) {
    console.log(newValue)
  }

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
          <button onClick={actions.addPetBefore} >在前增加宠物</button>
          <button onClick={actions.popPet} >减少宠物</button>
          <button onClick={actions.addFirstAge} >增加1岁</button>
        </div>
        <button onClick={actions.doFourActions}>批量任务</button>
        <button onClick={actions.longName}>名字加长</button>
        
        <Input 
          value={state.name}
          type="password"
          beforeChange={this.handleBeforeTextChange}
          afterChange={this.handleAfterTextChange}
          disabled={false}
          useComposedValue={false}
          className="class-test"
          id="id-test"
        />

        <Radiobox 
          options={options2}
          selected={state.name}
          radioClassName="my-radio"
          tagClassName="my-radio-tag"
          disabledTagClassName="my-radio-tag-disabled"
        />
        
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

export default makeContainer(App, 'app')
