/**
 * Generate Documentation Tool
 *
 * Generates documentation comments in various styles (JSDoc, TSDoc, docstrings, XML docs)
 */
/**
 * Tool handler
 */
export declare function generateDocumentationTool(args: unknown): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
} | {
    isError: boolean;
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=generate.d.ts.map