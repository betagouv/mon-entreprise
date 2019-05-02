# Pour éditer ou comprendre ce fichier, utilisez l'éditeur web Nearley : https://omrelli.ug/nearley-playground/


main ->
		  AS {% id %}
		| Comparison {% id %}
		| NonNumericTerminal {% id %}

NumericTerminal ->
		Variable {% id %}
		| TemporalVariable {% id %}
		| FilteredVariable {% id %}
		| percentage {% id %}
		| number {% id %}

# Parentheses
P -> "(" _ AS _ ")" {% function(d) {return {category:'parentheses', explanation: d[2]}} %}
    | NumericTerminal           {% id %}


Comparison -> Comparable _ ComparisonOperator _ Comparable {% d => ({
	category: 'comparison',
	type: 'boolean',
	operator: d[2][0],
	explanation: [d[0], d[4]]
}) %}

Comparable -> (  AS | NonNumericTerminal) {% d => d[0][0] %}

NonNumericTerminal ->  
	Boolean  {% id %} 
	| String  {% id %}
	| NegatedVariable  {% id %}


ComparisonOperator -> ">" | "<" | ">=" | "<=" | "=" | "!="

NegatedVariable -> "≠" _ Variable {% d => ({category: 'negatedVariable', variable: d[2] }) %}

FilteredVariable -> Variable _ Filter {% d => ({category: 'variable', filter: d[2], variable: d[0] }) %}

Filter -> "(" VariableFragment ")" {% d =>d[1] %}

TemporalVariable -> Variable _ TemporalTransform {% d => ({...d[0], temporalTransform: d[2] }) %}

TemporalTransform -> "[" Temporalities "]" {% d =>d[1] %}

Temporalities -> "annuel" | "mensuel" {% id %}
#-----


# Addition and subtraction
AS -> AS _ ASOperator _ MD  {% d => ({
	category: 'calcExpression',
	operator: d[2],
	explanation: [d[0], d[4]],
	type: 'numeric'
}) %}

    | MD            {% id %}

	 
ASOperator	-> "+" {% id %}
	| "-" {% id %}

MDOperator	-> "*" {% id %}
	| "/" {% id %}

# Multiplication and division
MD -> MD _ MDOperator _ P  {% d => ({
	category: 'calcExpression',
	operator: d[2],
	explanation: [d[0], d[4]],
	type: 'numeric'
}) %}
   
    | P             {% id %}

Term -> Variable {% id %}
		| FilteredVariable {% id %}
		| number {% id %}
		| percentage {% id %}

Variable -> VariableFragment (_ Dot _ VariableFragment {% d => d[3] %}):*  {% d => ({
	category: 'variable',
	fragments: [d[0], ...d[1]],
	type: 'numeric | boolean'
}) %}

String -> "'" [ .'a-zA-Z\-\u00C0-\u017F ]:+ "'" {% d => ({
	category: 'value',
	type: 'string',
	nodeValue: d[1].join('')
}) %}

VariableFragment -> VariableWord (_ VariableWord {% d=> ' ' + d[1] %}):* {% d => d[0] + d[1].join('') %}


VariableWord -> [a-zA-Z\u00C0-\u017F] [\-'a-zA-Z\u00C0-\u017F]:*     {% d => d[0] + d[1].join('') %}

Dot -> [\.] {% d => null %}

_ -> [\s]     {% d => null %}


number -> [0-9]:+ ([\.] [0-9]:+):?        {% d => ({category: 'value', nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))}) %}

percentage -> [0-9]:+ ([\.] [0-9]:+):? [\%]        {% d => ({category: 'percentage', nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))/100}) %}

Boolean -> "oui" {% d=> ({category: 'boolean', nodeValue: true}) %}
 | "non" {% d=> ({category: 'boolean', nodeValue: false}) %}

