import { MarkdownWithAnchorLinks } from '../components/markdown'
import { ScrollToTop } from '../components/Scroll'
import { Redirect, Route, Switch } from 'react-router-dom'
import api from '../../docs/api.md'
import principes from '../../docs/principes-de-base.md'
import start from '../../docs/se-lancer.md'
import { Navigation } from '../components/Header'
import Mécanismes from './Mécanismes'

const items = [
	[
		'se-lancer',
		'Se lancer',
		() => <MarkdownWithAnchorLinks>{start}</MarkdownWithAnchorLinks>,
	] as const,
	[
		'principes-de-base',
		'Principes de base',
		() => <MarkdownWithAnchorLinks>{principes}</MarkdownWithAnchorLinks>,
	] as const,
	[
		'api',
		'API',
		() => <MarkdownWithAnchorLinks>{api}</MarkdownWithAnchorLinks>,
	] as const,
	['mécanismes', 'Liste des mécanismes', Mécanismes] as const,
]

export default function Langage() {
	return (
		<div>
			<ScrollToTop />
			<Navigation items={items.map(([a, b]) => [a, b])} sub="documentation" />
			<main>
				<Switch>
					{items.map(([path, _, component]) => (
						<Route
							path={'/documentation/' + path}
							key={path}
							component={component}
						/>
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
