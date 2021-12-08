import { FromTop } from 'Components/ui/animate'
import { Button } from 'DesignSystem/buttons'
import { H2 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
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
		i18n: { language },
	} = useTranslation()
	if (language !== 'fr' || !aideLocale) {
		return null
	}
	return (
		<FromTop>
			<section>
				<img
					src={aideOrganismeSvg}
					className="ui__ hide-mobile"
					css="width: 230px; position: absolute; left: -230px; bottom: 0; padding: 1rem;"
				/>
				<H2>
					COVID-19 et auto-entrepreneurs : l'Urssaf Midi-Pyrénées vous
					accompagne
				</H2>
				<Body>
					Assistez au webinar dédié aux auto-entrepreneur pour faire le point
					sur vos échéances et les mesures d’accompagnement.
				</Body>
				<Button
					size="xs"
					href="https://webikeo.fr/webinar/covid-19-auto-entrepreneurs-le-point-sur-vos-echeances-et-les-mesures-d-accompagnement"
				>
					En savoir plus
				</Button>
			</section>
		</FromTop>
	)
}
