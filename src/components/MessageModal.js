import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class MessageModal extends Component {
  render() {
    const { message, interactionHandler, showButton } = this.props;
    const Modal = styled.div`
    font-family: CustomFont;
    position: relative;
        bottom: 3em;
        padding: 5px;
        background-color: #d299fd;
        border-radius: 5px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;`;

    const Deselect = styled.span`
      padding: 4px;
      color: black;
      background-color: white;
      border: solid 1px #000;
      border-radius: 3px;  
      font-size: 0.8em;
      cursor: pointer;
      margin-bottom: 4px;
      `;

    const FixedDiv = styled.div`
      position: fixed;
      bottom: 6em;
      height: 0px;
      width: 100%;`;

    const ContainerDiv = styled.div`
      width: 100%;
      text-align: center;
      margin-bottom: 0.5em;
      margin-top: 0.5em;`;

    return (
      <FixedDiv>
        {message.length && 
          <Modal>
          {message}
          {showButton &&
            <ContainerDiv><Deselect onClick={(e) => { e.preventDefault(); interactionHandler() }}>Deselect</Deselect></ContainerDiv>
          }
        </Modal>
        }
        
      </FixedDiv>
    )
  }
}

MessageModal.propTypes = {
  message: PropTypes.array.isRequired,
  interactionHandler: PropTypes.func.isRequired,
  showButton: PropTypes.bool.isRequired,
}
