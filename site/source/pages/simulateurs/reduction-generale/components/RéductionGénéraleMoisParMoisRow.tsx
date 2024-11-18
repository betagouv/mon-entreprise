import { formatValue, PublicodesExpression } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import { Condition } from '@/components/EngineValue/Condition'
import { Appear } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, NumberField } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { PlusCircleIcon, SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'
import { Body, ExtraSmallBody } from '@/design-system/typography/paragraphs'

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
	onOptionChange: (monthIndex: number, options: Options) => void
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
	onOptionChange,
}: Props) {
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'
	const engine = useEngine()

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

	const [isOptionVisible, setOptionVisible] = useState(false)
	const heuresSupplémentairesLabel = t(
		'pages.simulateurs.réduction-générale.option.label.heures-supplémentaires',
		'Heures supplémentaires'
	)
	const heuresComplémentairesLabel = t(
		'pages.simulateurs.réduction-générale.option.label.heures-complémentaires',
		'Heures complémentaires'
	)

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
					<StyledPlusIcon
						role="button"
						title={t(
							'pages.simulateurs.réduction-générale.option.title',
							"Plus d'options (heures supplémentaires)"
						)}
						aria-label={t(
							'pages.simulateurs.réduction-générale.option.aria-label',
							'Ajoute des champs pour ajuster la rémunération (heures supplémentaires)'
						)}
						onClick={() => setOptionVisible(!isOptionVisible)}
					>
						<PlusCircleIcon />
					</StyledPlusIcon>
				</td>
				<td
					id={`${réductionGénéraleDottedName.replace(
						/\s|\./g,
						'_'
					)}-${monthName}`}
				>
					{data.réductionGénérale ? (
						<Tooltip tooltip={tooltip}>
							<StyledDiv>
								{formatValue(
									{
										nodeValue: data.réductionGénérale,
									},
									{
										displayedUnit,
										language,
									}
								)}
								<SearchIcon />
							</StyledDiv>
						</Tooltip>
					) : (
						<StyledDiv>
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
						</StyledDiv>
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
					<td>
						<Appear>
							<Condition expression="salarié . contrat . temps de travail . temps partiel = non">
								<StyledLabel>
									<StyledExtraSmallBody id="heures-supplémentaires-label">
										{heuresSupplémentairesLabel}
									</StyledExtraSmallBody>
									<HelpButtonWithPopover
										type="info"
										title={heuresSupplémentairesLabel}
									>
										<HeuresSupplémentairesPopoverContent />
									</HelpButtonWithPopover>
								</StyledLabel>

								<NumberField
									small={true}
									value={data.options.heuresSupplémentaires}
									onChange={(value?: number) =>
										onOptionChange(index, {
											heuresSupplémentaires: value,
											heuresComplémentaires: 0,
										})
									}
									aria-labelledby="heures-supplémentaires-label"
									displayedUnit="heures"
								/>
							</Condition>
							<Condition expression="salarié . contrat . temps de travail . temps partiel = oui">
								<StyledLabel>
									<StyledExtraSmallBody id="heures-complémentaires-label">
										{heuresComplémentairesLabel}
									</StyledExtraSmallBody>
									<HelpButtonWithPopover
										type="info"
										title={heuresComplémentairesLabel}
									>
										<HeuresSupplémentairesPopoverContent />
									</HelpButtonWithPopover>
								</StyledLabel>

								<NumberField
									small={true}
									value={data.options.heuresComplémentaires}
									onChange={(value?: number) =>
										onOptionChange(index, {
											heuresSupplémentaires: 0,
											heuresComplémentaires: value,
										})
									}
									aria-labelledby="heures-complémentaires-label"
									displayedUnit="heures"
								/>
							</Condition>
						</Appear>
					</td>
				</tr>
			)}
		</>
	)
}

function HeuresSupplémentairesPopoverContent() {
	return (
		<Trans i18nKey="pages.simulateurs.réduction-générale.option.popover">
			<Body>
				Le nombre d'heures supplémentaires et complémentaires est utilisé dans
				le calcul de la réduction générale : la rémunération brute est comparée
				au montant du SMIC majoré de ce nombre d'heures supplémentaires ou
				complémentaires.
			</Body>
			<Message type="info">
				Si vous avez répondu à la question sur les heures supplémentaires ou
				complémentaires, la valeur sera écrasée par celle que vous saisissez
				mois par mois.
			</Message>
		</Trans>
	)
}

const StyledPlusIcon = styled.div`
	cursor: pointer;
	svg {
		fill: ${({ theme }) => theme.colors.extended.grey[100]};
	}
	&:hover {
		svg {
			fill: ${({ theme }) => theme.colors.extended.grey[300]};
		}
	}
`

const StyledDiv = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
`

const StyledLabel = styled.div`
	margin-top: -${({ theme }) => theme.spacings.md};
	margin-bottom: ${({ theme }) => theme.spacings.xs};
	display: flex;
	align-items: center;
`
const StyledExtraSmallBody = styled(ExtraSmallBody)`
	margin-top: 0;
	margin-bottom: 0;
`
