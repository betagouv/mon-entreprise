# Modèle social français en publicodes

Ce paquet contient les règles publicodes utilisées sur https://mon-entreprise.fr
pour le calcul des cotisations sociales, des impôts et des droits sociaux.
### Installation
```
npm install publicodes modele-social 
```

### Exemple d'utilisation
```js
import Engine, { formatValue } from "publicodes";
import rules from "modele-social";

const engine = new Engine(rules);

const net = engine
  .setSituation({
    "contrat salarié . rémunération . brut de base": "3000 €/mois",
  })
  .evaluate("contrat salarié . rémunération . net");

console.log(formatValue(net));

```

[Voir le tutoriel complet](https://mon-entreprise.fr/int%C3%A9gration/biblioth%C3%A8que-de-calcul)
