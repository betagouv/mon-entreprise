import { Trans, useTranslation } from 'react-i18next'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import {
	BasicCard,
	Body,
	Li,
	Message,
	Strong,
	StyledLink,
	Ul,
} from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'

import { FromTop } from '../ui/animate'
import EntrepriseSearchDetails from './EntrepriseSearchDetails'

export default function EntrepriseSearchResults({
	results,
	onSubmit,
}: {
	results: Array<Entreprise>
	onSubmit?: (entreprise: Entreprise) => void
}) {
	const { t } = useTranslation()

	return !results.length ? (
		<FromTop>
			<Message type="info" icon>
				<Body>
					<Strong>
						{t(
							'components.entreprise-search-results.no-result.1',
							'Nous n’avons pas trouvé de résultat pour cette entreprise.'
						)}
					</Strong>
				</Body>
				<Body>
					{t(
						'components.entreprise-search-results.no-result.2',
						'Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un meilleur résultat.'
					)}
				</Body>
				<Body>
					<Trans i18nKey="components.entreprise-search-results.no-result.3">
						Si votre entreprise n'apparait pas en utilisant votre SIREN/SIRET,
						il se peut que vous ayez opté pour que{' '}
						<Strong>
							les informations de votre entreprise ne soient pas rendues
							publiques
						</Strong>
						, auquel cas elle n'apparaitra pas dans les résultats de recherche.
						Vous pouvez le vérifier sur{' '}
						<StyledLink
							aria-label={t(
								'components.entreprise-search-results.aria-label.annuaire',
								"l'annuaire des entreprises, nouvelle fenêtre"
							)}
							href="https://annuaire-entreprises.data.gouv.fr/"
						>
							l'annuaire des entreprises
						</StyledLink>
						.
						<Body>
							Si tel est le cas, pas d'inquiétude, vous pouvez tout de même
							consulter et utiliser nos simulateurs.
						</Body>
					</Trans>
				</Body>
			</Message>
		</FromTop>
	) : (
		<FromTop>
			<ForceThemeProvider>
				<Ul $noMarker data-test-id="company-search-results">
					{results.map((entreprise) => (
						<Li key={entreprise.siren}>
							<BasicCard
								onPress={() => onSubmit?.(entreprise)}
								aria-label={t(
									'components.entreprise-search-results.aria-label.card',
									'{{nom}}, sélectionner cette entreprise',
									{ nom: entreprise.nom }
								)}
							>
								<EntrepriseSearchDetails entreprise={entreprise} />
							</BasicCard>
						</Li>
					))}
				</Ul>
			</ForceThemeProvider>
		</FromTop>
	)
}
