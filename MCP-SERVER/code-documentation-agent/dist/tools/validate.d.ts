/**
 * Validate Documentation Tool
 *
 * Validates that code has proper documentation coverage and quality
 */
/**
 * Tool handler
 */
export declare function validateDocumentationTool(args: unknown): Promise<{
    isError: boolean;
    content: {
        type: string;
        text: string;
    }[];
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
}>;
//# sourceMappingURL=validate.d.ts.map