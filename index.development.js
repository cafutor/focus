import React from 'react';
import EventCenter from './event-center';
import { HashRouter as Router, Route, Link, Switch as RouteSwitch } from 'react-router-dom';
import { isObjEmpty } from './utils';
const eventCenter = new EventCenter();

const $focus__used__component__set = [];
const $select_store_state_to_props_list = [];
let $focus__used__root__element = null;
let $focus_model_props_set = null;
let $focus_is_use_redux_store = false;
let $focus_redux_store = null;

// get seletStoreStateToProps cb
const seletStoreStateToPropsFun = (selectStoreStateToPropsList, componentId) => {
    for (let i = 0, len = selectStoreStateToPropsList.length; i < len; i++) {
        if (componentId === selectStoreStateToPropsList[i].componentId) return selectStoreStateToPropsList[i].selectStoreStateToProps;
    }

};

// save root element
export const saveRootElement = (focusRootElement) => {
    $focus__used__root__element = focusRootElement;
};

// component set that uses model,a props set
export const saveRootModelPropsSet = (rootModelJson) => {
    $focus_model_props_set = rootModelJson;
};

// is use redux store
export const isUseReduxStore = (isUseReduxStore) => {
    $focus_is_use_redux_store = isUseReduxStore;
}

// save redux store
export const saveReduxStore = (store) => {
    $focus_redux_store = store;
}


export const getComponent = (componentId) => {
    if (Object.prototype.toString.call(componentId) !== '[object String]' || !componentId.trim()) {
        throw new Error(`component id error:${componentId}`);
    };

    function setProps(partialState, didUpdate) {
        if ($focus__used__component__set.every((comInst) => comInst.componentId !== componentId))
            throw new Error(`can not find component ${componentId} !`);
        $focus__used__component__set.forEach((comObj) => {
            // debugger;
            if (comObj.componentId === componentId) {
                //  如果整个组件没被$model标记，则走更新state
                if (!comObj.__focusInternalInstanceId) {
                    comObj.parentRef.setState(partialState, () => {
                        if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]')
                            didUpdate(this.getProps());
                    });
                } else {
                    const partialStateKeys = Object.keys(partialState);
                    /****
                     * 
                     * 找到所有此component的prop被model引用的key
                     * 
                     * **/
                    const filterPropSet = $focus_model_props_set.filter((propEl) => {
                        return propEl.__focusInternalInstance === comObj.__focusInternalInstanceId;
                    });
                    /***
                     * 
                     * 找到此次更新中被model标记的prop
                     * 然后执行更新
                     * 
                     * */
                    const partialStateForModel = partialStateKeys.reduce((initialObjValue, partialStateKey) => {
                        if (filterPropSet.some((filterPropSetEl) => {
                            return filterPropSetEl.prop === partialStateKey;
                        })) {
                            initialObjValue[partialStateKey] = partialState[partialStateKey];
                        };
                        return initialObjValue
                    }, {});
                    if (!isObjEmpty(partialStateForModel)) updateModel(partialStateForModel, () => {
                        if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]')
                            didUpdate(this.getProps());
                    });

                    /****
                     * 
                     * 找到此次更新中没被model标记的prop
                     * 
                     * ***/
                    const usefulState = partialStateKeys.reduce((initialValue, stateKey) => {
                        if (filterPropSet.every((propEl) => { return propEl.prop !== stateKey })) {
                            initialValue[key] = partialState[key];
                        };
                        return initialValue;
                    }, {});
                    if (!isObjEmpty(usefulState)) comObj.parentRef.setState(usefulState, () => {
                        if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]')
                            didUpdate(this.getProps());
                    });
                }
            }
        })
    };

    const component = {
        selectStoreStateToProps: function (cb) {
            $select_store_state_to_props_list.push({
                componentId,
                selectStoreStateToProps: cb,
            });
            return this;
        },
        getProps: function () {
            if ($focus__used__component__set.every((comInst) => comInst.componentId !== componentId))
                throw new Error(`can not find component ${componentId} !`);
            const propsWithoutFunc = {};
            const ref = $focus__used__component__set.filter((comObj) => {
                return comObj.componentId === componentId;
            })[0].ref;
            const { props = {} } = ref;
            for (let i in props) {
                if (Object.prototype.toString.call(props[i]) !== '[object Function]') {
                    propsWithoutFunc[i] = props[i];
                }
            };
            return propsWithoutFunc;
        },
    };

    component.subscribe = function (cb) {
        const func = function (eventAction) {
            cb(eventAction, this);
        }.bind(this);
        eventCenter.on(`${componentId}-event`, func);
    }.bind(component);

    component.setProps = function (partialState, didUpdate) {
        if ($focus_is_use_redux_store) setProps(partialState, didUpdate);
        throw new Error(`warning:setProps is invalid if there is a redux store,
        you sholud use redux store to manage your whole state.
        error @component:${componentId}
        `);
    }.bind(component);

    return component;
};

export const updateModel = function (partialState, didUpdate) {
    if ($focus_is_use_redux_store && $focus_redux_store) {
        const subscribeFun = arguments[0];
        if (typeof subscribeFun === 'function' && $focus_redux_store) {
            subscribeFun($focus_redux_store.dispatch);
        };
    } else {
        if ($focus__used__root__element) $focus__used__root__element.setState(partialState, () => {
            didUpdate && didUpdate($focus__used__root__element.state);
        });
    }
};

export const getModel = () => {
    if ($focus__used__root__element) return $focus__used__root__element.state;
};

// ignore special props for text type
const ignoreRouteProp = (obj = {}) => {
    const propSet = ['computedMatch',
        'history',
        'location',
        'match',
        'link',
        'routeScope',
        'switch'];
    const props = {};
    for (let i in obj) {
        if (!propSet.indexOf(i) < 0) {
            props[i] = obj[i];
        }
    };
    return props;
};

// 基础组件
export class Text extends React.Component {
    static defaultProps = {
        visible: true,
    };
    constructor(props) {
        super(props);
        this.invalidEl = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'dd', 'dt'];
    };
    render() {
        const { type = 'span', visible, value, ...otherProps } = ignoreRouteProp(this.props);
        if (this.invalidEl.some((el) => {
            return el === type;
        })) {
            return visible ? React.createElement(type, otherProps, value) : null;
        };
        return null;
    };
};

export const View = ({ className, children }) => (<div className={className ? `focus-view ${className}` : 'focus-view'}>{children}</div>);

export const Switch = ({ children, ...otherProps }) => {
    return (<Router>
        <RouteSwitch {...otherProps}>
            {children}
        </RouteSwitch>
    </Router>)
};

export const Scope = (props) => {
    const { className, id, children } = props;
    return (<div className={className} id={id}>{children}</div>);
};

export const route = (Com) => {
    /**
     * 
     * ignore special props
     * exact|path
     * ***/
    const ignoreSpecialProps = (props = {}) => {
        const correctProps = {};
        for (let i in props) {
            if (Object.prototype.hasOwnProperty.call(props, i)) {
                if (i !== 'exact' && i !== 'path') {
                    correctProps[i] = props[i];
                }
            }
        };
        return correctProps;
    };

    return class extends React.Component {
        render() {
            const { exact, path, children } = this.props;
            return (<Router >
                <Route {...{ exact, path }} component={(_props) => {
                    return <Com {...Object.assign({ link: Link, switch: Switch, route: Route, children: Com === routeScope ? children : null }, ignoreSpecialProps(this.props), _props)} />
                }} />
            </Router >);
        }
    }
};

const routeScope = (props) => {
    const { className, id, children = [], computedMatch, history, location, match } = props;
    return (<div className={className} id={id}>{React.Children.map(children, (child) => {
        const routeHistory = {
            computedMatch,
            history,
            location,
            match,
            link: Link,
            routeScope: RouteScope,
            switch: Switch,
            ...child.props || {},
        };
        if (typeof child === 'string') return child;
        return React.cloneElement(child, routeHistory);
    })}</div>);
};

export const RouteScope = route(routeScope);

const focus = (Com) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            const { id, __focusInternalInstanceId } = this.props;
            if (Object.prototype.toString.call(id) !== '[object String]' || !id.trim()) {
                throw new Error(`if you use @focus decorator to describe the component,there must be a id prop,error @component:${Com.name} please check your *.view file`)
            };
            if (this.props.children || (this.props.children && this.props.children.length === 0)) {
                this.props.children = null;
            }
            if ($focus_redux_store && __focusInternalInstanceId) {
                throw new Error(`if you use redux store,you must not use @model to mark your state,you sholud use getComponent($id).selectStoreStateToProps instead.
                @component:${id}`);
            };
            this.emmit = this.emmit.bind(this);
        }
        emmit(eventName, params) {
            const { id } = this.props;
            eventCenter.emmit(`${id}-event`, { type: eventName, params });
        }
        saveComponentsMap = (comsRef) => {
            if (comsRef) {
                const { id, __focusInternalInstanceId } = this.props;
                if ($focus__used__component__set.every((comsObj) => {
                    return comsObj.componentId !== id;
                })) {
                    const componentEl = {
                        componentId: id,
                        ref: comsRef,
                        parentRef: this,
                        __focusInternalInstanceId,
                    };
                    $focus__used__component__set.push(componentEl);
                }
            }
        }
        changeProps = (partialState) => {
            if (Object.prototype.toString.call(partialState) !== '[object Object]') {
                throw new TypeError('partialState is not a pure object @changeProps');
            };
            this.setState(partialState);
        }
        render() {
            if ($focus_is_use_redux_store) {
                const { id: componentId } = this.props;
                const selectStoreStateToProps = seletStoreStateToPropsFun($select_store_state_to_props_list, componentId);
                if ($focus_redux_store && typeof selectStoreStateToProps === 'function') {
                    const partialProps = selectStoreStateToProps($focus_redux_store.getState());
                    return <Com ref={this.saveComponentsMap} {...{ ...this.props, ...partialProps, emmit: this.emmit, changeProps: this.changeProps }} />
                };
            };
            return <Com
                ref={this.saveComponentsMap}
                {...{ ...this.props, ...this.state, emmit: this.emmit, changeProps: this.changeProps }} />
        }
    }
};
export default focus;