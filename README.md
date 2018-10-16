![La loi papier sur la page de droite du dessin de l'énorme livre de droit, sera (page de droite) augmentée par du code interprétable](https://raw.githubusercontent.com/betagouv/syso/master/source/sites/embauche.gouv.fr/images/logo.png)

This repository powers [mycompanyinfrance.fr](https://mycompanyinfrance.fr) and [embauche.beta.gouv.fr](https://embauche.beta.gouv.fr).

It's a React, Redux, Webpack website hosted on Netlify with no backend.

The hiring simulator, available on both websites, embeds a model of the french tax system as a YAML domain specific language. It enables displaying the computing rules on the Web and having a single source of logic for both the computation engine (a JS library) and the end-user conversation-like form.

Developed by the french public startup incubator, [beta.gouv.fr](http://beta.gouv.fr/).

Most of the documentation (including issues and the wiki) is written in french, raise an [issue](https://github.com/betagouv/syso/issues/new) if you are interested and do not speak French.

## Run it

```
yarn install

yarn start
```

## Supported browsers

The website will run well on modern browsers. IE 11 works, but can have visual glitches and performance issues.

This compatibility is tested thanks to [BrowserStack](http://browserstack.com/)'s free open source program.

![Logo de Browserstack, notre solution de tests manuels](https://i.imgur.com/dQwLjXA.png)
