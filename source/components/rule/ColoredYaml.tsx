import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml'
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/tomorrow'
SyntaxHighlighter.registerLanguage('yaml', yaml)

export default ({ source }) => (
	<SyntaxHighlighter language="yaml" style={style}>
		{source}
	</SyntaxHighlighter>
)
