import * as O from 'effect/Option'
import rules, { RègleModèleAssimiléSalarié } from 'modele-as'
import Engine from 'publicodes'

import { PublicodesAdapter } from '../engine/PublicodesAdapter'
import {
	euros,
	eurosParAn,
	eurosParJour,
	eurosParMois,
	moins,
	MontantRécurrent,
} from '../Montant'
import { pointsParAn, trimestresValidésParAn } from '../Quantité'
import {
	ModèleComparable,
	MontantDocumenté,
	QuantitéDocumentée,
} from './ModèleComparable'

let engine: Engine<RègleModèleAssimiléSalarié> | null = null
let chiffreDAffaires: MontantRécurrent = eurosParAn(0)
let charges: MontantRécurrent = eurosParAn(0)

export const ModèleAssimiléSalarié: ModèleComparable = {
	nom: 'modele-as',

	set: {
		chiffreDAffaires: (montant: MontantRécurrent) => {
			chiffreDAffaires = montant

			const revenuBrut = moins(chiffreDAffaires, charges)

			if (!engine) {
				engine = new Engine(rules)
			}

			engine?.setSituation(
				{
					'assimilé salarié . rémunération . totale': PublicodesAdapter.encode(
						O.some(revenuBrut)
					),
				},
				{ keepPreviousSituation: true }
			)
		},

		charges: (montant: MontantRécurrent) => {
			charges = montant

			const revenuBrut = moins(chiffreDAffaires, charges)

			if (!engine) {
				engine = new Engine(rules)
			}

			engine?.setSituation(
				{
					'assimilé salarié . rémunération . totale': PublicodesAdapter.encode(
						O.some(revenuBrut)
					),
				},
				{ keepPreviousSituation: true }
			)
		},
	},

	get: {
		revenuNetAprèsImpôt: () => {
			let montant = eurosParAn(0) as MontantDocumenté

			if (engine) {
				const calcul = engine.evaluate(
					'assimilé salarié . rémunération . nette . après impôt'
				)
				montant = O.getOrElse(PublicodesAdapter.decode(calcul), () =>
					eurosParAn(0)
				) as MontantDocumenté
			}

			montant.documentationRule =
				'assimilé salarié . rémunération . nette . après impôt'

			return montant
		},

		retraite: () => {
			let trimestres = trimestresValidésParAn(0) as QuantitéDocumentée
			let revenuCotisé = eurosParAn(0) as MontantDocumenté
			let pointsComplémentaire = pointsParAn(0) as QuantitéDocumentée

			if (engine) {
				const calculTrimestres = engine.evaluate(
					'protection sociale . retraite . base . trimestres'
				)
				trimestres = O.getOrElse(
					PublicodesAdapter.decode(calculTrimestres),
					() => trimestresValidésParAn(0)
				) as QuantitéDocumentée

				const calculRevenuCotisé = engine.evaluate(
					'protection sociale . retraite . base . revenu cotisé'
				)
				revenuCotisé = O.getOrElse(
					PublicodesAdapter.decode(calculRevenuCotisé),
					() => eurosParAn(0)
				) as MontantDocumenté

				const calculPointsAcquis = engine.evaluate(
					'protection sociale . retraite . complémentaire . points acquis'
				)
				pointsComplémentaire = O.getOrElse(
					PublicodesAdapter.decode(calculPointsAcquis),
					() => pointsParAn(0)
				) as QuantitéDocumentée
			}

			trimestres.documentationRule =
				'protection sociale . retraite . trimestres'
			revenuCotisé.documentationRule =
				'protection sociale . retraite . base . revenu cotisé'
			pointsComplémentaire.documentationRule =
				'protection sociale . retraite . complémentaire . points acquis'

			return {
				documentationRule: 'protection sociale . retraite',
				trimestres,
				revenuCotisé,
				pointsComplémentaire,
			}
		},

		maladie: () => {
			let indemnitésArrêtMaladie = eurosParJour(0) as MontantDocumenté
			let indemnitésATMP = eurosParJour(0) as MontantDocumenté
			let allocationNaissance = euros(0) as MontantDocumenté
			let allocationAdoption = euros(0) as MontantDocumenté

			if (engine) {
				const calculIndemnitésArrêtMaladie = engine.evaluate(
					'protection sociale . maladie . arrêt maladie'
				)
				indemnitésArrêtMaladie = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésArrêtMaladie),
					() => eurosParJour(0)
				) as MontantDocumenté

				const calculIndemnitésATMP = engine.evaluate(
					'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
				)
				indemnitésATMP = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésATMP),
					() => eurosParJour(0)
				) as MontantDocumenté

				const calculAllocationNaissance = engine.evaluate(
					'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel'
				)
				allocationNaissance = O.getOrElse(
					PublicodesAdapter.decode(calculAllocationNaissance),
					() => euros(0)
				) as MontantDocumenté

				const calculAllocationAdoption = engine.evaluate(
					'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption'
				)
				allocationAdoption = O.getOrElse(
					PublicodesAdapter.decode(calculAllocationAdoption),
					() => euros(0)
				) as MontantDocumenté
			}

			indemnitésArrêtMaladie.documentationRule =
				'protection sociale . maladie . arrêt maladie'
			indemnitésATMP.documentationRule =
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
			allocationNaissance.documentationRule =
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel'
			allocationAdoption.documentationRule =
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption'

			return {
				documentationRule: 'protection sociale . maladie',
				indemnitésArrêtMaladie,
				indemnitésATMP,
				allocationNaissance,
				allocationAdoption,
			}
		},

		invalidité: () => {
			let pensionInvaliditéPartielle = eurosParMois(0) as MontantDocumenté
			let pensionInvaliditéTotale = eurosParMois(0) as MontantDocumenté
			let renteIncapacitéATMP = eurosParMois(0) as MontantDocumenté

			if (engine) {
				const calculPensionInvaliditéPartielle = engine.evaluate(
					'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
				)
				pensionInvaliditéPartielle = O.getOrElse(
					PublicodesAdapter.decode(calculPensionInvaliditéPartielle),
					() => eurosParMois(0)
				) as MontantDocumenté

				const calculPensionInvaliditéTotale = engine.evaluate(
					'protection sociale . invalidité et décès . pension invalidité . invalidité totale'
				)
				pensionInvaliditéTotale = O.getOrElse(
					PublicodesAdapter.decode(calculPensionInvaliditéTotale),
					() => eurosParMois(0)
				) as MontantDocumenté

				const calculRenteIncapacitéATMP = engine.evaluate(
					'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité'
				)
				renteIncapacitéATMP = O.getOrElse(
					PublicodesAdapter.decode(calculRenteIncapacitéATMP),
					() => eurosParMois(0)
				) as MontantDocumenté
			}

			pensionInvaliditéPartielle.documentationRule =
				'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
			pensionInvaliditéTotale.documentationRule =
				'protection sociale . invalidité et décès . pension invalidité . invalidité totale'
			renteIncapacitéATMP.documentationRule =
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité'

			return {
				documentationRule: 'protection sociale . invalidité et décès',
				pensionInvaliditéPartielle,
				pensionInvaliditéTotale,
				renteIncapacitéATMP,
			}
		},

		décès: () => {
			let pensionDeRéversion = eurosParMois(0) as MontantDocumenté
			let capitalDécès = euros(0) as MontantDocumenté
			let renteDécèsATMP = eurosParMois(0) as MontantDocumenté

			if (engine) {
				const calculPensionDeRéversion = engine.evaluate(
					'protection sociale . invalidité et décès . pension de reversion'
				)
				pensionDeRéversion = O.getOrElse(
					PublicodesAdapter.decode(calculPensionDeRéversion),
					() => eurosParMois(0)
				) as MontantDocumenté

				const calculCapitalDécès = engine.evaluate(
					'protection sociale . invalidité et décès . capital décès'
				)
				capitalDécès = O.getOrElse(
					PublicodesAdapter.decode(calculCapitalDécès),
					() => euros(0)
				) as MontantDocumenté

				const calculRenteDécèsATMP = engine.evaluate(
					'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès'
				)
				renteDécèsATMP = O.getOrElse(
					PublicodesAdapter.decode(calculRenteDécèsATMP),
					() => eurosParMois(0)
				) as MontantDocumenté
			}

			pensionDeRéversion.documentationRule =
				'protection sociale . invalidité et décès . pension de reversion'
			capitalDécès.documentationRule =
				'protection sociale . invalidité et décès . capital décès'
			renteDécèsATMP.documentationRule =
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès'

			return {
				documentationRule: 'protection sociale . invalidité et décès',
				pensionDeRéversion,
				capitalDécès,
				renteDécèsATMP,
			}
		},
	},
}
