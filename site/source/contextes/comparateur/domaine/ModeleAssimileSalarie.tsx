import { pipe } from 'effect'
import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import rules, { RègleModèleAssimiléSalarié } from 'modele-as'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { documentationDeRèglePublicodes } from '@/components/documentation'
import { Strong } from '@/design-system'
import { documentationPublicodes } from '@/domaine/documentation/documentationPublicodes'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { estPositif } from '@/domaine/Montant'
import { euros } from '@/domaine/MontantPonctuel'
import {
	eurosParAn,
	eurosParJour,
	eurosParMois,
	moins,
} from '@/domaine/MontantRecurrent'
import { toOuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	pointsParAn,
	quantité,
	trimestresValidésParAn,
} from '@/domaine/Quantite'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { ModèleComparable, ValeurDocumentée } from './modeleComparable'
import { SituationComparée } from './situation'

const nomModèle = 'modele-as'

let engine: Engine<DottedName> | null = null

const initEngine = () => {
	engine = engineFactory(rules, nomModèle)
	engine.setSituation({
		'entreprise . date de création': "période . début d'année",
	})

	return engine
}

const getEngine = () => engine ?? initEngine()

const étiquette = 'SASU'

const documentation = (dottedName: RègleModèleAssimiléSalarié) =>
	documentationPublicodes(getEngine, dottedName, étiquette)

const documenté = <V,>(
	valeur: V,
	dottedName: RègleModèleAssimiléSalarié
): V & ValeurDocumentée => ({
	...valeur,
	documentation: documentation(dottedName),
})

const évalue = <V,>(
	expression:
		| RègleModèleAssimiléSalarié
		| { valeur: RègleModèleAssimiléSalarié; unité: string },
	défaut: V,
	applicable = true
): V =>
	engine && applicable
		? (O.getOrElse(
				PublicodesAdapter.decode(engine.evaluate(expression)),
				() => défaut
			) as V)
		: défaut

const valeurDocumentée = <V,>(
	dottedName: RègleModèleAssimiléSalarié,
	défaut: V,
	unité?: string
): V & ValeurDocumentée =>
	documenté(
		évalue(
			unité ? { valeur: dottedName, unité } : dottedName,
			défaut,
			rémunérationEstPositive()
		),
		dottedName
	)

const getRémunérationTotale = () =>
	évalue('assimilé salarié . rémunération . totale', eurosParMois(0))
const rémunérationEstPositive = () => {
	const rémunérationTotale = getRémunérationTotale()

	return estPositif(rémunérationTotale)
}

export const ModèleAssimiléSalarié: ModèleComparable = {
	nom: nomModèle,

	DocumentationDeRègle: documentationDeRèglePublicodes(getEngine, nomModèle),

	set: {
		situation: (situation: SituationComparée) => {
			const rémunérationTotale = pipe(
				situation.chiffreDAffaires,
				O.map(moins(O.getOrElse(situation.charges, () => eurosParAn(0))))
			)

			const nouvelleSituation = {
				'entreprise . date de création': "période . début d'année",
				...(O.isSome(rémunérationTotale)
					? {
							'assimilé salarié . rémunération . totale':
								PublicodesAdapter.encode(rémunérationTotale),
						}
					: {}),
				'assimilé salarié . exonérations . Acre': PublicodesAdapter.encode(
					O.some(toOuiNon(situation.acre))
				),
				'entreprise . TVA': PublicodesAdapter.encode(
					O.some(toOuiNon(situation.tva))
				),
				'impôt . méthode de calcul': PublicodesAdapter.encode(
					O.some(situation.méthodeImposition)
				),
				...(O.isSome(situation.tauxImposition)
					? {
							'impôt . taux personnalisé': PublicodesAdapter.encode(
								situation.tauxImposition
							),
						}
					: {}),
				'impôt . foyer fiscal . situation de famille . question':
					PublicodesAdapter.encode(O.some(situation.situationFamiliale)),
				'impôt . foyer fiscal . enfants à charge': PublicodesAdapter.encode(
					O.some(situation.enfants)
				),
				'impôt . foyer fiscal . parent isolé': PublicodesAdapter.encode(
					O.some(toOuiNon(situation.parentIsolé))
				),
				'impôt . foyer fiscal . autres revenus imposables':
					PublicodesAdapter.encode(O.some(situation.autresRevenus)),
			}

			if (!engine) {
				engine = initEngine()
			}

			engine?.setSituation(nouvelleSituation)
		},
	},

	get: {
		statut: {
			étiquette,
			nom: 'Société par actions simplifiée unipersonnelle',
			régime: (t: TFunction) =>
				t(
					'pages.simulateurs.comparaison-statuts.carte.régime.assimilé-salarié',
					'Régime général'
				),
			imposition: () => (
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.carte.imposition.IS">
					<Strong>Impôt sur les sociétés</Strong> (IS)
				</Trans>
			),
		},

		revenu: () => {
			const bénéfice = getRémunérationTotale()

			const revenuNetAprèsImpôt = !engine
				? eurosParMois(0)
				: estPositif(bénéfice)
					? évalue(
							'assimilé salarié . rémunération . nette . après impôt',
							eurosParMois(0)
						)
					: bénéfice

			return {
				bénéfice: documenté(
					bénéfice,
					'assimilé salarié . rémunération . totale'
				),
				revenuNetAprèsImpôt: documenté(
					revenuNetAprèsImpôt,
					'assimilé salarié . rémunération . nette . après impôt'
				),
			}
		},

		dépenses: () => ({
			cotisations: valeurDocumentée(
				'assimilé salarié . cotisations',
				eurosParMois(0)
			),
			impôt: valeurDocumentée(
				'assimilé salarié . rémunération . impôt',
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
			indemnitésATMP: valeurDocumentée(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités',
				eurosParJour(0)
			),
			indemnitésATMPLongTerme: valeurDocumentée(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour',
				eurosParJour(0)
			),
		}),

		parentalité: () => ({
			documentation: documentation('protection sociale . maladie'),
			indemnitésMaternitéPaternitéAdoption: valeurDocumentée(
				'protection sociale . maladie . maternité paternité adoption',
				eurosParJour(0)
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
			renteIncapacitéATMP: valeurDocumentée(
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
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
			renteDécèsATMP: valeurDocumentée(
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès',
				eurosParMois(0)
			),
		}),

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
