import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import rules, { RègleModèleTravailleurIndépendant } from 'modele-ti'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { documentationRoutesPublicodes } from '@/components/documentation'
import { Strong } from '@/design-system'
import { documentationPublicodes } from '@/domaine/documentation/documentationPublicodes'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { euros } from '@/domaine/MontantPonctuel'
import {
	eurosParAn,
	eurosParJour,
	eurosParMois,
	MontantRécurrent,
} from '@/domaine/MontantRecurrent'
import { toOuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	pointsParAn,
	quantité,
	trimestresValidésParAn,
} from '@/domaine/Quantite'
import { omit } from '@/utils'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { IRouIS } from './imposition'
import { ModèleComparable, ValeurDocumentée } from './modeleComparable'
import { initialSituationComparée } from './situation'

const nomModèle = 'modele-ti'

let engine: Engine<DottedName> | null = null

const initEngine = () => {
	engine = engineFactory(rules, nomModèle)
	engine.setSituation({
		'entreprise . date de création': "période . début d'année",
	})

	return engine
}

const getEngine = () => engine ?? initEngine()

const étiquette = 'EI'

const documentation = (dottedName: RègleModèleTravailleurIndépendant) =>
	documentationPublicodes(getEngine, dottedName, étiquette)

const documenté = <V,>(
	valeur: V,
	dottedName: RègleModèleTravailleurIndépendant
): V & ValeurDocumentée => ({
	...valeur,
	documentation: documentation(dottedName),
})

const valeurDocumentée = <V,>(
	dottedName: RègleModèleTravailleurIndépendant,
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

export const ModèleTravailleurIndépendant: ModèleComparable = {
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
				engine?.setSituation(
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
				engine?.setSituation(
					{
						'entreprise . charges': PublicodesAdapter.encode(montant),
					},
					{ keepPreviousSituation: true }
				)
			}
		},

		IRouIS: (valeur: IRouIS) => {
			if (!engine) {
				engine = initEngine()
			}

			engine.setSituation(
				{
					'entreprise . imposition': PublicodesAdapter.encode(O.some(valeur)),
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
						'entreprise . activité': PublicodesAdapter.encode(O.some(valeur)),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'typeActivité') {
				engine.setSituation(
					{
						'entreprise . activité . principale': PublicodesAdapter.encode(
							O.some(valeur)
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'activitéLibéraleRéglementée') {
				engine.setSituation(
					{
						'entreprise . activité . libérale . réglementée':
							PublicodesAdapter.encode(O.some(toOuiNon(valeur))),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'acre') {
				engine.setSituation(
					{
						'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
							PublicodesAdapter.encode(O.some(toOuiNon(valeur))),
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
						'impôt . foyer fiscal . situation de famille . question':
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
						'impôt . foyer fiscal . autres revenus imposables':
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
			nom: 'Entreprise individuelle',
			régime: (t: TFunction) =>
				t(
					'pages.simulateurs.comparaison-statuts.items.statut.régime.travailleur-indépendant',
					'Travailleur indépendant'
				),
			imposition: () => {
				let imposition = initialSituationComparée.IRouIS

				if (engine) {
					const valeur = engine.evaluate('entreprise . imposition')
					imposition = O.getOrElse(
						PublicodesAdapter.decode(valeur),
						() => initialSituationComparée.IRouIS
					) as IRouIS
				}

				return imposition === 'IS' ? (
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.carte.imposition.IS">
						<Strong>Impôt sur les sociétés</Strong> (IS)
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
				'indépendant . rémunération . brute',
				eurosParAn(0)
			),
			revenuNet: valeurDocumentée(
				'indépendant . rémunération . nette',
				eurosParMois(0)
			),
			revenuNetAprèsImpôt: valeurDocumentée(
				'indépendant . rémunération . nette . après impôt',
				eurosParMois(0)
			),
		}),

		dépenses: () => ({
			cotisations: valeurDocumentée(
				'indépendant . cotisations et contributions',
				eurosParAn(0)
			),
			impôt: valeurDocumentée(
				'indépendant . rémunération . impôt',
				eurosParMois(0)
			),
		}),

		retraite: () => ({
			documentation: documentation('protection sociale . retraite'),
			trimestres: valeurDocumentée(
				'protection sociale . retraite . base . trimestres',
				trimestresValidésParAn(0)
			),
			revenuCotisé: valeurDocumentée(
				'protection sociale . retraite . base . revenu cotisé',
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
		// 		coûtsDeCréation: euros(22.88),
		// 		statutConjointe: (t: TFunction) => t('pages.simulateurs.comparaison-statuts.items.gestion.conjoint.travailleur-indépendant', 'Conjoint collaborateur ou salarié / Conjointe collaboratrice ou salariée'),
		// 	}
		// },
	},
}
