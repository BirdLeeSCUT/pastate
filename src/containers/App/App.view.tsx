import * as React from 'react';
import { DispatchProp } from 'react-redux';
import { store, State } from './App.store';
import './App.style.css';
import { makeContainer, Input, RadioGroup, Checkbox, Select } from '../../pastate';


const options1 = ["o1", "o2", "o3"]
const options2 = [
  { value: "o1", tag: 'o1 tag', disabled: false },
  { value: "o2", tag: 'o2 tag' },
  { value: "o3", tag: 'o3 tag' }
]

const options3 = [
  { value: "DEFAULT", tag: '请选择', disabled: true },
  { value: "o1", tag: 'o1 tag'},
  { value: "o2", tag: 'o2 tag'},
  { value: "o3", tag: 'o3 tag'}
]

class App extends React.Component<{ state: State } & DispatchProp<any>> {

  handleTextBeforeChange(newValue: string, oldValue: string): string {
    return newValue;
  }

  handleTextAfterChange(newValue: string) {
    console.log('handleTextAfterChange', newValue)
  }

  handleCheckboxAfterChange(newValue: boolean) {
    console.log('handleCheckboxAfterChange', newValue);
  }

  handleRadioboxAfterChange(newValue: string) {
    console.log('handleRadioboxAfterChange', newValue);
  }

  handleSelectboxAfterChange(newValue: string) {
    console.log('handleSelectboxAfterChange', newValue);
  }

  render() {
    let state = this.props.state;
    let actions = store.actions;

    return (
      <div className="App">
        <div>名字：{state.name} </div>
        <div>年龄：{+state.age} <button onClick={actions.setup} >增加</button> </div>
        <div>性别：{state.isMale == true ? '男' : '女'} <button onClick={actions.change} >改变</button></div>

        <div>
          宠物:
          <br />
          {state.pets.map((pet, index) => (
            <Pet pet={pet} key={index} />
          ))}
          <br />
          <button onClick={actions.addPet} >增加宠物</button>
          <button onClick={actions.addPetBefore} >在前增加宠物</button>
          <button onClick={actions.popPet} >减少宠物</button>
        </div>
        <button onClick={actions.longName}>名字加长</button>

        <Input
          value={state.name}
          type="text"
          beforeChange={this.handleTextBeforeChange}
          afterChange={this.handleTextAfterChange}
          disabled={false}
          useComposedValue={false}
          className="class-input"
          id="id-input"
        />

        性别男：
        <Checkbox
          checked={state.isMale}
          disabled={false}
          afterChange={this.handleCheckboxAfterChange}
          className="class-checked"
          id="id-checked"
        />

        <RadioGroup
          options={options2}
          selected={state.name}
          disabled={false}
          className="class-radiobox"
          id="id-radiobox"
          radioClassName="my-radio"
          tagClassName="my-radio-tag"
          disabledTagClassName="my-radio-tag-disabled"
          vertical={false}
          afterChange={this.handleRadioboxAfterChange}
        />

        <Select
          options={options3}
          selected={state.name}
          className="class-select"
          id="id-select"
          disabled={false}
          afterChange={this.handleSelectboxAfterChange}
        />

      </div>
    );
  }
}

class Pet extends React.PureComponent<{ pet: State['pets'][0] }>{

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
