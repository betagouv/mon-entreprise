import { Trans } from 'react-i18next'

import { ABATTEMENT_REGIME_GENERAL } from '@/contextes/économie-collaborative'
import { DarkLi, ExemplePratique, Ul } from '@/design-system'
import { eurosParAn, montantToString } from '@/domaine/Montant'

export const ExempleCalcul = () => {
	const taux = ABATTEMENT_REGIME_GENERAL
	const recettes = montantToString(eurosParAn(20_000))
	const abattement = montantToString(eurosParAn(20_000 * taux))
	const baseImposable = montantToString(eurosParAn(20_000 * (1 - taux)))
	const pourcentage = taux * 100

	return (
		<ExemplePratique>
			<Trans
				i18nKey="pages.simulateurs.location-de-logement-meublé.documentation.exemple.recettes"
				shouldUnescape
			>
				Pour des recettes de {{ recettes } as unknown as string} en location
				classique :
			</Trans>
			<Ul>
				<DarkLi>
					<Trans
						i18nKey="pages.simulateurs.location-de-logement-meublé.documentation.exemple.abattement"
						shouldUnescape
					>
						Abattement de {{ pourcentage } as unknown as string}% :{' '}
						<strong>{{ abattement } as unknown as string}</strong>
					</Trans>
				</DarkLi>
				<DarkLi>
					<Trans
						i18nKey="pages.simulateurs.location-de-logement-meublé.documentation.exemple.base"
						shouldUnescape
					>
						Base imposable :{' '}
						<strong>{{ baseImposable } as unknown as string}</strong>
					</Trans>
				</DarkLi>
			</Ul>
		</ExemplePratique>
	)
}
