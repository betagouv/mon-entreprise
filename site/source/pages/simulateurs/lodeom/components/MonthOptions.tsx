import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import {
	baseTheme,
	Body,
	FlexCenter,
	Grid,
	HelpButton,
	Li,
	MontantField,
	QuantitéField,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { euros } from '@/domaine/Montant'
import { heuresParMois } from '@/domaine/Quantite'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Options } from '@/pages/simulateurs/lodeom/utils'
import { useEngine } from '@/utils/publicodes/EngineContext'

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
			'pages.simulateurs.lodeom.options.label.heures-supplémentaires',
			"Nombre d'heures supplémentaires"
		),
		heuresComplémentaires: t(
			'pages.simulateurs.lodeom.options.label.heures-complémentaires',
			"Nombre d'heures complémentaires"
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

	return (
		<Appear>
			<GridContainer container columnSpacing={4}>
				<GridItemLabel item>
					<FlexDiv>
						<StyledLabel id={`heures-sup-label`}>
							{additionalHoursLabels[additionalHours]}
						</StyledLabel>
						<HelpButton description={<HeuresSupplémentairesPopoverContent />} />
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
				{t('pages.simulateurs.lodeom.mois-incomplet.court', 'Mois incomplet')}{' '}
				{isDesktop &&
					t(
						'pages.simulateurs.lodeom.mois-incomplet.détails',
						'(embauche, absences, départ…)'
					)}
				{' :'}
			</StyledSmallBody>

			<GridContainer container columnSpacing={4}>
				<GridItemLabel item>
					<FlexDiv>
						<StyledLabel id="rémunération-etp-label">
							{t(
								'pages.simulateurs.lodeom.options.label.rémunération-etp',
								'Rémunération de base mois complet'
							)}
						</StyledLabel>
						<HelpButton description={<RémunérationETPPopoverContent />} />
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
							aria={{
								labelledby: 'rémunération-etp-label',
							}}
							avecCentimes
						/>
					</NumberFieldContainer>
				</GridItemInput>
			</GridContainer>
			<GridContainer container columnSpacing={4}>
				<GridItemLabel item>
					<FlexDiv>
						<StyledLabel id="rémunération-primes-label">
							{t(
								'pages.simulateurs.lodeom.options.label.rémunération-primes',
								'Rémunération non affectée par le mois incomplet'
							)}
						</StyledLabel>
						<HelpButton description={<RémunérationPrimesPopoverContent />} />
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
							aria={{
								labelledby: 'rémunération-primes-label',
							}}
							avecCentimes
						/>
					</NumberFieldContainer>
				</GridItemInput>
			</GridContainer>
		</Appear>
	)
}

const HeuresSupplémentairesPopoverContent = () => (
	<Body>
		<Trans i18nKey="pages.simulateurs.lodeom.options.heures-sup.popover">
			Le nombre d'heures supplémentaires et complémentaires est utilisé dans le
			calcul de la réduction&nbsp;: la rémunération brute est comparée au
			montant du SMIC majoré de ce nombre d'heures.
		</Trans>
	</Body>
)

const RémunérationETPPopoverContent = () => (
	<Body>
		<Trans i18nKey="pages.simulateurs.lodeom.options.rémunération-etp.popover">
			Indiquez ici la rémunération qui aurait été versée pour un mois complet,{' '}
			<Strong>en excluant</Strong>&nbsp;:
			<Ul>
				<Li>
					les primes et autres éléments de rémunération non affectés par
					l'absence&nbsp;;
				</Li>
				<Li>la rémunération des heures supplémentaires ou complémentaires.</Li>
			</Ul>
		</Trans>
	</Body>
)

const RémunérationPrimesPopoverContent = () => (
	<Body>
		<Trans i18nKey="pages.simulateurs.lodeom.options.rémunération-primes.popover">
			Indiquez ici les éléments de rémunération non affectés par l’absence,
			comme les primes.
		</Trans>
	</Body>
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
`
const NumberFieldContainer = styled.div`
	max-width: 120px;
`
const StyledSmallBody = styled(SmallBody)`
	font-weight: bold;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[800]};
	margin: ${({ theme }) => theme.spacings.xs} 0;
`
