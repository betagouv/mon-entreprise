## Référence

#### _new_ Engine(rules)

Crée un moteur d'évaluation avec les règles publicodes données en argument.

**Arguments**

-   `rules` : les règles publicodes utilisée. Ces dernières peuvent-être sous la
    forme d'une chaine de caractère `yaml` publicodes, ou d'un object javascript
    correspondant.

**Retourne**
Un moteur d'évaluation qui expose les fonctions suivantes :

-   setSituation
-   evaluate
-   getParsedRules

#### _method_ engine.setSituation(situation)

Permet de spécifier une situation en entrée. Toutes les prochaines évaluations
seront effectuées en se basant sur ces valeurs plutôt que les valeurs présentes
dans la base de règle.

C'est le point d'entrée principal pour adapter les calculs de règles générales à
une situation particulière. La situation est gardée en mémoire, et chaque appel
à `setSituation` remplace la situation précédente. Le moteur
contient donc un _état interne_. Cela permet d'obtenir de meilleure performance,
avec une gestion plus fine du cache de calcul. En revanche, il faut prêter une
grande attention à la bonne gestion de cet état interne.

**Arguments**

-   `situation` : un objet javascript qui associe le nom complet d'une règle à sa
    valeur dans la situation. Cette valeur peut être de type `number`, ou
    `string`. Dans ce dernier cas, elle sera évaluée par le moteur. Cela permet
    de spécifier des nombre avec unité, des expressions, ou encore des références
    vers d'autres règles.

**Retourne**

L'objet engine (`this`) sur lequel la fonction a été appelée, afin de pouvoir
utiliser une écriture chaînée (`engine.setSituation(situation).evaluate()`).

#### _method_ engine.evaluate(expression, \[options])

Évalue l'expression dans le contexte du moteur (règle et situation).

Pour des raisons de performance, les résultats intermédiaires sont enregistrés
dans un cache. Par conséquent, les appels suivants seront plus rapides.

**Arguments**

-   `expression`: la formule à évaluer (type `string`). Cela peut-être une
    référence vers une règle, une expression arithmétique, tout ce que la
    grammaire publicode permet.
-   `options`: un objet de configuration pour l'évaluation
    -   `unit`: spécifie l'unité dans laquelle le résultat doit être retourné. Si la
        valeur retournée par le calcul est un nombre, ce dernier sera converti dans
        l'unité demandée. Ainsi `evaluate('prix', {unit: '€'})` équivaut à
        `evaluate('prix [€]')`. Une erreur est levée si l'unité n'est pas compatible
        avec la formule.

**Retourne**
Un objet javascript de type `EvaluatedNode` contenant la valeur calculée.

> **Attention !** Il est déconseillé d'utiliser directement les valeurs présentes
> dans l'objet retourné, étant donné que leur forme va très probablement changer
> au cours des prochaines versions du moteur.
> Utilisez la fonction `formatNode(evaluationResult)` autant que possible pour
> afficher la valeur retournée.

-   `missingVariables`: contient les règles dont la valeur est manquante dans la situation
-   `nodeValue`: la valeur calculée
-   `isApplicable`: si l'expression évaluée est une référence à une règle, alors
    ce booléen indique si la règle est applicable ou non

#### _function_ formatValue(evaluatedNode, \[options\])

Formate la valeur evaluée.

**Arguments**

-   `evaluatedNode` : l'objet retourné lors de l'appel à la fonction
    d'évaluation du moteur `evaluate(expression)`
-   `options` : configuration pour le formatage
    -   `language`: le langage utilisé pour le formatage (par défaut `fr`)
    -   `precision`: le nombre de chiffre après la virgule pour le formatage des
        nombres (par défaut `2`)
    -   `displayedUnit`: l'unité à afficher pour le formatage des nombres.
        Outrepasse l'unité définie dans le calcul (on peut donc forcer l'unité
        affichée à une autre que celle retournée par le calcul, même si elle ne sont
        pas compatibles)

**Retourne**

La chaîne de caractère correspondant à la valeur bien formatée.

### Composants react

Publicodes exporte des composants react permettant d'afficher une documentation
explorable des calculs. Cette documentation est auto-générée en s'appuyant sur
les données descriptives contenues dans les règles publicodes (description,
références, titre, note, etc.) et en affichant pour chaque règle les étapes
intermédiaires qui permettent d'aboutir au résultat affiché.

[Voir un exemple sur mon-entreprise.fr](https://mon-entreprise.fr/documentation/imp%C3%B4t/foyer-fiscal/imp%C3%B4t-sur-le-revenu/imp%C3%B4t-brut-par-part)

#### <Documentation />

Composant react permettant d'afficher une documentation explorable d'une base de
règles publicodes. Se base sur react-router pour créer une arborescence de pages
correspondant aux espaces de noms existants dans les règles.

Voir le [bac à sable](https://publi.codes/studio) pour voir le composant en
action (il est affiché sur l'écran de droite).

**Props**

-   `engine`: l'objet moteur dont on veut afficher les calculs.
-   `documentationPath` : (`string`) le chemin de base sur lequel la documentation sera
    montée. Par exemple, si c'est `/documentation` l'url de la règle `rémunération . primes` sera `/documentation/rémunération/primes`
-   `language`: le language dans lequel afficher la documentation (pour l'instant,
    seuls `fr` et `en` sont supportés).

#### <RuleLink />

Composant react permettant de faire un lien vers une page de la documentation.
Par défaut, le texte affiché est le nom de la règle.

**Props**

-   `engine`: l'objet moteur dont on veut afficher la règle.
-   `documentationPath` : (`string`) le chemin de base sur lequel la documentation est
    montée. Doit correspondre à celui précisé pour le composant `<Documentation />`
-   `dottedName`: le nom de la règle à afficher
-   `displayIcon`: affiche l'icône de la règle dans le lien (par défaut à `false`)
-   `children`: un noeud react quelconque. Par défaut, c'est le nom de la règle
    qui est utilisé.
