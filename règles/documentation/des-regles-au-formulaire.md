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

Si tu n'as pas à disposition la valeur de cette variable, le moteur peut utiliser la formule de la propriété `valeur` pour la calculer, _et_ s'il lui manque la valeur des dépendances (ex. pour 1. motif B, Z = `non` mais H = `null` donc inconnue; pour 2. salaire brut est `null`), il proposera un formulaire pour la récupérer.


### Demander les valeurs manquantes

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

C'est une première étape, mais elle n'est pas parfaite : étant donné que `motif H` appartient à une liste de possibilités exclusives dans la variable `Motif CDD`, peut-être qu'il serait préférable de poser cette question :


```
Quel est votre motif ?
[Motif B] [Motif Z] [Motif H]
```

Le moteur doit pour cela vérifier si motif H intervient dans un mécanisme de type `une possibilité` pour construire son formulaire de saisie.


> la note "éclatement des variables et espaces de noms" continue en complexifiant de modèle.
