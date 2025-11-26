export interface CodeSignature {
    name: string;
    type: 'function' | 'class';
    params?: string[];
    returnType?: string;
    filePath: string;
}
export interface DocReference {
    name: string;
    type: 'function' | 'class';
    filePath: string;
    description?: string;
}
export interface ContentAnalysisResult {
    matched: Array<{
        code: CodeSignature;
        doc: DocReference;
    }>;
    mismatches: Array<{
        code?: CodeSignature;
        doc?: DocReference;
        reason: string;
    }>;
    missingDocs: CodeSignature[];
    orphanedDocs: DocReference[];
}
export declare class ContentAnalyzer {
    /**
     * Extracts function and class signatures from a code file (basic regex-based for now).
     */
    extractSignatures(filePath: string): Promise<CodeSignature[]>;
    /**
     * Parses documentation file for code references (basic markdown parsing).
     */
    extractDocReferences(filePath: string): Promise<DocReference[]>;
    /**
     * Matches documented items with actual code and identifies mismatches/inconsistencies.
     */
    matchCodeWithDocs(code: CodeSignature[], docs: DocReference[]): ContentAnalysisResult;
}
//# sourceMappingURL=content-analyzer.d.ts.map