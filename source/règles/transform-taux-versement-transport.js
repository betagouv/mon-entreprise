/* Petit script de transformation du fichier de taux du versement transport, un object indexé sur le code commune, vers
 * une liste contenant le code commune en clef d'objet.
 * ... et d'autres petites transformations :
 * il manque les taux des villes avec arrondissement (les taux de chaque arrondissement y sont, mais pas celui de la ville globale, c'est le même évidemment)
 */

let taux = require('./taux-versement-transport-bruts.json')
let {
	sort,
	head,
	pipe,
	map,
	assoc,
	merge,
	find,
	propEq,
	toPairs,
	pick
} = require('ramda')
let fs = require('fs')

let result = pipe(
	toPairs,
	map(([k, v]) => assoc('codeCommune', k, v))
)(taux)

let villesAvecArrondissements = [
	[
		{
			nomLaposte: 'Paris',
			codeCommune: '75056',
			nomAcoss: null,
			codePostal: null
		},
		'75101'
	],
	[
		{
			nomLaposte: 'Marseille',
			codeCommune: '13055',
			nomAcoss: null,
			codePostal: null
		},
		'13201'
	],
	[
		{
			nomLaposte: 'Marseille',
			codeCommune: '69123',
			nomAcoss: null,
			codePostal: null
		},
		'69381'
	]
]

let additionnalResults = villesAvecArrondissements.map(
	([data, codeCommune1erArrondissement]) =>
		merge(
			find(propEq('codeCommune', codeCommune1erArrondissement))(result),
			data
		)
)

let extractLastTaux = pipe(
	toPairs,
	sort(([date1], [date2]) => (date1 > date2 ? -1 : 1)),
	head,
	([, rate]) => rate
)

let trimmed = result
	.concat(additionnalResults)
	.map(pick(['codeCommune', 'nomLaposte', 'aot', 'smt']))
	//get last rate only
	.map(({ aot, smt, ...rest }) => ({
		...rest,
		...(aot ? { aot: extractLastTaux(aot.taux) } : {}),
		...(smt ? { smt: extractLastTaux(smt.taux) } : {})
	}))
// almost useless
//
//	.filter(({ aot, smt }) => (aot && aot !== '0') || (smt && smt !== '0'))

fs.writeFile(
	'./taux-versement-transport.json',
	JSON.stringify(trimmed),
	function(err) {
		if (err) {
			return console.log(err) //eslint-disable-line no-console
		}

		console.log("C'est tout bon !") //eslint-disable-line no-console
	}
)
