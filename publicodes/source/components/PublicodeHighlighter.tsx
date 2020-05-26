import React from 'react'
import emoji from 'react-easy-emoji'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import style from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark'

SyntaxHighlighter.registerLanguage('yaml', yaml)

export default function PublicodeHighlighter({ source }: { source: string }) {
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
