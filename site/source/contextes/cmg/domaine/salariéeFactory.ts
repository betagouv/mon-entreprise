import * as O from 'effect/Option'

import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { SalariéeAMA, SalariéeGED } from './salariée'

export class SalariéeAMAFactory<Prénom extends string = string> {
	private prénoms

	constructor(prénoms: Prénom[]) {
		this.prénoms = prénoms
	}

	build() {
		return {
			mars: O.some(new DéclarationsDeGardeAMAFactory(this.prénoms).build()),
			avril: O.some(new DéclarationsDeGardeAMAFactory(this.prénoms).build()),
			mai: O.some(new DéclarationsDeGardeAMAFactory(this.prénoms).build()),
		} as const satisfies SalariéeAMA<Prénom>
	}
}

export class SalariéeGEDFactory {
	build() {
		return {
			mars: O.some(new DéclarationsDeGardeGEDFactory().build()),
			avril: O.some(new DéclarationsDeGardeGEDFactory().build()),
			mai: O.some(new DéclarationsDeGardeGEDFactory().build()),
		} as const satisfies SalariéeGED
	}
}
