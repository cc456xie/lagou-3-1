# 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
答：
vue中动态添加到data对象成员中的属性不是响应式的，因为Object.definedProperty无法监测对象属性的添加或删除，并且只有在初始化的时候会将对象中的每个属性添加getter和setter，所以新增的属性是无法监听数据变动的，所以也就无法触发视图更新。 解决办法如下：
```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
    this.$set(this.dog,"name",'trump') //使用$set为对象添加属性
  }
 }
})
```
$set会接受三个参数，分别是target，key，val，target可以是对象或者数组，key和val分别代表键值对或者下标.通过阅读$set的源码，大致了解了其实现原理，首先会判断target是否存在并且是否是对象或者数组，接着判断其是否是数组并且数组索引key是否合法。如果是数组并且key合法，则将target长度设为其原长度和key中的较大值，并且通过vue重写的splice方法将val加入数组。 如果target是对象并且key是target的属性并且key不是对象，则直接将val赋值给target\[key\]。 对于不存在_ob_属性的target对象，则可判断其是非响应式对象，若存在则表示其为响应式数据对象，则通过defineReactive为其设置响应式处理。

# 2、请简述 Diff 算法的执行过程

`diff算法`以patch方法作为入口，在patch中接收`vnode`和`oldVnode`两个参数，通过`sameVnode`函数判断vnode和olVnode是否为相同节点（vue中主要是通过判断元素的key，tag，isComment等属性来判断的，如果是input还要求type必须相同, snabbdom中则判断key和sel相同）。如果是相同节点，则对两个节点进行`patchVnode`，若不是则根据vnode创建一个真实dom节点并将其插入oldVnode的父结点中，并且移除oldVnode。 patchVnode函数是diff算法的重点，patchVnode接收新旧Vnode作为参数，首先会执行用户设定的prepatch钩子函数和模块中以及用户定义的update钩子函数。再然后会对新旧节点进行判断，首先判断vnode是否有text属性，如果没有，再判断oldch和ch的存在情况，若都存在且oldch不等于ch，则使用`updateChildren`方法对比更新子节点。若只存在ch，则使用`addVnodes`将ch添加到elm中，若oldch存在且ch不存在，则使用`removeVnodes`移除oldch，若oldVnode存在text则将elm的text清空，这是vnode不存在text的情况。 若vnode存在text且vnode的text不等于oldVnode的text，先判断oldVnode是否有oldch，有则移除，然后将vnode的text设置到elm中就可以了。 最后触发postpatch方法。 `updateChildren`是diff的核心方法，其内部定义了若干变量，主要是vnode子节点的开始和结束索引NS和NE还有oldVnode子节点的开始和结束索引OS和OE，以及索引对应的节点（oldStartVnode，newStartVnode，oldEndVnode，newEndVnode），通过一个while循环保持NS < NE并且OS < OE，在循环中首先判断其节点是否为null并做处理。 然后通过`sameVnode`判断oldStartVnode和newStartVnode是否相同节点，若是则对其使用patchVnode更新到视图中，并且OS和NS都++，若不是相同节点，则对oldEndVnode和newEndVnode使用sameVnode，若相同节点则patchVnode切OE和NE--，若依然不是相同节点，则判断oldStartVnode和newEndVnode，若是相同节点则先patchVnode，再将oldStartVnode移动到节点列表末尾，OS++,NE--，若依然不是相同节点，则判断oldEndVnode和newStartVnode，逻辑同上，只不过将oldEndVnode移动到队列最前面，若依然没有匹配上，则通过key去匹配相同的节点，若匹配到了则将oldVnode中的对应子节点移动到数组前面，若未匹配到说明vnode中该子节点为一个新节点，直接在oldVnode前面新增该节点，此时一个循环完毕。 之后会进行一些后续处理，当至少有一个数组没被遍历完，若OS>OE，则说明旧节点数组先遍历完毕，此时直接将新结点数组中剩余的节点插入到后面，否则说明新节点数组先遍历完毕，此时将就节点数组中剩余节点移除即可。

# 3，模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 
 见文件夹`my-vuerouter`

# 4,在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

见文件夹`Vue`

# 5,参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

snabbdom引入不了，时间又比较晚了，暂时先不写了