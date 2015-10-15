
'use strict';

var React = require('react');
import ValueGroup from '../util/ValueGroup.js'
import JobView from './JobView.js'
import XEditableText from "../Enhanced/XEditableText.js";
import {Grid, Row,Col,Button,DropdownButton,MenuItem,Panel,Nav,NavItem} from 'react-bootstrap';

var global=window;
var ProjectActions = global.ProjectActions;
var ProjectStore = global.ProjectStore;
var Dialog = require('rc-dialog');

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
        this.setState(model);
    },

    renderVarList:function(){
        var vo=this.state;
        var ps={};
        ps.list=vo.vars;
        ps.creator=global.cfgs.varTmp;
        ps.viewFilters=global.cfgs.varTmp.viewFilters;
        ps.header='变量列表';

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
        ps.creatorAsync=this.createJobFunc.bind(this);
        ps.renderClazz=JobView;
        ps.header='内容列表';
        //ps.viewFilters=global.cfgs.varView;

        return <ValueGroup {...ps}></ValueGroup>
    },

    render: function() {
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
