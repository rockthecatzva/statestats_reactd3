import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class MessageModal extends Component {
  render() {
    const { message, interactionHandler, showButton } = this.props;
    const Modal = styled.div`
        bottom: 4px;
        padding: 5px;
        background-color: #d299fd;
        border-radius: 5px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;`;


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
      cursor: pointer;
      margin-bottom: 4px;
      `;

    const FixedDiv = styled.div`
      position: fixed;
      bottom: 1em;
      width: 100%;`;

    const ContainerDiv = styled.div`
      width: 100%;
      text-align: center;
      margin-bottom: 0.5em;`;

    return (
      <FixedDiv>
        <Modal>
          <CloseX>x</CloseX>
          <p>{message}</p>
          {showButton &&
            <ContainerDiv><Deselect onClick={(e) => { e.preventDefault(); interactionHandler() }}>Deselect</Deselect></ContainerDiv>
          }
        </Modal>
      </FixedDiv>
    )
  }
}

MessageModal.propTypes = {
  message: PropTypes.string.isRequired,
  interactionHandler: PropTypes.func.isRequired,
  showButton: PropTypes.bool.isRequired,
}
