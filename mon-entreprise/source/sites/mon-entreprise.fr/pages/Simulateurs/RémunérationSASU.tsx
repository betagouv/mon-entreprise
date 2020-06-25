import SalaryExplanation from 'Components/SalaryExplanation'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import React, { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import RémunérationSASUPreview from './images/RémunérationSASUPreview.png'
import RuleLink from 'Components/RuleLink'

export default function RémunérationSASU() {
	const { t } = useTranslation()
	const META = {
		title: t(
			'pages.simulateurs.sasu.meta.titre',
			'Dirigeant de SASU : simulateur de revenus Urssaf'
		),
		description: t(
			'pages.simulateurs.sasu.meta.description',
			"Calcul du salaire net à partir du chiffre d'affaires + charges et vice-versa."
		),
		ogTitle: t(
			'pages.simulateurs.sasu.meta.ogTitle',
			'Rémunération du dirigeant de SASU : un simulateur pour connaître votre salaire net'
		),
		ogDescription: t(
			'pages.simulateurs.sasu.meta.ogDescription',
			'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
		),
		ogImage: RémunérationSASUPreview
	}
	const inIframe = useContext(IsEmbeddedContext)

	return (
		<>
			<Meta {...META} />
			{!inIframe && (
				<h1>
					<Trans i18nKey="pages.simulateurs.sasu.titre">
						Simulateur de revenus pour dirigeant de SAS(U)
					</Trans>
				</h1>
			)}
			<Warning simulateur="sasu" />
			<Simulation
				config={assimiléConfig}
				explanations={<SalaryExplanation />}
			/>
			{!inIframe && <SeoExplanations />}
		</>
	)
}

function SeoExplanations() {
	const { i18n } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.dirigean sasu.explication seo">
			<h2>Comment calculer le salaire d'un dirigeant de SASU ? </h2>

			<p>
				Comme pour un salarié classique, le <strong>dirigeant de sasu</strong>{' '}
				paye des cotisations sociales sur la rémunération qu'il se verse. Les
				cotisations sont calculées de la même manière que pour le salarié : elle
				sont décomposée en partie employeur et partie salarié et sont exprimée
				comme un pourcentage du salaire brut.
			</p>
			<p>
				En revanche, le dirigeant assimilé-salarié ne paye pas de{' '}
				<strong>cotisations chômage</strong>. Par ailleurs, il ne bénéficie pas
				de la{' '}
				<RuleLink dottedName="contrat salarié . réduction générale">
					réduction générale de cotisations
				</RuleLink>{' '}
				ni des dispositifs encadrés par le code du travail comme les{' '}
				<RuleLink dottedName="contrat salarié . temps de travail . heures supplémentaires">
					heures supplémentaires
				</RuleLink>{' '}
				ou les primes.
			</p>

			<p>
				Il peut en revanche prétendre à la{' '}
				<RuleLink dottedName="contrat salarié . ">réduction ACRE</RuleLink> en
				debut d'activité, sous certaines conditions.
			</p>

			<p>
				Vous pouvez utiliser notre simulateur pour calculer la{' '}
				<strong>rémunération nette</strong> à partir d'un montant superbrut
				alloué à la rémunération du dirigeant. Il vous suffit pour cela saisir
				la rémunération annoncée dans la case total chargé. La simulation peut
				ensuite être affinée en répondant aux différentes questions.
			</p>
		</Trans>
	)
}
