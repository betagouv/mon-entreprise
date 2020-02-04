![logo mon-entreprise.fr](https://mon-entreprise.fr/images/logo.svg)

This repository powers [mycompanyinfrance.fr](https://mycompanyinfrance.fr) and [mon-entreprise.fr](https://mon-entreprise.fr) and [publi.codes](https://publi.codes).

The hiring simulator, available on both websites, embeds a [model](https://github.com/betagouv/mon-entreprise/blob/master/publicode/base.yaml) of the french tax system as a YAML domain specific language. It enables displaying the computing rules on the Web and having a single source of logic for both the computation engine (a JS library) and the generated end-user conversation-like form.

The engine with the French tax law is available as a NPM module and explained [on the wiki](https://github.com/betagouv/mon-entreprise/wiki/Librairie-de-calcul).

Developed by the french public startup incubator, [beta.gouv.fr](https://beta.gouv.fr/), with the help of the social security contributions collector, [URSSAF](www.urssaf.fr).

Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/betagouv/mon-entreprise/issues/new) if you are interested and do not speak French.

## Contribute

If you want to contribute to this application, please check out [CONTRIBUTING.md](./CONTRIBUTING.md).

## Supported browsers

The website will run well on modern browsers. Internet Explorer is not supported anymore (it should work but with visual glitches and performance issues).

This compatibility is tested thanks to [BrowserStack](http://browserstack.com/)'s free open source program.

![Logo de Browserstack, notre solution de tests manuels](https://i.imgur.com/dQwLjXA.png)
