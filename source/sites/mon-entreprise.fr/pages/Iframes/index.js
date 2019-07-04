import React from 'react'
import { Route } from 'react-router'
import IframeFooter from './IframeFooter'
import SimulateurEmbauche from './SimulateurEmbauche'

export default function Iframes() {
	return (
		<div className="ui__ container">
			<Route
				path="/iframes/simulateur-embauche"
				component={SimulateurEmbauche}
			/>
			<IframeFooter />
		</div>
	)
}
