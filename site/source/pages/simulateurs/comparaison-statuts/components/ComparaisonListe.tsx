import { Either, Option } from 'effect'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useComparateur } from '@/contextes/comparateur'
import {
	Accordion,
	Body,
	CircledPlusIcon,
	Container,
	Emoji,
	ExternalLinkIcon,
	H2,
	H4,
	InfoButton,
	Item,
	Li,
	Link,
	Message,
	Strong,
	StyledLink,
	Ul,
} from '@/design-system'
import { arrondirÀLEuro, estZéro, montantToString } from '@/domaine/Montant'
import {
	plus,
	pourcentageParRapportÀ,
	toEurosParAn,
	toEurosParJour,
	toEurosParMois,
} from '@/domaine/MontantRecurrent'
import { arrondirÀLUnité, quantitéToString } from '@/domaine/Quantite'

import { CartesStatuts } from './CartesStatuts'
import { ComparaisonÉlément } from './ComparaisonElement'
import ItemTitle from './ItemTitle'
import { TableauRevenus } from './TableauRevenus'
import WarningTooltip from './WarningTooltip'

export const Comparaison = () => {
	const { t } = useTranslation()
	const { situation } = useComparateur()
	// TODO: découper en composant par Catégorie (retraite, maladie...)

	return (
		<Container
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[800]
					: theme.colors.bases.primary[200]
			}
		>
			<Accordion
				variant="light"
				defaultExpandedKeys={['revenus']}
				title={
					<H2>
						{t(
							'pages.simulateurs.comparaison-statuts.accordion-title',
							'Comparer…'
						)}
					</H2>
				}
				isFoldable
				banner={<CartesStatuts />}
			>
				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.revenus.title',
								'Vos revenus'
							)}
							&nbsp;
							<Emoji emoji="🤑" />
						</ItemTitle>
					}
					key="revenus"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.revenus.title',
						'Vos revenus'
					)}
				>
					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.revenus.h4',
							'Revenu net mensuel après impôts'
						)}

						<InfoButton
							subject={t(
								'pages.simulateurs.comparaison-statuts.items.revenus.info.subject',
								'Vos revenus'
							)}
						>
							<TableauRevenus />
						</InfoButton>
					</H4>
					<ComparaisonÉlément
						catégorieComparée="revenu"
						élémentComparé="revenuNetAprèsImpôt"
						convertisseur={toEurosParMois}
						footer={(résultatModèle) => {
							const revenu = résultatModèle.revenu()
							const dépenses = résultatModèle.dépenses()

							if (estZéro(revenu.bénéfice)) {
								return
							}

							const revenuAvantImpôt = montantToString(
								arrondirÀLEuro(
									toEurosParMois(
										plus(revenu.revenuNetAprèsImpôt, dépenses.impôt)
									)
								)
							)

							const pourcentageSurBénéfice = quantitéToString(
								arrondirÀLUnité(
									Either.getOrThrow(
										pourcentageParRapportÀ(
											dépenses.cotisations,
											revenu.bénéfice
										)
									)
								)
							)
							const pourcentageSurCA = quantitéToString(
								arrondirÀLUnité(
									Either.getOrThrow(
										pourcentageParRapportÀ(
											dépenses.cotisations,
											Option.getOrThrow(situation.chiffreDAffaires)
										)
									)
								)
							)

							return (
								<Ul>
									<Li>
										<Trans
											i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.1"
											shouldUnescape
										>
											Soit <Strong>{{ revenuAvantImpôt }}</Strong> avant impôts
										</Trans>
									</Li>{' '}
									<Li>
										{résultatModèle.nomModèle === 'modele-social' ? (
											<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.2">
												Avec <Strong>{{ pourcentageSurCA }}</Strong> de
												cotisations sociales sur le chiffre d’affaires (soit{' '}
												<Strong>{{ pourcentageSurBénéfice }}</Strong> du
												bénéfice)
											</Trans>
										) : (
											<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.3">
												Avec <Strong>{{ pourcentageSurBénéfice }}</Strong> de
												cotisations sociales sur le bénéfice
											</Trans>
										)}
									</Li>
								</Ul>
							)
						}}
						warning={(résultatModèle) => {
							const seuilMicro = résultatModèle.warning?.().seuilMicro

							if (!seuilMicro) {
								return
							}

							const montant = montantToString(seuilMicro)

							return (
								<WarningTooltip
									tooltip={
										<Trans
											i18nKey="pages.simulateurs.comparaison-statuts.warning.auto-entrepreneur"
											shouldUnescape
										>
											Vous allez dépasser le plafond de la micro-entreprise (
											{{ montant }} de chiffre d’affaires).
										</Trans>
									}
								/>
							)
						}}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.retraite.title',
								'Vos droits pour la retraite'
							)}
							&nbsp;
							<Emoji emoji="🧐" />
						</ItemTitle>
					}
					key="retraite"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.retraite.title',
						'Vos droits pour la retraite'
					)}
				>
					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.retraite.base.h4',
							'Retraite de base'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.base.body">
							Chaque année, selon votre rémunération, vous validez{' '}
							<Strong>jusqu'à 4 trimestres</Strong> pour votre retraite de base.
							Le nombre total de trimestres validés détermine votre droit à une
							retraite à taux plein.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="retraite"
						élémentComparé="trimestres"
						displayedUnit={t(
							'pages.simulateurs.comparaison-statuts.items.retraite.base.unit',
							'trimestre(s) acquis par an'
						)}
					/>

					{!situation.activitéLibéraleRéglementée && (
						<>
							<Body>
								<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.base.revenu-cotisé.body">
									Le montant de votre pension dépend aussi du{' '}
									<Strong>revenu cotisé</Strong>, c'est-à-dire la part de vos
									revenus sur laquelle vous cotisez pour la retraite de base.
								</Trans>
							</Body>

							<ComparaisonÉlément
								catégorieComparée="retraite"
								élémentComparé="revenuCotisé"
								convertisseur={toEurosParAn}
								displayedUnit={t(
									'pages.simulateurs.comparaison-statuts.items.retraite.base.unité',
									'€ cotisés par an'
								)}
							/>
						</>
					)}

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.h4',
							'Retraite complémentaire'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.body">
							Tous les ans, selon votre rémunération,{' '}
							<Strong>vous gagnez des points de retraite complémentaire</Strong>
							. En fin de carrière, vos points sont convertis en pension
							mensuelle qui s'ajoute à votre retraite de base.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="retraite"
						élémentComparé="pointsComplémentaire"
						displayedUnit={t(
							'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.unité',
							'point(s) acquis par an'
						)}
						footer={(résultatModèle) => {
							const valeurPointComplémentaire = montantToString(
								résultatModèle.retraite().valeurPointComplémentaire
							)

							return (
								<BodyNoMargin>
									<Trans
										i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.valeur-du-point"
										shouldUnescape
									>
										Valeur du point&nbsp;:{' '}
										<Strong>{{ valeurPointComplémentaire }}</Strong>
									</Trans>
								</BodyNoMargin>
							)
						}}
					/>

					<Message type="info" border={false}>
						<Body>
							<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.lien-assurance-retraite.message">
								Pour estimer le montant de votre future pension de retraite,
								utilisez le{' '}
								<Link
									href="https://www.lassuranceretraite.fr/portail-info/hors-menu/annexe/services-en-ligne/estimation-montant-retraite.html"
									aria-label={t(
										'pages.simulateurs.comparaison-statuts.items.retraite.lien-assurance-retraite.aria-label',
										"Accéder au simulateur de l'Assurance retraite, nouvelle fenêtre"
									)}
								>
									simulateur de l'Assurance retraite
								</Link>
								.
							</Trans>
						</Body>
					</Message>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.santé.title',
								'Vos prestations santé'
							)}
							&nbsp;
							<Emoji emoji="😷" />
						</ItemTitle>
					}
					key="santé"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.santé.title',
						'Vos prestations santé'
					)}
				>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.body">
						<BodyNoBottomMargin>
							Tous les statuts vous ouvrent le droit au{' '}
							<Strong>remboursement des soins.</Strong>
						</BodyNoBottomMargin>
						<BodyNoMargin>
							Pour tous les statuts, il est conseillé de souscrire à une{' '}
							<Strong>prévoyance complémentaire (mutuelle)</Strong> pour
							améliorer le remboursement des frais de santé.
						</BodyNoMargin>
					</Trans>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.santé.arrêt.h4',
							'Arrêt maladie'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.body">
							Pour tous les statuts, vous aurez un{' '}
							<Strong>délai de carence de 3 jours</Strong>. En cas d’arrêt
							maladie, l’assurance maladie vous versera :
						</Trans>
					</Body>
					<ComparaisonÉlément
						catégorieComparée="maladie"
						élémentComparé="indemnitésArrêtMaladie"
						convertisseur={toEurosParJour}
						warning={(résultatModèle) =>
							!résultatModèle.maladie().indemnitésArrêtMaladie.valeur && (
								<WarningTooltip
									tooltip={
										<span
											style={{
												fontWeight: 'normal',
											}}
										>
											<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.warning">
												Votre <Strong>rémunération</Strong> est{' '}
												<Strong>trop faible</Strong> pour bénéficier d’arrêt
												maladie.
											</Trans>
										</span>
									}
								/>
							)
						}
						footer={(résultatModèle) => {
							const délaiAttente = quantitéToString(
								résultatModèle.maladie().délaiAttente
							)

							return (
								résultatModèle.maladie().indemnitésArrêtMaladie.valeur && (
									<StyledDiv>
										<CircledPlusIcon />
										<BodyNoMargin>
											<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.footer">
												Pour y prétendre, vous devez avoir cotisé au moins{' '}
												<Strong>{{ délaiAttente }}</Strong>
											</Trans>
										</BodyNoMargin>
									</StyledDiv>
								)
							)
						}}
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.santé.atmp.h4',
							'Accident du travail et maladie professionnelle'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.atmp.body">
							En cas d’<Strong>accident du travail</Strong>, de{' '}
							<Strong>maladie professionnelle</Strong> ou d’un{' '}
							<Strong>accident sur le trajet domicile-travail</Strong>, vous
							recevrez une indemnisation de&nbsp;:
						</Trans>
					</Body>
					<ComparaisonÉlément
						catégorieComparée="maladie"
						élémentComparé="indemnitésATMP"
						élémentComparéSecondaire="indemnitésATMPLongTerme"
						convertisseur={toEurosParJour}
						libelléSecondaire={t(
							'pages.simulateurs.comparaison-statuts.items.santé.atmp.secondary-label',
							'à partir du 29ème jour'
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.parentalité.title',
								'La maternité, paternité et adoption'
							)}
							&nbsp;
							<Emoji emoji="🤗" />
						</ItemTitle>
					}
					key="enfants"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.parentalité.title',
						'La maternité, paternité et adoption'
					)}
				>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.body">
						<BodyNoBottomMargin>
							Tous les statuts vous ouvrent le droit aux{' '}
							<Strong>indemnités journalières</Strong> de congé maternité,
							paternité, adoption.
						</BodyNoBottomMargin>
						<BodyNoTopMargin>
							Pour y prétendre, vous devez avoir cotisé{' '}
							<Strong>au moins 6 mois</Strong>.
						</BodyNoTopMargin>
					</Trans>
					<ComparaisonÉlément
						catégorieComparée="parentalité"
						élémentComparé="indemnitésMaternitéPaternitéAdoption"
						convertisseur={toEurosParJour}
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.h4',
							'Maternité'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.maternité.body">
							En plus des indemnités journalières, vous pouvez aussi prétendre à
							une{' '}
							<Strong>
								allocation forfaitaire de repos maternel supplémentaire
							</Strong>
							.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="parentalité"
						élémentComparé="allocationNaissance"
						libellé={t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.label',
							'versés en deux fois'
						)}
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.h4',
							'Adoption'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.adoption.body">
							En plus des indemnités journalières, vous pouvez aussi prétendre à
							une{' '}
							<Strong>
								allocation forfaitaire de repos parental supplémentaire
							</Strong>
							.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="parentalité"
						élémentComparé="allocationAdoption"
						libellé={t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.label',
							'versés en une fois'
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.prévoyance.title',
								'Votre couverture invalidité et décès'
							)}
							&nbsp;
							<Emoji emoji="🤕" />
						</ItemTitle>
					}
					key="maladie"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.prévoyance.title',
						'Votre couverture invalidité et décès'
					)}
				>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.body">
							Tous les statuts cotisent pour une{' '}
							<Strong>pension invalidité-décès</Strong> qui vous{' '}
							<Strong>protège en cas d’invalidité</Strong> et assure à vos
							proches une{' '}
							<Strong>
								pension de réversion et un capital en cas de décès
							</Strong>
							.
						</Trans>
					</Body>
					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.h4',
							'Invalidité'
						)}
					</H4>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.body">
						<BodyNoMargin>
							Vous pouvez bénéficier d’une pension invalidité{' '}
							<Strong>
								en cas de maladie ou d’accident conduisant à une incapacité à
								poursuivre votre activité professionnelle
							</Strong>
							.
						</BodyNoMargin>
						<BodyNoTopMargin>
							Pour y prétendre, vous devez respecter{' '}
							<BlackColoredLink href="https://www.service-public.fr/particuliers/vosdroits/F672">
								certaines règles
								<StyledExternalLinkIcon />
							</BlackColoredLink>
							.
						</BodyNoTopMargin>
					</Trans>

					<ComparaisonÉlément
						catégorieComparée="invalidité"
						élémentComparé="pensionInvaliditéPartielle"
						convertisseur={toEurosParMois}
						libellé={
							<SmallSpan>
								{t(
									'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.label',
									'(invalidité partielle)'
								)}
							</SmallSpan>
						}
						élémentComparéSecondaire="pensionInvaliditéTotale"
						libelléSecondaire={
							<SmallerSpan>
								{t(
									'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.evolution-label',
									'(invalidité totale)'
								)}
							</SmallerSpan>
						}
					/>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité-ATMP.body">
							Pour une invalidité causée par un{' '}
							<Strong>accident professionnel</Strong>, vous pouvez bénéficier
							d’une <Strong>rente d’incapacité</Strong>.
						</Trans>
					</Body>
					<ComparaisonÉlément
						catégorieComparée="invalidité"
						élémentComparé="renteIncapacitéATMP"
						convertisseur={toEurosParMois}
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.h4',
							'Décès'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.décès.capital-décès.body">
							La Sécurité Sociale garantit un{' '}
							<Strong>capital décès pour vos ayants droits</Strong> (personnes
							qui sont à votre charge) sous certaines conditions.
						</Trans>
					</Body>
					<ComparaisonÉlément
						catégorieComparée="décès"
						élémentComparé="capitalDécès"
						libellé={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.capital-décès.label',
							'pour vos proches'
						)}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.pension-réversion.body">
							En plus du capital décès, une{' '}
							<Strong>pension de réversion</Strong> peut être versée à votre
							conjoint/conjointe. Elle correspond aux{' '}
							<Strong>droits à la retraite que vous aurez acquis</Strong> durant
							sa vie professionnelle.
						</Trans>
					</Body>
					<ComparaisonÉlément
						catégorieComparée="décès"
						élémentComparé="pensionDeRéversion"
						convertisseur={toEurosParMois}
						libellé={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.pension-réversion.label',
							'maximum'
						)}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.rente-décès.body">
							Pour un décès survenu dans le cadre d’un{' '}
							<Strong>accident professionnel</Strong>, votre conjoint/conjointe
							peut bénéficier d’une <Strong>rente de décès</Strong>.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="décès"
						élémentComparé="renteDécèsATMP"
						convertisseur={toEurosParMois}
						libellé={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.rente-décès.label',
							'en cas d’accident professionnel'
						)}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.capital-orphelin.body">
							En cas de décès, un <Strong>capital « orphelin »</Strong> est
							versé à<Strong> vos enfants</Strong>, sous certaines conditions.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="décès"
						élémentComparé="capitalOrphelin"
						displayedUnit={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.capital-orphelin.unit',
							'€/enfant'
						)}
					/>
				</Item>

				{/* <Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.gestion.title',
								'La gestion juridique et comptable'
							)}
							&nbsp;
							<Emoji emoji="🤓" />
						</ItemTitle>
					}
					key="administratif"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.gestion.title',
						'La gestion juridique et comptable'
					)}
				>
					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.création.h4',
							'Coût de création'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.création.body">
							Les formalités de création d’une entreprise diffèrent selon les
							statuts et la nature de l’activité. Le calcul se concentre ici sur
							les <Strong>procédures obligatoires</Strong> (immatriculation,
							annonces légales, rédaction des statuts…).
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="gestion"
						élémentComparé="coûtsDeCréation"
						displayedUnit="€ HT"
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.conjoint.h4',
							'Statut du conjoint / de la conjointe'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.conjoint.body">
							Vous êtes marié/mariée, pacsé/pacsée ou en union libre&nbsp;: il
							existe <Strong>3 statuts possibles</Strong> pour votre
							conjoint/conjointe (<Strong>collaborateur/collaboratrice</Strong>,{' '}
							<Strong>associé/associée</Strong> ou{' '}
							<Strong>salarié/salariée</Strong>).
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="gestion"
						élémentComparé="statutConjointe"
					/>
				</Item> */}
			</Accordion>
		</Container>
	)
}

const SmallSpan = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.base};
`
const SmallerSpan = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.min};
`

const StyledDiv = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${({ theme }) => theme.spacings.md};

	svg {
		width: 2.5rem;
	}
`

const BodyNoBottomMargin = styled(Body)`
	margin-bottom: 0;
`
const BodyNoTopMargin = styled(Body)`
	margin-top: 0;
`
const BodyNoMargin = styled(Body)`
	margin: 0;
`

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
	margin-left: 0.25rem;
`

const BlackColoredLink = styled(StyledLink)`
	color: ${({ theme }) =>
		theme.colors.extended.grey[theme.darkMode ? 100 : 800]};
	svg {
		fill: ${({ theme }) =>
			theme.colors.extended.grey[theme.darkMode ? 100 : 800]};
	}

	&:hover {
		color: ${({ theme }) =>
			theme.colors.extended.grey[theme.darkMode ? 400 : 700]};
		svg {
			fill: ${({ theme }) =>
				theme.colors.extended.grey[theme.darkMode ? 400 : 700]};
		}
	}
`
