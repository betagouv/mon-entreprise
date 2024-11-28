import { formatValue, PublicodesExpression } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import { Condition } from '@/components/EngineValue/Condition'
import { Appear } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, NumberField } from '@/design-system'
import { Button, HelpButtonWithPopover } from '@/design-system/buttons'
import { FlexCenter } from '@/design-system/global-style'
import { ChevronIcon, SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import {
	MonthState,
	Options,
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
} from '../utils'
import Répartition from './Répartition'
import WarningSalaireTrans from './WarningSalaireTrans'

type Props = {
	monthName: string
	data: MonthState
	index: number
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
	onOptionsChange: (monthIndex: number, options: Options) => void
}

type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RéductionGénéraleMoisParMoisRow({
	monthName,
	data,
	index,
	onRémunérationChange,
	onOptionsChange,
}: Props) {
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'
	const engine = useEngine()
	const [isOptionVisible, setOptionVisible] = useState(false)

	// TODO: enlever les 4 premières props après résolution de #3123
	const ruleInputProps = {
		dottedName: rémunérationBruteDottedName,
		suggestions: {},
		description: undefined,
		question: undefined,
		engine,
		'aria-labelledby': 'simu-update-explaining',
		formatOptions: {
			maximumFractionDigits: 0,
		},
		displayedUnit,
		unit: {
			numerators: ['€'],
			denominators: [],
		},
	}

	const isTempsPartiel = engine.evaluate(
		'salarié . contrat . temps de travail . temps partiel'
	).nodeValue as boolean
	const additionalHours = isTempsPartiel ? 'complémentaires' : 'supplémentaires'
	const additionalHoursLabels = {
		supplémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.heures-supplémentaires',
			'Heures supplémentaires'
		),
		complémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.heures-complémentaires',
			'Heures complémentaires'
		),
	}

	const tooltip = (
		<Répartition
			contexte={{
				[rémunérationBruteDottedName]: data.rémunérationBrute,
				[réductionGénéraleDottedName]:
					data.réductionGénérale + data.régularisation,
			}}
		/>
	)

	return (
		<>
			<tr>
				<th scope="row">{monthName}</th>
				<td>
					<NumberInput
						{...ruleInputProps}
						id={`${rémunérationBruteDottedName.replace(
							/\s|\./g,
							'_'
						)}-${monthName}`}
						aria-label={`${engine.getRule(rémunérationBruteDottedName)
							?.title} (${monthName})`}
						onChange={(rémunérationBrute?: PublicodesExpression) =>
							onRémunérationChange(
								index,
								(rémunérationBrute as RémunérationBruteInput).valeur
							)
						}
						value={data.rémunérationBrute}
						formatOptions={{
							maximumFractionDigits: 2,
						}}
					/>
				</td>
				<td>
					<Button
						size="XXS"
						light
						onPress={() => setOptionVisible(!isOptionVisible)}
						aria-describedby="options-description"
						aria-expanded={isOptionVisible}
						aria-controls={`options-${monthName}`}
						aria-label={!isOptionVisible ? t('Déplier') : t('Replier')}
					>
						{t('Options')}&nbsp;
						<StyledChevron aria-hidden $isOpen={isOptionVisible} />
					</Button>
				</td>
				<td
					id={`${réductionGénéraleDottedName.replace(
						/\s|\./g,
						'_'
					)}-${monthName}`}
				>
					{data.réductionGénérale ? (
						<Tooltip tooltip={tooltip}>
							<FlexDiv>
								{formatValue(
									{
										nodeValue: data.réductionGénérale,
									},
									{
										displayedUnit,
										language,
									}
								)}
								<StyledSearchIcon />
							</FlexDiv>
						</Tooltip>
					) : (
						<FlexDiv>
							{formatValue(0, { displayedUnit, language })}

							<Condition
								expression={`${rémunérationBruteDottedName} > 1.6 * SMIC`}
								contexte={{
									[rémunérationBruteDottedName]: data.rémunérationBrute,
								}}
							>
								<Tooltip tooltip={<WarningSalaireTrans />}>
									<span className="sr-only">{t('Attention')}</span>
									<StyledWarningIcon aria-label={t('Attention')} />
								</Tooltip>
							</Condition>
						</FlexDiv>
					)}
				</td>
				<td
					id={`${réductionGénéraleDottedName.replace(
						/\s|\./g,
						'_'
					)}__régularisation-${monthName}`}
				>
					{formatValue(
						{
							nodeValue: data.régularisation,
						},
						{
							displayedUnit,
							language,
						}
					)}
				</td>
			</tr>
			{isOptionVisible && (
				<tr>
					<td />
					<td colSpan={4}>
						<Appear id={`options-${monthName}`}>
							<OptionContainer>
								<FlexDiv>
									<StyledSmallBody id={`heures-${additionalHours}-label`}>
										{additionalHoursLabels[additionalHours]}
									</StyledSmallBody>
									<HelpButtonWithPopover
										type="info"
										title={additionalHoursLabels[additionalHours]}
									>
										<HeuresSupplémentairesPopoverContent />
									</HelpButtonWithPopover>
								</FlexDiv>

								<NumberField
									small={true}
									value={data.options.heuresSupplémentaires}
									onChange={(value?: number) =>
										onOptionsChange(index, {
											heuresSupplémentaires: value,
											heuresComplémentaires: 0,
										})
									}
									aria-labelledby={`heures-${additionalHours}-label`}
									displayedUnit="heures"
								/>
							</OptionContainer>
						</Appear>
					</td>
				</tr>
			)}
		</>
	)
}

function HeuresSupplémentairesPopoverContent() {
	return (
		<Trans i18nKey="pages.simulateurs.réduction-générale.options.popover">
			<Body>
				Le nombre d'heures supplémentaires et complémentaires est utilisé dans
				le calcul de la réduction générale : la rémunération brute est comparée
				au montant du SMIC majoré de ce nombre d'heures.
			</Body>
			<Message type="info">
				Si vous avez répondu à la question sur les heures supplémentaires ou
				complémentaires, la valeur sera écrasée par celle que vous saisissez
				mois par mois.
			</Message>
		</Trans>
	)
}

const FlexDiv = styled.div`
	${FlexCenter}
`

const StyledSearchIcon = styled(SearchIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`

const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
`

const OptionContainer = styled.div`
	${FlexCenter}
	gap: ${({ theme }) => theme.spacings.lg};
	margin-top: -${({ theme }) => theme.spacings.md};
`

const StyledSmallBody = styled(SmallBody)`
	margin: 0;
`

const StyledChevron = styled(ChevronIcon)<{ $isOpen: boolean }>`
	vertical-align: middle;
	transform: rotate(-90deg);
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(90deg);
		`}
`
