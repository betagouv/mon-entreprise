# syso

Introduction
----------------------

![La loi papier sur la page de droite du dessin de l'énorme livre de droit, sera (page de droite) augmentée par du code interprếtable](https://github.com/laem/syso/blob/master/source/images/logo.png)

L'idée, c'est d'augmenter les textes de loi avec des jeux de *donnée* qui décrivent l'architecture et les calculs de ses éléments, permettant par exemple à un citoyen ou une entreprise (deux entités différentes du système) de calculer ses obligations et ses droits ainsi que leur articulation (ex. comment je calcule la CSG sur mon salaire ? est-ce que j'appartiens au régime Alsace-Moselle ?).

Des moteurs interprèteront ces données pour en faire des formulaires de simulation, des outils pédagogiques (par ex. augmenter la fiche de paie simplifiée avec des explications, vue alternatives...), voir de la transaction, et soyons fous, des outils politiques.

Le premier moteur et produit utilisable concerne le sujet pratique du différentiel des cotisations et indemnités dues pour un CDD.
La suite sera l'intégration de toutes les cotisations d'un contrat CDI/CDD (sans le droit conventionnel).
Puis les principales réductions et aides à l'embauche.
Suivront peut-être les formes de travail différentes...

Développé au [SGMAP](https://github.com/sgmap/) et encore très expérimental. 


Pour les développeurs
--------------------------

```
npm install

npm start
```

C'est une appli en React, Redux, ES6-ES7, Webpack, qui exploite la loi codée en YAML.
Les fichiers YAML sont principalement du code préfixé : opérateur puis list ou objet d'opérandes. Les feuilles de cet arbre par contre sont en style infixe et parsées avec Nearley.js.
Ce gros AST est traversé, cela représente le moteur JS, qui utilise Ramda.
Des bouts de code marqués avec `TODO perf` peuvent être améliorés si l'appli devient lente.

> Note : vous ne trouverez pas de `const` dans l'appli, tous les `let` se comportant comme des `const` (ne sont pas réassignés), sauf pour les vraies constantes dans `actions.js`.
