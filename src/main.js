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
global.CutViewActions=Reflux.createActions(AppCfgs.cutViewActions);

global.lang=require("./cfg/LangCfg.js");
global.keyMgr=require("./common/KeyMgr.js");
global.keyMgr.init($(document));

global.WorkStore=require("./stores/WorkStore.js");
global.ProjectStore=require("./stores/ProjectStore.js");
global.QueueStore=require("./stores/QueueStore.js");
global.LogStore=require("./stores/LogStore.js");
global.CutViewStore=require("./stores/CutViewStore.js");

global.popMgr=require("./common/PopMgr.js");
global.popMgr.init(document.getElementById('pop_layer'))

require('./common/GlobalFunc.js');

import ValueGroup from './components/util/ValueGroup.js'
import PopGroup from './components/util/PopGroup.js'
import HeaderView from './components/header/Header.js'

var _ = require('lodash');

console.dir(AppCfgs);

global.WorkStore.initStore();
console.log("workVo");
console.dir(global.WorkStore);

var SpaceList = require("./components/body/SpaceList.js");
var ProjectView = require("./components/body/ProjectView.js");

// <HeaderView/>
var Main = React.createClass({
    render: function() {
       return   <div>
                    <HeaderView/>
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

//var TestEditor=require('./components/TestEditor.js')
React.render(<Main/>, document.getElementById('content'));
//global.popMgr=React.createElement(PopGroup);
React.render(<PopGroup/>,document.getElementById('panel_layer'));

//panels
var panels=global.WorkStore.workVo.panels;
if(panels.length==2){
    panels.push(global.cfgs.panelsTmp[2]);
}
console.dir(panels);
var func=function(){
    panels.map(function(item){
        //传的是引用 ，改了就改了
        global.showPop(
            {
                isFloat:true,vo:item,
                clazz:global.getPanelByType(item.panel_id),
                header:global.getPanelNameByType(item.panel_id)
            }
            );
    })
}

func();
//setTimeout(func, 2000);

/*
var Freezer = require('freezer-js');
var freezer = new Freezer({
    a: {x: 1, y: 2, z: [0, 1, 2] },
    b: [ 5, 6, 7 , { m: 1, n: 2 } ],
    c: 'Hola',
    d: null // It is possible to store whatever
});

var state = freezer.get();

freezer.on('update', function( newValue ){    
    console.log( 'ddddddddddddddddd I was updated' );
});

var updated = state.set( 'e', 4 ); // On next tick it will log 'I was updated'
console.log('fffffffffffffffffffffffffffffffffffffffffffffffffffff');
console.dir(state);*/

