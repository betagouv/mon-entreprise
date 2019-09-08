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
import urlIllustrationNetBrutEn from 'Images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from 'Images/illustration-net-brut.png'
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
				<Banner icon="⏰  ">
					<strong>
						Nouveau ! Vous pouvez renseigner des heures supplémentaires :
					</strong>{' '}
					les dispositifs rattachés sont pris en compte dans le calcul
					(réduction vieillesse, défiscalisation, déduction forfaitaire)
				</Banner>
			)}
			<SalarySimulation />
			{!isEmbedded && (
				<Markdown
					source={language === 'fr' ? seoExplanations : seoExplanationsEn}
				/>
			)}
		</>
	)
})

const seoExplanations = `
## Calculer son salaire net

Lors de l'entretien d'embauche l'employeur propose en général une rémunération exprimée en « brut ». Le montant annoncé inclut ainsi les cotisations salariales, qui servent à financer la protection sociale du salarié et qui sont retranchées du salaire « net » perçu par le salarié.

Vous pouvez utiliser notre simulateur pour convertir le **salaire brut en net** : il vous suffit pour cela saisir la rémunération annoncée dans la case salaire brut. La simulation peut-être affinée en répondant aux différentes questions (sur le CDD, statut cadre, etc.).

![Salaire net et brut](${urlIllustrationNetBrut})

Par ailleurs depuis 2019, l'[impôt sur le revenu](/documentation/impôt/impôt-sur-le-revenu) est prélevé à la source. Pour ce faire, la direction générale des finances publiques (DGFiP) transmet à l'employeur le taux d'imposition calculé à partir de la déclaration de revenu du salarié. Si ce taux est inconnu, par exemple lors d'une première année d'activité, l'employeur utilise le [taux neutre](documentation/impôt/impôt-sur-le-revenu-au-taux-neutre). C'est aussi le taux neutre que nous utilisons dans le simulateur pour calculer le « net après impôt » qui est versé sur le compte bancaire du salarié.

Attention : L'impôt sur le revenu est calculé à partir du [salaire net imposable](/documentation/contrat-salarié/rémunération/net-imposable) qui inclut certaines cotisations non déductibles et les avantages en nature en plus du salaire net.

## Coût d'embauche

Si vous cherchez à embaucher, vous pouvez calculer le coût total de la rémunération de votre salarié, ainsi que les montants de cotisations patronales et salariales correspondants. Cela vous permet de définir le niveau de rémunération en connaissant le montant global de charge que cela représente pour votre entreprise.

En plus du salaire, notre simulateur prend en compte le calcul des avantages en nature (téléphone, véhicule de fonction, etc.), ainsi que la mutuelle santé obligatoire.

Il existe des [aides différées](/documentation/aides-employeur) à l'embauche qui ne sont pas prises en compte par notre simulateur, vous pouvez les retrouver sur [le portail officiel](http://www.aides-entreprises.fr).`

const seoExplanationsEn = `
## Calculate your net salary

During the job interview, the employer usually talks about the "gross" salary. The amount announced thus includes employee contributions, which are used to finance the employee's social protection and are deducted from the "net" salary received by the employee.

You can use our simulator to convert the gross salary into a net salary: all you need to do is enter the remuneration announced in the gross salary input. The simulation can be refined by answering the different questions (on the CDD, “Cadre” status, etc.).

![Gross and net salaries](${urlIllustrationNetBrutEn})

In addition, since 2019, the income tax is withholded. To do this, the “Direction Générale des Finances Publiques” (DGFiP) sends the employer the tax rate calculated from the employee's income tax return. If this rate is unknown, for example for the first year of employment, the employer uses the neutral rate. It is also the neutral rate that we use in the simulator to calculate the "after-tax net" that is paid into the employee's bank account.

Note: Income tax is calculated on the net taxable salary, which includes certain non-deductible contributions and benefits in kind in addition to the net salary.

## Hiring cost

If you are looking to hire, you can calculate the total cost of your employee's compensation, as well as the corresponding employer and employee contributions. This allows you to define the level of compensation by knowing the total amount of expense that this represents for your company.

In addition to the salary, our simulator takes into account the calculation of benefits in kind (telephone, company car, etc.), as well as the mandatory health insurance.

There are deferred hiring aids that are not taken into account by our simulator, you can find them on the official portal.`

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
