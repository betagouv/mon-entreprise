import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { NumberField } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import {
	StyledInput,
	StyledInputContainer,
	StyledSuffix,
} from '@/design-system/field/TextField'
import { FlexCenter } from '@/design-system/global-style'
import { RotatingChevronIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { baseTheme } from '@/design-system/theme'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import { Options } from '../utils'

type Props = {
	month: string
	index: number
	options: Options
	onOptionsChange: (monthIndex: number, options: Options) => void
}

export default function MonthOptions({
	month,
	index,
	options,
	onOptionsChange,
}: Props) {
	const { t } = useTranslation()
	const engine = useEngine()
	const [isMoisIncompletVisible, setMoisIncompletVisible] = useState(false)
	const isDesktop = useMediaQuery(
		`(min-width: ${baseTheme.breakpointsWidth.md})`
	)

	const isTempsPartiel = engine.evaluate(
		'salarié . contrat . temps de travail . temps partiel'
	).nodeValue as boolean
	const additionalHours = isTempsPartiel
		? 'heuresComplémentaires'
		: 'heuresSupplémentaires'
	const additionalHoursLabels = {
		heuresSupplémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.heures-supplémentaires',
			"Nombre d'heures supplémentaires"
		),
		heuresComplémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.heures-complémentaires',
			"Nombre d'heures complémentaires"
		),
	}
	const additionalHoursRémunérationLabels = {
		heuresSupplémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.rémunération-heures-supplémentaires',
			'Rémunération des heures supplémentaires'
		),
		heuresComplémentaires: t(
			'pages.simulateurs.réduction-générale.options.label.rémunération-heures-complémentaires',
			'Rémunération des heures complémentaires'
		),
	}

	const onHeuresSupChange = (value?: number) => {
		const newOptions = {
			...options,
			heuresSupplémentaires: 0,
			heuresComplémentaires: 0,
		}
		if (isTempsPartiel) {
			newOptions.heuresComplémentaires = value ?? 0
		} else {
			newOptions.heuresSupplémentaires = value ?? 0
		}
		onOptionsChange(index, newOptions)
	}

	const onRémunérationETPChange = (value?: number) => {
		const newOptions = {
			...options,
			rémunérationETP: value ?? 0,
		}
		onOptionsChange(index, newOptions)
	}

	const onRémunérationPrimesChange = (value?: number) => {
		const newOptions = {
			...options,
			rémunérationPrimes: value ?? 0,
		}
		onOptionsChange(index, newOptions)
	}

	const onRémunérationHeuresSupChange = (value?: number) => {
		const newOptions = {
			...options,
			rémunérationHeuresSup: value ?? 0,
		}
		onOptionsChange(index, newOptions)
	}

	return (
		<Appear>
			<GridContainer container columnSpacing={4}>
				<GridItemLabel item>
					<FlexDiv>
						<StyledLabel id={`heures-sup-label`}>
							{additionalHoursLabels[additionalHours]}
						</StyledLabel>
						<HelpButtonWithPopover
							type="info"
							title={additionalHoursLabels[additionalHours]}
						>
							<HeuresSupplémentairesPopoverContent />
						</HelpButtonWithPopover>
					</FlexDiv>
				</GridItemLabel>
				<GridItemInput item>
					<NumberFieldContainer>
						<NumberField
							id={`option-heures-sup-${month}`}
							small={true}
							value={options[additionalHours]}
							onChange={onHeuresSupChange}
							aria-labelledby={`heures-sup-label`}
							displayedUnit="heures"
						/>
					</NumberFieldContainer>
				</GridItemInput>
			</GridContainer>

			<StyledButton
				role="button"
				onClick={() => setMoisIncompletVisible(!isMoisIncompletVisible)}
				aria-describedby="options-mois-incomplet-description"
				aria-expanded={isMoisIncompletVisible}
				aria-controls={`options-mois-incomplet-${month}`}
				aria-label={!isMoisIncompletVisible ? t('Déplier') : t('Replier')}
			>
				Mois incomplet {isDesktop && '(embauche, absences, départ...)'}{' '}
				<RotatingChevronIcon aria-hidden $isOpen={isMoisIncompletVisible} />
			</StyledButton>
			<span id="options-mois-incomplet-description" className="sr-only">
				{t(
					'pages.simulateurs.réduction-générale.options.mois-incomplet.description',
					"Ajoute des champs pour gérer le cas d'un mois incomplet"
				)}
			</span>

			{isMoisIncompletVisible && (
				<>
					<GridContainer container columnSpacing={4}>
						<GridItemLabel item>
							<FlexDiv>
								<StyledLabel id={`rémunération-etp-label`}>
									{t(
										'pages.simulateurs.réduction-générale.options.label.rémunération-etp',
										'Rémunération de base mois complet'
									)}
								</StyledLabel>
								<HelpButtonWithPopover
									type="info"
									title={t(
										'pages.simulateurs.réduction-générale.options.label.rémunération-etp',
										'Rémunération de base mois complet'
									)}
								>
									<RémunérationETPPopoverContent />
								</HelpButtonWithPopover>
							</FlexDiv>
						</GridItemLabel>
						<GridItemInput item>
							<NumberFieldContainer>
								<NumberField
									id={`option-rémunération-etp-${month}`}
									small={true}
									value={options.rémunérationETP}
									onChange={onRémunérationETPChange}
									aria-labelledby={`rémunération-etp-label`}
									displayedUnit="€"
								/>
							</NumberFieldContainer>
						</GridItemInput>
					</GridContainer>
					<GridContainer container columnSpacing={4}>
						<GridItemLabel item>
							<FlexDiv>
								<StyledLabel id={`rémunération-primes-label`}>
									{t(
										'pages.simulateurs.réduction-générale.options.label.rémunération-primes',
										'Rémunération non affectée par le mois incomplet'
									)}
								</StyledLabel>
								<HelpButtonWithPopover
									type="info"
									title={t(
										'pages.simulateurs.réduction-générale.options.label.rémunération-primes',
										'Rémunération non affectée par le mois incomplet'
									)}
								>
									<RémunérationPrimesPopoverContent />
								</HelpButtonWithPopover>
							</FlexDiv>
						</GridItemLabel>
						<GridItemInput item>
							<NumberFieldContainer>
								<NumberField
									id={`option-rémunération-primes-${month}`}
									small={true}
									value={options.rémunérationPrimes}
									onChange={onRémunérationPrimesChange}
									aria-labelledby={`rémunération-primes-label`}
									displayedUnit="€"
								/>
							</NumberFieldContainer>
						</GridItemInput>
					</GridContainer>
					<GridContainer container columnSpacing={4}>
						<GridItemLabel item>
							<FlexDiv>
								<StyledLabel id={`rémunération-heures-sup-label`}>
									{additionalHoursRémunérationLabels[additionalHours]}
								</StyledLabel>
								<HelpButtonWithPopover
									type="info"
									title={additionalHoursRémunérationLabels[additionalHours]}
								>
									<RémunérationHeuresSupPopoverContent />
								</HelpButtonWithPopover>
							</FlexDiv>
						</GridItemLabel>
						<GridItemInput item>
							<NumberFieldContainer>
								<NumberField
									id={`option-rémunération-heures-sup-${month}`}
									small={true}
									value={options.rémunérationHeuresSup}
									onChange={onRémunérationHeuresSupChange}
									aria-labelledby={`rémunération-heures-sup-label`}
									displayedUnit="€"
								/>
							</NumberFieldContainer>
						</GridItemInput>
					</GridContainer>
				</>
			)}
		</Appear>
	)
}

const HeuresSupplémentairesPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.heures-sup.popover">
		<Body>
			Le nombre d'heures supplémentaires et complémentaires est utilisé dans le
			calcul de la réduction générale : la rémunération brute est comparée au
			montant du SMIC majoré de ce nombre d'heures.
		</Body>
	</Trans>
)

const RémunérationETPPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.rémunération-etp.popover">
		<Body>
			Indiquez ici la rémunération qui aurait été versée pour un mois complet,{' '}
			<Strong>en excluant</Strong> :
			<Ul>
				<Li>
					les primes et autres éléments de rémunération non affectés par
					l'absence ;
				</Li>
				<Li>la rémunération des heures supplémentaires ou complémentaires.</Li>
			</Ul>
		</Body>
	</Trans>
)

const RémunérationPrimesPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.rémunération-primes.popover">
		<Body>
			Indiquez ici les éléments de rémunération non affectés par l'absence,
			comme les primes.
		</Body>
	</Trans>
)

const RémunérationHeuresSupPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.rémunération-heures-sup.popover">
		<Body>
			Indiquez ici la rémunération afférente au paiement des heures
			supplémentaires ou complémentaires.
		</Body>
	</Trans>
)

const GridContainer = styled(Grid)`
	align-items: center;
	margin-bottom: ${({ theme }) => theme.spacings.xxs};
`
const GridItemLabel = styled(Grid)`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex: 2;
	}
`
const GridItemInput = styled(Grid)`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex: 1;
	}
`
const FlexDiv = styled.div`
	${FlexCenter}
`
const StyledLabel = styled(SmallBody)`
	margin: 0;
	color: ${({ theme }) => theme.colors.bases.primary[800]};
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
const StyledButton = styled(SmallBody)`
	cursor: pointer;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.bases.primary[800]};
	margin-top: ${({ theme }) => theme.spacings.xs};
	margin-bottom: 0;
	svg {
		fill: ${({ theme }) => theme.colors.bases.primary[800]} !important;
	}
`
