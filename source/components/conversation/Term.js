import React from 'react'
import classNames from 'classnames'
import './Term.css'
import HoverDecorator from '../HoverDecorator'

@HoverDecorator
export default class Term extends React.Component {
	render(){
		let {label, defined, hover, explain} = this.props
		return (
			<span
				className={classNames('term', {defined})}
        >
				{label}
				<span
          className="icon"
          onClick={e => {e.preventDefault(); e.stopPropagation(); explain()}}>
        { hover ? 'ℹ' : '•' }</span>
			</span>
		)
	}
}
