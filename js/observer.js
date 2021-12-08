class Observer {
    constructor(data) {
        this.work(data)
    }

    work(data) {
        // 1. 判断 data 是否是一个对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2. 遍历 data 对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, val) {
        const _this = this
        // 负责收集依赖并发送通知
        const dep = new Dep()

        // 如果 val 是对象，把 val 内部的属性转换成 getter 和 setter
        this.work(val);

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)

                // 这个地方既然已经有 data 又有 key 为什么还会有 val，
                // 原因是 当获取 obj[key] 时会触发 get 方法，get 返回 obj[key] 反复陷入死循环
                // 所有要用 value 而不是通过 obj[key] 去获取
                return val
            },
            set (newValue) {
                if (newValue === val) {
                    return
                }

                val = newValue
                _this.work(newValue)
                // 通知改变
                dep.notify()
            }
        })
    }
}