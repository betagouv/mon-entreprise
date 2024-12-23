import { DottedName } from 'modele-social'

import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function BarèmeSwitch() {
	const { currentZone } = useZoneLodeom()

	return (
		currentZone && (
			<SimpleField
				dottedName={
					`salarié . cotisations . exonérations . lodeom . ${currentZone} . barèmes` as DottedName
				}
			/>
		)
	)
}
