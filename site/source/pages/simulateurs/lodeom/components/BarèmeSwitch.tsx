import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/components/RéductionDeCotisations/réductionDeCotisations'
import { SimpleField } from '@/components/Simulation/SimpleField'
import { barèmeLodeomDottedName } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'

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
