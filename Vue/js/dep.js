class Dep {
    constructor () {
        this.subs = [] // 观察者数组
    }

    addSub (sub) {
        if(sub && sub.update) {
            this.subs.push(sub)
        }
    }

    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}