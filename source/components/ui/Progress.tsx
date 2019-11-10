import React from 'react'
import './Progress.css'

type ProgressProps = {
	progress: number
	style?: React.CSSProperties
	className: string
}

export default function Progress({
	progress,
	style,
	className
}: ProgressProps) {
	return (
		<div className={'progress__container ' + className} style={style}>
			<div className="progress__bar" style={{ width: `${progress * 100}%` }} />
		</div>
	)
}
