import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import simulatorSvg from './images/illustration-simulateur.svg'
import useSimulatorsData, { SimulatorData } from './metadata'
import { SitePathsContext } from 'Components/utils/SitePathsContext'

export default function Simulateurs() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const simulators = useSimulatorsData()
	const titre = t('simulateurs.accueil.titre', 'Simulateurs disponibles')
	return (
		<>
			<Helmet>
				<title>{titre}</title>
			</Helmet>
			<section css="display: flex; align-items: flex-start; justify-content: space-between">
				<div>
					<h1>{titre}</h1>
					<p className="ui__ lead">
						<Trans i18nKey="créer.description">
							Tous les simulateurs sur ce site sont maintenus à jour avec les
							dernières évolutions législatives.
						</Trans>
					</p>
					<Link
						className="ui__ button plain cta"
						to={sitePaths.integration.iframe}
					>
						<Trans>Intégrer un simulateur</Trans>
					</Link>
					{/* <p className="ui__ notice">
						<Trans i18nKey="créer.warningPL">
							Le cas des professions libérales réglementées n'est pas encore
							traité
						</Trans>
					</p> */}
				</div>

				<img
					className="ui__ hide-mobile"
					src={simulatorSvg}
					css="margin-left: 3rem; max-width: 15rem; transform: translateX(2rem) translateY(3rem) scale(1.4);"
				/>
			</section>
			<section className="ui__ full-width light-bg">
				<h2 css="min-width: 100%; text-align: center">
					Salariés et employeurs
				</h2>
				<div className="ui__ center-flex">
					<SimulateurCard {...simulators.salarié} />
					<SimulateurCard {...simulators['chômage-partiel']} />
				</div>
			</section>
			<section>
				<h2>Par type de société</h2>
				<div
					className="ui__ center-flex"
					css={`
						margin: 0 -1rem;
						> .card {
							border: 4px solid var(--lighterColor);
						}
					`}
				>
					<SimulateurCard {...simulators['auto-entrepreneur']} />
					<SimulateurCard {...simulators.indépendant} />
					<SimulateurCard {...simulators.sasu} />
				</div>

				<h2>Par métier</h2>
				<div
					css={`
						display: flex;
						flex-wrap: wrap;
						margin: 0 -1rem;
						> .card {
							border: 4px solid var(--lighterColor);
						}
					`}
				>
					<SimulateurCard {...simulators['artiste-auteur']} />
					<SimulateurCard {...simulators['profession-libérale']} />
				</div>
				<h3>
					<small>Professionnels de santé {emoji('🏥')}</small>
				</h3>
				<div
					className="ui__ center-flex"
					css={`
						margin: 0 -0.5rem;
						> .card {
							border: 4px solid var(--lighterColor);
						}
					`}
				>
					<SimulateurCard small {...simulators['auxiliaire-médical']} />
					<SimulateurCard small {...simulators['chirurgien-dentiste']} />
					<SimulateurCard small {...simulators.médecin} />
					<SimulateurCard small {...simulators['sage-femme']} />
				</div>
			</section>

			<section className="ui__ full-width light-bg">
				<h2 css="min-width: 100%; text-align: center">Autres outils</h2>
				<div className="ui__ center-flex">
					<SimulateurCard {...simulators['demande-mobilité']} />
					<SimulateurCard {...simulators['comparaison-statuts']} />
					<SimulateurCard {...simulators['économie-collaborative']} />
					<SimulateurCard {...simulators['aide-déclaration-indépendant']} />
				</div>
			</section>
			<section>
				<Trans i18nKey="simulateurs.accueil.description">
					<p>Tous les simulateurs sur ce site sont :</p>
					<ul>
						<li>
							<strong>Maintenus à jour</strong> avec les dernières évolutions
							législatives
						</li>
						<li>
							<strong>Améliorés en continu</strong> afin d'augmenter le nombre
							de dispositifs pris en compte
						</li>
						<li>
							Développés en <strong>partenariat avec l'Urssaf</strong>
						</li>
					</ul>
				</Trans>
			</section>
		</>
	)
}

function SimulateurCard({
	small = false,
	shortName,
	meta,
	path,
	icône
}: SimulatorData[keyof SimulatorData] & { small?: boolean }) {
	return (
		<Link
			className={classnames('ui__ interactive card box', { small })}
			key={path}
			to={{
				state: { fromSimulateurs: true },
				pathname: path
			}}
		>
			<div className={classnames('ui__ box-icon', { big: !small })}>
				{emoji(icône)}
			</div>
			{small ? shortName : <h3>{shortName}</h3>}
			{!small && meta?.description && (
				<p className="ui__ notice" css="flex: 1">
					{meta.description}
				</p>
			)}
		</Link>
	)
}
