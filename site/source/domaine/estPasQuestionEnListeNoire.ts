import { DottedName } from 'modele-social'

export const estPasQuestionEnListeNoire =
	(listeNoire: DottedName[]) =>
	(question: DottedName): boolean =>
		!listeNoire.some((préfixe) => question.startsWith(préfixe))
