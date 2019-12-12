import { setSimulationConfig } from 'Actions/actions'
import { SimulateurWarning } from 'Components/SimulateurWarning'
import retraiteConfig from 'Components/simulationConfigs/retraite.yaml'
import TargetSelection from 'Components/TargetSelection'
import { default as React } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'

export default function Salarié() {
	const dispatch = useDispatch()
	dispatch(setSimulationConfig(retraiteConfig))
	return (
		<>
			<Helmet>
				<title>Comparaison de retraite avant / après réforme</title>
			</Helmet>
			<div className="ui__ container">
				<h1>Comparateur réforme des retraites</h1>
				<SimulateurWarning name="retraite">
					<p>
						<strong>
							Attention ! Ce simulateur est en cours de développement.
						</strong>{' '}
						Il s'appuie sur les hypothèses suivantes :{' '}
					</p>
					<ul>
						<li>Durée de cotisation de 43 trimestres (age pivôt actuel)</li>
						<li>
							Salarié du privé, sans interruption et sans variation de salaire
						</li>
						<li>
							Pas de prise en compte de l'évolution du prix d'achat du point
							pour les années passée et futures
						</li>
						<li>Pas de prise en compte de l'inflation</li>
						<li>Pension de retraite brute, avant prélèvements</li>
						<li>Pas de prise en compte des enfants</li>
					</ul>
					<p>
						Il donne en revanche un aperçu honnête dans les limites de ce cas
						"basique"
					</p>
				</SimulateurWarning>
				<TargetSelection />
			</div>
		</>
	)
}
