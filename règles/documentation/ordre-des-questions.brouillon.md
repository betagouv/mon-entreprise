Etant donné que pour des objectifs choisis (ex. surcoût CDD), on construit automatiquement le formulaire, il faut déterminer l'ordre des questions.

Plusieurs implémentations sont possibles. On va les illustrer justement avec cet exemple du surcoût CDD.

Objectifs :
- CIF
- majoration chômage
- prime précarité
- compensation congés payés (CP).

Variables manquantes :
- salaire de base
- cdd . événements de contrat (groupe de questions)
- cdd . motifs CDD (groupe de questions)
- cdd . durée contrat
- cdd . contrat jeune vacances
- cdd . jours de congés non pris

### Par occurence

On peut simplement compter, pour chaque variable manquante, le nombre de fois où sa valeur est demandée.

On remarquera alors que `salaire de base` et `événements de contrat` sont à égalité, devant `motif` et les autres.

### Par profondeur dans le modèle

Cette égalité dans la méthode par occurences pose problème : les tests utilisateurs montrent que mettre la question `événements` en première position suprend, et ce malgé son omniprésence dans le calcul.

On peut imaginer, avec un raisonnement pas très précis certes, que ce caractère surprenant peut en partie être expliqué par sa profondeur dans le modèle de donnée : elle est plus spécialisée que `salaire de base`.

### Par impact sur le calcul

On peut aussi raisonner en impact sur le calcul : quelle est l'influence d'une variable sur la valeur cumulée de nos objectifs (sommés ici).

L'objectif alors est de rapidement donner une estimation des résultats de la simulation à l'utilisateur, en €.

La variable `salaire de base` devient donc totalement prioritaire, car c'est la seule qui manque pour donner une première fourchette de résultats : les objectifs sont en simplifiant une fonction affine du `salaire de base`.

Autrement dit, c'est la seule variable non bornée de la simulation.

#TODO

La variable `contrat jeune vacances` est utilisée comme condition d'applicabilité par deux variables.
