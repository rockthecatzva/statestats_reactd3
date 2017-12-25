import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class MessageModal extends Component {
  render() {
      const {message, interactionHandler, showButton} = this.props;
      const Modal = styled.div`
        position: fixed;
        bottom: 4px;
        
        padding: 5px;
        padding-bottom: 10px;
        margin: auto auto;
        background-color: #d299fd;
        border-radius: 5px;
      `;

    const CloseX = styled.a`
        position: absolute;
        right: 5px;
        top: 0px;
        font-size: 1em;
    `;

    const Deselect = styled.span`
      padding: 4px;
      color: black;
      background-color: white;
      border: solid 1px #000;
      border-radius: 3px;  
      font-size: 0.9em;
      position: relative;
      `;

    return (
      <Modal>
          <CloseX>x</CloseX>
          <p>{message}</p>
          {showButton && 
          <a href="#" onClick={()=>{interactionHandler()}} ><Deselect>Deselect</Deselect></a>
          }
      </Modal>
    )
  }
}
 
MessageModal.propTypes = {
    message: PropTypes.string.isRequired,
    interactionHandler: PropTypes.func.isRequired,
    showButton: PropTypes.bool.isRequired
  }
