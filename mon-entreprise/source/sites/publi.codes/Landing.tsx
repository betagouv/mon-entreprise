import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import content from '../../../../publicodes/docs/introduction.md'

export default function Landing() {
	return (
		<main>
			<ScrollToTop />
			<h2
				css={`
					max-width: 70%;
					font-size: 2rem;
					line-height: 2.5rem;
					margin-bottom: 2rem;
				`}
			>
				Le langage pour les algorithmes d'intérêt public.
			</h2>
			<MarkdownWithAnchorLinks source={content} />
		</main>
	)
}
