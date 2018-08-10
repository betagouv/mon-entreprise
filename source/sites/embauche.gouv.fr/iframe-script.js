import { forEachObjIndexed } from 'ramda';

let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset.couleur,
	baseUrl = script.dataset.iframeUrl || script.getAttribute('src').split('dist')[0],
	integratorUrl = encodeURIComponent(window.location.href.toString()),
	lang = script.dataset.lang,
	src = baseUrl + `?site=embauche&couleur=${couleur}&iframe&integratorUrl=${integratorUrl}&lang=${lang}`

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src,
	style: "border: none; width: 100%; display: block; margin: 0 auto; height: 45em",
	allowfullscreen : true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true
}
forEachObjIndexed((value, key) => iframe.setAttribute(key, value), iframeAttributes)

script.replaceWith(iframe, null);

