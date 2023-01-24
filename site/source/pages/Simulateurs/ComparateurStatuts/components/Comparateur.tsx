import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { DottedName } from '@/../../modele-social'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Spacing } from '@/design-system/layout'
import Popover from '@/design-system/popover/Popover'
import Documentation from '@/pages/Documentation'

import Détails from './Détails'
import Résultats from './Résultats'

type ComparateurProps = {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}

function Comparateur({ engines }: ComparateurProps) {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [assimiléEngine, indépendantEngine, autoEntrepreneurEngine] = engines

	return (
		<>
			<Simulation
				engines={engines}
				hideDetails
				showQuestionsFromBeginning
				fullWidth
				id="simulation-comparateur"
			>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend={'Estimations sur votre rémunération brute et vos charges'}
				>
					<SimulationGoal
						dottedName="entreprise . chiffre d'affaires"
						isInfoMode
						label={t("Chiffre d'affaires estimé")}
					/>
					<SimulationGoal dottedName="entreprise . charges" isInfoMode />
				</SimulationGoals>
			</Simulation>
			<Spacing md />
			<Résultats engines={engines} />
			<Détails engines={engines} />
			<Routes>
				<Route
					path="SASU/*"
					element={
						<div>
							<Popover
								isOpen
								isDismissable
								onClose={() => {
									navigate(-1)
								}}
							>
								<Documentation
									engine={assimiléEngine}
									documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
								/>
							</Popover>
						</div>
					}
				/>
				<Route
					path="EI/*"
					element={
						<div>
							<Popover
								isOpen
								isDismissable
								onClose={() => {
									navigate(-1)
								}}
							>
								<Documentation
									engine={indépendantEngine}
									documentationPath="/simulateurs/comparaison-régimes-sociaux/EI"
								/>
							</Popover>
						</div>
					}
				/>
				<Route
					path="auto-entrepreneur/*"
					element={
						<div>
							<Popover
								isOpen
								isDismissable
								onClose={() => {
									navigate(-1)
								}}
							>
								<Documentation
									engine={autoEntrepreneurEngine}
									documentationPath="/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur"
								/>
							</Popover>
						</div>
					}
				/>
			</Routes>
		</>
	)
}

export default Comparateur
