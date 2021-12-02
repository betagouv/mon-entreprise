import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { H2, H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { filter } from 'ramda'
import { Fragment, useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	LegalStatus,
	possibleStatusSelector,
} from 'Selectors/companyStatusSelectors'
import { TrackPage } from '../../../ATInternetTracking'
import StatutDescription from '../StatutDescription'

type StatutButtonProps = {
	statut: LegalStatus
}

const StatutButton = ({ statut }: StatutButtonProps) => {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Button to={sitePaths.créer[statut]} light size="XS">
			<>
				{statut.includes('auto-entrepreneur') ? (
					<Trans>Devenir</Trans>
				) : (
					<Trans>Créer une</Trans>
				)}{' '}
				{t(statut)}
			</>
		</Button>
	)
}

type StatutTitleProps = {
	statut: LegalStatus
	language: string
}

const StatutTitle = ({ statut, language }: StatutTitleProps) =>
	statut === 'EI' ? (
		<>
			Entreprise individuelle {language !== 'fr' && '(Individual business)'}:{' '}
		</>
	) : statut === 'EIRL' ? (
		<>
			Entrepreneur individuel à responsabilité limitée{' '}
			{language !== 'fr' && '(Individual entrepreneur with limited liability)'}:{' '}
		</>
	) : statut === 'EURL' ? (
		<>
			EURL - Entreprise unipersonnelle à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited personal company)'}:{' '}
		</>
	) : statut === 'SARL' ? (
		<>
			SARL - Société à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited corporation)'}:{' '}
		</>
	) : statut === 'SAS' ? (
		<>
			SAS - Société par actions simplifiées{' '}
			{language !== 'fr' && '(Simplified joint stock company)'}:{' '}
		</>
	) : statut === 'SASU' ? (
		<>
			SASU - Société par action simplifiée unipersonnelle{' '}
			{language !== 'fr' && '(Simplified personal joint stock company)'}:{' '}
		</>
	) : statut === 'SA' ? (
		<>SA - Société anonyme {language !== 'fr' && '(Anonymous company)'}: </>
	) : (statut as string) === 'SNC' ? (
		<>SNC - Société en nom collectif {language !== 'fr' && '(Partnership)'}: </>
	) : statut === 'auto-entrepreneur' ? (
		<>
			<Trans>Auto-entrepreneur</Trans>
			{language === 'fr' && ' '}:{' '}
		</>
	) : statut === 'auto-entrepreneur-EIRL' ? (
		<>
			<Trans>Auto-entrepreneur en EIRL</Trans>
			{language === 'fr' && ' '}
			{':'}
		</>
	) : null

export default function SetMainStatus() {
	const { t, i18n } = useTranslation()
	const possibleStatus = useSelector(possibleStatusSelector)
	return (
		<>
			<TrackPage chapter2="statut" name="liste" />
			<Helmet>
				<title>
					{t(
						'listeformejuridique.page.titre',
						'Liste des statuts juridiques pour la création de votre entreprise'
					)}
				</title>
			</Helmet>
			<H2>
				{Object.keys(possibleStatus).every(Boolean) ? (
					<Trans>Liste des statuts juridiques</Trans>
				) : (
					<Trans>Votre forme juridique</Trans>
				)}
			</H2>

			{Object.keys(filter(Boolean, possibleStatus)).map(
				/* https://github.com/microsoft/TypeScript/issues/32811 */
				(statut: any) => (
					<Fragment key={statut}>
						<H3>
							<StatutTitle statut={statut} language={i18n.language} />
						</H3>
						<Body>
							<StatutDescription statut={statut} />
						</Body>
						<StatutButton statut={statut} />
					</Fragment>
				)
			)}
		</>
	)
}
