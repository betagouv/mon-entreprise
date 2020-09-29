import Banner from 'Components/Banner'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import RuleLink from 'Components/RuleLink'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import urlIllustrationNetBrutEn from './images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from './images/illustration-net-brut.png'
import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'

export default function Salarié() {
	const { t, i18n } = useTranslation()
	const META = {
		title: t(
			'pages.simulateurs.salarié.meta.titre',
			'Salaire brut / net : le convertisseur Urssaf'
		),
		description: t(
			'pages.simulateurs.salarié.meta.description',
			"Calcul du salaire net, net après impôt et coût total employeur. Beaucoup d'options disponibles (cadre, stage, apprentissage, heures supplémentaires, etc.)"
		),
		ogTitle: t(
			'pages.simulateurs.salarié.meta.ogTitle',
			'Salaire brut, net, net après impôt, coût total : le simulateur ultime pour salariés et employeurs'
		),
		ogDescription: t(
			'pages.simulateurs.salarié.meta.ogDescription',
			"En tant que salarié, calculez immédiatement votre revenu net après impôt à partir du brut mensuel ou annuel. En tant qu'employé, estimez le coût total d'une embauche à partir du brut. Ce simulateur est développé avec les experts de l'Urssaf, et il adapte les calculs à votre situation (statut cadre, stage, apprentissage, heures supplémentaire, titre-restaurants, mutuelle, temps partiel, convention collective, etc.)"
		),
		ogImage:
			i18n.language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN
	}
	const isEmbedded = React.useContext(IsEmbeddedContext)
	return (
		<>
			<Meta {...META} />
			<h1>
				<Trans i18nKey="pages.simulateurs.salarié.titre">
					Simulateur de revenus pour salarié
				</Trans>
			</h1>
			<div style={{ margin: '2rem' }} />
			<SalarySimulation />
			{!isEmbedded && <SeoExplanations />}
		</>
	)
}

function SeoExplanations() {
	const { i18n } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.salarié.explication seo">
			<h2>Comment calculer le salaire net ?</h2>

			<p>
				Lors de l'entretien d'embauche l'employeur propose en général une
				rémunération exprimée en « brut ». Le montant annoncé inclut ainsi les
				cotisations salariales, qui servent à financer la protection sociale du
				salarié et qui sont retranchées du salaire « net » perçu par le salarié.
			</p>
			<p>
				Vous pouvez utiliser notre simulateur pour convertir le{' '}
				<strong>salaire brut en net</strong> : il vous suffit pour cela saisir
				la rémunération annoncée dans la case salaire brut. La simulation
				peut-être affinée en répondant aux différentes questions (CDD, statut
				cadre, heures supplémentaires, temps partiel, titre-restaurants, etc.).
			</p>
			<img
				src={
					i18n.language === 'fr'
						? urlIllustrationNetBrut
						: urlIllustrationNetBrutEn
				}
				css={`
					width: 100%;
				`}
			/>
			<p>
				Par ailleurs depuis 2019, l'
				<RuleLink dottedName="impôt">impôt sur le revenu</RuleLink> est prélevé
				à la source. Pour ce faire, la direction générale des finances publiques
				(DGFiP) transmet à l'employeur le taux d'imposition calculé à partir de
				la déclaration de revenu du salarié. Si ce taux est inconnu, par exemple
				lors d'une première année d'activité, l'employeur utilise le{' '}
				<RuleLink dottedName="impôt . taux neutre d'impôt sur le revenu">
					taux neutre
				</RuleLink>
				.
			</p>

			<h2>Comment calculer le coût d'embauche ?</h2>

			<p>
				Si vous cherchez à embaucher, vous pouvez calculer le coût total de la
				rémunération de votre salarié, ainsi que les montants de cotisations
				patronales et salariales correspondants. Cela vous permet de définir le
				niveau de rémunération en connaissant le montant global de charge que
				cela représente pour votre entreprise.
			</p>

			<p>
				En plus du salaire, notre simulateur prend en compte le calcul des
				avantages en nature (téléphone, véhicule de fonction, etc.), ainsi que
				la mutuelle santé obligatoire.
			</p>

			<p>
				Il existe des{' '}
				<RuleLink dottedName="contrat salarié . aides employeur">
					aides différées
				</RuleLink>{' '}
				à l'embauche qui ne sont pas toutes prises en compte par notre
				simulateur, vous pouvez les retrouver sur{' '}
				<a href="http://www.aides-entreprises.fr" target="_blank">
					le portail officiel
				</a>
				.
			</p>
		</Trans>
	)
}

export const SalarySimulation = () => {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<Simulation
				config={salariéConfig}
				explanations={<SalaryExplanation />}
				customEndMessages={
					<>
						<Trans i18nKey="simulation-end.hiring.text">
							Vous pouvez maintenant concrétiser votre projet d'embauche.
						</Trans>
						<div style={{ textAlign: 'center', margin: '1rem' }}>
							<Link
								className="ui__ plain button"
								to={sitePaths.gérer.embaucher}
							>
								<Trans i18nKey="simulation-end.cta">
									Connaître les démarches
								</Trans>
							</Link>
						</div>
					</>
				}
			/>
			<br />
			<PreviousSimulationBanner />
			<Banner icon={'👨‍✈️'}>
				<Trans>
					Vous êtes dirigeant d'une SAS(U) ?{' '}
					<Link to={sitePaths.simulateurs.SASU}>
						Accéder au simulateur de revenu dédié
					</Link>
				</Trans>
			</Banner>
		</>
	)
}
