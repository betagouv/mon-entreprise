import { React, T } from 'Components'
import Banner from 'Components/Banner'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { Markdown } from 'Components/utils/markdown'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default compose(
	withTranslation(),
	withLanguage
)(function Salarié({ t, language }) {
	const isEmbedded = React.useContext(IsEmbeddedContext)
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.salarié.page.titre',
						`Calcul du salaire net et brut : simulateur officiel`
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.salarié.page.description',
						'Estimez les cotisations pour un salarié à partir du salaire brut, net ou "superbrut". Prise en compte de toutes les cotisations du régime général et de l\'impôt sur le revenu. Découvrez les contreparties garanties par sécurité sociale'
					)}
				/>
			</Helmet>
			<h1>
				<T k="simulateurs.salarié.titre">Simulateur de revenus pour salarié</T>
			</h1>
			<div style={{ margin: '2rem' }} />
			{language === 'fr' && (
				<Banner icon="✨">
					Le simulateur d'embauche évolue et devient{' '}
					<strong>mon-entreprise.fr !</strong>{' '}
					<a href="https://blog.beta.gouv.fr/dinsic/2019/06/11/embauche-beta-gouv-fr-devient-mon-entreprise-fr/">
						Lire nos explications
					</a>
				</Banner>
			)}
			<SalarySimulation />
			{!isEmbedded && <SalariéExplications />}
		</>
	)
})

const SalariéExplications = withSitePaths(({ sitePaths }) => (
	<Markdown
		source={`
## Calculer son salaire net

Lors de l'entretien d'embauche l'employeur propose en général une rémunération exprimée en « brut ». Le montant annoncé inclut ainsi les cotisations salariales, qui servent à financer la protection sociale du salarié (retraite, maladie, famille, etc.) et qui sont retranchées du salaire « net » perçu par le salarié.

Vous pouvez utiliser notre simulateur pour convertir le **salaire brut en net** : il vous suffit pour cela saisir la rémunération annoncée dans la case salaire brut. La simulation peut-être affinée en répondant aux différentes questions (sur le CDD, statut cadre, etc.).

Par ailleurs depuis 2019, l'[impôt sur le revenu](/documentation/impôt/impôt-sur-le-revenu) est prélevé à la source. Pour ce faire, la direction générale des finances publiques (DGFiP) transmet à l'employeur le taux d'imposition calculé à partir de la déclaration de revenu du salarié. Si ce taux est inconnu, par exemple lors d'une première année d'activité, l'employeur utilise le [taux neutre](/documentation/impôt/neutre). C'est aussi le taux neutre que nous utilisons dans le simulateur pour calculer le « net après impôt » qui est versé sur le compte bancaire du salarié.

Attention : L'impôt sur le revenu est calculé à partir du [salaire net imposable](/documentation/contrat-salarié/rémunération/net-imposable) qui inclut certaines cotisations non déductibles et les avantages en nature en plus du salaire net.

## Coût d'embauche

Si vous cherchez à embaucher, vous pouvez calculer le coût total de la rémunération de votre salarié, ainsi que les montants de cotisations patronales et salariales correspondants. Cela vous permet de définir le niveau de rémunération en connaissant le montant global de charge que cela représente pour votre entreprise.

En plus du salaire, notre simulateur prend en compte le calcul des avantages en nature (téléphone, véhicule de fonction, etc.), ainsi que la mutuelle santé obligatoire.

Il existe des [aides différées](/documentation/aides-employeur) à l'embauche qui ne sont pas prises en compte par notre simulateur, vous pouvez les retrouver sur [le portail officiel](http://www.aides-entreprises.fr).
`}
	/>
))

export let SalarySimulation = compose(
	withSimulationConfig(salariéConfig),
	withSitePaths
)(({ sitePaths }) => (
	<>
		<Simulation
			explanations={
				<SalaryExplanation
					protectionText={
						<p className="ui__ notice">
							{emoji('☂️')}{' '}
							<T k="simulateurs.salarié.description">
								Dès que l'embauche d'un salarié est déclarée et qu'il est payé,
								il est couvert par le régime général de la Sécurité sociale
								(santé, maternité, invalidité, vieillesse, maladie
								professionnelle et accidents) et chômage.
							</T>
						</p>
					}
				/>
			}
			customEndMessages={
				<>
					<T k="simulation-end.hiring.text">
						Vous pouvez maintenant concrétiser votre projet d'embauche.
					</T>
					{sitePaths.démarcheEmbauche && (
						<div style={{ textAlign: 'center', margin: '1rem' }}>
							<Link
								className="ui__ plain button"
								to={sitePaths.démarcheEmbauche.index}>
								<T k="simulation-end.cta">Connaître les démarches</T>
							</Link>
						</div>
					)}
				</>
			}
		/>
		<PreviousSimulationBanner />
	</>
))
