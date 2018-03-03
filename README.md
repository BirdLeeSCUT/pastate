
# Pastate ：响应式 react state 框架  

## Pastate 是什么
Pastate 是一个响应式的 react state 管理框架，实现了对 state 的异步响应式管理。Pastate 是一个精益 (lean) 框架，它对很多高级概念进行了友好封装，这意味着你**不必学习**很一堆难以理解的概念，就可以在一个简单的应用中便捷地使用 pastate。当应用变得逐渐变得复杂的过程中，你只要逐渐学习并使用 pastate 中被封装的概念或规范，以满逐渐变得复杂的系统开发需求。同时，pastate 也是一个向后兼容的渐进式框架，你可以把现有的 react 或 redux 项目的一部分组件改用 pastate 的状态管理方案，再慢慢地拓展到整个项目。 

项目 GitHub: [Pastate github](TODO)  
项目 npm: [Pastate npm](https://www.npmjs.com/package/pastate) 

使用 pastate 只需要基础的 react 知识! 如果你没有接触过 redux 或 vue, 可以直接跳过下面的介绍，直接从 **1.开始使用** 章节直接上手 pastate！

## 特性
- **便捷易用**：pastate 对复杂概念进行了友好封装，无需学习 redux 相关概念就可以轻松上手
- **响应式 state**: 可以直接用js原生模式更新 state 的值，pastate 会响应式地为你更新相关视图
- **类型提示**：pastat 具有完善的类型定义文件，可以借助类型提示极大地提高开发效率
- **按需渲染**：pastate 实现了精确的 state 节点应用更新机制，可以在复杂的页面里高效响应 state 的变化
- **异步更新机制**：当你对 state 进行连续的复杂修改时，pastate 会高效地为你只做一次异步视图更新
- **兼容原生 redux 项目**：你可以把 pastate 轻松整合到现有的 redux 项目中，把部分 Container 实现为 pastate 模式
- **友好的学习曲线**：pastate 封装了 redux 很多高级概念，只需要在需要的时候去学习并使用它 
- **支持 TypeScript**：pastate 本身使用 TpyeScript 进行开发，对 TpyeScript 项目具有额外的类型定义支持

## Pastate 原理简介
Pastate 是 Path State 的简写，pastate 在 state 的每个节点上增加节点的位置(path)信息，从而来方便地控制节点对象或数组的引用更新，实现 react 推荐的 immutable state 特性，使得 pastate 可以管理复杂的 state 树，并实现的高效的异步按需渲染逻辑。同时 pastate 基于 ES5 的 Object.assign 实现了 state 的全节点响应式操作支持，你只需像修改普通变量一样 state 即可, 如 `state.userinfo.name = 'myName'`, 这时 pastate 的响应式引擎会为自动为你高效更新相关视图。

## 可靠性
Pastate 已经通过 130+ 个测试用例的全面测试，具有可靠性保障。测试用例的具体内容可查看项目中的 `xxx.test.js` 文件。

## 灵感来源
Pastate 内部基于 react + redux 实现，受启发于 Immutable.js 的 immutable state 管理模式， Vue.js 的响应式 state 设计模式； 同时受《精益创业》(The Lean Startup) 精益思想的熏染。

## 欢迎反馈
如果发现 pastate 的 bug 或有好建议，欢迎在 issue 中提出，感谢大家的反馈。如果你喜欢 pastate, 希望能给个宝贵的 star `^_^`：[Pastate github](TODO) 。

下面让我们开始动手用 pastate 做一个最简单的应用。