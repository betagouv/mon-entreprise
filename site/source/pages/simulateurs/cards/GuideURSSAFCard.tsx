import { useTranslation } from 'react-i18next'

import { Article } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'

type GuideURSSAFCardProps = {
	guideUrssaf: {
		title: string
		url: string
		description?: string
		ctaLabel?: string
	}
}

const DEFAULT_DESCRIPTION = `
Des conseils pour se lancer dans la création et une présentation détaillée
de votre protection sociale.
`

export function GuideURSSAFCard({ guideUrssaf }: GuideURSSAFCardProps) {
	const language = useTranslation().i18n.language
	if (language !== 'fr') {
		return null
	}

	return (
		<Article
			title={guideUrssaf.title}
			icon={<Emoji emoji="📖" />}
			ctaLabel={guideUrssaf.ctaLabel ?? 'Voir le guide'}
			href={guideUrssaf.url}
		>
			{guideUrssaf.description ?? DEFAULT_DESCRIPTION}
		</Article>
	)
}
