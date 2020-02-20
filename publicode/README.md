# Publicode

Publicode est un langage déclaratif pour encoder les algorithmes d'intérêt
public. Il permet de réaliser des calculs généraux tout en fournissant une
explication permettant de comprendre et de documenter ces calculs.

Publicode est adapté pour modéliser des domaines métiers complexes pouvant être
décomposés en règles élémentaires simples (comme la législation socio-fiscale,
un bilan carbone, un estimateur de rendement locatif, etc.). Il permet de
générer facilement des simulateurs web interactifs où l'on peut affiner
progressivement le résultat affiché, et explorer une documentation du calcul.

## Formule basiques

La syntaxe de Publicode est basée sur le langage
[Yaml](https://en.wikipedia.org/wiki/YAML). Un fichier Publicode contient une
liste de règles identifiées par leur nom et possédant une formule de calcul :

```yaml
prix d'un repas:
  formule: 10
```

Une formule de calcul peut référencer d'autres variables. Dans l'exemple suivant
la règle `prix total` aura pour valeur 50 (= 5 \* 10)

```yaml
prix d'un repas:
  formule: 10

prix total:
  formule: 5 * prix d'un repas
```

Il s'agit d'un langage déclaratif : comme dans une formule d'un tableur le `prix total` sera recalculé automatiquement si le prix d'un repas change. L'ordre de
définition des règles n'a pas d'importance.

## Unités

Pour fiabiliser les calculs et faciliter leur compréhension, on peut préciser
l'unité des valeurs littérales :

```yaml
prix d'un repas:
  formule: 10 €/repas

nombre de repas:
  formule: 5 repas

prix total:
  formule: nombre de repas * prix d'un repas
```

Le calcul est inchangé mais on a indiqué que le "prix d'un repas" s'exprime en
`€/repas` et que le "nombre de repas" est un nombre de `repas`. L'unité du prix
total est inférée automatiquement comme étant en `€`. (`€/repas` \* `repas` =
`€`) Ce système d'unité permet de typer les formules de calcul et de rejeter
automatiquement des formules incohérentes :

```yaml
prix d'un repas:
  formule: 10 €/repas

nombre de repas:
  formule: 5 repas

frais de réservation:
  formule: 1 €/repas

prix total:
  formule: nombre de repas * prix d'un repas + frais de réservation
# Erreur:
# La formule de "prix total" est invalide.
```

Dans l'exemple ci-dessus Publicode détecte une erreur car les termes de
l'addition ont des unités incompatibles : d'un côté on a des `€` et de l'autre
des `€/repas`. Comme dans les formules de Physique, cette incohérence d'unité
témoigne d'une erreur de logique. Ici une manière de corriger l'erreur peut être
de factoriser la variable "nombre de repas" dans la formule du "prix total".

```yaml
prix total:
  formule: nombre de repas * (prix d'un repas + frais de réservation)
```

> **Attention:** Il ne faut pas insérer d'espace autour de la barre oblique dans
> les unités, l'unité ~`€ / mois`~ doit être notée `€/mois`

## Titre, description et références

Plusieurs propriétés permettent de documenter les règles et sont utilisées dans
les pages d'explications générées automatiquement :

- le **titre**, qui s'affiche en haut de la page de documentation. Par défaut on
  utilise le nom de la règle, mais l'attribut `titre` permet de choisir un titre
  plus approprié ;
- la **description** qui peut être rédigée en Markdown et est généralement
  affichée comme paragraphe d'introduction sur la page. On utilise le caractère `>`
  pour indiquer au parseur Yaml que la description utilise du Markdown ;
- les **références** généralement affichées en bas de page et qui sont
  constituées d'une liste de liens avec une description.

```yaml
ticket resto:
  titre: Prise en charge des titres-restaurants
  formule: 4 €/repas
  description: >
    L'employeur peut remettre des titres restaurants sous plusieurs formats:
    - ticket *papier*
    - carte à *puce*
    - appli *mobile*
  références:
    Fiche service public: https://www.service-public.fr/professionnels-entreprises/vosdroits/F21059
    Fiche Urssaf: https://www.urssaf.fr/portail/home/taux-et-baremes/frais-professionnels/les-titres-restaurant.html
```

## Espaces de noms

Les espaces de noms sont utiles pour organiser un grand nombre de règles. On
utilise le `.` pour définir la hiérarchie des noms.

```yaml
prime de vacances:
  formule: taux * 1000€

prime de vacances . taux:
  formule: 6%
```

Ici la variable `taux` est dans l'espace de nom `prime de vacances` et c'est
elle qui est référencée dans la formule de calcul. On peut avoir une autre
variable `taux` dans un autre espace de nom.

## Mécanismes

Les règles de calcul élémentaires sont extraites dans des "mécanismes" qui
permettent de partager la logique de calcul et de générer une page d'explication
spécifique par mécanisme. Par exemple on a un mécanisme `barème`:

```yaml
impôt sur le revenu:
  formule:
    barème:
      assiette: revenu imposable
      tranches:
        - taux: 0%
          plafond: 9807
        - taux: 14%
          plafond: 27086
        - taux: 30%
          plafond: 72617
        - taux: 41%
          plafond: 153783
        - taux: 45%
```

La syntaxe hiérarchique de Yaml permet d'imbriquer les mécanismes :

```yaml
prime:
  formule:
    somme:
      - fixe
      - multiplication:
          assiette: fixe
          taux: taux du bonus

prime . fixe:
  formule: 1000€

prime . taux du bonus:
  formule: 20%
```

## Applicabilité

On peut définir des conditions d'applicabilité des règles :

```yaml
ancienneté:
  formule: aujourd'hui - date de début

prime de vacances:
  applicable si: ancienneté > 1 an
  formule: 200€
```

Ici si l'ancienneté est inférieure à un an la prime de vacances ne sera pas
applicable. Les variables non applicables sont ignorées au niveau des mécanismes
(par exemple le mécanisme `somme` comptera une prime non applicable comme valant
zéro).

## Remplacement

Certaines règles ne s'appliquent parfois que dans quelques situations
particulières et modifier la définition des règles générales pour prendre en
compte ces particularismes pose des problème de maintenabilité de la base de
règle.

Publicode dispose d'un mécanisme de remplacement qui permet d'amender n'importe
quelle règle existante sans avoir besoin de la modifier :

```yaml
frais de repas:
  formule: 5 €/repas

convention collective:

convention collective . hôtels cafés restaurants:
  applicable si: convention collective = 'HCR'
  remplace:
    - règle: frais de repas
      par: 6 €/repas
```

## Évaluation

Le ticket
https://github.com/betagouv/mon-entreprise/issues/796#issuecomment-569115296
détaille le fonctionnement de l'évaluation d'un fichier Publicode.
