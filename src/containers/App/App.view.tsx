import * as React from 'react';
import { DispatchProp } from 'react-redux';
import { store, State } from './App.store';
import './App.style.css';
import { makeContainer, Input, RadioGroup, Checkbox, Select, Bind, makeBindable } from '../../pastate';
import { Rate, Checkbox as AntdCheckbox } from 'antd';

// 类型传递？
let MyRate = makeBindable(Rate)
let MyAntdCheckbox = makeBindable(AntdCheckbox, 'checked')

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

const option_number = [2, 4, 6]
const option_number_object = [{
  value: 2,
  tag: '2岁'
}, {
  value: 4,
  tag: '4岁'
}, {
  value: 6,
  tag: '6岁'
}]

const option_boolean = [true, false]

const option_boolean_object = [{
  value: true,
  tag: '男'
}, {
  value: false,
  tag: '女'
}]

class App extends React.PureComponent<{ state: State } & DispatchProp<any>> {

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
        <div>名字：{state.basicInfo.name} </div>
        <div>年龄：{state.basicInfo.age} <button onClick={actions.setup} >增加</button> </div>
        <div>性别：{state.basicInfo.isMale == true ? '男' : '女'} <button onClick={actions.change} >改变</button></div>

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
          <button onClick={actions.doFourActions} >批量任务</button>
        </div>
        <button onClick={actions.mutations.longName}>名字加长</button>

        <Input
          value={state.basicInfo.name}
          type="text"
          beforeChange={this.handleTextBeforeChange}
          afterChange={this.handleTextAfterChange}
          disabled={false}
          useComposedValue={false}
          className="class-input"
          id="id-input"
        />

        <Bind value={state.basicInfo.age}>
          <Rate count={10}/>
        </Bind>

        <MyRate value={state.basicInfo.age} count={10}/>

        <MyAntdCheckbox value={state.basicInfo.isMale} />

        性别男：
        <Checkbox
          value={state.basicInfo.isMale}
          disabled={false}
          afterChange={this.handleCheckboxAfterChange}
          className="class-checked"
          id="id-checked"
        />

        <RadioGroup
          options={option_boolean_object}
          value={state.basicInfo.isMale}
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
          options={option_boolean_object}
          value={state.basicInfo.isMale}
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
