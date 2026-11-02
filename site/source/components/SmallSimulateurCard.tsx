import { Emoji, Grid, InfoBulle, SmallCard } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'

type Props = MergedSimulatorMetadata & {
	role?: string
}

export const SmallSimulateurCard = ({
	shortName,
	path,
	tooltip,
	iframePath,
	icône,
	role,
}: Props) => {
	const isIframe = useIsEmbedded()

	return (
		<Grid item xs={12} sm={8} md={6} lg={4} role={role}>
			<SmallCard
				icon={<Emoji emoji={icône} />}
				to={{
					pathname:
						(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
				}}
				title={
					<>
						{shortName} {tooltip && <InfoBulle description={tooltip} />}
					</>
				}
			/>
		</Grid>
	)
}
