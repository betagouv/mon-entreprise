/* @flow */
// eslint-disable-next-line no-unused-vars
import { React, T } from 'Components'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'
type Props = {
	status: LegalStatus
}

const StatusDescription = ({ status }: Props) =>
	status === 'EI' ? (
		<T k="formeJuridique.EI">
			Également appelée société en nom propre. Aucun capital n'est nécessaire.
			Le capital privé et le capital de l'entreprise ne font qu'un.
		</T>
	) : status === 'EIRL' ? (
		<T k="formeJuridique.EIRL">
			Permet de protéger son patrimoine personnel en attribuant un capital
			spécifique à son activité professionnelle. La société et l'individu
			constituent la même personne. Ne convient pas si l'associé unique est une
			personne morale (entreprise) ou si vous pensez accueillir d'autres
			associés au cours de votre développement (choisissez EURL dans ce cas).
		</T>
	) : status === 'EURL' ? (
		<T k="formeJuridique.EURL">
			L'entreprise n'a qu'un associé. La responsabilité est limitée au montant
			de l'apport de capital de l'unique associé. Evolue en SARL lors de
			l'arrivée de nouveaux associés dans la société.
		</T>
	) : status.includes('SARL') ? (
		<T k="formeJuridique.SARL">
			Société ayant au moins deux associés dont la responsabilité financière est
			limitée au montant de leur apport au capital. Le capital minimum est fixé
			librement dans les statuts. Les associés se répartissent des parts
			sociales toutes identiques, et la société est dirigée par un ou plusieurs
			gérants qui sont forcément des personnes physiques. Le fonctionnement
			d'une SARL n'est pas libre, il est encadré par le code du commerce.
		</T>
	) : status === 'SAS' ? (
		<T k="formeJuridique.SAS">
			Société ayant au moins deux associés. La responsabilité financière des
			associés est limitée au montant de leur apport au capital de la société.
			Le capital minimum est fixé librement dans les statuts. Les associés se
			répartissent des actions qui peuvent être de plusieurs catégories, et la
			société est dirigée notamment par un président qui peut être une personne
			morale (une autre société). Le fonctionnement d'une SAS est peu encadré
			par la législation.
		</T>
	) : status === 'SASU' ? (
		<T k="formeJuridique.SASU">
			L'entreprise n'a qu'un associé. La responsabilité est limitée au montant
			de l'apport de capital de l'unique associé. Le fonctionnement d'une SASU
			est peu encadré par la législation.
		</T>
	) : status === 'SA' ? (
		<T k="formeJuridique.SA">
			Société ayant au moins deux actionnaires. C'est le seul statut qui permet
			d'être coté en bourse (à partir de 7 actionnaires). Le capital social
			minimum est de 37.000 €.
		</T>
	) : status === 'SNC' ? (
		<T k="formeJuridique.SNC">
			La responsabilité des associés pour les dettes de la société est solidaire
			(un seul associé peut être poursuivi pour la totalité de la dette) et
			indéfinie (responsable sur la totalité de son patrimoine personnel).
		</T>
	) : status.includes('micro-entreprise') ? (
		<T k="formeJuridique.micro">
			La micro-entreprise est une entreprise individuelle, soumise à un régime
			forfaitaire pour le calcul des impôts et le paiement des cotisations de
			sécurité sociale.
		</T>
	) : /* Otherwise */ null

export default StatusDescription
