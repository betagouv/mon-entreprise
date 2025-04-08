import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/design-system/réductionDeCotisations'
import { zonesLodeomDottedName } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function ZoneSwitch() {
	return (
		<SwitchContainer $isRule>
			<SimpleField
				dottedName={zonesLodeomDottedName}
				labelStyle={RuleSwitchLabel}
			/>
		</SwitchContainer>
	)
}
