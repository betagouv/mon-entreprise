import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Link as DesignSystemLink } from 'DesignSystem/typography/link'
import { EngineContext } from 'Components/utils/EngineContext'
import Banner from 'Components/Banner'
import { updateSituation } from 'Actions/actions'
import styled from 'styled-components'

const Bold = styled.span<{ bold: boolean }>`
	${({ bold }) => (bold ? 'font-weight: bold;' : '')}
`

export const SelectSimulationYear = () => {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { année } = useSelector(situationSelector)
	const { valeur } = engine.getRule('année').explanation
	const choices = [2021, 2022]

	const actualYear =
		année ||
		(valeur.nodeKind === 'constant' && valeur.type === 'number'
			? (valeur.nodeValue as number)
			: new Date().getFullYear())

	return (
		<Banner hideAfterFirstStep={false} icon={'📅'}>
			<Trans i18nKey="pages.simulateurs.select-year.info">
				Cette simulation concerne l'année{' '}
				<Bold bold={actualYear !== 2022}>{{ actualYear }}</Bold>.{' '}
			</Trans>
			<>
				{choices
					.filter((year) => year !== actualYear)
					.map((year) => (
						<span key={year}>
							<DesignSystemLink
								onPress={() => dispatch(updateSituation('année', year))}
								title={t(
									'pages.simulateurs.select-year.click-to-change-year',
									"Cliquez pour changer d'année"
								)}
							>
								{actualYear === 2022 ? (
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
