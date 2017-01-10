import R from 'ramda'
import removeDiacritics from './utils/remove-diacritics'

let initialSituation = R.pipe(
	R.toPairs,
	R.map(([k,v])=>[removeDiacritics(k).toLowerCase(), v]),
	R.fromPairs
)({
	'durée determinée': true,
	// 'refus CDI avantageux': true
	'CDD poursuivi en CDI': false,
	'CDD type saisonnier': false,
	// 'contrat jeune vacances': false,
	'contrat aidé': false,
	'apprentissage': false,
	'assiette cotisations sociales': 2300
})

export default initialSituation
