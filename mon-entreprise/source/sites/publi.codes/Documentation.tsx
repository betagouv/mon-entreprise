import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import principes from '../../../../publicodes/docs/principes-de-base.md'
import start from '../../../../publicodes/docs/se-lancer.md'
import api from '../../../../publicodes/docs/api.md'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Navigation } from './Header'
import Mécanismes from './Mécanismes'

const items = [
	['se-lancer', 'Se lancer', () => <MarkdownWithAnchorLinks source={start} />],
	[
		'principes-de-base',
		'Principes de base',
		() => <MarkdownWithAnchorLinks source={principes} />,
	],
	['api', 'API', () => <MarkdownWithAnchorLinks source={api} />],
	['mécanismes', 'Liste des mécanismes', Mécanismes],
]

export default function Langage() {
	return (
		<div>
			<ScrollToTop />
			<Navigation items={items} sub="documentation" />
			<main>
				<Switch>
					{items.map(([path, _, component]) => (
						<Route path={'/documentation/' + path} component={component} />
					))}
					<Redirect
						exact
						from="/documentation"
						to={'/documentation/' + items[0][0]}
					/>
				</Switch>
			</main>
		</div>
	)
}
