# Api ![béta](https://img.shields.io/badge/-beta-blue)

Publicode est distribué sous la forme d'une librairie
[Node.js](https://nodejs.org/fr/) permettant de compiler un jeu de règles
publicodes et de l'évaluer dans une situation donnée.

## Installation

Le paquet est disponble sur NPM :

```sh
$ npm install publicodes
```

Il est aussi possible d'utiliser la librairie directement dans le navigateur :

```html
<script src="https://publi.codes/publicode.js"></script>
```

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

La variable `engine` permet en ensuite de calculer la valeur d'une règle avec la
méthode `evaluate`.

```js
console.log(engine.evaluate('dépenses primeur'))
```

La valeur du nœud est disponible dans l'attribut `nodeValue`, son
unité est disponible dans l'attribut `unit`. Mais pour un formattage sans
effort, on préfèrera utiliser la fonction `formatValue`

```js
import Engine, { formatValue } from 'publicodes'
const dépenses = engine.evaluate('dépenses primeur')
console.log(`j'ai dépensé ${formatValue(dépenses)} chez le primeur`)
```

La méthode `setSituation` permet de forcer la valeur d'une liste de règle. Elle
utile pour pour présier les paramètres spécifiques à une simulation.

```js
// Ici on change le prix des avocats
engine.setSituation({
	'prix . avocat': '3€/avocat'
})
```

La valeur de `dépenses primeur` se base maintenant sur un avocat à 3€ :

```js
// On ré-évalue la règle dans la nouvelle situation
console.log(
	`Nouveau prix ! ${formatValue(engine.evaluate('dépenses primeur'))}`
)
```

### Évaluation d'expressions

La fonction `evaluate` permet d'évaluer des expressions publicode complètes

```js
// On va au marché une fois par semaine, amortissons la dépense sur 7 jours
engine.evaluate('dépenses primeur / 7 jours')
```

### Conversion d'unité

Publicode permet de réaliser des conversions d'unités. Pour celà il faut
indiquer l'unité désirée comme paramètre à la méthode `evaluate` :

```js
// on va au marché une fois par semaine en moyenne, combien dépense-t-on par mois ?
engine.evaluate('dépenses primeurs / 7 jours', { unit: '€/mois' })
```

[➡ en savoir plus sur les unités](https://publi.codes/#unités)

### Variables manquantes

Publicode calcule automatiquement les dépendances de chaque règle. Si une la
valeur d'une dépendance est manquante et ne permet pas de faire le calcul elle
apparaîtra dans l'attribut `missingVariables`

```js
const engine = new Engine(`
x: y + 5

y:
`)

console.log(engine.evaluate('x').missingVariables)
```

Cette information est utile pour intégrer publicode à votre application.

Il est aussi possible d'utiliser des valeurs par défaut. Dans ce cas la règle
sera calculée avec la valeur par défaut de sa dépendance, mais cette dernière
apparaîtra tout de même dans les `missingVariables`. Cette fonctionnalité est
utile pour réaliser des simulateurs où l'on veut proposer un résultat sans
attendre que l'utilisateur n'ait répondu à l'intégralité des questions tout en
utilisant la liste des variables manquantes pour déterminer les questions
restant à poser.

Les variables manquantes sont calculées lors de l'évaluation. Si une variable
apparaît dans la formule de calcul d'une règle elle ne sera rapportée que si
elle est effectivement nécessaire au calcul. Si elle est présente dans une
portion non active de l'évaluation (par exemple dans un bloc condition non
actif, ou la tranche d'un barème non actif) elle sera filtrée et n'apparaîtra
pas dans les `missingVariables`

## Référence

#### _new_ Engine(rules)

Crée un moteur d'évaluation avec les règles publicodes données en argument.

**Arguments**

- `rules` : les règles publicodes utilisée. Ces dernières peuvent-être sous la
  forme d'une chaine de caractère `yaml` publicodes, ou d'un object javascript
  correspondant.

**Retourne**
Un moteur d'évaluation qui expose les fonctions suivantes :

- setSituation
- evaluate
- getParsedRules

#### _method_ engine.setSituation(situation)

Permet de spécifier une situation en entrée. Toutes les prochaines évaluations
seront effectuées en se basant sur ces valeurs plutôt que les valeurs présentes
dans la base de règle.

C'est le point d'entrée principal pour adapter les calculs de règles générales à
une situation particulière. La situation est gardée en mémoire, et chaque appel
à `setSituation` remplace la situation précédente. Le moteur
contient donc un _état interne_. Cela permet d'obtenir de meilleure performance,
avec une gestion plus fine du cache de calcul. En revanche, cela peut-être une
source de bug si l'état interne est modifié lors d'effet de bord non prévus.

**Arguments**

- `situation` : un objet javascript qui associe le nom complet d'une règle à sa
  valeur dans la situation. Cette valeur peut être de type `number`, ou
  `string`. Dans ce dernier cas, elle sera évaluée par le moteur. Cela permet
  de spécifier des nombre avec unité, des expressions, ou encore des références
  vers d'autres règles.

**Retourne**

L'objet engine (`this`) sur lequel la fonction a été appelée, afin de pouvoir
utiliser une écriture chaînée (`engine.setSituation(situation).evaluate()`)

#### _method_ engine.evaluate(expression, \[options])

Évalue l'expression dans le contexte du moteur (règle et situation).

Pour des raisons de performance, les résultats intermédiaires sont enregistrés
dans un cache. Par conséquent, les prochains appels seront plus rapides.

**Arguments**

- `expression`: la formule à évaluer (type `string`). Cela peut-être une
  référence vers une règle, une expression arithmétique, tout ce que la
  grammaire publicode permet.
- `options`: un objet de configuration pour l'évaluation

  - `unit`: spécifie l'unité dans laquelle le résultat doit être retourné.
    Si la valeur retournée par le calcul est un nombre, ce dernier sera converti dans l'unité demandée. Ainsi `evaluate('prix', {unit: '€'})` équivaut à `evaluate('prix [€]')`. Une erreur est levée si l'unité n'est pas compatible avec la formule.
  - `useDefaultValues` (par défaut `true`): option pour forcer l'utilisation des valeurs par défaut des règles.
    Si sa valeur est à `false` et qu'il manque des valeurs dans la situation pour que le calcul soit effectué, ces dernières seront remontée dans les `missingsVariables` de l'objet retourné, et la valeur sera `null`.

**Retourne**
Un objet javascript de type `EvaluatedNode` contenant la valeur calculée.

> **Attention !** Il est déconseillé d'utiliser directement les valeurs présentes
> dans l'objet retourné, étant donné que leur forme va très probablement changer
> au cours des prochaines versions du moteur.
> Utilisez la fonction `formatNode(evaluationResult)` autant que possible pour
> afficher la valeur retournée.

- `missingVariables`: contient les valeur manquante lorsque `useDefaultValues`
  est mis à `false`.
- `nodeValue`: la valeur calculée
- `isApplicable`: si l'expression évaluée est une référence à une règle, alors
  ce booléen indique si la règle est applicable ou non

#### _function_ formatValue(evaluatedNode, \[options\])

Formate la valeur evaluée.

**Arguments**

- `evaluatedNode` : l'objet retourné lors de l'appel à la fonction
  d'évaluation du moteur `evaluate(expression)`
- `options` : configuration pour le formatage

  - `language`: le langage utilisé pour le formatage (par défaut `fr`)
  - `precision`: le nombre de chiffre après la virgule pour le formatage des nombres (par défaut `2`)
  - `displayedUnit`: l'unité à afficher pour le formatage des nombres. Outrepasse l'unité définie dans le calcul (on peut donc forcer l'unité affichée à une autre que celle retournée par le calcul, même si elle ne sont pas compatibles)

**Retourne**

La chaîne de caractère correspondant à la valeur bien formatée.
