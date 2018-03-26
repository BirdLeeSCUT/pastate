
# Pastate ：响应式 react state 管理框架  

## 简介
Pastate 是一个响应式 react state 管理框架，实现了对 state 的异步响应式管理。Pastate 是一个精益框架，它对很多高级概念进行了友好封装，这意味着你**不必学习**一些难以理解的概念，就可以在一个简单的应用中便捷地使用 pastate。在应用变得逐渐复杂的过程中，你只要逐渐学习并使用 pastate 中更多的功能，以满日益复杂的系统开发需求。同时，pastate 也是一个向后兼容的渐进式框架，你可以在现有的 react 或 redux 项目中，把一部分组件改用 pastate 来实现，再逐渐拓展到整个项目。 

Pastate 主页: [https://pastate.js.org](https://pastate.js.org) 
Pastate GitHub: [https://github.com/BirdLeeSCUT/pastate](https://github.com/BirdLeeSCUT/pastate)  (欢迎 star)

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

   * [1.快速上手](docs/1.快速上手.md)
      * [安装](docs/1.快速上手.md#安装)
      * [开始使用](docs/1.快速上手.md#开始使用)
      * [更新 state 值](docs/1.快速上手.md#更新-state-值)
      * [编辑器智能提示(intelliSense)](docs/1.快速上手.md#编辑器智能提示intellisense)

   * [2.多组件应用](docs/2.多组件应用.md)
      * [更新 state 结构](docs/2.多组件应用.md#更新-state-结构)
      * [分别开发 basicInfo 和 address 的视图组件](docs/2.多组件应用.md#分别开发-basicinfo-和-address-的视图组件)
      * [store.imState 与 store.state](docs/2.多组件应用.md#storeimstate-与-storestate)
      * [使用 props 接收 imState，实现组件的按需渲染](docs/2.多组件应用.md#使用-props-接收-imstate实现组件的按需渲染)
      * [使用 imState 渲染视图的注意事项](docs/2.多组件应用.md#使用-imstate-渲染视图的注意事项)
      * [了解 PureComponent](docs/2.多组件应用.md#了解-purecomponent)
      * [子组件 state 的 intelliSense](docs/2.多组件应用.md#子组件-state-的-intellisense)
      * [单实例子组件](docs/2.多组件应用.md#单实例子组件)

   * [3.数组渲染与操作](docs/3.数组渲染与操作.md)
      * [渲染数组](docs/3.数组渲染与操作.md#渲染数组)
      * [修改数组](docs/3.数组渲染与操作.md#修改数组)
      * [空初始数组与编辑器 intelliSence](docs/3.数组渲染与操作.md#空初始数组与编辑器-intellisence)
      * [多实例组件的内部动作处理](docs/3.数组渲染与操作.md#多实例组件的内部动作处理)
         * [react 传统方案](docs/3.数组渲染与操作.md#react-传统方案)
            * [传统方案1:父组件处理](docs/3.数组渲染与操作.md#传统方案1父组件处理)
            * [传统方案2:子组件结合 index 实现](docs/3.数组渲染与操作.md#传统方案2子组件结合-index-实现)
         * [pastate 数组元素操作方案](docs/3.数组渲染与操作.md#pastate-数组元素操作方案)
            * [pastate 方案1:获取对于的响应式节点](docs/3.数组渲染与操作.md#pastate-方案1获取对于的响应式节点)
            * [pastate 方案2:使用 imState 操作函数](docs/3.数组渲染与操作.md#pastate-方案2使用-imstate-操作函数)

   * [4.表单渲染与操作](docs/4.表单渲染与操作.md)
      * [使用原生表单元素](docs/4.表单渲染与操作.md#使用原生表单元素)
      * [使用 pastate 双向绑定输入组件](docs/4.表单渲染与操作.md#使用-pastate-双向绑定输入组件)
         * [Input 文本框](docs/4.表单渲染与操作.md#input-文本框)
         * [Checkbox 复选框](docs/4.表单渲染与操作.md#checkbox-复选框)
         * [RadioGroup 单选框选项组](docs/4.表单渲染与操作.md#radiogroup-单选框选项组)
         * [Select 下拉选择框](docs/4.表单渲染与操作.md#select-下拉选择框)
      * [pastate 表单组件的类型定义](docs/4.表单渲染与操作.md#pastate-表单组件的类型定义)
      * [对现有组件库进行双向数据绑定](docs/4.表单渲染与操作.md#对现有组件库进行双向数据绑定)
         * [使用 Bind 高阶组件](docs/4.表单渲染与操作.md#使用-bind-高阶组件)
         * [使用 makeBindable 函数](docs/4.表单渲染与操作.md#使用-makebindable-函数)
      * [对于绑定的值为空的情况](docs/4.表单渲染与操作.md#对于绑定的值为空的情况)

   * [5.模块化](docs/5.模块化.md)
      * [模块化实战任务](docs/5.模块化.md#模块化实战任务)
      * [模块划分](docs/5.模块化.md#模块划分)
      * [pastate 模块构成](docs/5.模块化.md#pastate-模块构成)
      * [模块结构](docs/5.模块化.md#模块结构)
      * [模型文件 *.model.js](docs/5.模块化.md#模型文件-modeljs)
         * [(1)设计模块的 state](docs/5.模块化.md#1设计模块的-state)
         * [(2)定义模块的 actions](docs/5.模块化.md#2定义模块的-actions)
         * [(3)创建并配置模块的 store](docs/5.模块化.md#3创建并配置模块的-store)
      * [视图部分](docs/5.模块化.md#视图部分)
      * [导出模块](docs/5.模块化.md#导出模块)
      * [模块的模板文件](docs/5.模块化.md#模块的模板文件)

   * [6.多模块应用](docs/6.多模块应用.md)
      * [store 被多模块消费](docs/6.多模块应用.md#store-被多模块消费)
      * [构建 storeTree 并引用其节点](docs/6.多模块应用.md#构建-storetree-并引用其节点)
      * [多模块组合](docs/6.多模块应用.md#多模块组合)
      * [使用其他模块的 state](docs/6.多模块应用.md#使用其他模块的-state)
      * [缓存 storeTree 的衍生数据](docs/6.多模块应用.md#缓存-storetree-的衍生数据)
      * [调用其他模块的 actions](docs/6.多模块应用.md#调用其他模块的-actions)

   * [7.规模化](docs/7.规模化.md)
      * [路由](docs/7.规模化.md#路由)
         * [无参数路由](docs/7.规模化.md#无参数路由)
            * [使用 Router 作为根容器](docs/7.规模化.md#使用-router-作为根容器)
            * [使用 Route 组件来定义路由](docs/7.规模化.md#使用-route-组件来定义路由)
         * [有参数路由](docs/7.规模化.md#有参数路由)
         * [在 actions 中使用路由](docs/7.规模化.md#在-actions-中使用路由)
      * [嵌入 redux 应用](docs/7.规模化.md#嵌入-redux-应用)
      * [开发调试工具](docs/7.规模化.md#开发调试工具)
      * [中间件](docs/7.规模化.md#中间件)
         * [内置中间件](docs/7.规模化.md#内置中间件)
         * [自定义中间件](docs/7.规模化.md#自定义中间件)
      * [编译与部署](docs/7.规模化.md#编译与部署)

   * [8.原理与API文档](docs/8.原理与API文档.md)
      * [原理剖析](docs/8.原理与API文档.md#原理剖析)
         * [带路径信息的 immutable state](docs/8.原理与API文档.md#带路径信息的-immutable-state)
            * [为什么要使用 immutable 数据？](docs/8.原理与API文档.md#为什么要使用-immutable-数据)
            * [为什么要带路径信息？](docs/8.原理与API文档.md#为什么要带路径信息)
         * [pastate imState 内部操作机制](docs/8.原理与API文档.md#pastate-imstate-内部操作机制)
         * [响应式 state 镜像](docs/8.原理与API文档.md#响应式-state-镜像)
         * [视图响应引擎](docs/8.原理与API文档.md#视图响应引擎)
      * [API 文档](docs/8.原理与API文档.md#api-文档)

   * [9.其他资源](docs/9.其他资源.md)
      * [在 typescript 中使用](docs/9.其他资源.md#在-typescript-中使用)
      * [在 react-native 中使用](docs/9.其他资源.md#在-react-native-中使用)
      * [在 preact 或 nerv 中使用](docs/9.其他资源.md#在-preact-或-nerv-中使用)
      * [相关资源](docs/9.其他资源.md#相关资源)
      * [贡献指引](docs/9.其他资源.md#贡献指引)
      * [英文翻译](docs/9.其他资源.md#英文翻译)

## 贡献
非常欢迎大家加入 pastate 的开发小组，pastate 具体的开发说明请看文档的“相关资源”章节。