let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 判断VueRouter是否已经安装
    if (this.install.installed) return
    this.install.installed = true

    // 将Vue构造函数记录到全局变量
    _Vue = Vue

    // 将创建Vue实例传入的router注入到Vue实例上
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.getHash()
    this.setHashChange()
  }

  createRouteMap () { // 将路由规则解析为键值对形式，存储到routeMap
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    const _this = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      // template: '<a :href="to"><slot></slot></a>'
      render (h) {
        return h('a', {
          attrs: {
            href: '#' + this.to
          }
        }, [this.$slots.default])
      }
    })
    Vue.component('router-view', {
      render (h) {
        const component = _this.routeMap[_this.data.current]
        return h(component)
      }
    })
  }

  getHash () {
    const hash = window.location.hash.slice(1)
    this.data.current = hash
  }

  setHashChange () {
    return window.addEventListener('hashchange', () => {
      this.getHash()
    })
  }
}
