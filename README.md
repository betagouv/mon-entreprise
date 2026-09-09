Ce dépôt contient :

-   Le code source du site [mon-entreprise](https://mon-entreprise.urssaf.fr)
-   Les [règles publicodes](https://github.com/betagouv/mon-entreprise/tree/master/modele-social) pour le calcul des cotisations sociales, des impôts et des droits sociaux.
-   Les [règles publicodes](https://github.com/betagouv/mon-entreprise/tree/master/exoneration-covid) pour le calcul du montant des exonérations de cotisations liées au covid

## [mon-entreprise](https://mon-entreprise.urssaf.fr)</a>

[![Statut déploiement](https://github.com/betagouv/mon-entreprise/actions/workflows/deploy.yaml/badge.svg?branch=master)](https://github.com/betagouv/mon-entreprise/actions/workflows/deploy.yaml?query=branch%3Amaster++)&nbsp;
[![Statut test](https://github.com/betagouv/mon-entreprise/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/betagouv/mon-entreprise/actions/workflows/test.yaml?query=branch%3Amaster++)
[![Gitter chat](https://badges.gitter.im/mon-entreprise/community.png)](https://gitter.im/mon-entreprise/community)

Site développé en partenariat avec l’Urssaf, qui a pour mission d’accompagner des créateurs d’entreprise dans le développement de leur activité.

Il propose notamment des simulateurs de cotisations sociales très complets, basés sur le language déclaratif [publicodes](https://publi.codes). On peut ainsi calculer le coût d’une embauche, un salaire net après impôt, ses revenus d’auto-entrepreneur ou encore ceux d’un dirigeant de SAS(U) ou d’indépendant

> 🧮 [Voir la liste des simulateurs](https://mon-entreprise.urssaf.fr/simulateurs)

Les développeurs peuvent intégrer ces simulateurs sur d’autres sites, ou de réutiliser les règles pour effectuer leur propre calculs.

> 🧰 [Voir les outils à disposition des développeurs](https://mon-entreprise.urssaf.fr/int%C3%A9gration)

Tous les outils proposés sur mon-entreprise sont propulsés par [publicodes](https://publi.codes), un nouveau langage pour les algorithmes d’intérêt public.

## Contribuer

Si vous souhaitez contribuer à l’un des deux projets, rendez-vous sur [CONTRIBUTING.md](./CONTRIBUTING.md).

## 🇬🇧 English users

This repository powers [mycompanyinfrance.urssaf.fr](https://mycompanyinfrance.urssaf.fr) and [mon-entreprise.urssaf.fr](https://mon-entreprise.urssaf.fr)

Most of the documentation (including issues and commit message) is written in french, please raise an [issue](https://github.com/betagouv/mon-entreprise/issues/new) if you are interested and do not speak French.

## 🗜️ Compatibility

The website will run well on modern browsers. Internet Explorer is not supported anymore (it should work but with visual glitches and performance issues).

This compatibility is tested thanks to [BrowserStack](http://browserstack.com/)’s free open source program.

![Logo de Browserstack, notre solution de tests manuels](https://i.imgur.com/dQwLjXA.png)
