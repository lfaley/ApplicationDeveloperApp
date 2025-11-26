/**
 * Analyze Code Tool
 *
 * Parses source code and extracts structural information including functions,
 * classes, interfaces, and their documentation status.
 */
/**
 * Main tool handler
 */
export declare function analyzeCodeTool(args: unknown): Promise<{
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
//# sourceMappingURL=analyze.d.ts.map