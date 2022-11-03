import { Trans } from 'react-i18next'

import { LegalStatus } from '@/selectors/companyStatusSelectors'

type Props = {
	statut: LegalStatus
}

const StatutDescription = ({ statut }: Props) =>
	statut === 'EI' ? (
		<Trans i18nKey="formeJuridique.EI">
			Aucun apport en capital n'est nécessaire. Le capital privé et le capital
			de l'entreprise ne font qu'un.
		</Trans>
	) : statut === 'EIRL' ? (
		<Trans i18nKey="formeJuridique.EIRL">
			Permet d'attribuer un capital spécifique à son activité professionnelle,
			et de choisir le régime d'imposition sur les société (IS) plutôt que
			revenu (IR) La société et l'individu constituent la même personne. Ne
			convient pas si l'associé unique est une personne morale (entreprise) ou
			si vous pensez accueillir d'autres associés au cours de votre
			développement (choisissez EURL dans ce cas).
		</Trans>
	) : statut === 'EURL' ? (
		<Trans i18nKey="formeJuridique.EURL">
			L'entreprise n'a qu'un associé. La responsabilité est limitée au montant
			de l'apport de capital. Evolue en SARL lors de l'arrivée de nouveaux
			associés dans la société.
		</Trans>
	) : statut.includes('SARL') ? (
		<Trans i18nKey="formeJuridique.SARL">
			Société ayant au moins deux associés dont la responsabilité financière est
			limitée au montant de leur apport au capital. Le capital minimum est fixé
			librement dans les statuts. Les associés se répartissent des parts
			sociales toutes identiques, et la société est dirigée par un ou plusieurs
			gérants qui sont forcément des personnes physiques. Le fonctionnement
			d'une SARL est encadré par le code du commerce.
		</Trans>
	) : statut === 'SAS' ? (
		<Trans i18nKey="formeJuridique.SAS">
			Société ayant au moins deux associés. La responsabilité financière des
			associés est limitée au montant de leur apport au capital de la société.
			Le capital minimum est fixé librement dans les statuts. Les associés se
			répartissent des actions qui peuvent être de plusieurs catégories, et la
			société est dirigée par un président qui peut être une personne morale
			(une autre société). La SAS se caractérise par une grande souplesse de
			fonctionnement (statuts sur mesure).
		</Trans>
	) : statut === 'SASU' ? (
		<Trans i18nKey="formeJuridique.SASU">
			L'entreprise n'a qu'un associé. La responsabilité est limitée au montant
			de l'apport de capital de l'unique associé (qui peut être une personne
			morale).
		</Trans>
	) : statut === 'SA' ? (
		<Trans i18nKey="formeJuridique.SA">
			Société ayant au moins deux actionnaires. C'est le seul statut qui permet
			d'être coté en bourse (à partir de 7 actionnaires). Le capital social
			minimum est de 37.000 €.
		</Trans>
	) : (statut as string) === 'SNC' ? (
		<Trans i18nKey="formeJuridique.SNC">
			La responsabilité des associés pour les dettes de la société est solidaire
			(un seul associé peut être poursuivi pour la totalité de la dette) et
			indéfinie (responsable sur la totalité de son patrimoine personnel).
		</Trans>
	) : statut === 'auto-entrepreneur' ? (
		<Trans i18nKey="formeJuridique.micro">
			Un auto-entrepreneur exerce son activité en entreprise individuelle, avec
			un régime forfaitaire pour ses cotisations sociales et un calcul
			spécifique de l'impôt.
		</Trans>
	) : statut === 'auto-entrepreneur-EIRL' ? (
		<Trans i18nKey="formeJuridique.micro-EIRL">
			Un auto-entrepreneur option EIRL exerce son activité en entreprise
			individuelle en choisissant l'option "Entrepreneur individuel à
			responsabilité limitée", avec à un régime forfaitaire pour le calcul des
			impôts et le paiement des cotisations de sécurité sociale.
		</Trans>
	) : /* Otherwise */ null

export default StatutDescription
