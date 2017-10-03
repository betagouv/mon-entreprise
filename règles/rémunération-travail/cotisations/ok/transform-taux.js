/* Petit script de transformation du fichier de taux du versement transport, un object indexé sur le code commune, vers
 * une liste contenant le code commune en clef d'objet.
 * ... et d'autres petites transformations :
 * il manque les taux des villes avec arrondissement (les taux de chaque arrondissement y sont, mais pas celui de la ville globale, c'est le même évidemment)
 */

let taux = require('./taux.json')
let R = require('ramda')
let fs = require('fs')

let result = R.pipe(
	R.toPairs,
	R.map(([k,v]) => R.assoc('codeCommune', k, v)),
)(taux)


let villesAvecArrondissements = [
	[{nomLaposte: "Paris", codeCommune: "75056", nomAcoss: null, codePostal: null}, "75101"],
	[{nomLaposte: "Marseille", codeCommune: "13055", nomAcoss: null, codePostal: null}, "13201"],
	[{nomLaposte: "Marseille", codeCommune: "69123", nomAcoss: null, codePostal: null}, "69381"]
]

let additionnalResults = villesAvecArrondissements.map(
	([data, codeCommune1erArrondissement]) =>
		R.merge(
			R.find(R.propEq('codeCommune', codeCommune1erArrondissement))(result),
			data
		)
)

fs.writeFile("./liste-taux.json", JSON.stringify(result.concat(additionnalResults)), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("C'est tout bon !");
});
