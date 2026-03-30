import { DottedName } from './publicodes/DottedName'

export const estPasQuestionEnListeNoire =
	(listeNoire: DottedName[]) =>
	(question: DottedName): boolean =>
		!listeNoire.some((préfixe) => question.startsWith(préfixe))
