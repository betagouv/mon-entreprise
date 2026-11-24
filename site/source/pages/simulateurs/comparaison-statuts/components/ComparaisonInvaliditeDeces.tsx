import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useComparateur } from '@/contextes/comparateur'
import { Body, ExternalLinkIcon, H4, Strong, StyledLink } from '@/design-system'
import { toEurosParMois } from '@/domaine/MontantRecurrent'

import { ComparaisonÉlément } from './ComparaisonElement'

export const ComparaisonInvaliditéDécès = () => {
	const { t } = useTranslation()
	const { comparaison } = useComparateur()

	const comparaisonInvalidité = comparaison.map((résultatModèle) => ({
		statut: résultatModèle.statut.étiquette,
		invalidité: résultatModèle.invalidité(),
	}))

	const comparaisonPensionInvalidité = comparaisonInvalidité.map(
		({ invalidité, statut }) => ({
			statut,
			valeur: invalidité.pensionInvaliditéPartielle,
			valeurSecondaire: invalidité.pensionInvaliditéTotale,
		})
	)
	const comparaisonRenteIncapacitéATMP = comparaisonInvalidité.map(
		({ invalidité, statut }) => ({
			statut,
			valeur: invalidité.renteIncapacitéATMP,
		})
	)

	const comparaisonDécès = comparaison.map((résultatModèle) => ({
		statut: résultatModèle.statut.étiquette,
		décès: résultatModèle.décès(),
	}))

	const comparaisonCapitalDécès = comparaisonDécès.map(({ décès, statut }) => ({
		statut,
		valeur: décès.capitalDécès,
	}))
	const comparaisonPensionDeRéversion = comparaisonDécès.map(
		({ décès, statut }) => ({
			statut,
			valeur: décès.pensionDeRéversion,
		})
	)
	const comparaisonRenteDécèsATMP = comparaisonDécès.map(
		({ décès, statut }) => ({
			statut,
			valeur: décès.renteDécèsATMP,
		})
	)
	const comparaisonCapitalOrphelin = comparaisonDécès.map(
		({ décès, statut }) => ({
			statut,
			valeur: décès.capitalOrphelin,
		})
	)

	return (
		<>
			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.body">
					Tous les statuts cotisent pour une{' '}
					<Strong>pension invalidité-décès</Strong> qui vous{' '}
					<Strong>protège en cas d’invalidité</Strong> et assure à vos proches
					une{' '}
					<Strong>pension de réversion et un capital en cas de décès</Strong>.
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
				comparaison={comparaisonPensionInvalidité}
				convertisseur={toEurosParMois}
				libellé={
					<SmallSpan>
						{t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.label',
							'(invalidité partielle)'
						)}
					</SmallSpan>
				}
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
					<Strong>accident professionnel</Strong>, vous pouvez bénéficier d’une{' '}
					<Strong>rente d’incapacité</Strong>.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonRenteIncapacitéATMP}
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
					<Strong>capital décès pour vos ayants droits</Strong> (personnes qui
					sont à votre charge) sous certaines conditions.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonCapitalDécès}
				libellé={t(
					'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.capital-décès.label',
					'pour vos proches'
				)}
			/>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.pension-réversion.body">
					En plus du capital décès, une <Strong>pension de réversion</Strong>{' '}
					peut être versée à votre conjoint/conjointe. Elle correspond aux{' '}
					<Strong>droits à la retraite que vous aurez acquis</Strong> durant sa
					vie professionnelle.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonPensionDeRéversion}
				convertisseur={toEurosParMois}
				libellé={t(
					'pages.simulateurs.comparaison-statuts.items.prévoyance.pension-réversion.label',
					'maximum'
				)}
			/>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.rente-décès.body">
					Pour un décès survenu dans le cadre d’un{' '}
					<Strong>accident professionnel</Strong>, votre conjoint/conjointe peut
					bénéficier d’une <Strong>rente de décès</Strong>.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonRenteDécèsATMP}
				convertisseur={toEurosParMois}
				libellé={t(
					'pages.simulateurs.comparaison-statuts.items.prévoyance.rente-décès.label',
					'en cas d’accident professionnel'
				)}
			/>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.capital-orphelin.body">
					En cas de décès, un <Strong>capital « orphelin »</Strong> est versé à
					<Strong> vos enfants</Strong>, sous certaines conditions.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonCapitalOrphelin}
				displayedUnit={t(
					'pages.simulateurs.comparaison-statuts.items.prévoyance.capital-orphelin.unit',
					'€/enfant'
				)}
			/>
		</>
	)
}

const SmallSpan = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.base};
`
const SmallerSpan = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.min};
`

const BodyNoTopMargin = styled(Body)`
	margin-top: 0;
`
const BodyNoMargin = styled(Body)`
	margin: 0;
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

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
	margin-left: 0.25rem;
`
