import { useTranslation } from 'react-i18next'

import { Card, Chip, Emoji, Grid, InfoBulle, SmallCard } from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'

type SimulateurCardProps = MergedSimulatorDataValues & {
	small?: boolean
	fromGérer?: boolean
	role?: string
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
	fromGérer = false,
}: SimulateurCardProps) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()

	const ctaLabel =
		pathId.startsWith('assistants') || pathId.startsWith('gérer')
			? t('pages.simulateurs.home.cta.assistant', "Lancer l'assistant")
			: t('pages.simulateurs.home.cta.simulateur', 'Lancer le simulateur')

	return (
		<>
			{small ? (
				<Grid item xs={12} sm={6} md={6} lg={4}>
					<SmallCard
						icon={<Emoji emoji={icône} />}
						to={{
							pathname:
								(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
						}}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
						title={
							<span>
								{shortName} {tooltip && <InfoBulle>{tooltip}</InfoBulle>}
								{beta && (
									<Chip type="info" icon={<Emoji emoji="🚧" />}>
										Bêta
									</Chip>
								)}
							</span>
						}
						role="link"
					/>
				</Grid>
			) : (
				<Grid item xs={12} sm={6} md={6} lg={4}>
					<Card
						title={
							<>
								{shortName}
								{beta && (
									<Chip type="info" icon={<Emoji emoji="🚧" />}>
										Bêta
									</Chip>
								)}
							</>
						}
						icon={<Emoji emoji={icône} />}
						ctaLabel={ctaLabel}
						aria-label={`${shortName}, ${ctaLabel}`}
						to={{
							pathname:
								(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
						}}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
						role="link"
					>
						{meta?.description}
					</Card>
				</Grid>
			)}
		</>
	)
}
