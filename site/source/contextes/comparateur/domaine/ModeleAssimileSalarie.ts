import * as O from 'effect/Option'
import rules from 'modele-as'
import Engine from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import {
	euros,
	eurosParAn,
	eurosParJour,
	eurosParMois,
	moins,
	MontantRécurrent,
} from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	pointsParAn,
	quantité,
	trimestresValidésParAn,
} from '@/domaine/Quantite'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import {
	ModèleComparable,
	MontantDocumenté,
	MontantRécurrentDocumenté,
	QuantitéDocumentée,
} from './modeleComparable'

const nomModèle = 'modele-as'

let engine: Engine<DottedName> | null = null
let chiffreDAffaires: O.Option<MontantRécurrent> = O.none()
let charges: O.Option<MontantRécurrent> = O.none()

const setRevenuBrut = () => {
	if (O.isNone(chiffreDAffaires)) {
		return
	}

	const revenuBrut = moins(
		chiffreDAffaires.value,
		O.getOrElse(charges, () => eurosParAn(0))
	)

	if (!engine) {
		engine = engineFactory(rules, nomModèle)
	}

	engine.setSituation(
		{
			'assimilé salarié . rémunération . totale': PublicodesAdapter.encode(
				O.some(revenuBrut)
			),
		},
		{ keepPreviousSituation: true }
	)
}

export const ModèleAssimiléSalarié: ModèleComparable = {
	nom: nomModèle,

	set: {
		chiffreDAffaires: (montant: O.Option<MontantRécurrent>) => {
			chiffreDAffaires = montant
			setRevenuBrut()
		},

		charges: (montant: O.Option<MontantRécurrent>) => {
			charges = montant
			setRevenuBrut()
		},

		réponse: () => {},
	},

	get: {
		engine: () => engine ?? engineFactory(rules, nomModèle),

		revenu: () => {
			let bénéfice = eurosParMois(0) as MontantRécurrentDocumenté
			let revenuNetAprèsImpôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculBénéfice = engine.evaluate(
					'assimilé salarié . rémunération . totale'
				)
				bénéfice = O.getOrElse(PublicodesAdapter.decode(calculBénéfice), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculNetAprèsImpôt = engine.evaluate(
					'assimilé salarié . rémunération . nette . après impôt'
				)
				revenuNetAprèsImpôt = O.getOrElse(
					PublicodesAdapter.decode(calculNetAprèsImpôt),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			bénéfice.documentationRule = 'assimilé salarié . rémunération . totale'
			revenuNetAprèsImpôt.documentationRule =
				'assimilé salarié . rémunération . nette . après impôt'

			return {
				bénéfice,
				revenuNetAprèsImpôt,
			}
		},

		dépenses: () => {
			let cotisations = eurosParMois(0) as MontantRécurrentDocumenté
			let impôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculCotisations = engine.evaluate(
					'assimilé salarié . cotisations'
				)
				cotisations = O.getOrElse(
					PublicodesAdapter.decode(calculCotisations),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculImpôt = engine.evaluate(
					'assimilé salarié . rémunération . impôt'
				)
				impôt = O.getOrElse(PublicodesAdapter.decode(calculImpôt), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			cotisations.documentationRule = 'assimilé salarié . cotisations'
			impôt.documentationRule = 'assimilé salarié . rémunération . impôt'

			return {
				cotisations,
				impôt,
			}
		},

		retraite: () => {
			let trimestres = trimestresValidésParAn(0) as QuantitéDocumentée
			let revenuCotisé = eurosParAn(0) as MontantRécurrentDocumenté
			let pointsComplémentaire = pointsParAn(0) as QuantitéDocumentée
			let valeurPointComplémentaire = eurosParAn(0) as MontantRécurrentDocumenté

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
				) as MontantRécurrentDocumenté

				const calculPointsAcquis = engine.evaluate(
					'protection sociale . retraite . complémentaire . points acquis'
				)
				pointsComplémentaire = O.getOrElse(
					PublicodesAdapter.decode(calculPointsAcquis),
					() => pointsParAn(0)
				) as QuantitéDocumentée

				const calculValeurPointComplémentaire = engine.evaluate({
					valeur:
						'protection sociale . retraite . complémentaire . valeur du point',
					unité: '€/an',
				})
				valeurPointComplémentaire = O.getOrElse(
					PublicodesAdapter.decode(calculValeurPointComplémentaire),
					() => eurosParAn(0)
				) as MontantRécurrentDocumenté
			}

			trimestres.documentationRule =
				'protection sociale . retraite . base . trimestres'
			revenuCotisé.documentationRule =
				'protection sociale . retraite . base . revenu cotisé'
			pointsComplémentaire.documentationRule =
				'protection sociale . retraite . complémentaire . points acquis'
			valeurPointComplémentaire.documentationRule =
				'protection sociale . retraite . complémentaire . valeur du point'

			return {
				documentationRule: 'protection sociale . retraite',
				trimestres,
				revenuCotisé,
				pointsComplémentaire,
				valeurPointComplémentaire,
			}
		},

		maladie: () => {
			let indemnitésArrêtMaladie = eurosParJour(0) as MontantRécurrentDocumenté
			let indemnitésATMP = eurosParJour(0) as MontantRécurrentDocumenté
			let indemnitésATMPLongTerme = eurosParJour(0) as MontantRécurrentDocumenté
			let délaiAttente = quantité(0, 'mois') as QuantitéDocumentée

			indemnitésArrêtMaladie.documentationRule =
				'protection sociale . maladie . arrêt maladie'
			indemnitésATMP.documentationRule =
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
			indemnitésATMPLongTerme.documentationRule =
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour'
			délaiAttente.documentationRule =
				"protection sociale . maladie . arrêt maladie . délai d'attente"

			if (engine) {
				const calculIndemnitésArrêtMaladie = engine.evaluate(
					'protection sociale . maladie . arrêt maladie'
				)
				indemnitésArrêtMaladie = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésArrêtMaladie),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté

				const calculDélaiAttente = engine.evaluate(
					"protection sociale . maladie . arrêt maladie . délai d'attente"
				)
				délaiAttente = O.getOrElse(
					PublicodesAdapter.decode(calculDélaiAttente),
					() => quantité(0, 'mois')
				) as QuantitéDocumentée

				const calculIndemnitésATMP = engine.evaluate(
					'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
				)
				indemnitésATMP = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésATMP),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté

				const calculIndemnitésATMPLongTerme = engine.evaluate(
					'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour'
				)
				indemnitésATMPLongTerme = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésATMPLongTerme),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté
			}

			indemnitésArrêtMaladie.documentationRule =
				'protection sociale . maladie . arrêt maladie'
			délaiAttente.documentationRule =
				"protection sociale . maladie . arrêt maladie . délai d'attente"
			indemnitésATMP.documentationRule =
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
			indemnitésATMPLongTerme.documentationRule =
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour'

			return {
				documentationRule: 'protection sociale . maladie',
				indemnitésArrêtMaladie,
				délaiAttente,
				indemnitésATMP,
				indemnitésATMPLongTerme,
			}
		},

		parentalité: () => {
			let indemnitésMaternitéPaternitéAdoption = eurosParJour(
				0
			) as MontantRécurrentDocumenté

			if (engine) {
				const calculIndemnitésMaternitéPaternitéAdoption = engine.evaluate(
					'protection sociale . maladie . maternité paternité adoption'
				)
				indemnitésMaternitéPaternitéAdoption = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésMaternitéPaternitéAdoption),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté
			}

			indemnitésMaternitéPaternitéAdoption.documentationRule =
				'protection sociale . maladie . maternité paternité adoption'

			return {
				documentationRule: 'protection sociale . maladie',
				indemnitésMaternitéPaternitéAdoption,
			}
		},

		invalidité: () => {
			let pensionInvaliditéPartielle = eurosParMois(
				0
			) as MontantRécurrentDocumenté
			let pensionInvaliditéTotale = eurosParMois(0) as MontantRécurrentDocumenté
			let renteIncapacitéATMP = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculPensionInvaliditéPartielle = engine.evaluate(
					'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
				)
				pensionInvaliditéPartielle = O.getOrElse(
					PublicodesAdapter.decode(calculPensionInvaliditéPartielle),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculPensionInvaliditéTotale = engine.evaluate(
					'protection sociale . invalidité et décès . pension invalidité . invalidité totale'
				)
				pensionInvaliditéTotale = O.getOrElse(
					PublicodesAdapter.decode(calculPensionInvaliditéTotale),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculRenteIncapacitéATMP = engine.evaluate(
					'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité'
				)
				renteIncapacitéATMP = O.getOrElse(
					PublicodesAdapter.decode(calculRenteIncapacitéATMP),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté
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
			let pensionDeRéversion = eurosParMois(0) as MontantRécurrentDocumenté
			let capitalDécès = euros(0) as MontantDocumenté
			let renteDécèsATMP = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculPensionDeRéversion = engine.evaluate(
					'protection sociale . invalidité et décès . pension de reversion'
				)
				pensionDeRéversion = O.getOrElse(
					PublicodesAdapter.decode(calculPensionDeRéversion),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté

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
				) as MontantRécurrentDocumenté
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

		// gestion: () => {
		// 	return {
		// 		coûtsDeCréation: euros(191.43),
		// 		statutConjointe: (t: TFunction) => t('pages.simulateurs.comparaison-statuts.items.gestion.conjoint.assimilé-salarié', 'Conjoint associé ou salarié / Conjointe associée ou salariée'),
		// 	}
		// },

		warning: () => {
			let revenuTropBasPourIJ = false

			if (engine) {
				revenuTropBasPourIJ = !engine.evaluate(
					'protection sociale . maladie . arrêt maladie'
				).nodeValue
			}

			return { revenuTropBasPourIJ }
		},
	},
}
