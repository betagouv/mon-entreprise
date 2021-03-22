# Principes de base

La syntaxe de Publicode est basée sur le langage
[Yaml](https://en.wikipedia.org/wiki/YAML).

Un fichier Publicode contient une liste de _règles_ identifiées par leur _nom_ et
possédant une _valeur_ :

```yaml
prix d'un repas: 10 €
```

Une formule de calcul peut faire _référence_ à d'autres règles.
Dans l'exemple suivant la règle `prix total` aura pour valeur 50 (= 5 \* 10)

```yaml
prix d'un repas: 10 €
prix total: 5 * prix d'un repas
```

Il s'agit d'un langage déclaratif : comme dans une formule d'un tableur le `prix total` sera recalculé automatiquement si le prix d'un repas change. L'ordre de
définition des règles n'a pas d'importance.

## Unités

Pour fiabiliser les calculs et faciliter leur compréhension, on peut préciser
l'unité des valeurs littérales :

```yaml
prix d'un repas: 10 €/repas
nombre de repas: 5 repas

prix total: nombre de repas * prix d'un repas
```

Le calcul est inchangé mais on a indiqué que le "prix d'un repas" s'exprime en
`€/repas` et que le "nombre de repas" est un nombre de `repas`. L'unité du prix
total est inférée automatiquement comme étant en `€`. (`€/repas` \* `repas` =
`€`)

Ce système d'unité permet de typer les formules de calcul et de rejeter
automatiquement des formules incohérentes :

```yaml
prix d'un repas: 10 €/repas
nombre de repas: 5 repas
frais de réservation: 1 €/repas

prix total: nombre de repas * prix d'un repas + frais de réservation
# Erreur:
# La formule de "prix total" est invalide.
```

Dans l'exemple ci-dessus, Publicode détecte une erreur car les termes de
l'addition ont des unités incompatibles : d'un côté on a des `€` et de l'autre
des `€/repas`.

Cette incohérence d'unité témoigne d'une erreur de logique. Ici, une manière de corriger l'erreur peut être de factoriser la variable "nombre de repas" dans la formule du "prix total".

```yaml
prix total: nombre de repas * (prix d'un repas + frais de réservation)
```

> **Attention :** Il ne faut pas insérer d'espace autour de la barre oblique dans
> les unités, l'unité `€ / mois` doit être notée `€/mois`.

Publicode convertit automatiquement les unités si besoin.

```yaml
salaire: 1500 €/mois
prime faible salaire applicable: salaire < 20 k€/an
```

> NB : On peut forcer la conversion des unités via le [mécanisme `unité`](/mécanismes#unité).

**Types de base disponibles pour la conversion :**

-   `jour` / `mois` / `an`
-   `€` / `k€`

## Mécanismes

Il existe une autre manière d'écrire des formules de calcul : les mécanismes. Au lieu de définir la formule sur une ligne, celle-ci prend la forme d'un objet sur plusieurs lignes.

Par exemple, la formule suivante :

```yaml
prix total: 5 repas * prix d'un repas
```

peut également s'écrire en utilisant le mécanisme [`produit`](/mécanismes/produit) :

```yaml
prix total:
    produit:
        assiette: prix d'un repas
        facteur: 5 repas
```

Un des avantages de cette écriture est que la syntaxe hiérarchique de Yaml permet d'imbriquer les mécanismes :

```yaml
prix TTC:
    somme:
        - prix d'un repas
        - produit:
              assiette: prix d'un repas
              taux: TVA
```

### Mécanismes chaînés

Certains mécanismes peuvent apparaître au même niveau d'indentation. Dans ce cas, le moteur appliquera les transformations dans un ordre préétabli.

```yaml
remboursement repas:
    valeur: nombre de repas * remboursement forfaitaire
    plafond: 500 €/an
    unité: €/an
    arrondi: oui
```

> **[Pour en savoir plus sur les mécanismes](./mécanismes)**

## Pages d'explications

L'explication des règles est un des objectifs fondamentaux de Publicodes.

Chaque règle se voit générer automatiquement une page explicative
correspondante dans le front-end, contenant une information facilement digeste
mise en regard des calculs eux-mêmes.

Plusieurs propriétés sont reprises dans ces pages d'explications :

-   le **titre**, qui s'affiche en haut de la page. Par défaut on utilise le nom
    de la règle, mais la propriété `titre` permet de choisir un titre plus
    approprié ;
-   la **description** qui peut être rédigée en Markdown et est généralement
    affichée comme paragraphe d'introduction sur la page. On utilise le caractère
    `|` pour indiquer au parseur Yaml que la description est sur plusieurs lignes ;
-   les **références** externes (documentation utile) affichées en
    bas de page et qui sont constituées d'une liste de liens avec une description.

```yaml
ticket resto:
    titre: Prise en charge des titres-restaurants
    formule: 4 €/repas
    description: |
        L'employeur peut remettre des titres restaurants sous plusieurs formats:
        - ticket *papier*
        - carte à *puce*
        - appli *mobile*
    références:
        Fiche service public: https://www.service-public.fr/professionnels-entreprises/vosdroits/F21059
        Fiche Urssaf: https://www.urssaf.fr/portail/home/taux-et-baremes/frais-professionnels/les-titres-restaurant.html
```

## Conditions booléennes

Publicode supporte des opérateurs booléens basiques.

```yaml
âge: 17 ans
mineur émancipé: non
nationalité française: oui

droit de vote:
    toutes ces conditions:
        - nationalité française
        - une de ces conditions:
              - âge >= 18 ans
              - mineur émancipé
```

Il est possible de faire des branchements conditionnels via le mécanisme [`variations`](/mécansime/variations)

## Applicabilité

On peut définir des conditions d'applicabilité pour des valeurs :

```yaml
date de début: 12/02/2020

ancienneté en fin d'année:
    durée:
        depuis: date de début
        jusqu'à: 31/12/2020

prime de vacances:
    applicable si: ancienneté en fin d'année > 1 an
    valeur: 200€
```

Ici, si l'ancienneté est inférieure à un an, alors la prime de vacances ne sera pas
_applicable_. Les variables _non applicables_ sont égales à `non`. Elles sont ignorées au niveau des mécanismes numériques (par exemple le mécanisme `somme` comptera une prime non applicable
comme valant zéro, voir la page spécifique aux mécanismes).

La syntaxe suivante est également valable :

```yaml
assimilé salarié:
    valeur: oui
    rend non applicable: convention collective
```

## Espaces de noms

Les espaces de noms sont utiles pour organiser un grand nombre de règles. On
utilise le `.` pour exprimer la hiérarchie des noms.

```yaml
prime de vacances:
    formule: taux * 1000 €

prime de vacances . taux:
    formule: 6%
```

Ici, `prime de vacances` est à la fois une règle et un espace de noms. La variable
`taux` est définie dans cet espace de noms et c'est elle qui est référencée dans
la formule de calcul de la règle `prime de vacances`.

La règle `prime de vacances` est elle-même définie dans l'espace de nom racine.

On pourrait avoir une autre variable `taux` dans un espace de nom
différent, sans que cela entre en conflit :

```yaml
# Ceci n'entre pas dans le calcul de `prime de vacances` définie plus haut
autre prime . taux:
    formule: 19%
```

On dit que la formule de la règle `prime de vacances` fait référence à la
règle `prime de vacances . taux` via le nom raccourci `taux`.

Pour faire référence à une règle hors de son espace de nom, on peut écrire le
nom complet de cette règle:

```yaml
prime de vacances v2:
    formule: autre prime . taux * 1000 €
```

Dans le cas d'espaces de noms imbriqués (à plus qu'un étage), le nom inscrit
dans une règle donnée est recherché de plus en plus haut dans la hiérarchie des
espaces de nom jusqu'à la racine.

```yaml
contrat salarié . rémunération . primes . prime de vacances:
    formule: taux générique * 1000 €

contrat salarié . rémunération . taux générique:
    formule: 10%
```

Ici `contrat salarié . rémunération . primes . prime de vacances` va faire
référence à `contrat salarié . rémunération . taux générique` trouvé deux
espaces de noms plus haut, et va donc valoir `100 €`.

### Désactivation de branche

Il est possible de désactiver l'ensemble des règles définies dans un espace de nom.

Toutes les règles possèdent une dépendance implicite à leur parent. Si ce dernier est égal à `non` alors leur valeur est également `non`.

```yaml
CDD: non
CDD . indemnité de précarité: 10% * 1500€/mois * 6 mois

indemnités:
    somme:
        - 100 €
        - CDD . indemnité de précarité # non
```

## Remplacement

Certaines règles ne s'appliquent parfois que dans quelques situations
particulières et modifier la définition des règles générales pour prendre en
compte ces particularités pose des problèmes de maintenabilité de la base de
règles.

Publicode dispose d'un mécanisme de remplacement qui permet d'amender n'importe
quelle règle existante sans avoir besoin de la modifier :

```yaml
frais de repas: 5 €/repas

convention hôtels cafés restaurants: oui
convention hôtels cafés restaurants . frais de repas:
    remplace: frais de repas
    valeur: 6 €/repas

montant repas mensuels: 20 repas * frais de repas
```

On peut également choisir de remplacer dans un contexte donné :

```yaml
temps de préparation: 20 min
temps de cuisson: 20 min

robot de cuisine:
    remplace:
        - règle: temps de préparation
          sauf dans: temps original
          par: 10 min
    valeur: oui

temps original:
    formule: temps de préparation + temps de cuisson # résultat : 40 min

temps modifié:
    formule: temps de préparation + temps de cuisson # résultat : 30 min
```

> [En savoir plus sur les remplacements](/manuel#remplacement)

## Définition de règle imbriquée

Si le mécanisme de remplacement permet de faire des substitutions de règles
complètes, il est parfois utile de ne modifier qu'un seul paramètre d'une règle
existante, par exemple modifier le facteur d'une multiplication tout en
conservant le reste de sa définition inchangée.

Une première manière de faire consiste à extraire le paramètre en question dans
une règle indépendante, le rendant ainsi accessible et modifiable depuis
l'extérieur :

```yaml
prime:
    formule:
        multiplication:
            assiette: 1000€
            taux: taux

prime . taux:
    formule: 5%

super-prime:
    remplace: prime . taux
    formule: 10%
```

Ce code fonctionne mais il nous oblige a créer une règle `prime . taux` qui
n'est pas pertinente en tant qu'entité autonome (avec sa propre page de
documentation, etc.), uniquement pour pouvoir la modifier avec un `remplace`. On
a aussi introduit une indirection dans la définition de la prime en remplaçant
une ligne explicite `taux: 5%` par une référence vers une règle tierce
`taux: taux`, qui est loin d'être aussi claire.

Pour ce cas d'usage il est possible de définir une _règle imbriquée_.
On garde la définition de la prime inchangée et on annote la valeur à laquelle
on veut accéder depuis l'extérieur avec le mot clé `nom` :

```yaml
prime:
    formule:
        multiplication:
            assiette: 1000€
            taux:
                nom: taux
                valeur: 5%

super-prime:
    remplace: prime . taux
    formule: 10%
```

## Évaluation

Lors de l'évaluation, les variables dont les valeurs ne sont pas renseignées sont remontées afin que ces dernières puissent être complétées par l'utilisateur (dans le cas d'un simulateur par exemple).

Il est possible de donner une valeur par défaut. Les variables manquantes seront quand même remontées, et le moteur utilisera la valeur par défaut pour le calcul.

```yaml
durée:
    par défaut: 2 mois

salaire brut:
    par défaut: 1500 €/mois

indemnité de CDD: 10 % * salaire brut * durée
```
