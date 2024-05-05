export function reactivity() {
    let activeEffect: Function | null = null

    // targetMap stores all of the dependencies
    // for each reactive object's properties
    const targetMap = new WeakMap<Object, Map<PropertyKey, Set<Function | null>>>()
    function track<T extends Object>(target: T, key: PropertyKey) {
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

    function trigger<T extends Object>(target: T, key: PropertyKey) {
        const depsMap = targetMap.get(target)
        if (!depsMap) { return }
        let dep = depsMap.get(key)
        if (dep) {
            dep.forEach((eff) => effect(eff))
        }
    }

    /**
    * Creates a reactive object; Pair with effect to update the DOM
    * 
    * example:
    * ```typescript
    * const { reactive, effect } = reactivity()
    *
    *let product = reactive({
    *   value: 5,
    *   quantity: 3,
    *})
    *effect(() => {
    *   document.getElementById('product-details').textContent = JSON.stringify(product)
    *})
    * ```
    */
    function reactive<T extends Object>(target: T) {
        // This handler contains two 'traps', or overides for
        // the getter and setter of the proxied target object.
        const handler = {
            get(target: T, key: PropertyKey, receiver: T): ReturnType<typeof Reflect.get> {
                const result = Reflect.get(target, key, receiver)
                track(target, key)
                return result
            },
            set(target: T, key: PropertyKey, value: T[keyof T], receiver: T): ReturnType<typeof Reflect.set> {
                const oldValue = target[key as keyof T]
                const result = Reflect.set(target, key, value, receiver)
                // Here we ensure that the trigger is only run if
                // the resulting value does not match the previous/old value
                if (result && oldValue !== value) {
                    trigger(target, key)
                }
                return result
            },
        }
        // return a 'proxy' object;
        // Proxy objects reference their source object
        // We can override the objects getter and setter
        return new Proxy(target, handler)
    }

    /**
    * Creates an 'effect', triggered when it's dependencies change
    * 
    * example:
    * ```typescript
    * const { reactive, effect } = reactivity()
    * 
    *let product = reactive({
    *   value: 5,
    *   quantity: 3,
    *})
    * 
    * let total = 0
    * effect(() => {
    *   total = product.value * product.quantity
    *   document.getElementById('total').textContent = total
    })
    * ```
    */
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