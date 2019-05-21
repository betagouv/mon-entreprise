import marked from 'marked'
import React from 'react'

let customMarked = new marked.Renderer()
customMarked.link = (href, title, text) =>
	`<a target="_blank" href="${href}" title="${title}">${text}</a>`
marked.setOptions({
	renderer: customMarked
})

export let createMarkdownDiv = markdown => (
	<div
		className="markdown"
		css={`
			blockquote {
				background: var(--lighterColour);
				border-radius: 0.6em;
				padding: 1.2em 1em 0.4em;
				margin: 0.6em;
				color: #333;
			}
		`}
		dangerouslySetInnerHTML={{ __html: marked(markdown || '') }}
	/>
)

export default marked
