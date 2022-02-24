# Covid : exonération de cotisation sociale pour les indépendants

Ce paquet contient les règles [publicodes](https://publi.codes) utilisées sur https://mon-entreprise.urssaf.fr pour le calcul de l'exonération covid 2021.

### Installation

```
npm install publicodes exoneration-covid
```

### Exemple

```js
import Engine, { formatValue } from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)
engine.setSituation({
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1bis'",

    'mois . mai 2021': "'LFSS 600'",
    'mois . juin 2021': "'LFR1'",
    'mois . juillet 2021': "'LFSS 600'",
    'mois . août 2021': 'non',
    'mois . décembre 2021': "'LFSS 300'",
    'mois . janvier 2022': "'LFSS 600'",
    'mois . février 2022': "'LFSS 300'",
})

console.log(formatValue(engine.evaluate('montant total'))) // "3000 €"
console.log(engine.evaluate('code').nodeValue) // "S1B;O;3;1;O;1"
```

👉 **[Voir l'exemple complet](https://codesandbox.io/s/covidform-rxweh?file=/src/index.js)**

### Utilisation

#### 1. Récuperer la liste des mois à afficher

La première étape est de savoir quels sont les mois à afficher en fonction des données d'entrée (secteur, lieu et date de début d'activité). Pour cela, il suffit de récuperer la liste de toutes les variables manquantes à l'évaluation du montant dans la situation. Voici comment procéder :

```js
import Engine from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)

// 1. On met à jour les valeurs de la première étape du formulaire
const step1Situation = {
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1'",
}
engine.setSituation(step1Situation)

// 2. On lance le calcul pour le montant exonéré
const evaluation = engine.evaluate('montant total')

// 3. On récupère la liste des mois manquants
const missingVariables = Object.keys(evaluation.missingVariables)
```

Ci-dessus, `missingVariable` contiendra la liste des règles publicodes dont la valeur est manquante pour l'évaluation.

```json
[
    "mois . mai 2021",
    "mois . juin 2021",
    "mois . juillet 2021",
    "mois . août 2021",
    "mois . décembre 2021",
    "mois . janvier 2022",
    "mois . février 2022"
]
```

#### 2. Obtenir les exonérations possibles pour un mois en particulier

Par défaut, on souhaite qu'aucune exonération ne soit selectionnée pour aucun des mois. On va donc mettre à jour la situation initiale en conséquence :

```js
import Engine, { formatValue } from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)

const step1Situation = {
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1'",
}

const monthToFill = Object.keys(
    engine.evaluate('montant total').missingVariables
)
const currentSituation = Object.fromEntries(
    monthToFill.map((month) => [month, 'non'])
)
engine.setSituation({ ...step1Situation, ...currentSituation })
```

Pour connaître la liste des éléments possibles pour un mois, il faut lister les possibilités :

```js
const currentMonth = 'mois . juillet 2022'
const options = Object.keys(engine.getParsedRules()).filter((name) =>
    name.startsWith(currentMonth + ' . ')
) // Retourne ['mois . juillet . LFSS 600', 'mois . juillet . LFR 1' ]
```

Puis enlever les options qui ne sont pas applicables dans la situation actuelle. Pour cela, on utilise la situation courante en réinitialisant le mois selectionné.

```js
const situationWithoutCurrentMonth = {
    ...step1Situation,
    ...currentSituation,
}
delete situationWithoutCurrentMonth[currentMonth]
engine.setSituation(situationWithoutCurrentMonth)

const applicableOptions = options.filter(
    (name) => engine.evaluate(name).nodeValue !== false
)
```

#### 3. Calculer le montant de l'exonération en temps réel

Pour calculer l'exonération en fonction des entrées de l'utilisateur, il suffit de mettre à jour la situation avec les informations saisies par ce dernier.

```js
import Engine, { formatValue } from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)

const step1Situation = {
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1'",
}
const currentSituation = {
    'mois éligibles . mai 2021': "'LFSS 600'",
    'mois éligibles . juin 2021': "'LFR1'",
    'mois éligibles . juillet 2021': "'LFSS 600'",
    'mois éligibles . août 2021': "'LFR1'",
    'mois éligibles . décembre 2021': "'LFSS 300'",
    'mois éligibles . janvier 2022': "'non'",
    'mois éligibles . février 2022': "'LFSS 300'",
}

const montantTotal = engine
    .setSituation({
        ...step1situation,
        ...currentSituation,
    })
    .evaluate('montant total')

console.log(montantTotal.nodeValue) // 3300
console.log(formatValue(montantTotal)) // "3 300 €"
```
