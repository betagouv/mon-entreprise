import Privacy from '@/components/layout/Footer/Privacy'
import { Spacing } from '@/design-system/layout'

export default function IframeFooter() {
	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing xl />
				<Privacy noUnderline={false} />
				<Spacing lg />
			</div>
		</>
	)
}
