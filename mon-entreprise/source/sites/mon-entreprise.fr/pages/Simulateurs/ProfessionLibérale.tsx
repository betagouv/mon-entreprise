import Simulation from 'Components/Simulation'
import professionLibéraleConfig from 'Components/simulationConfigs/profession-libérale.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { EngineContext } from 'Components/utils/EngineContext'
import { default as React, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateSituation } from 'Actions/actions'
import { DottedName } from 'Rules'
import { utils } from 'publicodes'
import { capitalise0 } from '../../../../utils'

// The subsimulator feature allow to customize a simulator page content (title,
// description) and url based on the answer to a multiple-choice question.
// Arguments:
// - `namespace` correspond to the question in the rule set
// - `sitepath` is a React Router path descriptor which must contain a
//   `:subsimulator?` argument
function useSubSimulators(namespace: DottedName, sitepath: string): string {
	const engine = useContext(EngineContext)
	const history = useHistory()
	const dispatch = useDispatch()
	const subsimulatorUrlParam = '/:subsimulator?'
	if (!sitepath.includes(subsimulatorUrlParam)) {
		throw new Error('sitepath must contain the subsimulator param.')
	}
	const urlState = useRouteMatch<{ subsimulator: string }>({ path: sitepath })
		?.params?.subsimulator
	const defaultUrl = sitepath.replace(subsimulatorUrlParam, '')

	// TODO: ajouter le support de l'attribut "titre" de la règle
	const situationState = engine.situation[namespace]?.nodeValue
	const encodedSituationState = utils.encodeRuleName(situationState)
	const subSimulatorsList = Object.keys(engine.getParsedRules())
		.filter(dottedname => dottedname.startsWith(namespace))
		.map(dottedname => dottedname.replace(`${namespace} . `, ''))
		.map(rulename => utils.encodeRuleName(rulename))

	useEffect(() => {
		if (urlState && !subSimulatorsList.includes(urlState)) {
			history.push(defaultUrl)
		} else if (encodedSituationState && encodedSituationState !== urlState) {
			history.push(`${defaultUrl}/${encodedSituationState}`)
		} else if (urlState && urlState !== encodedSituationState) {
			dispatch(updateSituation(namespace, `'${urlState}'`))
		}
	}, [urlState, encodedSituationState])

	return situationState?.toString()
}

export default function ProfessionLibérale() {
	const { t } = useTranslation()
	const inIframe = useContext(IsEmbeddedContext)
	const sitePaths = useContext(SitePathsContext)
	const professionName =
		useSubSimulators(
			'dirigeant . indépendant . PL . métier . PAM',
			sitePaths.simulateurs['profession-libérale']
		) ?? 'professionnel de santé'

	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.profession-libérale.page.titre',
						`${capitalise0(
							professionName
						)} : simulateur de revenus et de cotisations`
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.profession-libérale.page.description',
						`Estimez vos revenus en tant que ${professionName} à partir de votre chiffre d'affaire (pour les EI et les gérants EURL et SARL majoritaires). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf`
					)}
				/>
			</Helmet>
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.profession-libérale.titre">
						Simulateur de revenus pour {professionName}
					</Trans>
				</h1>
			)}
			{/* <Warning simulateur="professionnelSanté" /> */}
			<Simulation
				config={professionLibéraleConfig}
				explanations={<ExplanationSection />}
			/>
		</>
	)
}

function ExplanationSection() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<h2>Répartition de la rémunération totale</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate('revenu net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{ ...engine.evaluate('impôt'), color: palettes[1][0] },
					{
						...engine.evaluate(
							'dirigeant . indépendant . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
