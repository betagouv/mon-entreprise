import { DéclarationDeGarde } from './declaration-de-garde'
import { Enfant, enfantAPlusDe3Ans, getEnfantFromPrénom } from './enfant'

type TypologieDeGardeAMA =
	| 'AMA Enfant unique 0-3 ans'
	| 'AMA Enfant unique 3-6 ans'
	| 'AMA Fratrie 0-3 ans'
	| 'AMA Fratrie 0-6 ans'

export type TypologieDeGarde = TypologieDeGardeAMA | 'GED'

export const détermineLaTypologieDeLaGarde =
	<Prénom extends string>(enfants: Array<Enfant<Prénom>>) =>
	(declarationDeGarde: DéclarationDeGarde<Prénom>): TypologieDeGarde => {
		if (declarationDeGarde.type === 'GED') {
			return 'GED'
		}

		if (declarationDeGarde.enfantsGardés.length > 1) {
			const unEnfantDePlusDe3Ans = declarationDeGarde.enfantsGardés.some(
				(prénom: Prénom) =>
					enfantAPlusDe3Ans(getEnfantFromPrénom(prénom, enfants))
			)
			if (unEnfantDePlusDe3Ans) {
				return 'AMA Fratrie 0-6 ans'
			} else {
				return 'AMA Fratrie 0-3 ans'
			}
		} else {
			const prénom = declarationDeGarde.enfantsGardés[0]
			if (enfantAPlusDe3Ans(getEnfantFromPrénom(prénom, enfants))) {
				return 'AMA Enfant unique 3-6 ans'
			} else {
				return 'AMA Enfant unique 0-3 ans'
			}
		}
	}
