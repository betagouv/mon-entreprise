/* Petit script de transformation du fichier de taux du versement transport, un object indexé sur le code commune, vers
 * une liste contenant le code commune en clef d'objet
 */

let taux = require('./taux.json')
let R = require('ramda')
let fs = require('fs')

let result = R.pipe(
	R.toPairs,
	R.map(([k,v]) => R.assoc('codeCommune', k, v)),
)(taux)

let json = JSON.stringify(result)

fs.writeFile("./liste-taux.json", json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("C'est tout bon !");
});
