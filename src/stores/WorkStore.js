'use strict';

var global=window;
var Reflux = require('reflux');
var SpaceActions = global.SpaceActions;
var ProjectActions=global.ProjectActions;

var _ = require('lodash');
var fs=require('fs');

const localStorageKey = "bat_worker";

var WorkStore = Reflux.createStore({
    listenables: SpaceActions,

    createIncId:function(){
    	return ++this.workVo.idCreater;
    },

    onSelectSpace:function(id){
        let {space,project}=this.findProject(id);
        console.log('onSelectSpace',id);
        console.dir(project);
        if(project){
            ProjectActions.changeAction(project);
            this.workVo.curProject=id;
        }
        
    },

    onSaveSpace:function(){
        //global.log('dengyp onSaveSpace');
    	localStorage.setItem(localStorageKey, JSON.stringify(this.workVo));
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
        console.log('clearImport file',val);
        var str=fs.readFileSync(val, 'utf-8');
        var obj=JSON.parse(str);
        if(obj&&obj.space){
            this.workVo.space=obj.space;            
           this.trigger(this.workVo);
        }
    },


    importSpace:function(val){
        console.log('importSpace file',val);
        var str=fs.readFileSync(val, 'utf-8');
        var obj=JSON.parse(str);
        if(obj&&obj.space){
            for(var key in obj.space){
                var theSp=obj.space[key];
                var sp=this.findSpace(theSp.id);
                if(sp){
                    for(var k in theSp.projects){
                        sp.projects.push(global.cloneCreate(theSp.projects[k]));
                    }
                }else{
                    this.workVo.space.push(global.cloneCreate(theSp));
                }
            }
           this.trigger(this.workVo);
        }
    },

    exportSpace:function(val){
        console.log('exportSpace file',val);
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

            if(this.workVo.curProject>0){
                global.ProjectActions.changeAction(this.findProject(this.workVo.curProject).project);
            }
            global.QueueActions.changeQueue(this.workVo.queues);

            console.dir(this.workVo);

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

            var kh=this.onSaveSpace;
            var keyUtil=require('../libs/KeyShort.js');
            keyUtil.registerKey('Ctrl+Alt+B',kh);

            setInterval(kh, 30000);
    },

    //return {space:spaceVo,project:projectVo}
    findProject:function(id){
        var list=this.workVo.space;
        for(let key in list){
            var vo=list[key];
            //console.log("find id",id,key);
            //console.dir(vo);
            let idx=_.findIndex(vo.projects, { 'id': id });
            //console.log("finded",idx);
            if(idx>-1){
                return {space:vo,project:vo.projects[idx]};
            }
        }
        return {};
    },

    findSpace:function(id){

        var list=this.workVo.space;
        let idx=_.findIndex(list, { 'id': id });
        return list[idx];
    }

});

module.exports = WorkStore;