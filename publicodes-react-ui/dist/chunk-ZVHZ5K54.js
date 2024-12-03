// src/contexts.tsx
import { createContext } from "react";

// src/component/Accordion.tsx
import { useState } from "react";
import { css, styled } from "styled-components";

// src/component/icons/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Arrow = ({ className }) => /* @__PURE__ */ jsxs(
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
      /* @__PURE__ */ jsx("path", { d: "M0 0h24v24H0V0z", fill: "none" }),
      /* @__PURE__ */ jsx("path", { d: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" })
    ]
  }
);

// src/component/Accordion.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var AccordionContainer = styled.div`
	overflow: hidden;
	border-radius: 6px;
	border: 1px solid #bbb;
`;
var H4 = styled.h4`
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
var AccordionWrapper = styled.div`
	border: 0 solid #bbb;
	${({ i }) => i > 0 && css`
			border-top-width: 1px;
		`}

	& ${H4} {
		margin: 0;
	}
`;
var Child = styled.div`
	display: ${({ open }) => open ? "block" : "none"};
	margin: 1.5rem;
`;
var StyledArrow = styled(Arrow)`
	display: inline-block;
	width: 25px;
	transition: transform 0.1s;
	height: 25px;
	transform: rotate(${({ $isOpen }) => $isOpen ? `180deg` : `360deg`});
`;
var Accordion = ({ items }) => {
  const [open, setOpen] = useState([]);
  const toggleAccordion = (i) => () => setOpen((arr) => {
    arr[i] = !arr[i];
    return [...arr];
  });
  return /* @__PURE__ */ jsx2(AccordionContainer, { children: items.map(({ id, title, children }, i) => /* @__PURE__ */ jsxs2(AccordionWrapper, { id, i, children: [
    /* @__PURE__ */ jsx2(H4, { children: /* @__PURE__ */ jsxs2("button", { onClick: toggleAccordion(i), children: [
      /* @__PURE__ */ jsx2("span", { children: title }),
      /* @__PURE__ */ jsx2(StyledArrow, { $isOpen: open[i] })
    ] }) }),
    /* @__PURE__ */ jsx2("div", { children: /* @__PURE__ */ jsx2(Child, { open: !!open[i], children }) })
  ] }, id)) });
};

// src/component/Code.tsx
import { useState as useState2 } from "react";
import { styled as styled2 } from "styled-components";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var PreWrapper = styled2.div`
	position: relative;
	:hover button,
	:focus-within button {
		opacity: 1;
	}
`;
var Bar = styled2.div`
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
var Pre = styled2.pre`
	overflow: auto;
	padding: 0.5rem;
	background-color: #e6e9ec;
	border-radius: 0.25rem;
`;
var Code = ({ tabs }) => {
  const [tab, setTab] = useState2();
  const tabKeys = Object.keys(tabs);
  const activeTab = tab ?? tabKeys[0];
  return /* @__PURE__ */ jsxs3(PreWrapper, { children: [
    /* @__PURE__ */ jsxs3(Bar, { children: [
      typeof navigator !== "undefined" && navigator.clipboard && /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => navigator.clipboard.writeText(tabs[activeTab]),
          children: "copier"
        }
      ),
      tabKeys.length > 1 && tabKeys.filter((name) => name !== activeTab).map((name) => /* @__PURE__ */ jsx3("button", { onClick: () => setTab(name), children: name }, name))
    ] }),
    /* @__PURE__ */ jsx3(Pre, { children: /* @__PURE__ */ jsx3("code", { children: tabs[activeTab] }) })
  ] });
};

// src/rule/References.tsx
import { capitalise0 } from "publicodes";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function References({ references }) {
  if (!references) {
    return null;
  }
  return /* @__PURE__ */ jsx4("ul", { children: Object.entries(references).map(([name, link]) => /* @__PURE__ */ jsxs4(
    "li",
    {
      style: {
        display: "flex",
        alignItems: "center"
      },
      children: [
        /* @__PURE__ */ jsx4(
          "a",
          {
            href: link,
            target: "_blank",
            style: {
              marginRight: "1rem"
            },
            rel: "noreferrer",
            children: capitalise0(name)
          }
        ),
        /* @__PURE__ */ jsx4("span", { className: "ui__ label", children: link })
      ]
    },
    name
  )) });
}

// src/contexts.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var DefaultTextRenderer = ({
  children
}) => /* @__PURE__ */ jsx5("p", { children });
var DefaultLinkRenderer = (props) => /* @__PURE__ */ jsx5("a", { ...props });
var defaultRenderers = (renderers = {}) => {
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
var RenderersContext = createContext(defaultRenderers());
var BasepathContext = createContext("/documentation");
var DottedNameContext = createContext(void 0);
var EngineContext = createContext(
  void 0
);

// src/hooks.ts
import { useContext } from "react";
var useEngine = () => {
  const engine = useContext(EngineContext);
  if (!engine) {
    throw new Error("Engine expected");
  }
  return engine;
};

// src/RuleLink.tsx
import { utils } from "publicodes";
import { useContext as useContext2 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var { encodeRuleName } = utils;
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
  const renderers = useContext2(RenderersContext);
  const dottedNameContext = utils.findCommonAncestor(
    useContext2(DottedNameContext) ?? dottedName,
    dottedName
  );
  const Link = linkComponent || renderers.Link;
  if (!Link) {
    throw new Error("You must provide a <Link /> component.");
  }
  const rule = engine.context.parsedRules[dottedName];
  const newPath = documentationPath + "/" + encodeRuleName(dottedName);
  const contextTitle = [
    ...utils.ruleParents(dottedName).reverse().filter((name) => name.startsWith(`${dottedNameContext} . `)).map((name) => engine.context.parsedRules[name]?.title.trim()),
    rule.title?.trim()
  ].join(" \u203A ");
  if (!rule) {
    throw new Error(`Unknown rule: ${dottedName}`);
  }
  return /* @__PURE__ */ jsxs5(
    Link,
    {
      ...propsRest,
      "aria-label": propsRest["aria-label"] ?? (rule.title && rule.title + ", voir les d\xE9tails du calcul pour : " + rule.title),
      to: newPath + (currentEngineId ? `?currentEngineId=${currentEngineId}` : ""),
      children: [
        children || contextTitle || rule.dottedName.split(" . ").slice(-1)[0],
        " ",
        displayIcon && rule.rawNode.ic\u00F4nes && /* @__PURE__ */ jsx6("span", { children: rule.rawNode.ic\u00F4nes })
      ]
    }
  );
}
function RuleLinkWithContext(props) {
  const engine = useEngine();
  const documentationPath = useContext2(BasepathContext);
  const currentEngineIdFromUrl = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("currentEngineId");
  const currentEngineId = props.useSubEngine !== false ? props.currentEngineId || engine.subEngineId || (currentEngineIdFromUrl ? Number(currentEngineIdFromUrl) : void 0) : void 0;
  return /* @__PURE__ */ jsx6(
    RuleLink,
    {
      engine,
      currentEngineId,
      documentationPath,
      ...props
    }
  );
}

export {
  Arrow,
  defaultRenderers,
  RenderersContext,
  BasepathContext,
  DottedNameContext,
  EngineContext,
  useEngine,
  RuleLink,
  RuleLinkWithContext
};
//# sourceMappingURL=chunk-ZVHZ5K54.js.map