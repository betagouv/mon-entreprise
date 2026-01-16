import { Trans, useTranslation } from 'react-i18next'

import { Body, H2, Link } from '@/design-system'

export const SeoExplanations = () => {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.dividendes.seo">
			<H2>Les dividendes et distributions</H2>
			<Body>
				À la fin de l'exercice d'une société, le résultat de l'exercice
				précédent peut être conservé en réserve (pour de futurs investissements)
				ou bien être versé en dividendes. Du point de vue des bénéficiaires, ce
				sont des revenus de capitaux mobiliers, soumis à cotisations et à une
				imposition spécifiques.
			</Body>
			<Body>
				Ne sont pris en compte dans ce simulateur que les cas de figure du
				bénéficiaire personne physique et des dividendes décidés par la société.
			</Body>
			<H2>Comment sont calculés les prélèvements sur les dividendes ?</H2>
			<Body>
				Les dividendes peuvent être soumis au prélèvement forfaitaire unique de
				30% incluant imposition et contributions sociales (aussi appelé
				<i> flat tax</i>). Par option, le barème de l'impôt peut être choisi. Ce
				simulateur peut être utilisé pour comparer les deux régimes.
			</Body>
			<Body>
				Un acompte du montant de l'impôt (12,8%) est prélevé au moment du
				versement des dividendes, sauf si le bénéficiaire remplit{' '}
				<Link
					rel="noreferrer"
					aria-label={t(
						'certains critères, en savoir plus sur entreprendre.service-public.gouv.fr, nouvelle fenêtre'
					)}
					href="https://entreprendre.service-public.gouv.fr/vosdroits/F32963"
				>
					certains critères
				</Link>
				.
			</Body>
			<H2>Cas particulier du dirigeant non salarié</H2>
			<Body>
				Pour le travailleur indépendant non salarié, la part des dividendes
				dépassant 10% du capital social sera soumise aux cotisations et
				contributions suivant les mêmes modalités que sa rémunération de
				dirigeant.
			</Body>
			<Body>
				Ce cas de figure n'est pas encore pris en compte par ce simulateur.
			</Body>
		</Trans>
	)
}
