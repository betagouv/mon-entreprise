// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import { Rule } from 'publicodes'
import { Names as ExoCovidDottedNames } from './dist/names'

declare let rules: Record<ExoCovidDottedNames, Rule>

export type { ExoCovidDottedNames }
export default rules
