import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useComparateur } from '@/contextes/comparateur'
import { MontantField } from '@/design-system'
import { MontantRécurrent } from '@/domaine/Montant'

export const Objectifs = () => {
	const { t } = useTranslation()
	const { situation, set } = useComparateur()

	const chiffreDAffaires = situation.chiffreDAffaires
	const charges = situation.charges

	const handleCAChange = (valeur: MontantRécurrent | undefined) => {
		set.chiffreDAffaires(O.fromNullable(valeur))
		// console.log(situation)
	}

	const handleChargesChange = (valeur: MontantRécurrent | undefined) => {
		set.charges(O.fromNullable(valeur))
		// console.log(situation)
	}

	const InputCA = ({ id, aria }: ChampSaisieProps) => (
		<MontantField
			id={id}
			aria={aria}
			value={O.getOrUndefined(chiffreDAffaires)}
			unité="€/an"
			onChange={handleCAChange}
		/>
	)

	const InputCharges = ({ id, aria }: ChampSaisieProps) => (
		<MontantField
			id={id}
			aria={aria}
			value={O.getOrUndefined(charges)}
			unité="€/an"
			onChange={handleChargesChange}
		/>
	)

	return (
		<>
			<ObjectifSaisissableDeSimulation
				id="comparaison-status-CA"
				titre={t(
					'pages.simulateurs.comparaison-status.objectifs.CA.titre',
					"Chiffre d'affaires estimé"
				)}
				valeur={chiffreDAffaires}
				rendreChampSaisie={InputCA}
			/>

			<ObjectifSaisissableDeSimulation
				id="comparaison-status-charges"
				titre={t(
					'pages.simulateurs.comparaison-status.objectifs.charges.titre',
					'Charges estimé'
				)}
				valeur={charges}
				rendreChampSaisie={InputCharges}
			/>
		</>
	)
}
