L'objectif dans un premier temps est de faire une démonstration d'interface de saisie pour calculer les obligations du CDD. Le CDD est un contrat d'exception, ce qui le rend assez complexe.

Les Variables du système social comportent des entrées particulières (des cléfs de l'objet) que l'on nommera "mécanismes". Elles diffèrent des entrées simples (telle la description d'une variable) car elles sont susceptibles de comporter des variables, et la description de calculs.

Voici une liste des mécanismes qui sont à traverser pour notamment :
	- d'extraire les variables utilisées et donc que l'utilisateur devra saisir
	- d'attribuer une note à ces variables pour déterminer la prochaine saisie (ou "question")
	- de court-circuiter les branches rendues inutiles par la situation courante saisie par l'utilisateur, ce qui influence la note.

Dans un premier temps, l'idée est de créer un formulaire à questions unitaires optimisées pour que la saisie de données inutiles soit évitée.

- Il faut résoudre le calcul des variables.
	- ça introduit l'assiette 2300€
	- ça nous donne son intervalle en % vu que l'assiette est constante, et donc un avancement du formulaire
	- ça nous donne des résultats !!!!!! :))

- Il faut donner des explications à TOUTES les variables. Aucune n'est triviale !

- Il faut ajouter la notion d'entité.
- Ce qui permettra de regrouper les questions par thème. Exemple, demander "Quel type de CDD" et ordonner les réponses possibles par influence (e.g. si c'est un CDD d'usage )

-----------------------------------------
