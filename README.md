
![La loi papier sur la page de droite du dessin de l'énorme livre de droit, sera (page de droite) augmentée par du code interprếtable](https://github.com/laem/syso/blob/master/source/images/logo.png)


Ce dépôt contient les règles des prélèvements sur les rémunérations salariales en France, et les expose sous forme de simulateurs Web : calcul du salaire net à partir du brut, etc.

L'objectif à plus long terme est d'explorer comment des domaines legislatifs peuvent être encodés de façon interprétable (par un ordinateur) et lisible (par un humain).

Développé à l'incubateur des services numériques de l'État, [beta.gouv.fr](http://beta.gouv.fr/).

> Lisez notre [wiki](https://github.com/sgmap/syso/wiki/Home/) pour plus d'informations.


Pour les développeurs
--------------------------

```
yarn install

yarn start
```

C'est une appli en React, Redux, ES6-ES7, Webpack, Ramda, qui exploite la loi codée en YAML.
Les fichiers YAML sont principalement du code préfixé : opérateur puis liste ou objet d'opérandes, donc proches d'un AST. Les feuilles de cet arbre par contre sont en style infixe et parsées avec Nearley.js.
Ce gros object est interprété par un moteur JS. Les mécanismes de calcul exposent une représentation JSX qui permet d'expliquer les calculs sur le Web.

Les fichiers YAML ainsi que le code du moteur ne sont aujourd'hui pas très bien ordonnés, et nous n'avons pas de documentation technique : mieux vaut nous contacter avant de faire un plongeon dans le code.

> Note : vous ne trouverez pas de `const` dans l'appli, tous les `let` (sauf exception signalée) se comportant comme des `const` (ne sont pas réassignés), sauf pour les vraies constantes dans `actions.js`.


Navigateurs supportés
--------------------------

Toutes les versions récentes de Firefox, Chrome, Edge et Safari sont parfaitement supportées. Le rendu n'est pas optimal sur IE 11, mais le site est fonctionnel.

Nous testons cette compatibilité grâce à [BrowserStack](http://browserstack.com/) qui s'engage pour les logiciels libres.
![Logo de Browserstack, notre solution de tests manuels](https://i.imgur.com/dQwLjXA.png)
