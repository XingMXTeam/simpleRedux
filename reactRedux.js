import React from 'react'

class ReactRedux {
    static get Provider() {
        const Provider = class Provider extends React.component {
            constructor(props) {
                super(props)
            }
            getChildContext() {
                const {
                    store
                } = this.props
                return {
                    store
                }
            }
            render() {
                return this.props.children
            }
        }
        return Provider
    }
    // 本质上是返回了一个高阶组件
    static connect(mapStateToProps, mapDispatchToProps) {
        const state = mapStateToProps()
        const dispatchFn = mapDispatchToProps()
        // component是需要传递状态的组件
        return function (component) {
            const hoc = class HOC extends React.component {
                render() {
                    // store是通过Provider注入进来的。
                    let state = this.context.store.getState()
                    let stateToPass = mapStateToProps(state)
                    let dispatch = this.context.store.dispatch
                    let dispatchToPass = mapDispatchToProps(dispatch)
                    return ( < component {
                            ...stateToPass
                        } {
                            ...dispatchToPass
                        }
                        />)
                    }
                }
            }
            hoc.contextTypes = {
                store: PropTypes.object
            };
            // 这个组件被Provider包裹，所以上下文具有store
            return hoc;
        }
    }