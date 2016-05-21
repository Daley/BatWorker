import React, {Component} from 'react';
import {Grid, Row,Col,Modal,Button,Panel,MenuItem} from 'react-bootstrap';
var _ = require('lodash');

class PanelWrapper extends Component{	
	constructor() {
		super();
	}

	onClose(){
		this.props.onCallback(this.props.pop_id,false);
	}

	onOk(){
		this.props.onCallback(this.props.pop_id,true);
	}

	render() {    
		
	    return (
	      
	        
	        <Modal
	          show={true}
	          onHide={this.onClose.bind(this)}
	          container={this}
	          aria-labelledby="contained-modal-title" width='380px'
	        >
	          <Modal.Header closeButton>
	            {this.props.renderHeader()}
	          </Modal.Header>
	          <Modal.Body>
	            {this.props.renderBody()}
	          </Modal.Body>
	          <Modal.Footer>
	            <Button onClick={this.onOk.bind(this)}>确定</Button>
	          </Modal.Footer>
	        </Modal>
	      
	    );
	}
}

class MovePanel extends Component{
	constructor() {
		super();
		this.state={isMouseDown:false};
	}


	onMouseDown(e){
		var vo=this.props.vo;
		this.setState({
			isMouseDown:true,
			mouse:{x:vo.left,y:vo.top},
			pos:{x:e.pageX,y:e.pageY},
			init:{left:vo.left,top:vo.top}
		});

		//window.document.addEventListener("onmousemove", this.onMouseMove.bind(this));
		//window.document.addEventListener("onmouseup", this.onMouseMove.bind(this));

		$(document).mousemove(this.onMouseMove.bind(this));
		$(document).mouseup(this.onMouseUp.bind(this));

		e.stopPropagation();

		//console.log("dengyp MovePanel onMouseDown");
		
	}

	onMouseMove(e){

		if(this.state.isMouseDown){
			var vo=this.props.vo;
			var mouse=this.state.mouse;
			mouse.x=e.pageX-this.state.pos.x+this.state.init.left;
			mouse.y=e.pageY-this.state.pos.y+this.state.init.top;
			this.forceUpdate();
		}
		//console.log("dengyp MovePanel onMouseMove");
		e.stopPropagation();
		
	}

	componentDidMount() {
        var vo=this.props.vo;
        console.log("........................."+vo.key);
        if(vo.key!=null){

        	global.keyMgr.register('ctrl_'+vo.key,this.showOrHide.bind(this));
        }        
    }

    componentWillUnmount() {
        var vo=this.props.vo;
        if(vo.key!=null){
        	global.keyMgr.register('ctrl_'+vo.key,null);
        }  
    }

    showOrHide(){

        var vo=this.props.vo;
        console.log("........................."+vo.key);
        this.props.vo=vo.set("show",!vo.show);
        this.setState({"isMouseDown":false});
    }


	onMouseUp(e){
		this.setState({isMouseDown:false});
		var vo=this.props.vo;
		var mouse=this.state.mouse;
		vo=vo.set("left",mouse.x);
		vo=vo.set("top",mouse.y);

		this.props.vo=vo;

		e.stopPropagation();
		
		//console.log("dengyp MovePanel onMouseDown"); 
		$(document).mousemove(null);
		$(document).mouseup(null);
	}

 //onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}
	renderHeader(){
		var vo=this.props.vo;

		return <div style={{cursor:'move'}} onMouseDown={this.onMouseDown.bind(this)}>
					{this.props.header+(vo.key?"("+vo.key+")":"")}
				</div>
	}

	render(){

		var vo=this.props.vo;
		if(!vo.show){
			return <div/>;
		}
		var mouse=this.state.mouse?this.state.mouse:{x:vo.left,y:vo.top};
		var clazz=this.props.clazz;
		var obj={height: vo.height,position: 'absolute',left:mouse.x,top:mouse.y,width:vo.width};
		var header=this.renderHeader();//this.props.header;

		//obj={position: 'absolute',backgroundColor:'green',left:vo.left,top:vo.top};
		//React.createElement(clazz)

		return <div style={obj} >
					<Panel header={header} >
						{React.createElement(clazz)}
					</Panel>
				</div>;
	}
}

class PopGroup extends Component{

	constructor() {
		super();
		this.state={pops:[]};
	}

	showPop(props){
		props.pop_id=this.state.pops.length;
		console.log("dengyp PopGroup showPop");

		this.state.pops.push(props);
		this.update();
	}

	clearPop(){
		this.state.pops=[];
		this.update();
	}

	onCallback(idx,isOk){
		var obj=this.state.pops[idx];
		if(isOk){
			obj.okHandler();
		}else if(obj.cancelHandler){
			obj.cancelHandler();
			//_.pullAt(this.state.pops,idx);
		}
		_.pullAt(this.state.pops,idx);
		this.update();
	}

	update(){
		this.setState({pops:this.state.pops});
	}
	
	render(){
		var pops=this.state.pops;
		//变态
		global.showPop=this.showPop.bind(this);
		global.clearPop=this.clearPop.bind(this);

		var onCallBack=this.onCallback.bind(this);

		//console.log("ssssssssssssssss")
		//console.dir(pops);

		return(<div>
				{			
					pops.map(function(item){
						if(item.isFloat){
							return <MovePanel {...item}/>
						}else{
							return <PanelWrapper {...item}  onCallback={onCallBack}/>
						}
						
					})
				}
				</div>);
	}


}


export default PopGroup;