import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useComparateur } from '@/contextes/comparateur'
import { MontantField } from '@/design-system'
import { MontantRécurrent } from '@/domaine/MontantRécurrent'

import { ChoixImposition } from './components/ChoixImposition'
import { ChoixVersementLibératoire } from './components/ChoixVersementLiberatoire'

export const Objectifs = () => {
	const { t } = useTranslation()
	const { situation, set } = useComparateur()

	const chiffreDAffaires = situation.chiffreDAffaires
	const charges = situation.charges

	const handleCAChange = (valeur: MontantRécurrent | undefined) => {
		set.chiffreDAffaires(O.fromNullable(valeur))
	}

	const handleChargesChange = (valeur: MontantRécurrent | undefined) => {
		set.charges(O.fromNullable(valeur))
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
				description={t(
					'pages.simulateurs.comparaison-status.objectifs.CA.description',
					'Montant total des recettes brutes (hors taxe)'
				)}
			/>

			<ObjectifSaisissableDeSimulation
				id="comparaison-status-charges"
				titre={t(
					'pages.simulateurs.comparaison-status.objectifs.charges.titre',
					'Charges (hors rémunération dirigeant)'
				)}
				valeur={charges}
				rendreChampSaisie={InputCharges}
				description={t(
					'pages.simulateurs.comparaison-status.objectifs.charges.description',
					'Total des dépenses nécessaires à l’entreprise, en excluant les cotisations et contributions sociales qui sont automatiquement déduites par le simulateur'
				)}
			/>

			<ChoixImposition />

			<ChoixVersementLibératoire />
		</>
	)
}
