var AppCfgs={};

AppCfgs.spaceActions=[	
    'exportSpace',
    'importSpace',
    'clearImport',   
    'selectSpace',
    'saveSpace'
]

AppCfgs.queueActions=[
    'addToQueue',
    'changeQueue',
    'runQueue',
    'runJob',
    'cleanAll'
];

AppCfgs.spaceMenu=[
	{act:'saveSpace',label:"保存"},
	{act:"exportSpace",label:"导出"},
	{act:"importSpace",label:"导入"},
	{act:"clearImport",label:'清空&导入'}
]

AppCfgs.logActions=[
	'addLog',
	'cleanLog'
]

AppCfgs.cutViewActions=[
	'cutView'
]

AppCfgs.projectActions=[
	 'changeAction'
]

AppCfgs.projectMenu=[	
	{act:'runProject',label:"运行"}	
]

AppCfgs.panelsTmp=[
	{
		panel_id:'jobQueue',
		left:500,
		top:300,
		width:300,
		height:150
	},
	{
		panel_id:'logView',
		left:500,
		top:600,
		width:300,
		height:400
	},
	{
		panel_id:'cutView',
		left:500,
		top:600,
		width:300,
		height:400
	}
]

AppCfgs.queuesTmp=[];
//模板

AppCfgs.workTmp={					
					curSpace:0,
					curProject:0,
					idCreater:0,
					space:[],
					panels:AppCfgs.panelsTmp,
					queues:AppCfgs.queuesTmp
				};

AppCfgs.spaceTmp={					
					id:0,
					name:'空间名',
					projects:[]
				};

AppCfgs.projectTmp={
	id:0,
	name:'项目名',
	vars:[],
	jobs:[]
}

AppCfgs.varTmp={
	id:0,
	desc:'',
	name:'',
	val:'',
	viewFilters:{
		name:"变量名",
		val:"值",
		desc:"说明"
	}
}

var jobs=require("./JobCfgs.js");
AppCfgs.jobs=jobs;


AppCfgs.createJobByType=function(list,idx,type){
      for(var key in jobs){
      	var jobTmp=jobs[key];
      	if(jobTmp.type==type){
      		var obj=window.cloneCreate(jobTmp);
      		obj.expanded=true;
      		list.splice(idx,0,obj);
      		return;
      	}
      }
      list.splice(idx,0,{name:"error"+type}); 
      //return list.push({name:"error"+type});
    }

AppCfgs.getTopJobs=function(pId){
	console.log('dengyp getTopJobs:',pId);
	var arr=[];
	for(var key in jobs){
		var job=jobs[key];
		console.log(job.parent);
		if(job.parent==pId||(job.parent&&job.parent.indexOf(pId)>-1)){
			arr.push({type:job.type,name:job.name});
		}		
      }
     return arr;
}

AppCfgs.getSonTypes=function(type){
	var pId=0;
	console.log("gogogogogoog");
	console.dir(jobs);
	for(var key in jobs){
		if(jobs[key].type==type){
			pId=jobs[key].id;
			break;
		}
	}
	
    return AppCfgs.getTopJobs(pId);
}



AppCfgs.getViewFilter=function(type){
	 for(var key in jobs){
      	var jobTmp=jobs[key];
      	if(jobTmp.type==type){
      		return jobTmp.viewFilters;
      	}
      }
      return {name:'名字 没有viewFilters'};
}

AppCfgs.getJobExe=function(vo,vars,q){
	
	for(var key in jobs){
      	var jobTmp=jobs[key];
      	if(jobTmp.type==vo.type){
      		return jobTmp.exec(vo,vars,q);
      	}
      }
    return null;
}

AppCfgs.getVarByKey=function(vars,name){
	for(var key in vars){
      	var varTmp=vars[key];
      	if(varTmp.name==name){
      		return varTmp.val;
      	}
    }
    return null;
}

AppCfgs.jobTypes=AppCfgs.getTopJobs(undefined);



export default AppCfgs;
