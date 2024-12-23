import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { FlexCenter } from '@/design-system/global-style'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'

export default function BarèmeSwitch() {
	const { t } = useTranslation()
	const engine = useEngine()
	const { currentZone } = useZoneLodeom()
	const { barèmes, currentBarème, updateBarème } = useBarèmeLodeom()

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
				{barèmes.map((barème, index) => {
					const dottedName =
						`salarié . cotisations . exonérations . lodeom . ${currentZone} . ${barème}` as DottedName
					const rule = engine.getRule(dottedName)

					return (
						<StyledRadio key={index} value={barème}>
							{rule.title}
							<ExplicableRule
								light
								dottedName={dottedName}
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
