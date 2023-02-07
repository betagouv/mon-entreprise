import { Item } from '@react-stately/collections'
import { Trans } from 'react-i18next'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import ItemTitle from './ItemTitle'

const RetraiteItem = () => {
	return (
		<Item
			title={
				<ItemTitle>
					La retraite <Emoji emoji="🧐" />
				</ItemTitle>
			}
			key="retraite"
			hasChildItems={false}
		>
			<H4>
				<Trans>Retraite de base</Trans>
				<ExplicableRule dottedName="protection sociale . retraite . base" />
			</H4>
			<Body>
				Le montant de votre retraite est constitué de{' '}
				<Strong>votre retraite de base + votre retraite complémentaire</Strong>.
			</Body>
		</Item>
	)
}

export default RetraiteItem
