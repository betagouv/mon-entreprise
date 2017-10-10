# Pour éditer ou comprendre ce fichier, utilisez l'éditeur web Nearley : https://omrelli.ug/nearley-playground/


main ->
		  CalcExpression {% id %}
		| SumExpression {% id %}
		| Variable {% id %}
		| NegatedVariable {% id %}
		| ModifiedVariable {% id %}
		| FilteredVariable {% id %}
		| percentage {% id %}
		| Comparison {% id %}

#-----
# On appelle SumExpression des expressions qui combinent des additions et des soustractions.
# C'est une généralisation de CalcExpression mais sans * et / pour ne pas introduire la complexité
# de la priorité entre les opérateurs ou des parenthèses.

SumExpression -> SumTerm (_ SumTerm {% d => d[1] %}):*  {% d => ({
	category: 'sumExpression',
	explanation: [d[0], ...d[1]].reduce((memo, next) =>
		Object.assign(memo, {[next.operator]: memo[next.operator].concat(next.explanation)})
	, {'+': [], '-': []})

}) %}


SumTerm -> SumOperator _ VariableTerm {% d => ({
	category: 'sumTerm',
	operator: d[0],
	explanation: d[2]
}) %}

VariableTerm -> Variable {% id %}
		| FilteredVariable {% id %}


SumOperator -> "+" {% id %}
	| "-" {% id %}




Comparison -> Comparable _ ComparisonOperator _ Comparable {% d => ({
	category: 'comparison',
	type: 'boolean',
	operator: d[2][0],
	explanation: [d[0], d[4]]
}) %}

Comparable -> (number | percentage | CalcExpression | Variable | Constant) {% d => d[0][0] %}

ComparisonOperator -> ">" | "<" | ">=" | "<=" | "=" | "!="

NegatedVariable -> "≠" _ Variable {% d => ({category: 'negatedVariable', variable: d[2] }) %}

FilteredVariable -> Variable _ Filter {% d => ({category: 'filteredVariable', filter: d[2], variable: d[0] }) %}

Filter -> "(" VariableWord ")" {% d =>d[1] %}

# Modificateurs temporels pas utilisés aujourd'hui
ModifiedVariable -> Variable _ Modifier {% d => ({category: 'modifiedVariable', modifier: d[2], variable: d[0] }) %}

Modifier -> "[" TemporalModifier "]" {% d =>d[1][0] %}

TemporalModifier -> "annuel" | "mensuel" | "jour ouvré" {% id %}
#-----


CalcExpression -> Term _ ArithmeticOperator _ Term {% d => ({
	category: 'calcExpression',
	operator: d[2],
	explanation: [d[0], d[4]],
	type: 'numeric'
}) %}

Term -> Variable {% id %}
		| FilteredVariable {% id %}
		| number {% id %}
		| percentage {% id %}

ArithmeticOperator -> "+" {% id %}
	| "-" {% id %}
	| "*" {% id %}
	| "/" {% id %}





# BooleanVariableExpression -> ("!" _):? Variable {% d => (['BooleanVariableExpression', ...d]) %}


Variable -> VariableFragment (_ Dot _ VariableFragment {% d => d[3] %}):*  {% d => ({
	category: 'variable',
	fragments: [d[0], ...d[1]],
	type: 'numeric | boolean'
}) %}

Constant -> "'" [ .'a-zA-Z\u00C0-\u017F ]:+ "'" {% d => ({
	category: 'value',
	type: 'string',
	nodeValue: d[1].join('')
}) %}

VariableFragment -> VariableWord (_ VariableWord {% d=> ' ' + d[1] %}):* {% d => d[0] + d[1].join('') %}


VariableWord -> [a-zA-Z\u00C0-\u017F] ['a-zA-Z\u00C0-\u017F]:*     {% d => d[0] + d[1].join('') %}

Dot -> [\.] {% d => null %}

_ -> [\s]     {% d => null %}


number -> [0-9]:+ ([\.] [0-9]:+):?        {% d => ({category: 'value', nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))}) %}

percentage -> [0-9]:+ ([\.] [0-9]:+):? [\%]        {% d => ({category: 'percentage', nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))/100}) %}
