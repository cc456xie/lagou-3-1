class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm // vue实例
        this.key = key // 属性名
        this.cb = cb   // 更新视图的回调函数

        Dep.target = this

        this.oldVal = vm[key] // 触发get添加依赖到dep中

        Dep.target = null
    }

    update () {
        const newVal = this.vm[this.key]

        if(this.oldVal === newVal) return
        this.cb(newVal)
    }
}