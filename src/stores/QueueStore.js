'use strict';

var Reflux = require('reflux');
var QueueActions = window.QueueActions;
var Q = require("q");
var _ =require("lodash");

var defaultModel = [];
var isRunning=false;
var global=window;


var QueueStore = Reflux.createStore({
    model: defaultModel,
    listenables: QueueActions,

    onChangeQueue: function(list) {
    	this.model=list;
        this.trigger(this.model);
    },

    onAddToQueue:function(id){
        if(this.model.indexOf(id)!=-1){
            window.log("已经存在于队列");
            return;
        }
    	this.model.push(id);
    	this.trigger(this.model);
    },

    getJob:function(project,job,q){
    	//替换变量   	

    	var vars=project.vars;
    	var replaceAndClone=function(obj){
    		if(_.isString(obj)){
    			return global.globalReplace(obj,vars);
    		}

    		var newObj={};    		
    		for(var key in obj){
	    		var value=obj[key];
	    		if(_.isString(value)){
	    			value=global.globalReplace(value,vars);
	    		}else if(_.isArray(value)){
	    			//value=replaceAndClone(value);
	    			var res=[];
	    			for(var i=0;i<value.length;i++){
	    				res[i]=replaceAndClone(value[i]);
	    			}
	    			value=res;
	    		}
	    		newObj[key]=value;    		
	    	}
	    	return newObj;
	    }

    	
    	var newJob=replaceAndClone(job);
    	
    	console.log("dengy prunJob",project.name);
    	console.dir(newJob);
    	return global.cfgs.getJobExe(newJob,project.vars,q);
    },

    runProject:function(id) {
    	var {space,project}=global.WorkStore.findProject(id);
        if(project==null){
            global.log("没找到项目:",id);
            return;
        }
        var q=Q.Promise(function(resolve, reject, notify) {
            window.log("开始运行项目",project.name);
            console.dir(project);
            resolve("开始运行项目"+project.name);
        });
    	
    	var getJob=this.getJob;
    	var getQueue=function(){
    		//var jobs=[];
    		for(var key in project.jobs){
                 
    			q=q.then(function(k){
                  console.log('getJob key',k);
                    return getJob(project,project.jobs[k],q);
                }.bind(null,key))
    		}
    		//return jobs;
            return q;
    	};
        return getQueue();
    	//return Q.all(getArr());
	},

    test:function(id){
        var q=Q.Promise(function(resolve, reject, notify) {
            setTimeout(function(){
                window.log("开始运行项目");
            }, 2000);

        });
        return q;
    },

    onRunQueue:function(){
        if(isRunning){
            global.log('有未完成的任务！');
            return;
        }

        var init=Q.Promise(function(resolve, reject, notify) {
            window.log("开始运行队列");
            resolve("开始运行队列");
        });

        var q=init;
        var ps=this.model;
        //var call=this.runPro
        //var q=init.promise;
        var call=this.runProject;

        for(var i=0;i<ps.length;i++){
            q=q.then(function(id){
                console.log('queue item',i);
                return call(id);
            }.bind(null,ps[i]));
        }
    	
        isRunning=true;
		q.then(function (result) {
            isRunning=false;
    		window.log("队列运行完成");
		},function(rejected){
            global.log("运行失败");
            global.log(rejected);
            isRunning=false;
        });



        
    },

    onRunJob:function(id){
       
        if(isRunning){
            global.log('有未完成的任务！');
            return;
        }
        isRunning=true;
    	this.runProject(id).then(function(result){
    		window.log("单个运行完成");
            isRunning=false;
    	},function(rejected){
            global.log("运行失败");
            global.log(rejected);
            isRunning=false;
        });
    },

    onCleanAll:function(){
        _.remove(this.model);
        this.onChangeQueue(this.model);
    }



});

module.exports = QueueStore;