import { useCallback, useId } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IStyledComponent, styled } from 'styled-components'

import { estUnGroupeDeChoix } from '@/components/conversation/RuleField'
import RuleInput from '@/components/conversation/RuleInput'
import { BoutonDeDocumentation } from '@/components/documentation/publicodes'
import { FadeIn } from '@/components/ui/animate'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { Intro, Markdown, type DateFieldProps } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { fromOuiNon, OuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion, getMeta } from '@/utils/publicodes/publicodes'

type SimpleFieldProps = {
	dottedName: DottedName
	question?: string
	labelStyle?: IStyledComponent<'web', object>
	errorMessage?: string
	validation?: DateFieldProps['validation']
	onChange?: (value: ValeurPublicodes | undefined) => void
}

export function SimpleField({
	dottedName,
	question,
	labelStyle,
	errorMessage,
	validation,
	onChange,
}: SimpleFieldProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: OuiNon }>(rule.rawNode, {})
	const dispatchValue = useCallback(
		(value: ValeurPublicodes | undefined, dottedName: DottedName) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
			onChange?.(value)
		},
		[dispatch, onChange]
	)

	const labelId = useId()
	const targetUnit = useSelector(targetUnitSelector)

	if (evaluation.nodeValue === null) {
		return null
	}

	let displayedLabel =
		question ?? evaluateQuestion(engine, engine.getRule(dottedName))

	if (!displayedLabel) {
		displayedLabel =
			rule.title + (rule.rawNode.résumé ? ` – ${rule.rawNode.résumé}` : '')
	}

	const markdownComponents = {
		p: labelStyle ?? Intro,
	}

	const required = fromOuiNon(meta.requis)

	const estUnGroupe = estUnGroupeDeChoix(
		rule,
		evaluation.unit,
		evaluation.nodeValue as string | null
	)

	const libellé = (
		<>
			<Markdown
				as={estUnGroupe ? 'span' : 'label'}
				id={labelId}
				htmlFor={estUnGroupe ? undefined : normalizeRuleName.Input(dottedName)}
				components={markdownComponents}
			>
				{displayedLabel}
			</Markdown>
			{required && <RedIntro aria-hidden>&nbsp;*</RedIntro>}
			<BoutonDeDocumentation dottedName={dottedName} />
		</>
	)

	const champ = (
		<RuleInput
			dottedName={dottedName}
			displayedUnit={
				evaluation.unit?.numerators.includes(targetUnit)
					? targetUnit
					: undefined
			}
			aria-labelledby={labelId}
			required={required}
			missing={
				evaluation.nodeValue === undefined ||
				Object.keys(evaluation.missingVariables).length > 0
			}
			onChange={dispatchValue}
			errorMessage={errorMessage}
			validation={validation}
		/>
	)

	return (
		<FadeIn>
			{estUnGroupe ? (
				<FieldsetSansStyle>
					<LegendSansStyle>{libellé}</LegendSansStyle>
					{champ}
				</FieldsetSansStyle>
			) : (
				<>
					<div>{libellé}</div>
					{champ}
				</>
			)}
		</FadeIn>
	)
}

// `display: contents` et les remises à zéro gardent le rendu de la version
// avec `label` : le `fieldset` et la `legend` n'ajoutent aucune boîte ni marge.
const FieldsetSansStyle = styled.fieldset`
	display: contents;

	padding: 0;
	margin: 0;
	border: none;
`

const LegendSansStyle = styled.legend`
	padding: 0;
`

const RedIntro = styled(Intro)`
	color: ${({ theme }) =>
		theme.darkMode ? '' : theme.colors.extended.error[400]};
`
