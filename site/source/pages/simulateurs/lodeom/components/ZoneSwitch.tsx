import { renderToString } from 'react-dom/server'
import { useTranslation } from 'react-i18next'

import {
	RuleSwitchLabel,
	SwitchContainer,
} from '@/design-system/réductionDeCotisations'
import { zonesLodeomDottedName } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function ZoneSwitch() {
	const { t } = useTranslation()

	return (
		<SwitchContainer $isRule>
			<SimpleField
				dottedName={zonesLodeomDottedName}
				label={renderToString(
					<p>
						<strong>
							{t(
								'pages.simulateurs.lodeom.zone-switch-label',
								'Localisation de l’entreprise :'
							)}
						</strong>
					</p>
				)}
				labelStyle={RuleSwitchLabel}
			/>
		</SwitchContainer>
	)
}
