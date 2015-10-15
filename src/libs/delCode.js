exec:function(vo,vars){
		if(vo.xmls.length<2){
			return null;
		}
		var dealData=function(data){
			data=window.globalReplace(data,vars);
			//console.dir(data);
			var parser=new DOMParser();
			return parser.parseFromString(data,"text/xml");
		}
		var q=Q.Promise(function(resolve, reject, notify) {
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
				console.log('combinXmlTmp runNext ffff');
				//console.dir(result);
				var data=fs.readFileSync(vo.xmls[0],'utf8');
				var xml=dealData(data);
				//console.dir(xml);
				for(var i=0;i<vo.nodes.length;i++){
					var arr=vo.nodes[i].split(".");
					console.log('dengyp runNext',vo.nodes[i]);
					console.dir(arr);
					var node=result.documentElement;
					var list=xml.getElementsByTagName(arr[0]);
					for(var j=1;j<arr.length;j++){
						console.log('fuck here',arr[j]);
						node=node.getElementsByTagName(arr[j-1])[0];
						console.log('fuck why');
						list=list[0].getElementsByTagName(arr[j]);
						console.log('fuck here end',arr[j]);
					}
					
					console.dir(node);
					console.dir(list);
					for(var j=0;j<list.length;j++){
						node.appendChild(list[j].cloneNode(true));
					}
				}

				return result;
			});
    	};

    	for(var i=1;i<vo.xmls.length;i++){
    		q=q.then(runText(vo.xmls[i]));
    	}
    	return q.then(function(result){

    		var str=(new XMLSerializer()).serializeToString(result);
    		console.log('combinXml result');
			fs.writeFileSync(vo.xmls[0],str,"utf8");
			return str;
    	});
	}
}