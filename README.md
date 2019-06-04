# focus-center
    focus尝试解决的问题:提高业务组件的复用性，让你的团队可以快速的开发或者维护页面的业务逻辑，可以让你的团队把重心放在开发业务组件上。看到这里可能你会有点不明白，作者说的什么东西啊，别急，我会慢慢解释。
    现在前端页面的开发早变成了一个个的组件，但是组件应该是和复用性挂钩的,这也是评价一个组件好坏的指标之一。如果业务重复，ui重复，这个时候如果还是在页面写重复的组件，无疑是在浪费工作量，并且据我所知在页面工程上进行组件的维护是一个非常不吃力的做法，并且还会增加整个工程的混乱度，团队还会不停的写着重复的代码。
    正确的做法是需要进行业务组件的沉淀，将它从页面工程分离，进行单独的维护，将焦点放在业务组件上，然后再下放到你的页面中。这样做的好处就是可以解放整个团队的生产力。
    

## focus需要结合focus-loader来使用，入口是index.view文件

安装
```
npm install focus-center focus-loader --save;
```

```javascript
// loader 规则从下到上，从右到左,所以focus-loader需要在babel-loader后面
module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.view$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'focus-loader',
            options: {

            }
          }],
        exclude: /node_modules/,
      },
    ]
  }
```
tips:一般的你可能会需要配置多个入口文件(src/pageOne/index.view,src/pageTwo/index.view,...)

## focus-center快速预览
<div style="text-align:left">
    <img style="width:300px;height:auto" src="http://119.23.254.195/files/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-06-02%20%E4%B8%8B%E5%8D%8810.23.07%20(1).png">
</div>

在你的页面上应该只有三个很重要的文件（index.business,index.model,index.view），正如上面的页面工程结构图所展示的，黑框部分是focus的项目结构，但请忽略common这个公共的组件文件夹，正确的做法是将这个业务组件库分离出去，单独发布。如果你需要使用三方提供的业务组件，这种情况你才能在页面工程下写定制的组件，但是尽量保持页面工程的干净。

* *.business文件
<div style="text-align:left">
    <img style="width:550px;height:auto" src="http://119.23.254.195/files/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-06-03%20%E4%B8%8B%E5%8D%888.22.40.png">
</div>


    这个文件是页面工程的业务逻辑文件，如果业务组件开发良好，那么需要写的页面业务逻辑是很少的。在*.business文件中你可以更新对应的组件或者更新整个页面的model。

* index.model文件

    这个文件输出整个页面的model，需要导出一个单纯的object data。
        
    ```javascript
    export default {
        dataSource:[
            {
                name:'madongmei',
                info:'mashenmemei',
                id:'******',
            }
        ]
    }
    ```

* index.view文件
    
```javascript
import React from 'react';
import 'antd/lib/modal/style/css.js';
import MyTodoList from './common/MyTodoList/index.jsx';
import Mydia from './common/MyDialog/index.jsx';
import './index.business';

<View modelFromServerKey="model" customModel="./index.model" root="root">
    <Scope>
        <Text type="h1" value="@model.text" />
        <MyTodoList
            dataSource="@model.dataSource"
            id='myTodoListOne' />
    </Scope>
    <Text type="h2" value="@model.text" />
    <MyTodoList
        dataSource="@model.dataSource"
        id='myTodoList' />
    <Scope>
        <Text type="h3" value="@model.text" />
        <MyTodoList
            dataSource="@model.dataSource"
            id='myTodoListTwo' />
    </Scope>
    <Scope>
        <Text type="h3" value="@model.text" />
        <MyTodoList
            dataSource="@model.list.dataSource"
            id='myTodoListThree' />
    </Scope>
    <Mydia id="myDia" visible="@model.dialogVis"  />
</View>
```
    index.view文件是页面的视图文件，这个文件就是你组织业务组件地方。
    为了保持.view文件的干净清爽，index.view文件中有一只能有import语句，和View tag，如果加入了其他的一些语句，则会报错。View tag上有三个prop。modelFromServerKey是从服务端过来的静态data,最后会从index.model文件中导出的model做一个合并。

```javascript
   window[modelFromServerKey]=window.model={};
   const wholePageModel=Object.assign(customModel,window.model);
```

## 一些概念和规范
* 如果你需要将业务组件的事件通过event center发送出来，比如通过整个model和其他的业务组件通信或者更新model，则必须在你的业务组件中引入focus高阶组件，这个高阶组件会赋予wrapper组件两个props，一个emmit事件的prop，一个changeProps。
emmit第一个参数是事件的type,用来描述事件的行为，第二个参数则是事件传入的参数。给业务组件传入id prop，主要是用来订阅组件的事件。

```javascript
    import {getComponent,updateModel,getModel} from 'focus-center';
    getComponent(componentId).suscribe((eventAction,target)=>{
        target.setProps({},(nextProps)=>{

        });
        switch(action.type){
            case *** :
                updateModel({},(nextModel)=>{

                });
        }
    });
```

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import focus from 'focus-center';
import { Button } from 'antd';
import 'antd/lib/button/style/css.js';
import Action from '../commonMod/action/index.jsx';

@focus
class MyTodoList extends React.Component {
    static displayName = 'MyTodoList';

    static propTypes = {
        dataSource: PropTypes.arrayOf(PropTypes.shape({
            addr: PropTypes.string,
            info: PropTypes.string,
        }))
    };

    static defaultProps = {
        dataSource: [
            {
                id: 10931234234232,
                addr: 'this is addr',
                info: 'from logic',
            },
            {
                id: 11931234234232,
                addr: 'this is addr',
                info: 'from logic',
            },
            {
                id: 18931234234232,
                addr: 'this is addr',
                info: 'from logic',
            },
        ]
    }
    constructor(props) {
        super(props);
    }

    handleClick = (params) => {
        const { emmit,changeProps} = this.props;
        emmit('CHANGE_SELF', { ...params });
    }
    changeSelfProps = () => {
        const { emmit } = this.props;
        emmit('CHANGE_PROPS');
    }
    render() {
        const { dataSource, emmit } = this.props;
        return (<div>
            <ul>
                {dataSource.map((el) => {
                    return (<li
                        onClick={this.handleClick.bind(this, el)}
                        key={el.id}>
                        <dd>addr:{el.addr}</dd>
                        <dd>info:{el.info}</dd>
                    </li>);
                })}
                <Button
                    onClick={this.changeSelfProps}
                    type="primary">change this com's model</Button>
                <Action emmit={emmit} />
            </ul>
        </div>);
    }
};
export default MyTodoList;
````

### that is it,goodluck ! 