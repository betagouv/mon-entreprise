import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import React from 'react'
import { Route } from 'react-router'
import SimulateurAssimiléSalarié from '../SocialSecurity/AssimiléSalarié'
import SimulateurAutoEntrepreneur from '../SocialSecurity/AutoEntrepreneur'
import SimulateurIndépendant from '../SocialSecurity/Indépendant'
import IframeFooter from './IframeFooter'
import SimulateurEmbauche from './SimulateurEmbauche'

export default function Iframes() {
	return (
		<IsEmbeddedContext.Provider value={true}>
			<div className="ui__ container">
				<Route
					path="/iframes/simulateur-embauche"
					component={SimulateurEmbauche}
				/>
				<Route
					path="/iframes/simulateur-autoentrepreneur"
					component={SimulateurAutoEntrepreneur}
				/>
				<Route
					path="/iframes/simulateur-independant"
					component={SimulateurIndépendant}
				/>
				<Route
					path="/iframes/simulateur-assimilesalarie"
					component={SimulateurAssimiléSalarié}
				/>
				<IframeFooter />
			</div>
		</IsEmbeddedContext.Provider>
	)
}
