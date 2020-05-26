import React from 'react'
import emoji from 'react-easy-emoji'

let Component
if (process.env.NODE_ENV !== 'test') {
	const yaml = require('react-syntax-highlighter/dist/esm/languages/prism/yaml')
		.default
	const style = require('react-syntax-highlighter/dist/esm/styles/prism/atom-dark')
		.default
	const SyntaxHighlighter = require('react-syntax-highlighter').PrismLight

	SyntaxHighlighter.registerLanguage('yaml', yaml)

	Component = function PublicodeHighlighter({ source }: { source: string }) {
		return (
			<div css="position: relative; margin-bottom: 1rem">
				<SyntaxHighlighter language="yaml" style={style}>
					{source}
				</SyntaxHighlighter>
				<a
					href={`https://publi.codes/studio?code=${encodeURIComponent(source)}`}
					target="_blank"
					css="position: absolute; bottom: 5px; right: 10px; color: white !important;"
				>
					{emoji('⚡')} Lancer le calcul
				</a>
			</div>
		)
	}
}

export default Component ??
	function() {
		return null
	}
