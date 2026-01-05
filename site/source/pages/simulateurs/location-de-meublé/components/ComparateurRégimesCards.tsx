import { pipe } from 'effect'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	compareApplicabilitéDesRégimes,
	estSituationValide,
	RegimeCotisation,
	useEconomieCollaborative,
	type RésultatApplicabilitéParRégime,
} from '@/contextes/économie-collaborative'
import { Grid, Spacing, Ul } from '@/design-system'

import { getGridSizes } from '../../comparaison-statuts/components/DetailsRowCards'
import { MicroEntrepriseCard } from './MicroEntrepriseCard'
import { RégimeGénéralCard } from './RégimeGénéralCard'
import { TravailleurIndépendantCard } from './TravailleurIndépendantCard'

export const ComparateurRégimesCards = () => {
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const résultats = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareApplicabilitéDesRégimes),
		O.getOrElse((): RésultatApplicabilitéParRégime[] => [])
	)

	const gridSizes = getGridSizes(1, 3)

	return (
		<div>
			<Spacing lg />
			<Grid
				container
				spacing={4}
				as={Ul}
				aria-label={t(
					'pages.simulateurs.location-de-logement-meublé.comparateur.aria-label',
					"Comparaison des régimes d'affiliation"
				)}
			>
				{résultats.map((résultat) => (
					<Grid key={résultat.régime} item {...gridSizes} as="li">
						<RégimeCard résultat={résultat} />
					</Grid>
				))}
			</Grid>
		</div>
	)
}

const RégimeCard = ({
	résultat,
}: {
	résultat: RésultatApplicabilitéParRégime
}) => {
	switch (résultat.régime) {
		case RegimeCotisation.regimeGeneral:
			return <RégimeGénéralCard résultat={résultat} />
		case RegimeCotisation.microEntreprise:
			return <MicroEntrepriseCard résultat={résultat} />
		case RegimeCotisation.travailleurIndependant:
			return <TravailleurIndépendantCard résultat={résultat} />
	}
}
