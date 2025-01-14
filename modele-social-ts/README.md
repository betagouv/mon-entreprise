# Modèle social français en TypeScript

Ce paquet contient les règles TypeScript utilisées sur https://mon-entreprise.urssaf.fr
pour le calcul des cotisations sociales, des impôts et des droits sociaux.

### Installation

```
npm install modele-social-ts
```

### Exemple d'utilisation

```js
import { Salarié } from 'modele-social-ts'

const net: SalaireNet = Salarié({ salaire: Brut(2_000)})
    .getSalaireNetAvantImpôt()


console.log(formatValue(net))
```
