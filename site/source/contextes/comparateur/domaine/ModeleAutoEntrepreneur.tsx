import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { documentationRoutesPublicodes } from '@/components/documentation'
import { Strong } from '@/design-system'
import { documentationPublicodes } from '@/domaine/documentation/documentationPublicodes'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { Montant } from '@/domaine/Montant'
import { euros } from '@/domaine/MontantPonctuel'
import {
	eurosParAn,
	eurosParJour,
	eurosParMois,
	MontantRécurrent,
} from '@/domaine/MontantRecurrent'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	pointsParAn,
	quantité,
	trimestresValidésParAn,
} from '@/domaine/Quantite'
import { omit } from '@/utils'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { ModèleComparable, ValeurDocumentée } from './modeleComparable'
import { initialSituationComparée } from './situation'

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

const getEngine = () => engine ?? initEngine()

const étiquette = 'AE'

const documentation = (dottedName: RègleModèleSocial) =>
	documentationPublicodes(getEngine, dottedName, étiquette)

const documenté = <V,>(
	valeur: V,
	dottedName: RègleModèleSocial
): V & ValeurDocumentée => ({
	...valeur,
	documentation: documentation(dottedName),
})

const valeurDocumentée = <V,>(
	dottedName: RègleModèleSocial,
	défaut: V,
	unité?: string
): V & ValeurDocumentée =>
	documenté(
		engine
			? (O.getOrElse(
					PublicodesAdapter.decode(
						engine.evaluate(unité ? { valeur: dottedName, unité } : dottedName)
					),
					() => défaut
				) as V)
			: défaut,
		dottedName
	)

export const ModèleAutoEntrepreneur: ModèleComparable = {
	nom: nomModèle,

	DocumentationRoutes: documentationRoutesPublicodes(getEngine, nomModèle),

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

		versementLibératoire: (valeur: boolean) => {
			if (!engine) {
				engine = engineFactory(rules, nomModèle)
			}

			engine.setSituation(
				{
					'dirigeant . auto-entrepreneur . impôt . versement libératoire':
						PublicodesAdapter.encode(O.some(toOuiNon(valeur))),
				},
				{ keepPreviousSituation: true }
			)
		},

		réponse: (question, valeur) => {
			if (!engine) {
				engine = initEngine()
			}

			if (question === 'natureActivité') {
				engine.setSituation(
					{
						'entreprise . activité . nature': PublicodesAdapter.encode(
							O.some(valeur)
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'typeActivité') {
				engine.setSituation(
					{
						'entreprise . activités . service ou vente':
							PublicodesAdapter.encode(O.some(valeur)),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'activitéLibéraleRéglementée') {
				engine.setSituation(
					{
						'entreprise . activité . nature . libérale . réglementée':
							PublicodesAdapter.encode(O.some(toOuiNon(valeur))),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'acre') {
				engine.setSituation(
					{
						'dirigeant . exonérations . ACRE': PublicodesAdapter.encode(
							O.some(toOuiNon(valeur))
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'méthodeImposition') {
				engine.setSituation(
					{
						'impôt . méthode de calcul': PublicodesAdapter.encode(
							O.some(valeur)
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'tauxImposition') {
				if (O.isNone(valeur)) {
					const situation = engine.getSituation()
					engine.setSituation(omit(situation, 'impôt . taux personnalisé'))
				} else {
					engine.setSituation(
						{
							'impôt . taux personnalisé': PublicodesAdapter.encode(valeur),
						},
						{ keepPreviousSituation: true }
					)
				}
			}

			if (question === 'situationFamiliale') {
				engine.setSituation(
					{
						'impôt . foyer fiscal . situation de famille':
							PublicodesAdapter.encode(O.some(valeur)),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'enfants') {
				engine.setSituation(
					{
						'impôt . foyer fiscal . enfants à charge': PublicodesAdapter.encode(
							O.some(valeur)
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'parentIsolé') {
				engine.setSituation(
					{
						'impôt . foyer fiscal . parent isolé': PublicodesAdapter.encode(
							O.some(toOuiNon(valeur))
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'autresRevenus') {
				engine.setSituation(
					{
						'impôt . foyer fiscal . revenu imposable . autres revenus imposables':
							PublicodesAdapter.encode(O.some(valeur)),
					},
					{ keepPreviousSituation: true }
				)
			}
		},
	},

	get: {
		statut: {
			étiquette,
			nom: 'Auto-entrepreneur',
			régime: (t: TFunction) =>
				t(
					'pages.simulateurs.comparaison-statuts.items.statut.régime.auto-entrepreneur',
					'Régime micro-social'
				),
			imposition: () => {
				let versementLibératoire = initialSituationComparée.versementLibératoire

				if (engine) {
					const valeur = engine.evaluate(
						'dirigeant . auto-entrepreneur . impôt . versement libératoire'
					)
					versementLibératoire = fromOuiNon(
						O.getOrElse(PublicodesAdapter.decode(valeur), () =>
							toOuiNon(initialSituationComparée.versementLibératoire)
						) as OuiNon
					)
				}

				return versementLibératoire ? (
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.carte.imposition.versement-libératoire">
						<Strong>Versement libératoire</Strong> de l’impôt sur le revenu
					</Trans>
				) : (
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.carte.imposition.IR">
						<Strong>Impôt sur le revenu</Strong> (IR)
					</Trans>
				)
			},
		},

		revenu: () => ({
			bénéfice: valeurDocumentée(
				'dirigeant . rémunération . totale',
				eurosParMois(0)
			),
			revenuNet: valeurDocumentée(
				'dirigeant . rémunération . net',
				eurosParMois(0),
				'€/mois'
			),
			revenuNetAprèsImpôt: valeurDocumentée(
				'dirigeant . rémunération . net . après impôt',
				eurosParMois(0),
				'€/mois'
			),
		}),

		dépenses: () => ({
			cotisations: valeurDocumentée(
				'dirigeant . rémunération . cotisations',
				eurosParMois(0)
			),
			impôt: valeurDocumentée(
				'dirigeant . rémunération . impôt',
				eurosParMois(0),
				'€/mois'
			),
		}),

		retraite: () => ({
			documentation: documentation('protection sociale . retraite'),
			trimestres: valeurDocumentée(
				'protection sociale . retraite . trimestres',
				trimestresValidésParAn(0)
			),
			revenuCotisé: valeurDocumentée(
				'protection sociale . retraite . base . cotisée',
				eurosParAn(0)
			),
			pointsComplémentaire: valeurDocumentée(
				'protection sociale . retraite . complémentaire . points acquis',
				pointsParAn(0)
			),
			valeurPointComplémentaire: valeurDocumentée(
				'protection sociale . retraite . complémentaire . valeur du point',
				eurosParAn(0),
				'€/an'
			),
		}),

		maladie: () => ({
			documentation: documentation('protection sociale . maladie'),
			indemnitésArrêtMaladie: valeurDocumentée(
				'protection sociale . maladie . arrêt maladie',
				eurosParJour(0)
			),
			délaiAttente: valeurDocumentée(
				"protection sociale . maladie . arrêt maladie . délai d'attente",
				quantité(0, 'mois')
			),
		}),

		parentalité: () => ({
			documentation: documentation('protection sociale . maladie'),
			indemnitésMaternitéPaternitéAdoption: valeurDocumentée(
				'protection sociale . maladie . maternité paternité adoption',
				eurosParJour(0)
			),
			allocationNaissance: valeurDocumentée(
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel',
				euros(0)
			),
			allocationAdoption: valeurDocumentée(
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption',
				euros(0)
			),
		}),

		invalidité: () => ({
			documentation: documentation('protection sociale . invalidité et décès'),
			pensionInvaliditéPartielle: valeurDocumentée(
				'protection sociale . invalidité et décès . pension invalidité . invalidité partielle',
				eurosParMois(0)
			),
			pensionInvaliditéTotale: valeurDocumentée(
				'protection sociale . invalidité et décès . pension invalidité . invalidité totale',
				eurosParMois(0)
			),
		}),

		décès: () => ({
			documentation: documentation('protection sociale . invalidité et décès'),
			pensionDeRéversion: valeurDocumentée(
				'protection sociale . invalidité et décès . pension de reversion',
				eurosParMois(0)
			),
			capitalDécès: valeurDocumentée(
				'protection sociale . invalidité et décès . capital décès',
				euros(0)
			),
			capitalOrphelin: valeurDocumentée(
				'protection sociale . invalidité et décès . capital décès . orphelin',
				euros(0)
			),
		}),

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
