export function reactivity() {
    let dependencies = new Set<Function | null>()
    let activeEffect: Function | null = null

    function track() {
        if (activeEffect) {
            dependencies.add(activeEffect)
        }
    }

    function trigger() {
        dependencies.forEach((eff) => effect(eff))
    }

    function reactive<T extends Object>(target: T) {
        const handler = {
            get(target: T, key: string | symbol, receiver: any): any {
                const result = Reflect.get(target, key, receiver)
                track()
                return result
            },
            set(target: T, key: string | symbol, value: T[keyof T], receiver: any) {
                const result = Reflect.set(target, key, value, receiver)
                trigger()
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