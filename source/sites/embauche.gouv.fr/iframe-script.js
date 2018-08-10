import { forEachObjIndexed } from 'ramda'

function ReplaceWith(Ele) {
	'use-strict' // For safari, and IE > 10
	var parent = this.parentNode,
		i = arguments.length,
		firstIsNode = +(parent && typeof Ele === 'object')
	if (!parent) return

	while (i-- > firstIsNode) {
		if (parent && typeof arguments[i] !== 'object') {
			arguments[i] = document.createTextNode(arguments[i])
		}
		if (!parent && arguments[i].parentNode) {
			arguments[i].parentNode.removeChild(arguments[i])
			continue
		}
		parent.insertBefore(this.previousSibling, arguments[i])
	}
	if (firstIsNode) parent.replaceChild(Ele, this)
}
if (!Element.prototype.replaceWith) Element.prototype.replaceWith = ReplaceWith
if (!CharacterData.prototype.replaceWith)
	CharacterData.prototype.replaceWith = ReplaceWith
if (!DocumentType.prototype.replaceWith)
	DocumentType.prototype.replaceWith = ReplaceWith

let script = document.getElementById('script-simulateur-embauche'),
	couleur = script.dataset.couleur,
	baseUrl =
		script.dataset.iframeUrl || script.getAttribute('src').split('dist')[0],
	integratorUrl = encodeURIComponent(window.location.href.toString()),
	lang = script.dataset.lang,
	src =
		baseUrl +
		`?site=embauche&couleur=${couleur}&iframe&integratorUrl=${integratorUrl}&lang=${lang}`

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src,
	style:
		'border: none; width: 100%; display: block; margin: 0 auto; height: 45em',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true
}
forEachObjIndexed(
	(value, key) => iframe.setAttribute(key, value),
	iframeAttributes
)

script.replaceWith(iframe, null)
