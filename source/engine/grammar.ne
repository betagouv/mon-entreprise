main -> CalcExpression {% d => (['CalcExpression', ...d]) %}
	  |	BooleanVariableExpression {% d => (['BooleanVariableExpression', ...d]) %}
	  | ModifiedVariable {% d => (['ModifiedVariable', ...d]) %}
	  | Comparison {% d => (['Comparison', ...d]) %}

Comparison -> Comparable _ ComparisonOperator _ Comparable

Comparable -> (int | CalcExpression | Variable)

ComparisonOperator -> ">" | "<" | ">=" | "<=" | "="


ModifiedVariable -> Variable _ Modifier

Modifier -> "[" TemporalModifier "]"

TemporalModifier -> "annuel" | "mensuel" | "jour ouvré"

CalcExpression -> Term _ ArithmeticOperator _ Term

Term -> Variable
	  | int

ArithmeticOperator -> "+" | "-" | "*" | "/"

BooleanVariableExpression -> ("!" _):? Variable {% d => (['BooleanVariableExpression', ...d]) %}


VariableWord -> [a-zA-Z\u00C0-\u017F]:+     {% d => (['VariableWord', ...d]) %}

Variable -> VariableFragment (_ Dot _ VariableFragment):*  {% d => (['Variable', ...d]) %}

VariableFragment -> VariableWord (_ VariableWord):* {% d => (['VariableFragment', ...d]) %}

Dot -> [\.] {% d => (['Dot', ...d]) %}

_ -> [\s]     {% function(d) {return null } %}




# PEMDAS!
# We define each level of precedence as a nonterminal.

# Parentheses
P -> "(" _ AS _ ")" {% function(d) {return {type:'P', d:d, v:d[2].v}} %}
    | N             {% id %}

# Exponents
E -> P _ "^" _ E    {% function(d) {return {type:'E', d:d, v:Math.pow(d[0].v, d[4].v)}} %}
    | P             {% id %}

# Multiplication and division
MD -> MD _ "*" _ E  {% function(d) {return {type: 'M', d:d, v:d[0].v*d[4].v}} %}
    | MD _ "/" _ E  {% function(d) {return {type: 'D', d:d, v:d[0].v/d[4].v}} %}
    | E             {% id %}

# Addition and subtraction
AS -> AS _ "+" _ MD {% function(d) {return {type:'A', d:d, v:d[0].v+d[4].v}} %}
    | AS _ "-" _ MD {% function(d) {return {type:'S', d:d, v:d[0].v-d[4].v}} %}
    | MD            {% id %}

# A number or a function of a number
N -> float          {% id %}
    | "sin" _ P     {% function(d) {return {type:'sin', d:d, v:Math.sin(d[2].v)}} %}
    | "cos" _ P     {% function(d) {return {type:'cos', d:d, v:Math.cos(d[2].v)}} %}
    | "tan" _ P     {% function(d) {return {type:'tan', d:d, v:Math.tan(d[2].v)}} %}

    | "asin" _ P    {% function(d) {return {type:'asin', d:d, v:Math.asin(d[2].v)}} %}
    | "acos" _ P    {% function(d) {return {type:'acos', d:d, v:Math.acos(d[2].v)}} %}
    | "atan" _ P    {% function(d) {return {type:'atan', d:d, v:Math.atan(d[2].v)}} %}

    | "pi"          {% function(d) {return {type:'pi', d:d, v:Math.PI}} %}
    | "e"           {% function(d) {return {type:'e', d:d, v:Math.E}} %}
    | "sqrt" _ P    {% function(d) {return {type:'sqrt', d:d, v:Math.sqrt(d[2].v)}} %}
    | "ln" _ P      {% function(d) {return {type:'ln', d:d, v:Math.log(d[2].v)}}  %}

# I use `float` to basically mean a number with a decimal point in it
float ->
      int "." int   {% function(d) {return {v:parseFloat(d[0].v + d[1].v + d[2].v)}} %}
    | int           {% function(d) {return {v:parseInt(d[0].v)}} %}

int -> [0-9]:+        {% function(d) {return {v:d[0].join("")}} %}
