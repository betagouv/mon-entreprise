import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml'
SyntaxHighlighter.registerLanguage('yaml', yaml)
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark'

export default ({ source }) => (
	<SyntaxHighlighter language="yaml" style={style}>
		{source}
	</SyntaxHighlighter>
)
