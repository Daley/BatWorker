
import React, {Component} from 'react';
import {XEditableText,ValueGroup,ToggleBtn} from "../../common/index.js";
import {ButtonGroup,Button,DropdownButton,MenuItem,Panel,Nav,NavItem,PanelGroup,Label,ListGroup,ListGroupItem,Glyphicon,OverlayTrigger,Tooltip} from 'react-bootstrap';
var _ = require('lodash');

var global=window;

const runTip = (
 <Tooltip><strong>运行</strong></Tooltip>
);

class QueueItem extends Component{	

    onSelectChange(){
        if(this.props.onSelectChange){
            this.props.onSelectChange(this.props.idx);
        }        
    }

    onRun(){
         var {space,project,idx}=this.props;
         console.dir(project);
          global.QueueActions.runJob(project.id);
    }

    render(){
       var {space,project,idx}=this.props;
        return (
        		<ListGroupItem bsStyle="info" >
                    <Button bsSize="xs"  onClick={this.onSelectChange.bind(this)}><Glyphicon glyph="check" /></Button> 
        			<Button bsSize="xs"  onClick={this.onRun.bind(this)}><Glyphicon glyph="play-circle" /></Button> 
                    {space.name+"::"+project.name}
        		</ListGroupItem>);
    }
}

class QueueList extends Component{

	renderItems(){
    	var list=this.props.list;        
        var onSelectChange=this.props.onSelectChange;
    	var idx=0;
    	var arr=[];
    	list.map(function(id){
    				var {space,project}=global.WorkStore.findProject(id);
    				if(project){
	                   	arr.push( <QueueItem space={space} project={project} idx={idx++} onSelectChange={onSelectChange}/>);
    				}
                });
    	return arr;
    }

    render(){    	
        return (        	     	
            <ListGroup>
            	{this.renderItems()}
            </ListGroup>            
        );
    }
}



class JobQueueView extends Component{

	constructor() {
		super();
		
        this.state= {list:global.QueueStore.model,show:false};
	}


    componentDidMount() {
        this.unsubscribe = global.QueueStore.listen(this.onModelChange.bind(this));

        //global.keyMgr.register('ctrl_j',this.showOrHide.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();

        //global.keyMgr.register('ctrl_j',null);
    }

    showOrHide(){
        var s=this.state;
        this.setState({list:s.list,show:!s.show});
    }

    onModelChange(model) {
         console.log('dengyp JobQueueView.onModelChange');
        //this.setState({list:model});
        var s=this.state;
        this.setState({list:model,show:s.show});
    }

    onRun(){
    	global.QueueActions.runQueue();
    }
    
    onClean(){
        global.QueueActions.cleanAll();
    }

	render(){
       
        var ps={};
        ps.list=this.state.list;
        ps.disableCreate=true;
        ps.renderClazz=QueueList;

        return <div>
        		<ButtonGroup>

        			<Button onClick={this.onRun.bind(this)}>运行队列</Button> 			
                    <Button onClick={this.onClean.bind(this)}>清除队列</Button>
        		</ButtonGroup>
        		<ValueGroup {...ps} ref='list'></ValueGroup>
        		</div>
	}
}

export default JobQueueView;