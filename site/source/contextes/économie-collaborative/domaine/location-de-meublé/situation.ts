import * as O from 'effect/Option'

import { eurosParAn, Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

interface SituationÉconomieCollaborativeBase extends Situation {
	_type: 'économie-collaborative'
	estAlsaceMoselle: O.Option<boolean>
	premièreAnnée: O.Option<boolean>
}

export interface SituationChambreDHôte
	extends SituationÉconomieCollaborativeBase {
	typeHébergement: 'chambre-hôte'
	revenuNet: O.Option<Montant<'€/an'>>
}

interface SituationMeubléDeTourismeBase
	extends SituationÉconomieCollaborativeBase {
	typeHébergement: 'meublé-tourisme'
	recettes: O.Option<Montant<'€/an'>>
	autresRevenus: O.Option<Montant<'€/an'>>
	classement: O.Option<Classement>
}

export interface SituationMeubléLongueDurée
	extends SituationMeubléDeTourismeBase {
	typeDurée: O.Some<'longue'>
}

export interface SituationMeubléCourteDurée
	extends SituationMeubléDeTourismeBase {
	typeDurée: O.Some<'courte'>
}

export interface SituationMeubléDuréeMixte
	extends SituationMeubléDeTourismeBase {
	typeDurée: O.Some<'mixte'>
	recettesCourteDurée: O.Option<Montant<'€/an'>>
}

export interface SituationMeubléDeTourismeIncomplète
	extends SituationMeubléDeTourismeBase {
	typeDurée: O.None<TypeDurée>
}

export type SituationMeubléDeTourisme =
	| SituationMeubléLongueDurée
	| SituationMeubléCourteDurée
	| SituationMeubléDuréeMixte
	| SituationMeubléDeTourismeIncomplète

export type SituationÉconomieCollaborative =
	| SituationChambreDHôte
	| SituationMeubléDeTourisme

export type Classement = 'classé' | 'non-classé' | 'mixte'

export type TypeDurée = 'courte' | 'longue' | 'mixte'

export type TypeHébergement = 'meublé-tourisme' | 'chambre-hôte'

export const situationParDéfaut = {
	autresRevenus: eurosParAn(0),
	classement: 'non-classé' as Classement,
	estAlsaceMoselle: false,
	premièreAnnée: false,
}

export enum RegimeCotisation {
	microEntreprise = 'micro-entreprise',
	travailleurIndependant = 'travailleur-indépendant',
	regimeGeneral = 'régime-général',
}

export const initialSituationMeubléDeTourisme: SituationMeubléDeTourismeIncomplète =
	{
		_tag: 'Situation',
		_type: 'économie-collaborative',
		typeHébergement: 'meublé-tourisme',
		recettes: O.none(),
		autresRevenus: O.none(),
		typeDurée: O.none() as O.None<TypeDurée>,
		classement: O.none(),
		estAlsaceMoselle: O.none(),
		premièreAnnée: O.none(),
	}

export const initialSituationChambreDHôte: SituationChambreDHôte = {
	_tag: 'Situation',
	_type: 'économie-collaborative',
	typeHébergement: 'chambre-hôte',
	revenuNet: O.none(),
	estAlsaceMoselle: O.none(),
	premièreAnnée: O.none(),
}

export const initialSituationÉconomieCollaborative: SituationÉconomieCollaborative =
	initialSituationMeubléDeTourisme

export interface SituationMeubléLongueDuréeValide
	extends SituationMeubléLongueDurée {
	recettes: O.Some<Montant<'€/an'>>
}

export interface SituationMeubléCourteDuréeValide
	extends SituationMeubléCourteDurée {
	recettes: O.Some<Montant<'€/an'>>
}

export interface SituationMeubléDuréeMixteValide
	extends SituationMeubléDuréeMixte {
	recettes: O.Some<Montant<'€/an'>>
	recettesCourteDurée: O.Some<Montant<'€/an'>>
}

export interface SituationMeubléDeTourismeIncomplèteValide
	extends SituationMeubléDeTourismeIncomplète {
	recettes: O.Some<Montant<'€/an'>>
}

export type SituationMeubléDeTourismeValide =
	| SituationMeubléLongueDuréeValide
	| SituationMeubléCourteDuréeValide
	| SituationMeubléDuréeMixteValide
	| SituationMeubléDeTourismeIncomplèteValide

export type SituationMeubléAvecAutresRevenus =
	SituationMeubléDeTourismeValide & {
		autresRevenus: O.Some<Montant<'€/an'>>
	}

export function aRenseignéSesAutresRevenus(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléAvecAutresRevenus {
	return O.isSome(situation.autresRevenus)
}

export type SituationMeubléAvecTypeDurée = SituationMeubléDeTourismeValide & {
	typeDurée: O.Some<TypeDurée>
}

export function aRenseignéSonTypeDeDurée(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléAvecTypeDurée {
	return O.isSome(situation.typeDurée)
}

export type SituationMeubléAvecClassement = SituationMeubléDeTourismeValide & {
	classement: O.Some<Classement>
}

export function aRenseignéSonClassement(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléAvecClassement {
	return O.isSome(situation.classement)
}

export interface SituationChambreDHôteValide extends SituationChambreDHôte {
	revenuNet: O.Some<Montant<'€/an'>>
}

export type SituationÉconomieCollaborativeValide =
	| SituationMeubléDeTourismeValide
	| SituationChambreDHôteValide

export function estSituationMeubléDeTourismeValide(
	situation: SituationÉconomieCollaborative
): situation is SituationMeubléDeTourismeValide {
	return (
		situation.typeHébergement === 'meublé-tourisme' &&
		O.isSome(situation.recettes)
	)
}

export function estSituationChambreDHôteValide(
	situation: SituationÉconomieCollaborative
): situation is SituationChambreDHôteValide {
	return (
		situation.typeHébergement === 'chambre-hôte' &&
		O.isSome(situation.revenuNet)
	)
}

export function estSituationValide(
	situation: SituationÉconomieCollaborative
): situation is SituationÉconomieCollaborativeValide {
	return (
		estSituationMeubléDeTourismeValide(situation) ||
		estSituationChambreDHôteValide(situation)
	)
}

export function faitDeLaLocationCourteDurée(
	situation: SituationMeubléDeTourismeValide
): situation is
	| SituationMeubléCourteDuréeValide
	| SituationMeubléDuréeMixteValide {
	return O.match(situation.typeDurée, {
		onNone: () => false,
		onSome: (typeDurée) => typeDurée === 'courte' || typeDurée === 'mixte',
	})
}

export function faitDeLaLocationCourteEtLongueDurée(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléDuréeMixteValide {
	return O.match(situation.typeDurée, {
		onNone: () => false,
		onSome: (typeDurée) => typeDurée === 'mixte',
	})
}

export function faitDeLaLocationLongueDuréeExclusivement(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléLongueDuréeValide {
	return O.match(situation.typeDurée, {
		onNone: () => false,
		onSome: (typeDurée) => typeDurée === 'longue',
	})
}

export function faitDeLaLocationCourteDuréeExclusivement(
	situation: SituationMeubléDeTourismeValide
): situation is SituationMeubléCourteDuréeValide {
	return O.match(situation.typeDurée, {
		onNone: () => false,
		onSome: (typeDurée) => typeDurée === 'courte',
	})
}

export function setTypeDurée(
	typeDurée: O.Option<TypeDurée>
): (situation: SituationMeubléDeTourisme) => SituationMeubléDeTourisme {
	return (situation) => {
		return O.match(typeDurée, {
			onNone: () =>
				({
					...situation,
					typeDurée: O.none() as O.None<TypeDurée>,
				}) as SituationMeubléDeTourismeIncomplète,
			onSome: (durée) => {
				if (durée === 'longue') {
					const { recettesCourteDurée, ...rest } =
						situation as SituationMeubléDeTourisme & {
							recettesCourteDurée?: O.Option<Montant<'€/an'>>
						}

					return {
						...rest,
						typeDurée: O.some(durée),
					} as SituationMeubléLongueDurée
				}

				if (durée === 'courte') {
					const { recettesCourteDurée, ...rest } =
						situation as SituationMeubléDeTourisme & {
							recettesCourteDurée?: O.Option<Montant<'€/an'>>
						}

					return {
						...rest,
						typeDurée: O.some(durée),
					} as SituationMeubléCourteDurée
				}

				return {
					...situation,
					typeDurée: O.some(durée),
					recettesCourteDurée:
						'recettesCourteDurée' in situation
							? situation.recettesCourteDurée
							: O.none(),
				} as SituationMeubléDuréeMixte
			},
		})
	}
}
