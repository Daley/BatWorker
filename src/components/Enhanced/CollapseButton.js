'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Collapse = ReactBootstrap.Collapse;


var CollapseButton = React.createClass({

    _handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({open: !this.state.open});
    },

    getInitialState: function(){
        return {};
    },

    render(){
        return (
            <div>
                <Button onClick={this._handleToggle}>
                    click
                </Button>
                <Collapse in={this.state.open}>
                    <div>
                        <Well>
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                        </Well>
                    </div>
                </Collapse>
            </div>
        );
    }

});

module.exports = CollapseButton;


