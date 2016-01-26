'use strict';
//require('./assets/css/bootstrap.min.css');

//require('./assets/css/font-awesome.min.css');
//require('./libs/bootstrap3-editable/css/bootstrap-editable.css');
//require('./libs/bootstrap3-editable/js/bootstrap-editable.js');


import Reflux from 'reflux';
import React from 'react';
//import * as ReactBootstrap from 'react-bootstrap';
import {Grid, Row,Col,Modal,Button} from 'react-bootstrap';
import {PopMgr,KeyMgr,ValueGroup,PopGroup} from "./common/index.js";

import AppCfgs from "./cfg/AppCfgs.js";
//actions && stores
var global=window;
global.cfgs=AppCfgs;
global.SpaceActions=Reflux.createActions(AppCfgs.spaceActions);
global.ProjectActions=Reflux.createActions(AppCfgs.projectActions);
global.QueueActions=Reflux.createActions(AppCfgs.queueActions);
global.LogActions=Reflux.createActions(AppCfgs.logActions);
global.CutViewActions=Reflux.createActions(AppCfgs.cutViewActions);

global.lang=require("./cfg/LangCfg.js");
global.keyMgr=KeyMgr;
global.keyMgr.init($(document));

global.WorkStore=require("./stores/WorkStore.js");
global.ProjectStore=require("./stores/ProjectStore.js");
global.QueueStore=require("./stores/QueueStore.js");
global.LogStore=require("./stores/LogStore.js");
global.CutViewStore=require("./stores/CutViewStore.js");

global.popMgr=PopMgr;
global.popMgr.init(document.getElementById('pop_layer'))

require('./common/GlobalFunc.js');

var _ = require('lodash');

console.dir(AppCfgs);

global.WorkStore.initStore();
console.log("workVo");
console.dir(global.WorkStore);

import HeaderView from './views/header/Header.js'
var SpaceList = require("./views/body/SpaceList.js");
var ProjectView = require("./views/body/ProjectView.js");

// <HeaderView/>
var Main = React.createClass({
    render: function() {
       return   <div style={{width:"100%",height:"100%"}}>
                    
                    <Grid fluid={ true } style={{width:"100%",height:"100%"}}>

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
                    </Grid>
                </div>
    },
    renderd: function() {
       return   <div style={{width:"100%",height:"100%"}}>
                    
                            <div style={{width:"30%",height:"100%"}}>
                                <SpaceList/>
                            </div>
                            <div style={{width:"70%",height:"100%"}}>
                                <ProjectView/>
                            </div>                    
                </div>
    }
});

React.render(<Main/>, document.getElementById('content'));
//global.popMgr=React.createElement(PopGroup);
React.render(<PopGroup/>,document.getElementById('panel_layer'));

//panels
var showAllPanels=function(){
    var panels=global.WorkStore.workVo.panels;
    if(panels.length==2){
        panels.push(global.cfgs.panelsTmp[2]);
    }
    console.dir(panels);
    global.clearPop();

    var func=function(){
        panels.map(function(item){
            //传的是引用 ，改了就改了
            var cz=global.getPanelByType(item.panel_id);
            if(cz==null){
                return;
            }
            global.showPop(
                {
                    isFloat:true,vo:item,
                    clazz:cz,
                    header:global.getPanelNameByType(item.panel_id)
                }
                );
        })
    }
    func();
}
showAllPanels();



var renderHelpBody=function(){
        return (<div>
                    <h2>快捷键</h2>
                    <h5>Ctrl+S 保存</h5>
                    <h5>Ctrl+Q 把当前项目加到队列</h5>
                    <h5>Ctrl+R 运行当前项目</h5>
                    <h5>Ctrl+Z 撤消</h5>
                    <h5>Ctrl+Y 重做</h5>
                    <h5>Ctrl+H 本帮助</h5>
                    <hr />
                    <h2>balalalala</h2>
                </div>)
}

var showHelp=function(){
        window.log("显示帮助");
        window.popMgr.showInfo('简单的帮助',renderHelpBody());
}
window.keyMgr.register('ctrl_h',showHelp);
