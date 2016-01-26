import React, {Component} from 'react';
import ReactAdd from 'react/addons';
import * as ReactBootstrap from 'react-bootstrap';
import XEditableText from "../view/XEditableText.js";

var {ListGroup,ListGroupItem,ButtonToolbar,ButtonGroup,Button,Glyphicon,Label,Col,Row,Panel,OverlayTrigger,Tooltip} =ReactBootstrap;
var _ = require('lodash');
var global=window;

//props @items @creator @viewFilters={k:v} v is desc
class DefaultItem extends Component{
    onChange(key,val){
        var vo=this.props.data;
        //vo[key]=val;
        //console.log('...............');
        //console.dir(vo);
       // console.log('k-v:'+key+'-'+val);
        //if(vo.hasOwnProperty('set')){
            setTimeout(function(){
                vo.set(key,val);
            }, 10);            
        //}else{
         //   vo[key]=val;
        //}
        
        
    }

    onSelectChange(){;
        if(this.props.onSelectChange){
            this.props.onSelectChange(this.props.idx);
        }        
    }

    //非常重要，干掉影响性能
    shouldComponentUpdate( nextProps, nextState ){
        //return true;
        return nextProps.data != this.props.data;
    }

    runTest(){
        if(this.testId>0){
            return;
        }
        var inc=0;
        var key="val";
        this.testId=setInterval(function(){
            if(inc>1116){
                return;
            }
            var vo=this.props.data;
            vo.set(key,""+Math.random());
            inc++;

        }.bind(this), 100);
    }

    render(){
        var item=this.props.data;
        //console.log('...............DefaultItem................');
        //console.dir(XEditableText);
        //this.runTest();


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
                             lg={ wh }><Label>{key}:</Label><XEditableText id={key} title={key} val={val} width="200px" onChange={this.onChange.bind(this)}/></Col>
                    )
            }else if(filters[key]==null){
                arr.push(<div/>);
            }else{
                arr.push( 
                    <Col     xs={ wh }                             
                             sm={ wh }
                             md={ wh }
                             lg={ wh }><Label>{filters[key]}:</Label><XEditableText id={key} title={filters[key]}   width="200px"  val={val} onChange={this.onChange.bind(this)}/></Col>
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

    constructor() {
        super();
        this.state={ expanded: true};
    }

    renderItems(){
    	var list=this.props.list;
        var viewFilters=this.props.viewFilters;
        var onSelectChange=this.props.onSelectChange;
    	var arr=[];
    	var idx=0;
        if(this.props.showOne){
            return  <DefaultItem data={list[0]} idx={idx++} viewFilters={viewFilters} onSelectChange={onSelectChange}/>;
        }
        //console.log("dengyp DefaultGroup");
        //console.dir(list);
    	list.map(function(item){
                    arr.push(
                            <DefaultItem data={item} idx={idx++} viewFilters={viewFilters} onSelectChange={onSelectChange}/>
                            )
                        });
    	return arr;
    }

    onClickCall(){
        this.setState({expanded:!this.state.expanded});
    }

    render(){    	
        return (        	
            <Panel {...this.props} collapsible={true} expanded={this.state.expanded} onSelect={this.onClickCall.bind(this)} >
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

const copyTip = (
 <Tooltip><strong>复制当前元素</strong></Tooltip>
);

const pasteTip = (
 <Tooltip><strong>粘贴当前元素到当前索引，为-1在最后</strong></Tooltip>
);

const numTip = (
  <Tooltip><strong>当前选中项的下标,点击归-1</strong></Tooltip>
);

const searchTip = (
  <Tooltip><strong>对当前元素进行查找替换操作</strong></Tooltip>
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
        list.splice(idx,1);
		//_.pullAt(list,idx);
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

    onCopy(){
        //console.log("dengyp ValueGroup onDuplicate");
        if(this.checkSelectItem()==false){
            return;
        }
        var {list,idx}=this.getListAndIdx();
            //list.push(global.cloneCreate(list[idx]));
        global.__copyItem=global.cloneCreate(list[idx]);        
    }

    onPaste(){
       
        if(global.__copyItem==null){
            global.log('没有复制任何项');
            return;
        }
        var {list,idx}=this.getListAndIdx();
        if(idx==-1){
            list.push(global.cloneCreate(global.__copyItem));
        }else{
            list.splice(idx, 0, global.cloneCreate(global.__copyItem));
        }
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
        if(this.onSelectChange){
            this.onSelectChange(idx);//按理说，下面这句会驱动刷新，可是有时候不会刷新    
        }
            
		this.setState({selectIdx:idx});//
	}

    onClearSelect(){
        this.onSelectChange(-1);
    }

    onCutViewSelect(){
       //console.log(React.renderToString(this));
       //global.CutViewActions.cutView(React.renderToString(<ValueGroup {...this.props}/>));
       var str=JSON.stringify(this.props.list,null,2);
      
       global.CutViewActions.cutView(str);
       //console.log(JSON.stringify(this.props.list,null,4));
       
       //global.CutViewActions.cutView(React.addons.cloneWithProps(this));
    }

    onSearch(){
        if(this.checkSelectItem()==false){
            return;
        }
        var {list,idx}=this.getListAndIdx();

        var obj={find:"",replace:""};
        var changeHandler=function(key,val){
            obj[key]=val;
        }


        var ps={           
            okHandler:function(){
                console.dir(list[idx]);
                console.dir(obj);
               global.searchAndReplace(list[idx],obj.find,obj.replace);
            },
            cancelHandler:function(){

            },
            renderHeader:function(){
                return <h1>查找替换</h1>
            },

            renderBody:function(){
                
                return (
                        <div>
                                <Label>查找:</Label><XEditableText id={'find'} title={'find'} val={''} onChange={changeHandler}/>
                                <Label>替换:</Label><XEditableText id={'replace'} title={'replace'} val={''} onChange={changeHandler}/>
                        </div>                    
                    );                 
                
            }

        }

       global.showPop(ps);
    }

    //非常重要，干掉影响性能
    shouldComponentUpdate( nextProps, nextState ){
        //return true;
        return nextProps.list != this.props.list;
    }
    /*
<OverlayTrigger placement="top" overlay={numTip}>
                    <Button bsSize="small" onClick={this.onCutViewSelect.bind(this)} ref='cutBtn'>v</Button></OverlayTrigger>

                    <Button bsSize="small" onClick={this.onCutViewSelect.bind(this)} ref='cutBtn'>J</Button>
    */

    renderHeader(){
        return <div>
                    {this.renderHeaderCont()}
                </div>
    }

	renderHeaderContd(){
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
                    <OverlayTrigger placement="top" overlay={copyTip}>
			        <Button bsSize="small" onClick={this.onCopy.bind(this)} ref="cpBtn" disabled={disableCreate}><Glyphicon glyph="duplicate"/> </Button></OverlayTrigger>

                     <OverlayTrigger placement="top" overlay={pasteTip}>
                    <Button bsSize="small" onClick={this.onPaste.bind(this)} ref="dupBtn" disabled={disableCreate}><Glyphicon glyph="paste"/> </Button></OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={numTip}>
			        <Button bsSize="small" onClick={this.onClearSelect.bind(this)} ref='numBtn'>{this.state.selectIdx}</Button></OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={searchTip}>
                    <Button bsSize="small" onClick={this.onSearch.bind(this)} ref='searchBtn'>替</Button></OverlayTrigger>
			      </ButtonGroup>                  
			      		      
    			</ButtonToolbar>
    			
    			</h3>
    			);
    }

    renderHeaderCont(){
        var {list,idx}=this.getListAndIdx();
        var hasSelect=idx>-1&&idx<list.length;
        var disableCreate=this.props.disableCreate==true;
        //global.log("renderHeaderCont",idx);
        return (<h3><ButtonToolbar>
                  <ButtonGroup>
                    <OverlayTrigger placement="top" overlay={addTip}>
                    <Button bsSize="small" onClick={this.onAdd.bind(this)} ref="addBtn"  disabled={disableCreate}>增</Button></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={removeTip}>
                    <Button bsSize="small" onClick={this.onRemove.bind(this)} ref="removeBtn" >删</Button></OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={copyTip}>
                    <Button bsSize="small" onClick={this.onCopy.bind(this)} ref="cpBtn" disabled={disableCreate}>复</Button></OverlayTrigger>

                     <OverlayTrigger placement="top" overlay={pasteTip}>
                    <Button bsSize="small" onClick={this.onPaste.bind(this)} ref="dupBtn" disabled={disableCreate}>粘 </Button></OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={numTip}>
                    <Button bsSize="small" onClick={this.onClearSelect.bind(this)} ref='numBtn'>{this.state.selectIdx}</Button></OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={searchTip}>
                    <Button bsSize="small" onClick={this.onSearch.bind(this)} ref='searchBtn'>替</Button></OverlayTrigger>
                  </ButtonGroup>                  
                              
                </ButtonToolbar>
                
                </h3>
                );
    }

    render(){
        if(this.props.header){
            console.log('::--------------render:'+this.props.header);
        }

       var ps=_.assign({},this.props,{onSelectChange:this.onSelectChange.bind(this)});
       var st=this.props.style||{};
        if(this.props.renderClazz){
            return (
            <div ref="cont" style={st}>          
                {this.renderHeader()}            
                {React.createElement(this.props.renderClazz,ps)}       
            </div>
            );
        }

    	if(this.props.renderHandler){
    		return (
        	<div ref="cont" style={st}>
        	{this.renderHeader()}            
            {this.props.renderHandler(this.onSelectChange.bind(this))}       
            </div>
        	);
    	}
    	return (
        	<div ref="cont" style={st}>
        		{this.renderHeader()}            
            	<DefaultGroup {...ps}/>            
            </div>
        );
    }
}

export default ValueGroup;