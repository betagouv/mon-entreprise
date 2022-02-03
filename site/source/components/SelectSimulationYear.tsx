import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Link as DesignSystemLink } from 'DesignSystem/typography/link'
import { EngineContext } from 'Components/utils/EngineContext'
import Banner from 'Components/Banner'
import { updateSituation } from 'Actions/actions'

interface SelectSimulationYearProps {
	hideAfterFirstStep?: boolean
}

export const SelectSimulationYear = ({
	hideAfterFirstStep = true,
}: SelectSimulationYearProps) => {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { année } = useSelector(situationSelector)
	const { valeur } = engine.getRule('année').explanation
	const choices = [2021, 2022]

	const actualYear =
		année ||
		(valeur.nodeKind === 'constant' && valeur.type === 'number'
			? valeur.nodeValue
			: new Date().getFullYear())

	return (
		<Banner hideAfterFirstStep={hideAfterFirstStep} icon={'📅'}>
			<Trans i18nKey="aide-déclaration-indépendant.banner">
				Cette simulation concerne l'année {actualYear + ''}. Accéder au
				simulateur{' '}
				<>
					{choices
						.filter((year) => year !== actualYear)
						.map((year, i) => (
							<span key={year}>
								{i !== 0 && ', '}
								<DesignSystemLink
									onPress={() => dispatch(updateSituation('année', year))}
									title={t("cliquez pour changer d'année")}
								>
									{year + ''}
								</DesignSystemLink>
							</span>
						))}
				</>
			</Trans>
		</Banner>
	)
}
