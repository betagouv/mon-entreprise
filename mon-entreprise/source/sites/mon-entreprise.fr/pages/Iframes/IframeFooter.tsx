import React from 'react'
import Privacy from '../../layout/Footer/Privacy'

export default function IframeFooter() {
	return (
		<>
			<div
				className="ui__ container notice"
				style={{
					textAlign: 'center',
					paddingTop: '3rem',
					paddingBottom: '1rem'
				}}
			>
				<Privacy />
			</div>
		</>
	)
}
