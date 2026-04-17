import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'
import { H4 } from '@/design-system'

type Props = {
	rule: RègleModèleSocial | RègleModèleAssimiléSalarié
	title?: string
}

export const SalaireLine = ({ rule, title }: Props) => (
	<div className="payslip__paymentLine">
		<H4>
			{title}
			<ExplicableRule light dottedName={rule} />
		</H4>
		<Value linkToRule={false} expression={rule} unit="€" displayedUnit="€" />
	</div>
)
