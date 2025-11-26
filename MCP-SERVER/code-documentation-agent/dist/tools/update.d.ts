/**
 * Update Comments Tool
 *
 * Updates source code files by inserting or replacing documentation comments
 */
/**
 * Tool handler
 */
export declare function updateCommentsTool(args: unknown): Promise<{
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
//# sourceMappingURL=update.d.ts.map