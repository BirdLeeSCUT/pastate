## Pastate 简介
Pastate 是一个响应式的 react state 管理框架，实现了对 state 的异步响应式管理。Pastate 是一个精益 (lean) 框架，它对很多高级概念进行了友好封装，这意味着你**不必学习**很一些难以理解的概念，就可以在一个简单的应用中便捷地使用 pastate。当应用变得逐渐变得复杂的过程中，你只要逐渐学习并使用 pastate 中被封装的概念或规范，以满逐渐变得复杂的系统开发需求。同时，pastate 也是一个向后兼容的渐进式框架，你可以把现有的 react 或 redux 项目的一部分组件改用 pastate 的状态管理方案，再慢慢地拓展到整个项目。 

项目 GitHub: [Pastate github](https://github.com/BirdLeeSCUT/pastate)  
项目 npm: [Pastate npm](https://www.npmjs.com/package/pastate) 

使用 pastate 只需要基础的 react 知识, 你不需要会 flux / redux 就可以用上 flux / redux!

简单例子：pastate 实现对 state 的响应式操作：    
```javascript
const state = store.state

class AppView extends Component {
    increaseAge(){
        state.myInfo.age += 1
    }
    changeName(newName){
        state.myInfo.name = newName
    }
    render() {
        ...
    }
}
```
这种直接对 state 节点进行响应式赋值的模式比 react 原生的 setState 函数方便灵活了很多！

## 特性
- **便捷易用**：pastate 对高级概念进行了封装，只要有 react 基础知识即可轻松上手
- **响应式 state**: 可以直接用 js 原生模式更新 state 的值，pastate 会响应式地为你更新相关视图
- **类型提示**：pastate 具有完善的类型定义文件，可借助 intelliSense 提示极大地提高开发效率
- **按需渲染**：pastate 实现了精确的 state 节点应用更新机制，可以在复杂的页面里高效响应 state 的变化
- **异步更新机制**：当你对 state 进行连续的复杂修改时，pastate 会高效地为你只做一次异步视图更新
- **兼容原生 redux 项目**：你可以把 pastate 轻松整合到现有的 redux 项目中，把部分 Container 实现为 pastate 模式
- **友好的学习曲线**：pastate 封装了 redux 很多高级概念，只需要在需要的时候去学习并使用它 
- **支持 TypeScript**：pastate 本身使用 TpyeScript 进行开发，有完善的类型定义和泛型支持
- **MIT 协议授权** – 你可以尽情免费地在个人或商业项目中使用，并按需扩展

## 可靠性
Pastate 已经通过 160+ 个测试用例的全面测试，稳定可靠。测试用例的具体内容可查看项目中的 `xxx.test.js` 文件。

## Pastate 原理
Pastate 是 Path State 的简写，pastate 在 state 的每个节点上增加节点的位置(path)信息，从而来方便地控制节点对象或数组的引用更新，实现 react 推荐的 immutable state 特性，使得 pastate 可以管理复杂的 state 树，并实现的高效的异步按需渲染逻辑。同时 pastate 基于 ES5 的 Object.assign 实现了 state 的全节点响应式操作支持，你只需像修改普通变量一样修改 state 即可, 如 `state.userinfo.name = 'myName'`, 这时 pastate 的响应式引擎会为自动为你高效更新相关视图！

## 灵感来源
Pastate 内部基于 react + redux 实现，受启发于 Immutable.js 的 immutable state 管理模式， Vue.js 的响应式 state 设计模式； 同时受《精益创业》(The Lean Startup) 精益思想的熏染。

## 欢迎反馈
如果发现 pastate 的 bug 或有好建议，欢迎在 [issue]() 中提出，感谢大家的反馈。如果你喜欢 pastate, 希望能给个宝贵的 star `^_^`：[Pastate github](https://github.com/BirdLeeSCUT/pastate) 。

## Pastate 文档

1. [快速上手](xxx.md)
    - [test](./1. 快速上手.md#get-started)
    - xxxx
2. xxx
    - ppp
    - ppp

## 贡献
非常欢迎大家加入 pastate 的开发，pastate 具体的开发说明请看文档的“相关资源”章节。