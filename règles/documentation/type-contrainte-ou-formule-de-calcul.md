Supposons que dans notre système, il y ait deux variables. C'est notre point de départ.

C'est un peu abstrait tout ça, mais ça permet de justifier certains choix de conception.

La première :

```yaml
Variable: motif CDD
contrainte:
  une possibilité:
    - motif B
    - motif Z
    - motif H
```

La deuxième :

```yaml
Variable: CIF CDD
formule de calcul:
  multiplication:
    assiette: salaire brut
    taux: 29%
```

# Contrainte ou formule de calcul ?

Si tu veux renseigner directement la valeur de cette variable, la propriété `contrainte` cette propriété me permet de contraindre la saisie à 3 possibilités.

A l'opposé, la variable CIF CDD a une propriété `formule de calcul` qui nous donne un algorithme de calcul utile quand tu ne peux renseigner directement la valeur de la variable.

Mais en y regardant de plus près, le fait que cette formule soit exprimée sous forme de _donnée_ (facile à _parser_, déclaratif) nous permettraient potentiellement aussi de _contraindre_ la saisie de la valeur de la variable.

> implicitement, je contraint ton entrée à une valeur compatible avec le mécanisme multiplication. On pourrait même pousser jusqu'à vérifier que la valeur est compatible avec le domaine qu'autorise la multiplication (par exemple si on sait que l'assiette est toujours positive).


Et de même, le mécanisme `une possibilité` (et une seule) nous donne l'information suivant : si l'utilisateur a saisi `motif Z = oui`, alors motif CDD = motif Z. On retrouve donc une notion d'algorithme de calcul.


La frontière est floue entre `contrainte/type` et `formule de calcul`. On va donc pour l'instant utiliser une unique propriété, `valeur`, qui rassemble ces deux usages.  


> Voir la note "des règles au formulaire"
