export function reactivity() {
    let activeEffect: Function | null = null

    const targetMap = new WeakMap<Object, Map<string | symbol, Set<Function | null>>>()
    function track<T extends Object>(target: T, key: string | symbol) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        dep.add(activeEffect)
    }

    function trigger<T extends Object>(target: T, key: string | symbol) {
        const depsMap = targetMap.get(target)
        if (!depsMap) { return }
        let dep = depsMap.get(key)
        if (dep) {
            dep.forEach((eff) => effect(eff))
        }
    }

    function reactive<T extends Object>(target: T) {
        const handler = {
            get(target: T, key: string | symbol, receiver: any): any {
                const result = Reflect.get(target, key, receiver)
                track(target, key)
                return result
            },
            set(target: T, key: string | symbol, value: T[keyof T], receiver: any) {
                const result = Reflect.set(target, key, value, receiver)
                trigger(target, key)
                return result
            },
        }
        return new Proxy(target, handler)
    }

    function effect(fn: Function | null) {
        activeEffect = fn
        if (activeEffect) {
            activeEffect()
        }
        activeEffect = null
    }

    return {
        reactive,
        effect,
    }
}