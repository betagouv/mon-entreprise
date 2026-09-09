import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as E from 'effect/Either'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

import { calculeComplémentTransitoire } from './calcul'
import {
	ANNÉE_DE_NAISSANCE_EXCLUE,
	MAJORATION_PAR_ENFANT,
	MAJORATION_PARENT_ISOLÉ,
	NOMBRE_MIN_MOIS_EMPLOYEUREUSE,
	PLAFOND_DE_RESSOURCES_COUPLE_1_ENFANT,
	PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE,
} from './constantes'
import {
	DéclarationDeGarde,
	toutesLesDéclarations,
} from './déclaration-de-garde'
import {
	Enfant,
	enfantAMoinsDe6Ans,
	enfantNéEn,
	estEnfantsÀChargeValide,
	getEnfantFromPrénom,
} from './enfant'
import { Mois } from './Mois'
import { Salariée } from './salariée'
import {
	estInformationsValides,
	estSituationCMGValide,
	SituationCMG,
	SituationCMGValide,
} from './situation'
import {
	détermineLaTypologieDeLaGarde,
	TypologieDeGarde,
} from './typologie-de-garde'

interface Historique<PrénomsEnfants extends string = string> {
	mars: Array<DéclarationDeGarde<PrénomsEnfants>>
	avril: Array<DéclarationDeGarde<PrénomsEnfants>>
	mai: Array<DéclarationDeGarde<PrénomsEnfants>>
}

interface Éligible {
	estÉligible: true
	montantCT: M.Montant<'€'>
}

const SITUATION_INCOMPLÈTE = 'Situation Incomplète' as const
type SituationIncomplète = typeof SITUATION_INCOMPLÈTE

export type RaisonInéligibilité =
	| 'CMG-perçu'
	| 'déclarations'
	| 'enfants-à-charge'
	| 'ressources'
	| 'heures-de-garde'
	| 'enfants-gardés'
	| 'réforme-avantageuse'

type FonctionÉligibilité = E.Either<
	E.Either<Éligible, SituationIncomplète>,
	RaisonInéligibilité[]
>

export const éligibilité = (situation: SituationCMG): FonctionÉligibilité => {
	const éligibilité = pipe(
		[
			ditAvoirPerçuCMG,
			ditAvoirPlusDe2MoisDeDéclaration,
			aAuMoinsUnEnfantÀChargeOuvrantDroitAuCMG,
			aDesRessourcesInférieuresAuPlafond,
			aPerçuCMG,
			aUnNombreDeMoisEmployeureuseSuffisant,
			aDéclaréAssezDHeuresDeGarde,
			aAuMoinsUnEnfantGardéOuvrantDroitAuCMG,
		],
		A.map((f) => f(situation)),
		(éligibilités) => {
			// On n'utilise pas directement Either.all car on veut concaténer les raisons d'inéligibilité
			if (A.some(éligibilités, E.isLeft)) {
				return pipe(
					éligibilités,
					A.filter(E.isLeft),
					A.map((raisonsInéligibilité) => {
						return O.getOrElse(E.getLeft(raisonsInéligibilité), () => [])
					}),
					A.flatten,
					E.left
				)
			} else {
				return E.all(éligibilités)
			}
		},
		E.map((éligibilités) =>
			A.some(éligibilités, E.isLeft)
				? E.left(SITUATION_INCOMPLÈTE)
				: E.right({
						estÉligible: true,
						montantCT: M.euros(0),
				  } as Éligible)
		),
		E.mapLeft(A.dedupe)
	)

	if (E.isRight(éligibilité) && E.isRight(éligibilité.right)) {
		return estDésavantagéParLaRéforme(situation)
	}

	return éligibilité
}

const situationIncomplète = E.right(
	E.left(SITUATION_INCOMPLÈTE)
) as FonctionÉligibilité
const éligible = E.right(
	E.right({
		estÉligible: true,
		montantCT: M.euros(0),
	})
) as FonctionÉligibilité
const inéligible = (raison: RaisonInéligibilité) => E.left([raison])

const ditAvoirPerçuCMG = (situation: SituationCMG): FonctionÉligibilité => {
	if (O.isNone(situation.aPerçuCMG)) {
		return situationIncomplète
	}

	if (situation.aPerçuCMG.value) {
		return éligible
	} else {
		return inéligible('CMG-perçu')
	}
}

const ditAvoirPlusDe2MoisDeDéclaration = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (O.isNone(situation.plusDe2MoisDeDéclaration)) {
		return situationIncomplète
	}

	if (situation.plusDe2MoisDeDéclaration.value) {
		return éligible
	} else {
		return inéligible('déclarations')
	}
}

const aAuMoinsUnEnfantÀChargeOuvrantDroitAuCMG = (
	situation: SituationCMG
): FonctionÉligibilité => {
	const enfants = situation.enfantsÀCharge.enfants
	if (!estEnfantsÀChargeValide(situation.enfantsÀCharge)) {
		return situationIncomplète
	}

	if (auMoinsUnEnfantÀChargeOuvrantDroitAuCMG(enfants)) {
		return éligible
	} else {
		return inéligible('enfants-à-charge')
	}
}

const aDesRessourcesInférieuresAuPlafond = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (
		!estInformationsValides(situation) ||
		!estEnfantsÀChargeValide(situation.enfantsÀCharge)
	) {
		return situationIncomplète
	}

	if (ressourcesInférieuresAuPlafond(situation as SituationCMGValide)) {
		return éligible
	} else {
		return inéligible('ressources')
	}
}

const aPerçuCMG = (situation: SituationCMG): FonctionÉligibilité => {
	if (!estSituationCMGValide(situation)) {
		return situationIncomplète
	}

	if (CMGPerçu(situation)) {
		return éligible
	} else {
		return inéligible('CMG-perçu')
	}
}

const aUnNombreDeMoisEmployeureuseSuffisant = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (!estSituationCMGValide(situation)) {
		return situationIncomplète
	}

	if (nombreDeMoisEmployeureuseSuffisant(situation)) {
		return éligible
	} else {
		return inéligible('déclarations')
	}
}

const aDéclaréAssezDHeuresDeGarde = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (!estSituationCMGValide(situation)) {
		return situationIncomplète
	}

	if (moyenneHeuresDeGardeSupérieureAuPlancher(situation)) {
		return éligible
	} else {
		return inéligible('heures-de-garde')
	}
}

const aAuMoinsUnEnfantGardéOuvrantDroitAuCMG = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (!estSituationCMGValide(situation)) {
		return situationIncomplète
	}

	if (auMoinsUnEnfantGardéOuvrantDroitAuCMG(situation)) {
		return éligible
	} else {
		return inéligible('enfants-gardés')
	}
}

const estDésavantagéParLaRéforme = (
	situation: SituationCMG
): FonctionÉligibilité => {
	if (!estSituationCMGValide(situation)) {
		return situationIncomplète
	}

	const montantCT = calculeComplémentTransitoire(situation)
	if (M.estPositif(montantCT)) {
		return E.right(
			E.right({
				estÉligible: true,
				montantCT,
			})
		)
	} else {
		return inéligible('réforme-avantageuse')
	}
}

const CMGPerçu = (situation: SituationCMG): boolean =>
	pipe(
		situation.salariées,
		toutesLesDéclarations,
		A.map((d) => O.isSome(d.CMGPerçu) && d.CMGPerçu.value.valeur > 0),
		A.filter(Boolean),
		A.isNonEmptyArray
	)

const ressourcesInférieuresAuPlafond = (
	situation: SituationCMGValide
): boolean =>
	pipe(
		situation.ressources.value,
		M.estPlusPetitOuÉgalÀ(
			plafondDeRessources(
				situation.enfantsÀCharge.enfants.length,
				situation.parentIsolé.value
			)
		)
	)

export const plafondDeRessources = (nbEnfants: number, parentIsolé: boolean) =>
	pipe(
		PLAFOND_DE_RESSOURCES_COUPLE_1_ENFANT,
		M.plus(M.fois(MAJORATION_PAR_ENFANT, nbEnfants - 1)),
		M.fois(parentIsolé ? MAJORATION_PARENT_ISOLÉ : 1)
	)

const nombreDeMoisEmployeureuseSuffisant = (
	situation: SituationCMG
): boolean => {
	const historique = construireHistorique(situation.salariées)

	return (
		pipe(
			historique,
			R.map((m) => m.length),
			R.values,
			A.filter(Boolean),
			A.length
		) >= NOMBRE_MIN_MOIS_EMPLOYEUREUSE
	)
}

const construireHistorique = (
	salariées: SituationCMGValide['salariées']
): Historique => {
	const déclarations = pipe(salariées, R.values, A.flatten)

	return {
		mars: déclarationsPourLeMois(déclarations, 'mars'),
		avril: déclarationsPourLeMois(déclarations, 'avril'),
		mai: déclarationsPourLeMois(déclarations, 'mai'),
	}
}

const déclarationsPourLeMois = (
	salariées: Array<Salariée>,
	mois: Mois
): Array<DéclarationDeGarde> =>
	pipe(
		salariées,
		A.map((salariée) => salariée[mois]),
		A.getSomes
	)

export const moyenneHeuresDeGardeSupérieureAuPlancher = (
	situation: SituationCMG
): boolean =>
	pipe(
		situation.salariées,
		toutesLesDéclarations,
		moyenneHeuresParTypologieDeGarde(situation.enfantsÀCharge.enfants),
		R.some(
			(moyenneHeuresDeGarde, typologieDeGarde) =>
				moyenneHeuresDeGarde >=
				PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE[typologieDeGarde]
		)
	)

export const moyenneHeuresParTypologieDeGarde =
	(enfants: Array<Enfant>) =>
	(
		déclarationsDeGarde: Array<DéclarationDeGarde>
	): Record<TypologieDeGarde, number> =>
		pipe(
			déclarationsDeGarde,
			groupeLesDéclarationsParTypologieDeGarde(enfants),
			R.map(faitLaMoyenneDesHeuresDeGarde)
		)

const groupeLesDéclarationsParTypologieDeGarde =
	<Prénom extends string>(enfants: Array<Enfant>) =>
	(
		liste: DéclarationDeGarde<Prénom>[]
	): Record<TypologieDeGarde, DéclarationDeGarde[]> =>
		A.groupBy(liste, détermineLaTypologieDeLaGarde(enfants))

const faitLaMoyenneDesHeuresDeGarde = (liste: DéclarationDeGarde[]) =>
	pipe(
		liste,
		A.map((d) => O.getOrElse(d.heuresDeGarde, () => 0)),
		N.sumAll,
		(sum) => Math.ceil(sum / 3)
	)

export const auMoinsUnEnfantGardéOuvrantDroitAuCMG = (
	situation: SituationCMG
): boolean => {
	// Si GED : au moins 1 enfant **à charge** ouvrant droit
	if (A.isNonEmptyArray(situation.salariées.GED)) {
		return auMoinsUnEnfantÀChargeOuvrantDroitAuCMG(
			situation.enfantsÀCharge.enfants
		)
	}

	// Si AMA uniquement : au moins 1 enfant **gardé** ouvrant droit
	const enfantsGardésEnAMA = pipe(
		situation.salariées.AMA,
		A.flatMap((s) => R.values(s)),
		A.getSomes,
		A.map((d) => d.enfantsGardés),
		A.flatten,
		A.dedupe,
		A.map(getEnfantFromPrénom(situation.enfantsÀCharge.enfants)),
		A.getSomes
	)

	return A.some(enfantsGardésEnAMA, enfantOuvreDroitAuCMG)
}

const auMoinsUnEnfantÀChargeOuvrantDroitAuCMG = (
	enfants: Array<Enfant>
): boolean => A.some(enfants, enfantOuvreDroitAuCMG)

export const enfantOuvreDroitAuCMG = and<Enfant>(
	not(enfantNéEn(ANNÉE_DE_NAISSANCE_EXCLUE)),
	enfantAMoinsDe6Ans
)
