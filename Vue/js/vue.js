class Vue {
    constructor (options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$methods = options.methods || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        this._proxyData(this.$data) 

        new Observer(this.$data)

        new Compiler(this)
    }

    _proxyData (data) { // 遍历data属性，并注入Vue实例
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get () {
                    return data[key]
                },
                set (nVal) {
                    console.log(nVal)
                    if(nVal === data[key]) return
                    data[key] = nVal
                }
            })
        })
    }
}