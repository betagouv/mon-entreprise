import { pipe } from 'effect'
import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import rules, { RègleModèleAssimiléSalarié } from 'modele-as'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { documentationPublicodes } from '@/components/documentation/publicodes/documentationPublicodes'
import { documentationRoutesPublicodes } from '@/components/documentation/publicodes/documentationRoutesPublicodes'
import { Strong } from '@/design-system'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { estPositif } from '@/domaine/Montant'
import { euros } from '@/domaine/MontantPonctuel'
import {
	eurosParAn,
	eurosParJour,
	eurosParMois,
	moins,
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

const getRémunérationTotale = () => {
	return pipe(
		chiffreDAffaires,
		O.map(moins(O.getOrElse(charges, () => eurosParAn(0))))
	)
}

const setRémunérationTotale = () => {
	const rémunérationTotale = getRémunérationTotale()

	if (O.isNone(rémunérationTotale)) {
		return
	}

	if (!engine) {
		engine = initEngine()
	}

	engine.setSituation(
		{
			'assimilé salarié . rémunération . totale':
				PublicodesAdapter.encode(rémunérationTotale),
		},
		{ keepPreviousSituation: true }
	)
}

const rémunérationEstPositive = () => {
	const rémunérationTotale = getRémunérationTotale()

	return O.isSome(rémunérationTotale) && estPositif(rémunérationTotale.value)
}

export const ModèleAssimiléSalarié: ModèleComparable = {
	nom: nomModèle,

	DocumentationRoutes: documentationRoutesPublicodes(getEngine, nomModèle),

	set: {
		chiffreDAffaires: (montant: O.Option<MontantRécurrent>) => {
			chiffreDAffaires = montant
			setRémunérationTotale()
		},

		charges: (montant: O.Option<MontantRécurrent>) => {
			charges = montant
			setRémunérationTotale()
		},

		réponse: (question, valeur) => {
			if (!engine) {
				engine = initEngine()
			}

			if (question === 'acre') {
				engine.setSituation(
					{
						'assimilé salarié . exonérations . Acre': PublicodesAdapter.encode(
							O.some(toOuiNon(valeur))
						),
					},
					{ keepPreviousSituation: true }
				)
			}

			if (question === 'tva') {
				engine.setSituation(
					{
						'entreprise . TVA': PublicodesAdapter.encode(
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
			let bénéfice = eurosParMois(0) as MontantRécurrentDocumenté
			let revenuNetAprèsImpôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine) {
				const calculBénéfice = engine.evaluate(
					'assimilé salarié . rémunération . totale'
				)
				bénéfice = O.getOrElse(PublicodesAdapter.decode(calculBénéfice), () =>
					eurosParMois(0)
				) as MontantRécurrentDocumenté

				if (!estPositif(bénéfice)) {
					revenuNetAprèsImpôt = O.getOrElse(getRémunérationTotale(), () =>
						eurosParMois(0)
					) as MontantRécurrentDocumenté
				} else {
					const calculNetAprèsImpôt = engine.evaluate(
						'assimilé salarié . rémunération . nette . après impôt'
					)
					revenuNetAprèsImpôt = O.getOrElse(
						PublicodesAdapter.decode(calculNetAprèsImpôt),
						() => eurosParMois(0)
					) as MontantRécurrentDocumenté
				}
			}

			bénéfice.documentation = documentation(
				'assimilé salarié . rémunération . totale'
			)
			revenuNetAprèsImpôt.documentation = documentation(
				'assimilé salarié . rémunération . nette . après impôt'
			)

			return {
				bénéfice,
				revenuNetAprèsImpôt,
			}
		},

		dépenses: () => {
			let cotisations = eurosParMois(0) as MontantRécurrentDocumenté
			let impôt = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine && rémunérationEstPositive()) {
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

			cotisations.documentation = documentation(
				'assimilé salarié . cotisations'
			)
			impôt.documentation = documentation(
				'assimilé salarié . rémunération . impôt'
			)

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

			if (engine && rémunérationEstPositive()) {
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
			let indemnitésATMP = eurosParJour(0) as MontantRécurrentDocumenté
			let indemnitésATMPLongTerme = eurosParJour(0) as MontantRécurrentDocumenté
			let délaiAttente = quantité(0, 'mois') as QuantitéDocumentée

			indemnitésArrêtMaladie.documentation = documentation(
				'protection sociale . maladie . arrêt maladie'
			)
			indemnitésATMP.documentation = documentation(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
			)
			indemnitésATMPLongTerme.documentation = documentation(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour'
			)
			délaiAttente.documentation = documentation(
				"protection sociale . maladie . arrêt maladie . délai d'attente"
			)

			if (engine && rémunérationEstPositive()) {
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

			indemnitésArrêtMaladie.documentation = documentation(
				'protection sociale . maladie . arrêt maladie'
			)
			délaiAttente.documentation = documentation(
				"protection sociale . maladie . arrêt maladie . délai d'attente"
			)
			indemnitésATMP.documentation = documentation(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités'
			)
			indemnitésATMPLongTerme.documentation = documentation(
				'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour'
			)

			return {
				documentation: documentation('protection sociale . maladie'),
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

			if (engine && rémunérationEstPositive()) {
				const calculIndemnitésMaternitéPaternitéAdoption = engine.evaluate(
					'protection sociale . maladie . maternité paternité adoption'
				)
				indemnitésMaternitéPaternitéAdoption = O.getOrElse(
					PublicodesAdapter.decode(calculIndemnitésMaternitéPaternitéAdoption),
					() => eurosParJour(0)
				) as MontantRécurrentDocumenté
			}

			indemnitésMaternitéPaternitéAdoption.documentation = documentation(
				'protection sociale . maladie . maternité paternité adoption'
			)

			return {
				documentation: documentation('protection sociale . maladie'),
				indemnitésMaternitéPaternitéAdoption,
			}
		},

		invalidité: () => {
			let pensionInvaliditéPartielle = eurosParMois(
				0
			) as MontantRécurrentDocumenté
			let pensionInvaliditéTotale = eurosParMois(0) as MontantRécurrentDocumenté
			let renteIncapacitéATMP = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine && rémunérationEstPositive()) {
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

			pensionInvaliditéPartielle.documentation = documentation(
				'protection sociale . invalidité et décès . pension invalidité . invalidité partielle'
			)
			pensionInvaliditéTotale.documentation = documentation(
				'protection sociale . invalidité et décès . pension invalidité . invalidité totale'
			)
			renteIncapacitéATMP.documentation = documentation(
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité'
			)

			return {
				documentation: documentation(
					'protection sociale . invalidité et décès'
				),
				pensionInvaliditéPartielle,
				pensionInvaliditéTotale,
				renteIncapacitéATMP,
			}
		},

		décès: () => {
			let pensionDeRéversion = eurosParMois(0) as MontantRécurrentDocumenté
			let capitalDécès = euros(0) as MontantDocumenté
			let renteDécèsATMP = eurosParMois(0) as MontantRécurrentDocumenté

			if (engine && rémunérationEstPositive()) {
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

			pensionDeRéversion.documentation = documentation(
				'protection sociale . invalidité et décès . pension de reversion'
			)
			capitalDécès.documentation = documentation(
				'protection sociale . invalidité et décès . capital décès'
			)
			renteDécèsATMP.documentation = documentation(
				'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès'
			)

			return {
				documentation: documentation(
					'protection sociale . invalidité et décès'
				),
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
