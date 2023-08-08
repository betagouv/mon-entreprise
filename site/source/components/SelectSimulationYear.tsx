import { Evaluation } from 'publicodes'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import Banner from '@/components/Banner'
import { Link as DesignSystemLink } from '@/design-system/typography/link'
import { updateSituation } from '@/store/actions/actions'
import {
	usePromiseOnSituationChange,
	useWorkerEngine,
} from '@/worker/socialWorkerEngineClient'

const Bold = styled.span<{ $bold: boolean }>`
	${({ $bold }) => ($bold ? 'font-weight: bold;' : '')}
`

export const SelectSimulationYear = () => {
	const dispatch = useDispatch()
	const workerEngine = useWorkerEngine()
	const year = usePromiseOnSituationChange(
		() => workerEngine.asyncEvaluateWithEngineId('date'),
		[workerEngine]
	)
	const choices = [2022, 2023]

	const actualYear = Number(
		(year?.nodeValue?.toString().slice(-4) as Evaluation<number>) ||
			new Date().getFullYear()
	)

	return (
		<Banner hideAfterFirstStep={false} icon={'📅'}>
			<Trans i18nKey="pages.simulateurs.select-year.info">
				Cette simulation concerne l'année{' '}
				<Bold $bold={actualYear !== 2023}>{{ actualYear }}</Bold>.{' '}
			</Trans>
			<>
				{choices
					.filter((year) => year !== actualYear)
					.map((year) => (
						<span key={year}>
							<DesignSystemLink
								onPress={() =>
									dispatch(updateSituation('date', `01/01/${year}`))
								}
							>
								{actualYear === 2023 ? (
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
