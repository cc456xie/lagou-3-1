class Compiler {
    constructor (vm) {
        this.vm = vm
        this.el = vm.$el
        this.compile(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compile (el) {
        const childNodes = el.childNodes
        Array.from(childNodes) // 类数组转数组,ES6新方法
        .forEach(node => {
            if(this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            // 递归循环子节点
            if(node.childNodes || node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }
    
    // 编译元素节点
    compileElement (node) {
        const attrs = node.attributes // 获取节点的属性
        
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name
            if(this.isDerective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                if(attrName.startsWith('on')) { //v-on
                    key = attrName.substr(3)
                    attrName = 'v-' + attrName
                    this.updateMethods(node, key, attrName)
                } else {
                    this.update(node, key, attrName)
                }
            }
        })
    }

    update (node, key, attrName) {
        const updateFn = this[attrName + 'Updater'] // 动态拼接方法名
        console.log(updateFn)
        updateFn && updateFn.call(this, node, this.vm[key], key)
     }

     updateMethods (node, key, attrName) { // v-on
        node.addEventListener(key, this.vm.$methods[node.attributes[attrName].value].bind(this.vm)) 
     }

    textUpdater (node, value, key) {
        node.textContent = value

        // 新增watcher对象
        new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal
        })        
    }

    modelUpdater (node, value, key) {
        if(!node.type) return

        node.value = value
        
        // 新增watcher对象
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal
        }) 

        node.addEventListener('input', (e) => {
            this.vm[key] = node.value
        })
    }

    htmlUpdater (node, value, key) { // v-html
        node.innerHTML = value

        new Watcher(this.vm, key, (newVal) => {
            node.innerHTML = newVal
        }) 
    }


    // 判断元素属性是否指令
    isDerective (attr) {
        return attr.startsWith('v-')
    }

    // 编译文本节点
    compileText (node) {
        console.dir(node)
        // 处理插值表达式
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent

        if(reg.test(value)) {
            const key = RegExp.$1.trim()

            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = newVal
            })
        }
        
    }
    
    // 判断是否文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }

    // 判断是否元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}