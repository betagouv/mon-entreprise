Prenons deux variables, simplifiées, du système.

La première

```yaml
Variable: motif CDD
formule:
  une possibilité:
    - motif B
    - motif Z
    - motif H
```

La deuxième

```yaml
Variable: CIF CDD
formule:
  multiplication:
    assiette: salaire brut
    taux: 29%
```

Voilà ce qu'on peut faire avec ces informations.

### Contraindre la saisie

Si tu veux renseigner directement la valeur de cette variable,

1. je contraint ton entrée à 3 possibilités (et tu ne peux en choisir qu'une, mais c'est un autre sujet).
2. implicitement, je contraint ton entrée à une valeur compatible avec le mécanisme multiplication. On pourrait même pousser jusqu'à vérifier que la valeur est compatible avec le domaine qu'autorise la multiplication (par exemple si on sait que l'assiette est toujours positive).

### Calculer la valeur

Si tu n'as pas à disposition la valeur de cette variable,

1 et 2. le moteur peut utiliser la formule pour la calculer, _et_ s'il lui manque la valeur des dépendances (ex. pour 1. motif B, Z = `non` mais H = `null` donc inconnue; pour 2. salaire brut est `null`), il proposera un formulaire pour la récupérer.


### Demander les valleurs manquantes

Ajoutons un mécanisme à la formule 2.

```yaml
Variable: CIF CDD
formule:
  non applicable si: motif H
  multiplication:
    assiette: salaire brut
    taux: 29%
```

Pour la calculer, il nous faut maintenant la valeur de motif H, car elle n'est pas renseignée et donc cette variable n'est pas calculable : sa valeur est `null`. Comme dit précédemment, cela nous permet de proposer un formulaire de saisie à l'utilisateur :

```
Motif H est-il vrai pour vous ?
[Oui] [Non]
```

C'est une première étape, mais elle n'est pas parfaite : étant donné que `motif H` appartient à une liste de possibilités exclusives dans la variable `Motif CDD`, peut-être qu'il serait préféreable de poser cette question :


```
Quel est votre motif ?
[Motif B] [Motif Z] [Motif H]
```

Le moteur doit pour cela vérifier si motif H intervient dans un mécanisme de type `une possibilité` pour construire son formulaire de saisie.


### Et si `motif CDD` est une liste de possibilités mais avec des catégories ?

Rapprochons-nous encore de la réalité. La formule de `motif CDD` ressemble en fait plutôt à cela :

```yaml
Variable: motif CDD
formule:
  une possibilité:
  - motif classique
  - motif contrat aidé
  - motif complément formation
  - motif issue d'apprentissage
```

Chaque élément peut alors être lui-même une liste de possibilités,

```yaml
Variable: motif classique
formule:
  une possibilité:
    - motif remplacement
    - motif accroissement d'activité
    - motif saisonnier
```
ou une variable sans formule, booléenne, avec une description permetant d'indiquer à l'utilisateur comment y répondre (parce que c'est une feuille, ou parce qu'on n'a pas eu le temps de définir sa formule...) :

```yaml
Variable: motif issue d'apprentissage
description: |
  A l'issue d'un contrat d'apprentissage, un contrat de travail à durée déterminée peut être conclu lorsque l'apprenti doit satisfaire aux obligations du service national dans un délai de moins d'un an après l'expiration du contrat d'apprentissage.
```

Les formules d'autres variables, par exemple `indemnité fin de contrat` ou `CID CDD` peuvent alors dépendre des éléments de cette liste de possibilités imbriquée :

```yaml
formule:
  non applicable si:
    une de ces conditions:
      - motif saisonnier
      - motif contrat aidé # on cite une catégorie de motifs, mais qui est une variable intéressante en soi
```


```yaml
Variable: motif
attache: Salariat . CDD
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

On peut alors utiliser ces variables dans les formules ainsi:

```yaml
Variable: CIF
attache: Salariat . CDD
formule:
  non applicable si:
    une de ces conditions:
      - motif . usage
      - motif . contrat aidé # on cite une catégorie de motifs, qui est quand même une variable exploitable
```

- L'avantage de cette modélisation, c'est que l'on évite, pour chaque descente de niveau de l'imbrication, de répéter le _chemin_ de la variable : on factorise de l'information.
- Le désavantage, c'est que cela nuit à la lisibilité de la formule `motif` : on perd complètement la vue très synthétique de départ :

```yaml
Variable: motif
une possibilité parmi:
  - classique
  - contrat aidé
  - complément formation
  - issue d'apprentissage
```

Et finalement, contrairement au mécanisme de `composantes` utilisé dans le corps des `Cotisations`, l'information factorisée n'est pas très conséquent : ce n'est que le chemin.

Une autre modélisation consiste donc à éclater les variables. Par exemple :

```yaml
Salariat . CDD . motif : issue d'apprentissage
description: |
  A l'issue d'un contrat d'apprentissage, un contrat de travail à durée déterminée peut être conclu lorsque l'apprenti doit satisfaire aux obligations du service national dans un délai de moins d'un an après l'expiration du contrat d'apprentissage.
```

> On pourrait même définir le chemin commun en en-tête du fichier où est stocké la variable... mais cela nous rendrait trop dépendant des fichiers, superflus quand l'édition se fera dans une interface Web.


# TODO sauf que ça remet en cause notre format :

```yaml
Cotisation: CIF
attributs:
  dû par: employeur
  branche: yayaya lorde
```

`Cotisation` / `Variable` / `Indemnité` ?

Si le CIF est une Cotisation rattachée à Salariat . CDD,
si l'indemnité de fin de contrat est une Indemnité rattachée à Salariat . CDD,
fillon est une Réduction attachée à Salariat,
alors qu'est-ce que issue d'apprentissage ?


Voir le fichier 'la cotisation est une entité'

Mais ne faudrait-il pas réserver les qualifications de type Cotisation aux règles ?


#TODO Cas où motif H appartient à plusieurs variables de possibilités.

Par exemple, si on considère que parmi les motifs du CDD, il y a des contrats aidés, et que ces contrats aidés peuvent être utilisés à d'autre endroits. C'est flou pour l'instant.
