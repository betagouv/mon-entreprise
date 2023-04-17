import { Markdown } from '@/components/utils/markdown'
import { PopoverWithTrigger } from '@/design-system'
import { Link } from '@/design-system/typography/link'

export default function Exceptions() {
	return (
		<PopoverWithTrigger
			title="Liste des cas non pris en compte"
			trigger={(props) => (
				<Link {...props} aria-haspopup="dialog">
					Voir les cas non pris en compte.
				</Link>
			)}
		>
			<Markdown>{CONTENT}</Markdown>
		</PopoverWithTrigger>
	)
}

const CONTENT = `
Voici une liste non exhaustives des cas non pris en compte dans la version actuelle de l'assistant à la déclaration de revenus.

### Type d'entreprises
- Auto-entrepreneur
- SARL avec plusieurs associés
- SAS(U)
- SELARL / SELAS
- Entreprises agricoles

### Type d'activité
- Artiste-auteur
- Professions libérales reglementées
- Agents généraux d’assurances

### Entreprises imposées à l'impôt sur le revenu
- Revenus de type agricoles (BA)
- Revenus non professionnels : loueurs meublés en non professionnel (LMNP), non commerciaux (BNC NON PRO) et industriels et commerciaux (BIC NON PRO).
- Réductions et crédits d'impôts (CIR, compétitivité et emploi, etc.)
- Inventeurs, auteurs de logiciels (Revenus nets de la cession ou concession
  de brevets et assimilés taxables)

### Entreprises imposées à l'impôt sur les sociétés
- Déclaration des dividendes
- Associés gérant frais réels

### Divers
- Revenus issus de plusieurs entreprises distinctes
- Cession d'activité courant 2022
- Déclaration pour une personne à charge
- Intérêts d’emprunt pour acquisition des parts des associés gérants
- Revenus étrangers
- Entreprises imposées au régime réel normal
- Débitants de tabac
- Exonération LODEOM
`
