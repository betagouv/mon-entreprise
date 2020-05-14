import React from 'react'
import Privacy from '../../layout/Footer/Privacy'

export default function IframeFooter() {
	return (
		<>
			<div
				className="ui__ container"
				style={{ textAlign: 'right', paddingTop: 20 }}
			>
				<Privacy />
			</div>
		</>
	)
}
