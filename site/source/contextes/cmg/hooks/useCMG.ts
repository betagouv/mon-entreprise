import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as E from 'effect/Either'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'

import { Montant } from '@/domaine/Montant'

import {
	estDéclarationAMAVide,
	estDéclarationGEDVide,
} from '../domaine/déclaration-de-garde'
import { éligibilité, RaisonInéligibilité } from '../domaine/éligibilité'
import { Enfant } from '../domaine/enfant'
import { Résultat } from '../domaine/résultat'
import {
	auMoinsUneDéclaration,
	SalariéeAMA,
	SalariéeGED,
} from '../domaine/salariée'
import { initialSituationCMG, SituationCMG } from '../domaine/situation'
import { MoisIdentiques, useSituationContext } from './CMGContext'

export const useCMG = () => {
	const {
		situation,
		updateSituation,
		moisIdentiques,
		updateMoisIdentiques,
		resetMoisIdentiques,
		résultat,
		updateRésultat,
	} = useSituationContext()
	const { t } = useTranslation()

	const submit = () => {
		updateRésultat(() => calculeÉLigibilité(situation))
	}

	const set = {
		reset: () => {
			updateSituation(() => initialSituationCMG)
			resetMoisIdentiques()
		},

		parentIsolé: (parentIsolé: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, parentIsolé }))
		},

		ressources: (ressources: O.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, ressources }))
		},

		aPerçuCMG: (aPerçuCMG: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, aPerçuCMG }))
		},

		plusDe2MoisDeDéclaration: (plusDe2MoisDeDéclaration: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, plusDe2MoisDeDéclaration }))
		},

		enfants: (enfants: Array<Enfant>) => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants,
				},
			}))
		},

		nouvelEnfant: () => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants: [
						...prev.enfantsÀCharge.enfants,
						{
							prénom: O.none(),
							dateDeNaissance: O.none(),
						},
					],
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
			const newSalariéesGED = pipe(
				salariéesGED,
				A.filter(auMoinsUneDéclaration),
				A.map((déclarations) =>
					R.map(déclarations, (déclaration) =>
						estDéclarationGEDVide(déclaration) ? O.none() : déclaration
					)
				)
			)

			updateSituation((prev) => ({
				...prev,
				salariées: {
					AMA: prev.salariées.AMA,
					GED: newSalariéesGED,
				},
			}))
		},

		nouvelleGED: () => {
			updateSituation((prev) => ({
				...prev,
				salariées: {
					AMA: prev.salariées.AMA,
					GED: [
						...prev.salariées.GED,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
			updateMoisIdentiques((prev: MoisIdentiques) => ({
				AMA: prev.AMA,
				GED: [...prev.GED, false],
			}))
		},

		salariéesAMA: (salariéesAMA: Array<SalariéeAMA<string>>) => {
			const newSalariéesAMA = pipe(
				salariéesAMA,
				A.filter(auMoinsUneDéclaration),
				A.map((déclarations) =>
					R.map(déclarations, (déclaration) =>
						estDéclarationAMAVide(déclaration) ? O.none() : déclaration
					)
				)
			)

			updateSituation((prev) => ({
				...prev,
				salariées: {
					GED: prev.salariées.GED,
					AMA: newSalariéesAMA,
				},
			}))
		},

		nouvelleAMA: () => {
			updateSituation((prev) => ({
				...prev,
				salariées: {
					GED: prev.salariées.GED,
					AMA: [
						...prev.salariées.AMA,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
			updateMoisIdentiques((prev: MoisIdentiques) => ({
				GED: prev.GED,
				AMA: [...prev.AMA, false],
			}))
		},

		moisIdentiques: (moisIdentiques: MoisIdentiques) => {
			updateMoisIdentiques(() => moisIdentiques)
		},
	}

	const getRaisonsInéligibilitéHumaines = (
		raisons: Array<RaisonInéligibilité>
	): Array<string> =>
		raisons.map((raison) => raisonsInéligibilitéToTexte[raison])

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
		'réforme-avantageuse': t(
			'pages.assistants.cmg.raisons-inéligibilité.réforme-avantageuse',
			'La réforme du CMG vous est favorable (à situation identique, vous allez percevoir au moins autant).'
		),
	} as Record<RaisonInéligibilité, string>

	return {
		situation,
		enfants: situation.enfantsÀCharge.enfants,
		perçoitAeeH: situation.enfantsÀCharge.perçoitAeeH,
		AeeH: situation.enfantsÀCharge.AeeH,
		salariéesGED: situation.salariées.GED,
		salariéesAMA: situation.salariées.AMA,
		moisIdentiques,
		...résultat,
		set,
		submit,
		getRaisonsInéligibilitéHumaines,
	}
}

const calculeÉLigibilité = (situation: SituationCMG): Résultat => {
	const résultatÉligibilité = éligibilité(situation)

	const estÉligible = pipe(
		résultatÉligibilité,
		E.map((e) => E.getOrUndefined(e)?.estÉligible),
		E.mapLeft(() => false),
		E.merge,
		O.fromNullable
	)

	const raisonsInéligibilité = pipe(
		résultatÉligibilité,
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
		E.getOrUndefined,
		O.fromNullable
	)

	return {
		estÉligible,
		raisonsInéligibilité,
		montantCT,
	}
}
