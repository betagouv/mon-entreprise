import {
  DottedNameContext,
  RuleLinkWithContext,
  useEngine
} from "./chunk-ZVHZ5K54.js";

// src/rule/RulesSearch.tsx
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import Fuse from "fuse.js";
import { jsx, jsxs } from "react/jsx-runtime";
function RulesSearch() {
  const engine = useEngine();
  const dottedName = useContext(DottedNameContext);
  const rules = Object.entries(engine.getParsedRules()).map(
    ([name, rule]) => {
      return { name, title: rule?.rawNode?.titre };
    }
  );
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fuse = new Fuse(rules, { keys: ["title", "name"] });
  useEffect(() => {
    setSearchQuery("");
  }, [dottedName]);
  useEffect(() => {
    const results = fuse.search(searchQuery, { limit: 10 });
    setSearchResults(results.map((result) => result.item));
  }, [searchQuery]);
  const isEmpty = searchResults.length === 0;
  return /* @__PURE__ */ jsxs(SearchContainer, { id: "documentation-search", children: [
    /* @__PURE__ */ jsx(
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
    !isEmpty ? /* @__PURE__ */ jsx(SearchResults, { id: "documentation-search-results", children: searchResults.map(({ name, title }, i) => {
      return /* @__PURE__ */ jsx(
        SearchItem,
        {
          id: "documentation-search-item",
          isLast: i === searchResults.length - 1,
          onClick: () => setSearchQuery(""),
          children: /* @__PURE__ */ jsx(RuleLinkWithContext, { dottedName: name, children: /* @__PURE__ */ jsxs(ItemContent, { onClick: () => setSearchQuery(""), children: [
            /* @__PURE__ */ jsx(ItemName, { id: "documentation-search-item-name", children: name }),
            /* @__PURE__ */ jsx(ItemTitle, { id: "documentation-search-item-title", children: title })
          ] }) })
        },
        name
      );
    }) }) : null
  ] });
}
var SearchContainer = styled.div`
	margin-bottom: 1rem;
	margin-right: 1rem;
	max-width: 350px;
`;
var SearchInput = styled.input`
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: ${({ empty }) => empty ? "5px" : "5px 5px 0 0"};

	&:focus {
		outline: none;
		border: 1px solid #666;
	}
`;
var SearchResults = styled.div`
	background-color: white;
	border: 1px solid #ccc;
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
	position: relative;
`;
var SearchItem = styled.div`
	padding: 0.5rem;
	border-bottom: ${({ isLast }) => isLast ? "none" : "1px solid #e6e6e6"};
	border-left: 2px solid transparent;
	border-radius: ${({ isLast }) => isLast ? "0 0 0.25rem 0.25rem" : "0"};

	&:hover {
		background-color: #f6f6f6;
	}
`;
var ItemContent = styled.span`
	display: flex;
	flex-wrap: wrap;
	flex-gap: 0.5rem;
	align-items: center;
`;
var ItemName = styled.span`
	width: 100%;
`;
var ItemTitle = styled.span`
	color: #666;
`;
export {
  RulesSearch as default
};
//# sourceMappingURL=RulesSearch-IUQDMTNF.js.map