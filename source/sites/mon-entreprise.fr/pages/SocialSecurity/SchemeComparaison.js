import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import Animate from 'Ui/animate'
import './SchemeComparaison.css'

const SchemeComparaisonPage = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié, indépendant, auto-entrepreneur : comparaison des
				régimes
			</title>
			<meta
				name="description"
				content="A partir d'un chiffre d'affaire donné, comparez le revenus net obtenu
				après paiement des cotisations sociale et impôts pour les différents
				régimes."
			/>
		</Helmet>
		<Animate.fromBottom>
			<h1>Quel régime choisir pour l'indépendant ?</h1>

			<div className="ui__ full-width">
				<div className="comparaison-grid ">
					<h2 className="AS">
						{emoji('☂')} Assimilé salarié
						<small>Le régime tout compris</small>
					</h2>
					<h2 className="indep">
						{emoji('👩‍🔧')} Indépendant
						<small>La protection à la carte</small>
					</h2>
					<h2 className="auto">
						{emoji('🚶‍♂️')} Auto-entrepreneur
						<small>Pour les petites activités</small>
					</h2>

					<div className="legend">Sécurité sociale</div>
					<div className="AS">Régime général</div>
					<div className="indep-et-auto">
						Sécurité sociale des indépendants (SSI)
					</div>

					<div className="legend">Assurance maladie</div>
					<div className="green AS">++</div>
					<div className="green indep-et-auto">+</div>

					<div className="legend">Indémnités journalières</div>
					<div className="green AS">++</div>
					<div className="indep-et-auto green">+</div>

					<div className="legend">Accidents du travail couverts</div>
					<div className="AS">Oui</div>
					<div className="indep-et-auto">Non</div>
					<div className="legend">Retraite</div>
					<div className="green AS">++</div>
					<div className="green indep">+</div>
					<div className="red auto">−</div>
					<div className="all">
						<h3>Comparez vos revenus et votre retraite en 1 minute</h3>
						<button className="ui__ cta plain button">Commencer</button>
					</div>
					<div className="legend">Paiment des cotisations</div>
					<div className="AS">Mensuel (à la source)</div>
					<div className="indep">Annuel avec deux ans de décalage</div>
					<div className="auto">Mensuel ou trimestriel</div>

					<div className="legend">ACCRE</div>
					<div className="AS-et-indep">Une année, plafonné</div>
					<div className="auto">3 années, progressif, non plafonné</div>

					<div className="legend">Déduction des charges</div>
					<div className="AS-et-indep">Régime réel </div>
					<div className="auto">Abattement forfaitaire </div>

					<div className="legend">Comptabilité</div>
					<div className="AS">Expert&nbsp;{emoji('😩')}</div>
					<div className="indep">Compliquée&nbsp;{emoji('😔')}</div>
					<div className="auto">Simplifiée&nbsp;{emoji('😌')}</div>

					<div className="legend">
						Complémentaires retraite et santé déductibles
					</div>
					<div className="AS">Oui (jusqu'à 50%)</div>
					<div className="indep">Oui (Loi Madelin)</div>
					<div className="auto">Non</div>

					<div className="legend">Statuts juridiques</div>
					<div className="AS">SAS, SASU, SARL minoritaire</div>
					<div className="indep">EI, EURL, SARL majoritaire</div>
					<div className="auto">Micro-entreprise</div>

					<button className="AS ui__ button">Choisir ce régime</button>
					<button className="indep ui__ button">Choisir ce régime</button>
					<button className="auto ui__ button">Choisir ce régime</button>
				</div>
			</div>
		</Animate.fromBottom>
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
