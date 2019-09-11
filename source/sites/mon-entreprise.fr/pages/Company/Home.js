/* @flow */
import { resetCompanyStatusChoice } from 'Actions/companyStatusActions'
import { T } from 'Components'
import { ScrollToElement } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, toPairs } from 'ramda'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import PreviousAnswers from './PreviousAnswers'

import type { TFunction } from 'react-i18next'

import type { Match, Location } from 'react-router'

type OwnProps = {}
type Props = {
	match: Match,
	nextQuestionUrl: string,
	guideAlreadyStarted: boolean,
	resetCompanyStatusChoice: (?string) => void,
	t: TFunction,
	location: Location,
	sitePaths: Object
} & OwnProps
const CreateMyCompany = ({
	match,
	sitePaths,
	nextQuestionUrl,
	guideAlreadyStarted,
	resetCompanyStatusChoice,
	location
}: Props) => {
	useEffect(() => {
		if (!match.isExact) {
			const companyStatusCurrentQuestionName = (toPairs(
				sitePaths.entreprise.statutJuridique
			).find(([, pathname]) => location.pathname === pathname) || [])[0]
			resetCompanyStatusChoice(companyStatusCurrentQuestionName)
			return
		}
	})
	const { t } = useTranslation()

	return (
		<>
			{match.isExact && guideAlreadyStarted && (
				<Redirect to={nextQuestionUrl} />
			)}

			<h1 className="question__title">
				<T k="formeJuridique.titre">Créer une entreprise</T>
			</h1>
			{match.isExact && (
				<>
					<Helmet>
						<title>
							{t(
								'formeJuridique.page.titre',
								'Quel statut juridique choisir : le guide pas à pas'
							)}
						</title>
						<meta
							name="description"
							content={t(
								'formeJuridique.page.description',
								"Le droit des affaires français définit plus de 20 statuts juridiques possibles pour déclarer une société avec différents acronymes et processus : SAS, SARL, SA, EIRL.... Ce guide vous aide rapidement à trouver le bon statut pour votre projet d'entreprise"
							)}
						/>
					</Helmet>

					<p>
						<Link to={sitePaths.entreprise.trouver}>
							<T k="formeJuridique.entreprise-déjà-crée">
								J'ai déjà déclaré mon entreprise
							</T>
						</Link>
					</p>
					<p>
						<T k="formeJuridique.intro">
							Le droit des sociétés définit plus de 20 statuts juridiques
							possibles pour déclarer une société avec différents acronymes et
							démarches : SAS, SARL, SA, EIRL.... Ce guide vous aide à trouver
							rapidement le statut qui vous convient.
						</T>
					</p>
					<div className="ui__ answer-group">
						<Link
							className="ui__ button plain"
							to={sitePaths.entreprise.statutJuridique.multipleAssociates}>
							<T>Commencer</T>
						</Link>
						<Link
							to={sitePaths.entreprise.statutJuridique.liste}
							className="ui__ simple skip button">
							<T>Je connais mon statut</T> →
						</Link>
					</div>
				</>
			)}
			<PreviousAnswers />
			<ScrollToElement />
		</>
	)
}

export default (compose(
	withSitePaths,
	connect(
		(state, { sitePaths }) => ({
			nextQuestionUrl: nextQuestionUrlSelector(state, { sitePaths }),
			guideAlreadyStarted: !!Object.keys(state.inFranceApp.companyLegalStatus)
				.length
		}),
		{ resetCompanyStatusChoice }
	)
)(CreateMyCompany): React$ComponentType<OwnProps>)
