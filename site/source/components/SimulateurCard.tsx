import { useTranslation } from 'react-i18next'

import { Card, Chip, Emoji, Grid } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'

type SimulateurCardProps = MergedSimulatorMetadata & {
	small?: boolean
	fromGérer?: boolean
	role?: string
	darkerBackground?: boolean
	streched?: boolean
	sansDescription?: boolean
	précision?: string
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
	streched = false,
	fromGérer = false,
	role,
	sansDescription = false,
	précision,
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
		<Grid item xs={12} sm={6} md={6} lg={streched ? 6 : 4} role={role}>
			<Card
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
				précision={précision}
			>
				{!sansDescription && meta?.description}
			</Card>
		</Grid>
	)
}
