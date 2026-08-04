import * as O from 'effect/Option'
import { useMemo } from 'react'

import { Montant, MontantRécurrent } from '@/domaine/Montant'
import { Quantité } from '@/domaine/Quantite'

import { NatureActivité, TypeActivité } from '../domaine/activite'
import {
	IRouIS,
	MéthodeImposition,
	SituationFamiliale,
} from '../domaine/imposition'
import {
	initialSituationComparée,
	SituationComparée,
} from '../domaine/situation'
import { useSituationContext } from './ComparaisonStatutsContext'

export const useComparateur = () => {
	const { modèles, situation, updateSituation } = useSituationContext()

	const set = useMemo(
		() => ({
			chiffreDAffaires: (chiffreDAffaires: O.Option<MontantRécurrent>) => {
				updateSituation((prev) => ({ ...prev, chiffreDAffaires }))
				modèles.forEach((modèle) =>
					modèle.set.chiffreDAffaires(chiffreDAffaires)
				)
			},

			charges: (charges: O.Option<MontantRécurrent>) => {
				updateSituation((prev) => ({ ...prev, charges }))
				modèles.forEach((modèle) => modèle.set.charges(charges))
			},

			IRouIS: (valeur: IRouIS) => {
				updateSituation((prev) => ({ ...prev, IRouIS: valeur }))
				modèles.forEach((modèle) => modèle.set.IRouIS?.(valeur))
			},

			versementLibératoire: (versementLibératoire: boolean) => {
				updateSituation((prev) => ({ ...prev, versementLibératoire }))
				modèles.forEach((modèle) =>
					modèle.set.versementLibératoire?.(versementLibératoire)
				)
			},

			natureActivité: (natureActivité: NatureActivité) => {
				updateSituation((prev) => ({ ...prev, natureActivité }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('natureActivité', natureActivité)
				)
			},

			typeActivité: (typeActivité: TypeActivité) => {
				updateSituation((prev) => ({ ...prev, typeActivité }))
			},

			activitéLibéraleRéglementée: (activitéLibéraleRéglementée: boolean) => {
				updateSituation((prev) => ({ ...prev, activitéLibéraleRéglementée }))
			},

			méthodeImposition: (méthodeImposition: MéthodeImposition) => {
				updateSituation((prev) => ({ ...prev, méthodeImposition }))
			},

			tauxImposition: (tauxImposition: O.Option<Quantité<'%'>>) => {
				updateSituation((prev) => ({ ...prev, tauxImposition }))
			},

			situationFamiliale: (situationFamiliale: SituationFamiliale) => {
				updateSituation((prev) => ({ ...prev, situationFamiliale }))
			},

			enfants: (enfants: Quantité<'enfant'>) => {
				updateSituation((prev) => ({ ...prev, enfants }))
			},

			autresRevenus: (autresRevenus: Montant<'€/an'>) => {
				updateSituation((prev) => ({ ...prev, autresRevenus }))
			},

			tva: (tva: boolean) => {
				updateSituation((prev) => ({ ...prev, tva }))
			},

			situation: (situation: SituationComparée) => {
				updateSituation(() => situation)
			},

			reset: () => {
				updateSituation(() => initialSituationComparée)
				modèles.forEach((modèle) => {
					modèle.set.chiffreDAffaires(initialSituationComparée.chiffreDAffaires)
					modèle.set.charges(initialSituationComparée.charges)
					modèle.set.IRouIS?.(initialSituationComparée.IRouIS)
					modèle.set.versementLibératoire?.(
						initialSituationComparée.versementLibératoire
					)
				})
			},
		}),
		[modèles, updateSituation]
	)

	const comparaison = useMemo(() => {
		if (O.isNone(situation.chiffreDAffaires)) {
			return []
		}

		return modèles.map((modèle) => {
			return {
				nomModèle: modèle.nom,
				...modèle.get,
			}
		})
	}, [modèles, situation.chiffreDAffaires])

	return {
		situation,
		set,
		comparaison,
	}
}
