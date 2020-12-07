import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import content from '../../../../publicodes/docs/langage.md'
import { NavLink } from 'react-router-dom'
import { Navigation } from './Header'

export default function Landing() {
	return (
		<div>
			<Navigation items={items} sub />
			<ScrollToTop />
			<main>
				<MarkdownWithAnchorLinks source={content} />
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
