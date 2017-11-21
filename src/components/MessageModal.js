import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class MessageModal extends Component {
  render() {
      const {message} = this.props;

    return (
      <span>
          <p>{message}</p>
      </span>
    )
  }
}
 
MessageModal.propTypes = {
    message: PropTypes.string.isRequired,
  }
