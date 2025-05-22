import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

const PLAFOND_DE_RESSOURCES = M.euros(8_500)
const NOMBRE_MIN_MOIS_EMPLOYEUREUSE = 2

interface MoisHistorique {
	ressources: O.Option<M.Montant<'Euro'>>
	droitsOuverts: boolean
	employeureuse: boolean
	modeDeGardes: Array<DéclarationDeGarde>
}

interface SituationCMG {
	historique: {
		mars: MoisHistorique
		avril: MoisHistorique
		mai: MoisHistorique
	}
}

type DéclarationDeGarde = DéclarationDeGardeGED | DéclarationDeGardeAMA

interface DéclarationDeGardeGED {
	type: 'GED'
	heuresDeGarde: number
}

interface DéclarationDeGardeAMA {
	type: 'AMA'
	heuresDeGarde: number
	typologieDeGarde: TypologieDeGardeAMA
}
type TypologieDeGardeAMA =
	| 'AMA Enfant unique 0-3 ans'
	| 'AMA Enfant unique 3-6 ans'
	| 'AMA Fratrie 0-3 ans'
	| 'AMA Fratrie 0-6 ans'

type TypologieDeGarde = TypologieDeGardeAMA | 'GED'

export const estÉligible = (situation: SituationCMG) => {
	const { mars, avril, mai } = situation.historique

	const droitsOuvertsSurAucunMois =
		!mars.droitsOuverts && !avril.droitsOuverts && !mai.droitsOuverts
	if (droitsOuvertsSurAucunMois) return false

	if (O.isNone(mai.ressources)) return false

	if (pipe(mai.ressources.value, M.estPlusGrandOuÉgalÀ(PLAFOND_DE_RESSOURCES)))
		return false

	const nombreDeMoisEmployeureuse = pipe(
		situation.historique,
		R.map((m) => m.employeureuse && O.isSome(m.ressources)),
		R.values,
		A.filter(Boolean),
		A.length
	)

	if (nombreDeMoisEmployeureuse < NOMBRE_MIN_MOIS_EMPLOYEUREUSE) return false

	return true
}

export const moyenneHeuresParTypologieDeGarde = (
	historique: SituationCMG['historique']
): Record<TypologieDeGarde, number> => {
	return pipe(
		historique,
		R.values,
		A.flatMap((m) => m.modeDeGardes),
		groupeLesDéclarationsParTypologieDeGarde,
		R.map(faitLaMoyenneDesHeuresDeGarde)
	)
}

const faitLaMoyenneDesHeuresDeGarde = (liste: DéclarationDeGarde[]) =>
	pipe(
		liste,
		A.map((d) => d.heuresDeGarde),
		N.sumAll,
		(sum) => Math.ceil(sum / 3)
	)

const groupeLesDéclarationsParTypologieDeGarde: (
	liste: DéclarationDeGarde[]
) => Record<TypologieDeGarde, DéclarationDeGarde[]> = A.groupBy(
	(d: DéclarationDeGarde): TypologieDeGarde =>
		d.type === 'GED' ? 'GED' : d.typologieDeGarde
)
