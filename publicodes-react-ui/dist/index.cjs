var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/component/icons/index.tsx
var import_jsx_runtime, Arrow;
var init_icons = __esm({
  "src/component/icons/index.tsx"() {
    import_jsx_runtime = require("react/jsx-runtime");
    Arrow = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        height: "24px",
        viewBox: "0 0 24 24",
        width: "24px",
        fill: "#000000",
        className,
        role: "img",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 0h24v24H0V0z", fill: "none" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" })
        ]
      }
    );
  }
});

// src/component/Accordion.tsx
var import_react, import_styled_components, import_jsx_runtime2, AccordionContainer, H4, AccordionWrapper, Child, StyledArrow, Accordion;
var init_Accordion = __esm({
  "src/component/Accordion.tsx"() {
    import_react = require("react");
    import_styled_components = require("styled-components");
    init_icons();
    import_jsx_runtime2 = require("react/jsx-runtime");
    AccordionContainer = import_styled_components.styled.div`
	overflow: hidden;
	border-radius: 6px;
	border: 1px solid #bbb;
`;
    H4 = import_styled_components.styled.h4`
	font-size: 16px;
	font-weight: 700;
	margin: 2rem 0px 1rem;
	font-size: 1.25rem;
	line-height: 1.75rem;

	button {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-content: center;
		align-items: center;
		justify-content: space-between;
		text-align: left;
		width: 100%;
		height: 50px;
		border: none;
		padding: 1.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: bold;

		&:hover {
			text-decoration: underline;
		}
	}
`;
    AccordionWrapper = import_styled_components.styled.div`
	border: 0 solid #bbb;
	${({ i }) => i > 0 && import_styled_components.css`
			border-top-width: 1px;
		`}

	& ${H4} {
		margin: 0;
	}
`;
    Child = import_styled_components.styled.div`
	display: ${({ open }) => open ? "block" : "none"};
	margin: 1.5rem;
`;
    StyledArrow = (0, import_styled_components.styled)(Arrow)`
	display: inline-block;
	width: 25px;
	transition: transform 0.1s;
	height: 25px;
	transform: rotate(${({ $isOpen }) => $isOpen ? `180deg` : `360deg`});
`;
    Accordion = ({ items }) => {
      const [open, setOpen] = (0, import_react.useState)([]);
      const toggleAccordion = (i) => () => setOpen((arr) => {
        arr[i] = !arr[i];
        return [...arr];
      });
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AccordionContainer, { children: items.map(({ id, title, children }, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(AccordionWrapper, { id, i, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(H4, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { onClick: toggleAccordion(i), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StyledArrow, { $isOpen: open[i] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Child, { open: !!open[i], children }) })
      ] }, id)) });
    };
  }
});

// src/component/Code.tsx
var import_react2, import_styled_components2, import_jsx_runtime3, PreWrapper, Bar, Pre, Code;
var init_Code = __esm({
  "src/component/Code.tsx"() {
    import_react2 = require("react");
    import_styled_components2 = require("styled-components");
    import_jsx_runtime3 = require("react/jsx-runtime");
    PreWrapper = import_styled_components2.styled.div`
	position: relative;
	:hover button,
	:focus-within button {
		opacity: 1;
	}
`;
    Bar = import_styled_components2.styled.div`
	position: absolute;
	right: 0;
	top: 0;
	margin: 0.5rem;
	line-height: 0;

	& button {
		margin: 0;
		padding: 1px 3px;
		transition: opacity ease-in-out 0.1s;
		opacity: 0.25;

		:hover {
			cursor: pointer;
		}
		:not(:last-child) {
			margin-right: 0.5rem;
		}
	}
`;
    Pre = import_styled_components2.styled.pre`
	overflow: auto;
	padding: 0.5rem;
	background-color: #e6e9ec;
	border-radius: 0.25rem;
`;
    Code = ({ tabs }) => {
      const [tab, setTab] = (0, import_react2.useState)();
      const tabKeys = Object.keys(tabs);
      const activeTab = tab ?? tabKeys[0];
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(PreWrapper, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Bar, { children: [
          typeof navigator !== "undefined" && navigator.clipboard && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              onClick: () => navigator.clipboard.writeText(tabs[activeTab]),
              children: "copier"
            }
          ),
          tabKeys.length > 1 && tabKeys.filter((name) => name !== activeTab).map((name) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => setTab(name), children: name }, name))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pre, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: tabs[activeTab] }) })
      ] });
    };
  }
});

// src/component/index.ts
var init_component = __esm({
  "src/component/index.ts"() {
    init_Accordion();
    init_Code();
    init_icons();
  }
});

// src/rule/References.tsx
function References({ references }) {
  if (!references) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { children: Object.entries(references).map(([name, link]) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "li",
    {
      style: {
        display: "flex",
        alignItems: "center"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "a",
          {
            href: link,
            target: "_blank",
            style: {
              marginRight: "1rem"
            },
            rel: "noreferrer",
            children: (0, import_publicodes.capitalise0)(name)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "ui__ label", children: link })
      ]
    },
    name
  )) });
}
var import_publicodes, import_jsx_runtime4;
var init_References = __esm({
  "src/rule/References.tsx"() {
    import_publicodes = require("publicodes");
    import_jsx_runtime4 = require("react/jsx-runtime");
  }
});

// src/contexts.tsx
var import_react3, import_jsx_runtime5, DefaultTextRenderer, DefaultLinkRenderer, defaultRenderers, RenderersContext, BasepathContext, DottedNameContext, EngineContext;
var init_contexts = __esm({
  "src/contexts.tsx"() {
    import_react3 = require("react");
    init_component();
    init_References();
    import_jsx_runtime5 = require("react/jsx-runtime");
    DefaultTextRenderer = ({
      children
    }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children });
    DefaultLinkRenderer = (props) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { ...props });
    defaultRenderers = (renderers = {}) => {
      const base = {
        References,
        Text: DefaultTextRenderer,
        Code,
        Accordion,
        Link: DefaultLinkRenderer
      };
      return Object.fromEntries(
        [...Object.keys(base), ...Object.keys(renderers)].map((key) => [key, renderers[key] ?? base[key]]).filter(([, val]) => val)
      );
    };
    RenderersContext = (0, import_react3.createContext)(defaultRenderers());
    BasepathContext = (0, import_react3.createContext)("/documentation");
    DottedNameContext = (0, import_react3.createContext)(void 0);
    EngineContext = (0, import_react3.createContext)(
      void 0
    );
  }
});

// src/hooks.ts
var import_react4, useEngine;
var init_hooks = __esm({
  "src/hooks.ts"() {
    import_react4 = require("react");
    init_contexts();
    useEngine = () => {
      const engine = (0, import_react4.useContext)(EngineContext);
      if (!engine) {
        throw new Error("Engine expected");
      }
      return engine;
    };
  }
});

// src/RuleLink.tsx
function RuleLink({
  dottedName,
  engine,
  currentEngineId,
  documentationPath,
  displayIcon = false,
  linkComponent,
  children,
  ...propsRest
}) {
  const renderers = (0, import_react5.useContext)(RenderersContext);
  const dottedNameContext = import_publicodes4.utils.findCommonAncestor(
    (0, import_react5.useContext)(DottedNameContext) ?? dottedName,
    dottedName
  );
  const Link = linkComponent || renderers.Link;
  if (!Link) {
    throw new Error("You must provide a <Link /> component.");
  }
  const rule = engine.context.parsedRules[dottedName];
  const newPath = documentationPath + "/" + encodeRuleName(dottedName);
  const contextTitle = [
    ...import_publicodes4.utils.ruleParents(dottedName).reverse().filter((name) => name.startsWith(`${dottedNameContext} . `)).map((name) => engine.context.parsedRules[name]?.title.trim()),
    rule.title?.trim()
  ].join(" \u203A ");
  if (!rule) {
    throw new Error(`Unknown rule: ${dottedName}`);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    Link,
    {
      ...propsRest,
      "aria-label": propsRest["aria-label"] ?? (rule.title && rule.title + ", voir les d\xE9tails du calcul pour : " + rule.title),
      to: newPath + (currentEngineId ? `?currentEngineId=${currentEngineId}` : ""),
      children: [
        children || contextTitle || rule.dottedName.split(" . ").slice(-1)[0],
        " ",
        displayIcon && rule.rawNode.ic\u00F4nes && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { children: rule.rawNode.ic\u00F4nes })
      ]
    }
  );
}
function RuleLinkWithContext(props) {
  const engine = useEngine();
  const documentationPath = (0, import_react5.useContext)(BasepathContext);
  const currentEngineIdFromUrl = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("currentEngineId");
  const currentEngineId = props.useSubEngine !== false ? props.currentEngineId || engine.subEngineId || (currentEngineIdFromUrl ? Number(currentEngineIdFromUrl) : void 0) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    RuleLink,
    {
      engine,
      currentEngineId,
      documentationPath,
      ...props
    }
  );
}
var import_publicodes4, import_react5, import_jsx_runtime11, encodeRuleName;
var init_RuleLink = __esm({
  "src/RuleLink.tsx"() {
    import_publicodes4 = require("publicodes");
    import_react5 = require("react");
    init_contexts();
    init_hooks();
    import_jsx_runtime11 = require("react/jsx-runtime");
    ({ encodeRuleName } = import_publicodes4.utils);
  }
});

// src/rule/RulesSearch.tsx
var RulesSearch_exports = {};
__export(RulesSearch_exports, {
  default: () => RulesSearch
});
function RulesSearch() {
  const engine = useEngine();
  const dottedName = (0, import_react14.useContext)(DottedNameContext);
  const rules = Object.entries(engine.getParsedRules()).map(
    ([name, rule]) => {
      return { name, title: rule?.rawNode?.titre };
    }
  );
  const [searchResults, setSearchResults] = (0, import_react14.useState)([]);
  const [searchQuery, setSearchQuery] = (0, import_react14.useState)("");
  const fuse = new import_fuse.default(rules, { keys: ["title", "name"] });
  (0, import_react14.useEffect)(() => {
    setSearchQuery("");
  }, [dottedName]);
  (0, import_react14.useEffect)(() => {
    const results = fuse.search(searchQuery, { limit: 10 });
    setSearchResults(results.map((result) => result.item));
  }, [searchQuery]);
  const isEmpty = searchResults.length === 0;
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(SearchContainer, { id: "documentation-search", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
      SearchInput,
      {
        id: "documentation-search-input",
        type: "text",
        placeholder: "Chercher une r\xE8gle",
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        onFocus: (e) => setSearchQuery(e.target.value),
        empty: isEmpty
      }
    ),
    !isEmpty ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(SearchResults, { id: "documentation-search-results", children: searchResults.map(({ name, title }, i) => {
      return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
        SearchItem,
        {
          id: "documentation-search-item",
          isLast: i === searchResults.length - 1,
          onClick: () => setSearchQuery(""),
          children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(RuleLinkWithContext, { dottedName: name, children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(ItemContent, { onClick: () => setSearchQuery(""), children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(ItemName, { id: "documentation-search-item-name", children: name }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(ItemTitle, { id: "documentation-search-item-title", children: title })
          ] }) })
        },
        name
      );
    }) }) : null
  ] });
}
var import_react14, import_styled_components14, import_fuse, import_jsx_runtime38, SearchContainer, SearchInput, SearchResults, SearchItem, ItemContent, ItemName, ItemTitle;
var init_RulesSearch = __esm({
  "src/rule/RulesSearch.tsx"() {
    import_react14 = require("react");
    init_hooks();
    import_styled_components14 = require("styled-components");
    import_fuse = __toESM(require("fuse.js"), 1);
    init_RuleLink();
    init_contexts();
    import_jsx_runtime38 = require("react/jsx-runtime");
    SearchContainer = import_styled_components14.styled.div`
	margin-bottom: 1rem;
	margin-right: 1rem;
	max-width: 350px;
`;
    SearchInput = import_styled_components14.styled.input`
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: ${({ empty }) => empty ? "5px" : "5px 5px 0 0"};

	&:focus {
		outline: none;
		border: 1px solid #666;
	}
`;
    SearchResults = import_styled_components14.styled.div`
	background-color: white;
	border: 1px solid #ccc;
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
	position: relative;
`;
    SearchItem = import_styled_components14.styled.div`
	padding: 0.5rem;
	border-bottom: ${({ isLast }) => isLast ? "none" : "1px solid #e6e6e6"};
	border-left: 2px solid transparent;
	border-radius: ${({ isLast }) => isLast ? "0 0 0.25rem 0.25rem" : "0"};

	&:hover {
		background-color: #f6f6f6;
	}
`;
    ItemContent = import_styled_components14.styled.span`
	display: flex;
	flex-wrap: wrap;
	flex-gap: 0.5rem;
	align-items: center;
`;
    ItemName = import_styled_components14.styled.span`
	width: 100%;
`;
    ItemTitle = import_styled_components14.styled.span`
	color: #666;
`;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Explanation: () => Explanation,
  RuleLink: () => RuleLink,
  RulePage: () => RulePage,
  getDocumentationSiteMap: () => getDocumentationSiteMap
});
module.exports = __toCommonJS(src_exports);
var import_publicodes13 = require("publicodes");

// src/Explanation.tsx
var import_publicodes7 = require("publicodes");
init_hooks();

// src/mecanisms/common/InfixMecanism.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var InfixMecanism = ({
  value,
  prefixed,
  children
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
    prefixed && children,
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "value",
        style: {
          position: "relative",
          margin: "1rem 0"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Explanation, { node: value })
      }
    ),
    !prefixed && children
  ] });
};

// src/mecanisms/Arrondi.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function MecanismArrondi(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(InfixMecanism, { value: node.explanation.valeur, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: "Arrondi : " }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Explanation, { node: node.explanation.arrondi })
  ] }) });
}

// src/mecanisms/Barème.tsx
var import_publicodes3 = require("publicodes");
var import_styled_components5 = require("styled-components");

// src/mecanisms/common/Mecanism.tsx
var import_styled_components4 = require("styled-components");

// src/mecanisms/common/NodeValueLeaf.tsx
var import_publicodes2 = require("publicodes");
var import_styled_components3 = require("styled-components");
var import_jsx_runtime8 = require("react/jsx-runtime");
var NodeValueLeaf = ({ data, unit }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    StyledNodeValuePointer,
    {
      className: "node-value-pointer",
      title: data === null ? "Non applicable" : "",
      "aria-label": data === null ? "Valeur non applicable" : "",
      children: data === null ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { "aria-hidden": true, children: "-" }) : (0, import_publicodes2.formatValue)({ nodeValue: data, unit })
    }
  );
};
var StyledNodeValuePointer = import_styled_components3.styled.span`
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
var import_jsx_runtime9 = require("react/jsx-runtime");
function Mecanism({
  name,
  value,
  children,
  unit,
  displayName = true
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(StyledMecanism, { mecanismName: name, children: [
    displayName && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MecanismName, { name, children: name }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      children,
      value !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(StyledMecanismValue, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: " =\xA0" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(NodeValueLeaf, { data: value, unit })
      ] })
    ] })
  ] });
}
var StyledMecanism = import_styled_components4.styled.div`
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_jsx_runtime9.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var StyledMecanismName = import_styled_components4.styled.a`
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
	${(props) => props.inline ? import_styled_components4.css`
				border-radius: 0.3rem;
				margin-bottom: 0.5rem;
			` : import_styled_components4.css`
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
var StyledMecanismValue = import_styled_components4.styled.div`
	text-align: right;
	margin-top: 1rem;
	font-weight: bold;
`;

// src/mecanisms/Barème.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function Bar\u00E8me({ nodeValue, explanation, unit }) {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Mecanism, { name: "bar\xE8me", value: nodeValue, unit, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(StyledComponent, { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("ul", { className: "properties", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    ),
    nodeValue != void 0 && explanation.tranches.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("b", { children: "Taux moyen : " }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        NodeValueLeaf,
        {
          data: 100 * nodeValue / (explanation.assiette.nodeValue ?? 1),
          unit: (0, import_publicodes3.parseUnit)("%")
        }
      )
    ] })
  ] }) }) });
}
var Bar\u00E8meAttributes = ({
  explanation
}) => {
  const multiplicateur = explanation.multiplicateur;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "key", children: "Assiette : " }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "value", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: explanation.assiette }) })
    ] }, "assiette"),
    multiplicateur && !multiplicateur.isDefault && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "key", children: "Multiplicateur : " }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "value", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: multiplicateur }) })
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
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("table", { className: "tranches", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("tr", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("th", { children: "Plafonds des tranches" }),
      "taux" in tranches[0] && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("th", { children: "Taux" }),
      ("montant" in tranches[0] || activeTranche?.nodeValue != void 0) && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("th", { children: "Montant" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("tbody", { children: tranches.map((tranche, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tranche, { tranche, multiplicateur }, i)) })
  ] });
};
var Tranche = ({ tranche, multiplicateur }) => {
  const isHighlighted = tranche.isActive;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("tr", { className: `tranche ${isHighlighted ? "activated" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("td", { children: tranche.plafond.nodeValue === Infinity ? "Au-del\xE0 du dernier plafond" : /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
      "Inf\xE9rieur \xE0 ",
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: tranche.plafond }),
      multiplicateur && !multiplicateur.isDefault && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
        " \xD7 ",
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: multiplicateur })
      ] })
    ] }) }, "tranche"),
    "taux" in tranche && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: tranche.taux }) }, "taux"),
    (tranche.nodeValue != void 0 || "montant" in tranche) && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("td", { children: "montant" in tranche ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Explanation, { node: tranche.montant }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(NodeValueLeaf, { data: tranche.nodeValue, unit: tranche.unit }) }, "value")
  ] });
};
var StyledComponent = import_styled_components5.styled.div`
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
var import_react7 = require("react");
var import_styled_components7 = require("styled-components");
init_contexts();

// src/mecanisms/Reference.tsx
var import_react6 = require("react");
var import_styled_components6 = require("styled-components");
init_RuleLink();
init_contexts();
var import_jsx_runtime12 = require("react/jsx-runtime");
function Reference(node) {
  const engine = (0, import_react6.useContext)(EngineContext);
  const { dottedName, nodeValue, unit } = node;
  const rule = engine?.context.parsedRules[node.dottedName];
  if (!rule) {
    throw new Error(`Unknown rule: ${dottedName}`);
  }
  const [folded, setFolded] = (0, import_react6.useState)(true);
  const isFoldEnabled = (0, import_react6.useContext)(UnfoldIsEnabledContext);
  if (node.dottedName === node.contextDottedName + " . " + node.name && !node.name.includes(" . ") && rule.virtualRule) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Explanation, { node: engine?.evaluate(rule) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        flex: isFoldEnabled ? 1 : "initial",
        flexDirection: "column",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: { paddingRight: "0.2rem" }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(RuleLinkWithContext, { dottedName }) }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                "div",
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "baseline"
                  },
                  children: [
                    isFoldEnabled && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                        UnfoldButton,
                        {
                          onClick: () => setFolded(!folded),
                          "aria-expanded": !folded,
                          className: "publicodes_btn-small",
                          "aria-label": folded ? "D\xE9plier, afficher le d\xE9tail" : "Replier, afficher le d\xE9tail",
                          children: folded ? "D\xE9plier" : "Replier"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(StyledGuide, {})
                    ] }),
                    nodeValue !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(NodeValueLeaf, { data: nodeValue, unit })
                  ]
                }
              )
            ]
          }
        ),
        " ",
        !folded && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(UnfoldIsEnabledContext.Provider, { value: false, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Explanation, { node: engine?.evaluate(rule) }) }) })
      ]
    }
  );
}
var UnfoldIsEnabledContext = (0, import_react6.createContext)(false);
var UnfoldButton = import_styled_components6.styled.button`
	text-transform: none !important;
`;
var StyledGuide = import_styled_components6.styled.div`
	@media (max-width: 500px) {
		/* border: none; */
	}
	margin: 0.5rem;
	flex: 1;
	border-bottom: 2px dotted lightgray;
`;

// src/mecanisms/common/DefaultInlineMecanism.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function DefaultInlineMecanism({
  sourceMap,
  nodeValue,
  unit
}) {
  const { args, mecanismName } = sourceMap;
  const isChainableMecanism = "valeur" in args && mecanismName in args && Object.keys(args).length === 2;
  const isUnaryMecanism = "valeur" in args && Object.keys(args).length === 1;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
    isChainableMecanism && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ListOrScalarExplanation, { node: args.valeur }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "div",
      {
        style: {
          marginTop: isChainableMecanism ? "1rem" : 0
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Mecanism, { name: mecanismName, value: nodeValue, unit, children: isChainableMecanism ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ListOrScalarExplanation,
          {
            node: args[mecanismName],
            mecanismName
          }
        ) : isUnaryMecanism ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ListOrScalarExplanation,
          {
            node: args.valeur,
            mecanismName
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("ul", { children: Object.entries(args).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "li",
          {
            style: {
              display: "flex",
              alignItems: "baseline",
              padding: "0.25rem 0"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { children: [
                key,
                "\xA0:\xA0"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ListOrScalarExplanation, { node: value }) })
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
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      Table,
      {
        explanation: node,
        hideNotApplicable: mecanismName !== "produit",
        sign
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Explanation, { node });
}
var isZeroOrNotApplicable = (x) => {
  const nodeValue = (0, import_react7.useContext)(EngineContext)?.evaluate(x).nodeValue;
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
  const [showNotApplicable, setShowNotApplicable] = (0, import_react7.useState)(
    applicableExplanation.length === 0
  );
  const id = (0, import_react7.useMemo)(
    () => "notApplicableExplanation" + Math.random().toString(36).substring(7),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(StyledListContainer, { $sign: sign, children: applicableExplanation.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Row, { node }, i)) }),
    notApplicableExplanation.length > 0 && applicableExplanation.length !== 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      StyledButtonContainer,
      {
        style: {
          textAlign: "right"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
    showNotApplicable && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      StyledListContainer,
      {
        id,
        $sign: sign,
        $showFirst: applicableExplanation.length > 0,
        children: notApplicableExplanation.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Row, { node }, i))
      }
    )
  ] });
}
var StyledButtonContainer = import_styled_components7.styled.div`
	margin: 0.5rem 0;
	margin-left: 1rem;
`;
var StyledListContainer = import_styled_components7.styled.ul`
	margin: 0;
	margin-left: 1rem;

	${({ $sign, $showFirst }) => $sign && !$showFirst && import_styled_components7.css`
			& > li:first-child::marker {
				content: '';
			}
		`}
	${({ $sign }) => $sign && import_styled_components7.css`
			& > li::marker {
				font-weight: bold;
				content: '${$sign}  ';
			}
		`}
`;
function Row({ node }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(StyledRow, { style: { padding: "0.25rem 0" }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(UnfoldIsEnabledContext.Provider, { value: true, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Explanation, { node }) }) });
}
var StyledRow = import_styled_components7.styled.li`
	> * {
		width: 100%;
	}
`;

// src/mecanisms/Condition.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function MecanismCondition(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: { mecanismName: node.nodeKind, args: node.explanation }
    }
  );
}

// src/mecanisms/Constant.tsx
var import_publicodes5 = require("publicodes");
var import_jsx_runtime15 = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "value", children: (0, import_publicodes5.formatValue)({ nodeValue }) });
  } else if (fullPrecision) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: type, children: (0, import_publicodes5.formatValue)(
      { nodeValue, unit },
      {
        precision: 5
      }
    ) });
  } else {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "value", children: (0, import_publicodes5.formatValue)({ nodeValue, unit }) });
  }
}

// src/mecanisms/Contexte.tsx
var import_react8 = require("react");
var import_styled_components8 = require("styled-components");
init_RuleLink();
init_contexts();
init_hooks();
var import_jsx_runtime16 = require("react/jsx-runtime");
function Contexte({ explanation }) {
  const engine = useEngine();
  const contexteEngine = explanation.subEngineId ? engine.subEngines[explanation.subEngineId] ?? engine : engine;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Mecanism, { name: "contexte", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { children: "Ce calcul est effectu\xE9 en changeant les valeurs des r\xE8gles suivantes :" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(StyledDL, { children: explanation.contexte.map(([origin, newValue]) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_react8.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("dt", { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(RuleLinkWithContext, { dottedName: origin.dottedName }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("dd", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { "aria-hidden": true, children: " = " }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Explanation, { node: newValue })
        ] })
      ] }, origin.dottedName)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(EngineContext.Provider, { value: contexteEngine, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Explanation, { node: explanation.valeur }) })
  ] });
}
var StyledDL = import_styled_components8.styled.dl`
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
var import_jsx_runtime17 = require("react/jsx-runtime");
function MecanismDur\u00E9e(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    DefaultInlineMecanism,
    {
      ...node,
      sourceMap: { mecanismName: node.nodeKind, args: node.explanation }
    }
  );
}

// src/mecanisms/EstNonApplicable.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
function MecanismEstNonApplicable(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
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
var import_jsx_runtime19 = require("react/jsx-runtime");
function MecanismEstNonD\u00E9fini(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
var import_jsx_runtime20 = require("react/jsx-runtime");
function Grille({ nodeValue, explanation, unit }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(StyledComponent, { children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Mecanism, { name: "grille", value: nodeValue, unit, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("ul", { className: "properties", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    )
  ] }) }) });
}

// src/mecanisms/InversionNumérique.tsx
init_hooks();
var import_jsx_runtime21 = require("react/jsx-runtime");
function InversionNum\u00E9rique({
  nodeValue,
  explanation
}) {
  const engine = useEngine();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Mecanism, { name: "inversion num\xE9rique", value: nodeValue, children: engine.cache.inversionFail && explanation.inversionGoal ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "Cette valeur devrait pouvoir \xEAtre estim\xE9e \xE0 partir d\u2019une autre variable qui poss\xE8de une formule de calcul et dont la valeur a \xE9t\xE9 fix\xE9e dans la simulation :" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Explanation, { node: explanation.inversionGoal }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "Malheureusement, il a \xE9t\xE9 impossible de retrouver une valeur pour cette formule qui permette d\u2019atterrir sur la valeur demand\xE9e." })
  ] }) : explanation.inversionGoal ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "Cette valeur a \xE9t\xE9 estim\xE9e \xE0 partir d\u2019une autre variable qui poss\xE8de une formule de calcul et dont la valeur a \xE9t\xE9 fix\xE9e dans la simulation :" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Explanation, { node: explanation.inversionGoal })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "Cette formule de calcul n\u2019existe pas, mais on peut la calculer par inversion en utilisant les formules des r\xE8gles suivantes :" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("ul", { id: "inversionsPossibles", children: explanation.inversionCandidates.map((el) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Explanation, { node: el }) }, el.dottedName)) })
  ] }) });
}

// src/mecanisms/Operation.tsx
var import_styled_components9 = require("styled-components");
var import_jsx_runtime22 = require("react/jsx-runtime");
function Operation({
  nodeValue,
  explanation,
  operator,
  unit
}) {
  const isUnaryOperation = explanation[0].nodeValue === 0 && operator === "\u2212" && explanation[0].nodeKind === "constant";
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(StyledOperation, { className: "operation", role: "math", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: "(" }),
    !isUnaryOperation && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Explanation, { node: explanation[0] }),
      "\xA0"
    ] }),
    operator,
    "\xA0",
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Explanation, { node: explanation[1] }),
    nodeValue != void 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { className: "result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("small", { children: " =\xA0" }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(NodeValueLeaf, { data: nodeValue, unit })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: ")" })
  ] });
}
var StyledOperation = import_styled_components9.styled.div`
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
var import_react9 = require("react");
init_hooks();
var import_jsx_runtime23 = require("react/jsx-runtime");
function Replacement(node) {
  const engine = useEngine();
  const sourceMaps = node.sourceMap;
  const originalNode = sourceMaps.args.originalNode;
  const applicableReplacement = sourceMaps.args.applicableReplacements.find(
    ({ definitionRule }) => engine.evaluate(definitionRule).nodeValue === node.nodeValue
  );
  if (!applicableReplacement || applicableReplacement.replaceByNonApplicable) {
    originalNode.nodeValue = node.nodeValue;
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Explanation, { node: originalNode });
  }
  const [showOriginal, setShowOriginal] = (0, import_react9.useState)(false);
  const id = (0, import_react9.useId)();
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_jsx_runtime23.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
    "span",
    {
      style: {
        display: "inline-flex",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
          "span",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%"
            },
            children: [
              showOriginal && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                "span",
                {
                  id,
                  style: {
                    opacity: "0.6",
                    textDecoration: "line-through"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Explanation, { node: originalNode })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Explanation, { node: applicableReplacement.definitionRule })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
          "div",
          {
            style: {
              marginLeft: "0.4rem"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
var import_jsx_runtime24 = require("react/jsx-runtime");
function ReplacementMecanism(node) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { children: [
    "Remplace ",
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Explanation, { node: node.replacedReference }),
    " ",
    node.rawNode.dans && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
      "dans",
      " ",
      node.whiteListedNames.map((child, i) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Explanation, { node: child }, i)).join(", ")
    ] }),
    node.rawNode["sauf dans"] && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
      "sauf dans",
      " ",
      node.blackListedNames.map((child, i) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Explanation, { node: child }, i)).join(", ")
    ] })
  ] });
}

// src/mecanisms/Rule.tsx
var import_styled_components10 = require("styled-components");
init_contexts();
var import_jsx_runtime25 = require("react/jsx-runtime");
function RuleMecanism({
  explanation,
  dottedName
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Styled, { children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DottedNameContext.Provider, { value: dottedName, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(StyledExplanation, { children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Explanation, { node: explanation.valeur }) }) }) });
}
var StyledExplanation = import_styled_components10.styled.div`
	border-left: 1rem solid hsl(220, 60%, 97.5%);
	padding-left: 1rem;
	margin-left: -2rem;
`;
var Styled = import_styled_components10.styled.div`
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
`;

// src/mecanisms/RésoudreRéférenceCirculaire.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
function MecanismR\u00E9soudreR\u00E9f\u00E9renceCirculaire({
  explanation
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
    Mecanism,
    {
      name: "r\xE9soudre la r\xE9f\xE9rence circulaire",
      value: explanation.valeur,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("p", { children: [
          " ",
          "Cette valeur a \xE9t\xE9 retrouv\xE9 en r\xE9solvant la r\xE9f\xE9rence circulaire dans la formule ci dessous :",
          " "
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Explanation, { node: explanation.valeur })
      ]
    }
  );
}

// src/mecanisms/Situation.tsx
var import_react10 = require("react");
init_contexts();
var import_jsx_runtime27 = require("react/jsx-runtime");
function MecanismSituation({ sourceMap }) {
  const engine = (0, import_react10.useContext)(EngineContext);
  const situationValeur = engine?.evaluate(
    sourceMap.args["dans la situation"]
  );
  return situationValeur?.nodeValue !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(InfixMecanism, { prefixed: true, value: sourceMap.args["valeur"], children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("p", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Valeur renseign\xE9e dans la simulation : " }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Explanation, { node: situationValeur.explanation.valeur })
  ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Explanation, { node: sourceMap.args["valeur"] });
}

// src/mecanisms/TauxProgressif.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
function TauxProgressif({
  nodeValue,
  explanation,
  unit
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(StyledComponent, { children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Mecanism, { name: "taux progressif", value: nodeValue, unit, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ul", { className: "properties", children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Bar\u00E8meAttributes, { explanation }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      TrancheTable,
      {
        tranches: explanation.tranches,
        multiplicateur: explanation.multiplicateur
      }
    )
  ] }) }) });
}

// src/mecanisms/Texte.tsx
var import_styled_components11 = require("styled-components");
var import_jsx_runtime29 = require("react/jsx-runtime");
function Texte({ explanation }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: explanation.map(
    (element) => typeof element === "string" ? element : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Highlight, { children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Explanation, { node: element }) }, element.rawNode)
  ) });
}
var Highlight = import_styled_components11.styled.span`
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 0.2rem;
	position: relative;
	border-radius: 0.15rem;
	background-color: rgba(0, 0, 0, 0.05);
`;

// src/mecanisms/UnePossibilité.tsx
var import_jsx_runtime30 = require("react/jsx-runtime");
function UnePossibilit\u00E9Mecanism({
  explanation
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Mecanism, { name: "une possibilit\xE9 parmi", value: void 0, children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("ul", { children: explanation.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Explanation, { node }) }, i)) }) });
}

// src/mecanisms/Unité.tsx
var import_publicodes6 = require("publicodes");
var import_jsx_runtime31 = require("react/jsx-runtime");
function MecanismUnit\u00E9({
  nodeValue,
  explanation,
  unit
}) {
  if (explanation.nodeKind === "constant") {
    return (0, import_publicodes6.formatValue)({ nodeValue, unit });
  } else if (explanation.nodeKind === "reference") {
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(import_jsx_runtime31.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(Explanation, { node: explanation }),
      "\xA0",
      (0, import_publicodes6.serializeUnit)(unit)
    ] });
  } else {
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(InfixMecanism, { value: explanation, children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("p", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("strong", { children: "Unit\xE9 : " }),
      (0, import_publicodes6.serializeUnit)(unit)
    ] }) });
  }
}

// src/mecanisms/Variations.tsx
var import_react11 = require("react");
var import_styled_components12 = require("styled-components");
var import_jsx_runtime32 = require("react/jsx-runtime");
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
  const [isExpanded, setIsExpanded] = (0, import_react11.useState)(!activeCase);
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Mecanism, { name: "variations", unit, value: nodeValue, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("ul", { children: [
    activeCase && /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Case, { ...activeCase }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { style: { paddingLeft: "1rem" }, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
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
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_jsx_runtime32.Fragment, { children: explanation.map((currentCase, i) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Case, { ...currentCase }) }, i)) })
  ] }) });
}
function Case({ condition, consequence }) {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledCaseContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(StyledCase, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledCondition, { children: condition.nodeKind === "constant" && condition.nodeValue === true ? /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledText, { children: "Par d\xE9faut\xA0:\xA0" }) : /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledText, { children: "Condition\xA0:\xA0" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledExplanation2, { children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Explanation, { node: condition }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(StyledExplanation2, { children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Explanation, { node: consequence }) })
  ] }) });
}
var StyledExplanation2 = import_styled_components12.styled.div``;
var StyledText = import_styled_components12.styled.span`
	font-weight: bold;
`;
var StyledCondition = import_styled_components12.styled.div`
	padding-bottom: 1rem;
	padding-top: 0.5rem;
	display: flex;
	align-items: baseline;
`;
var StyledCase = import_styled_components12.styled.div`
	border-left: 1rem solid hsl(36, 60%, 97%);
	padding-left: 1rem;
	margin-left: -1rem;
`;
var StyledCaseContainer = import_styled_components12.styled.div`
	padding: 1rem 0;
`;

// src/Explanation.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
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
  "variable manquante": (node) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Explanation, { node: node.explanation }),
  variations: Variations
};
function Explanation({ node }) {
  const visualisationKind = node.sourceMap?.mecanismName ?? node.nodeKind;
  const engine = useEngine();
  const evaluateEverything = (0, import_publicodes7.transformAST)((node2) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Component, { ...displayedNode });
}

// src/index.ts
init_RuleLink();

// src/rule/RulePage.tsx
var import_publicodes12 = require("publicodes");
var import_react16 = require("react");
var import_styled_components16 = require("styled-components");
init_contexts();
init_hooks();
init_RuleLink();

// src/rule/DeveloperAccordion.tsx
var import_publicodes9 = require("publicodes");
var import_react12 = require("react");
var import_styled_components13 = require("styled-components");
init_RuleLink();
init_contexts();

// src/rule/RuleSource.tsx
var import_publicodes8 = require("publicodes");
var import_jsx_runtime34 = require("react/jsx-runtime");
var { encodeRuleName: encodeRuleName2 } = import_publicodes8.utils;
function RuleSource({ engine, dottedName }) {
  const href = useRuleSource(engine, dottedName);
  if (typeof window !== "undefined" && window.location.host === "publi.codes") {
    return null;
  }
  const linkLabel = "Afficher la r\xE8gle dans le bac \xE0 sable Publicodes";
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
    "a",
    {
      target: "_blank",
      href,
      "aria-label": `${linkLabel}, nouvelle fen\xEAtre`,
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { "aria-hidden": true, children: "\u270D\uFE0F" }),
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
  return `${baseURL}/studio/${encodeRuleName2(dottedName)}#${source}`;
};
function formatValueForStudio(node) {
  const base = (0, import_publicodes8.formatValue)(node).replace(/\s\/\s/g, "/").replace(/(\d)\s(\d)/g, "$1$2").replace(",", ".");
  if (base.match(/^[0-9]/) || base === "Oui" || base === "Non") {
    return base.toLowerCase();
  } else if (base === "-") {
    return "non";
  } else {
    return `'${base}'`;
  }
}

// src/rule/DeveloperAccordion.tsx
var import_jsx_runtime35 = require("react/jsx-runtime");
var Ul = import_styled_components13.styled.ul`
	padding: 0;
	max-height: 400px;
	overflow: auto;
	list-style: none;
`;
var Li = import_styled_components13.styled.li`
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
  const { Accordion: Accordion2 } = (0, import_react12.useContext)(RenderersContext);
  const accordionItems = [
    {
      title: "R\xE8gle et situation",
      id: "rule-situation",
      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ActualRule, { engine, dottedName }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ActualSituation, { situation })
      ] })
    },
    apiDocumentationUrl && apiEvaluateUrl || npmPackage ? {
      title: "R\xE9utiliser ce calcul (" + [
        apiDocumentationUrl && apiEvaluateUrl ? "API REST" : null,
        npmPackage ? "Paquet NPM" : null
      ].filter((x) => x !== null).join(" / ") + ")",
      id: "usage",
      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
        import_publicodes9.utils.isExperimental(
          engine.baseContext.parsedRules,
          dottedName
        ) && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(StyledWarning, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "\u26A0\uFE0F Cette r\xE8gle est taggu\xE9e comme experimentale \u26A0\uFE0F" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Cela veut dire qu\u2019elle peut \xEAtre modifi\xE9e, renomm\xE9e, ou supprim\xE9e sans qu\u2019il n\u2019y ait de changement de version majeure dans l\u2019API." })
        ] }),
        npmPackage && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          PackageUsage,
          {
            rule,
            situation,
            dottedName,
            npmPackage
          }
        ),
        apiDocumentationUrl && apiEvaluateUrl && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(MissingVars, { selfMissing: Object.keys(rule.missingVariables) }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          ReverseMissing,
          {
            engine,
            dottedName,
            ruleIsNotDefined: rule.nodeValue === void 0
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Accordion2, { items: accordionItems });
}
function ActualRule({
  engine,
  dottedName
}) {
  const { Code: Code2 } = (0, import_react12.useContext)(RenderersContext);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "R\xE8gle actuelle" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Code2, { tabs: { dottedName } }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(RuleSource, { dottedName, engine })
  ] });
}
function ActualSituation({
  situation
}) {
  const { Code: Code2 } = (0, import_react12.useContext)(RenderersContext);
  const keys = Object.keys(situation);
  const tabs = {
    json: JSON.stringify(situation, null, 2)
  };
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "Situation actuelle" }),
    keys.length ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Voici les donn\xE9es que vous avez saisies dans notre simulateur sous forme de JSON." }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Votre situation est pour l\u2019instant vide, vous n\u2019avez probablement pas encore fait de simulation." }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Code2, { tabs })
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
  const { Code: Code2, Link } = (0, import_react12.useContext)(RenderersContext);
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "Lancer un calcul avec Publicodes" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { children: [
      "Vous pouvez installer notre package de r\xE8gles pour l\u2019utiliser avec le",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Code2, { tabs }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
      Link,
      {
        href: "https://www.npmjs.com/package/" + npmPackage,
        "aria-label": `${LINK_NPM_LABEL}, acc\xE9der \xE0 la page npm du package Publicodes, nouvelle fen\xEAtre`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { "aria-hidden": true, children: "\u{1F4E6}" }),
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
  const { Code: Code2, Link } = (0, import_react12.useContext)(RenderersContext);
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "Utiliser notre API REST" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Vous trouverez ici un exemple d\u2019utilisation de notre API REST via curl ou un fetch javascript." }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Code2, { tabs }),
    apiDocumentationUrl && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { style: { textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
      Link,
      {
        to: apiDocumentationUrl,
        "aria-label": `${LINK_API_LABEL}, acc\xE9der \xE0 la documentation, nouvelle fen\xEAtre`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { "aria-hidden": true, children: "\u{1F469}\u200D\u{1F4BB}" }),
          " ",
          LINK_API_LABEL
        ]
      }
    ) })
  ] });
}
function MissingVars({ selfMissing }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "Donn\xE9es manquantes" }),
    selfMissing?.length ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Les r\xE8gles suivantes sont n\xE9cessaires pour le calcul mais n\u2019ont pas \xE9t\xE9 saisies dans la situation. Leur valeur par d\xE9faut est utilis\xE9e." }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Ul, { children: selfMissing.map((dottedName) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Li, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(RuleLinkWithContext, { dottedName }) }, dottedName)) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Il n\u2019y a pas de donn\xE9es manquante." })
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "R\xE8gles qui ont besoin de cette valeur" }),
    ruleNamesWithMissing.length ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { children: [
        "Les r\xE8gles suivantes ont besoin de la r\xE8gle courante pour \xEAtre calcul\xE9es :",
        ruleIsNotDefined && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
          " ",
          "La r\xE8gle courante n\u2019\xE9tant pas encore d\xE9finie, c\u2019est sa valeur par d\xE9faut qui est utilis\xE9e pour d\xE9terminer la valeur de ces r\xE8gles."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Ul, { children: ruleNamesWithMissing.map((dottedName2) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Li, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(RuleLinkWithContext, { dottedName: dottedName2 }) }, dottedName2)) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Aucune r\xE8gle n\u2019utilise cette valeur." })
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "Effets sur d\u2019autres r\xE8gles" }),
      replacements.length ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Une r\xE8gle peut avoir des effets sur d\u2019autres r\xE8gles afin de modifier leur comportement." }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Ul, { children: replacements.map((replacement) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          Li,
          {
            style: { marginBottom: "0.5rem" },
            children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Explanation, { node: replacement })
          },
          replacement.replacedReference.dottedName
        )) })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Cette r\xE8gle ne modifie aucune autre r\xE8gle." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h4", { children: "R\xE8gles qui peuvent avoir un effet sur cette valeur" }),
      effects.length ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Les r\xE8gles suivantes peuvent remplacer la valeur de la r\xE8gle courante :" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Ul, { children: effects.map((dottedName2) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Li, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(RuleLinkWithContext, { dottedName: dottedName2 }) }, dottedName2)) })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Aucune autre r\xE8gle n\u2019a d\u2019effets sur cette valeur." })
    ] })
  ] });
}
var StyledWarning = import_styled_components13.styled.div``;

// src/rule/Header.tsx
var import_publicodes10 = require("publicodes");
init_RuleLink();
init_hooks();

// src/rule/Meta.tsx
var import_react13 = require("react");
init_contexts();
var import_jsx_runtime36 = require("react/jsx-runtime");
function Meta({ title, description }) {
  const { Head } = (0, import_react13.useContext)(RenderersContext);
  if (!Head) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(Head, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("title", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("meta", { property: "og:type", content: "article" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("meta", { property: "og:title", content: title }),
    description && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("meta", { property: "og:description", content: description }),
    description && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("meta", { name: "description", content: description })
  ] });
}

// src/rule/Header.tsx
var import_jsx_runtime37 = require("react/jsx-runtime");
function RuleHeader({ dottedName }) {
  const engine = useEngine();
  const {
    title,
    rawNode: { description, question, ic\u00F4nes }
  } = engine.context.parsedRules[dottedName];
  const displayTitle = ic\u00F4nes ? title + " " + ic\u00F4nes : title;
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("header", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Meta, { title: displayTitle, description: description || question }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { id: "rules-nav-open-nav-button" }),
      import_publicodes10.utils.ruleParents(dottedName).reverse().map((parentDottedName) => /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(RuleLinkWithContext, { dottedName: parentDottedName, displayIcon: true }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { "aria-hidden": true, children: " \u203A " })
      ] }, parentDottedName))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h1", { children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(RuleLinkWithContext, { dottedName, displayIcon: true }) })
  ] });
}

// src/rule/RulesNav.tsx
var import_publicodes11 = require("publicodes");
var import_react15 = require("react");
var import_react_dom = __toESM(require("react-dom"), 1);
var import_styled_components15 = require("styled-components");
init_RuleLink();
init_icons();
init_hooks();
var import_jsx_runtime39 = require("react/jsx-runtime");
var RulesSearch2 = (0, import_react15.lazy)(() => Promise.resolve().then(() => (init_RulesSearch(), RulesSearch_exports)));
var RulesNav = ({
  dottedName,
  searchBar,
  mobileMenuPortalId,
  openNavButtonPortalId
}) => {
  const baseEngine = useEngine();
  const parsedRules = baseEngine.getParsedRules();
  const parsedRulesNames = Object.keys(parsedRules);
  const [navOpen, setNavOpen] = (0, import_react15.useState)(false);
  const initLevel = (dn) => Object.fromEntries([
    [dn, true],
    ...import_publicodes11.utils.ruleParents(dn).map((parent) => [parent, true])
  ]);
  const [level, setLevel] = (0, import_react15.useState)(initLevel(dottedName));
  (0, import_react15.useEffect)(() => {
    setLevel((prev) => ({ ...prev, ...initLevel(dottedName) }));
  }, [dottedName]);
  const toggleDropdown = (0, import_react15.useCallback)((ruleDottedName) => {
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
  const navRef = (0, import_react15.useRef)(null);
  const menu = /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(Container, { $open: navOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
      Background,
      {
        $open: navOpen,
        onClick: () => {
          setNavOpen((open) => !open);
        }
      }
    ),
    openNavButtonPortalElement && import_react_dom.default.createPortal(
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(OpenNavButton, { onClick: () => setNavOpen(true), children: "Toutes les r\xE8gles" }),
      openNavButtonPortalElement
    ),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(Nav, { $open: navOpen, ref: navRef, children: [
      searchBar ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(import_react15.Suspense, { fallback: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("p", { children: "Chargement..." }), children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(RulesSearch2, {}) }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("ul", { children: parsedRulesNames.sort((a, b) => a.localeCompare(b)).map((ruleDottedName) => {
        const parentDottedName = import_publicodes11.utils.ruleParent(ruleDottedName);
        if (ruleDottedName.split(" . ").length > 1 && !level[parentDottedName]) {
          return null;
        }
        const open = ruleDottedName in level && level[ruleDottedName];
        return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
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
  return isMobileMenu && mobileMenuPortalElement ? import_react_dom.default.createPortal(menu, mobileMenuPortalElement) : menu;
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
  const activeLi = (0, import_react15.useRef)(null);
  (0, import_react15.useEffect)(() => {
    if (navRef.current && activeLi.current?.offsetTop) {
      navRef.current.scrollTop = activeLi.current?.offsetTop;
    }
  }, [active]);
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    "li",
    {
      ref: active ? activeLi : void 0,
      style: {
        paddingLeft: (ruleDottedName.split(" . ").length - 1) * 16
      },
      className: (childrenCount > 0 ? "dropdown " : "") + (active ? "active " : ""),
      children: /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("span", { className: "content", children: [
        childrenCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          DropdownButton,
          {
            "aria-label": open ? "Replier le sous-menu" : "D\xE9plier le sous-menu",
            "aria-expanded": open,
            onClick: () => onClickDropdown(ruleDottedName),
            children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(StyledArrow2, { $open: open })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(RuleLinkWithContext, { dottedName: ruleDottedName, displayIcon: true })
      ] })
    },
    ruleDottedName
  );
};
var MemoNavLi = (0, import_react15.memo)(NavLi);
var breakpointsWidth = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};
var Container = import_styled_components15.styled.div`
	z-index: 200;
	overflow: auto;
	position: sticky;
	top: 0;

	@media (min-width: ${breakpointsWidth.lg}) {
		max-width: 50%;
		flex-shrink: 0;
	}
`;
var Background = import_styled_components15.styled.div`
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
var OpenNavButton = import_styled_components15.styled.button`
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
var Nav = import_styled_components15.styled.nav`
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
var DropdownButton = import_styled_components15.styled.button`
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
var StyledArrow2 = (0, import_styled_components15.styled)(Arrow)`
	width: 100%;
	transition: transform 0.1s;
	height: 100%;
	transform: rotate(${({ $open }) => $open ? "0deg" : "-90deg"});
`;

// src/rule/RulePage.tsx
var import_jsx_runtime40 = require("react/jsx-runtime");
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
  const prevRenderers = (0, import_react16.useRef)(renderers);
  (0, import_react16.useEffect)(() => {
    if (prevRenderers.current !== renderers) {
      prevRenderers.current = renderers;
    }
  }, [renderers]);
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(EngineContext.Provider, { value: engine, children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(BasepathContext.Provider, { value: documentationPath, children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(RenderersContext.Provider, { value: defaultRenderers(renderers), children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
    Rule,
    {
      dottedName: import_publicodes12.utils.decodeRuleName(rulePath),
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
  const { References: References2, Text } = (0, import_react16.useContext)(RenderersContext);
  const useSubEngine = subEngineId && baseEngine.subEngines[subEngineId];
  const engine = useSubEngine ? baseEngine.subEngines[subEngineId] : baseEngine;
  if (!(dottedName in engine.context.parsedRules)) {
    return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "Cette r\xE8gle est introuvable dans la base" });
  }
  engine.resetCache();
  engine.cache.traversedVariablesStack = [];
  const rule = engine.evaluateNode(
    engine.context.parsedRules[dottedName]
  );
  const { description, question } = rule.rawNode;
  const { valeur, nullableParent, ruleDisabledByItsParent } = rule.explanation;
  const situation = buildSituationUsedInRule(engine, rule);
  const references = References2?.({
    references: rule.rawNode.r\u00E9f\u00E9rences,
    dottedName: rule.dottedName
  });
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(EngineContext.Provider, { value: engine, children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(Container2, { id: "documentation-rule-root", children: [
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
      RulesNav,
      {
        dottedName,
        mobileMenuPortalId,
        openNavButtonPortalId,
        searchBar
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Article, { children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(DottedNameContext.Provider, { value: dottedName, children: [
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(RuleHeader, { dottedName }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Text, { children: description || question || "" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("p", { style: { fontSize: "1.25rem", lineHeight: "2rem" }, children: [
        "Valeur : ",
        (0, import_publicodes12.formatValue)(rule, { language }),
        rule.nodeValue === void 0 && rule.unit && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("br", {}),
          "Unit\xE9 : ",
          (0, import_publicodes12.serializeUnit)(rule.unit)
        ] })
      ] }),
      ruleDisabledByItsParent && nullableParent && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(import_jsx_runtime40.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("blockquote", { children: [
        "Cette r\xE8gle est ",
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("strong", { children: "non applicable" }),
        " car elle appartient \xE0 l\u2019espace de nom :",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Explanation, { node: nullableParent })
      ] }) }),
      useSubEngine && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("p", { children: [
              "Vous naviguez la documentation avec un",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("strong", { children: "contexte" }),
              " d\u2019\xE9valuation",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("strong", { children: "sp\xE9cifique" }),
              "."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { style: { flex: 1 } }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
              "p",
              {
                style: {
                  textAlign: "right",
                  marginTop: 0
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "Comment cette donn\xE9e est-elle calcul\xE9e ?" }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { id: "documentation-rule-explanation", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Explanation, { node: valeur }) }),
      rule.rawNode.note && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h3", { children: "Note" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Text, { children: rule.rawNode.note }) })
      ] }),
      references && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h3", { children: "R\xE9f\xE9rences" }),
        references
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("br", {}),
      showDevSection && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h3", { children: "Informations techniques" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(Text, { children: "Si vous \xEAtes d\xE9veloppeur/euse vous trouverez ci-dessous des informations techniques utiles pour l\u2019int\xE9gration de cette r\xE8gle dans votre application." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
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
var Container2 = import_styled_components16.styled.div`
	display: flex;
	flex-wrap: nowrap;
	align-items: flex-start;
	@media (max-width: ${breakpointsWidth.lg}) {
		flex-direction: column;
	}
`;
var Article = import_styled_components16.styled.article`
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
      documentationPath + "/" + import_publicodes13.utils.encodeRuleName(dottedName),
      dottedName
    ])
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Explanation,
  RuleLink,
  RulePage,
  getDocumentationSiteMap
});
//# sourceMappingURL=index.cjs.map