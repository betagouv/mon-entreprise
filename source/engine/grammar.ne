# This grammar is inspired by the "fancier grammar" tab of the nearley playground : https://omrelli.ug/nearley-playground

# Look for the PEMDAS system : Parentheses, Exponents (omitted here), Multiplication, and you should guess the rest :) 

@preprocessor esmodule

@{% 
import {string, filteredVariable, variable, temporalVariable,  operation, boolean, number, percentage } from './grammarFunctions'
%}

main ->
		  AdditionSubstraction {% id %}
		| Comparison {% id %}
		| NonNumericTerminal {% id %}

NumericTerminal ->
		Variable {% id %}
		| TemporalVariable {% id %}
		| FilteredVariable {% id %}
		| percentage {% id %}
		| number {% id %}

Parentheses -> "(" AdditionSubstraction ")" {% ([,e]) => e %}
    | NumericTerminal           {% id %}

ComparisonOperator -> ">" | "<" | ">=" | "<=" | "=" | "!="

Comparison -> Comparable _ ComparisonOperator _ Comparable {% operation('comparison')%}

Comparable -> (  AdditionSubstraction | NonNumericTerminal) {% ([[e]]) => e %}

NonNumericTerminal ->  
	Boolean  {% id %} 
	| String  {% id %}
	| NegatedVariable  {% id %}


NegatedVariable -> "≠" _ Variable {% ([,,{variable}]) => ({'≠': {explanation: variable} }) %}

FilteredVariable -> Variable _ Filter {% filteredVariable %}

Filter -> "[" VariableFragment "]" {% ([,filter]) => filter %}

TemporalVariable -> Variable _ TemporalTransform {% temporalVariable %}

TemporalTransform -> "[" Temporality "]" {% d =>d[1] %}

Temporality -> "annuel" | "mensuel" {% id %}
#-----


# Addition and subtraction
AdditionSubstraction -> AdditionSubstraction _ AdditionSubstractionOperator _ MultiplicationDivision  {%  operation('calculation') %}
    | MultiplicationDivision            {% id %}

	 
AdditionSubstractionOperator	-> "+" {% id %}
	| "-" {% id %}

MultiplicationDivisionOperator	-> "*" {% id %}
	| "/" {% id %}

# Multiplication and division
MultiplicationDivision -> MultiplicationDivision _ MultiplicationDivisionOperator _ Parentheses  {% operation('calculation') %}
    | Parentheses             {% id %}

Term -> Variable {% id %}
		| FilteredVariable {% id %}
		| number {% id %}
		| percentage {% id %}

Variable -> VariableFragment (_ Dot _ VariableFragment {% ([,,,fragment]) => fragment %}):* 
{% variable %}

String -> "'" [ .'a-zA-Z\-\u00C0-\u017F ]:+ "'" {% string %}

VariableFragment -> VariableWord (_ VariableWord {% d=> ' ' + d[1] %}):* {% d => d[0] + d[1].join('') %}


VariableWord -> [a-zA-Z\u00C0-\u017F] [\-'a-zA-Z\u00C0-\u017F]:*     {% d => d[0] + d[1].join('') %}

Dot -> [\.] {% d => null %}

_ -> [\s]     {% d => null %}


number -> [0-9]:+ ([\.] [0-9]:+):?        {% number %}

percentage -> [0-9]:+ ([\.] [0-9]:+):? [\%]        {% percentage %}

Boolean -> (
	"oui"
 | 	"non" ) {% boolean %}

