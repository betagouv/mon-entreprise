import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { MontantField } from '@/design-system'
import { useComparateur } from '@/domaine/comparateur/ComparateurContext'
import { MontantRécurrent } from '@/domaine/Montant'

export const Objectifs = () => {
	const { t } = useTranslation()
	const { comparateur, updateComparateur } = useComparateur()

	const chiffreDAffaires = comparateur.situation.chiffreDAffaires
	const charges = comparateur.situation.charges

	const handleCAChange = (valeur: MontantRécurrent | undefined) => {
		updateComparateur((prevComparateur) => {
			return prevComparateur.set.chiffreDAffaires(O.fromNullable(valeur))
		})
		console.log(comparateur.situation)
		console.log(comparateur.compare())
	}

	const handleChargesChange = (valeur: MontantRécurrent | undefined) => {
		updateComparateur((prevComparateur) => {
			return prevComparateur.set.charges(O.fromNullable(valeur))
		})
		console.log(comparateur.situation)
		console.log(comparateur.compare())
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
