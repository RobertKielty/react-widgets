var React = require('react')

module.exports = React.createClass({

  propTypes: {
    value:        React.PropTypes.string,
    onChange:     React.PropTypes.func.isRequired,
  },


  componentDidUpdate: function() {
    this.props.focused && this.focus()
  },

  render: function(){
      var value = this.props.value
        , placeholder = this.props.placeholder
        , size = Math.max((value || placeholder).length, 1);

      return this.transferPropsTo(
        <input type='text' 
          className='rw-input'  
          size={size}/>
      )
  },

  focus: function(){
    this.getDOMNode().focus()
  }

})
