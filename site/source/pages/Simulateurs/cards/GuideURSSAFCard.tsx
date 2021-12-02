import Emoji from 'Components/utils/Emoji'
import { Article } from 'DesignSystem/card'

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
			Des conseils pour se lancer dans la création et une présentation détaillée
			de votre protection sociale.
		</Article>
	)
}
