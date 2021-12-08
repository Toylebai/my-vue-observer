class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }

    // 编译模板 处理文本节点和元素节点
    compile(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                // 处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }

            // 判断 node 是否有子节点， 如果有递归调用 compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement (node) {
        // 1 遍历素有的属性节点
        Array.from(node.attributes).forEach(attr => {
            // 2 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // 2-1 v-text => text
                attrName = attrName.substr(2)
                // 2-2 获取指令内容 key
                const key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }

    // v-text
    textUpdater(node, key, value) {
        node.textContent = value

        // 创建 watcher 对象， 数据改变 更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    // v-module
    modelUpdater(node, key, value) {
        node.value = value
         // 创建 watcher 对象， 数据改变 更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })

        node.addEventListener('input', () => {
           this.vm[key] = node.value
        })
    }

    // 编译文本节点 处理差值表达式
    compileText(node) {
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if (reg.test(value)) {
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建 watcher 对象， 数据改变 更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })

        }
    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是都是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    // 判断几点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }

}