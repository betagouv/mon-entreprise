import { useCallback, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'

import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from '@/api/fabrique-social'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { useEngine } from '@/components/utils/EngineContext'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import PopoverConfirm from '@/design-system/popover/PopoverConfirm'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { useSitePaths } from '@/sitePaths'
import { getCookieValue } from '@/storage/readCookie'
import { resetCompany } from '@/store/actions/companyActions'
import { RootState } from '@/store/reducers/rootReducer'

export default function SearchOrCreate() {
	const { absoluteSitePaths } = useSitePaths()
	const statutChoisi = useSelector(
		(state: RootState) => state.choixStatutJuridique.companyStatusChoice
	)
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	useSetEntrepriseFromUrssafConnection()
	const handleCompanySubmit = useHandleCompanySubmit()
	const dispatch = useDispatch()

	const { t } = useTranslation()

	return (
		<ForceThemeProvider forceTheme="dark">
			<Grid container spacing={3}>
				<Grid item xl={8} lg={10} md={12}>
					{companySIREN ? (
						<>
							<H3 as="h2">Votre entreprise</H3>
							<CompanyDetails headingTag="h3" />
							<Spacing md />
							<AnswerGroup role="list">
								<Button
									role="link"
									to={generatePath(
										absoluteSitePaths.assistants['pour-mon-entreprise']
											.entreprise,
										{ entreprise: companySIREN as string }
									)}
									data-test-id="cta-see-custom-simulators"
									aria-label={t(
										'Voir les simulateurs personnalisés, accéder à la page de gestion de mon entreprise'
									)}
								>
									{t('Voir les simulateurs personnalisés')}
								</Button>
								<PopoverConfirm
									trigger={(buttonProps) => (
										<Button
											light
											aria-label={t('Réinitialiser la situation enregistrée')}
											{...buttonProps}
										>
											{t('Réinitialiser')}
										</Button>
									)}
									onConfirm={() => dispatch(resetCompany())}
									small
									title={t(
										'Êtes-vous sûr de vouloir réinitialiser la situation enregistrée ?'
									)}
								/>
							</AnswerGroup>
						</>
					) : (
						<>
							<H3 as="h2">
								<Trans>Rechercher votre entreprise</Trans>{' '}
							</H3>
							<Body>
								Pour accéder à nos simulateurs les plus pertinents pour votre
								activité
							</Body>
							<CompanySearchField
								onSubmit={handleCompanySubmit}
								forceTheme="dark"
							/>
							<Spacing md />
							<Grid container spacing={2}>
								<Grid item>
									<Button
										size="XL"
										role="link"
										to={
											statutChoisi
												? absoluteSitePaths.assistants['choix-du-statut'][
														statutChoisi
												  ]
												: absoluteSitePaths.assistants['choix-du-statut'].index
										}
										aria-label={t(
											'landing.choice.create.aria-label',
											"J'aimerais créer mon entreprise, accéder au guide de création d'entreprise."
										)}
									>
										<Emoji emoji="💡" />{' '}
										<Trans i18nKey="landing.choice.create.title">
											J'aimerais créer mon entreprise
										</Trans>
									</Button>
								</Grid>
								<Grid item>
									<Button
										size="XL"
										role="link"
										light
										to={absoluteSitePaths.simulateurs.index}
										color="secondary"
									>
										<Trans i18nKey="landing.choice.simulator.list">
											Consulter la liste de nos simulateurs
										</Trans>
									</Button>
								</Grid>
							</Grid>
						</>
					)}
				</Grid>
			</Grid>
		</ForceThemeProvider>
	)
}

function useHandleCompanySubmit() {
	const navigate = useNavigate()
	const { absoluteSitePaths } = useSitePaths()
	const setEntreprise = useSetEntreprise()

	const handleCompanySubmit = useCallback(
		(établissement: FabriqueSocialEntreprise | null) => {
			if (!établissement) {
				return
			}
			setEntreprise(établissement)
			const entreprise = établissement.siren
			const path = generatePath(
				absoluteSitePaths.assistants['pour-mon-entreprise'].entreprise,
				{ entreprise }
			)
			navigate(path)
		},
		[absoluteSitePaths.assistants, navigate, setEntreprise]
	)

	return handleCompanySubmit
}

function useSetEntrepriseFromUrssafConnection() {
	const setEntreprise = useSetEntreprise()
	const siret = siretFromUrssafFrConnection()
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	useEffect(() => {
		if (siret && !companySIREN) {
			searchDenominationOrSiren(siret)
				.then((results) => {
					if (results?.length !== 1) {
						return
					}
					setEntreprise(results[0])
				})
				.catch((err) => {
					console.log(err)
					console.log(`Could not fetch company details for ${siret}`)
				})
		}
	}, [siret, companySIREN])
}

// We can read cookies set on the urssaf.fr domain, which contain informations
// such as the SIRET number. The cookie format could change at any time so we
// wrap its read access in a `try / catch`.
function siretFromUrssafFrConnection(): string | null {
	try {
		// Note: The `ctxUrssaf` contains more informations, but currently we only
		// need to retreive the SIRET which is slightly more easy to read from the
		// `EnLigne` cookie.
		const cookieValue = decodeURIComponent(getCookieValue('EnLigne'))
		const siret = cookieValue.match('siret=([0-9]{14})')?.pop()

		return siret ?? null
	} catch {
		return null
	}
}
