import * as O from 'effect/Option'
import rules from 'modele-social'
import Engine from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import {
	euros,
	eurosParAn,
	eurosParJour,
	eurosParMois,
	Montant,
	MontantRécurrent,
} from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	pointsParAn,
	quantité,
	trimestresValidésParAn,
} from '@/domaine/Quantite'
import { omit } from '@/utils'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import {
	ModèleComparable,
	MontantDocumenté,
	MontantRécurrentDocumenté,
	QuantitéDocumentée,
} from './modeleComparable'

const nomModèle = 'modele-social'

let engine: Engine<DottedName> | null = null

const initEngine = () => {
	engine = engineFactory(rules, nomModèle)
	engine.setSituation({
		salarié: 'non',
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . activité . revenus mixtes': 'non',
		'entreprise . date de création': "période . début d'année",
		'entreprise . imposition': "'IR'",
		'dirigeant . auto-entrepreneur': 'oui',
	})

	return engine
}

export const ModèleAutoEntrepreneur: ModèleComparable = {
	nom: nomModèle,

	set: {
		chiffreDAffaires: (montant: O.Option<MontantRécurrent>) => {
			if (!engine) {
				engine = initEngine()
			}

			if (O.isNone(montant)) {
				const situation = engine.getSituation()
				engine.setSituation(omit(situation, "entreprise . chiffre d'affaires"))
			} else {
				engine.setSituation(
					{
						"entreprise . chiffre d'affaires":
							PublicodesAdapter.encode(montant),
					},
					{ keepPreviousSituation: true }
				)
			}
		},

		charges: (montant: O.Option<MontantRécurrent>) => {
			if (!engine) {
				engine = initEngine()
			}

			if (O.isNone(montant)) {
				const situation = engine.getSituation()
				engine.setSituation(omit(situation, 'entreprise . charges'))
			} else {
				engine.setSituation(
					{
						'entreprise . charges': PublicodesAdapter.encode(montant),
					},
					{ keepPreviousSituation: true }
				)
			}
		},

		réponse: () => {},
	},

	get: {
		engine: () => engine ?? initEngine(),

		revenu: () => {
			let bénéfice = eurosParMois(0) as MontantRécurrentDocumenté
			let revenuNet = eurosParMois(0) as MontantRécurrentDocumenté
			let revenuNetAprèsImpôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculBénéfice = engine.evaluate(
					'dirigeant . rémunération . totale'
				)
				bénéfice = O.getOrElse(PublicodesAdapter.decode(calculBénéfice), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculNet = engine.evaluate({
					valeur: 'dirigeant . rémunération . net',
					unité: '€/mois',
				})
				revenuNet = O.getOrElse(PublicodesAdapter.decode(calculNet), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculNetAprèsImpôt = engine.evaluate({
					valeur: 'dirigeant . rémunération . net . après impôt',
					unité: '€/mois',
				})
				revenuNetAprèsImpôt = O.getOrElse(
					PublicodesAdapter.decode(calculNetAprèsImpôt),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			bénéfice.documentationRule = 'dirigeant . rémunération . totale'
			revenuNet.documentationRule = 'dirigeant . rémunération . net'
			revenuNetAprèsImpôt.documentationRule =
				'dirigeant . rémunération . net . après impôt'

			return {
				bénéfice,
				revenuNet,
				revenuNetAprèsImpôt,
			}
		},

		dépenses: () => {
			let cotisations = eurosParMois(0) as MontantRécurrentDocumenté
			let impôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calcul = engine.evaluate('dirigeant . rémunération . cotisations')
				cotisations = O.getOrElse(PublicodesAdapter.decode(calcul), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculImpôt = engine.evaluate({
					valeur: 'dirigeant . rémunération . impôt',
					unité: '€/mois',
				})
				impôt = O.getOrElse(PublicodesAdapter.decode(calculImpôt), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			cotisations.documentationRule = 'dirigeant . rémunération . cotisations'
			impôt.documentationRule = 'dirigeant . rémunération . impôt'

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
					'protection sociale . retraite . trimestres'
				)
				trimestres = O.getOrElse(
					PublicodesAdapter.decode(calculTrimestres),
					() => trimestresValidésParAn(0)
				) as QuantitéDocumentée

				const calculRevenuCotisé = engine.evaluate(
					'protection sociale . retraite . base . cotisée'
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
				'protection sociale . retraite . trimestres'
			revenuCotisé.documentationRule =
				'protection sociale . retraite . base . cotisée'
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
			let délaiAttente = quantité(0, 'mois') as QuantitéDocumentée

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
			}

			indemnitésArrêtMaladie.documentationRule =
				'protection sociale . maladie . arrêt maladie'
			délaiAttente.documentationRule =
				"protection sociale . maladie . arrêt maladie . délai d'attente"

			return {
				documentationRule: 'protection sociale . maladie',
				indemnitésArrêtMaladie,
				délaiAttente,
			}
		},

		parentalité: () => {
			let indemnitésMaternitéPaternitéAdoption = eurosParJour(
				0
			) as MontantRécurrentDocumenté
			let allocationNaissance = euros(0) as MontantDocumenté
			let allocationAdoption = euros(0) as MontantDocumenté

			if (engine) {
				const calculIndemnitésMaternitéPaternitéAdoption = engine.evaluate(
					'protection sociale . maladie . maternité paternité adoption'
				)
				indemnitésMaternitéPaternitéAdoption = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésMaternitéPaternitéAdoption),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté

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

			indemnitésMaternitéPaternitéAdoption.documentationRule =
				'protection sociale . maladie . maternité paternité adoption'
			allocationNaissance.documentationRule =
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel'
			allocationAdoption.documentationRule =
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption'

			return {
				documentationRule: 'protection sociale . maladie',
				indemnitésMaternitéPaternitéAdoption,
				allocationNaissance,
				allocationAdoption,
			}
		},

		invalidité: () => {
			let pensionInvaliditéPartielle = eurosParMois(
				0
			) as MontantRécurrentDocumenté
			let pensionInvaliditéTotale = eurosParMois(0) as MontantRécurrentDocumenté

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
			}

			pensionInvaliditéPartielle.documentationRule =
				'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
			pensionInvaliditéTotale.documentationRule =
				'protection sociale . invalidité et décès . pension invalidité . invalidité totale'

			return {
				documentationRule: 'protection sociale . invalidité et décès',
				pensionInvaliditéPartielle,
				pensionInvaliditéTotale,
			}
		},

		décès: () => {
			let pensionDeRéversion = eurosParMois(0) as MontantRécurrentDocumenté
			let capitalDécès = euros(0) as MontantDocumenté
			let capitalOrphelin = euros(0) as MontantDocumenté

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

				const calculCapitalOrphelin = engine.evaluate(
					'protection sociale . invalidité et décès . capital décès . orphelin'
				)
				capitalOrphelin = O.getOrElse(
					PublicodesAdapter.decode(calculCapitalOrphelin),
					() => euros(0)
				) as MontantDocumenté
			}

			pensionDeRéversion.documentationRule =
				'protection sociale . invalidité et décès . pension de reversion'
			capitalDécès.documentationRule =
				'protection sociale . invalidité et décès . capital décès'
			capitalOrphelin.documentationRule =
				'protection sociale . invalidité et décès . capital décès . orphelin'

			return {
				documentationRule: 'protection sociale . invalidité et décès',
				pensionDeRéversion,
				capitalDécès,
				capitalOrphelin,
			}
		},

		// gestion: () => {
		// 	return {
		// 		coûtsDeCréation: euros(0),
		// 		statutConjointe: (t: TFunction) => t('pages.simulateurs.comparaison-statuts.items.gestion.conjoint.auto-entrepreneur', 'Conjoint collaborateur / Conjointe collaboratrice'),
		// 	}
		// },

		warning: () => {
			let seuilMicro

			if (engine) {
				const seuilMicroEstDépassé = !!engine.evaluate(
					"entreprise . chiffre d'affaires . seuil micro . dépassé"
				).nodeValue

				if (seuilMicroEstDépassé) {
					const estActivitéLibérale =
						String(
							engine.evaluate('entreprise . activité . nature').nodeValue
						) === 'libérale'
					const estActivitéDeTypeService =
						String(
							engine.evaluate('entreprise . activités . service ou vente')
								.nodeValue
						) === 'service'
					const calculMontantSeuil = engine.evaluate(
						estActivitéLibérale || estActivitéDeTypeService
							? "entreprise . chiffre d'affaires . seuil micro . libérale"
							: "entreprise . chiffre d'affaires . seuil micro . total"
					)

					seuilMicro = O.getOrThrow(
						PublicodesAdapter.decode(calculMontantSeuil)
					) as Montant<'€/an'>
				}
			}

			return { seuilMicro }
		},
	},
}
