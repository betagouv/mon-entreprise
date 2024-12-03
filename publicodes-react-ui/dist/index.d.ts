import * as react_jsx_runtime from 'react/jsx-runtime';
import Engine, { ASTNode } from 'publicodes';
import { ComponentType, ReactNode, ComponentProps } from 'react';

declare function Explanation({ node }: {
    node: ASTNode;
}): react_jsx_runtime.JSX.Element;

interface AccordionProps {
    items: AccordionItem[];
}

interface CodeProps {
    tabs: {
        [name: string]: string;
    };
}

type ReferencesProps = {
    references?: Record<string, string>;
    dottedName?: string;
};
declare function References({ references }: ReferencesProps): react_jsx_runtime.JSX.Element | null;

type AccordionItem = {
    title: string;
    id: string;
    children: ReactNode;
};
type SupportedRenderers = {
    Link?: ComponentType<{
        children: ReactNode;
        to?: string;
        href?: string;
        title?: string;
        small?: boolean;
        'aria-label'?: string;
    }>;
    Head?: ComponentType<{
        children: ReactNode;
    }>;
    /**
     * Used to render a rule description or title. Useful to parse markdown, links
     * or emojies.
     */
    Text?: ComponentType<{
        children: string;
    }>;
    References?: typeof References;
    /**
     * Accordion used for developer documentation.
     */
    Accordion?: ComponentType<AccordionProps>;
    /**
     * Block of code in pre
     */
    Code?: ComponentType<CodeProps>;
};

type RuleLinkProps<Name extends string> = {
    dottedName: Name;
    engine: Engine<Name>;
    documentationPath: string;
    displayIcon?: boolean;
    currentEngineId?: number;
    linkComponent?: SupportedRenderers['Link'];
    children?: React.ReactNode;
} & Omit<ComponentProps<Required<SupportedRenderers>['Link']>, 'to' | 'children'>;
declare function RuleLink<Name extends string>({ dottedName, engine, currentEngineId, documentationPath, displayIcon, linkComponent, children, ...propsRest }: RuleLinkProps<Name>): react_jsx_runtime.JSX.Element;

type RulePageProps = {
    documentationPath: string;
    rulePath: string;
    engine: Engine;
    language: 'fr' | 'en';
    renderers: SupportedRenderers;
    searchBar?: boolean;
    apiDocumentationUrl?: string;
    apiEvaluateUrl?: string;
    npmPackage?: string;
    mobileMenuPortalId?: string;
    openNavButtonPortalId?: string;
    showDevSection?: boolean;
};
declare function RulePage({ documentationPath, rulePath, engine, renderers, searchBar, language, apiDocumentationUrl, apiEvaluateUrl, npmPackage, mobileMenuPortalId, openNavButtonPortalId, showDevSection, }: RulePageProps): react_jsx_runtime.JSX.Element;

declare function getDocumentationSiteMap({ engine, documentationPath }: {
    engine: any;
    documentationPath: any;
}): {
    [k: string]: string;
};

export { Explanation, RuleLink, RulePage, getDocumentationSiteMap };
