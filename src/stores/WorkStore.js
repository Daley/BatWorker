'use strict';

var global=window;
var Reflux = require('reflux');
var Freezer=require("freezer-js");
var SpaceActions = global.SpaceActions;
var ProjectActions=global.ProjectActions;

var _ = require('lodash');
var fs=require('fs');
var gui = require('nw.gui');
var process=require('process');
var path=require('path');

const localStorageKey = "bat_worker";

var WorkStore = Reflux.createStore({
    listenables: SpaceActions,
    //{storeHistory:[],currentStore:0};

    createIncId:function(){
    	//return ++this.workVo.idCreater;
        var idx=++this.idCreater;
        //this.workVo.set('idCreater',idx);
        return idx;
    },

    onSelectSpace:function(id){
        if(id==this.workVo.curProject){
            return;
        }

        let {space,project}=this.findProject(id);
        console.log('onSelectSpace',id);
        console.dir(project);
        if(project){
            //ProjectActions.changeAction(project);
            this.workVo.set("curProject",id);
        }
        
    },

    onExtand:function(){
        var b=!this.extanded;
        var vo=global.ProjectStore.model;
        if(vo){
            global.log(b?"展开":"收起");
            var list=vo.jobs;
            for(var key in list){
                list[key].set("expanded",b);
            }
        }

        this.extanded=b;
    },

    onTest:function(){
        if(this.testId&&this.testId>0){
            clearInterval(this.testId);
            global.log("结束测试");
            return;
        }
       // var vo=global.ProjectStore.model;       

        //if(vo==null){
           // vo=this.findProject(this.workVo.curProject).project
        //}
            global.log("开始测试");
           // console.dir(vo);
           var work=this.freezer;
            var getVar=function(){
                //console.dir(work);
                var vo = work.get().space[1].projects[1];
                //var vo=this.findProject(this.workVo.curProject).project
                var idx=(Math.random()*vo.vars.length)>>0;
                console.log('idx '+idx);
                return vo.vars[idx];
            }

            var getJob=function(){
                //console.dir(work);
                var vo = work.get().space[1].projects[1];
                //var vo=this.findProject(this.workVo.curProject).project
                var idx=(Math.random()*vo.jobs.length)>>0;
                console.log('idx '+idx);
                return vo.jobs[idx];
            }
            
            this.testId=setInterval(function(){
                var s=Math.random();
                if(s<0.7){
                    var val=getVar();
                    console.log('ffffffffffffffff ' +s);
                    console.dir(val);
                    val.set("val",s);
                }else{
                    getJob().set("desc",s+"");
                }
            }, 100);
    },

    onUndo: function(){
        this.moveHistory(-1);        
    },

    onRedo: function(){
        this.moveHistory(1);
    },

    moveHistory:function(dir){
        var idx=this.state.currentStore + dir;
        console.log('dengyp moveHistory:'+idx);
        if(idx>=0&&idx<this.state.storeHistory.length){
            this.state.currentStore=idx;
            this.freezer.set( this.state.storeHistory[ idx] );
            console.log('dengyp ............moveHistory:'+idx);            
            //updateWorkVo();
        }else if(idx<0){
            global.log("历史记录：不能再撤了")
        }else if(idx>this.state.storeHistory.length){
            global.log("历史记录：不能再前进了")
        }
        
    },

    updateWorkVo:function(){
        console.log('--------::: dengyp updateWorkVo :::--------------');
        this.workVo=this.freezer.get();
        //return ;
        this.trigger(this.workVo);
        
        //console.dir(this.workVo);

        if(this.workVo.curProject>0){
            global.ProjectActions.changeAction(this.findProject(this.workVo.curProject).project);
        }
        global.QueueActions.changeQueue(this.workVo.queues);
    },

    onSaveSpace:function(evt){
        this.freezer.get().set("idCreater",this.idCreater);           
    	localStorage.setItem(localStorageKey, JSON.stringify(this.freezer.get()));
        
        if(evt){
            global.log('保存成功！');
        } 
    },

    onExportSpace:function(){
        $("#saveFile").trigger("click");
    },

    onImportSpace:function(){
        $("#openFile").trigger("click");
    },

    onClearImport:function(){
        $("#clearImportEle").trigger("click");
    },

    clearImport:function(val){
        global.log('清空数据并导入文件',val);
        var str=fs.readFileSync(val, 'utf-8');
        var obj=JSON.parse(str);
        if(obj&&obj.space){
            this.workVo.set("space",obj.space);            
        }
    },


    importSpace:function(val){
        global.log('导入文件',val);
        var str=fs.readFileSync(val, 'utf-8');
        var obj=JSON.parse(str);
       
        if(obj&&obj.space){
            for(var key in obj.space){
                var theSp=obj.space[key];
                var sp=this.findSpace(theSp.name);
                if(sp){
                    for(var k in theSp.projects){
                        var obj=global.cloneCreate(global.cloneCreate(theSp.projects[k]));                        
                        sp.projects.push(obj);
                    }
                }else{
                    var obj=global.cloneCreate(theSp);               
                    this.workVo.space.push(obj);
                }
            }
           //this.trigger(this.workVo);
        }
       
    },

    exportSpace:function(val){
        global.log('导出文件',val);
        fs.writeFileSync(val, JSON.stringify(this.workVo,null,4), 'utf-8');
    },


    //公开方法

    initStore:function(){
            var loadedList = localStorage.getItem(localStorageKey);
           // loadedList="null"
            if (!loadedList ||loadedList=="null") {
                // If no list is in localstorage, start out with a default one
                console.log('WorkStore.js init 1');
               	this.workVo=window.cfgs.workTmp;
            } else {
                this.workVo=JSON.parse(loadedList);
                console.log('WorkStore.js init 2');
            }

            //后加的数据
            if(this.workVo.panels==undefined){
                this.workVo.panels=window.cfgs.panelsTmp;
            }
            if(this.workVo.queues==undefined){
                 this.workVo.queues=window.cfgs.queuesTmp;
            }            

            console.dir(this.workVo);
            this.freezer = new Freezer(this.workVo)
            this.state={storeHistory:[this.freezer.get()],currentStore:0};

            var me=this;
            this.freezer.on('update', function( updated ){                
                var storeHistory, nextIndex;
                
                console.log('.....update....');
                // Check if this state has not been set by the history
                if( updated != me.state.storeHistory[ me.state.currentStore ] ){
     
                    nextIndex = me.state.currentStore + 1;
                    storeHistory = me.state.storeHistory.slice( 0, nextIndex );
                    storeHistory.push( updated );
     
                    // Set the state will re-render our component
                    me.state.currentStore=nextIndex;
                    me.state.storeHistory=storeHistory;
                    //me.freezer.set(updated);                    
                    
                    console.dir(me.state);
                    me.updateWorkVo();
                }
                else {
                    me.updateWorkVo();
                }
            });
            this.updateWorkVo(); //不知道要不要的
            this.idCreater=this.workVo.idCreater;

            var ep=this.exportSpace;
            var ip=this.importSpace;
            var cip=this.clearImport;

            $("#saveFile").change(function(evt) {
                ep($(this).val());
            });
            
            $("#openFile").change(function(evt) {
                ip($(this).val());
            });

            $("#clearImportEle").change(function(evt) {
                cip($(this).val());
            });

           // var kh=this.onSaveSpace;
           // var keyUtil=require('../libs/KeyShort.js');
           // keyUtil.registerKey('Ctrl+Alt+B',kh);
            //setInterval(kh, 30000);
        global.keyMgr.register('ctrl_s',this.onSaveSpace.bind(this));

        global.keyMgr.register('ctrl_b',this.onPublish.bind(this));
        global.keyMgr.register('ctrl_z',this.onUndo.bind(this));
        global.keyMgr.register('ctrl_y',this.onRedo.bind(this));
        global.keyMgr.register('ctrl_e',this.onExtand.bind(this));
        global.keyMgr.register('ctrl_t',this.onTest.bind(this));
    },

    onPublish:function(){
        //这是只有我用的。快速导出数据的
        var file=path.join(window.indexPath,'../tmp/svn/export.data');
        var file2=path.join(window.indexPath,'../tmp/export.data');
        var str=JSON.stringify(this.workVo);
        var vo=JSON.parse(str);
        var list=[];
        for(var i=0;i<vo.space.length;i++){
            if(vo.space[i].name!="BatWorker"){
                list.push(vo.space[i]);
            }
        }
        vo.space=list;

        fs.writeFileSync(file, JSON.stringify(vo,null,4), 'utf-8');
        fs.writeFileSync(file2, str, 'utf-8');
        window.log(".");

    },

    //return {space:spaceVo,project:projectVo}
    findProject:function(id){
        var list=this.workVo.space;
        for(let key in list){
            var vo=list[key];
            var len=vo.projects.length;
            for(var i=0;i<len;i++){
                var p=vo.projects[i];
                if(p.id==id){
                    return {space:vo,project:p};
                }
            }          
           
        }
        return {};
    },

    findSpace:function(name){

        var list=this.workVo.space;
        let idx=_.findIndex(list, { 'name': name });
        return list[idx];
    }

});

module.exports = WorkStore;