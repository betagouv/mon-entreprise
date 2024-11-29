import { PublicodesExpression } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import { Appear } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, NumberField } from '@/design-system'
import { Button, HelpButtonWithPopover } from '@/design-system/buttons'
import {
	StyledInput,
	StyledInputContainer,
	StyledSuffix,
} from '@/design-system/field/TextField'
import { FlexCenter } from '@/design-system/global-style'
import { RotatingChevronIcon } from '@/design-system/icons'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import {
	MonthState,
	Options,
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
} from '../utils'
import MontantRéduction from './MontantRéduction'

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
						displaySuggestions={false}
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
						<RotatingChevronIcon aria-hidden $isOpen={isOptionVisible} />
					</Button>
				</td>
				<td
					id={`${réductionGénéraleDottedName.replace(
						/\s|\./g,
						'_'
					)}-${monthName}`}
				>
					<MontantRéduction
						rémunérationBrute={data.rémunérationBrute}
						réductionGénérale={data.réductionGénérale}
						displayedUnit={displayedUnit}
						language={language}
						warning={true}
					/>
				</td>
				<td
					id={`${réductionGénéraleDottedName.replace(
						/\s|\./g,
						'_'
					)}__régularisation-${monthName}`}
				>
					<MontantRéduction
						rémunérationBrute={data.rémunérationBrute}
						réductionGénérale={data.régularisation}
						displayedUnit={displayedUnit}
						language={language}
					/>
				</td>
			</tr>
			{isOptionVisible && (
				<StyledTableRow>
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

								<NumberFieldContainer>
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
								</NumberFieldContainer>
							</OptionContainer>
						</Appear>
					</td>
				</StyledTableRow>
			)}
		</>
	)
}

const HeuresSupplémentairesPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.popover">
		<Body>
			Le nombre d'heures supplémentaires et complémentaires est utilisé dans le
			calcul de la réduction générale : la rémunération brute est comparée au
			montant du SMIC majoré de ce nombre d'heures.
		</Body>
		<Message type="info">
			Si vous avez répondu à la question sur les heures supplémentaires ou
			complémentaires, la valeur sera écrasée par celle que vous saisissez mois
			par mois.
		</Message>
	</Trans>
)

const StyledTableRow = styled.tr`
	background-color: ${({ theme }) => theme.colors.bases.primary[200]};
	td {
		padding-top: ${({ theme }) => theme.spacings.sm};
		padding-bottom: ${({ theme }) => theme.spacings.sm};
	}
`
const FlexDiv = styled.div`
	${FlexCenter}
	justify-content: end;
`
const OptionContainer = styled.div`
	${FlexCenter}
	gap: ${({ theme }) => theme.spacings.lg};
`
const NumberFieldContainer = styled.div`
	max-width: 120px;
	${StyledInputContainer} {
		border-color: ${({ theme }) => theme.colors.bases.primary[800]};
		background-color: 'rgba(255, 255, 255, 10%)';
		&:focus-within {
			outline-color: ${({ theme }) => theme.colors.bases.primary[700]};
		}
		${StyledInput}, ${StyledSuffix} {
			color: ${({ theme }) => theme.colors.bases.primary[800]}!important;
		}
	}
`
const StyledSmallBody = styled(SmallBody)`
	margin: 0;
	color: ${({ theme }) => theme.colors.bases.primary[800]};
`
