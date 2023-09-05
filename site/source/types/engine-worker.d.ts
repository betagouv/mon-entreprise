import { DottedName } from 'modele-social'
import Engine from 'publicodes'

declare module '@publicodes/worker' {
	interface UserConfig {
		engine: Engine<DottedName>
		// additionalActions: ActionType<'test', number[], number>
	}
}
