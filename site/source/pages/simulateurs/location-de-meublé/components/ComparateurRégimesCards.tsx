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
import { Grid, H3, Spacing, Ul } from '@/design-system'

import { MicroEntrepriseCard } from './MicroEntrepriseCard'
import { RégimeGénéralCard } from './RégimeGénéralCard'
import { SécuritéSocialeIndépendantsCard } from './SécuritéSocialeIndépendantsCard'

export const ComparateurRégimesCards = () => {
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const résultats = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareApplicabilitéDesRégimes),
		O.getOrElse((): RésultatApplicabilitéParRégime[] => [])
	)

	return (
		<div>
			<Spacing lg />
			<H3>
				{t(
					'pages.simulateurs.location-de-logement-meublé.régimes.titre',
					'Régimes de sécurité sociale'
				)}
			</H3>
			<Grid container spacing={4} as={Ul} data-testid="comparateur-régimes">
				{résultats.map((résultat) => (
					<Grid key={résultat.régime} item xs={12} lg={4} as="li">
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
			return <SécuritéSocialeIndépendantsCard résultat={résultat} />
	}
}
