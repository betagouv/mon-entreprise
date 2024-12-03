type ArrondiNode = {
    explanation: {
        arrondi: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'arrondi';
};

type TrancheNode = {
    taux: ASTNode;
} | {
    montant: ASTNode;
};
type TrancheNodes = Array<TrancheNode & {
    plafond?: ASTNode;
    isActive?: boolean;
}>;

type BarèmeNode = {
    explanation: {
        tranches: TrancheNodes;
        multiplicateur: ASTNode;
        assiette: ASTNode;
    };
    nodeKind: 'barème';
};

type ConditionNode = {
    explanation: {
        si: ASTNode;
        alors: ASTNode;
        sinon: ASTNode;
    };
    nodeKind: 'condition';
};

type NodesTypes = WeakMap<ASTNode, InferedType>;
type InferedType = {
    isNullable: boolean | undefined;
} & Pick<ConstantNode, 'type'>;

type Rule = {
    formule?: Record<string, unknown> | string;
    valeur?: Record<string, unknown> | string;
    question?: string;
    description?: string;
    unité?: string;
    acronyme?: string;
    exemples?: any;
    résumé?: string;
    icônes?: string;
    titre?: string;
    sévérité?: string;
    type?: string;
    experimental?: 'oui';
    'possiblement non applicable'?: 'oui';
    privé?: 'oui';
    note?: string;
    remplace?: Remplace | Array<Remplace>;
    'rend non applicable'?: Remplace | Array<Remplace>;
    suggestions?: Record<string, string | number | Record<string, unknown>>;
    références?: {
        [source: string]: string;
    };
    API?: string;
    'identifiant court'?: string;
} & Record<string, unknown>;
type Remplace = {
    'références à': string;
    dans?: Array<string> | string;
    'sauf dans'?: Array<string> | string;
    priorité?: number;
} | string;
type RuleNode<Name extends string = string> = {
    dottedName: Name;
    title: string;
    nodeKind: 'rule';
    virtualRule: boolean;
    private: boolean;
    rawNode: Rule;
    replacements: Array<ReplacementRule>;
    explanation: {
        valeur: ASTNode;
        parents: Array<ASTNode>;
        nullableParent?: ASTNode;
        ruleDisabledByItsParent: boolean;
    };
    suggestions: Record<string, ASTNode>;
    'identifiant court'?: string;
};

type ReplacementRule = {
    nodeKind: 'replacementRule';
    definitionRule: ASTNode<'reference'> & {
        dottedName: string;
    };
    replacedReference: ASTNode<'reference'>;
    priority?: number;
    whiteListedNames: Array<ASTNode<'reference'>>;
    rawNode: any;
    blackListedNames: Array<ASTNode<'reference'>>;
    remplacementRuleId: number;
    replaceByNonApplicable: boolean;
};

type getUnitKey = (writtenUnit: string) => string;
type formatUnit = (unit: string, count: number) => string;
declare const parseUnit: (string: string, getUnitKey?: getUnitKey) => Unit;
declare function serializeUnit(rawUnit: Unit | undefined | string, count?: number, formatUnit?: formatUnit): string | undefined;

type Context<RuleNames extends string = string> = {
    dottedName: RuleNames | '';
    parsedRules: ParsedRules<RuleNames>;
    nodesTypes: NodesTypes;
    referencesMaps: ReferencesMaps<RuleNames>;
    rulesReplacements: RulesReplacements<RuleNames>;
    getUnitKey?: getUnitKey;
    logger: Logger;
    inversionMaxIterations?: number;
    /**
     * Don't throw an error if the parent of a rule is not found.
     * This is useful to parse partial rule sets (e.g. optimized ones).
     */
    allowOrphanRules: boolean;
    /**
     * This is used to generate unique IDs for sub-engines, we need to generate them at
     *  */
    subEngineIncrementingNumber?: number;
};
type RulesReplacements<RuleNames extends string> = Partial<Record<RuleNames, ReplacementRule[]>>;
type ReferencesMaps<Names extends string> = {
    referencesIn: Map<Names, Set<Names>>;
    rulesThatUse: Map<Names, Set<Names>>;
};
type RawRule = Omit<Rule, 'nom'> | string | number | null;
type RawPublicodes<RuleNames extends string> = Partial<Record<RuleNames, RawRule>>;
declare function parsePublicodes<ContextNames extends string, NewRulesNames extends string>(rawRules: RawPublicodes<NewRulesNames>, partialContext?: Partial<Context<ContextNames>>): Pick<Context<ContextNames | NewRulesNames>, 'parsedRules' | 'nodesTypes' | 'referencesMaps' | 'rulesReplacements'>;

type ReferenceNode = {
    nodeKind: 'reference';
    name: string;
    contextDottedName: string;
    dottedName?: string;
    title?: string;
    acronym?: string;
};

type ContextNode = {
    explanation: {
        valeur: ASTNode;
        contexte: Array<[ReferenceNode, ASTNode]>;
        subEngineId: number;
    };
    nodeKind: 'contexte';
};

type DuréeNode = {
    explanation: {
        depuis: ASTNode;
        "jusqu'à": ASTNode;
    };
    unit: Unit;
    nodeKind: 'durée';
};

type EstNonDéfiniNode = {
    explanation: ASTNode;
    nodeKind: 'est non défini';
};

type EstNonApplicableNode = {
    explanation: ASTNode;
    nodeKind: 'est non applicable';
};

type GrilleNode = {
    explanation: {
        assiette: ASTNode;
        multiplicateur: ASTNode;
        tranches: TrancheNodes;
    };
    nodeKind: 'grille';
};

type InversionNode = {
    explanation: {
        ruleToInverse: string;
        inversionCandidates: Array<ReferenceNode>;
        unit?: Unit;
        inversionGoal?: ASTNode;
        numberOfIteration?: number;
        inversionFail?: boolean;
    };
    nodeKind: 'inversion';
};

type PossibilityNode = {
    explanation: Array<ASTNode>;
    'choix obligatoire'?: 'oui' | 'non';
    context: string;
    nodeKind: 'une possibilité';
};

declare const knownOperations: {
    readonly '*': readonly [(a: any, b: any) => number, "×"];
    readonly '/': readonly [(a: any, b: any) => number, "∕"];
    readonly '+': readonly [(a: any, b: any) => any];
    readonly '-': readonly [(a: any, b: any) => number, "−"];
    readonly '<': readonly [(a: any, b: any) => boolean];
    readonly '<=': readonly [(a: any, b: any) => boolean, "≤"];
    readonly '>': readonly [(a: any, b: any) => boolean];
    readonly '>=': readonly [(a: any, b: any) => boolean, "≥"];
    readonly '=': readonly [(a: any, b: any) => boolean];
    readonly '!=': readonly [(a: any, b: any) => boolean, "≠"];
    readonly et: readonly [(a: any, b: any) => any];
    readonly ou: readonly [(a: any, b: any) => any];
};
type OperationNode = {
    nodeKind: 'operation';
    explanation: [ASTNode, ASTNode];
    operationKind: keyof typeof knownOperations;
    operator: string;
};

type RésoudreRéférenceCirculaireNode = {
    explanation: {
        ruleToSolve: string;
        valeur: ASTNode;
    };
    nodeKind: 'résoudre référence circulaire';
};

type SimplifierUnitéNode = {
    explanation: ASTNode;
    nodeKind: 'simplifier unité';
};

type TauxProgressifNode = {
    explanation: {
        tranches: TrancheNodes;
        multiplicateur: ASTNode;
        assiette: ASTNode;
    };
    nodeKind: 'taux progressif';
};

declare const NAME: "texte";
type TexteNode = {
    explanation: Array<ASTNode | string>;
    nodeKind: typeof NAME;
};

type UnitéNode = {
    unit: Unit;
    explanation: ASTNode;
    nodeKind: 'unité';
};

type VariableManquanteNode = {
    missingVariable: string;
    explanation: ASTNode;
    nodeKind: 'variable manquante';
};

type VariationNode = {
    explanation: Array<{
        condition: ASTNode;
        consequence: ASTNode;
        satisfied?: boolean;
    }>;
    nodeKind: 'variations';
};

type ConstantNode = {
    type: 'boolean' | 'number' | 'string' | 'date' | undefined;
    nodeValue: Evaluation;
    nodeKind: 'constant';
    isNullable?: boolean;
    isDefault?: boolean;
    fullPrecision?: boolean;
};
type PossibleNodes = RuleNode | ReferenceNode | ArrondiNode | BarèmeNode | DuréeNode | GrilleNode | EstNonApplicableNode | EstNonDéfiniNode | InversionNode | OperationNode | PossibilityNode | ContextNode | SimplifierUnitéNode | RésoudreRéférenceCirculaireNode | TauxProgressifNode | UnitéNode | VariationNode | ConditionNode | ConstantNode | ReplacementRule | VariableManquanteNode | TexteNode;
type NodeKind = PossibleNodes['nodeKind'];
type ASTNode<N extends NodeKind = NodeKind> = PossibleNodes & {
    nodeKind: N;
    isDefault?: boolean;
    sourceMap?: {
        mecanismName: string;
        args: Record<string, ASTNode | Array<ASTNode>>;
    };
    rawNode?: string | Record<string, unknown>;
} & (EvaluationDecoration<Types> | {});
type ASTTransformer = (n: ASTNode) => ASTNode;
type TraverseFunction<K extends NodeKind> = (fn: ASTTransformer, node: ASTNode<K>) => ASTNode<K>;
type BaseUnit = string;
type Unit = {
    numerators: Array<BaseUnit>;
    denominators: Array<BaseUnit>;
};
type EvaluationDecoration<T extends Types> = {
    nodeValue: Evaluation<T>;
    unit?: Unit;
    traversedVariables?: Array<string>;
    missingVariables: MissingVariables;
};
type Types = number | boolean | string | Record<string, unknown>;
type Evaluation<T extends Types = Types> = T | null | undefined;
type EvaluatedNode<K extends NodeKind = NodeKind, T extends Types = Types> = EvaluationDecoration<T> & ASTNode<K>;
type MissingVariables = Record<string, number>;

type GraphCycles = string[][];
type RawRules = Parameters<typeof parsePublicodes>[0];
/**
 * This function is useful so as to print the dependencies at each node of the
 * cycle.
 * ⚠️  Indeed, the findCycles function returns the cycle found using the
 * Tarjan method, which is **not necessarily the smallest cycle**. However, the
 * smallest cycle is more readable.
 */
declare function cyclicDependencies(rawRules: RawRules): [GraphCycles, string[]];

/**
 * Returns the last part of a dottedName (the leaf).
 */
declare const nameLeaf: (dottedName: string) => string;
/**
 * Encodes a dottedName for the URL to be secure.
 * @see {@link decodeRuleName}
 */
declare const encodeRuleName: (dottedName: string) => string;
/**
 * Decodes an encoded dottedName.
 * @see {@link encodeRuleName}
 */
declare const decodeRuleName: (dottedName: string) => string;
/**
 * Return dottedName from contextName
 */
declare const contextNameToDottedName: (contextName: string) => string;
/**
 * Returns the parent dottedName
 */
declare const ruleParent: (dottedName: string) => string;
/**
 * Returns an array of dottedName from near parent to far parent.
 */
declare function ruleParents(dottedName: string): Array<string>;
/**
 * Returns an array of all child rules of a dottedName
 */
declare const getChildrenRules: (parsedRules: ParsedRules<string>, dottedName: string) => string[];
/**
 * Finds the common ancestor of two dottedName
 */
declare function findCommonAncestor(dottedName1: string, dottedName2: string): string;
/**
 * Check wether a rule is accessible from a namespace.
 *
 * Takes into account that some namespace can be `private`, i.e. that they can only be
 * accessed by immediate parent, children or siblings.
 *
 * @param rules The parsed rules
 * @param contextName The context of the call
 * @param name The namespace checked for accessibility
 */
declare function isAccessible(rules: Record<string, RuleNode>, contextName: string, name: string): boolean;
/**
 * Check wether a rule is tagged as experimental.
 *
 * Takes into account the a children of an experimental rule is also experimental
 *
 * @param rules The parsed rules
 * @param name The namespace checked for experimental
 */
declare function isExperimental(rules: Record<string, RuleNode>, name: string): boolean;
declare function disambiguateReference<R extends Record<string, RuleNode>>(rules: R, referencedFrom: string | undefined, partialName: string): keyof R;
declare function ruleWithDedicatedDocumentationPage(rule: any): boolean;
declare function updateReferencesMapsFromReferenceNode(node: ASTNode, referencesMaps: ReferencesMaps<string>, ruleDottedName?: string): void;
declare function disambiguateReferenceNode(node: ASTNode, parsedRules: ParsedRules<string>): ReferenceNode | undefined;

declare const ruleUtils_contextNameToDottedName: typeof contextNameToDottedName;
declare const ruleUtils_cyclicDependencies: typeof cyclicDependencies;
declare const ruleUtils_decodeRuleName: typeof decodeRuleName;
declare const ruleUtils_disambiguateReference: typeof disambiguateReference;
declare const ruleUtils_disambiguateReferenceNode: typeof disambiguateReferenceNode;
declare const ruleUtils_encodeRuleName: typeof encodeRuleName;
declare const ruleUtils_findCommonAncestor: typeof findCommonAncestor;
declare const ruleUtils_getChildrenRules: typeof getChildrenRules;
declare const ruleUtils_isAccessible: typeof isAccessible;
declare const ruleUtils_isExperimental: typeof isExperimental;
declare const ruleUtils_nameLeaf: typeof nameLeaf;
declare const ruleUtils_ruleParent: typeof ruleParent;
declare const ruleUtils_ruleParents: typeof ruleParents;
declare const ruleUtils_ruleWithDedicatedDocumentationPage: typeof ruleWithDedicatedDocumentationPage;
declare const ruleUtils_updateReferencesMapsFromReferenceNode: typeof updateReferencesMapsFromReferenceNode;
declare namespace ruleUtils {
  export {
    ruleUtils_contextNameToDottedName as contextNameToDottedName,
    ruleUtils_cyclicDependencies as cyclicDependencies,
    ruleUtils_decodeRuleName as decodeRuleName,
    ruleUtils_disambiguateReference as disambiguateReference,
    ruleUtils_disambiguateReferenceNode as disambiguateReferenceNode,
    ruleUtils_encodeRuleName as encodeRuleName,
    ruleUtils_findCommonAncestor as findCommonAncestor,
    ruleUtils_getChildrenRules as getChildrenRules,
    ruleUtils_isAccessible as isAccessible,
    ruleUtils_isExperimental as isExperimental,
    ruleUtils_nameLeaf as nameLeaf,
    ruleUtils_ruleParent as ruleParent,
    ruleUtils_ruleParents as ruleParents,
    ruleUtils_ruleWithDedicatedDocumentationPage as ruleWithDedicatedDocumentationPage,
    ruleUtils_updateReferencesMapsFromReferenceNode as updateReferencesMapsFromReferenceNode,
  };
}

/**
    This function creates a transormation of the AST from on a simpler
    callback function `fn`

    `fn` will be called with the nodes of the ASTTree during the exploration

    The outcome of the callback function has an influence on the exploration of the AST :
    - `false`, the node is not updated and the exploration does not continue further down this branch
    - `undefined`, the node is not updated but the exploration continues and its children will be transformed
    - `ASTNode`, the node is transformed to the new value and the exploration does not continue further down the branch

    `updateFn` : It is possible to specifically use the updated version of a child
    by using the function passed as second argument. The returned value will be the
    transformed version of the node.
    */
declare function makeASTTransformer(fn: (node: ASTNode, transform: ASTTransformer) => ASTNode | undefined | false, stopOnUpdate?: boolean): ASTTransformer;
/**
 * This function allows to construct a specific value while exploring the AST with
 * a simple reducing function as argument.
 *
 * `fn` will be called with the currently reduced value `acc` and the current node of the AST
 *
 * If the callback function returns:
 * - `undefined`, the exploration continues further down and all the children are reduced
 * 	successively to a single value
 * - `T`, the reduced value is returned
 *
 * `reduceFn` : It is possible to specifically use the reduced value of a child
 * by using the function passed as second argument. The returned value will be the reduced version
 * of the node
 */
declare function reduceAST<T>(fn: (acc: T, n: ASTNode, reduceFn: (n: ASTNode) => T) => T | undefined, start: T, node: ASTNode): T;
/**
 * Apply a transform function on children. Not recursive.
 */
declare const traverseASTNode: TraverseFunction<NodeKind>;

/**
 * Each error name with corresponding type in info value
 */
interface PublicodesErrorTypes {
    InternalError: {
        dottedName?: string;
    };
    EngineError: Record<string, never>;
    SyntaxError: {
        dottedName: string;
    };
    EvaluationError: {
        dottedName: string;
    };
    UnknownRule: {
        dottedName: string;
    };
    PrivateRule: {
        dottedName: string;
    };
}
/**
 * Return true if `error` is a PublicodesError,
 * use `name` parameter to check and narow error type
 * @example
 * try {
 * 	new Engine().evaluate()
 * } catch (error) {
 * 	if (isPublicodesError(error, 'EngineError')) {
 * 		console.log(error.info)
 * 	}
 * }
 */
declare const isPublicodesError: <Name extends keyof PublicodesErrorTypes>(error: unknown, name?: Name | undefined) => error is PublicodesError<Name | undefined extends undefined ? keyof PublicodesErrorTypes : Name>;
/**
 * Generic error for Publicodes
 */
declare class PublicodesError<Name extends keyof PublicodesErrorTypes> extends Error {
    name: Name;
    info: PublicodesErrorTypes[Name];
    constructor(name: Name, message: string, info: PublicodesErrorTypes[Name], originalError?: Error);
}

declare function capitalise0(name: undefined): undefined;
declare function capitalise0(name: string): string;
type Options$1 = {
    language?: string;
    displayedUnit?: string;
    precision?: number;
    formatUnit?: formatUnit;
};
declare function formatValue(value: number | {
    nodeValue: Evaluation;
    unit?: Unit;
} | undefined, { language, displayedUnit, formatUnit, precision }?: Options$1): any;

declare function simplifyNodeUnit(node: any): any;

type BinaryOp = {
    '+': [ExprAST, ExprAST];
} | {
    '-': [ExprAST, ExprAST];
} | {
    '*': [ExprAST, ExprAST];
} | {
    '/': [ExprAST, ExprAST];
} | {
    '>': [ExprAST, ExprAST];
} | {
    '<': [ExprAST, ExprAST];
} | {
    '>=': [ExprAST, ExprAST];
} | {
    '<=': [ExprAST, ExprAST];
} | {
    '=': [ExprAST, ExprAST];
} | {
    '!=': [ExprAST, ExprAST];
};
type UnaryOp = {
    '-': [{
        value: 0;
    }, ExprAST];
};
/** AST of a publicodes expression. */
type ExprAST = BinaryOp | UnaryOp | {
    variable: string;
} | {
    constant: {
        type: 'number';
        nodeValue: number;
    };
    unité?: string;
} | {
    constant: {
        type: 'boolean';
        nodeValue: boolean;
    };
} | {
    constant: {
        type: 'string' | 'date';
        nodeValue: string;
    };
};
/**
 * Parse a publicodes expression into an JSON object representing the AST.
 *
 * The parsing is done with the [nearley](https://nearley.js.org/) parser
 *
 * @param rawNode The expression to parse
 * @param dottedName The dottedName of the rule being parsed
 *
 * @returns The parsing result as a JSON object
 *
 * @throws A `SyntaxError` if the expression is invalid
 * @throws A `PublicodesInternalError` if the parser is unable to parse the expression
 *
 * @example
 * ```ts
 * parseExpression('20.3 * nombre', 'foo . bar')
 * // returns { "*": [ { constant: { type: "number", nodeValue: 20.3 } }, { variable:"nombre" } ] }
 * ```
 */
declare function parseExpression(rawNode: string, dottedName: string): ExprAST;

declare function serializeEvaluation(node: EvaluatedNode): string | undefined;

type Cache = {
    inversionFail?: boolean;
    _meta: {
        evaluationRuleStack: Array<string>;
        parentRuleStack: Array<string>;
        currentContexteSituation?: string;
    };
    /**
     * Every time we encounter a reference to a rule in an expression we add it
     * to the current Set of traversed variables. Because we evaluate the
     * expression graph “top to bottom” (ie. we start by the high-level goal and
     * recursively evaluate its dependencies), we need to handle rule
     * “boundaries”, so that when we “enter” in the evaluation of a dependency,
     * we start with a clear empty set of traversed variables. Then, when we go
     * back to the referencer rule, we need to add all to merge the two sets :
     * rules already traversed in the current expression and the one from the
     * reference.
     */
    traversedVariablesStack?: Array<Set<string>>;
    nodes: Map<PublicodesExpression | ASTNode, EvaluatedNode>;
};

type PublicodesExpression = string | Record<string, unknown> | number;
type Logger = {
    log(message: string): void;
    warn(message: string): void;
    error(message: string): void;
};
type Options = Partial<Pick<Context, 'logger' | 'getUnitKey' | 'allowOrphanRules'>>;
type EvaluationFunction<Kind extends NodeKind = NodeKind> = (this: Engine, node: ASTNode & {
    nodeKind: Kind;
}) => {
    nodeKind: Kind;
} & EvaluatedNode;
type ParsedRules<Name extends string> = Record<Name, RuleNode<Name>>;
declare class Engine<Name extends string = string> {
    baseContext: Context<Name>;
    context: Context<string>;
    publicParsedRules: ParsedRules<Name>;
    cache: Cache;
    subEngines: Array<Engine<Name>>;
    subEngineId: number | undefined;
    constructor(rules?: RawPublicodes<Name>, options?: Options);
    resetCache(): void;
    setSituation(situation?: Partial<Record<Name, PublicodesExpression | ASTNode>>, options?: {
        keepPreviousSituation?: boolean;
    }): this;
    inversionFail(): boolean;
    getRule(dottedName: Name): ParsedRules<Name>[Name];
    getParsedRules(): ParsedRules<Name>;
    evaluate(value: PublicodesExpression): EvaluatedNode;
    evaluateNode<T extends ASTNode>(parsedNode: T): EvaluatedNode & T;
    /**
     * Shallow Engine instance copy. Keeps references to the original Engine instance attributes.
     */
    shallowCopy(): Engine<Name>;
    private checkExperimentalRule;
}

export { ASTNode, EvaluatedNode, Evaluation, EvaluationFunction, ExprAST, Logger, ParsedRules, PublicodesError, PublicodesExpression, Rule, RuleNode, Unit, capitalise0, Engine as default, formatValue, isPublicodesError, parseExpression, parsePublicodes, parseUnit, reduceAST, serializeEvaluation, serializeUnit, simplifyNodeUnit, makeASTTransformer as transformAST, traverseASTNode, ruleUtils as utils };
