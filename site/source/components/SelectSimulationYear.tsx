import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import Banner from '@/components/Banner'
import { Link } from '@/design-system/typography/link'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { getCurrentYear, getYearsBetween } from '@/utils/dates'

import useYear from './utils/useYear'

const Bold = styled.span<{ $bold: boolean }>`
	${({ $bold }) => ($bold ? 'font-weight: bold;' : '')}
`

export const SelectSimulationYear = () => {
	const dispatch = useDispatch()
	const currentYear = getCurrentYear()
	const choices = getYearsBetween(2023, currentYear)
	const currentEngineYear = useYear()

	return (
		<Banner hideAfterFirstStep={false} icon={'📅'}>
			<Trans i18nKey="pages.simulateurs.select-year.info">
				Cette simulation concerne l'année{' '}
				<Bold $bold={currentEngineYear !== currentYear}>
					{{ currentEngineYear }}
				</Bold>
				.{' '}
			</Trans>
			<>
				{choices
					.filter((year) => year !== currentEngineYear)
					.reverse()
					.map((year) => (
						<span key={year}>
							<StyledLink
								onPress={() =>
									dispatch(enregistreLaRéponse('date', `01/01/${year}`))
								}
							>
								{year === currentYear ? (
									<Trans i18nKey="pages.simulateurs.select-year.back">
										Retourner au simulateur {{ year }}
									</Trans>
								) : (
									<Trans i18nKey="pages.simulateurs.select-year.access">
										Accéder au simulateur {{ year }}
									</Trans>
								)}
							</StyledLink>
						</span>
					))}
			</>
		</Banner>
	)
}

const StyledLink = styled(Link)`
	margin-right: ${({ theme }) => theme.spacings.xs};
`
