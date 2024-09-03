import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Message } from '@/design-system'
import { Card } from '@/design-system/card'
import { FocusStyle } from '@/design-system/global-style'
import { ChevronIcon } from '@/design-system/icons'
import { Strong } from '@/design-system/typography'
import { StyledLink } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { Entreprise } from '@/domain/Entreprise'

import { FromTop } from '../ui/animate'
import EntrepriseSearchDetails from './EntrepriseSearchDetails'

const StyledCard = styled(Card)`
	flex-direction: row; // for Safari <= 13
	cursor: pointer;
	&:focus-visible {
		${FocusStyle}
	}
`

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
						<Trans>
							Nous n’avons pas trouvé de résultat pour cette entreprise.
						</Trans>
					</Strong>
				</Body>
				<Body>
					<Trans>
						Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un
						meilleur résultat.
					</Trans>
				</Body>
				<Body>
					<Trans>
						Si votre entreprise n'apparait pas en utilisant votre SIREN/SIRET,
						il se peut que vous ayez opté pour que{' '}
						<Strong>
							les informations de votre entreprise ne soient pas rendues
							publiques
						</Strong>
						, auquel cas elle n'apparaitra pas dans les résultats de recherche.
						Vous pouvez le vérifier sur{' '}
						<StyledLink
							aria-label={t("l'annuaire des entreprises, nouvelle fenêtre")}
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
				<Ul noMarker data-test-id="company-search-results">
					{results.map((entreprise) => (
						<Li key={entreprise.siren}>
							<StyledCard
								onPress={() => onSubmit?.(entreprise)}
								onClick={() => onSubmit?.(entreprise)}
								compact
								bodyAs="div"
								aria-label={`${entreprise.nom}, Selectionner cette entreprise`}
								ctaLabel={
									<ChevronIcon
										style={{
											height: '20px',
											marginTop: '5px',
										}}
										aria-hidden
									/>
								}
							>
								<EntrepriseSearchDetails entreprise={entreprise} />
							</StyledCard>
						</Li>
					))}
				</Ul>
			</ForceThemeProvider>
		</FromTop>
	)
}
