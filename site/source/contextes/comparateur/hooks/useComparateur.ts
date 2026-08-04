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
import { initialSituationComparée } from '../domaine/situation'
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
				modèles.forEach((modèle) =>
					modèle.set.réponse('typeActivité', typeActivité)
				)
			},

			activitéLibéraleRéglementée: (activitéLibéraleRéglementée: boolean) => {
				updateSituation((prev) => ({ ...prev, activitéLibéraleRéglementée }))
				modèles.forEach((modèle) =>
					modèle.set.réponse(
						'activitéLibéraleRéglementée',
						activitéLibéraleRéglementée
					)
				)
			},

			acre: (acre: boolean) => {
				updateSituation((prev) => ({ ...prev, acre }))
				modèles.forEach((modèle) => modèle.set.réponse('acre', acre))
			},

			méthodeImposition: (méthodeImposition: MéthodeImposition) => {
				updateSituation((prev) => ({ ...prev, méthodeImposition }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('méthodeImposition', méthodeImposition)
				)
			},

			tauxImposition: (tauxImposition: O.Option<Quantité<'%'>>) => {
				updateSituation((prev) => ({ ...prev, tauxImposition }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('tauxImposition', tauxImposition)
				)
			},

			situationFamiliale: (situationFamiliale: SituationFamiliale) => {
				updateSituation((prev) => ({ ...prev, situationFamiliale }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('situationFamiliale', situationFamiliale)
				)
			},

			enfants: (enfants: Quantité<'enfant'>) => {
				updateSituation((prev) => ({ ...prev, enfants }))
				modèles.forEach((modèle) => modèle.set.réponse('enfants', enfants))
			},

			parentIsolé: (parentIsolé: boolean) => {
				updateSituation((prev) => ({ ...prev, parentIsolé }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('parentIsolé', parentIsolé)
				)
			},

			autresRevenus: (autresRevenus: Montant<'€/an'>) => {
				updateSituation((prev) => ({ ...prev, autresRevenus }))
				modèles.forEach((modèle) =>
					modèle.set.réponse('autresRevenus', autresRevenus)
				)
			},

			tva: (tva: boolean) => {
				updateSituation((prev) => ({ ...prev, tva }))
				modèles.forEach((modèle) => modèle.set.réponse('tva', tva))
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
