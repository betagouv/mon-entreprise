import marked from 'marked'

let customMarked = new marked.Renderer()
customMarked.link = ( href, title, text ) =>
	`<a target="_blank" href="${ href }" title="${ title }">${ text }</a>`
marked.setOptions({
	renderer: customMarked
})

export default marked
