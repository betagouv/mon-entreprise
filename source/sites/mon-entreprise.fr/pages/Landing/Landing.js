/* @flow */

import { T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import logoEnSvg from 'Images/logo-mycompany.svg'
import logoSvg from 'Images/logo.svg'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Footer from '../../layout/Footer/Footer'
import illustrationSvg from './illustration.svg'
import './Landing.css'
import type { SitePaths } from 'Components/utils/withSitePaths'

type Props = {
	sitePaths: SitePaths
}
export default withSitePaths(({ sitePaths }: Props) => {
	const {
		i18n: { language }
	} = useTranslation()

	return (
		<div className="app-content">
			<div className="ui__ container landing-header">
				<Link className="landing-header__brand-logo" to={sitePaths.index}>
					<img
						alt="logo mon-entreprise.fr"
						src={language === 'fr' ? logoSvg : logoEnSvg}
					/>
				</Link>
				<div style={{ flex: 1 }} />
				<a
					href="https://beta.gouv.fr"
					target="_blank"
					className="landing-header__institutional-logo">
					<img alt="logo marianne" src={marianneSvg} />
				</a>
				<a
					href="https://www.urssaf.fr"
					target="_blank"
					className="landing-header__institutional-logo">
					<img alt="logo urssaf" src={urssafSvg} />
				</a>
			</div>
			<section className="ui__ container landing-title">
				<img
					alt="logo mon-entreprise.fr"
					className="landing-title__logo"
					src={logoSvg}
				/>
				<header>
					<h1>
						<T k="landing.title">
							L'assistant officiel du créateur d'entreprise
						</T>
					</h1>
					<p className="ui__ lead">
						<T k="landing.subtitle">
							Les ressources nécessaires pour développer votre activité, du
							statut juridique à l'embauche.
						</T>
					</p>
				</header>
				<img src={illustrationSvg} className="landing-title__img" />
			</section>
			<section className="ui__ full-width light-bg center-flex">
				<Link
					className="ui__ interactive card box"
					to={sitePaths.entreprise.index}>
					<div className="ui__ big box-icon">{emoji('💡')}</div>
					<T k="landing.choice.create">
						<h3>Créer une entreprise</h3>
						<p className="ui__ notice" css="flex: 1">
							Un accompagnement au choix du statut et la liste complète des
							démarches de création
						</p>
					</T>
					<div className="ui__ small simple button">
						<T>Commencer</T>
					</div>
				</Link>
				<Link
					className="ui__ interactive card box "
					to={sitePaths.sécuritéSociale.index}>
					<div className="ui__ big box-icon">{emoji('💶')}</div>
					<T k="landing.choice.manage">
						<h3>Gérer mon activité</h3>
						<p className="ui__ notice" css="flex: 1">
							Des simulateurs pour anticiper le montant des cotisation et mieux
							gérer votre trésorerie
						</p>
					</T>
					<div className="ui__ small simple button">
						<T>Commencer</T>
					</div>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={sitePaths.économieCollaborative.index}>
					<div className="ui__ big box-icon">{emoji('🙋')}</div>
					<T k="landing.choice.declare">
						<h3>Que dois-je déclarer ?</h3>
						<p className="ui__ notice" css="flex: 1">
							Un guide pour savoir comment déclarer vos revenus issus de
							plateformes en ligne (AirBnb, leboncoin, blablacar, etc.)
						</p>
					</T>
					<div className="ui__ small simple button">
						<T>Commencer</T>
					</div>
				</Link>
			</section>

			<section className="ui__ container">
				<T k="landing.aboutUs">
					<h2>Qui sommes-nous ?</h2>
					<p>
						Ce site a été développé par l’administration pour{' '}
						<strong>accompagner les créateurs d’entreprise</strong> dans le
						développement de leur activité.
					</p>
					<p>
						Nous partons du constat qu’il est{' '}
						<strong>difficile de s’y retrouver</strong> dans toute la
						documentation en ligne : il manque d'informations claires, à jour et
						pertinentes sur la création d'entreprise.
					</p>
					<p>
						Notre objectif est de{' '}
						<strong>
							lever toutes les incertitudes vis à vis de l’administration
						</strong>{' '}
						afin que vous puissiez vous concentrer sur ce qui compte : votre
						activité.
					</p>
					<p>
						Nous sommes une petite{' '}
						<strong>équipe autonome et pluridisciplinaire</strong> au sein de l’
						<a href="https://urssaf.fr">URSSAF</a>. Nous avons à coeur d’être au
						plus proche de nos usagers afin d’améliorer en permanence ce site
						conformément à la méthode des{' '}
						<a href="https://beta.gouv.fr">Startup d’État</a>.
					</p>
					<p>
						N’hésitez pas à nous remonter vos remarques et suggestions à{' '}
						<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
							contact@mon-entreprise.beta.gouv.fr
						</a>
						.
					</p>
				</T>
			</section>

			<Footer />
		</div>
	)
})
