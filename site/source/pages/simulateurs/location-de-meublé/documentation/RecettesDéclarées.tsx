import * as O from 'effect/Option'
import { Trans, useTranslation } from 'react-i18next'

import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { ValeurImportante } from '@/design-system'
import { Montant, montantToString } from '@/domaine/Montant'

export const RecettesDéclarées = () => {
	const { situation } = useEconomieCollaborative()
	const { t } = useTranslation()

	const recettesSaisies =
		situation.typeHébergement === 'meublé-tourisme'
			? situation.recettes
			: O.none<Montant<'€/an'>>()

	if (O.isSome(recettesSaisies)) {
		const recettes = montantToString(recettesSaisies.value)

		return (
			<div>
				<Trans
					i18nKey="pages.simulateurs.location-de-logement-meublé.documentation.recettes-déclarées"
					shouldUnescape
				>
					Vous avez indiqué{' '}
					<ValeurImportante>
						{{ recettes } as unknown as string}
					</ValeurImportante>{' '}
					de recettes.
				</Trans>
			</div>
		)
	}

	return (
		<div>
			{t(
				'pages.simulateurs.location-de-logement-meublé.documentation.remplir-simulateur',
				'Remplissez le simulateur pour plus d’information'
			)}
		</div>
	)
}
