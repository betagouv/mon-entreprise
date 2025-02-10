import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import LectureGuide from '@/components/LectureGuide'
import { useEngine } from '@/components/utils/EngineContext'
import { FlexCenter } from '@/design-system/global-style'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { Contexte } from '@/domaine/Contexte'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

type SimulationValueProps = {
	dottedName: DottedName
	code: string
	label?: React.ReactNode
	round?: boolean
	contexte?: Contexte
}

export function LigneImpôts({
	dottedName,
	code,
	label,
	round = true,
	contexte = {},
}: SimulationValueProps) {
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const language = useTranslation().i18n.language
	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: round ? 'oui' : 'non',
		unité: currentUnit,
		contexte,
	})

	const noValue =
		evaluation.nodeValue === null || evaluation.nodeValue === undefined
	if (noValue) {
		return null
	}

	const rule = engine.getRule(dottedName)
	const elementIdPrefix = dottedName.replace(/\s|\./g, '_')

	return (
		<StyledGridContainer container spacing={2}>
			<Grid item md="auto" sm={8} xs={12}>
				<StyledBody id={`${elementIdPrefix}-label`}>
					{label || rule.title}
				</StyledBody>
			</Grid>

			<LectureGuide />

			<Grid item style={{ display: 'flex', alignItems: 'center' }}>
				<StyledBody>
					<Strong>{code}</Strong>
				</StyledBody>
				<StyledBody>
					<Value id={`${elementIdPrefix}-value`}>
						{formatValue(evaluation, {
							precision: round ? 0 : 2,
							language,
							displayedUnit: '',
						})}
					</Value>
				</StyledBody>
			</Grid>
		</StyledGridContainer>
	)
}

const StyledGridContainer = styled(Grid)`
	position: relative;
	z-index: 1;
	padding: ${({ theme }) => theme.spacings.xxs} 0;
	justify-content: space-between;
	align-items: baseline;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		align-items: center;
	}
`
const StyledBody = styled(Body)`
	margin: 0;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
const Value = styled.div`
	width: 100px;
	min-height: ${({ theme }) => theme.spacings.xl};
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.xs}`};
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.spacings.xxs};
	color: ${({ theme }) => theme.colors.extended.dark[800]};
	${FlexCenter}
`
