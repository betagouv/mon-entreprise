import { useCallback, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'

import { EntrepriseDetailsCard } from '@/components/entreprise/EntrepriseDetailsCard'
import { EntrepriseSearchField } from '@/components/entreprise/EntrepriseSearchField'
import { useEngine } from '@/components/utils/EngineContext'
import {
	AnswerGroup,
	Body,
	Button,
	Grid,
	H3,
	PopoverConfirm,
	Spacing,
} from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'
import { useEntreprisesRepository } from '@/hooks/useRepositories'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { useSitePaths } from '@/sitePaths'
import { getCookieValue } from '@/storage/readCookie'
import { resetCompany } from '@/store/actions/companyActions'
import { companySirenSelector } from '@/store/selectors/companySiren.selector'

export default function SearchOrCreate() {
	const { absoluteSitePaths } = useSitePaths()
	// const statutChoisi = useSelector(
	// 	(state: RootState) => state.choixStatutJuridique.companyStatusChoice
	// )
	const companySIREN = useSelector(companySirenSelector)
	useSetEntrepriseFromUrssafConnection()
	const handleCompanySubmit = useHandleCompanySubmit()
	const dispatch = useDispatch()

	const { t } = useTranslation()

	return (
		<Grid container spacing={3}>
			<Grid item xl={8} lg={10} md={12}>
				{companySIREN ? (
					<>
						<H3 as="h2">{t('Votre entreprise')}</H3>
						<EntrepriseDetailsCard />
						<Spacing md />
						<AnswerGroup role="list">
							<Button
								to={generatePath(
									absoluteSitePaths.assistants['pour-mon-entreprise']
										.entreprise,
									{ entreprise: companySIREN }
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
						<Trans i18nKey="landing.searchcompany">
							<H3 as="h2">Rechercher votre entreprise </H3>
							<Body>
								Pour accéder à nos simulateurs les plus pertinents pour votre
								activité
							</Body>
						</Trans>
						<EntrepriseSearchField onSubmit={handleCompanySubmit} />
						<Spacing md />
					</>
				)}
			</Grid>
		</Grid>
	)
}

function useHandleCompanySubmit() {
	const navigate = useNavigate()
	const { absoluteSitePaths } = useSitePaths()
	const setEntreprise = useSetEntreprise()

	const handleCompanySubmit = useCallback(
		(établissement: Entreprise | null) => {
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
	const entreprisesRepository = useEntreprisesRepository()

	useEffect(() => {
		if (siret && !companySIREN) {
			entreprisesRepository
				.rechercheTexteLibre(siret)
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
