import { DottedName } from '@/../../modele-social'
import { useEngine } from '@/components/utils/EngineContext'
import { H5 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { SmallBody } from '@/design-system/typography/paragraphs'

export default function StatutsDisponibles() {
	return (
		<>
			<H5 as="h2"> Statuts disponibles</H5>
			<SmallBody>
				Les statuts disponibles diffèrent en fonction de l'activité
				professionnelle que vous exercez
			</SmallBody>
			<Ul>
				<Statut statut="entreprise . catégorie juridique . EI . EI" />
				<Statut statut="entreprise . catégorie juridique . EI . auto-entrepreneur" />
				<Statut statut="entreprise . catégorie juridique . SARL . EURL" />
				<Statut statut="entreprise . catégorie juridique . SARL . SARL" />
				<Statut statut="entreprise . catégorie juridique . SAS . SAS" />
				<Statut statut="entreprise . catégorie juridique . SAS . SASU" />
				<Statut statut="entreprise . catégorie juridique . SELARL . SELARL" />
				<Statut statut="entreprise . catégorie juridique . SELARL . SELARLU" />
				<Statut statut="entreprise . catégorie juridique . SELAS . SELAS" />
				<Statut statut="entreprise . catégorie juridique . SELAS . SELASU" />
				<Statut statut="entreprise . catégorie juridique . association" />
			</Ul>
		</>
	)
}

function Statut({ statut }: { statut: DottedName }) {
	const engine = useEngine()

	return <Li>{engine.getRule(statut).title}</Li>
}
