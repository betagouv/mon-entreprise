import { Emoji, Grid, InfoBulle, SmallCard } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'

type Props = MergedSimulatorMetadata & {
	role?: string
	fromGérer?: boolean
}

export const SmallSimulateurCard = ({
	shortName,
	path,
	tooltip,
	iframePath,
	icône,
	role,
	fromGérer,
}: Props) => {
	const isIframe = useIsEmbedded()
	const [, setNavigationOrigin] = useNavigationOrigin()

	const handlePress = () => {
		setNavigationOrigin(
			fromGérer ? { fromGérer: true } : { fromSimulateurs: true }
		)
	}

	return (
		<Grid item xs={12} sm={8} md={6} lg={4} role={role}>
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
					</span>
				}
			/>
		</Grid>
	)
}
