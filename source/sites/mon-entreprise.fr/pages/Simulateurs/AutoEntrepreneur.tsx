import { setSimulationConfig } from 'Actions/actions'
import { resetEntreprise } from 'Actions/existingCompanyActions'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import Overlay from 'Components/Overlay'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import autoEntrepreneurConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { getRuleFromAnalysis } from 'Engine/rules'
import {
	default as React,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState } from 'Reducers/rootReducer'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'

export default function AutoEntrepreneur() {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	const inIframe = useContext(IsEmbeddedContext)
	const [searchModal, showSearchModal] = useState(false)
	dispatch(
		setSimulationConfig(autoEntrepreneurConfig, location.state?.fromGérer)
	)

	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)

	const companyRef = useRef<Company | null>(null)
	useEffect(() => {
		if (companyRef.current !== company) {
			companyRef.current = company
			if (searchModal && company) {
				showSearchModal(false)
			}
		}
	}, [company, searchModal])

	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.auto-entrepreneur.page.titre',
						'Auto-entrepreneur : simulateur officiel de revenus et de cotisations'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.auto-entrepreneur.page.description',
						"Estimez vos revenus en tant qu'auto-entrepreneur à partir de votre chiffre d'affaire. Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
					)}
				/>
			</Helmet>
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.auto-entrepreneur.titre">
						Simulateur de revenus auto-entrepreneur
					</Trans>
				</h1>
			)}
			{company && (
				<>
					<CompanyDetails siren={company.siren} />
					<button
						className="ui__ simple small button"
						onClick={() => {
							dispatch(resetEntreprise())
							showSearchModal(true)
						}}
					>
						<Trans i18nKey="gérer.entreprise.changer">
							Changer l'entreprise sélectionnée
						</Trans>
					</button>
				</>
			)}
			{searchModal && (
				<>
					<ScrollToTop />
					<Overlay onClose={() => showSearchModal(false)}>
						<FindCompany />
					</Overlay>
				</>
			)}
			<Warning simulateur="auto-entrepreneur" />
			<Simulation explanations={<ExplanationSection />} />
		</>
	)
}

function ExplanationSection() {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	const impôt = getRule('impôt')
	return (
		<section>
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...getRule('dirigeant . auto-entrepreneur . net après impôt'),
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0]
					},

					...(impôt.nodeValue
						? [{ ...impôt, title: t('impôt'), color: palettes[1][0] }]
						: []),
					{
						...getRule(
							'dirigeant . auto-entrepreneur . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
