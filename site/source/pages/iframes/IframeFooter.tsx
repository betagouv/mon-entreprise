import FeedbackButton from '@/components/Feedback'
import Privacy from '@/components/layout/Footer/Privacy'
import { LogoWithLink } from '@/components/Logo'
import { Spacing } from '@/design-system/layout'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

export default function IframeFooter() {
	const { currentSimulatorData } = useCurrentSimulatorData()

	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing md />
				<FeedbackButton isEmbedded />
				<Spacing md />
				<Privacy noUnderline={false} />
				<Spacing lg />
				{!currentSimulatorData?.pathId.startsWith('simulateur') && (
					<LogoWithLink />
				)}
			</div>
		</>
	)
}
