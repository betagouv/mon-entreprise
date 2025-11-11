import { GuichetEntry } from '@/components/GuichetInfo'

type PLRMétier =
	| "'rattaché CIPAV'"
	| "'expert-comptable'"
	| "'santé . médecin'"
	| "'santé . chirurgien-dentiste'"
	| "'santé . sage-femme'"
	| "'santé . auxiliaire médical'"
	| "'santé . pharmacien'"
	| "'juridique . avocat'"
	| "'juridique . notaire'"
	| "'juridique . officier'"

export function guichetToPLMétier(
	guichet: GuichetEntry
): PLRMétier | undefined {
	const caisse = guichet.caisseDeRetraiteSpéciale

	return caisse === 'CIPAV'
		? "'rattaché CIPAV'"
		: caisse === 'CARCDSF'
		? guichet.code === '07140111'
			? "'santé . sage-femme'"
			: "'santé . chirurgien-dentiste'"
		: caisse === 'CAVP'
		? "'santé . pharmacien'"
		: caisse === 'CARPIMKO'
		? "'santé . auxiliaire médical'"
		: caisse === 'CARMF'
		? "'santé . médecin'"
		: caisse === 'CPRN'
		? "'juridique . notaire'"
		: caisse === 'CAVOM'
		? "'juridique . officier'"
		: caisse === 'CNBF'
		? "'juridique . avocat'"
		: caisse === 'CAVEC'
		? "'expert-comptable'"
		: !caisse
		? undefined
		: throwCaisseDeRetraiteInconnue()
}

function throwCaisseDeRetraiteInconnue(): never {
	throw new Error('Caisse de retraite inconnue')
}
