Futureco
--------------

## C'est quoi ?

Le dérèglement climatique n'est plus une menace lointaine et incertaine, c'est une actualité. Comment éviter la catastrophe ? Chaque aspect de notre vie moderne a un impact. Il suffit de le savoir ! 

Or, aujourd'hui, c'est très difficile : les données sont éparpillées, souvent dans des articles de presse sans source. Des simulateurs et modèles d'impact carbone existent, mais aucun ne répond à ces priorités : 

- le code doit être ouvert
- le code doit être lisible, critiquable, modifiable.

**Un wikipedia des externalités négatives des actes de la vie courante.**


[Plus d'infos sur le projet](https://github.com/laem/futureco/blob/master/source/sites/publicodes/about.md).


## Et techniquement ?

C'est pour l'instant un *fork* violent d'un simulateur de cotisations sociales, qui permet de coder en français des règles de calculs, dans un langage (qui se veut) simple et extensible. De ces règles de calcul, des simulateurs (pour l'utilisateur lambda) et des pages de documentation qui expliquent le calcul (pour l'expert ou le curieux) sont générés automatiquement.

Pour rendre ce code plus propre : 

1. Sur ce fork, nous expérimentons la séparation entre le code Javascript et les règles de calcul en YAML. C'est bien avancé.
2. Prochaine étape : l'édition des règles de calcul directement sur le site, avec création de PR. Deux pistes : [PRB0T](https://github.com/PRB0t/PRB0t) ou un code similaire par l'équipe de [mes-aides.gouv.fr](https://github.com/betagouv/mes-aides-ui).
3. Abstraire *publicodes*, la librairie qui permet de parser les règles, générer les simulateurs et les pages de documentation. Ce point est essentiel, mais il est en dernier car il me fait peur.


