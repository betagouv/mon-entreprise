import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import animate from 'Components/ui/animate'
import aideOrganismeSvg from './aideOrganisme.svg'

const aideMidiPyrenéesAutoEntrepreneur = (state: RootState) => {
	const company = state.inFranceApp.existingCompany
	if (!company) {
		return false
	}
	return (
		company.dateDeCréation &&
		new Date(company.dateDeCréation) > new Date('2019-04-01') &&
		company.isAutoEntrepreneur &&
		company.localisation &&
		['09', '12', '31', '32', '46', '65', '81', '82'].includes(
			company.localisation.departement.code
		)
	)
}
export default function AideOrganismeLocal() {
	const aideLocale = useSelector(aideMidiPyrenéesAutoEntrepreneur)
	const {
		i18n: { language }
	} = useTranslation()
	if (language !== 'fr' || !aideLocale) {
		return null
	}
	return (
		<animate.fromTop>
			<section className="ui__ full-width light-bg" css="margin-top: 1rem;">
				<div className="ui__ container" css="position:relative">
					<img
						src={aideOrganismeSvg}
						className="ui__ hide-mobile"
						css="width: 230px; position: absolute; left: -230px; bottom: 0; padding: 1rem;"
					/>
					<h2>L'Urssaf Midi-Pyrénées vous accompagne !</h2>
					<p>
						Assistez au webinar dédié aux auto-entrepreneur en début d'activité,
						où vous pourrez poser toutes vos questions.
					</p>
					<a
						className="ui__ simple button"
						href="https://webikeo.fr/webinar/auto-entrepreneurs-maitrisez-les-fondamentaux-pour-une-installation-reussie-3"
					>
						En savoir plus
					</a>
				</div>
			</section>
		</animate.fromTop>
	)
}
