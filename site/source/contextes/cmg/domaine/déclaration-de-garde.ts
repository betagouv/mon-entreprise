import {
	DéclarationDeGarde,
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
} from '@/contextes/cmg/domaine/éligibilité'

export const déclarationDeGardeEstAMA = <Prénom extends string = string>(
	d: DéclarationDeGarde
): d is DéclarationDeGardeAMA<Prénom> => d.type === 'AMA'

export const déclarationDeGardeEstGED = (
	d: DéclarationDeGarde
): d is DéclarationDeGardeGED => d.type === 'GED'
