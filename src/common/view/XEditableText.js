
'use strict';

var React = require('react');
import {Input} from 'react-bootstrap';

var XEditableText = React.createClass({  

    getInitialState(){
        return {isEditing:false};
    },

    componentWillUnmount:function(){
      var dom=$(React.findDOMNode(this.refs.txt));
      dom.keypress(null);
      dom.blur(null);
      dom.focus(null);


    },    

    componentDidMount: function(){
      
      var dom=$(React.findDOMNode(this.refs.txt));
       
      //dom.keypress(this.onPress.bind(this));
      dom.blur(this.save);
      dom.focus(this.focusIn);      
      //dom.click(this.clickCall);
      //console.log("fufufufufufuf");

      if(this.state.isEditing){
        //this.refs.txt.getDOMNode().focus(); 
      }
    },

    clickCall:function(){
      console.log('click Call');
      this.setState({isEditing:true});
    },


    onPress:function(e){
      if(e.keyCode==13){
        this.save();       
      }
      
    },

    onChangeCall:function(event){
      var val=event.target.value;
      this.props.val=val;
      this.forceUpdate();
    },

    focusIn:function(){
      if(this.props.onSelect){
        this.props.onSelect();
      }
      var dom=$(React.findDOMNode(this.refs.txt));
      //dom.contenteditable=true;
    },

    save:function(){
      var dom=$(React.findDOMNode(this.refs.txt));
      var ps=this.props;
      if(ps.onChange){
          var val=ps.val==''?"":ps.val;
          this.props.onChange(ps.id,val);
          //dom.contenteditable=false;
        }
    },
  
   
    render: function() {
      var ps=this.props;
      var v=Math.random().toString();
      var val=ps.val==''?"":ps.val;
      //console.log('XEditableText:',this.state.value);
      //if(this.state.value!="__null__"){
        //val=this.state.value;
     // }
     if(this.state.isEditing==false){
      //return <div ref="txt">{val}</div>;
     }


      var obj={
            "border-top":"0px",
            "border-left":"0px",
            "border-right":"0px",
            "border-down":"0px",
            "width":"200px"
            }
      if(this.props.width){
        obj.width=this.props.width;
      }

      return (           
            <input type="text" style={obj} ref="txt" value={val} onChange={this.onChangeCall}/>
        );
    }
});

module.exports = XEditableText;
