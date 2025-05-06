import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Radio, ToggleGroup } from '@/design-system'
import { FlexCenter } from '@/design-system/global-style'
import { Body } from '@/design-system/typography/paragraphs'

type Props = {
	déclarant: '1' | '2'
	setDéclarant: (déclarant: '1' | '2') => void
}

export default function DéclarantSelection({ déclarant, setDéclarant }: Props) {
	const { t } = useTranslation()

	return (
		<Container className="print-hidden">
			<Body id="déclarant-label">
				{t(
					'pages.assistants.declaration-revenus-pamc.resultats.déclarant.label',
					'Quel déclarant êtes-vous ?'
				)}
			</Body>
			<ToggleGroup
				aria-labelledby="déclarant-label"
				value={déclarant}
				onChange={(value) => setDéclarant(value as '1' | '2')}
			>
				<Radio value="1">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.déclarant.1',
						'Déclarant 1'
					)}
				</Radio>
				<Radio value="2">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.déclarant.2',
						'Déclarant 2'
					)}
				</Radio>
			</ToggleGroup>
		</Container>
	)
}

const Container = styled.div`
	${FlexCenter}
	flex-wrap: wrap;
	justify-content: space-between;
	padding-right: ${({ theme }) => theme.spacings.sm};
`
