import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Dropdown extends Component {
  componentDidMount(){
    const { optionSet, onChange, defaultSelection } = this.props

    onChange(optionSet[defaultSelection].option);
    console.log("Drop down MOUNTED!!!!");
  }

  render() {
    const { optionSet, onChange, defaultSelection } = this.props
    
    return (
      <span>
        <select onChange={e => {onChange(optionSet[e.target.value].option)}} value={defaultSelection}  >
          {optionSet.map((o,i) => (
            <option value={i} key={i} >
              {o.option.label}
            </option>
          ))}
        </select>
      </span>
    )
  }
}
 
Dropdown.propTypes = {
    optionSet: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultSelection: PropTypes.number.isRequired
  }
