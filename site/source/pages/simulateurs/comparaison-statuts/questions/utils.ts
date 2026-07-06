import { Option } from 'effect'
import { TFunction } from 'i18next'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { isOuiNon, OuiNon } from '@/domaine/OuiNon'
import { isQuantité, Quantité } from '@/domaine/Quantite'

export const réponsePasDéfinie = (t: TFunction) =>
	t('pages.simulateurs.commun.pas-défini', 'Pas encore défini')

export const isStringValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<string> =>
	Option.isSome(option) && typeof option.value === 'string'

export const isQuantitéValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<Quantité> =>
	Option.isSome(option) && isQuantité(option.value)

export const isOuiNonValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<OuiNon> =>
	Option.isSome(option) && isOuiNon(option.value)
