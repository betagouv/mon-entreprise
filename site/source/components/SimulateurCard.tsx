import { useTranslation } from 'react-i18next'

import { Card, Chip, Emoji, Grid } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'

type SimulateurCardProps = MergedSimulatorMetadata & {
	fromGérer?: boolean
	role?: string
	darkerBackground?: boolean
	stretched?: boolean
	withoutDescription?: boolean
	subtitle?: string
	headingLevel?: 'h3' | 'h4'
}

export function SimulateurCard({
	shortName,
	meta,
	path,
	iframePath,
	pathId,
	icône,
	beta,
	darkerBackground = false,
	stretched = false,
	fromGérer = false,
	role,
	withoutDescription = false,
	subtitle,
	headingLevel = 'h3',
}: SimulateurCardProps) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()
	const [, setNavigationOrigin] = useNavigationOrigin()

	const handlePress = () => {
		setNavigationOrigin(
			fromGérer ? { fromGérer: true } : { fromSimulateurs: true }
		)
	}

	const ctaLabel =
		pathId.startsWith('assistants') || pathId.startsWith('gérer')
			? t('pages.simulateurs.home.cta.assistant', "Lancer l'assistant")
			: t('pages.simulateurs.home.cta.simulateur', 'Lancer le simulateur')

	return (
		<Grid item xs={12} sm={6} md={6} lg={stretched ? 6 : 4} role={role}>
			<Card
				headingLevel={headingLevel}
				title={
					<>
						{shortName}
						{beta && (
							<div>
								<Chip type="info" icon={<Emoji emoji="🚧" />}>
									Bêta
								</Chip>
							</div>
						)}
					</>
				}
				icon={<Emoji emoji={icône} />}
				ctaLabel={ctaLabel}
				darkerBackground={darkerBackground}
				aria-label={`${shortName}, ${ctaLabel}`}
				to={{
					pathname:
						(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
				}}
				onPress={handlePress}
				subtitle={subtitle}
			>
				{!withoutDescription && meta?.description}
			</Card>
		</Grid>
	)
}
