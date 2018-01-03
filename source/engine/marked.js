import marked from 'marked'
import React from 'react'

let customMarked = new marked.Renderer()
customMarked.link = (href, title, text) =>
	`<a target="_blank" href="${href}" title="${title}">${text}</a>`
marked.setOptions({
	renderer: customMarked
})

export let createMarkdownDiv = markdown => (
	<div dangerouslySetInnerHTML={{ __html: marked(markdown || '') }} />
)

export default marked
