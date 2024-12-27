import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Radio, ToggleGroup } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'

export default function ZoneSwitch() {
	const { currentZone, updateZone } = useZoneLodeom()
	const { t } = useTranslation()

	return (
		<Container>
			<StyledBody id="zone-switch-label">
				<Strong>
					{t(
						'pages.simulateurs.lodeom.zone-switch-label',
						"Localisation de l'entreprise"
					)}{' '}
					:
				</Strong>
			</StyledBody>
			<StyledToggleGroup
				value={currentZone}
				onChange={updateZone}
				aria-labelledby="zone-switch-label"
			>
				<StyledRadio value="zone un">
					{t('Guadeloupe, Guyane, Martinique, La Réunion')}
				</StyledRadio>
				<StyledRadio value="zone deux">
					{t('Saint-Barthélémy, Saint-Martin')}
				</StyledRadio>
			</StyledToggleGroup>
		</Container>
	)
}

const Container = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	column-gap: ${({ theme }) => theme.spacings.sm};
	width: 100%;
`
const StyledBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
const StyledToggleGroup = styled(ToggleGroup)`
	display: flex;
	> * {
		display: flex;
		flex-direction: column;
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
