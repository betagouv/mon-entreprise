# Covid : exonération de cotisation sociale pour les indépendants
***Archivé***

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

console.log(formatValue(engine.evaluate('montant total'))) // "2 650 €"
console.log(engine.evaluate('code').nodeValue) // "S1B;O;3;2;O;1"
```

👉 **[Voir l'exemple complet](https://codesandbox.io/s/covidform-rxweh?file=/src/index.js)**

### Utilisation

#### 1. Récuperer la liste des mois à afficher

La première étape est de savoir quels sont les mois à afficher en fonction des données d'entrée (secteur, lieu et date de début d'activité). Pour cela, il suffit de récuperer la liste de tous les mois applicables :

```js
import Engine from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)

// 1. On met à jour les valeurs de la première étape du formulaire
const step1Situation = {
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'", // peut prendre les valeurs "<mois> <année>" ou "avant 2021"
    secteur: "'S1'",
}
engine.setSituation(step1Situation)

// 2. On récupère la liste des mois applicables

const montantTotal = engine.evaluate('montant total')
const months = Object.keys(engine.getParsedRules()).filter(
    (name) =>
        // On veut les règles mois (de la forme `mois . janvier 2021`)...
        name.match(/^mois \. [^.]*$/) &&
        // ... qui sont applicables dans la situation donnée en entrée
        engine.evaluate(name).nodeValue !== null
)
```

Ci-dessus, `months` contiendra la liste des mois qui sont applicables par rapport à la situation en entrée.

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

```js
import Engine from 'publicodes'
import rules from 'exoneration-covid'

const engine = new Engine(rules)

// 1. On met à jour les valeurs avec la situation courante
const step1Situation = {
    "lieu d'exercice": "'métropole'",
    "début d'activité": "'mai 2021'",
    secteur: "'S1'",
}
const currentFormSituation = {
    'mois . mai 2021': 'non',
}

engine.setSituation({
    ...step1Situation,
    ...currentFormSituation,
})

// Fonction pour obtenir la liste des options disponibles pour chaque mois (`mois . janvier 2021`)
function getValidOptions(month) {
    // On liste les options possibles pour ce mois (règles de la forme `mois . janvier 2021 . LFSS600`)
    const options = Object.keys(engine.getParsedRules()).filter((name) =>
        name.startsWith(month + ' . ')
    )
    // On elimine les options non applicables dans la situation présente
    const validOptions = options.filter(
        (name) => engine.evaluate(name).nodeValue !== null
    )
    return validOptions
}
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

A noter : on peut mettre à jour la situation pour enlever certains mois qui deviennent non applicables
