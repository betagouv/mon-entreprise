import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import rules from 'modele-ti'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { documentationPublicodes } from '@/components/documentation/publicodes/documentationPublicodes'
import { Strong } from '@/design-system'
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
import {
	ModèleComparable,
	MontantDocumenté,
	MontantRécurrentDocumenté,
	QuantitéDocumentée,
} from './modeleComparable'
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

const documentation = (dottedName: DottedName) =>
	documentationPublicodes(getEngine, dottedName, étiquette)

export const ModèleTravailleurIndépendant: ModèleComparable = {
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
		engine: () => engine ?? initEngine(),

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

		revenu: () => {
			let bénéfice = eurosParAn(0) as MontantRécurrentDocumenté
			let revenuNet = eurosParMois(0) as MontantRécurrentDocumenté
			let revenuNetAprèsImpôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculBénéfice = engine.evaluate(
					'indépendant . rémunération . brute'
				)
				bénéfice = O.getOrElse(PublicodesAdapter.decode(calculBénéfice), () =>
					eurosParAn(0)
				) as MontantRécurrentDocumenté

				const calculNet = engine.evaluate('indépendant . rémunération . nette')
				revenuNet = O.getOrElse(PublicodesAdapter.decode(calculNet), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				const calculNetAprèsImpôt = engine.evaluate(
					'indépendant . rémunération . nette . après impôt'
				)
				revenuNetAprèsImpôt = O.getOrElse(
					PublicodesAdapter.decode(calculNetAprèsImpôt),
					() => eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			bénéfice.documentation = documentation(
				'indépendant . rémunération . brute'
			)
			revenuNet.documentation = documentation(
				'indépendant . rémunération . nette'
			)
			revenuNetAprèsImpôt.documentation = documentation(
				'indépendant . rémunération . nette . après impôt'
			)

			return {
				bénéfice,
				revenuNet,
				revenuNetAprèsImpôt,
			}
		},

		dépenses: () => {
			let cotisations = eurosParAn(0) as MontantRécurrentDocumenté
			let impôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calcul = engine.evaluate(
					'indépendant . cotisations et contributions'
				)
				cotisations = O.getOrElse(PublicodesAdapter.decode(calcul), () =>
					eurosParAn(0)
				) as MontantRécurrentDocumenté

				const calculImpôt = engine.evaluate(
					'indépendant . rémunération . impôt'
				)
				impôt = O.getOrElse(PublicodesAdapter.decode(calculImpôt), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté
			}

			cotisations.documentation = documentation(
				'indépendant . cotisations et contributions'
			)
			impôt.documentation = documentation('indépendant . rémunération . impôt')

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

			trimestres.documentation = documentation(
				'protection sociale . retraite . base . trimestres'
			)
			revenuCotisé.documentation = documentation(
				'protection sociale . retraite . base . revenu cotisé'
			)
			pointsComplémentaire.documentation = documentation(
				'protection sociale . retraite . complémentaire . points acquis'
			)
			valeurPointComplémentaire.documentation = documentation(
				'protection sociale . retraite . complémentaire . valeur du point'
			)

			return {
				documentation: documentation('protection sociale . retraite'),
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

			indemnitésArrêtMaladie.documentation = documentation(
				'protection sociale . maladie . arrêt maladie'
			)
			délaiAttente.documentation = documentation(
				"protection sociale . maladie . arrêt maladie . délai d'attente"
			)

			return {
				documentation: documentation('protection sociale . maladie'),
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

			indemnitésMaternitéPaternitéAdoption.documentation = documentation(
				'protection sociale . maladie . maternité paternité adoption'
			)
			allocationNaissance.documentation = documentation(
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel'
			)
			allocationAdoption.documentation = documentation(
				'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption'
			)

			return {
				documentation: documentation('protection sociale . maladie'),
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

			pensionInvaliditéPartielle.documentation = documentation(
				'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
			)
			pensionInvaliditéTotale.documentation = documentation(
				'protection sociale . invalidité et décès . pension invalidité . invalidité totale'
			)

			return {
				documentation: documentation(
					'protection sociale . invalidité et décès'
				),
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

			pensionDeRéversion.documentation = documentation(
				'protection sociale . invalidité et décès . pension de reversion'
			)
			capitalDécès.documentation = documentation(
				'protection sociale . invalidité et décès . capital décès'
			)
			capitalOrphelin.documentation = documentation(
				'protection sociale . invalidité et décès . capital décès . orphelin'
			)

			return {
				documentation: documentation(
					'protection sociale . invalidité et décès'
				),
				pensionDeRéversion,
				capitalDécès,
				capitalOrphelin,
			}
		},

		// gestion: () => {
		// 	return {
		// 		coûtsDeCréation: euros(22.88),
		// 		statutConjointe: (t: TFunction) => t('pages.simulateurs.comparaison-statuts.items.gestion.conjoint.travailleur-indépendant', 'Conjoint collaborateur ou salarié / Conjointe collaboratrice ou salariée'),
		// 	}
		// },
	},
}
