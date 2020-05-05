import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function useSimulatorsMetadata() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	type SimulatorMetaData = {
		name: string
		icône: string
		description?: string
		sitePath: string
	}

	return [
		{
			name: t('Assimilé salarié'),
			icône: '☂️',
			description: t(
				'simulateurs.résumé.assimilé',
				"Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire"
			),
			sitePath: sitePaths.simulateurs['assimilé-salarié']
		},
		{
			name: t('Indépendant'),
			icône: '👩‍🔧',
			description: t(
				'simulateurs.résumé.indépendant',
				"Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire"
			),
			sitePath: sitePaths.simulateurs.indépendant
		},
		{
			name: t('Auto-entrepreneur'),
			icône: '🚶‍♂️',
			description: t(
				'simulateurs.résumé.auto',
				"Calculer le revenu (ou le chiffre d'affaires) d'un auto-entrepreneur"
			),
			sitePath: sitePaths.simulateurs['auto-entrepreneur']
		},
		{
			name: t('Salarié'),
			icône: '🤝',
			description: t(
				'simulateurs.résumé.salarié',
				"Calculer le salaire net, brut, ou total d'un salarié, stagiaire,ou assimilé"
			),
			sitePath: sitePaths.simulateurs.salarié
		},
		{
			name: t('Artiste-auteur'),
			icône: '👩‍🎨',
			description: t(
				'simulateurs.résumé.artiste-auteur',
				"Estimer les cotisations sociales d'un artiste ou auteur"
			),
			sitePath: sitePaths.simulateurs['artiste-auteur']
		},
		{
			name: t('Comparaison statuts'),
			icône: '📊',
			description: t(
				'simulateurs.résumé.comparaison',
				'Simulez les différences entre les régimes (cotisations,retraite, maternité, maladie, etc.)'
			),
			sitePath: sitePaths.simulateurs.comparaison
		},
		{
			name: t('Coronavirus'),
			icône: '👨‍🔬',
			sitePath: sitePaths.coronavirus
		},
		{
			name: t('Maternité'),
			icône: '👶',
			description: 'Simulez un congé maternité ou parental',
			sitePath: sitePaths.simulateurs.maternité
		}
	] as Array<SimulatorMetaData>
}

export default function Simulateurs() {
	const { t } = useTranslation()
	const simulatorsMetadata = useSimulatorsMetadata()
	const titre = t('simulateurs.accueil.titre', 'Simulateurs disponibles')
	return (
		<>
			<Helmet>
				<title>{titre}</title>
			</Helmet>

			<section className="ui__ full-width light-bg">
				<h1 css="min-width: 100%; text-align: center">{titre}</h1>
				<div className="ui__ center-flex">
					{simulatorsMetadata
						.filter(({ name }) => name !== 'Coronavirus')
						.map(({ name, description, sitePath, icône }) => (
							<Link
								className="ui__ interactive card box"
								key={sitePath}
								to={{
									state: { fromSimulateurs: true },
									pathname: sitePath
								}}
							>
								<div className="ui__ big box-icon">{emoji(icône)}</div>
								<h3>{name}</h3>
								<p className="ui__ notice" css="flex: 1">
									{description}
								</p>
							</Link>
						))}
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
