import React from 'react'
import './Progress.css'

export default function Progress({ progress }) {
	return (
		<div className="progress__container">
			<div className="progress__bar" style={{ width: `${progress * 100}%` }} />
		</div>
	)
}
