export function reactivity() {
    let activeEffect: Function | null = null

    // targetMap stores all of the dependencies
    // for each reactive object's properties
    const targetMap = new WeakMap<Object, Map<string | symbol, Set<Function | null>>>()
    function track<T extends Object>(target: T, key: string | symbol) {
        // this dependency map stores dependencies
        // for each property in the targetMap
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        // a 'dep' is a set of effects that will
        // re-run when their dependant values change
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
            get(target: T, key: string | symbol, receiver: T): ReturnType<typeof Reflect.get> {
                const result = Reflect.get(target, key, receiver)
                track(target, key)
                return result
            },
            set(target: T, key: string | symbol, value: T[keyof T], receiver: T): ReturnType<typeof Reflect.set> {
                const oldValue = target[key as keyof T]
                const result = Reflect.set(target, key, value, receiver)
                if (result && oldValue !== value) {
                    trigger(target, key)
                }
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