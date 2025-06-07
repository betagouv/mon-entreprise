import { pipe } from 'effect'
import * as E from 'effect/Either'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'

import { Montant } from '@/domaine/Montant'

import { éligibilité, RaisonInéligibilité } from '../domaine/éligibilité'
import { Enfant } from '../domaine/enfant'
import { SalariéeAMA, SalariéeGED } from '../domaine/salariée'
import { initialSituationCMG, SituationCMG } from '../domaine/situation'
import { useSituationContext } from './CMGContext'

export const useCMG = () => {
	const { situation, updateSituation } = useSituationContext()
	const { t } = useTranslation()

	const raisonsInéligibilitéToTexte = {
		'CMG-perçu': t(
			'pages.assistants.cmg.raisons-inéligibilité.CMG-perçu',
			'Vous n’avez pas été éligible au CMG entre mars et mai 2025.'
		),
		déclarations: t(
			'pages.assistants.cmg.raisons-inéligibilité.déclarations',
			'Vous n’avez pas saisi suffisamment de déclarations entre mars et mai 2025.'
		),
		'enfants-à-charge': t(
			'pages.assistants.cmg.raisons-inéligibilité.enfants-à-charge',
			'Aucun de vos enfants à charge n’ouvre droit au complément transitoire.'
		),
		ressources: t(
			'pages.assistants.cmg.raisons-inéligibilité.ressources',
			'Vos ressources dépassent le plafond.'
		),
		'heures-de-garde': t(
			'pages.assistants.cmg.raisons-inéligibilité.heures-de-garde',
			'Vous n’avez pas déclaré suffisamment d’heures de garde entre mars et mai 2025.'
		),
		'enfants-gardés': t(
			'pages.assistants.cmg.raisons-inéligibilité.enfants-gardés',
			'Aucun de vos enfants gardés n’ouvre droit au complément transitoire.'
		),
	} as Record<RaisonInéligibilité, string>

	const résultatÉligibilité = éligibilité(situation)

	const estÉligible = pipe(
		résultatÉligibilité,
		E.map((e) => E.getOrUndefined(e)?.estÉligible),
		E.mapLeft(() => false),
		E.merge
	)

	const raisonsInéligibilité = pipe(
		résultatÉligibilité,
		E.mapLeft((raisons) =>
			raisons.map((raison) => raisonsInéligibilitéToTexte[raison])
		),
		E.getLeft,
		O.getOrElse(() => [])
	)

	const montantCT = pipe(
		résultatÉligibilité,
		E.map((e) =>
			pipe(
				e,
				E.map((éligible) => éligible.montantCT),
				E.getOrUndefined
			)
		),
		E.getOrUndefined
	)

	const set = {
		situation: (situation: SituationCMG) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationCMG)
		},

		parentIsolé: (parentIsolé: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, parentIsolé }))
		},

		ressources: (ressources: O.Option<Montant<'EuroParAn'>>) => {
			updateSituation((prev) => ({ ...prev, ressources }))
		},

		aPerçuCMG: (aPerçuCMG: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, aPerçuCMG }))
		},

		plusDe2MoisDeDéclaration: (plusDe2MoisDeDéclaration: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, plusDe2MoisDeDéclaration }))
		},

		enfants: (enfants: Array<Enfant>) => {
			const nouveauxEnfants = pipe(
				enfants,
				R.fromIterableWith((e) => [O.getOrElse(e.prénom, () => ''), e])
			)
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants: nouveauxEnfants,
				},
			}))
		},

		nouvelEnfant: () => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants: {
						...prev.enfantsÀCharge.enfants,
						'': {
							prénom: O.none(),
							dateDeNaissance: O.none(),
						},
					},
				},
			}))
		},

		perçoitAeeH: (perçoitAeeH: O.Option<boolean>) => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					perçoitAeeH,
				},
			}))
		},

		AeeH: (AeeH: O.Option<number>) => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					AeeH,
				},
			}))
		},

		salariéesGED: (salariéesGED: Array<SalariéeGED>) => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					AMA: prev.modesDeGarde.AMA,
					GED: salariéesGED,
				},
			}))
		},

		nouvelleGED: () => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					AMA: prev.modesDeGarde.AMA,
					GED: [
						...prev.modesDeGarde.GED,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
		},

		salariéesAMA: (salariéesAMA: Array<SalariéeAMA<string>>) => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					GED: prev.modesDeGarde.GED,
					AMA: salariéesAMA,
				},
			}))
		},

		nouvelleAMA: () => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					GED: prev.modesDeGarde.GED,
					AMA: [
						...prev.modesDeGarde.AMA,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
		},
	}

	return {
		situation,
		enfants: R.values(situation.enfantsÀCharge.enfants),
		perçoitAeeH: situation.enfantsÀCharge.perçoitAeeH,
		AeeH: situation.enfantsÀCharge.AeeH,
		salariéesGED: situation.modesDeGarde.GED,
		salariéesAMA: situation.modesDeGarde.AMA,
		estÉligible,
		raisonsInéligibilité,
		montantCT,
		set,
	}
}
