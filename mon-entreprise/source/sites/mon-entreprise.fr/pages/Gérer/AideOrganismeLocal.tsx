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
			<section className="ui__ full-width" css="margin-top: 1rem;">
				<div className="ui__ container" css="position:relative">
					<img
						src={aideOrganismeSvg}
						className="ui__ hide-mobile"
						css="width: 230px; position: absolute; left: -230px; bottom: 0; padding: 1rem;"
					/>
					<h2>
						COVID-19 et auto-entrepreneurs : l'Urssaf Midi-Pyrénées vous
						accompagne
					</h2>
					<p>
						Assistez au webinar dédié aux auto-entrepreneur pour faire le point
						sur vos échéances et les mesures d’accompagnement.
					</p>
					<a
						className="ui__ simple small button"
						href="https://webikeo.fr/webinar/covid-19-auto-entrepreneurs-le-point-sur-vos-echeances-et-les-mesures-d-accompagnement"
					>
						En savoir plus
					</a>
				</div>
			</section>
		</animate.fromTop>
	)
}
