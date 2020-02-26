import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getSessionStorage } from '../../../../utils'
import { constructLocalizedSitePath } from '../../sitePaths'

type ProviderProps = {
	situation
}

export class AideDéclarationIndépendantsRécapitulatif extends Component<
	ProviderProps
> {
	render() {
		const lang = getSessionStorage()?.getItem('lang')
		const sitePaths = constructLocalizedSitePath(lang ? lang : 'fr')
		return (
			<>
				<Link to={sitePaths.gérer.déclarationIndépendant.index}>Retour</Link>
				<h1>Aide à la déclaration de revenus au titre de l'année 2019</h1>
			</>
		)
	}
}
