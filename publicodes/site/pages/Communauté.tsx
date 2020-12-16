import { MarkdownWithAnchorLinks } from '../components/markdown'
import { ScrollToTop } from '../components/Scroll'
import content from '../../docs/communauté.md'

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
