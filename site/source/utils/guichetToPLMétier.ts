import { GuichetEntry } from '@/components/GuichetInfo'

type PLRMétier =
	| "'rattaché CIPAV'"
	| "'expert-comptable'"
	| "'santé . métier . médecin'"
	| "'santé . métier . chirurgien-dentiste'"
	| "'santé . métier . sage-femme'"
	| "'santé . métier . auxiliaire médical'"
	| "'santé . métier . pharmacien'"
	| "'juridique . métier . avocat'"
	| "'juridique . métier . notaire'"
	| "'juridique . métier . officier'"

export function guichetToPLMétier(
	guichet: GuichetEntry
): PLRMétier | undefined {
	const caisse = guichet.caisseDeRetraiteSpéciale

	return caisse === 'CIPAV'
		? "'rattaché CIPAV'"
		: caisse === 'CARCDSF'
		? guichet.code === '07140111'
			? "'santé . métier . sage-femme'"
			: "'santé . métier . chirurgien-dentiste'"
		: caisse === 'CAVP'
		? "'santé . métier . pharmacien'"
		: caisse === 'CARPIMKO'
		? "'santé . métier . auxiliaire médical'"
		: caisse === 'CARMF'
		? "'santé . métier . médecin'"
		: caisse === 'CPRN'
		? "'juridique . métier . notaire'"
		: caisse === 'CAVOM'
		? "'juridique . métier . officier'"
		: caisse === 'CNBF'
		? "'juridique . métier . avocat'"
		: caisse === 'CAVEC'
		? "'expert-comptable'"
		: !caisse
		? undefined
		: throwCaisseDeRetraiteInconnue()
}

function throwCaisseDeRetraiteInconnue(): never {
	throw new Error('Caisse de retraite inconnue')
}
