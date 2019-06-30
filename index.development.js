import React from 'react';
import EventCenter from './event-center';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { isObjEmpty } from './utils';
const eventCenter = new EventCenter();

const $focus__used__component__set = [];
let $focus__used__root__element = null;
let $focus_model_props_set = null;

// save root element
export const saveRootElement = (focusRootElement) => {
    $focus__used__root__element = focusRootElement;
};

// component set that uses model,a props set
export const saveRootModelPropsSet = (rootModelJson) => {
    $focus_model_props_set = rootModelJson;
};

export const getComponent = (componentId) => {
    const component = {
        setProps: function (partialState, didUpdate) {
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
        },
        getProps: function () {
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
    return component;
};

export const updateModel = (partialState, didUpdate) => {
    if ($focus__used__root__element) $focus__used__root__element.setState(partialState, () => {
        didUpdate && didUpdate($focus__used__root__element.state);
    });
};

export const getModel = () => {
    if ($focus__used__root__element) return $focus__used__root__element.state;
};

// 基础组件
export class Text extends React.Component {
    constructor(props) {
        super(props);
        this.typeMap = {
            'h1': ({ value, className }) => (<h1 className={className}>{value}</h1>),
            'h2': ({ value, className }) => (<h2 className={className}>{value}</h2>),
            'h3': ({ value, className }) => (<h3 className={className}>{value}</h3>),
            'h4': ({ value, className }) => (<h4 className={className}>{value}</h4>),
            'h5': ({ value, className }) => (<h5 className={className}>{value}</h5>),
            'h5': ({ value, className }) => (<h6 className={className}>{value}</h6>),
            'span': ({ value, className }) => (<span className={className}>{value}</span>),
            'div': ({ value, className }) => (<div className={className}>{value}</div>),
        };
    };
    render() {
        const { type = 'span', ...otherProps } = this.props;
        const Com = this.typeMap[type];
        return <Com {...otherProps} />;
    }
};

export const Scope = (props) => (<div {...props}></div>);

export class View extends React.Component {
    render() {
        const { className } = this.props;
        return <div className={className ? `focus-view ${className}` : 'focus-view'}>{this.props.children}</div>
    }
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
 
    return class extends React.PureComponent {
        render() {
            const { exact, path } = this.props;
            return (<Router >
                    <Route {...{ exact, path }} component={(_props) => {
                        return <Com {...Object.assign({ link: Link,router:Router,switch:Switch}, ignoreSpecialProps(this.props), _props)} />
                    }} />
            </Router >);
        }
    }
}

const focus = (Com) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            if (this.props.children || (this.props.children && this.props.children.length === 0)) {
                this.props.children = null;
            }
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
        //  ?
        changeProps = (partialState) => {
            if (Object.prototype.toString.call(partialState) !== '[object Object]') {
                throw new TypeError('partialState is not a pure object @changeProps');
            };
            this.setState(partialState);
        }
        render() {
            return <Com
                ref={this.saveComponentsMap}
                {...{ ...this.props, ...this.state, emmit: this.emmit, changeProps: this.changeProps }} />
        }
    }
};
export default focus;