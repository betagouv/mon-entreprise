import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, NumberField } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import {
	StyledInput,
	StyledInputContainer,
	StyledSuffix,
} from '@/design-system/field/TextField'
import { FlexCenter } from '@/design-system/global-style'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

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

	const onChange = (value?: number) => {
		const options = {
			heuresSupplémentaires: 0,
			heuresComplémentaires: 0,
		}
		if (isTempsPartiel) {
			options.heuresComplémentaires = value ?? 0
		} else {
			options.heuresSupplémentaires = value ?? 0
		}
		onOptionsChange(index, options)
	}

	return (
		<Appear>
			<InputContainer id={`options-${month}`}>
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
						value={
							isTempsPartiel
								? options.heuresComplémentaires
								: options.heuresSupplémentaires
						}
						onChange={onChange}
						aria-labelledby={`heures-${additionalHours}-label`}
						displayedUnit="heures"
					/>
				</NumberFieldContainer>
			</InputContainer>
		</Appear>
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

const InputContainer = styled.div`
	${FlexCenter}
	gap: ${({ theme }) => theme.spacings.md};
`
const FlexDiv = styled.div`
	${FlexCenter}
	justify-content: end;
`
const StyledSmallBody = styled(SmallBody)`
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
