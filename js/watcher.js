class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key // data 中的属性名称
        this.cb = cb // 回调函数负责更新视图

        // 把 watcher 对象记录到 Dep 中的 target 中
        Dep.target = this
        // （observer中）触发 get 方法，在 get 中调用 addSub  
        this.oldValue = vm[key]
        Dep.target = null
    }

    update() {
        const newValue = this.vm[this.key]

        if (this.oldValue === newValue) {
            return
        }
        this.cb(newValue)
    }
}