# SimpleReact

### 心得
- 用babel解析jsx，得到`createElement(type, config, child1, child2, ...)`，children是从第三个参数开始一个一个传进去的。children需要`flatten`一层，以支持数组形式如
```
<ul>
  {array.map(() => <li></li>)}
</ul>
```
- `createElement`返回的对象（就叫ReactElement吧）用以描述dom，需要一种数据结构维护来维护ReactElement和构建的dom，起个名字就叫`instance`吧。
每个dom都会对应一个instance。
- DomElement和DomTextNode的api有一定差异，处理的时候要注意。我们把 `instance`分为4类：
DomElementInstance, DomTextNodeInstance, FunctionInstance, ClassInstance。
- FunctionInstance和ClassInstance是复合型instance，它们并不直接对应某一种dom类型，而是展开后得到DomInstance。
注意复合型instance只能有一个child的约束。为了结构统一，我们还是把真正的dom给它
```
compositeInstance = {element, child, dom}  // compositeInstance.dom === compositeInstance.child.dom
```
- 对于class组件，重新渲染时需要拿到旧的组件实例去render，再做对比，否则会丢掉state
- 给DomElement更新属性时，注意`value`属于property, setAttribute是无效的
- 加上`key`优化update，记得update完要reorder children
