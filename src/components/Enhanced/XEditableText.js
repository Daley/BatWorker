
'use strict';

var React = require('react');
import {Input} from 'react-bootstrap';

var XEditableText = React.createClass({

    getDefaultProps: function() {
        return {
            href: '#'
        };
    },

    componentWillUnmount:function(){
       var dom=$(React.findDOMNode(this.refs.txt));

      dom.keypress(null);

    },

    componentDidMount: function(){
      var dom=$(React.findDOMNode(this.refs.txt));
       
      dom.keypress(this.onPress.bind(this));
      dom.blur(this.save.bind(this));
      dom.focus(this.focusIn.bind(this));

      return;
      var dom=$(React.findDOMNode(this.refs.editableElement));

     window.log('dengyp XEditableText componentDidMount:'+this.props.val);
      var val=this.props.val==''?"":this.props.val;
      dom.editable({value:this.props.val});

      dom.on('save', (e, params)=> {
        if(this.props.onChange){
          this.props.onChange(this.props.id,params.newValue);
        }
      });
    },

    onPress:function(e){
      if(e.keyCode==13){
        this.save();       
      }
      
    },

    focusIn:function(){
      var dom=$(React.findDOMNode(this.refs.txt));
      dom[0].contenteditable=true;
    },

    save:function(){
      var dom=$(React.findDOMNode(this.refs.txt));
      if(this.props.onChange){
          console.log(dom[0].value);
          this.props.onChange(this.props.id,dom[0].value);
          dom[0].contenteditable=false;
        }
    },

//{...this.props}
    render: function() {
      var ps=this.props;
      var v=Math.random().toString();
      var val=ps.val==''?"":ps.val;
      var max=35;
      if(val.length>max){
        //val=val.substring(0,max)+"..."
      }
      var refStr="#"+Math.random();
      //var set=this.setState.bind(this);
      //setTimeout(this.componentDidMount.bind(this), 100);
      /*
      setTimeout(function(){
        set({ran:Math.random()});        
      }, 100*Math.random());*/
var obj={
            "border-top":"0px",
            "border-left":"0px",
            "border-right":"0px",
            "border-down":"0px"
            }

      return (

            //<Input ref="txt" type="dymamic" value={val}></Input> onkeypress={this.onPress.bind(this)}
            <input type="text" style={obj} ref="txt" defaultValue={val} ></input>
        /*
        return (
            <a href="#"
               ref="editableElement"
               id="username"
               data-type="text"
               data-pk="1"
               data-title="变量名">ROOT</a>
               */
        );
    }
});

module.exports = XEditableText;
