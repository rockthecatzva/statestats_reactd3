import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class MessageModal extends Component {
  render() {
      const {message} = this.props;
      const Modal = styled.div`
        position: relative;
        width: 80%;
        height: 2em;
        text-align: center;
        font-size: 1.8em;
        
        margin: auto auto;
        color: #fff;
        background-color: #d299fd;
        border-radius: 5px;
      `;

    const CloseX = styled.a`
        position: absolute;
        right: 5px;
        top: 0px;
        font-size: 1em;
    `;

    return (
      <Modal>
          <CloseX>x</CloseX>
          <p>{message}</p>
      </Modal>
    )
  }
}
 
MessageModal.propTypes = {
    message: PropTypes.string.isRequired,
  }
