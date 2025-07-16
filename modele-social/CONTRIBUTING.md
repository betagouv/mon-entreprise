


### Documentation et apprentissage

La documentation de publicodes est disponible sur https://publi.codes.

Un wiki contenant des informations intéressantes sur publicodes et le
raisonnement ayant abouti à ce langage sont dispos sur le repository
[betagouv/publicodes](https://github.com/betagouv/publicodes/wiki)

Pour se familiariser avec les règles, vous pouvez jeter un œil aux fichiers
contenant les règles elles-mêmes (dans le dossier `modele-social`) mais cela
peut s'avérer assez abrupt.

Essayez plutôt de jeter un œil [aux tests](https://github.com/betagouv/publicodes/tree/master/core/test/m%C3%A9canismes)
dans un premier temps, et pourquoi pas à [à l'implémentation des mécanismes](https://github.com/betagouv/publicodes/tree/master/core/source/mecanisms).

### Traduction des normes (lois) en règles Publicodes

Checklist :

-   [ ] Lire les articles de vulgarisation (sur le site de l'URSSAF, des impôts, etc.).
-   [ ] Utiliser un moteur de recherche spécialisé, comme [RFPaye](https://rfpaye.grouperf.com/).
-   [ ] Lire les normes et noter leurs références dans les règles Publicodes.

### Développement de modele-social et de mon-entreprise

Pour développer les règles de `modele-social` et tester en temps réel sur les simulateurs de mon-entreprise, il vous faut lancer la commande suivantes : 
  
  ```sh
  yarn start
  ```

Les règles s'actualiseront automatiquement et le site se rechargera à chaque modification.


### Tests

Pour tester les règles, il est recommandé de :

-   faire tourner un simulateur et vérifier à la main l'adéquation des règles avec les normes
    traduites ;
-   créer des cas de tests de non-régression sous la forme de nouveaux snapshots (cf.
    `site/test/regressions`).

### Versioning et changelog

Lors de toute modification du package `modele-social`, il est nécessaire de :

1. **Mettre à jour la version** dans le fichier `package.json` en suivant le versioning sémantique :
   - Version majeure (1.0.0) : changements incompatibles avec les versions précédentes
   - Version mineure (0.1.0) : ajout de nouvelles fonctionnalités rétrocompatibles
   - Version patch (0.0.1) : corrections de bugs rétrocompatibles

2. **Documenter les changements** dans le fichier `CHANGELOG.md` en ajoutant une nouvelle entrée qui décrit :
   - La nature des modifications apportées
   - Les règles ajoutées, modifiées ou supprimées
   - Les impacts potentiels sur les utilisateurs du package

Cette pratique assure une traçabilité des évolutions et facilite la maintenance du package.

### Développement simultané de Publicodes et de mon-entreprise

Il est parfois utile de tester des évolutions de publicodes sur mon-entreprise. C'est possible de la manière suivante :

-   cloner les deux dépôts
-   sur le dépôt `publicodes` lancer un `yarn build --watch` pour avoir du rechargement à chaud
-   sur le dépôt `mon-entreprise` lancer un `yarn link ../publicodes --all` pour lier dynamiquement les paquets `publicodes` et `@publicodes/react-ui`

La commande yarn link prend en paramètre un chemin relatif au dépôt courant, et fonctionne uniquement en local.

Pour revenir au paquet publié sur NPM il faut utiliser :

```sh
yarn unlink --all
```

Pour déployer une version preview de mon-entreprise utilisant une version de publicodes non publiée sur NPM il est possible de référencer un commit ou une branche dans l'attribut résolution du `package.json` :

```json
{
    "publicodes": "betagouv/publicodes#head=refacto&workspace=publicodes",
    "@publicodes/react-ui": "betagouv/publicodes#head=refacto&workspace=@publicodes/react-ui"
}
```