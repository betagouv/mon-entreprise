import { PublicodesExpression } from 'publicodes'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import LectureGuide from '@/components/LectureGuide'
import { Body, FlexCenter, Grid, Strong } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import CheckboxImpôts from './CheckboxImpôts'
import MontantImpôts from './MontantImpôts'

type SimulationValueProps = {
	dottedName: DottedName
	code: string
	label?: string
	expression?: PublicodesExpression
	arrondi?: boolean
}

export function LigneImpôts({
	dottedName,
	code,
	label,
	expression,
	arrondi = true,
}: SimulationValueProps) {
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)

	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: arrondi ? 'oui' : 'non',
		unité: currentUnit,
	})
	const noValue =
		evaluation.nodeValue === null || evaluation.nodeValue === undefined

	if (noValue) {
		return null
	}

	const value = Math.abs(evaluation.nodeValue as number)

	const rule = engine.getRule(dottedName)
	const idPrefix = ((expression || dottedName) as string).replace(/\s|\./g, '_')

	return (
		<StyledGridContainer
			container
			spacing={2}
			className="print-no-break-inside"
		>
			<Grid item md="auto" sm={8} xs={12}>
				<StyledBody id={`${idPrefix}-label`}>{label || rule.title}</StyledBody>
			</Grid>

			<LectureGuide />

			<StyledGridItem item>
				<StyledBody>
					<Strong>{code}</Strong>
				</StyledBody>
				{expression ? (
					<CheckboxImpôts expression={expression} idPrefix={idPrefix} />
				) : (
					<MontantImpôts value={value} idPrefix={idPrefix} />
				)}
			</StyledGridItem>
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
const StyledGridItem = styled(Grid)`
	${FlexCenter}
`
const StyledBody = styled(Body)`
	margin: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
