
'use strict';

var React = require('react');

var XEditableText = React.createClass({

    getDefaultProps: function() {
        return {
            href: '#'
        };
    },

    componentWillUnmount:function(){
       var dom=$(React.findDOMNode(this.refs.editableElement));
      dom.on('save',null);

    },

    componentDidMount: function(){
      var dom=$(React.findDOMNode(this.refs.editableElement));

     //window.log('dengyp XEditableText componentDidMount:'+this.props.val);
      var val=this.props.val==''?"":this.props.val;
      dom.editable({value:this.props.val});

      dom.on('save', (e, params)=> {
        if(this.props.onChange){
          this.props.onChange(this.props.id,params.newValue);
        }
      });
    },

//{...this.props}
    render: function() {
      var ps=this.props;
      var v=Math.random().toString();
      var val=ps.val==''?"null":ps.val;
      var max=35;
      if(val.length>max){
        val=val.substring(0,max)+"..."
      }
      var refStr="#"+Math.random();
      var set=this.setState.bind(this);
      setTimeout(this.componentDidMount.bind(this), 10);
      /*
      setTimeout(function(){
        set({ran:Math.random()});        
      }, 100*Math.random());*/

      return (
            <a href={refStr}
               ref="editableElement"
               id={ps.id}
               data-type="text"
               data-pk={v}
               data-inputclass='input-large'
               data-title={ps.title}>{val}</a>
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
