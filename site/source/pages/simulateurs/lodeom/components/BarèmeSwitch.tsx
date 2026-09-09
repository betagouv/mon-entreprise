import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/components/RéductionDeCotisations/réductionDeCotisations'
import { barèmeLodeomDottedName } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function BarèmeSwitch() {
	const currentZone = useZoneLodeom()

	return (
		currentZone && (
			<SwitchContainer isRule>
				<SimpleField
					dottedName={barèmeLodeomDottedName(currentZone)}
					labelStyle={RuleSwitchLabel}
				/>
			</SwitchContainer>
		)
	)
}
