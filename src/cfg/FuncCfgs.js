var FuncCfgs={}


FuncCfgs.randStr = function (cnt) {
    var strArr  ='ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    var str = "";
    var count = parseInt(cnt);
    for(var i = 0;i<count;i++)
    {
        str+=strArr.charAt(Math.random()*strArr.length);   
    } 
    return str;
};

FuncCfgs.randCallBack = function(cnt){
  var count = parseInt(cnt);
  var str = "";
  for(var i = 0;i<count;i++){
      str+="RubbishCallBack F"+FuncCfgs.randStr(10);
      str+="= new RubbishCallBack()"
      +"{\n@Override\n"
      +"public int runSth()\n"
      +"{\nreturn 0;\n"
	  +"}\n"
	  +"};\n";
  } 
  return str;
};
export default FuncCfgs;