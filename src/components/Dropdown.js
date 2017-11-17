import React, { Component} from 'react';
import PropTypes from 'prop-types';

export default class Dropdown extends Component {

  componentDidMount(){
    this.props.uxCallback(this.props.uxTag, this.props.renderData[0])
  }


  render() {
    const { renderData, uxCallback, uxTag} = this.props

    function onSelectItem(e){
      let i = e.target.options[e.target.selectedIndex].value;

      uxCallback(uxTag, renderData[i]);
    }

    return (
        <select className="dropdown" onChange={onSelectItem} >
          {renderData.map((v,i)=>{
            return(<option key={i} value={i}>{v["label"]}</option>)
            })}
        </select>
      )
    }
  }

  Dropdown.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired,
    uxTag: PropTypes.string.isRequired
  }
