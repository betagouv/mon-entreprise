import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import content from '../../../../publicodes/docs/langage.md'
import installation from '../../../../publicodes/docs/installation.md'
import documentation from '../../../../publicodes/docs/documentation.md'
import { Route, Switch } from 'react-router-dom'
import { Navigation } from './Header'

export default function Langage() {
	return (
		<div>
			<ScrollToTop />
			<Navigation items={items} sub="langage" />
			<main>
				<Switch>
					<Route path="/langage/installation" component={Installation} />
					<Route path="/langage/documentation" component={Documentation} />
					<Route path="/langage/" component={Main} />
				</Switch>
			</main>
		</div>
	)
}

const items = [
	['selancer', 'Se lancer'],
	['installation', 'Installation'],
	['documentation', 'Documentation'],
	['mécanismes', 'Liste des mécanismes']
]

const Main = () => <MarkdownWithAnchorLinks source={content} />

const Installation = () => <MarkdownWithAnchorLinks source={installation} />
const Documentation = () => <MarkdownWithAnchorLinks source={documentation} />
