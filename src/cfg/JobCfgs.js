var exec = require( 'child_process' ).exec;
var fs=require('fs');
var Q=require('q');

var jobs={};
var global=window;

var deleteFolderRecursive = function(path) {

    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

jobs.clearDirTmp={
	id:1,
	type:'clearDir',
	desc:'',
	name:'删除目录',
	dirs:[],
	viewFilters:{
		desc:'描述',
		dirs:'目录列表'
	},

	exec:function(vo){
		global.log('删除目录',vo.dirs);		
		console.dir(vo);
		var getOne=function(path){
			 console.log('start clearDir');
			 global.log('RMDIR /S /Q '+path);
			var call=function(resolve, reject, notify) {
				exec( 'RMDIR /S /Q ' + path, function ( err, stdout, stderr ){
				  if(err){
				  	global.log(err);
				  	resolve("失败删除目录");
				  	//reject(err);
				  }else{
				  	resolve("成功删除目录");
				  }
				});
			};
			return Q.Promise(call);
		}
		return Q.any(vo.dirs.map(getOne));
	}
}

jobs.copyFileTmp={
	id:2,
	type:'copyFile',
	desc:'',
	copyFrom:'',
	copyTo:'',
	name:'复制文件',
	viewFilters:{
		desc:'描述',
		copyFrom:'源文件',
		copyTo:'目标文件'
	},
	exec:function(vo){
		var cpFile = require('cp-file');
		return cpFile(vo.copyFrom, vo.copyTo,{overwrite:true});

		return Q.Promise(function(resolve, reject, notify) {
			global.log('复制文件',vo.copyFrom,vo.copyTo);	
			var cpFile = require('cp-file');
 			console.dir(vo);
 			return;
 			//return;
			cpFile(vo.copyFrom, vo.copyTo, function (err) {
			    if(err){
				  	reject(err);
				  	global.log('复制文件失败');	
				  }else{

				  	global.log('成功复制文件');	
				  	resolve("成功复制文件");
				 }
			});
    	});
	}
}

jobs.copyDirTmp={
	id:3,
	type:'copyDir',
	desc:'',
	copyFrom:'',
	copyTo:'',
	name:'复制目录',
	viewFilters:{
		desc:'描述',
		copyFrom:'源目录',
		copyTo:'目标目录'
	},
	exec:function(vo){
		return Q.Promise(function(resolve, reject, notify) {
			var copyDir = require('copy-dir');
			global.log('复制目录',vo.copyFrom,vo.copyTo);	
			console.dir(vo);
			var str='xcopy "'+vo.copyFrom+'" "'+vo.copyTo+'" /E /I /F /Y';	///D 去掉了,不进行时间比较
			exec( str, function ( err, stdout, stderr ){
				  if(err){
				  	reject(err);
				  }else{
				  	resolve("成功复制目录")
				  }
				});
					
			return;
			copyDir(vo.copyFrom, vo.copyTo,null,function(err){
				if(err){
					console.log('dengyp copyDir error'+err);
					reject(err);
				}else{
					resolve("成功复制目录")
				}
			});
    	});
	}
}

jobs.combinXmlTmp={
	id:4,
	type:'combinXml',
	desc:'',
	saveAs:'',
	xmls:[],
	nodes:[],
	name:'合并xml',
	viewFilters:{		
		desc:'描述',
		saveAs:'另存为',
		xmls:'文件列表 第一个为主文件',
		nodes_d:'节点列表 如application.test'
	},
	exec:function(vo,vars){
		if(vo.xmls.length<2){
			//return null;
		}
		var dealData=function(data){
			data=window.globalReplace(data,vars);
			//console.dir(data);
			var parser=new DOMParser();
			return parser.parseFromString(data,"text/xml");
		}
		var q=Q.Promise(function(resolve, reject, notify) {
			global.log('合并xml',vo.xmls[0]);
			fs.readFile(vo.xmls[0],'utf8',function(err,data){
				if(err){
					reject(err);
				}else{
					//默认进行替换的
					//data=window.globalReplace(data,vars);
					resolve(dealData(data));
				}
			});
    	});

    	var runText=function(url){
    		return q.then(function(result){
				//console.log('dengyp replaceVarTmp '+result);
				global.log('合并xml处理',url);
				//console.dir(result);
				var data=fs.readFileSync(url,'utf8');
				var xml=dealData(data);
				vo.nodes=[     "uses-permission",
                                "application.activity",
                                "application.meta-data",
                                "application.receiver",
                                "application.service",
                                "application.provider"
                            ];
				//console.dir(xml);
				for(var i=0;i<vo.nodes.length;i++){
					var arr=vo.nodes[i].split(".");
					console.log('dengyp runNext',vo.nodes[i]);
					console.dir(arr);
					var node=result.documentElement;
					var list=xml.getElementsByTagName(arr[0]);
					for(var j=1;j<arr.length;j++){
						//console.log('fuck here',arr[j]);
						node=node.getElementsByTagName(arr[j-1])[0];
						//console.log('fuck why');
						list=list[0].getElementsByTagName(arr[j]);
						console.log('fuck here end',arr[j]);
					}
										
					
					for(var j=0;j<list.length;j++){
						node.appendChild(list[j].cloneNode(true));
						//node.appendChild('\n\r');
					}
					console.dir(node);
					console.dir(list);
				}

				return result;
			});
    	};

    	for(var i=1;i<vo.xmls.length;i++){
    		q=q.then(runText(vo.xmls[i]));
    	}
    	return q.then(function(result){

    		var str=(new XMLSerializer()).serializeToString(result);
    		str=str.replace(/\/\>\</g,"/>\n<");//str=str.replace(/\>\</g,">\n\t<");
    		str=str.replace(/\>\</g,">\n<");//str=str.replace(/\>\</g,">\n\t<");

    		console.log('combinXml result');
    		console.dir(result);
			fs.writeFileSync(vo.saveAs,str,"utf8");
			return str;
    	});
	}
}


jobs.readFileTmp={
	id:5,
	type:'readFile',
	desc:'',	
	name:'读取文件',
	fileName:'',
	sons:[],
	format:'utf-8',
	viewFilters:{
		desc:'描述',
		fileName:'文件名',
		format:'格式',
		sons:'子项'
	},

	exec:function(vo,vars){
		var q=Q.Promise(function(resolve, reject, notify) {
			global.log('读取文件',vo.fileName);
			fs.readFile(vo.fileName,vo.format,function(err,data){
				if(err){
					reject(err);
				}else{
					//默认进行替换的
					data=window.globalReplace(data,vars);
					resolve(data);
				}
			});

    	});
		vo.sons.forEach(function(vo){
			q=window.cfgs.getJobExe(vo,vars,q);
		});
		return q;
	}

}

jobs.replaceVarTmp={
	id:6,
	type:'replaceVar',	
	parent:[5],
	name:'查找替换',
	find:'',
	replace:'',
	viewFilters:{
		desc:'描述',
		find:'查找',
		replace:'替换'
	},
	exec:function(vo,vars,q){
		return q.then(function(result){
			//console.log('dengyp replaceVarTmp '+result);
			global.log('查找替换');
			var myDefer = Q.defer();
		    
		    setTimeout(function(){
		    	result=result.replace(new RegExp(vo.find,'g'),vo.replace);
		    	myDefer.resolve(result);
		    }, 100);
		    return myDefer.promise;
		});
	}
}

jobs.saveFileTmp={
	id:7,
	type:'saveFile',	
	parent:[5,10],
	name:'存储文件',
	desc:'',
	url:'',
	viewFilters:{
		desc:'描述',
		url:'存储位置'
	},
	exec:function(vo,vars,q){
		return q.then(function(result){
			global.log('存储文件',vo.url);
			fs.writeFileSync(vo.url,result,"utf8");
			return result;
		});
	}

}

jobs.runCmdTmp={
	id:8,
	type:'runCmd',
	name:'运行命令',
	desc:'',
	cmdStr:'',
	breakError:'true',
	viewFilters:{
		desc:'描述',
		cmdStr:'命令',
		breakError:'出错中断'
	},
	exec:function(vo,vars,q){
		var call=function(resolve, reject, notify) {
				//return;
			global.log('运行命令',vo.cmdStr);
			//global.log('运行命令',global.cfgs.getVarByKey(vars,"root"));
				exec(vo.cmdStr,{ cwd: global.cfgs.getVarByKey(vars,"root")}, 
					function ( err, stdout, stderr ){
						console.log('end runCmdTmp',err);
					  if(err){
					  	if(vo.breakError=='true'){
							reject(err);
					  	}else{
							resolve("运行命令失败");
					 		global.log('运行命令失败',vo.cmdStr);
					  	}
					  	
					  }else{
					  	resolve("成功运行命令");
					 	global.log('成功运行命令',vo.cmdStr);
					  }
				});
			};

		return Q.Promise(call);
	}
}

jobs.delFileTmp={
	id:9,
	type:'delFile',
	name:'删除文件',
	desc:'',
	files:[],
	viewFilters:{
		desc:'描述',
		files:'文件列表'
	},
	exec:function(vo){
		global.log('删除文件',vo.files);		
		
		var getOne=function(path){
			console.log('start delFile');
			console.log('del '+path);
			var call=function(resolve, reject, notify) {
				exec( 'del ' + path, function ( err, stdout, stderr ){
				  if(err){
				  	reject(err);
				  }else{
				  	resolve("成功删除文件 "+path);
				  }
				});
			};
			return Q.Promise(call);
		}
		return Q.any(vo.files.map(getOne));
	}
}


jobs.newFileTmp={
	id:10,
	type:'newFile',
	name:'新建文件',
	desc:'',
	sons:[],
	viewFilters:{
		desc:'描述',
		sons:'子项'
	},
	exec:function(vo,vars){
		global.log('新建文件');
		var myDefer = Q.defer();
   		setTimeout(function(){
    		myDefer.resolve('');
    	}, 100);

		var q = myDefer.promise;
		vo.sons.forEach(function(vo){
			q=window.cfgs.getJobExe(vo,vars,q);
		});
		return q;
	}
}

jobs.appendStrTmp={
	id:11,
	type:'appendStr',	
	parent:[5,10],
	name:'追加内容',
	desc:'',
	content:'',
	viewFilters:{
		desc:'描述',
		content:'内容'
	},
	exec:function(vo,vars,q){
		return q.then(function(result){
			var myDefer = Q.defer();
		    
		    setTimeout(function(){
		    	
		    	result+=vo.content;
		    	window.log("fuck append:"+vo.content,result);
		    	myDefer.resolve(result);
		    }, 100);
		    return myDefer.promise;
		});
	}

}

jobs.xchgDir={
	id:12,
	type:'xchgDir',	
	name:'交换目录或文件',
	dir1:"",
	dir2:"",
	desc:'',
	viewFilters:{
		desc:'描述',
		dir1:'目录或文件1',
		dir2:'目录或文件2',
	},
	exec:function(vo,vars,q){
		var arr=[];
		var tmp=(vo.tmp==null|| vo.tmp=="")?global.indexPath+'/tmp_chg':vo.tmp;	
		tmp=tmp.replace(/\//g,"\\");
		try{
			if(fs.existsSync(tmp)==false){
				fs.mkdirSync(tmp);
			}else{
				deleteFolderRecursive(tmp);
			}
		}catch(e){			
			global.log(e);
			return null;
		}
		//console.dir(vo);
		//return;
		var tmp=(vo.tmp==null|| vo.tmp=="")?vo.dir1+"_tmp":vo.tmp;
-		arr.push("move "+vo.dir1+" "+tmp);
-		arr.push("move "+vo.dir2+" "+vo.dir1);
-		arr.push("move "+tmp+" "+vo.dir2);
		/*
		arr.push('xcopy "'+vo.dir1+'" "'+tmp+'" /E /I /F /Y');
		arr.push('RMDIR /S /Q '+vo.dir1);
		arr.push('mkdir '+vo.dir1);
		arr.push('xcopy "'+vo.dir2+'" "'+vo.dir1+'" /E /I /F /Y');
		arr.push('RMDIR /S /Q '+vo.dir2);
		arr.push('mkdir '+vo.dir2);
		arr.push('xcopy "'+tmp+'" "'+vo.dir2+'" /E /I /F /Y');
		arr.push('RMDIR /S /Q '+tmp);
		*/
		var myDefer = Q.defer();
   		setTimeout(function(){
    		myDefer.resolve('');
    	}, 100);

		var q = myDefer.promise;
		var getOne=function(cmd){
			var call=function(resolve, reject, notify) {
				
				//setTimeout(function(){
				//	global.log("运行命令："+cmd);
				//	resolve();
				//}, 300);
				//return;
				exec(cmd,function ( err, stdout, stderr ){
					console.log('end runCmdTmp',cmd,err);
					  if(err){
					  	if(vo.breakError=='true'){
							reject(err);
					  	}else{
							resolve("运行命令失败" +cmd);
					 		//global.log('运行命令失败',cmd);
					  	}					  	
					  }else{
					  	resolve("成功运行命令"+cmd);
					 	//global.log('成功运行命令',cmd);
					  }
				});

			};
			return Q.Promise(call);
		}

		for(var i=0;i<arr.length;i++){
			var cmd=arr[i];
			q=q.then(function(cmd){
				return getOne(cmd);
			}.bind(null,cmd));
		}
		return q;
	}

}



export default jobs;