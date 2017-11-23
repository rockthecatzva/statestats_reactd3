import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class MessageModal extends Component {
  render() {
      const {message} = this.props;
      const Modal = styled.div`
        position: fixed;
        width: 80%;
        height: 2em;
        text-align: center;
        font-size: 2em;
        bottom: 10%;
        margin: 0 auto;
        background-color: white;
        border: solid 1px black;
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
