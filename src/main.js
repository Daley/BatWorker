'use strict';

//require('./assets/css/bootstrap.min.css');

require('./assets/css/font-awesome.min.css');

require('./libs/bootstrap3-editable/css/bootstrap-editable.css');

require('./libs/bootstrap3-editable/js/bootstrap-editable.js');


import Reflux from 'reflux';
import React from 'react';
//import * as ReactBootstrap from 'react-bootstrap';
import {Grid, Row,Col,Modal,Button} from 'react-bootstrap';
import AppCfgs from "./cfg/AppCfgs.js";
//actions && stores
var global=window;
global.cfgs=AppCfgs;
global.SpaceActions=Reflux.createActions(AppCfgs.spaceActions);
global.ProjectActions=Reflux.createActions(AppCfgs.projectActions);
global.QueueActions=Reflux.createActions(AppCfgs.queueActions);
global.LogActions=Reflux.createActions(AppCfgs.logActions);

global.lang=require("./cfg/LangCfg.js");
global.keyMgr=require("./common/KeyMgr.js");
global.keyMgr.init($(document));

global.WorkStore=require("./stores/WorkStore.js");
global.ProjectStore=require("./stores/ProjectStore.js");
global.QueueStore=require("./stores/QueueStore.js");
global.LogStore=require("./stores/LogStore.js");





import ValueGroup from './components/util/ValueGroup.js'
import PopGroup from './components/util/PopGroup.js'
import LogView from './components/util/LogView.js'
import JobQueueView from './components/body/JobQueueView.js'
import HeaderView from './components/header/Header.js'

var _ = require('lodash');

console.dir(AppCfgs);


global.WorkStore.initStore();

console.log("workVo");
console.dir(global.WorkStore);

var SpaceList = require("./components/body/SpaceList.js");
var ProjectView = require("./components/body/ProjectView.js");


global.cloneCreate=function(data){
	var obj=_.clone(data,true);
    if(_.isString(obj)){
        return obj;
    }
    //循环id
    var chgId=function(obj){
        if(obj.hasOwnProperty('id')){
            obj.id=global.WorkStore.createIncId();
        }
        for(var key in obj){
            if(_.isArray(obj[key])||_.isObject(obj[key])){
                chgId(obj[key]);
            }
        }
    }
	
    chgId(obj);
    delete obj.viewFilters;
    delete obj.exec;
	console.log('dengyp new clone');
	console.dir(obj);
	return obj;
}

global.log=function(){
    var arr=Array.prototype.slice.call(arguments);
    var str=arr+"";
    console.log(str);
    global.LogActions.addLog(str);
}

global.globalReplace=function(value,vars){
            for(var kv in vars){
                var {name,val}=vars[kv];
                value=value.replace(new RegExp("\\$"+name,'g'),val);
            }
            return value;
        }

// <HeaderView/>
var Main = React.createClass({
	

    render: function() {
       return   <div>
                    
                    <Grid fluid={ true }>

                        <Row>                    
                            <Col xs={ 5 }                             
                                 sm={ 4 }
                                 md={ 3 }
                                 lg={ 3 }>
                                <SpaceList/>
                            </Col>
                            <Col xs={ 7 }                             
                                 sm={ 8 }
                                 md={ 9 }
                                 lg={ 9 }>
                            <ProjectView/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
    }
});

React.render(<Main />, document.getElementById('content'));

//global.popMgr=React.createElement(PopGroup);
React.render(<PopGroup/>,document.getElementById('pop_layer'));

//panels
var panels=global.WorkStore.workVo.panels;

function getPanelByType(type){
    if(type=="jobQueue"){
        return JobQueueView;
    }else if(type=="logView"){
        return LogView;
    }
    return null;
}

function getPanelNameByType(type){
    if(type=="jobQueue"){
        return '执行队列';
    }else if(type=="logView"){
        return '日志';
    }
    return '未定义';
}


console.dir(panels);

var func=function(){
    panels.map(function(item){
        //传的是引用 ，改了就改了
        global.showPop(
            {
                isFloat:true,vo:item,
                clazz:getPanelByType(item.panel_id),
                header:getPanelNameByType(item.panel_id)
            }
            );
    })
}

func();
//setTimeout(func, 2000);

