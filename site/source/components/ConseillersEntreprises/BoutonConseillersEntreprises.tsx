import { ComponentType, lazy, Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
	Body,
	BorderlessButton,
	Button,
	PhoneIcon,
	PopoverWithTrigger,
} from '@/design-system'

import Loader from '../utils/Loader'

export type ConseillersEntreprisesVariant =
	| 'activite_partielle'
	| 'recrutement'
	| 'micro_entrepreneur'
	| 'revenus_par_statut'
	| 'professions_liberales'

type Props = {
	variant: ConseillersEntreprisesVariant
	siret?: string | null
}

export const BoutonConseillersEntreprises = ({ variant, siret }: Props) => {
	const { t } = useTranslation()

	const paths: Record<ConseillersEntreprisesVariant, string> = {
		recrutement:
			'/aide-entreprise/rh-mon-entreprise-urssaf-fr/theme/recrutement-formation',
		activite_partielle:
			'/aide-entreprise/activite-partielle-mon-entreprise-urssaf-fr/theme/droit-du-travail',
		micro_entrepreneur:
			'/aide-entreprise/simulateur-de-revenus-des-micro-entrepreneurs-sur-mon-entreprise',
		revenus_par_statut:
			'/aide-entreprise/simulateur-de-revenus-par-statut-sur-mon-entreprise',
		professions_liberales:
			'/aide-entreprise/professions-liberales-mon-entreprise-urssaf-fr',
	}

	const baseURL = 'https://conseillers-entreprises.service-public.gouv.fr'

	const url = new URL(baseURL + paths[variant])

	const contentRef = useRef<HTMLDivElement>(null)

	const scrollTo = (x: number, y: number) => {
		contentRef.current?.scrollTo(x, y)
	}

	if (siret) {
		url.searchParams.set('siret', siret)
	}

	return (
		<PopoverWithTrigger
			title={t('Échanger avec un conseiller')}
			trigger={() => (
				<BorderlessButton aria-haspopup="dialog">
					<PhoneIcon />
					{t(
						'components.simulateur.conseillers-entreprise.bouton',
						'Échanger avec un conseiller'
					)}
				</BorderlessButton>
			)}
			contentRef={contentRef}
		>
			{(close) => (
				<>
					<Body>
						{t(
							'components.simulateur.conseillers-entreprise.description',
							`Décrivez votre projet ou votre problème en donnant quelques éléments de contexte. Conseillers-Entreprises Service Public identifiera, parmi l'ensemble des partenaires publics et parapublics, le conseiller compétent pour votre demande. Celui-ci vous contactera par téléphone sous 5 jours et vous accompagnera en fonction de votre situation.`
						)}
					</Body>

					<Suspense fallback={<Loader />}>
						<LazyConseillersEntreprisesIframe
							src={url.href}
							onLoad={() => {
								document.getElementById('pdeIframe')?.focus()
								scrollTo(0, 0)
							}}
						/>
					</Suspense>

					<Body style={{ textAlign: 'right' }}>
						<Button aria-label={t('Fermer')} size="XS" onPress={close}>
							{t('Fermer')}
						</Button>
					</Body>
				</>
			)}
		</PopoverWithTrigger>
	)
}

const LazyConseillersEntreprisesIframe = lazy<
	ComponentType<{ src: string; onLoad: () => void }>
>(async () => {
	return import('./ConseillersEntreprisesIframe').then(
		({ ConseillersEntreprisesIframe }) => ({
			default: ConseillersEntreprisesIframe,
		})
	)
})
