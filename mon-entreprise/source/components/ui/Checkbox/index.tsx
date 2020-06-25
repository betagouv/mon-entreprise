import React from 'react'
import './index.css'

export default function Checkbox(
	props: React.ComponentProps<'input'> & { label?: string }
) {
	return (
		<>
			<input
				type="checkbox"
				className="ui__ checkbox-input"
				style={{ display: 'none' }}
				{...props}
			/>
			<label
				htmlFor={props.id}
				tabIndex={0}
				style={{ display: 'flex', alignItems: 'center' }}
			>
				<div className="ui__ checkbox">
					<svg width="1em" height="1em" viewBox="0 0 18 18">
						<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
						<polyline points="1 9 7 14 15 4" />
					</svg>
				</div>
				{'label' in props && (
					<span style={{ marginLeft: '0.6rem' }}>{props.label}</span>
				)}
			</label>
		</>
	)
}
