import ConfirmView from "./pop/ConfirmView.js"
import InfoView from "./pop/InfoView.js"
import React from 'react';

var  PopMgr={

    init:function(domEle){
    	//domEle.bind("keyup.ctrl_s",this.onKeyUp.bind(this));
    	this.domEle=domEle;
        
    },

    //确定和取消
    showConfirm:function(title,body,callback){
        console.log('dddddddddddddddddddddddddd');
        console.dir(this.domEle);
        var cb=function(res){
            if(res){
                callback();
            }
            React.render(<div/>,this.domEle);
        }

        React.render(<ConfirmView title={title} body={body} callback={cb}/>, this.domEle);
    },

    //关闭
    showInfo:function(title,body){
        console.log('dddddddddddddddddddddddddd');
        console.dir(this.domEle);
         var cb=function(){            
            React.render(<div/>,this.domEle);
        }.bind(this);

        //React.render(<p>ddddddddddddddddddddddddddddddddddddddddddddddd</p>, this.domEle);
        React.render(<InfoView title={title} body={body} callback={cb}/>, this.domEle);
    }
  
}

module.exports=PopMgr;

