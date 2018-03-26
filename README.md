
# Pastate ：响应式 react state 管理框架  

## 简介
Pastate 是一个响应式 react state 管理框架，实现了对 state 的异步响应式管理。Pastate 是一个精益框架，它对很多高级概念进行了友好封装，这意味着你**不必学习**一些难以理解的概念，就可以在一个简单的应用中便捷地使用 pastate。在应用变得逐渐复杂的过程中，你只要逐渐学习并使用 pastate 中更多的功能，以满日益复杂的系统开发需求。同时，pastate 也是一个向后兼容的渐进式框架，你可以在现有的 react 或 redux 项目中，把一部分组件改用 pastate 来实现，再逐渐拓展到整个项目。 

Pastate 主页: https://pastate.js.org
Pastate GitHub: https://github.com/BirdLeeSCUT/pastate  

简单例子：
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
你可以直接对 state 节点进行赋值，pastate 的响应式引擎会异步为你更新视图！这种模式比原生 react 的 setState 方法或原生 redux 的 reducer 模式方便灵活很多！

## 特性
- **便捷易用**：pastate 对高级概念进行了封装，只要有 react 基础知识即可轻松上手
- **响应式 state**: 可以直接用 js 原生模式更新 state 的值，pastate 会响应式地为你更新相关视图
- **类型提示**：pastate 具有完善的类型定义文件，可借助 intelliSense 极大地提高开发效率
- **按需渲染**：pastate 实现了 state 节点按需溯源更新引用机制，视图可以高效响应 state 的变化
- **异步更新机制**：当你对 state 进行连续的修改时，pastate 会高效地为你只做一次异步视图更新
- **友好的学习曲线**：pastate 封装了 flux 模式的高级概念，只需在感兴趣时去了解这些概念 
- **兼容 redux 项目**：你可以把 pastate 轻松整合到 redux 项目中，把部分容器实现为 pastate 模式
- **支持 TypeScript**：pastate 本身使用 TpyeScript 进行开发，有完善的类型定义和泛型支持
- **MIT 协议授权** ： 你可以免费地在个人或商业项目中使用，并按需修改或扩展

## 原理简介
Pastate 名字源自 Path State 的简写，pastate 在 state 的每个节点上增加节点的位置(path)信息和 store 归属信息，从而实现对象或数组节点的按需递归引用更新，实现 immutable state 特性，因此 pastate 可以管理复杂的 state 树并实现高效的异步按需渲染。同时 pastate 基于 ES5 的 Object.assign 实现了 state 的全节点响应式操作支持，你只需像修改普通变量一样修改 state 即可, 如 `state.userinfo.name = 'myName'`, 这时 pastate 的响应式引擎会为自动为你异步高效更新相关视图，详细原理请查看[原理章节](https://pastate.js.org/docs/8.原理与API文档.html)：

![pastate 原理图](https://upload-images.jianshu.io/upload_images/1234637-ed283d2d6dbd5ed3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 灵感来源
Pastate 受启发于 [redux](https://redux.js.org/) 的 immutable state 管理模式和 [vue.js](https://vuejs.org/) 的响应式 state 设计模式；同时融入的精益([lean](https://en.wikipedia.org/wiki/Lean_product_development))设计思想。

## 可靠性
Pastate 已经通过 160+ 个测试用例的全面测试，稳定可靠。测试用例的具体内容可查看项目源码中的 `src/pastate/tests` 目录。

## 欢迎反馈
如果发现 pastate 的 bug 或有任何建议，欢迎提交 [issue](https://github.com/BirdLeeSCUT/pastate/issues)，感谢大家的反馈。如果你喜欢 pastate, 希望能给个宝贵的 star `^_^`：[pastate github](https://github.com/BirdLeeSCUT/pastate) 。

----

## Pastate 文档

1. [快速上手](docs/1.快速上手.md)
    - [test](1.快速上手.md)
    - xxxx
2. xxx
    - ppp
    - ppp

## 贡献
非常欢迎大家加入 pastate 的开发，pastate 具体的开发说明请看文档的“相关资源”章节。