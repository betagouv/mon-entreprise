import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import {
	baseTheme,
	Body,
	FlexCenter,
	Grid,
	HelpButtonWithPopover,
	Li,
	MontantField,
	QuantitéField,
	SmallBody,
	Strong,
	StyledInput,
	StyledInputContainer,
	StyledSuffix,
	Ul,
} from '@/design-system'
import { euros } from '@/domaine/Montant'
import { heuresParMois } from '@/domaine/Quantité'
import { useEngine } from '@/hooks/useEngine'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Options } from '@/utils/réductionDeCotisations'

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
						<QuantitéField
							id={`option-heures-sup-${month}`}
							small={true}
							value={
								options[additionalHours] !== undefined
									? heuresParMois(options[additionalHours])
									: undefined
							}
							onChange={(q) => onHeuresSupChange(q?.valeur)}
							aria-labelledby={`heures-sup-label`}
							unité="heures/mois"
						/>
					</NumberFieldContainer>
				</GridItemInput>
			</GridContainer>

			<StyledSmallBody>
				Mois incomplet {isDesktop && t('(embauche, absences, départ...)')}
				{' :'}
			</StyledSmallBody>

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
						<MontantField
							id={`option-rémunération-etp-${month}`}
							small={true}
							value={
								options.rémunérationETP !== undefined
									? euros(options.rémunérationETP)
									: undefined
							}
							unité="€"
							onChange={(m) => onRémunérationETPChange(m?.valeur)}
							aria-labelledby={`rémunération-etp-label`}
							avecCentimes
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
						<MontantField
							id={`option-rémunération-primes-${month}`}
							small={true}
							value={
								options.rémunérationPrimes !== undefined
									? euros(options.rémunérationPrimes)
									: undefined
							}
							unité="€"
							onChange={(m) => onRémunérationPrimesChange(m?.valeur)}
							aria-labelledby={`rémunération-primes-label`}
							avecCentimes
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
						<MontantField
							id={`option-rémunération-heures-sup-${month}`}
							small={true}
							value={
								options.rémunérationHeuresSup !== undefined
									? euros(options.rémunérationHeuresSup)
									: undefined
							}
							unité="€"
							onChange={(m) => onRémunérationHeuresSupChange(m?.valeur)}
							aria-labelledby={`rémunération-heures-sup-label`}
							avecCentimes
						/>
					</NumberFieldContainer>
				</GridItemInput>
			</GridContainer>
		</Appear>
	)
}

const HeuresSupplémentairesPopoverContent = () => (
	<Trans i18nKey="pages.simulateurs.réduction-générale.options.heures-sup.popover">
		<Body>
			Le nombre d'heures supplémentaires et complémentaires est utilisé dans le
			calcul de la réduction : la rémunération brute est comparée au montant du
			SMIC majoré de ce nombre d'heures.
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
// FIXME: Ce composant utilise des styled components internes de TextField
// (StyledInputContainer, StyledInput, StyledSuffix) qui ne devraient pas être
// exposés publiquement car ils créent un couplage fort avec l'implémentation
// interne. Il faudrait refactorer ce code pour soit :
// - Utiliser des props de style sur les composants de field
// - Créer un composant dédié dans le design-system
// - Utiliser des sélecteurs CSS génériques
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
	font-weight: bold;
	color: ${({ theme }) => theme.colors.bases.primary[800]};
	margin: ${({ theme }) => theme.spacings.xs} 0;
`
