import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Radio, ToggleGroup } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

type Props = {
	régularisationMethod: RégularisationMethod
	setRégularisationMethod: (value: RégularisationMethod) => void
}

export default function RégularisationSwitch({
	régularisationMethod,
	setRégularisationMethod,
}: Props) {
	const { t } = useTranslation()

	return (
		<Container>
			<StyledBody id="régularisation-switch-label">
				<Strong>
					{t(
						'pages.simulateurs.réduction-générale.régularisation.type',
						'Type de régularisation'
					)}{' '}
					:
				</Strong>
			</StyledBody>

			<StyledToggleGroup
				value={régularisationMethod}
				onChange={(value) => {
					setRégularisationMethod(value as RégularisationMethod)
				}}
				aria-labelledby="régularisation-switch-label"
			>
				<StyledRadio value="annuelle">
					{t(
						'pages.simulateurs.réduction-générale.régularisation.annuelle',
						'Régularisation annuelle'
					)}
				</StyledRadio>
				<StyledRadio value="progressive">
					{t(
						'pages.simulateurs.réduction-générale.régularisation.progressive',
						'Régularisation progressive'
					)}
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
		/* flex-direction: column; */
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
