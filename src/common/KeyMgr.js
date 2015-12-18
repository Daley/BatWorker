

var  KeyMgr={

    init:function(domEle){
    	//domEle.bind("keyup.ctrl_s",this.onKeyUp.bind(this));
    	this.domEle=domEle;
    },

    onPress:function(e){
        //console.log("key press:",e.keyCode);
    },

    register:function(key,cb){
    	this.domEle.bind("keyup."+key,cb);

        this.domEle.keypress(this.onPress.bind(this));
    },

    unregister:function(key,cb){
		this.domEle.unbind("keyup."+key,cb);
    }
}

module.exports=KeyMgr;
//export default KeyMgr;

