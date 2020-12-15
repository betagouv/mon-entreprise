## Installation ![béta](https://img.shields.io/badge/-beta-blue)

Publicode est distribué sous la forme d'une librairie
[Node.js](https://nodejs.org/fr/) permettant de compiler un jeu de règles
publicodes et de l'évaluer dans une situation donnée.

Le paquet est disponble sur NPM :

```sh
$ npm install publicodes
# installation des peer dependancies
$ npm install react react-router-dom react-router-hash-link
```

> Note : publicodes requiert l'installation de ses peerDependancy pour
> fonctionner. La raison est qu'en l'état actuel des choses, la
> [documentation interactive (en react)](#composants-react) n'a pas été extraite du coeur du moteur
> (calcul). Cela est **temporaire** et nous avons prévu d'y remedier dans une
> prochaine version, en créant deux paquets séparés : publicodes et publicodes/react

## Utilisation

### Introduction

La libraire exporte un objet `Engine` qui permet d'instancier le moteur avec un
jeu de règles publicodes :

```js
import Engine from 'publicodes'

// On définit une liste de règles publicodes
const rules = `
prix . carottes: 2€/kg
prix . champignons: 5€/kg
prix . avocat: 2€/avocat

dépenses primeur:
  formule: 
    somme:
      - prix . carottes * 1.5 kg
      - prix . champignons * 500g
      - prix . avocat * 3 avocat
`

// On initialise un moteur en lui donnant le publicode.
// Ce publicode va être parsé
const engine = new Engine(rules)
```

(Attention, sous node vous devrez faire `const Engine = require('publicodes').default`)

La variable `engine` permet en ensuite de calculer la valeur d'une règle avec la
méthode `evaluate`.

```js
console.log(engine.evaluate('dépenses primeur'))
```

La valeur du nœud est disponible dans la propriété `nodeValue`, son
unité est disponible dans la propriété `unit`. Mais pour un formattage sans
effort, on préfèrera utiliser la fonction `formatValue`

```js
import Engine, { formatValue } from 'publicodes'
// ...
const dépenses = engine.evaluate('dépenses primeur')
console.log(`J'ai dépensé ${formatValue(dépenses)} chez le primeur.`)
```

La méthode `setSituation` permet de forcer la valeur d'une liste de règles. Elle
est utile pour préciser les paramètres spécifiques à une simulation.

```js
// Ici on change le prix des avocats
engine.setSituation({
    'prix . avocat': '3€/avocat',
})
```

La valeur de `dépenses primeur` se base maintenant sur un avocat à 3€ :

```js
// On ré-évalue la règle dans la nouvelle situation
console.log(
    `Nouveau prix ! Dépenses mises à jour: ${formatValue(
        engine.evaluate('dépenses primeur')
    )}.`
)
```

### Évaluation d'expressions

La fonction `evaluate` permet d'évaluer des expressions publicode complètes

```js
// On va au marché une fois par semaine, amortissons la dépense sur 7 jours
const depensesParJour = engine.evaluate('dépenses primeur / 7 jours')
console.log(`J'ai dépensé ${formatValue(depensesParJour)}.`)
```

### Conversion d'unité

Publicode permet de réaliser des conversions d'unités. Pour celà il faut
indiquer l'unité désirée via le mécanisme [`unité`](https://publi.codes/documentation/mécanismes#unité) :

```js
// on va au marché une fois par semaine en moyenne, combien dépense-t-on par mois ?
const depensesParMois = engine.evaluate({
    valeur: 'dépenses primeur / 7 jours',
    unité: '€/mois',
})
console.log(`J'ai dépensé ${formatValue(depensesParMois)}.`)
```

[➡ en savoir plus sur les unités](https://publi.codes/documentation/principes-de-base#unités)

### Variables manquantes

Publicode calcule automatiquement les dépendances de chaque règle. Si une la
valeur d'une dépendance est manquante et ne permet pas de faire le calcul elle
apparaîtra dans la propriété `missingVariables`

```js
const missingYEngine = new Engine(`
x: y + 5

y:
`)

console.log(missingYEngine.evaluate('x').missingVariables)
```

Cette information est utile pour intégrer publicode à votre application.

Il est aussi possible d'utiliser des valeurs par défaut. Dans ce cas la règle
sera calculée avec la valeur par défaut de sa dépendance, mais cette dernière
apparaîtra tout de même dans les `missingVariables`. Cette fonctionnalité est
utile pour réaliser des simulateurs où l'on veut proposer un résultat sans
attendre que l'utilisateur ait répondu à l'intégralité des questions tout en
utilisant la liste des variables manquantes pour déterminer les questions
restant à poser.

Les variables manquantes sont calculées lors de l'évaluation. Si une variable
apparaît dans la formule de calcul d'une règle elle ne sera rapportée que si
elle est effectivement nécessaire au calcul. Si elle est présente dans une
portion non active de l'évaluation (par exemple dans un bloc condition non
actif, ou la tranche d'un barème non actif) elle sera filtrée et n'apparaîtra
pas dans les `missingVariables`.

### Documentation interactive

Publicodes génère également pour vous une documentation interactive, très
facilement intégrable dans une app react. Pour cela, il vous suffit d'importer
le composant dédié, et passer l'`engine` à afficher dans les props.

```jsx
import { Documentation } from 'publicodes'

function MonApp() {
    return (
        <ReactRouter>
            <Documentation
                engine={engine}
                documentationPath={'/documentation'}
            />
            {/* Composants de l'app */}
        </ReactRouter>
    )
}
```

Vous pourrez ensuite faire un lien vers la documentation avec le composant
`RuleLink`.

```jsx
import { RuleLink } from 'publicodes'

function MesDépenses() {
    return (
        <p>
            Accéder aux{' '}
            <RuleLink
                dottedName={'dépenses primeur'}
                engine={engine}
                documentationPath={'/documentation'}
            />
        </p>
    )
}
```

> Note : ces composants n'ont pas vocation à rester dans la bibliothèque coeur,
> et seront prochainement disponible dans un paquet séparé, ce afin de ne pas
> avoir `react` dans les dépendances de publicodes.
