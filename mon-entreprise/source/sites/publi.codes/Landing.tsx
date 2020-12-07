import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import content from '../../../../publicodes/docs/introduction.md'

export default function Landing() {
	return (
		<main>
			<ScrollToTop />
			<p
				css={`
					font-size: 200%;
					max-width: 60%;
					line-height: 2rem;
					margin-bottom: 2rem;
				`}
			>
				Le langage pour les algorithmes d'intérêt public.
			</p>
			<MarkdownWithAnchorLinks source={content} />
		</main>
	)
}
