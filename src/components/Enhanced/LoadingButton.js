var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;


var LoadingButton = React.createClass({

      getInitialState() {
        return {
          isLoading: false
        };
      },
    
      render() {
        var isLoading = this.state.isLoading;
        return (
          <Button
            bsStyle='primary'
            disabled={isLoading}
            onClick={!isLoading ? this.handleClick : null}>
            {isLoading ? 'Loading...' : 'Loading state'}
          </Button>
        );
      },
    
      handleClick() {
        this.setState({isLoading: true});
    
        // This probably where you would have an `ajax` call
        setTimeout(function(){
          // Completed of async action, set loading state back
          this.setState({isLoading: false});
        }.bind(this), 2000);
      }
});

module.exports = LoadingButton;