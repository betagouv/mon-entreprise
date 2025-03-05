import {
  Arrow,
  BasepathContext,
  DottedNameContext,
  EngineContext,
  RenderersContext,
  RuleLink,
  RuleLinkWithContext,
  defaultRenderers,
  useEngine
} from "./chunk-ZVHZ5K54.js";

// src/index.ts
import { utils as utils6 } from "publicodes";

// src/Explanation.tsx
import { transformAST } from "publicodes";

// src/mecanisms/common/InfixMecanism.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var InfixMecanism = ({
  value,
  prefixed,
  children
}) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    prefixed && children,
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "value",
        style: {
          position: "relative",
          margin: "1rem 0"
        },
        children: /* @__PURE__ */ jsx(Explanation, { node: value })
      }
    ),
    !prefixed && children
  ] });
};

// src/mecanisms/Arrondi.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function MecanismArrondi(node) {
  return /* @__PURE__ */ jsx2(InfixMecanism, { value: node.explanation.valeur, children: /* @__PURE__ */ jsxs2("p", { children: [
    /* @__PURE__ */ jsx2("strong", { children: "Arrondi : " }),
    /* @__PURE__ */ jsx2(Explanation, { node: node.explanation.arrondi })
  ] }) });
}

// src/mecanisms/Barème.tsx
import { parseUnit } from "publicodes";
import { styled as styled3 } from "styled-components";

// src/mecanisms/common/Mecanism.tsx
import { css, styled as styled2 } from "styled-components";

// src/mecanisms/common/NodeValueLeaf.tsx
import { formatValue } from "publicodes";
import { styled } from "styled-components";
import { jsx as jsx3 } from "react/jsx-runtime";
var NodeValueLeaf = ({ data, unit }) => {
  return /* @__PURE__ */ jsx3(
    StyledNodeValuePointer,
    {
      className: "node-value-pointer",
      title: data === null ? "Non applicable" : "",
      "aria-label": data === null ? "Valeur non applicable" : "",
      children: data === null ? /* @__PURE__ */ jsx3("span", { "aria-hidden": true, children: "-" }) : formatValue({ nodeValue: data, unit })
    }
  );
};
var StyledNodeValuePointer = styled.span`
	background: white;
	border-bottom: 0 !important;
	font-size: 0.875rem;
	line-height: 1.25rem;
	margin: 0 0.2rem;
	flex-shrink: 0;
	padding: 0.1rem 0.2rem;
	text-decoration: none !important;
	box-shadow:
		0px 1px 2px 1px #d9d9d9,
		0 0 0 1px #d9d9d9;
	border: 1px solid #f8f9fa;
	border-radius: 0.2rem;
`;

// src/mecanisms/common/mecanismColors.ts
var colors = {
  "applicable si": "#7B1FA2",
  "non applicable si": "#7B1FA2",
  "est applicable": "#00796B",
  "est non applicable": "#00796B",
  "est d\xE9fini": "#00796B",
  "est non d\xE9fini": "#00796B",
  somme: "#18457B",
  plafond: "#EF6C00",
  plancher: "#EF6C00",
  abattement: "#B73731",
  produit: "#2ecc71",
  "une de ces conditions": "#3498db",
  "toutes ces conditions": "#3498db",
  "le maximum de": "#795548",
  "le minimum de": "#795548",
  variations: "#FF9800",
  "par d\xE9faut": "#00695C",
  "taux progressif": "#795548",
  bar\u00E8me: "#9B296F",
  grille: "#AD1457",
  avec: "#2653ce"
};
var mecanismColors_default = (name) => colors[name] || "palevioletred";

// src/mecanisms/common/Mecanism.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function Mecanism({
  name,
  value,
  children,
  unit,
  displayName = true
}) {
  return /* @__PURE__ */ jsxs3(StyledMecanism, { mecanismName: name, children: [
    displayName && /* @__PURE__ */ jsx4(MecanismName, { name, children: name }),
    /* @__PURE__ */ jsxs3("div", { children: [
      children,
      value !== void 0 && /* @__PURE__ */ jsxs3(StyledMecanismValue, { children: [
        /* @__PURE__ */ jsx4("small", { children: " =\xA0" }),
        /* @__PURE__ */ jsx4(NodeValueLeaf, { data: value, unit })
      ] })
    ] })
  ] });
}
var StyledMecanism = styled2.div`
	border: 1px solid;
	max-width: 100%;
	border-radius: 3px;
	padding: 0.5rem 1rem;
	position: relative;
	flex: 1;
	flex-direction: column;
	text-align: left;
	border-color: ${({ mecanismName }) => mecanismColors_default(mecanismName)};
	.properties > li {
		margin: 1rem 0;
	}
`;
var MecanismName = ({
  name,
  inline = false,
  children
}) => {
  return /* @__PURE__ */ jsx4(Fragment, { children: /* @__PURE__ */ jsx4(
    StyledMecanismName,
    {
      name,
      inline,
      target: "_blank",
      href: `https://publi.codes/docs/api/m\xE9canismes#${name}`,
      children
    }
  ) });
};
var StyledMecanismName = styled2.a`
	background-color: ${({ name }) => mecanismColors_default(name)} !important;
	font-size: inherit;
	display: inline-block;
	font-weight: inherit;
	width: fit-content;
	font-family: inherit;
	padding: 0.4rem 0.6rem !important;
	color: white !important;
	transition: hover 0.2s;
	:hover {
		color: white;
	}
	${(props) => props.inline ? css`
				border-radius: 0.3rem;
				margin-bottom: 0.5rem;
			` : css`
				top: -0.5rem;
				position: relative;
				margin-left: -1rem;
				border-radius: 0 !important;
				border-bottom-right-radius: 0.3rem !important;
				::first-letter {
					text-transform: capitalize;
				}
			`}
	:hover {
		opacity: 0.8;
	}
`;
var StyledMecanismValue = styled2.div`
	text-align: right;
	margin-top: 1rem;
	font-weight: bold;
`;

// src/mecanisms/Barème.tsx
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function Bar\u00E8me({ nodeValue, explanation, unit }) {
  return /* @__PURE__ */ jsx5(Mecanism, { name: "bar\xE8me", value: nodeValue, unit, children: /* @__PURE__ */ jsx5(StyledComponent, { children: /* @__PURE__ */ jsxs4("ul", { className: "properties", children: [
    /* @__PURE__ */ jsx5(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ jsx5(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    ),
    nodeValue != void 0 && explanation.tranches.length > 2 && /* @__PURE__ */ jsxs4(Fragment2, { children: [
      /* @__PURE__ */ jsx5("b", { children: "Taux moyen : " }),
      /* @__PURE__ */ jsx5(
        NodeValueLeaf,
        {
          data: 100 * nodeValue / (explanation.assiette.nodeValue ?? 1),
          unit: parseUnit("%")
        }
      )
    ] })
  ] }) }) });
}
var Bar\u00E8meAttributes = ({
  explanation
}) => {
  const multiplicateur = explanation.multiplicateur;
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsxs4("li", { children: [
      /* @__PURE__ */ jsx5("span", { className: "key", children: "Assiette : " }),
      /* @__PURE__ */ jsx5("span", { className: "value", children: /* @__PURE__ */ jsx5(Explanation, { node: explanation.assiette }) })
    ] }, "assiette"),
    multiplicateur && !multiplicateur.isDefault && /* @__PURE__ */ jsxs4("li", { children: [
      /* @__PURE__ */ jsx5("span", { className: "key", children: "Multiplicateur : " }),
      /* @__PURE__ */ jsx5("span", { className: "value", children: /* @__PURE__ */ jsx5(Explanation, { node: multiplicateur }) })
    ] }, "multiplicateur")
  ] });
};
var TrancheTable = ({
  tranches,
  multiplicateur
}) => {
  const activeTranche = tranches.find(({ isActive }) => isActive);
  if (!tranches.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs4("table", { className: "tranches", children: [
    /* @__PURE__ */ jsx5("thead", { children: /* @__PURE__ */ jsxs4("tr", { children: [
      /* @__PURE__ */ jsx5("th", { children: "Plafonds des tranches" }),
      "taux" in tranches[0] && /* @__PURE__ */ jsx5("th", { children: "Taux" }),
      ("montant" in tranches[0] || activeTranche?.nodeValue != void 0) && /* @__PURE__ */ jsx5("th", { children: "Montant" })
    ] }) }),
    /* @__PURE__ */ jsx5("tbody", { children: tranches.map((tranche, i) => /* @__PURE__ */ jsx5(Tranche, { tranche, multiplicateur }, i)) })
  ] });
};
var Tranche = ({ tranche, multiplicateur }) => {
  const isHighlighted = tranche.isActive;
  return /* @__PURE__ */ jsxs4("tr", { className: `tranche ${isHighlighted ? "activated" : ""}`, children: [
    /* @__PURE__ */ jsx5("td", { children: tranche.plafond.nodeValue === Infinity ? "Au-del\xE0 du dernier plafond" : /* @__PURE__ */ jsxs4(Fragment2, { children: [
      "Inf\xE9rieur \xE0 ",
      /* @__PURE__ */ jsx5(Explanation, { node: tranche.plafond }),
      multiplicateur && !multiplicateur.isDefault && /* @__PURE__ */ jsxs4(Fragment2, { children: [
        " \xD7 ",
        /* @__PURE__ */ jsx5(Explanation, { node: multiplicateur })
      ] })
    ] }) }, "tranche"),
    "taux" in tranche && /* @__PURE__ */ jsx5("td", { children: /* @__PURE__ */ jsx5(Explanation, { node: tranche.taux }) }, "taux"),
    (tranche.nodeValue != void 0 || "montant" in tranche) && /* @__PURE__ */ jsx5("td", { children: "montant" in tranche ? /* @__PURE__ */ jsx5(Explanation, { node: tranche.montant }) : /* @__PURE__ */ jsx5(NodeValueLeaf, { data: tranche.nodeValue, unit: tranche.unit }) }, "value")
  ] });
};
var StyledComponent = styled3.div`
	table {
		margin: 1em 0;
		width: 100%;
		text-align: left;
		font-weight: 400;
	}
	table td {
		padding: 0.1em 0.4em;
	}
	table th {
		font-weight: 600;
	}
	table th:first-letter {
		text-transform: uppercase;
	}
	.tranche:nth-child(2n) {
		background: var(--lightestColor);
	}
	.tranche.activated {
		background: var(--lighterColor);
		font-weight: bold;
	}
`;

// src/mecanisms/common/DefaultInlineMecanism.tsx
import { useContext as useContext2, useMemo, useState as useState2 } from "react";
import { css as css2, styled as styled5 } from "styled-components";

// src/mecanisms/Reference.tsx
import { createContext, useContext, useState } from "react";
import { styled as styled4 } from "styled-components";
import { Fragment as Fragment3, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function Reference(node) {
  const engine = useContext(EngineContext);
  const { dottedName, nodeValue, unit } = node;
  const rule = engine?.context.parsedRules[node.dottedName];
  if (!rule) {
    throw new Error(`Unknown rule: ${dottedName}`);
  }
  const [folded, setFolded] = useState(true);
  const isFoldEnabled = useContext(UnfoldIsEnabledContext);
  if (node.dottedName === node.contextDottedName + " . " + node.name && !node.name.includes(" . ") && rule.virtualRule) {
    return /* @__PURE__ */ jsx6(Explanation, { node: engine?.evaluate(rule) });
  }
  return /* @__PURE__ */ jsxs5(
    "div",
    {
      style: {
        display: "flex",
        flex: isFoldEnabled ? 1 : "initial",
        flexDirection: "column",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ jsxs5(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ jsx6("span", { style: { paddingRight: "0.2rem" }, children: /* @__PURE__ */ jsx6(RuleLinkWithContext, { dottedName }) }),
              /* @__PURE__ */ jsxs5(
                "div",
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "baseline"
                  },
                  children: [
                    isFoldEnabled && /* @__PURE__ */ jsxs5(Fragment3, { children: [
                      /* @__PURE__ */ jsx6(
                        UnfoldButton,
                        {
                          onClick: () => setFolded(!folded),
                          "aria-expanded": !folded,
                          className: "publicodes_btn-small",
                          "aria-label": folded ? "D\xE9plier, afficher le d\xE9tail" : "Replier, afficher le d\xE9tail",
                          children: folded ? "D\xE9plier" : "Replier"
                        }
                      ),
                      /* @__PURE__ */ jsx6(StyledGuide, {})
                    ] }),
                    nodeValue !== void 0 && /* @__PURE__ */ jsx6(NodeValueLeaf, { data: nodeValue, unit })
                  ]
                }
              )
            ]
          }
        ),
        " ",
        !folded && /* @__PURE__ */ jsx6("div", { children: /* @__PURE__ */ jsx6(UnfoldIsEnabledContext.Provider, { value: false, children: /* @__PURE__ */ jsx6(Explanation, { node: engine?.evaluate(rule) }) }) })
      ]
    }
  );
}
var UnfoldIsEnabledContext = createContext(false);
var UnfoldButton = styled4.button`
	text-transform: none !important;
`;
var StyledGuide = styled4.div`
	@media (max-width: 500px) {
		/* border: none; */
	}
	margin: 0.5rem;
	flex: 1;
	border-bottom: 2px dotted lightgray;
`;

// src/mecanisms/common/DefaultInlineMecanism.tsx
import { Fragment as Fragment4, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function DefaultInlineMecanism({
  sourceMap,
  nodeValue,
  unit
}) {
  const { args, mecanismName } = sourceMap;
  const isChainableMecanism = "valeur" in args && mecanismName in args && Object.keys(args).length === 2;
  const isUnaryMecanism = "valeur" in args && Object.keys(args).length === 1;
  return /* @__PURE__ */ jsxs6(Fragment4, { children: [
    isChainableMecanism && /* @__PURE__ */ jsx7(ListOrScalarExplanation, { node: args.valeur }),
    /* @__PURE__ */ jsx7(
      "div",
      {
        style: {
          marginTop: isChainableMecanism ? "1rem" : 0
        },
        children: /* @__PURE__ */ jsx7(Mecanism, { name: mecanismName, value: nodeValue, unit, children: isChainableMecanism ? /* @__PURE__ */ jsx7(
          ListOrScalarExplanation,
          {
            node: args[mecanismName],
            mecanismName
          }
        ) : isUnaryMecanism ? /* @__PURE__ */ jsx7(
          ListOrScalarExplanation,
          {
            node: args.valeur,
            mecanismName
          }
        ) : /* @__PURE__ */ jsx7("ul", { children: Object.entries(args).map(([key, value]) => /* @__PURE__ */ jsxs6(
          "li",
          {
            style: {
              display: "flex",
              alignItems: "baseline",
              padding: "0.25rem 0"
            },
            children: [
              /* @__PURE__ */ jsxs6("span", { children: [
                key,
                "\xA0:\xA0"
              ] }),
              /* @__PURE__ */ jsx7("span", { children: /* @__PURE__ */ jsx7(ListOrScalarExplanation, { node: value }) })
            ]
          },
          key
        )) }) })
      }
    )
  ] });
}
function ListOrScalarExplanation({
  node,
  mecanismName
}) {
  if (Array.isArray(node)) {
    const sign = mecanismName === "produit" ? "\xD7" : mecanismName === "somme" ? "+" : void 0;
    return /* @__PURE__ */ jsx7(
      Table,
      {
        explanation: node,
        hideNotApplicable: mecanismName !== "produit",
        sign
      }
    );
  }
  return /* @__PURE__ */ jsx7(Explanation, { node });
}
var isZeroOrNotApplicable = (x) => {
  const nodeValue = useContext2(EngineContext)?.evaluate(x).nodeValue;
  return nodeValue === null || nodeValue === 0;
};
function Table({ explanation, hideNotApplicable = true, sign }) {
  const [applicableExplanation, notApplicableExplanation] = explanation.reduce(
    (acc, x) => {
      acc[hideNotApplicable && isZeroOrNotApplicable(x) ? 1 : 0].push(x);
      return acc;
    },
    [[], []]
  );
  const [showNotApplicable, setShowNotApplicable] = useState2(
    applicableExplanation.length === 0
  );
  const id = useMemo(
    () => "notApplicableExplanation" + Math.random().toString(36).substring(7),
    []
  );
  return /* @__PURE__ */ jsxs6(Fragment4, { children: [
    /* @__PURE__ */ jsx7(StyledListContainer, { $sign: sign, children: applicableExplanation.map((node, i) => /* @__PURE__ */ jsx7(Row, { node }, i)) }),
    notApplicableExplanation.length > 0 && applicableExplanation.length !== 0 && /* @__PURE__ */ jsx7(
      StyledButtonContainer,
      {
        style: {
          textAlign: "right"
        },
        children: /* @__PURE__ */ jsx7(
          "button",
          {
            "aria-expanded": showNotApplicable,
            "aria-controls": id,
            className: "publicodes_btn-small",
            onClick: () => setShowNotApplicable(!showNotApplicable),
            children: showNotApplicable ? "Masquer les valeurs non applicable" : `Voir toute la liste`
          }
        )
      }
    ),
    showNotApplicable && /* @__PURE__ */ jsx7(
      StyledListContainer,
      {
        id,
        $sign: sign,
        $showFirst: applicableExplanation.length > 0,
        children: notApplicableExplanation.map((node, i) => /* @__PURE__ */ jsx7(Row, { node }, i))
      }
    )
  ] });
}
var StyledButtonContainer = styled5.div`
	margin: 0.5rem 0;
	margin-left: 1rem;
`;
var StyledListContainer = styled5.ul`
	margin: 0;
	margin-left: 1rem;

	${({ $sign, $showFirst }) => $sign && !$showFirst && css2`
			& > li:first-child::marker {
				content: '';
			}
		`}
	${({ $sign }) => $sign && css2`
			& > li::marker {
				font-weight: bold;
				content: '${$sign}  ';
			}
		`}
`;
function Row({ node }) {
  return /* @__PURE__ */ jsx7(StyledRow, { style: { padding: "0.25rem 0" }, children: /* @__PURE__ */ jsx7(UnfoldIsEnabledContext.Provider, { value: true, children: /* @__PURE__ */ jsx7(Explanation, { node }) }) });
}
var StyledRow = styled5.li`
	> * {
		width: 100%;
	}
`;

// src/mecanisms/Condition.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function MecanismCondition(node) {
  return /* @__PURE__ */ jsx8(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: { mecanismName: node.nodeKind, args: node.explanation }
    }
  );
}

// src/mecanisms/Constant.tsx
import { formatValue as formatValue2 } from "publicodes";
import { jsx as jsx9 } from "react/jsx-runtime";
function Constant({
  nodeValue,
  type,
  fullPrecision,
  unit
}) {
  if (nodeValue === void 0) {
    return null;
  }
  if (nodeValue === null) {
    return /* @__PURE__ */ jsx9("span", { className: "value", children: formatValue2({ nodeValue }) });
  } else if (fullPrecision) {
    return /* @__PURE__ */ jsx9("span", { className: type, children: formatValue2(
      { nodeValue, unit },
      {
        precision: 5
      }
    ) });
  } else {
    return /* @__PURE__ */ jsx9("span", { className: "value", children: formatValue2({ nodeValue, unit }) });
  }
}

// src/mecanisms/Contexte.tsx
import { Fragment as Fragment5 } from "react";
import { styled as styled6 } from "styled-components";
import { Fragment as Fragment6, jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function Contexte({ explanation }) {
  const engine = useEngine();
  const contexteEngine = explanation.subEngineId ? engine.subEngines[explanation.subEngineId] ?? engine : engine;
  return /* @__PURE__ */ jsxs7(Fragment6, { children: [
    /* @__PURE__ */ jsxs7(Mecanism, { name: "contexte", children: [
      /* @__PURE__ */ jsx10("p", { children: "Ce calcul est effectu\xE9 en changeant les valeurs des r\xE8gles suivantes :" }),
      /* @__PURE__ */ jsx10(StyledDL, { children: explanation.contexte.map(([origin, newValue]) => /* @__PURE__ */ jsxs7(Fragment5, { children: [
        /* @__PURE__ */ jsx10("dt", { children: /* @__PURE__ */ jsx10(RuleLinkWithContext, { dottedName: origin.dottedName }) }),
        /* @__PURE__ */ jsxs7("dd", { children: [
          /* @__PURE__ */ jsx10("span", { "aria-hidden": true, children: " = " }),
          /* @__PURE__ */ jsx10(Explanation, { node: newValue })
        ] })
      ] }, origin.dottedName)) })
    ] }),
    /* @__PURE__ */ jsx10(EngineContext.Provider, { value: contexteEngine, children: /* @__PURE__ */ jsx10(Explanation, { node: explanation.valeur }) })
  ] });
}
var StyledDL = styled6.dl`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.6rem;
	line-height: 1.75;
	dd {
		margin: 0;
		display: flex;
		gap: 0.5rem;
	}
	@media (max-width: 600px) {
		grid-template-columns: auto;
		line-height: initial;
		dd {
			justify-content: flex-end;
			margin-bottom: 0.5rem;
		}
	}
`;

// src/mecanisms/Durée.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function MecanismDur\u00E9e(node) {
  return /* @__PURE__ */ jsx11(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: { mecanismName: node.nodeKind, args: node.explanation }
    }
  );
}

// src/mecanisms/EstNonApplicable.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
function MecanismEstNonApplicable(node) {
  return /* @__PURE__ */ jsx12(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: {
        mecanismName: node.nodeKind,
        args: { valeur: node.explanation }
      }
    }
  );
}

// src/mecanisms/EstNonDéfini.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function MecanismEstNonD\u00E9fini(node) {
  return /* @__PURE__ */ jsx13(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: {
        mecanismName: node.nodeKind,
        args: { valeur: node.explanation }
      }
    }
  );
}

// src/mecanisms/Grille.tsx
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
function Grille({ nodeValue, explanation, unit }) {
  return /* @__PURE__ */ jsx14(StyledComponent, { children: /* @__PURE__ */ jsx14(Mecanism, { name: "grille", value: nodeValue, unit, children: /* @__PURE__ */ jsxs8("ul", { className: "properties", children: [
    /* @__PURE__ */ jsx14(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ jsx14(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    )
  ] }) }) });
}

// src/mecanisms/InversionNumérique.tsx
import { Fragment as Fragment7, jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
function InversionNum\u00E9rique({
  nodeValue,
  explanation
}) {
  const engine = useEngine();
  return /* @__PURE__ */ jsx15(Mecanism, { name: "inversion num\xE9rique", value: nodeValue, children: engine.cache.inversionFail && explanation.inversionGoal ? /* @__PURE__ */ jsxs9(Fragment7, { children: [
    /* @__PURE__ */ jsx15("p", { children: "Cette valeur devrait pouvoir \xEAtre estim\xE9e \xE0 partir d\u2019une autre variable qui poss\xE8de une formule de calcul et dont la valeur a \xE9t\xE9 fix\xE9e dans la simulation :" }),
    /* @__PURE__ */ jsx15(Explanation, { node: explanation.inversionGoal }),
    /* @__PURE__ */ jsx15("p", { children: "Malheureusement, il a \xE9t\xE9 impossible de retrouver une valeur pour cette formule qui permette d\u2019atterrir sur la valeur demand\xE9e." })
  ] }) : explanation.inversionGoal ? /* @__PURE__ */ jsxs9(Fragment7, { children: [
    /* @__PURE__ */ jsx15("p", { children: "Cette valeur a \xE9t\xE9 estim\xE9e \xE0 partir d\u2019une autre variable qui poss\xE8de une formule de calcul et dont la valeur a \xE9t\xE9 fix\xE9e dans la simulation :" }),
    /* @__PURE__ */ jsx15(Explanation, { node: explanation.inversionGoal })
  ] }) : /* @__PURE__ */ jsxs9(Fragment7, { children: [
    /* @__PURE__ */ jsx15("p", { children: "Cette formule de calcul n\u2019existe pas, mais on peut la calculer par inversion en utilisant les formules des r\xE8gles suivantes :" }),
    /* @__PURE__ */ jsx15("ul", { id: "inversionsPossibles", children: explanation.inversionCandidates.map((el) => /* @__PURE__ */ jsx15("li", { children: /* @__PURE__ */ jsx15(Explanation, { node: el }) }, el.dottedName)) })
  ] }) });
}

// src/mecanisms/Operation.tsx
import { styled as styled7 } from "styled-components";
import { Fragment as Fragment8, jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
function Operation({
  nodeValue,
  explanation,
  operator,
  unit
}) {
  const isUnaryOperation = explanation[0].nodeValue === 0 && operator === "\u2212" && explanation[0].nodeKind === "constant";
  return /* @__PURE__ */ jsxs10(StyledOperation, { className: "operation", role: "math", children: [
    /* @__PURE__ */ jsx16("span", { children: "(" }),
    !isUnaryOperation && /* @__PURE__ */ jsxs10(Fragment8, { children: [
      /* @__PURE__ */ jsx16(Explanation, { node: explanation[0] }),
      "\xA0"
    ] }),
    operator,
    "\xA0",
    /* @__PURE__ */ jsx16(Explanation, { node: explanation[1] }),
    nodeValue != void 0 && /* @__PURE__ */ jsxs10("span", { className: "result", children: [
      /* @__PURE__ */ jsx16("small", { children: " =\xA0" }),
      /* @__PURE__ */ jsx16(NodeValueLeaf, { data: nodeValue, unit })
    ] }),
    /* @__PURE__ */ jsx16("span", { children: ")" })
  ] });
}
var StyledOperation = styled7.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.125rem;
	> .operation ::before,
	> .operation ::after {
		content: '';
	}
	.result {
		margin-left: 0.2rem;
	}
	.operation .result {
		display: none;
	}
`;

// src/mecanisms/Replacement.tsx
import { useId, useState as useState3 } from "react";
import { Fragment as Fragment9, jsx as jsx17, jsxs as jsxs11 } from "react/jsx-runtime";
function Replacement(node) {
  const engine = useEngine();
  const sourceMaps = node.sourceMap;
  const originalNode = sourceMaps.args.originalNode;
  const applicableReplacement = sourceMaps.args.applicableReplacements.find(
    ({ definitionRule }) => engine.evaluate(definitionRule).nodeValue === node.nodeValue
  );
  if (!applicableReplacement || applicableReplacement.replaceByNonApplicable) {
    originalNode.nodeValue = node.nodeValue;
    return /* @__PURE__ */ jsx17(Explanation, { node: originalNode });
  }
  const [showOriginal, setShowOriginal] = useState3(false);
  const id = useId();
  return /* @__PURE__ */ jsx17(Fragment9, { children: /* @__PURE__ */ jsxs11(
    "span",
    {
      style: {
        display: "inline-flex",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ jsxs11(
          "span",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%"
            },
            children: [
              showOriginal && /* @__PURE__ */ jsx17(
                "span",
                {
                  id,
                  style: {
                    opacity: "0.6",
                    textDecoration: "line-through"
                  },
                  children: /* @__PURE__ */ jsx17(Explanation, { node: originalNode })
                }
              ),
              /* @__PURE__ */ jsx17(Explanation, { node: applicableReplacement.definitionRule })
            ]
          }
        ),
        /* @__PURE__ */ jsx17(
          "div",
          {
            style: {
              marginLeft: "0.4rem"
            },
            children: /* @__PURE__ */ jsx17(
              "button",
              {
                onClick: () => setShowOriginal(!showOriginal),
                type: "button",
                className: "publicodes_btn-small",
                "aria-expanded": showOriginal,
                "aria-controls": id,
                title: showOriginal ? "Cacher la valeur d\u2019origine" : "Voir la valeur d\u2019origine",
                children: "\u{1F504}"
              }
            )
          }
        )
      ]
    }
  ) });
}

// src/mecanisms/ReplacementRule.tsx
import { Fragment as Fragment10, jsx as jsx18, jsxs as jsxs12 } from "react/jsx-runtime";
function ReplacementMecanism(node) {
  return /* @__PURE__ */ jsxs12("span", { children: [
    "Remplace ",
    /* @__PURE__ */ jsx18(Explanation, { node: node.replacedReference }),
    " ",
    node.rawNode.dans && /* @__PURE__ */ jsxs12(Fragment10, { children: [
      "dans",
      " ",
      node.whiteListedNames.map((child, i) => /* @__PURE__ */ jsx18(Explanation, { node: child }, i)).join(", ")
    ] }),
    node.rawNode["sauf dans"] && /* @__PURE__ */ jsxs12(Fragment10, { children: [
      "sauf dans",
      " ",
      node.blackListedNames.map((child, i) => /* @__PURE__ */ jsx18(Explanation, { node: child }, i)).join(", ")
    ] })
  ] });
}

// src/mecanisms/Rule.tsx
import { styled as styled8 } from "styled-components";
import { jsx as jsx19 } from "react/jsx-runtime";
function RuleMecanism({
  explanation,
  dottedName
}) {
  return /* @__PURE__ */ jsx19(Styled, { children: /* @__PURE__ */ jsx19(DottedNameContext.Provider, { value: dottedName, children: /* @__PURE__ */ jsx19(StyledExplanation, { children: /* @__PURE__ */ jsx19(Explanation, { node: explanation.valeur }) }) }) });
}
var StyledExplanation = styled8.div`
	border-left: 1rem solid hsl(220, 60%, 97.5%);
	padding-left: 1rem;
	margin-left: -2rem;
`;
var Styled = styled8.div`
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
`;

// src/mecanisms/RésoudreRéférenceCirculaire.tsx
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
function MecanismR\u00E9soudreR\u00E9f\u00E9renceCirculaire({
  explanation
}) {
  return /* @__PURE__ */ jsxs13(
    Mecanism,
    {
      name: "r\xE9soudre la r\xE9f\xE9rence circulaire",
      value: explanation.valeur,
      children: [
        /* @__PURE__ */ jsxs13("p", { children: [
          " ",
          "Cette valeur a \xE9t\xE9 retrouv\xE9 en r\xE9solvant la r\xE9f\xE9rence circulaire dans la formule ci dessous :",
          " "
        ] }),
        /* @__PURE__ */ jsx20(Explanation, { node: explanation.valeur })
      ]
    }
  );
}

// src/mecanisms/Situation.tsx
import { useContext as useContext3 } from "react";
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
function MecanismSituation({ sourceMap }) {
  const engine = useContext3(EngineContext);
  const situationValeur = engine?.evaluate(
    sourceMap.args["dans la situation"]
  );
  return situationValeur?.nodeValue !== void 0 ? /* @__PURE__ */ jsx21(InfixMecanism, { prefixed: true, value: sourceMap.args["valeur"], children: /* @__PURE__ */ jsxs14("p", { children: [
    /* @__PURE__ */ jsx21("strong", { children: "Valeur renseign\xE9e dans la simulation : " }),
    /* @__PURE__ */ jsx21(Explanation, { node: situationValeur.explanation.valeur })
  ] }) }) : /* @__PURE__ */ jsx21(Explanation, { node: sourceMap.args["valeur"] });
}

// src/mecanisms/TauxProgressif.tsx
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
function TauxProgressif({
  nodeValue,
  explanation,
  unit
}) {
  return /* @__PURE__ */ jsx22(StyledComponent, { children: /* @__PURE__ */ jsx22(Mecanism, { name: "taux progressif", value: nodeValue, unit, children: /* @__PURE__ */ jsxs15("ul", { className: "properties", children: [
    /* @__PURE__ */ jsx22(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ jsx22(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    )
  ] }) }) });
}

// src/mecanisms/Texte.tsx
import { styled as styled9 } from "styled-components";
import { jsx as jsx23 } from "react/jsx-runtime";
function Texte({ explanation }) {
  return /* @__PURE__ */ jsx23("p", { children: explanation.map(
    (element) => typeof element === "string" ? element : /* @__PURE__ */ jsx23(Highlight, { children: /* @__PURE__ */ jsx23(Explanation, { node: element }) }, element.rawNode)
  ) });
}
var Highlight = styled9.span`
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 0.2rem;
	position: relative;
	border-radius: 0.15rem;
	background-color: rgba(0, 0, 0, 0.05);
`;

// src/mecanisms/UnePossibilité.tsx
import { jsx as jsx24 } from "react/jsx-runtime";
function UnePossibilit\u00E9Mecanism({
  explanation
}) {
  return /* @__PURE__ */ jsx24(Mecanism, { name: "une possibilit\xE9 parmi", value: void 0, children: /* @__PURE__ */ jsx24("ul", { children: explanation.map((node, i) => /* @__PURE__ */ jsx24("li", { children: /* @__PURE__ */ jsx24(Explanation, { node }) }, i)) }) });
}

// src/mecanisms/Unité.tsx
import { formatValue as formatValue3, serializeUnit } from "publicodes";
import { Fragment as Fragment11, jsx as jsx25, jsxs as jsxs16 } from "react/jsx-runtime";
function MecanismUnit\u00E9({
  nodeValue,
  explanation,
  unit
}) {
  if (explanation.nodeKind === "constant") {
    return formatValue3({ nodeValue, unit });
  } else if (explanation.nodeKind === "reference") {
    return /* @__PURE__ */ jsxs16(Fragment11, { children: [
      /* @__PURE__ */ jsx25(Explanation, { node: explanation }),
      "\xA0",
      serializeUnit(unit)
    ] });
  } else {
    return /* @__PURE__ */ jsx25(InfixMecanism, { value: explanation, children: /* @__PURE__ */ jsxs16("p", { children: [
      /* @__PURE__ */ jsx25("strong", { children: "Unit\xE9 : " }),
      serializeUnit(unit)
    ] }) });
  }
}

// src/mecanisms/Variations.tsx
import { useState as useState4 } from "react";
import { styled as styled10 } from "styled-components";
import { Fragment as Fragment12, jsx as jsx26, jsxs as jsxs17 } from "react/jsx-runtime";
function Variations({ nodeValue, explanation, unit }) {
  const activeCaseIndex = explanation.findIndex(
    ({ condition }) => condition.nodeValue === true
  );
  let activeCase;
  if (activeCaseIndex !== void 0) {
    activeCase = explanation[activeCaseIndex];
    explanation = [
      ...explanation.slice(0, activeCaseIndex),
      ...explanation.slice(activeCaseIndex + 1)
    ];
  }
  const [isExpanded, setIsExpanded] = useState4(!activeCase);
  return /* @__PURE__ */ jsx26(Mecanism, { name: "variations", unit, value: nodeValue, children: /* @__PURE__ */ jsxs17("ul", { children: [
    activeCase && /* @__PURE__ */ jsxs17("li", { children: [
      /* @__PURE__ */ jsx26(Case, { ...activeCase }),
      /* @__PURE__ */ jsx26("span", { style: { paddingLeft: "1rem" }, children: /* @__PURE__ */ jsxs17(
        "button",
        {
          className: "publicodes_btn-small",
          onClick: () => setIsExpanded(!isExpanded),
          children: [
            isExpanded ? "Masquer" : "Afficher",
            " les autres cas"
          ]
        }
      ) })
    ] }),
    isExpanded && /* @__PURE__ */ jsx26(Fragment12, { children: explanation.map((currentCase, i) => /* @__PURE__ */ jsx26("li", { children: /* @__PURE__ */ jsx26(Case, { ...currentCase }) }, i)) })
  ] }) });
}
function Case({ condition, consequence }) {
  return /* @__PURE__ */ jsx26(StyledCaseContainer, { children: /* @__PURE__ */ jsxs17(StyledCase, { children: [
    /* @__PURE__ */ jsx26(StyledCondition, { children: condition.nodeKind === "constant" && condition.nodeValue === true ? /* @__PURE__ */ jsx26(StyledText, { children: "Par d\xE9faut\xA0:\xA0" }) : /* @__PURE__ */ jsxs17(Fragment12, { children: [
      /* @__PURE__ */ jsx26(StyledText, { children: "Condition\xA0:\xA0" }),
      /* @__PURE__ */ jsx26(StyledExplanation2, { children: /* @__PURE__ */ jsx26(Explanation, { node: condition }) })
    ] }) }),
    /* @__PURE__ */ jsx26(StyledExplanation2, { children: /* @__PURE__ */ jsx26(Explanation, { node: consequence }) })
  ] }) });
}
var StyledExplanation2 = styled10.div``;
var StyledText = styled10.span`
	font-weight: bold;
`;
var StyledCondition = styled10.div`
	padding-bottom: 1rem;
	padding-top: 0.5rem;
	display: flex;
	align-items: baseline;
`;
var StyledCase = styled10.div`
	border-left: 1rem solid hsl(36, 60%, 97%);
	padding-left: 1rem;
	margin-left: -1rem;
`;
var StyledCaseContainer = styled10.div`
	padding: 1rem 0;
`;

// src/Explanation.tsx
import { jsx as jsx27 } from "react/jsx-runtime";
var UIComponents = {
  constant: Constant,
  arrondi: MecanismArrondi,
  bar\u00E8me: Bar\u00E8me,
  dur\u00E9e: MecanismDur\u00E9e,
  grille: Grille,
  inversion: InversionNum\u00E9rique,
  operation: Operation,
  texte: Texte,
  reference: Reference,
  "est non applicable": MecanismEstNonApplicable,
  "est non d\xE9fini": MecanismEstNonD\u00E9fini,
  rule: RuleMecanism,
  condition: MecanismCondition,
  "dans la situation": MecanismSituation,
  contexte: Contexte,
  replacement: Replacement,
  replacementRule: ReplacementMecanism,
  "taux progressif": TauxProgressif,
  "une possibilit\xE9": UnePossibilit\u00E9Mecanism,
  "r\xE9soudre r\xE9f\xE9rence circulaire": MecanismR\u00E9soudreR\u00E9f\u00E9renceCirculaire,
  unit\u00E9: MecanismUnit\u00E9,
  "variable manquante": (node) => /* @__PURE__ */ jsx27(Explanation, { node: node.explanation }),
  variations: Variations
};
function Explanation({ node }) {
  const visualisationKind = node.sourceMap?.mecanismName ?? node.nodeKind;
  const engine = useEngine();
  const evaluateEverything = transformAST((node2) => {
    if ("nodeValue" in node2 || "replacementRule" === node2.nodeKind) {
      return false;
    }
    return engine.evaluateNode(node2);
  }, false);
  const displayedNode = evaluateEverything(node);
  const Component = UIComponents[visualisationKind] ?? (node.sourceMap?.mecanismName ? DefaultInlineMecanism : void 0);
  if (!Component) {
    throw new Error(`Unknown visualisation: ${visualisationKind}`);
  }
  return /* @__PURE__ */ jsx27(Component, { ...displayedNode });
}

// src/rule/RulePage.tsx
import {
  formatValue as formatValue5,
  serializeUnit as serializeUnit2,
  utils as utils5
} from "publicodes";
import { useContext as useContext6, useEffect as useEffect2, useRef as useRef2 } from "react";
import { styled as styled13 } from "styled-components";

// src/rule/DeveloperAccordion.tsx
import { utils as utils2 } from "publicodes";
import { useContext as useContext4 } from "react";
import { styled as styled11 } from "styled-components";

// src/rule/RuleSource.tsx
import { formatValue as formatValue4, utils } from "publicodes";
import { jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
var { encodeRuleName } = utils;
function RuleSource({ engine, dottedName }) {
  const href = useRuleSource(engine, dottedName);
  if (typeof window !== "undefined" && window.location.host === "publi.codes") {
    return null;
  }
  const linkLabel = "Afficher la r\xE8gle dans le bac \xE0 sable Publicodes";
  return /* @__PURE__ */ jsx28("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxs18(
    "a",
    {
      target: "_blank",
      href,
      "aria-label": `${linkLabel}, nouvelle fen\xEAtre`,
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ jsx28("span", { "aria-hidden": true, children: "\u270D\uFE0F" }),
        " ",
        linkLabel
      ]
    }
  ) });
}
var useRuleSource = (engine, dottedName) => {
  const dependencies = Array.from(
    engine.context.referencesMaps.referencesIn.get(dottedName) ?? []
  );
  const node = engine.evaluateNode(engine.context.parsedRules[dottedName]);
  const rules = {
    [dottedName]: Object.fromEntries(
      Object.entries(node.rawNode).filter(([key]) => key !== "nom")
    )
  };
  const situation = Object.fromEntries(
    dependencies.filter((name) => name !== dottedName && !name.endsWith(" . $SITUATION")).map((dottedName2) => [dottedName2, formatValueForStudio(node)])
  );
  const source = encodeURIComponent(JSON.stringify({ rules, situation }));
  const baseURL = typeof window !== "undefined" && location.hostname === "localhost" ? "" : "https://publi.codes";
  return `${baseURL}/studio/${encodeRuleName(dottedName)}#${source}`;
};
function formatValueForStudio(node) {
  const base = formatValue4(node).replace(/\s\/\s/g, "/").replace(/(\d)\s(\d)/g, "$1$2").replace(",", ".");
  if (base.match(/^[0-9]/) || base === "Oui" || base === "Non") {
    return base.toLowerCase();
  } else if (base === "-") {
    return "non";
  } else {
    return `'${base}'`;
  }
}

// src/rule/DeveloperAccordion.tsx
import { Fragment as Fragment13, jsx as jsx29, jsxs as jsxs19 } from "react/jsx-runtime";
var Ul = styled11.ul`
	padding: 0;
	max-height: 400px;
	overflow: auto;
	list-style: none;
`;
var Li = styled11.li`
	position: relative;
	padding-left: 1.5rem;

	&::before {
		content: '●';
		font-size: 80%;
		display: inline-block;
		position: absolute;
		left: 0;
		width: 1.5rem;
		text-align: center;
		color: #b3b3b3;
		margin-bottom: 0.5rem;
	}
`;
function DeveloperAccordion({
  rule,
  engine,
  dottedName,
  situation = {},
  apiDocumentationUrl,
  apiEvaluateUrl,
  npmPackage
}) {
  const { Accordion } = useContext4(RenderersContext);
  const accordionItems = [
    {
      title: "R\xE8gle et situation",
      id: "rule-situation",
      children: /* @__PURE__ */ jsxs19(Fragment13, { children: [
        /* @__PURE__ */ jsx29(ActualRule, { engine, dottedName }),
        /* @__PURE__ */ jsx29(ActualSituation, { situation })
      ] })
    },
    apiDocumentationUrl && apiEvaluateUrl || npmPackage ? {
      title: "R\xE9utiliser ce calcul (" + [
        apiDocumentationUrl && apiEvaluateUrl ? "API REST" : null,
        npmPackage ? "Paquet NPM" : null
      ].filter((x) => x !== null).join(" / ") + ")",
      id: "usage",
      children: /* @__PURE__ */ jsxs19(Fragment13, { children: [
        utils2.isExperimental(
          engine.baseContext.parsedRules,
          dottedName
        ) && /* @__PURE__ */ jsxs19(StyledWarning, { children: [
          /* @__PURE__ */ jsx29("h4", { children: "\u26A0\uFE0F Cette r\xE8gle est taggu\xE9e comme experimentale \u26A0\uFE0F" }),
          /* @__PURE__ */ jsx29("p", { children: "Cela veut dire qu\u2019elle peut \xEAtre modifi\xE9e, renomm\xE9e, ou supprim\xE9e sans qu\u2019il n\u2019y ait de changement de version majeure dans l\u2019API." })
        ] }),
        npmPackage && /* @__PURE__ */ jsx29(
          PackageUsage,
          {
            rule,
            situation,
            dottedName,
            npmPackage
          }
        ),
        apiDocumentationUrl && apiEvaluateUrl && /* @__PURE__ */ jsx29(
          ApiUsage,
          {
            situation,
            dottedName,
            apiDocumentationUrl,
            apiEvaluateUrl
          }
        )
      ] })
    } : null,
    {
      title: "D\xE9pendances et effets de la r\xE8gle",
      id: "dependencies-effects",
      children: /* @__PURE__ */ jsxs19(Fragment13, { children: [
        /* @__PURE__ */ jsx29(MissingVars, { selfMissing: Object.keys(rule.missingVariables) }),
        /* @__PURE__ */ jsx29(
          ReverseMissing,
          {
            engine,
            dottedName,
            ruleIsNotDefined: rule.nodeValue === void 0
          }
        ),
        /* @__PURE__ */ jsx29(
          Effect,
          {
            engine,
            dottedName,
            replacements: rule.replacements
          }
        )
      ] })
    }
  ].filter((elem) => elem !== null);
  return /* @__PURE__ */ jsx29(Accordion, { items: accordionItems });
}
function ActualRule({
  engine,
  dottedName
}) {
  const { Code } = useContext4(RenderersContext);
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "R\xE8gle actuelle" }),
    /* @__PURE__ */ jsx29(Code, { tabs: { dottedName } }),
    /* @__PURE__ */ jsx29(RuleSource, { dottedName, engine })
  ] });
}
function ActualSituation({
  situation
}) {
  const { Code } = useContext4(RenderersContext);
  const keys = Object.keys(situation);
  const tabs = {
    json: JSON.stringify(situation, null, 2)
  };
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "Situation actuelle" }),
    keys.length ? /* @__PURE__ */ jsx29("p", { children: "Voici les donn\xE9es que vous avez saisies dans notre simulateur sous forme de JSON." }) : /* @__PURE__ */ jsx29("p", { children: "Votre situation est pour l\u2019instant vide, vous n\u2019avez probablement pas encore fait de simulation." }),
    /* @__PURE__ */ jsx29(Code, { tabs })
  ] });
}
var LINK_NPM_LABEL = "Retrouvez ce paquet sur NPM";
var LINK_PUBLICODES_LABEL = "moteur Publicodes";
function PackageUsage({
  rule,
  situation,
  dottedName,
  npmPackage
}) {
  const { Code, Link } = useContext4(RenderersContext);
  const tabs = {
    npmPackage: `// npm i publicodes ${npmPackage}

import Engine, { formatValue } from 'publicodes'
import rules from '${npmPackage}'

const engine = new Engine(rules)
engine.setSituation(${JSON.stringify(situation, null, 2)})

// ${rule.title}
const evaluation = engine.evaluate(${JSON.stringify(dottedName)})

console.log(formatValue(evaluation))
`
  };
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "Lancer un calcul avec Publicodes" }),
    /* @__PURE__ */ jsxs19("p", { children: [
      "Vous pouvez installer notre package de r\xE8gles pour l\u2019utiliser avec le",
      " ",
      /* @__PURE__ */ jsx29(
        Link,
        {
          "aria-label": `${LINK_PUBLICODES_LABEL}, acc\xE9der au site publi.codes, nouvelle fen\xEAtre`,
          href: "https://publi.codes/",
          children: LINK_PUBLICODES_LABEL
        }
      ),
      " ",
      "et ainsi effectuer vos propres calculs. Voici un exemple avec votre situation et la r\xE8gle actuelle :"
    ] }),
    /* @__PURE__ */ jsx29(Code, { tabs }),
    /* @__PURE__ */ jsx29("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxs19(
      Link,
      {
        href: "https://www.npmjs.com/package/" + npmPackage,
        "aria-label": `${LINK_NPM_LABEL}, acc\xE9der \xE0 la page npm du package Publicodes, nouvelle fen\xEAtre`,
        children: [
          /* @__PURE__ */ jsx29("span", { "aria-hidden": true, children: "\u{1F4E6}" }),
          " ",
          LINK_NPM_LABEL
        ]
      }
    ) })
  ] });
}
var LINK_API_LABEL = "En savoir plus sur notre API REST";
function ApiUsage({
  situation,
  dottedName,
  apiDocumentationUrl,
  apiEvaluateUrl
}) {
  const { Code, Link } = useContext4(RenderersContext);
  const data = {
    expressions: [dottedName],
    situation
  };
  const tabs = {
    curl: `curl '${apiEvaluateUrl}' \\
  -H 'accept: application/json' \\
  -H 'content-type: application/json' \\
  --data-raw $'${JSON.stringify(data).replace(/'/g, "'\\''")}' \\
  --compressed`,
    "fetch js": `const request = await fetch("${apiEvaluateUrl}", {
  "headers": { "content-type": "application/json" },
  "method": "POST",
  "body": JSON.stringify(${JSON.stringify(data, null, 2)}),
})
const { evaluate } = await request.json()

console.log(evaluate)`
  };
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "Utiliser notre API REST" }),
    /* @__PURE__ */ jsx29("p", { children: "Vous trouverez ici un exemple d\u2019utilisation de notre API REST via curl ou un fetch javascript." }),
    /* @__PURE__ */ jsx29(Code, { tabs }),
    apiDocumentationUrl && /* @__PURE__ */ jsx29("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxs19(
      Link,
      {
        to: apiDocumentationUrl,
        "aria-label": `${LINK_API_LABEL}, acc\xE9der \xE0 la documentation, nouvelle fen\xEAtre`,
        children: [
          /* @__PURE__ */ jsx29("span", { "aria-hidden": true, children: "\u{1F469}\u200D\u{1F4BB}" }),
          " ",
          LINK_API_LABEL
        ]
      }
    ) })
  ] });
}
function MissingVars({ selfMissing }) {
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "Donn\xE9es manquantes" }),
    selfMissing?.length ? /* @__PURE__ */ jsxs19(Fragment13, { children: [
      /* @__PURE__ */ jsx29("p", { children: "Les r\xE8gles suivantes sont n\xE9cessaires pour le calcul mais n\u2019ont pas \xE9t\xE9 saisies dans la situation. Leur valeur par d\xE9faut est utilis\xE9e." }),
      /* @__PURE__ */ jsx29(Ul, { children: selfMissing.map((dottedName) => /* @__PURE__ */ jsx29(Li, { children: /* @__PURE__ */ jsx29(RuleLinkWithContext, { dottedName }) }, dottedName)) })
    ] }) : /* @__PURE__ */ jsx29("p", { children: "Il n\u2019y a pas de donn\xE9es manquante." })
  ] });
}
var isReplacementOfThisRule = (node, dottedName) => node && "replacements" in node && node.replacements.some(
  ({ replacedReference }) => replacedReference.dottedName === dottedName
);
function ReverseMissing({
  engine,
  dottedName,
  ruleIsNotDefined = false
}) {
  const ruleNamesWithMissing = Array.from(
    engine.context.referencesMaps.rulesThatUse.get(dottedName) ?? []
  ).filter(
    (ruleName) => ruleName !== "$EVALUATION" && ruleName in engine.context.parsedRules && !engine.context.parsedRules[ruleName].private && !isReplacementOfThisRule(
      engine.context.parsedRules[ruleName],
      dottedName
    )
  );
  return /* @__PURE__ */ jsxs19("section", { children: [
    /* @__PURE__ */ jsx29("h4", { children: "R\xE8gles qui ont besoin de cette valeur" }),
    ruleNamesWithMissing.length ? /* @__PURE__ */ jsxs19(Fragment13, { children: [
      /* @__PURE__ */ jsxs19("p", { children: [
        "Les r\xE8gles suivantes ont besoin de la r\xE8gle courante pour \xEAtre calcul\xE9es :",
        ruleIsNotDefined && /* @__PURE__ */ jsxs19(Fragment13, { children: [
          " ",
          "La r\xE8gle courante n\u2019\xE9tant pas encore d\xE9finie, c\u2019est sa valeur par d\xE9faut qui est utilis\xE9e pour d\xE9terminer la valeur de ces r\xE8gles."
        ] })
      ] }),
      /* @__PURE__ */ jsx29(Ul, { children: ruleNamesWithMissing.map((dottedName2) => /* @__PURE__ */ jsx29(Li, { children: /* @__PURE__ */ jsx29(RuleLinkWithContext, { dottedName: dottedName2 }) }, dottedName2)) })
    ] }) : /* @__PURE__ */ jsx29("p", { children: "Aucune r\xE8gle n\u2019utilise cette valeur." })
  ] });
}
function Effect({
  engine,
  dottedName,
  replacements
}) {
  const effects = Array.from(
    engine.context.referencesMaps.rulesThatUse.get(dottedName) ?? []
  ).filter(
    (ruleName) => ruleName !== "$EVALUATION" && ruleName in engine.context.parsedRules && !engine.context.parsedRules[ruleName].private && isReplacementOfThisRule(engine.context.parsedRules[ruleName], dottedName)
  );
  return /* @__PURE__ */ jsxs19(Fragment13, { children: [
    /* @__PURE__ */ jsxs19("section", { children: [
      /* @__PURE__ */ jsx29("h4", { children: "Effets sur d\u2019autres r\xE8gles" }),
      replacements.length ? /* @__PURE__ */ jsxs19(Fragment13, { children: [
        /* @__PURE__ */ jsx29("p", { children: "Une r\xE8gle peut avoir des effets sur d\u2019autres r\xE8gles afin de modifier leur comportement." }),
        /* @__PURE__ */ jsx29(Ul, { children: replacements.map((replacement) => /* @__PURE__ */ jsx29(
          Li,
          {
            style: { marginBottom: "0.5rem" },
            children: /* @__PURE__ */ jsx29(Explanation, { node: replacement })
          },
          replacement.replacedReference.dottedName
        )) })
      ] }) : /* @__PURE__ */ jsx29("p", { children: "Cette r\xE8gle ne modifie aucune autre r\xE8gle." })
    ] }),
    /* @__PURE__ */ jsxs19("section", { children: [
      /* @__PURE__ */ jsx29("h4", { children: "R\xE8gles qui peuvent avoir un effet sur cette valeur" }),
      effects.length ? /* @__PURE__ */ jsxs19(Fragment13, { children: [
        /* @__PURE__ */ jsx29("p", { children: "Les r\xE8gles suivantes peuvent remplacer la valeur de la r\xE8gle courante :" }),
        /* @__PURE__ */ jsx29(Ul, { children: effects.map((dottedName2) => /* @__PURE__ */ jsx29(Li, { children: /* @__PURE__ */ jsx29(RuleLinkWithContext, { dottedName: dottedName2 }) }, dottedName2)) })
      ] }) : /* @__PURE__ */ jsx29("p", { children: "Aucune autre r\xE8gle n\u2019a d\u2019effets sur cette valeur." })
    ] })
  ] });
}
var StyledWarning = styled11.div``;

// src/rule/Header.tsx
import { utils as utils3 } from "publicodes";

// src/rule/Meta.tsx
import { useContext as useContext5 } from "react";
import { jsx as jsx30, jsxs as jsxs20 } from "react/jsx-runtime";
function Meta({ title, description }) {
  const { Head } = useContext5(RenderersContext);
  if (!Head) {
    return null;
  }
  return /* @__PURE__ */ jsxs20(Head, { children: [
    /* @__PURE__ */ jsx30("title", { children: title }),
    /* @__PURE__ */ jsx30("meta", { property: "og:type", content: "article" }),
    /* @__PURE__ */ jsx30("meta", { property: "og:title", content: title }),
    description && /* @__PURE__ */ jsx30("meta", { property: "og:description", content: description }),
    description && /* @__PURE__ */ jsx30("meta", { name: "description", content: description })
  ] });
}

// src/rule/Header.tsx
import { jsx as jsx31, jsxs as jsxs21 } from "react/jsx-runtime";
function RuleHeader({ dottedName }) {
  const engine = useEngine();
  const {
    title,
    rawNode: { description, question, ic\u00F4nes }
  } = engine.context.parsedRules[dottedName];
  const displayTitle = ic\u00F4nes ? title + " " + ic\u00F4nes : title;
  return /* @__PURE__ */ jsxs21("header", { children: [
    /* @__PURE__ */ jsx31(Meta, { title: displayTitle, description: description || question }),
    /* @__PURE__ */ jsxs21("div", { children: [
      /* @__PURE__ */ jsx31("span", { id: "rules-nav-open-nav-button" }),
      utils3.ruleParents(dottedName).reverse().map((parentDottedName) => /* @__PURE__ */ jsxs21("span", { children: [
        /* @__PURE__ */ jsx31(RuleLinkWithContext, { dottedName: parentDottedName, displayIcon: true }),
        /* @__PURE__ */ jsx31("span", { "aria-hidden": true, children: " \u203A " })
      ] }, parentDottedName))
    ] }),
    /* @__PURE__ */ jsx31("h1", { children: /* @__PURE__ */ jsx31(RuleLinkWithContext, { dottedName, displayIcon: true }) })
  ] });
}

// src/rule/RulesNav.tsx
import { utils as utils4 } from "publicodes";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState as useState5
} from "react";
import ReactDOM from "react-dom";
import { styled as styled12 } from "styled-components";
import { jsx as jsx32, jsxs as jsxs22 } from "react/jsx-runtime";
var RulesSearch = lazy(() => import("./RulesSearch-IUQDMTNF.js"));
var RulesNav = ({
  dottedName,
  searchBar,
  mobileMenuPortalId,
  openNavButtonPortalId
}) => {
  const baseEngine = useEngine();
  const parsedRules = baseEngine.getParsedRules();
  const parsedRulesNames = Object.keys(parsedRules);
  const [navOpen, setNavOpen] = useState5(false);
  const initLevel = (dn) => Object.fromEntries([
    [dn, true],
    ...utils4.ruleParents(dn).map((parent) => [parent, true])
  ]);
  const [level, setLevel] = useState5(initLevel(dottedName));
  useEffect(() => {
    setLevel((prev) => ({ ...prev, ...initLevel(dottedName) }));
  }, [dottedName]);
  const toggleDropdown = useCallback((ruleDottedName) => {
    setLevel(
      (prevLevel) => !prevLevel[ruleDottedName] ? {
        ...prevLevel,
        [ruleDottedName]: !prevLevel[ruleDottedName]
      } : Object.fromEntries(
        Object.entries(prevLevel).map(
          ([dot, val]) => dot.startsWith(ruleDottedName) ? [dot, false] : [dot, val]
        )
      )
    );
  }, []);
  const openNavButtonPortalElement = typeof window === "undefined" ? null : openNavButtonPortalId && window.document.getElementById(openNavButtonPortalId) || window.document.getElementById("rules-nav-open-nav-button");
  const navRef = useRef(null);
  const menu = /* @__PURE__ */ jsxs22(Container, { $open: navOpen, children: [
    /* @__PURE__ */ jsx32(
      Background,
      {
        $open: navOpen,
        onClick: () => {
          setNavOpen((open) => !open);
        }
      }
    ),
    openNavButtonPortalElement && ReactDOM.createPortal(
      /* @__PURE__ */ jsx32(OpenNavButton, { onClick: () => setNavOpen(true), children: "Toutes les r\xE8gles" }),
      openNavButtonPortalElement
    ),
    /* @__PURE__ */ jsxs22(Nav, { $open: navOpen, ref: navRef, children: [
      searchBar ? /* @__PURE__ */ jsx32(Suspense, { fallback: /* @__PURE__ */ jsx32("p", { children: "Chargement..." }), children: /* @__PURE__ */ jsx32(RulesSearch, {}) }) : null,
      /* @__PURE__ */ jsx32("ul", { children: parsedRulesNames.sort((a, b) => a.localeCompare(b)).map((ruleDottedName) => {
        const parentDottedName = utils4.ruleParent(ruleDottedName);
        if (ruleDottedName.split(" . ").length > 1 && !level[parentDottedName]) {
          return null;
        }
        const open = ruleDottedName in level && level[ruleDottedName];
        return /* @__PURE__ */ jsx32(
          MemoNavLi,
          {
            ruleDottedName,
            open,
            active: dottedName === ruleDottedName,
            onClickDropdown: toggleDropdown,
            navRef
          },
          ruleDottedName
        );
      }) })
    ] })
  ] });
  const isMobileMenu = typeof window !== "undefined" && window.matchMedia(`(max-width: ${breakpointsWidth.lg})`).matches;
  const mobileMenuPortalElement = typeof window !== "undefined" && mobileMenuPortalId ? window.document.getElementById(mobileMenuPortalId) : null;
  return isMobileMenu && mobileMenuPortalElement ? ReactDOM.createPortal(menu, mobileMenuPortalElement) : menu;
};
var NavLi = ({
  ruleDottedName,
  open,
  active,
  onClickDropdown,
  navRef
}) => {
  const baseEngine = useEngine();
  const parsedRules = baseEngine.getParsedRules();
  const childrenCount = Object.keys(parsedRules).reduce(
    (acc, ruleDot) => ruleDot.startsWith(ruleDottedName + " . ") && ruleDot.split(" . ").length === ruleDottedName.split(" . ").length + 1 ? acc + 1 : acc,
    0
  );
  const activeLi = useRef(null);
  useEffect(() => {
    if (navRef.current && activeLi.current?.offsetTop) {
      navRef.current.scrollTop = activeLi.current?.offsetTop;
    }
  }, [active]);
  return /* @__PURE__ */ jsx32(
    "li",
    {
      ref: active ? activeLi : void 0,
      style: {
        paddingLeft: (ruleDottedName.split(" . ").length - 1) * 16
      },
      className: (childrenCount > 0 ? "dropdown " : "") + (active ? "active " : ""),
      children: /* @__PURE__ */ jsxs22("span", { className: "content", children: [
        childrenCount > 0 && /* @__PURE__ */ jsx32(
          DropdownButton,
          {
            "aria-label": open ? "Replier le sous-menu" : "D\xE9plier le sous-menu",
            "aria-expanded": open,
            onClick: () => onClickDropdown(ruleDottedName),
            children: /* @__PURE__ */ jsx32(StyledArrow, { $open: open })
          }
        ),
        /* @__PURE__ */ jsx32(RuleLinkWithContext, { dottedName: ruleDottedName, displayIcon: true })
      ] })
    },
    ruleDottedName
  );
};
var MemoNavLi = memo(NavLi);
var breakpointsWidth = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};
var Container = styled12.div`
	z-index: 200;
	overflow: auto;
	position: sticky;
	top: 0;

	@media (min-width: ${breakpointsWidth.lg}) {
		max-width: 50%;
		flex-shrink: 0;
	}
`;
var Background = styled12.div`
	background: rgb(0 0 0 / 25%);
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 200;
	transition: ease-in-out 0.25s;
	transition-property: visibility, opacity;
	visibility: ${({ $open }) => $open ? "visible" : "hidden"};
	opacity: ${({ $open }) => $open ? "1" : "0"};

	@media (min-width: ${breakpointsWidth.lg}) {
		display: none;
	}
`;
var OpenNavButton = styled12.button`
	margin: 0.25rem 0;
	margin-right: 0.5rem;
	background: none;
	border: 1px solid rgb(29, 66, 140);
	border-radius: 3px;
	color: rgb(29, 66, 140);
	padding: 0.5rem;
	display: inline-block;

	&:hover {
		background-color: rgb(219, 231, 255);
	}
	@media (min-width: ${breakpointsWidth.lg}) {
		display: none;
	}
`;
var Nav = styled12.nav`
	@media (min-width: ${breakpointsWidth.lg}) {
		flex-shrink: 0;
	}
	border-right: 1px solid #e6e6e6;
	overflow: auto;
	max-height: calc(100vh - 2rem);
	position: sticky;
	top: 0;
	@media (max-width: ${breakpointsWidth.lg}) {
		position: fixed;
		top: 0;
		left: 0;
		padding-top: 1rem;
		bottom: 0;
		z-index: 200;
		max-height: initial;
		background: white;
		max-width: 80vw;
		height: 100%;

		transition: all ease-in-out 0.25s;
		${({ $open }) => $open ? "" : "transform: translateX(-100%);"}
	}

	ul {
		flex-wrap: nowrap;
		margin: 0;

		padding: 0;
		list-style: none;
		li {
			margin-bottom: 3px;
			max-width: 350px;
			.content {
				border-radius: 3px;
				padding: 3px 1rem;
				display: flex;
				width: fit-content;
				align-items: center;
				flex-direction: row;
				flex-wrap: nowrap;
			}

			&.active .content {
				background-color: #e6e6e6;
			}
			&:not(.active) a {
				font-weight: normal;
			}
			&:not(.dropdown) .content:before {
				content: ' ';
				display: inline-block;
				background-color: #b3b3b3;
				min-width: 0.5rem;
				min-height: 0.5rem;
				border-radius: 0.5rem;
				margin-left: 0.5rem;
				margin-right: 1.25rem;
				pointer-events: none;
			}
		}
	}
`;
var DropdownButton = styled12.button`
	margin-right: 0.75rem;
	flex-shrink: 0;
	background: none;
	border: 1px solid #b3b3b3;
	border-radius: 2rem;
	width: 1.5rem;
	height: 1.5rem;
	color: #999;
	padding: 0;
	display: inline-block;
`;
var StyledArrow = styled12(Arrow)`
	width: 100%;
	transition: transform 0.1s;
	height: 100%;
	transform: rotate(${({ $open }) => $open ? "0deg" : "-90deg"});
`;

// src/rule/RulePage.tsx
import { Fragment as Fragment14, jsx as jsx33, jsxs as jsxs23 } from "react/jsx-runtime";
function RulePage({
  documentationPath,
  rulePath,
  engine,
  renderers,
  searchBar,
  language,
  apiDocumentationUrl,
  apiEvaluateUrl,
  npmPackage,
  mobileMenuPortalId,
  openNavButtonPortalId,
  showDevSection = true
}) {
  const currentEngineId = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("currentEngineId");
  const prevRenderers = useRef2(renderers);
  useEffect2(() => {
    if (prevRenderers.current !== renderers) {
      prevRenderers.current = renderers;
    }
  }, [renderers]);
  return /* @__PURE__ */ jsx33(EngineContext.Provider, { value: engine, children: /* @__PURE__ */ jsx33(BasepathContext.Provider, { value: documentationPath, children: /* @__PURE__ */ jsx33(RenderersContext.Provider, { value: defaultRenderers(renderers), children: /* @__PURE__ */ jsx33(
    Rule,
    {
      dottedName: utils5.decodeRuleName(rulePath),
      subEngineId: currentEngineId ? parseInt(currentEngineId) : void 0,
      language,
      apiDocumentationUrl,
      apiEvaluateUrl,
      npmPackage,
      mobileMenuPortalId,
      openNavButtonPortalId,
      showDevSection,
      searchBar
    }
  ) }) }) });
}
function Rule({
  dottedName,
  language,
  subEngineId,
  searchBar = false,
  apiDocumentationUrl,
  apiEvaluateUrl,
  npmPackage,
  mobileMenuPortalId,
  openNavButtonPortalId,
  showDevSection
}) {
  const baseEngine = useEngine();
  const { References, Text } = useContext6(RenderersContext);
  const useSubEngine = subEngineId && baseEngine.subEngines[subEngineId];
  const engine = useSubEngine ? baseEngine.subEngines[subEngineId] : baseEngine;
  if (!(dottedName in engine.context.parsedRules)) {
    return /* @__PURE__ */ jsx33("p", { children: "Cette r\xE8gle est introuvable dans la base" });
  }
  engine.resetCache();
  engine.cache.traversedVariablesStack = [];
  const rule = engine.evaluateNode(
    engine.context.parsedRules[dottedName]
  );
  const { description, question } = rule.rawNode;
  const { valeur, nullableParent, ruleDisabledByItsParent } = rule.explanation;
  const situation = buildSituationUsedInRule(engine, rule);
  const references = References?.({
    references: rule.rawNode.r\u00E9f\u00E9rences,
    dottedName: rule.dottedName
  });
  return /* @__PURE__ */ jsx33(EngineContext.Provider, { value: engine, children: /* @__PURE__ */ jsxs23(Container2, { id: "documentation-rule-root", children: [
    /* @__PURE__ */ jsx33(
      RulesNav,
      {
        dottedName,
        mobileMenuPortalId,
        openNavButtonPortalId,
        searchBar
      }
    ),
    /* @__PURE__ */ jsx33(Article, { children: /* @__PURE__ */ jsxs23(DottedNameContext.Provider, { value: dottedName, children: [
      /* @__PURE__ */ jsx33(RuleHeader, { dottedName }),
      /* @__PURE__ */ jsx33("section", { children: /* @__PURE__ */ jsx33(Text, { children: description || question || "" }) }),
      /* @__PURE__ */ jsxs23("p", { style: { fontSize: "1.25rem", lineHeight: "2rem" }, children: [
        "Valeur : ",
        formatValue5(rule, { language }),
        rule.nodeValue === void 0 && rule.unit && /* @__PURE__ */ jsxs23(Fragment14, { children: [
          /* @__PURE__ */ jsx33("br", {}),
          "Unit\xE9 : ",
          serializeUnit2(rule.unit)
        ] })
      ] }),
      ruleDisabledByItsParent && nullableParent && /* @__PURE__ */ jsx33(Fragment14, { children: /* @__PURE__ */ jsxs23("blockquote", { children: [
        "Cette r\xE8gle est ",
        /* @__PURE__ */ jsx33("strong", { children: "non applicable" }),
        " car elle appartient \xE0 l\u2019espace de nom :",
        " ",
        /* @__PURE__ */ jsx33(Explanation, { node: nullableParent })
      ] }) }),
      useSubEngine && /* @__PURE__ */ jsxs23(
        "div",
        {
          style: {
            margin: "1rem 0",
            padding: "0rem 1rem",
            display: "flex",
            justifyContent: "flex-end",
            columnGap: "1rem",
            alignItems: "baseline",
            flexWrap: "wrap",
            background: "hsl(220, 60%, 97.5%)",
            borderRadius: "0.25rem"
          },
          children: [
            /* @__PURE__ */ jsxs23("p", { children: [
              "Vous naviguez la documentation avec un",
              " ",
              /* @__PURE__ */ jsx33("strong", { children: "contexte" }),
              " d\u2019\xE9valuation",
              " ",
              /* @__PURE__ */ jsx33("strong", { children: "sp\xE9cifique" }),
              "."
            ] }),
            /* @__PURE__ */ jsx33("div", { style: { flex: 1 } }),
            /* @__PURE__ */ jsx33(
              "p",
              {
                style: {
                  textAlign: "right",
                  marginTop: 0
                },
                children: /* @__PURE__ */ jsx33(
                  RuleLinkWithContext,
                  {
                    dottedName,
                    useSubEngine: false,
                    children: "Retourner \xE0 la version de base"
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx33("h2", { children: "Comment cette donn\xE9e est-elle calcul\xE9e ?" }),
      /* @__PURE__ */ jsx33("div", { id: "documentation-rule-explanation", children: /* @__PURE__ */ jsx33(Explanation, { node: valeur }) }),
      rule.rawNode.note && /* @__PURE__ */ jsxs23(Fragment14, { children: [
        /* @__PURE__ */ jsx33("h3", { children: "Note" }),
        /* @__PURE__ */ jsx33("div", { children: /* @__PURE__ */ jsx33(Text, { children: rule.rawNode.note }) })
      ] }),
      references && /* @__PURE__ */ jsxs23(Fragment14, { children: [
        /* @__PURE__ */ jsx33("h3", { children: "R\xE9f\xE9rences" }),
        references
      ] }),
      /* @__PURE__ */ jsx33("br", {}),
      showDevSection && /* @__PURE__ */ jsxs23(Fragment14, { children: [
        /* @__PURE__ */ jsx33("h3", { children: "Informations techniques" }),
        /* @__PURE__ */ jsx33(Text, { children: "Si vous \xEAtes d\xE9veloppeur/euse vous trouverez ci-dessous des informations techniques utiles pour l\u2019int\xE9gration de cette r\xE8gle dans votre application." }),
        /* @__PURE__ */ jsx33(
          DeveloperAccordion,
          {
            engine,
            situation,
            dottedName,
            rule,
            apiDocumentationUrl,
            apiEvaluateUrl,
            npmPackage
          }
        )
      ] })
    ] }) })
  ] }) });
}
var Container2 = styled13.div`
	display: flex;
	flex-wrap: nowrap;
	align-items: flex-start;
	@media (max-width: ${breakpointsWidth.lg}) {
		flex-direction: column;
	}
`;
var Article = styled13.article`
	flex-shrink: 1;
	max-width: 100%;
	@media (min-width: ${breakpointsWidth.lg}) {
		min-width: 0;
		padding-left: 1rem;
		border-left: 1px solid #e6e6e6;
		margin-left: -1px;
	}
`;
function buildSituationUsedInRule(engine, rule) {
  const situation = [...rule.traversedVariables, rule.dottedName].map((name) => {
    const valeur = engine.context.parsedRules[`${name} . $SITUATION`]?.rawNode.valeur;
    return [name, valeur];
  }).filter(
    ([, valeur]) => valeur && !(valeur.nodeKind === "constant" && valeur.nodeValue === void 0)
  ).reduce(
    (acc, [name, valeur]) => ({
      [name]: typeof valeur === "object" && valeur && "rawNode" in valeur ? valeur.rawNode : valeur,
      ...acc
    }),
    {}
  );
  return situation;
}

// src/index.ts
function getDocumentationSiteMap({ engine, documentationPath }) {
  const parsedRules = engine.context.parsedRules;
  return Object.fromEntries(
    Object.keys(parsedRules).filter(
      (dottedName) => !dottedName.match(/(\$SITUATION|\$EVALUATION|\$INTERNAL)/)
    ).map((dottedName) => [
      documentationPath + "/" + utils6.encodeRuleName(dottedName),
      dottedName
    ])
  );
}
export {
  Explanation,
  RuleLink,
  RulePage,
  getDocumentationSiteMap
};
//# sourceMappingURL=index.js.map