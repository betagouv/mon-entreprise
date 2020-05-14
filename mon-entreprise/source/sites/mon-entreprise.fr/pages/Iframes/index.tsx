import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import React from 'react'
import { Route } from 'react-router-dom'
import { inIframe } from '../../../../utils'
import SimulateurChômagePartiel from '../Coronavirus'
import SimulateurArtisteAuteur from '../Simulateurs/ArtisteAuteur'
import SimulateurAssimiléSalarié from '../Simulateurs/AssimiléSalarié'
import SimulateurAutoEntrepreneur from '../Simulateurs/AutoEntrepreneur'
import SimulateurIndépendant from '../Simulateurs/Indépendant'
import IframeFooter from './IframeFooter'
import SimulateurEmbauche from './SimulateurEmbauche'

export default function Iframes() {
	return (
		<IsEmbeddedContext.Provider value={true}>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive. */}
			<base target="_parent" />
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
				<Route
					path="/iframes/simulateur-artiste-auteur"
					component={SimulateurArtisteAuteur}
				/>
				<Route
					path="/iframes/simulateur-chomage-partiel"
					component={SimulateurChômagePartiel}
				/>
				{inIframe() && <IframeFooter />}
			</div>
		</IsEmbeddedContext.Provider>
	)
}
