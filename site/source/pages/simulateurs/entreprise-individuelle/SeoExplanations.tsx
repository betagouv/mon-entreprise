import { Trans } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { Body, Emoji, H2, Message } from '@/design-system'

export const SeoExplanations = () => (
	<Trans i18nKey="pages.simulateurs.ei.seo explanation">
		<H2>
			Comment calculer le revenu net d'un dirigeant d'entreprise individuelle
			(EI)&nbsp;?
		</H2>
		<Body>
			Un dirigeant d'entreprise individuelle doit payer des cotisations et
			contributions sociales à l'administration. Ces cotisations servent au
			financement de la sécurité sociale, et ouvrent des droits notamment pour
			la retraite et pour l'assurance maladie. Elles permettent également de
			financer la formation professionnelle.
		</Body>
		<Body>
			<Emoji emoji="👉" />{' '}
			<RuleLink dottedName="indépendant . cotisations et contributions">
				Voir le détail du calcul des cotisations
			</RuleLink>
		</Body>
		<Body>
			Il ne faut pas oublier de retrancher toutes les dépenses effectuées dans
			le cadre de l'activité professionnelle (équipements, matières premières,
			local, transport). Ces dernières sont déductibles du résultat de
			l'entreprise, cela veut dire que vous ne payerez pas d'impôt ou de
			cotisations sur leur montant (sauf si vous avez opté pour l'option
			micro-fiscal).
		</Body>
		<Body>La formule de calcul complète est donc :</Body>
		<Message
			role="presentation"
			mini
			border={false}
			style={{
				width: 'fit-content',
			}}
		>
			Revenu net = Chiffres d'affaires − Dépenses professionnelles - Cotisations
			sociales
		</Message>
		<H2>
			Comment calculer les cotisations sociales d'une entreprise individuelle ?
		</H2>
		<Body>
			Le dirigeant d'une entreprise individuelle paye des cotisations sociales,
			proportionnelles au{' '}
			<RuleLink dottedName="entreprise . résultat fiscal">
				résultat fiscal
			</RuleLink>{' '}
			de l'entreprise. Leur montant varie également en fonction du type
			d'activité (profession libérale, artisan, commerçants, etc), où des
			éventuelles exonérations accordées (Acre, ZFU, RSA, etc.).
		</Body>
		<Body>
			{' '}
			Comme le résultat d'une entreprise n'est connu qu'à la fin de l'exercice
			comptable, le dirigeant paye des cotisations provisionnelles qui seront
			ensuite régularisée une fois le revenu réel déclaré, l'année suivante.
		</Body>
		<Body>
			Ce simulateur permet de calculer le montant exact des cotisations sociale
			en partant d'un chiffre d'affaires ou d'un revenu net souhaité. Vous
			pourrez préciser votre situation en répondant aux questions s'affichant en
			dessous de la simulation.
		</Body>
	</Trans>
)
