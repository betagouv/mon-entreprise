import Emoji from 'Components/utils/Emoji'
import { Article } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'

type GuideURSSAFCardProps = {
	guideUrssaf: {
		title: string
		url: string
	}
}

export function GuideURSSAFCard({ guideUrssaf }: GuideURSSAFCardProps) {
	return (
		<Article
			title={guideUrssaf.title}
			icon={<Emoji emoji="📖" />}
			ctaLabel={'Voir le guide'}
			href={guideUrssaf.url}
		>
			<Body>
				Des conseils pour se lancer dans la création et une présentation
				détaillée de votre protection sociale.
			</Body>
		</Article>
	)
}
