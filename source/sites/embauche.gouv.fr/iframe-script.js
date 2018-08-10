
// Get the "couleur" parameter passed to this script
let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset.couleur,
	baseUrl = 'https://embauche.beta.gouv.fr/',
	integratorUrl = encodeURIComponent(window.location.href.toString()),
	lang = script.dataset.lang,
	src = baseUrl + `?couleur=${couleur}&iframe&integratorUrl=${integratorUrl}&lang=${lang}`

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src,
	style: "border: none; width: 100%; display: block; margin: 0 auto; height: 45em",
	allowfullscreen : true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true
}
Object.entries(iframeAttributes).forEach(([key, value]) => iframe.setAttribute(key, value));

script.replaceWith(iframe, null);

