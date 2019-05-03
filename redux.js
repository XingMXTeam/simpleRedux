class Redux {
    static createStore(reducer, middlewaresHandle) {
        let state
        let listeners = []

        if (middlewaresHandle) {
            let applyMiddlewares = middlewaresHandle(Redux.createStore)
            // 返回一个新的store
            return applyMiddlewares(reducer, state)
        }

        return {
            getState() {
                return state
            },
            // 执行reducer处理数据。返回一个immutable State。
            dispatch(action) {
                state = reducer(state, action)
                listeners.forEach(listener => listener())
            },
            subscribe(listener) {
                const isSubscribed = true
                listeners.push(listener)
                return function unsubscribe() {
                    if (!isSubscribed) return
                    isSubscribed = false
                    listeners.splice(listeners.indexOf(listener), 1)
                }
            }
        }
    }
    static applyMiddleware(middlewares) {
        return function (createStore) {
            return function (reducer, state) {
                let store = createStore(reducer, state)
                let dispatch = middlewares.reduceRight((acc, curr) => {
                    acc = curr(acc)
                    return acc
                }, store.dispatch)
                // return a new store
                return Object.assign({}, store, {
                    dispatch
                })
            }
        }
    }

}
export default Redux