import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import Banner from '@/components/Banner'
import { EngineContext } from '@/components/utils/EngineContext'
import { Link as DesignSystemLink } from '@/design-system/typography/link'
import { enregistreLaRéponse } from '@/store/actions/actions'

const Bold = styled.span<{ $bold: boolean }>`
	${({ $bold }) => ($bold ? 'font-weight: bold;' : '')}
`

export const SelectSimulationYear = () => {
	const dispatch = useDispatch()
	const year = useContext(EngineContext).evaluate('date')
	const choices = [2023, 2024]

	const actualYear = Number(
		year.nodeValue?.toString().slice(-4) || new Date().getFullYear()
	)

	// return null // Waiting for next year.

	return (
		<Banner hideAfterFirstStep={false} icon={'📅'}>
			<Trans i18nKey="pages.simulateurs.select-year.info">
				Cette simulation concerne l'année{' '}
				<Bold $bold={actualYear !== 2024}>{{ actualYear }}</Bold>.{' '}
			</Trans>
			<>
				{choices
					.filter((year) => year !== actualYear)
					.map((year) => (
						<span key={year}>
							<DesignSystemLink
								onPress={() =>
									dispatch(enregistreLaRéponse('date', `01/01/${year}`))
								}
							>
								{actualYear === 2024 ? (
									<Trans i18nKey="pages.simulateurs.select-year.access">
										Accéder au simulateur {{ year }}
									</Trans>
								) : (
									<Trans i18nKey="pages.simulateurs.select-year.back">
										Retourner au simulateur {{ year }}
									</Trans>
								)}
							</DesignSystemLink>
						</span>
					))}
			</>
		</Banner>
	)
}
