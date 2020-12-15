import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import documentation from '../../../../publicodes/docs/langage.md'
import installation from '../../../../publicodes/docs/installation.md'
import api from '../../../../publicodes/docs/documentation.md'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Navigation } from './Header'
import Mécanismes from './Mécanismes'

const items = [
	[
		'se-lancer',
		'Se lancer',
		() => <MarkdownWithAnchorLinks source={installation} />,
	],
	[
		'principes-de-base',
		'Principes de base',
		() => <MarkdownWithAnchorLinks source={documentation} />,
	],
	['api', 'API', () => <MarkdownWithAnchorLinks source={api} />],
	['mécanismes', 'Liste des mécanismes', Mécanismes],
]

export default function Langage() {
	return (
		<div>
			<ScrollToTop />
			<Navigation items={items} sub="langage" />
			<main>
				<Redirect exact from="/langage" to={'/langage/' + items[0][0]} />
				<Switch>
					{items.map(([path, _, component]) => (
						<Route path={'/langage/' + path} component={component} />
					))}
				</Switch>
			</main>
		</div>
	)
}
