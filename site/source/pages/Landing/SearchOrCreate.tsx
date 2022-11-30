import { useCallback, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { resetCompany } from '@/actions/companyActions'
import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from '@/api/fabrique-social'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import PopoverConfirm from '@/design-system/popover/PopoverConfirm'
import { H3 } from '@/design-system/typography/heading'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { RootState } from '@/reducers/rootReducer'
import { useSitePaths } from '@/sitePaths'
import { getCookieValue } from '@/storage/readCookie'

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
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
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
									to={generatePath(absoluteSitePaths.gérer.entreprise, {
										entreprise: companySIREN as string,
									})}
									aria-label="Voir ma situation, accéder à la page de gestion de mon entreprise"
								>
									Voir ma situation
								</Button>
								<PopoverConfirm
									trigger={(buttonProps) => (
										<Button
											light
											aria-label={t('Réinitialiser la situation enregistrée')}
											{...buttonProps}
										>
											Réinitialiser
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
							<CompanySearchField onSubmit={handleCompanySubmit} />
							<Spacing md />

							<Button
								size="XL"
								role="link"
								to={
									statutChoisi
										? absoluteSitePaths.créer[statutChoisi]
										: absoluteSitePaths.créer.index
								}
								aria-label={t(
									'landing.choice.create.aria-label',
									"Je n'ai pas encore d'entreprise, accéder au guide de création d'entreprise."
								)}
							>
								<Emoji emoji="💡" />{' '}
								<Trans i18nKey="landing.choice.create.title">
									Je n'ai pas encore d'entreprise
								</Trans>
							</Button>
						</>
					)}
				</Grid>
			</Grid>
		</ThemeProvider>
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
			const path = generatePath(absoluteSitePaths.gérer.entreprise, {
				entreprise,
			})
			navigate(path)
		},
		[navigate, setEntreprise, absoluteSitePaths.gérer.entreprise]
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
