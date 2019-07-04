![La loi papier sur la page de droite du dessin de l'énorme livre de droit, sera (page de droite) augmentée par du code interprétable](https://raw.githubusercontent.com/betagouv/syso/master/source/sites/embauche.gouv.fr/images/logo.png)

This repository powers [mycompanyinfrance.fr](https://mycompanyinfrance.fr) and [embauche.beta.gouv.fr](https://embauche.beta.gouv.fr).

It's a React, Redux, Webpack website hosted on Netlify with no backend.

The hiring simulator, available on both websites, embeds a [model](https://github.com/betagouv/syso/blob/master/source/règles/base.yaml) of the french tax system as a YAML domain specific language. It enables displaying the computing rules on the Web and having a single source of logic for both the computation engine (a JS library) and the generated end-user conversation-like form.

The engine with the French tax law is available as a NPM module and explained [on the wiki](https://github.com/betagouv/syso/wiki/Librairie-de-calcul).

Developed by the french public startup incubator, [beta.gouv.fr](https://beta.gouv.fr/), with the help of the social security contributions collector, [URSSAF](www.urssaf.fr).

Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/betagouv/syso/issues/new) if you are interested and do not speak French.

## Run it

```
# Clone this repo on your computer
git clone --depth 100 git@github.com:betagouv/syso.git && cd syso

# Install the Javscript dependencies through Yarn
yarn install

# Run the server
yarn start
```

The app runs on https://localhost:8080/mon-entreprise. The english version deployed on mycompanyinfrance.fr is at http://localhost:8080/infrance.

## Supported browsers

The website will run well on modern browsers. Internet Explorer is not supported anymore (it should work but with visual glitches and performance issues).

This compatibility is tested thanks to [BrowserStack](http://browserstack.com/)'s free open source program.

![Logo de Browserstack, notre solution de tests manuels](https://i.imgur.com/dQwLjXA.png)
