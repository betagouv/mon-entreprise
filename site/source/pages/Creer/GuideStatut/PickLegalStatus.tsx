import { Fragment } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { TrackPage } from '@/components/ATInternetTracking'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import { Button } from '@/design-system/buttons'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import {
	LegalStatus,
	possibleStatusSelector,
} from '@/store/selectors/companyStatusSelectors'

import StatutDescription from '../StatutDescription'

type StatutButtonProps = {
	statut: LegalStatus
}

const StatutButton = ({ statut }: StatutButtonProps) => {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<Button to={absoluteSitePaths.créer[statut]} light size="XS">
			<>
				{statut.includes('auto-entrepreneur') ? (
					<Trans>Devenir</Trans>
				) : (
					<Trans>Créer une</Trans>
				)}{' '}
				{
					// t("auto-entrepreneur")
					// t("EIRL")
					// t("auto-entrepreneur-EIRL")
					// t("EI")
					// t("SASU")
					// t("SAS")
					// t("SARL")
					// t("EURL")
					// t("SA")
					t(statut)
				}
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
			<DefaultHelmet>
				<title>
					{t(
						'listeformejuridique.page.titre',
						'Liste des statuts juridiques pour la création de votre entreprise'
					)}
				</title>
			</DefaultHelmet>
			<H2>
				{Object.keys(possibleStatus).every(Boolean) ? (
					<Trans>Liste des statuts juridiques</Trans>
				) : (
					<Trans>Votre forme juridique</Trans>
				)}
			</H2>

			{(Object.entries(possibleStatus) as [LegalStatus, boolean][])
				.filter(([, v]) => Boolean(v))
				.map(([statut]) => (
					<Fragment key={statut}>
						<H3>
							<StatutTitle statut={statut} language={i18n.language} />
						</H3>
						<Body>
							<StatutDescription statut={statut} />
						</Body>
						<StatutButton statut={statut} />
					</Fragment>
				))}
		</>
	)
}
