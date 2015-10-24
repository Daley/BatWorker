import React, {Component} from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import XEditableText from "../Enhanced/XEditableText.js";

var {ListGroup,ListGroupItem,ButtonToolbar,ButtonGroup,Button,Glyphicon,Label,Col,Row,Panel,OverlayTrigger,Tooltip} =ReactBootstrap;
var _ = require('lodash');
var global=window;

//props @items @creator @viewFilters={k:v} v is desc
class DefaultItem extends Component{
    onChange(key,val){
        var vo=this.props.data;
        vo[key]=val;
    }

    onSelectChange(){;
        if(this.props.onSelectChange){
            this.props.onSelectChange(this.props.idx);
        }        
    }

    render(){
        var item=this.props.data;
        
        var wh=1;
        var arr=[<Col    xs={ wh }                             
                             sm={ wh }
                             md={ wh }
                             lg={ wh }><Button bsSize="xs"  onClick={this.onSelectChange.bind(this)}><Glyphicon glyph="check" /></Button></Col>];
        wh=3;
        var filters=this.props.viewFilters;
        for(var key in item){
            var val=item[key];
            if(filters==null){
                arr.push(
                     <Col    xs={ wh }                             
                             sm={ wh }
                             md={ wh }
                             lg={ wh }><Label>{key}:</Label><XEditableText id={key} title={key} val={val} onChange={this.onChange.bind(this)}/></Col>
                    )
            }else if(filters[key]==null){
                arr.push(<div/>);
            }else{
                arr.push( 
                    <Col     xs={ wh }                             
                             sm={ wh }
                             md={ wh }
                             lg={ wh }><Label>{filters[key]}:</Label><XEditableText id={key} title={filters[key]} val={val} onChange={this.onChange.bind(this)}/></Col>
                    );
            }
        }
        //<Row>{arr}</Row>
        return <h5><Row>{arr}</Row></h5>
                
    }
}

class DefaultGroup extends Component{  
//id={key} title={key} val={val} 	 id={key} title={filters[key]} val={val}   <span>{filters[key]}<XEditableText/></span>;
//<XEditableText id={key} title={key} val={val}/>  <XEditableText id={key} title={filters[key]} val={val}/>

    renderItems(){
    	var list=this.props.list;
        var viewFilters=this.props.viewFilters;
        var onSelectChange=this.props.onSelectChange;
    	var arr=[];
    	var idx=0;
    	list.map(function(item){
                    arr.push(
                            <DefaultItem data={item} idx={idx++} viewFilters={viewFilters} onSelectChange={onSelectChange}/>
                            )
                        });
    	return arr;
    }

    render(){    	
        return (        	
            <Panel {...this.props}>
            	{
            		this.renderItems()
            	}
            </Panel>
        );
    }
}
//onSelectChange
//onDataChange
const addTip = (
  <Tooltip><strong>在当前元素之前或者列表最后（没有选择项) 添加新项</strong></Tooltip>
);

const removeTip = (
 <Tooltip><strong>移除当前元素</strong></Tooltip>
);

const dupTip = (
 <Tooltip><strong>复制当前元素</strong></Tooltip>
);

const numTip = (
  <Tooltip><strong>当前选中项的下标,点击归-1</strong></Tooltip>
);

class ValueGroup extends Component {
	constructor() {
		super();
        this.state={ selectIdx: -1};
    }

  	getListAndIdx(){

  		return {list:this.props.list,idx:this.state.selectIdx};
  	}

	onAdd(){
		console.log("dengyp ValueGroup add");
        var {list,idx}=this.getListAndIdx();
        idx=idx==-1?list.length:idx;

        if(this.props.creatorAsync){
            this.props.creatorAsync(idx,this.onDataChange.bind(this));
            return;
        }
        

        this.props.list.splice(idx,0,global.cloneCreate(this.props.creator));       
		//console.dir(this.props);
		//this.props.list.push(global.cloneCreate(this.props.creator));		

        console.dir(this.props.list);
		this.onDataChange();
	}

	onRemove(){
		if(this.checkSelectItem()==false){
            return;
        }
		var {list,idx}=this.getListAndIdx();
		_.pullAt(list,idx);
		this.onDataChange();		
		//this.props.list.push(this.props.creator());
	}

    checkSelectItem(){
        var {list,idx}=this.getListAndIdx();
        if(idx==-1){
            global.log("没有选择项");
            return false;
        }
        if(list.length==0){
            global.log('列表没有内容');
            return false;
        }
        return true;
    }

	onDuplicate(){
		//console.log("dengyp ValueGroup onDuplicate");
        if(this.checkSelectItem()==false){
            return;
        }
		var {list,idx}=this.getListAndIdx();
       		//list.push(global.cloneCreate(list[idx]));
        list.splice(idx, 0, global.cloneCreate(list[idx]));
        _
		this.onDataChange();
	}

	onSelectChange(idx){
        this.state.selectIdx=idx;
        //React.render(this.renderHeaderCont(),React.findDOMNode(this.refs.header));
        //return
        var dom=React.findDOMNode(this.refs.numBtn);
        dom.innerHTML=idx;
        //console.dir(this.refs);
		//this.setState({selectIdx:idx});//
	}

	onDataChange(){
		if(this.props.onChange){
			this.props.onChange(this.props.list);
		}
		var {list,idx}=this.getListAndIdx();
		if(idx>=list.length){
			idx=-1;
		}
        this.onSelectChange(idx);//按理说，下面这句会驱动刷新，可是有时候不会刷新        
		this.setState({selectIdx:idx});//
	}

    onClearSelect(){
        this.onSelectChange(-1);
    }

    renderHeader(){
        return <div>
                    {this.renderHeaderCont()}
                </div>
    }

	renderHeaderCont(){
		var {list,idx}=this.getListAndIdx();
		var hasSelect=idx>-1&&idx<list.length;
        var disableCreate=this.props.disableCreate==true;
        //global.log("renderHeaderCont",idx);
    	return (<h3><ButtonToolbar>
			      <ButtonGroup>
                    <OverlayTrigger placement="top" overlay={addTip}>
			        <Button bsSize="small" onClick={this.onAdd.bind(this)} ref="addBtn"  disabled={disableCreate}><Glyphicon glyph="plus" /> </Button></OverlayTrigger>
			        <OverlayTrigger placement="top" overlay={removeTip}>
                    <Button bsSize="small" onClick={this.onRemove.bind(this)} ref="removeBtn" ><Glyphicon glyph="minus"  /> </Button></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={dupTip}>
			        <Button bsSize="small" onClick={this.onDuplicate.bind(this)} ref="dupBtn" disabled={disableCreate}><Glyphicon glyph="duplicate"/> </Button></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={numTip}>
			        <Button bsSize="small" onClick={this.onClearSelect.bind(this)} ref='numBtn'>{this.state.selectIdx}</Button></OverlayTrigger>
			      </ButtonGroup>
			      		      
    			</ButtonToolbar>
    			
    			</h3>
    			);
    }

    render(){
       var ps=_.assign({},this.props,{onSelectChange:this.onSelectChange.bind(this)});
        if(this.props.renderClazz){
            return (
            <div>          
                {this.renderHeader()}            
                {React.createElement(this.props.renderClazz,ps)}       
            </div>
            );
        }

    	if(this.props.renderHandler){
    		return (
        	<div>
        	{this.renderHeader()}            
            {this.props.renderHandler(this.onSelectChange.bind(this))}       
            </div>
        	);
    	}
    	return (
        	<div>
        		{this.renderHeader()}            
            	<DefaultGroup {...ps}/>            
            </div>
        );
    }
}

export default ValueGroup;