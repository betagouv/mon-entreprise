# Modèle social français en publicodes

Ce paquet contient les règles [publicodes](https://publi.codes) utilisées sur https://mon-entreprise.urssaf.fr
pour le calcul des cotisations sociales, des impôts et des droits sociaux des travailleuses et travailleurs au régime
d’indépendant.

### Installation

```
npm install publicodes modele-ti
```

### Exemple d'utilisation

```js
import rules from 'modele-ti'
import Engine, { formatValue } from 'publicodes'

const engine = new Engine(rules)

const net = engine
    .setSituation({
        'indépendant . rémunération . brute': '3000 €/mois',
    })
    .evaluate('indépendant . rémunération . nette')

console.log(formatValue(net))
```
