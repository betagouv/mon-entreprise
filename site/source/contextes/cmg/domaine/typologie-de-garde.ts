import { DéclarationDeGarde } from './déclaration-de-garde'
import { Enfant, enfantAPlusDe3Ans } from './enfant'

type TypologieDeGardeAMA =
	| 'AMA Enfant unique 0-3 ans'
	| 'AMA Enfant unique 3-6 ans'
	| 'AMA Fratrie 0-3 ans'
	| 'AMA Fratrie 0-6 ans'

export type TypologieDeGarde = TypologieDeGardeAMA | 'GED'

export const détermineLaTypologieDeLaGarde =
	<Prénom extends string>(enfants: Record<Prénom, Enfant>) =>
	(déclarationDeGarde: DéclarationDeGarde<Prénom>): TypologieDeGarde => {
		if (déclarationDeGarde.type === 'GED') {
			return 'GED'
		}

		if (déclarationDeGarde.enfantsGardés.length > 1) {
			const unEnfantDePlusDe3Ans = déclarationDeGarde.enfantsGardés.some(
				(prénom: Prénom) => enfantAPlusDe3Ans(enfants[prénom])
			)
			if (unEnfantDePlusDe3Ans) {
				return 'AMA Fratrie 0-6 ans'
			} else {
				return 'AMA Fratrie 0-3 ans'
			}
		} else {
			const prénom = déclarationDeGarde.enfantsGardés[0]
			if (enfantAPlusDe3Ans(enfants[prénom])) {
				return 'AMA Enfant unique 3-6 ans'
			} else {
				return 'AMA Enfant unique 0-3 ans'
			}
		}
	}
