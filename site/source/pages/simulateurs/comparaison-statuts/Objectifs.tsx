import * as O from 'effect/Option'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { MontantField } from '@/design-system'
import { Comparateur } from '@/domaine/comparateur/ComparateurDeModèle'
import { eurosParAn, Montant } from '@/domaine/Montant'

type Props = {
	comparateur: Comparateur
}

export const Objectifs = ({ comparateur }: Props) => {
	const [chiffreDAffaires, setChiffreDAffaires] = useState(
		O.some(eurosParAn(48_000))
	)
	const [charges, setCharges] = useState(O.some(eurosParAn(12_000)))
	const { t } = useTranslation()

	useEffect(() => {
		comparateur.set.chiffreDAffaires(
			O.getOrElse(chiffreDAffaires, () => eurosParAn(0))
		)
		console.log(comparateur.compare())
	}, [comparateur, chiffreDAffaires])

	useEffect(() => {
		comparateur.set.charges(O.getOrElse(charges, () => eurosParAn(0)))
		console.log(comparateur.compare())
	}, [comparateur, charges])

	const handleCAChange = useCallback(
		(valeur: O.Option<Montant<'€/an'>>) => {
			setChiffreDAffaires(valeur)
		},
		[setChiffreDAffaires]
	)

	const InputCA = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<MontantField
				id={id}
				aria={aria}
				value={O.getOrUndefined(chiffreDAffaires)}
				unité="€/an"
				onChange={(montant: Montant<'€/an'> | undefined) =>
					handleCAChange(O.fromNullable(montant))
				}
			/>
		),
		[handleCAChange, chiffreDAffaires]
	)

	const handleChargesChange = useCallback(
		(valeur: O.Option<Montant<'€/an'>>) => {
			setCharges(valeur)
		},
		[setCharges]
	)

	const InputCharges = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<MontantField
				id={id}
				aria={aria}
				value={O.getOrUndefined(charges)}
				unité="€/an"
				onChange={(montant: Montant<'€/an'> | undefined) =>
					handleChargesChange(O.fromNullable(montant))
				}
			/>
		),
		[handleChargesChange, charges]
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
