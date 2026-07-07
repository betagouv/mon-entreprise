# Modèle social français en publicodes

Ce paquet contient les règles [publicodes](https://publi.codes) utilisées sur https://mon-entreprise.urssaf.fr
pour le calcul des cotisations sociales, des impôts et des droits sociaux des dirigeantes et dirigeants ayant le statut d’assimilé salarié.

### Installation

```
npm install publicodes modele-as
```

### Exemple d'utilisation

```js
import rules from 'modele-as'
import Engine, { formatValue } from 'publicodes'

const engine = new Engine(rules)

const net = engine
    .setSituation({
        'assimilé salarié . rémunération . brute': '3000 €/mois',
    })
    .evaluate('assimilé salarié . rémunération . nette . à payer avant impôt')

console.log(formatValue(net))
```
