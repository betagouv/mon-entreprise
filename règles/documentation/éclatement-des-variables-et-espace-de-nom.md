Supposons qu'il y ait deux variables dans notre système.

```yaml
Variable: motif CDD
valeur:
  une possibilité:
    - motif B
    - motif Z
    - motif H
```

```yaml
Variable: CIF CDD
valeur:
  multiplication:
    assiette: salaire brut
    taux: 29%
```

Rapprochons-nous encore de la réalité. La formule de `motif CDD` est en fait une imbrication de possibilités :

```yaml
motif CDD:
  - motif classique
    - motif remplacement
    - motif accroissement d'activité
    - motif saisonnier
  - motif contrat aidé
  - motif complément formation
  - motif issue d'apprentissage
```

Les formules d'autres variables, par exemple `indemnité fin de contrat` ou `CID CDD` peuvent alors dépendre des éléments de cette liste de possibilités imbriquées :

```yaml
formule:
  non applicable si:
    une de ces conditions:
      - motif saisonnier
      - motif contrat aidé # on cite une catégorie de motifs, mais qui est une variable utilisable en soi
```

Alors on pourrait représenter la variable `motif CDD` ainsi :

```yaml
Variable: motif CDD
formule:
  une possibilité parmi:
  - Variable: classique
    formule:
      une possibilité parmi:
        - Variable: remplacement
          titre: Contrat de remplacement

        - Variable: usage
          titre: Contrat d'usage
          # formule...
        - Variable: accroissement d'activité
          titre: Motif accroissement temporaire d'activité
  - Variable: contrat aidé
    formule:
      une possibilité parmi:
        - A
        - B
  - Variable: complément formation
    description: le motif complément formation c'est...
  - Variable: issue d'apprentissage
    description: le motif d'issue d'apprentissage c'est ...
```

- L'avantage de cette modélisation, c'est que tout est au même endroit; on évite, pour chaque descente de niveau de l'imbrication, de répéter le _chemin_ de la variable : on factorise de l'information.
- Le problème, c'est que cela nuit vraiment à la lisibilité de la formule `motif` : on perd complètement la vue très synthétique de notre pseudo modèle de départ :

```yaml
Variable: motif
une possibilité parmi:
  - classique
  - contrat aidé
  - complément formation
  - issue d'apprentissage
```

Et finalement, contrairement au mécanisme de `composantes` utilisé dans le corps des `Cotisations`, l'information factorisée n'est pas très conséquent : ce n'est que le chemin.

Une autre modélisation, que l'on retient, consiste donc à éclater les variables en utilisant un système d'**espace de nom**:

```yaml
Salariat . CDD . motif: classique
# espace de nom : nom de la variable
formule:
  une possibilité:
    - remplacement
    - accroissement d'activité
    - saisonnier
```

```yaml
Salariat . CDD . motif : issue d'apprentissage
description: |
  A l'issue d'un contrat d'apprentissage, un contrat de travail à durée déterminée peut être conclu lorsque l'apprenti doit satisfaire aux obligations du service national dans un délai de moins d'un an après l'expiration du contrat d'apprentissage.
```


On pourrait même définir l'espace de nom commun `Salariat . CDD . motif` en en-tête du fichier où est stocké la variable... mais cela nous rendrait trop dépendant du système de fichiers, qui deviendront superflus quand l'édition se fera dans une interface Web.

Pour beaucoup de variables au nom spécifique, il n'est pas souhaitable d'utiliser des espaces de nom, pour ne pas alourdir le code.

> Par exemple, on pourrait définir la variable CDD comme `activité . contrat salarié . CDD`. Mais CDD est un terme non ambigue dans le contexte français.

> À l'inverse, `motif` ou `effectif` sont trop spécifiques pour être laissés dans l'espace de nom global. Quand une variable contiendra `motif` dans son sous-espace de nom, c'est celle-ci qui sera utilisée plutôt que celle d'un autre espace, si elle existe.

Pas de panique, une variable globale pourra quand même être rattachée à quelque chose ! Même si elle n'est pas définie dans un espace de noms, `CDD` sera quand même utilisée dans `contrat salarié` commune une des valeurs de `type de contrat` (ou mieux à l'avenir !). Le moteur se chargera de retrouver son attache.


Quand on créée par exemple la variable `CDD: motif`, donc la variable motif dans l'espace de nom CDD, et qu'on continue avec une variable `CDD . motif . classique` on fait deux choses :
- si la variable `motif` a une propriété `valeur`, on créée un espace pour pour stocker la valeur de cette variable
- on créée aussi un espace de nom associé à cette variable, qui va héberger des variables qui y sont liées et vont souvent intervenir dans la formule de la valeur de `motif`

>  la note "typer les variables" peut être lue à la suite de celle-ci.
