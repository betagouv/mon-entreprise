/*

Les Variables du système social comportent des entrées particulières que l'on nommera "méchanismes". Elles diffèrent des entrées simples (telle la description d'une variable) car elles sont susceptibles de comporter des variables, et des calculs.

Voici une liste des méchanismes qui sont à traverser dans le but notamment :
	- d'extraire les variables utilisées et donc que l'utilisateur devra saisir
	- d'attribuer une note à ces variables pour déterminer la prochaine question entraînant une saisie
	- de court-circuiter les branches rendues inutiles par la situation courant saisie par l'utilisateur

.. pour construire une première démonstration d'interface de saisie pour le cas du CDD.

-----------------------------------------

*/

let root = {
	Variable: {
		// 'applicable si': types['boolean logic'],
		// 'non applicable si': types['boolean logic']
		'concerne': types['expression']
		'ne concerne pas': types['expression']
	}
}

let types = {
	expression:

}

/*
Variable:
	- applicable si: (boolean logic)
	- non applicable si: (boolean logic)
	- concerne: (expression)
	- ne concerne pas: (expression)

(boolean logic):
	toutes ces conditions: ([expression | boolean logic])
	l'une de ces conditions: ([expression | boolean logic])

(expression):
	| (variable)
	| (négation)
	| (égalité)
	| (comparaison numérique)
	| (test d'inclusion court)

"If you write a regular expression, walk away for a cup of coffee, come back, and can't easily understand what you just wrote, then you should look for a clearer way to express what you're doing."

Les expressions sont le seul méchanisme relativement embêtante pour le moteur. Dans un premier temps, il les gerera au moyen d'expressions régulières, puis il faudra probablement mieux s'équiper avec un "javascript parser generator" :
https://medium.com/@daffl/beyond-regex-writing-a-parser-in-javascript-8c9ed10576a6


(variable): (string)

(négation):
	! (variable)

(égalité):
	(variable) = (variable.type)

(comparaison numérique):
	| (variable) < (variable.type)
	| (variable) <= (variable.type)
	| (variable) > (variable.type)
	| (variable) <= (variable.type)

(test d'inclusion court):
	(variable) ⊂ [variable.type]

in Variable.formule :
	- composantes
	- linéaire
	- barème en taux marginaux
	- test d'inclusion: (test d'inclusion)

(test d'inclusion):
	variable: (variable)
	possibilités: [variable.type]


# pas nécessaire pour le CDD

	in Variable
		- variations: [si]

	(si):
		si: (expression)
		# corps




	*/
