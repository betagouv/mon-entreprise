
# To understand or edit this file, use the awesome nearley playground (but save your work, it can crash sometimes) : https://omrelli.ug/nearley-playground/


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

Parentheses -> "(" _ AS _ ")" {% ([,,e]) => e %}
    | NumericTerminal           {% id %}

ComparisonOperator -> ">" | "<" | ">=" | "<=" | "=" | "!="

Comparison -> Comparable _ ComparisonOperator _ Comparable {% ([A, , operator, , B]) => ({
		[operator]: 
		{
		type: 'comparison',
		explanation: 
		[A, B]
		}
}) %}

Comparable -> (  AS | NonNumericTerminal) {% ([[e]]) => e %}

NonNumericTerminal ->  
	Boolean  {% id %} 
	| String  {% id %}
	| NegatedVariable  {% id %}


NegatedVariable -> "≠" _ Variable {% ([,,{variable}]) => ({'≠': {explanation: variable} }) %}

FilteredVariable -> Variable _ Filter {% ([{variable},,filter]) => ({filter: {filter, explanation: variable}}) %}

Filter -> "(" VariableFragment ")" {% ([,filter]) =>filter %}

TemporalVariable -> Variable _ TemporalTransform {% ([{variable},,temporalTransform]) => ({'temporalTransform': {explanation: variable, temporalTransform} }) %}

TemporalTransform -> "[" Temporality "]" {% d =>d[1] %}

Temporality -> "annuel" | "mensuel" {% id %}
#-----


# Addition and subtraction
AS -> AS _ ASOperator _ MD  {% ([A, , operator, , B]) => ({
		[operator]: 
		{
		type: 'calculation',
		explanation: 
		[A, B]
		}
}) %}

    | MD            {% id %}

	 
ASOperator	-> "+" {% id %}
	| "-" {% id %}

MDOperator	-> "*" {% id %}
	| "/" {% id %}

# Multiplication and division
MD -> MD _ MDOperator _ Parentheses  {% 
([A, , operator, , B]) => ({
		[operator]: 
		{
		type: 'calculation',
		explanation: 
		[A, B]
		}
}) %}
   
    | Parentheses             {% id %}

Term -> Variable {% id %}
		| FilteredVariable {% id %}
		| number {% id %}
		| percentage {% id %}

Variable -> VariableFragment (_ Dot _ VariableFragment {% ([,,,fragment]) => fragment %}):* 
{% ([firstFragment, nextFragments]) =>  
({variable: {
	fragments: [firstFragment, ...nextFragments],
}}) %}

String -> "'" [ .'a-zA-Z\-\u00C0-\u017F ]:+ "'" {% d => ({constant: {
	
	type: 'string',
	nodeValue: d[1].join(''),
	rawNode: d[1].join('')
}}) %}

VariableFragment -> VariableWord (_ VariableWord {% d=> ' ' + d[1] %}):* {% d => d[0] + d[1].join('') %}


VariableWord -> [a-zA-Z\u00C0-\u017F] [\-'a-zA-Z\u00C0-\u017F]:*     {% d => d[0] + d[1].join('') %}

Dot -> [\.] {% d => null %}

_ -> [\s]     {% d => null %}


number -> [0-9]:+ ([\.] [0-9]:+):?        {% d => ({constant:{

	rawNode: d.join(''),
nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))}}) %}

percentage -> [0-9]:+ ([\.] [0-9]:+):? [\%]        {% d => ({ 'constant':{

	rawNode: d.join(''),
type: 'percentage', nodeValue: parseFloat(d[0].join("")+(d[1]?(d[1][0]+d[1][1].join("")):""))/100}}) %}


Boolean -> ("oui"
 | "non" ) {% ([val])=> ({constant:{
 
	rawNode: val,
 type: 'boolean', nodeValue: {'oui': true, 'non': false}[val]}}) %}

