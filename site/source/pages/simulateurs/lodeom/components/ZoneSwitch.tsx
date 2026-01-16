import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/components/RéductionDeCotisations/réductionDeCotisations'
import { SimpleField } from '@/components/Simulation/SimpleField'
import { zonesLodeomDottedName } from '@/hooks/useZoneLodeom'

export default function ZoneSwitch() {
	return (
		<SwitchContainer isRule>
			<SimpleField
				dottedName={zonesLodeomDottedName}
				labelStyle={RuleSwitchLabel}
			/>
		</SwitchContainer>
	)
}
