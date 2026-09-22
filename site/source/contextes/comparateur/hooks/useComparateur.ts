import * as O from 'effect/Option'
import { useMemo } from 'react'

import { Montant } from '@/domaine/Montant'
import { MontantRécurrent } from '@/domaine/MontantRecurrent'
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
	const { modèles, situation, updateSituation, comparaison, unité, setUnité } =
		useSituationContext()

	const set = useMemo(
		() => ({
			chiffreDAffaires: (chiffreDAffaires: O.Option<MontantRécurrent>) => {
				updateSituation((prev) => ({ ...prev, chiffreDAffaires }))
			},

			charges: (charges: O.Option<MontantRécurrent>) => {
				updateSituation((prev) => ({ ...prev, charges }))
			},

			IRouIS: (valeur: IRouIS) => {
				updateSituation((prev) => ({ ...prev, IRouIS: valeur }))
			},

			versementLibératoire: (versementLibératoire: boolean) => {
				updateSituation((prev) => ({ ...prev, versementLibératoire }))
			},

			natureActivité: (natureActivité: NatureActivité) => {
				updateSituation((prev) => ({ ...prev, natureActivité }))
			},

			typeActivité: (typeActivité: TypeActivité) => {
				updateSituation((prev) => ({ ...prev, typeActivité }))
			},

			activitéLibéraleRéglementée: (activitéLibéraleRéglementée: boolean) => {
				updateSituation((prev) => ({ ...prev, activitéLibéraleRéglementée }))
			},

			acre: (acre: boolean) => {
				updateSituation((prev) => ({ ...prev, acre }))
			},

			tva: (tva: boolean) => {
				updateSituation((prev) => ({ ...prev, tva }))
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

			parentIsolé: (parentIsolé: boolean) => {
				updateSituation((prev) => ({ ...prev, parentIsolé }))
			},

			autresRevenus: (autresRevenus: Montant<'€/an'>) => {
				updateSituation((prev) => ({ ...prev, autresRevenus }))
			},

			reset: () => {
				updateSituation(() => initialSituationComparée)
			},
		}),
		[updateSituation]
	)

	const documentationsDeRègle = useMemo(
		() =>
			modèles.map(({ get, DocumentationDeRègle }) => ({
				étiquette: get.statut.étiquette,
				DocumentationDeRègle,
			})),
		[modèles]
	)

	return {
		situation,
		set,
		comparaison,
		documentationsDeRègle,
		unité,
		setUnité,
	}
}
