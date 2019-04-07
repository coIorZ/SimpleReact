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
- 关于batchUpdate
  - `transaction`的定义是，对要执行的行为，在执行前调用`initialize`，执行后调用`close`。这里我们用到两个transaction: `ReconcileTransaction`和`batchStrategyTransaction`
  - ReconcileTransaction的作用是在reconciliation的过程中，收集lifecycle方法，并在结束后执行这些lifecycle
  - BatchStrategyTransaction的作用是维护一个`isBatchUpdating`的flag，以及待更新的组件`dirtyComponents`，在batch结束后flushUpdate所有dirtyComponents
  - `setState`方法，会根据isBatchUpdating的值决定是将当前component标记为dirty(新的state存入component的_pendingState)，还是就地更新
- ReactDOM.`render`方法就是在batchTransaction里执行reconcileTransaction，流程为：
  - 开始batchUpdate, 设置isbatchUpdating为true
  - 执行reconciliation，并收集所有组件的lifecycle
  - reconciliation结束，进入close阶段，执行所有的lifecycle，假设部分lifecycle里调用了setState
  - 每一个调用setState的component被标记为dirty
  - 所有lifecyle执行完毕，reconcileTransaction执行完毕
  - 进入batch的close阶段，设置isBatchUpdating为false
  - dirtyComponents按照mounting顺序排序(todo)
  - flushUpdate所有dirtyComponents，这时state和dom才会更新，因此在lifecycle里连续多次调用setState会有"异步"的错觉。SyntheticEvent里也是同理。而其余地方(dom events、setTimeout)里的setState则是老老实实的同步
