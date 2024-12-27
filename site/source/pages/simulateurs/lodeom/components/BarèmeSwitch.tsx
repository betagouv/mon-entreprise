import { renderToString } from 'react-dom/server'
import { useTranslation } from 'react-i18next'

import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/design-system/réductionDeCotisations'
import { barèmeLodeomDottedName } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function BarèmeSwitch() {
	const currentZone = useZoneLodeom()
	const { t } = useTranslation()

	return (
		currentZone && (
			<SwitchContainer $isRule>
				<SimpleField
					dottedName={barèmeLodeomDottedName(currentZone)}
					label={renderToString(
						<p>
							<strong>
								{t(
									'pages.simulateurs.lodeom.barème-switch-label',
									'Barème à appliquer :'
								)}
							</strong>
						</p>
					)}
					labelStyle={RuleSwitchLabel}
				/>
			</SwitchContainer>
		)
	)
}
