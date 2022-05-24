# Modèle social français en publicodes

Ce paquet contient les règles [publicodes](https://publi.codes) utilisées sur https://mon-entreprise.urssaf.fr
pour le calcul des cotisations sociales, des impôts et des droits sociaux.

### Installation

```
npm install publicodes modele-social
```

### Exemple d'utilisation

```js
import Engine, { formatValue } from 'publicodes'
import rules from 'modele-social'

const engine = new Engine(rules)

const net = engine
    .setSituation({
        'salarié . contrat . salaire brut': '3000 €/mois',
    })
    .evaluate('salarié . rémunération . net')

console.log(formatValue(net))
```

👉 **[Voir le tutoriel complet](https://mon-entreprise.urssaf.fr/int%C3%A9gration/biblioth%C3%A8que-de-calcul)**
