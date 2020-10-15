class Observer {
    constructor (data) {
        this.walk(data)
    }

    walk (data) {
        if(!data || typeof data !== 'object') return

        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive (data, key, val) {
        this.walk(val) // 若data中的属性有对象，则递归为其内部属性设置响应式
        let dep = new Dep() // 为该属性new一个dep对象

        const _this = this
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get () { // 此处有闭包
                Dep.target && dep.addSub(Dep.target) // 收集依赖
                return val
            },
            set (nVal) {
                if(nVal === val) return
                
                val = nVal
                _this.walk(val) // 若新值为对象，则为其属性设置响应式

                dep.notify() // 通知所有观察者
            }
        })
    }
}