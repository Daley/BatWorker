
'use strict';

var React = require('react');
import JobView from './JobView.js'
import {Grid, Row,Col,Button,DropdownButton,MenuItem,Panel,Nav,NavItem} from 'react-bootstrap';

import {XEditableText,ValueGroup,ToggleBtn} from "../../common/index.js";

var global=window;
var ProjectActions = global.ProjectActions;
var ProjectStore = global.ProjectStore;

var ProjectView = React.createClass({

    getDefaultProps: function() {
        return {};
    },

    getInitialState: function() {
        return ProjectStore.model;
    },

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(this.onModelChange);
    },

    componentWillUnmount() {
        this.unsubscribe();
    },

    onModelChange: function(model) {
        console.log('dengyp ProjectStore.onModelChange');
        this.setState(model);        
    },

    //非常重要，干掉影响性能
    shouldComponentUpdate( nextProps, nextState ){
        //return true;
        //console.dir(nextState);
        //console.dir(this.state);
       // console.log(nextState!=this.state);
        return nextState != this.state;
    },

    renderVarList:function(){
        //global.log('################ renderVarList');
        var vo=this.state;
        var ps={};
        ps.list=vo.vars;
        ps.creator=global.cfgs.varTmp;
        ps.viewFilters=global.cfgs.varTmp.viewFilters;
        ps.header='变量列表';
        //ps.showOne=true;

        return <ValueGroup {...ps}></ValueGroup>
    },

    createJobFunc:function(idx,cb){
        //弹对话框
        console.dir(this);
        var act="";
        var handleSelect=function(key){
            act=key;
        }
         var vo=this.state;
        var list=vo.jobs;
        var ps={           
            okHandler:function(){
                console.log('select act',act);
                if(act!=""){
                    global.cfgs.createJobByType(list,idx,act);
                    cb();
                }
            },
            cancelHandler:function(){

            },
            renderHeader:function(){
                return <h1>选择内容项</h1>
            },

            renderBody:function(){
                var cfgs=global.cfgs.jobTypes;
                return (

                    <Nav bsStyle="pills" onSelect={handleSelect}>
                        {
                            cfgs.map(function(item){
                                return <NavItem eventKey={item.type} >{item.name}</NavItem>
                            })
                        }                     
                    </Nav>
                    );                 
                
            }

        }

       global.showPop(ps);
    },

    renderJobList:function(){
         var vo=this.state;
        var ps={};
        ps.list=vo.jobs;
        ps.creatorAsync=this.createJobFunc;
        ps.renderClazz=JobView;
        ps.header='内容列表';
        //ps.viewFilters=global.cfgs.varView;

        return <ValueGroup {...ps}></ValueGroup>
    },

    render: function() {
        //window.log("ProjectView.js render");
         //{this.renderJobList()}{this.renderJobList()}  
        var vo=this.state;
        return (
            <Panel {...this.props} header={"项目"+'--'+vo.name} bsStyle="info"> 
                <Grid>                         
                    {this.renderVarList()}                
                  {this.renderJobList()}
                   
                </Grid>          
            </Panel>
            );
    }
});

module.exports = ProjectView;
