import { PrismLight } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import style from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark'

PrismLight.registerLanguage('js', js)
PrismLight.registerLanguage('jsx', jsx)
PrismLight.registerLanguage('yaml', yaml)

export default function SyntaxHighlighter({
	source,
	language,
}: {
	source: string
	language: string
}) {
	return (
		<>
			<PrismLight language={language} style={style}>
				{source}
			</PrismLight>
		</>
	)
}
