import { setSimulationConfig } from 'Actions/actions'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import urlIllustrationNetBrutEn from 'Images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from 'Images/illustration-net-brut.png'
import { default as React, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

export default function Salarié() {
	const { t } = useTranslation()

	const isEmbedded = React.useContext(IsEmbeddedContext)
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.salarié.page.titre',
						`Calcul du salaire brut / net : le simulateur de l'Urssaf`
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.salarié.page.description',
						'Estimez les cotisations sociales pour un salarié à partir du salaire brut, net ou "superbrut". Prise en compte de toutes les cotisations du régime général et de l\'impôt sur le revenu. Découvrez les contreparties garanties par sécurité sociale'
					)}
				/>
			</Helmet>
			<h1>
				<Trans i18nKey="simulateurs.salarié.titre">
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
	const { t, i18n } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return (
		<Trans i18nKey="simulateurs.salarié.page.explication seo">
			<h2>Calculer son salaire net</h2>

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
				peut-être affinée en répondant aux différentes questions (sur le CDD,
				statut cadre, etc.).
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
				<Link to={sitePaths.documentation.rule('impôt . impôt sur le revenu')}>
					impôt sur le revenu
				</Link>{' '}
				est prélevé à la source. Pour ce faire, la direction générale des
				finances publiques (DGFiP) transmet à l'employeur le taux d'imposition
				calculé à partir de la déclaration de revenu du salarié. Si ce taux est
				inconnu, par exemple lors d'une première année d'activité, l'employeur
				utilise le{' '}
				<Link
					to={sitePaths.documentation.rule(
						"impôt . taux neutre d'impôt sur le revenu"
					)}
				>
					taux neutre
				</Link>
				.
			</p>

			<h2>Coût d'embauche</h2>

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
				<Link
					to={sitePaths.documentation.rule('contrat salarié . aides employeur')}
				>
					aides différées
				</Link>{' '}
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

export let SalarySimulation = () => {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	dispatch(setSimulationConfig(salariéConfig, location.state?.fromGérer))
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<Simulation
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
			<PreviousSimulationBanner />
		</>
	)
}
