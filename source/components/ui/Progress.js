import React from 'react'
import './Progress.css'

export default function Progress({ progress, style, className }) {
	return (
		<div className={'progress__container ' + className} style={style}>
			<div className="progress__bar" style={{ width: `${progress * 100}%` }} />
		</div>
	)
}
