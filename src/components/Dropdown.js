import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Dropdown extends Component {
  componentDidMount(){
    this.props.onChange(this.props.options[0].value);
  }

  render() {
    const { options, onChange, defaultSelection } = this.props
    
    return (
      <span>
        <select onChange={e => onChange(options[e.target.value].value)} value={defaultSelection}  >
          {options.map((option,i) => (
            <option value={i} key={i} >
              {option.label}
            </option>
          ))}
        </select>
      </span>
    )
  }
}
 
Dropdown.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultSelection: PropTypes.number.isRequired
  }
