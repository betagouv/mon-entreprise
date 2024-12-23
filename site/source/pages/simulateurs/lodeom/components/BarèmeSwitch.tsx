import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { FlexCenter } from '@/design-system/global-style'
import { useBaremeLodeom } from '@/hooks/useBaremeLodeom'

export default function BarèmeSwitch() {
	const { t } = useTranslation()
	const engine = useEngine()
	const { barèmesPossibles, currentBarème, updateBarème } = useBaremeLodeom()

	return (
		<Container>
			<StyledToggleGroup
				value={currentBarème}
				onChange={updateBarème}
				aria-label={t(
					'pages.simulateurs.lodeom.bareme-label',
					'Barème à appliquer'
				)}
			>
				{barèmesPossibles.map((barème, index) => {
					const dottedName =
						`salarié . cotisations . exonérations . lodeom . zone un . ${barème}` as DottedName
					const rule = engine.getRule(dottedName)

					return (
						<StyledRadio key={index} value={barème}>
							{rule.title}
							<ExplicableRule
								light
								dottedName={
									`salarié . cotisations . exonérations . lodeom . zone un . ${barème}` as DottedName
								}
								aria-label={t("Plus d'informations sur {{ title }}", {
									title: barème,
								})}
							/>
						</StyledRadio>
					)
				})}
			</StyledToggleGroup>
		</Container>
	)
}

const Container = styled.div`
	${FlexCenter}
	flex-wrap: wrap;
	justify-content: center;
	column-gap: ${({ theme }) => theme.spacings.sm};
`
const StyledToggleGroup = styled(ToggleGroup)`
	> * {
		display: flex;
		flex-direction: column;
		text-align: left;
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
