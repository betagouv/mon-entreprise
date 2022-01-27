# Modèle social français en publicodes

Ce paquet contient les règles [publicodes](https://publi.codes) utilisées sur https://mon-entreprise.urssaf.fr pour le calcul de l'exonération covid 2021.

### Installation

```
npm install publicodes exoneration-covid
```

### Exemple d'utilisation

```js
import Engine, { formatValue } from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)
engine.setSituation({
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1'",

    'LFSS600 . mois éligibles . avril 2021': 'oui',
    'LFSS600 . mois éligibles . mai 2021': 'non',
    'LFSS600 . mois éligibles . juin 2021': 'oui',
    'LFSS600 . mois éligibles . décembre 2021': 'oui',
})

console.log(formatValue(engine.evaluate('montant total')))
```

👉 **[Voir l'exemple complet](https://codesandbox.io/s/covidform-rxweh?file=/src/index.js)**
