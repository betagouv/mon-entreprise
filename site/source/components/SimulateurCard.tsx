import { useTranslation } from 'react-i18next'

import { Card, Chip, Emoji, Grid, InfoBulle, SmallCard } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'

type SimulateurCardProps = MergedSimulatorMetadata & {
	small?: boolean
	fromGérer?: boolean
	role?: string
	darkerBackground?: boolean
	streched?: boolean
	titleLevel?: 'h3' | 'h4'
}

export function SimulateurCard({
	shortName,
	meta,
	path,
	tooltip,
	iframePath,
	pathId,
	icône,
	beta,
	small = false,
	darkerBackground = false,
	streched = false,
	fromGérer = false,
	role,
	titleLevel = 'h3',
}: SimulateurCardProps) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()
	const [, setNavigationOrigin] = useNavigationOrigin()

	const handlePress = () => {
		setNavigationOrigin(
			fromGérer ? { fromGérer: true } : { fromSimulateurs: true }
		)
	}

	const TitleTag = titleLevel

	const ctaLabel =
		pathId.startsWith('assistants') || pathId.startsWith('gérer')
			? t('pages.simulateurs.home.cta.assistant', "Lancer l'assistant")
			: t('pages.simulateurs.home.cta.simulateur', 'Lancer le simulateur')

	return (
		<Grid item xs={12} sm={6} md={6} lg={streched ? 6 : 4} role={role}>
			{small ? (
				<SmallCard
					icon={<Emoji emoji={icône} />}
					to={{
						pathname:
							(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
					}}
					onPress={handlePress}
					title={
						<span>
							{shortName} {tooltip && <InfoBulle description={tooltip} />}
							{beta && (
								<Chip type="info" icon={<Emoji emoji="🚧" />}>
									Bêta
								</Chip>
							)}
						</span>
					}
				/>
			) : (
				<Card
					title={
						<TitleTag>
							{shortName}
							{beta && (
								<div>
									<Chip type="info" icon={<Emoji emoji="🚧" />}>
										Bêta
									</Chip>
								</div>
							)}
						</TitleTag>
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
				>
					{meta?.description}
				</Card>
			)}
		</Grid>
	)
}
