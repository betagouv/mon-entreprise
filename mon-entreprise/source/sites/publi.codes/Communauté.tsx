import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import content from '../../../../publicodes/docs/communauté.md'
import { NavLink } from 'react-router-dom'
import { Navigation } from './Header'

export default function Landing() {
	return (
		<div>
			<ScrollToTop />
			<main>
				<MarkdownWithAnchorLinks source={content} />
			</main>
		</div>
	)
}
