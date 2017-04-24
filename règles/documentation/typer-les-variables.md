> On atteint dans cette note le bout actuel de la réfléxion...

Pour l'instant, on n'avait considéré seulement des versions simplifiées des variables :

```yaml
Variable: CIF CDD
valeur:
  multiplication:
    assiette: salaire brut
    taux: 29%
```

Or il y a pas mal de variables du système qui se ressembleront, et donc partageront des propriétés en commun.  

Par exemples les cotisations, qui sont des obligations de verser une fraction du salaire à des organismes de protection sociale.

```yaml
  activité . contrat salarié : AGIRC
  description: AGIRC
  références: article B-vingt-douze
  dû par: salarié
  branche: retraite
  applicable si: Contrat . statut cadre
  valeur:
    multiplication:
      assiette: ...
      taux: ...
```

On peut remarquer que certaines des propriétés de cet objet sont relativement génériques, alors que d'autres dépendent directement du fait que notre objet est une cotisation. On pourrait la réécrire ainsi :

```yaml
  activité . contrat salarié : AGIRC
  meta:
    description: AGIRC
    références: article B-vingt-douze
  cotisation:
    dû par: salarié
    branche: retraite
  valeur:
    applicable si: Contrat . statut cadre
    multiplication:
      assiette: ...
      taux: ...
```

Finalement ici, on _renseigne_ les données d'une entité de type `Cotisation`. Tout comme quand on va fournir une situation au système, en renseignant les données d'un `Salarié` (âge, expérience...) et de son `Contrat` (appelé pour l'instant `Salariat`, qui a un salaire, ...) qui le lie à son `Entreprise` (effectif, ...).

Il faudra donc dans (TODO dans le futur) définir le _schéma_ de notre entité `Cotisation`. Pourquoi ne pas réutiliser ce que l'on a fait jusqu'à présent par exemple en définissant le schéma de `CDD . mofif` ?

```yaml
- entité: cotisation

# Ici on ajoute des propriétés à l'espace de nom `cotisation`.
# Comme si on créait et peuplait un _record_ en Haskell/Ocaml, ou encore d'un type produit en maths.
- cotisation: dû par
  valeur:
    # Ici, ce serait l'équivalent des _variant types_ des ADTs d'Haskell/Ocaml, ou d'une type somme en maths.
    une possibilité:
      - salarié
      - entreprise

- cotisation . dû par: salarié
  meta:
    description: Les salariés ont l'obligation de verser des cotisations, mais c'est normalement l'employeur qui s'en charge.

# ...

- cotisation : branche
  valeur:
    une possibilité:
      - maladie
      - retraite
      - ...

```

Il est très intéressant de noter qu'ici on définit le `schéma cotisation` pour pouvoir en faire des instance avec des données respectant ce schéma (cotisation.branche=maladie, etc.)... tout comme nous avons précédemment défini le `schéma contrat salarié` pour pouvoir par la suite en faire une instance avec des données (contrat salarié . type de contrat = CDD).

<!-- TODO est-ce clair ? -->

De la même façon que le schéma cotisation, on définirait le schéma de `meta`, qui ferait lui souvent appel à des types plus élémentaires (et "terminaux"), des _strings_ (chaines de caractères).

Pour être parfait, le modèle définirait aussi le schéma de `valeur`.


```yaml

- valeur : applicable si
  type: # mécanisme ou variable de type booléen


- valeur : formule
  type:
    une possibilité: # mécanismes de type numérique
      - multiplication
      - barème
      - ...
```

A ce stade, on aurait finalement besoin d'un langage de programmation complet (par exemple introduisant un certain polymorphisme : une cotisation et une indemnité partagent des propriété !), ce qui est un but non souhaitable pour le moment. `meta` et `valeur` peuvent dans un premier temps rester dynamiques (sans type bien défini) et types par leur implémentation en Javascript.
