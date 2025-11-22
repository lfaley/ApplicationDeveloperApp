/**
 * Content Analyzer
 * ----------------
 * Extracts function/class signatures from code, parses documentation for code references,
 * matches documented items with actual code, and identifies mismatches/inconsistencies.
 */
import * as fs from 'fs/promises';
import * as path from 'path';

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
  matched: Array<{ code: CodeSignature; doc: DocReference }>;
  mismatches: Array<{ code?: CodeSignature; doc?: DocReference; reason: string }>;
  missingDocs: CodeSignature[];
  orphanedDocs: DocReference[];
}

export class ContentAnalyzer {
  /**
   * Extracts function and class signatures from a code file (basic regex-based for now).
   */
  async extractSignatures(filePath: string): Promise<CodeSignature[]> {
    const ext = path.extname(filePath);
    if (!['.ts', '.js', '.tsx', '.jsx'].includes(ext)) return [];
    const content = await fs.readFile(filePath, 'utf8');
    const signatures: CodeSignature[] = [];

    // Function declarations
    const funcRegex = /function\s+(\w+)\s*\(([^)]*)\)\s*(:\s*([\w\[\]]+))?/g;
    let match;
    while ((match = funcRegex.exec(content))) {
      signatures.push({
        name: match[1],
        type: 'function',
        params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
        returnType: match[4] || undefined,
        filePath,
      });
    }

    // Class declarations
    const classRegex = /class\s+(\w+)/g;
    while ((match = classRegex.exec(content))) {
      signatures.push({
        name: match[1],
        type: 'class',
        filePath,
      });
    }

    return signatures;
  }

  /**
   * Parses documentation file for code references (basic markdown parsing).
   */
  async extractDocReferences(filePath: string): Promise<DocReference[]> {
    if (!filePath.endsWith('.md')) return [];
    const content = await fs.readFile(filePath, 'utf8');
    const references: DocReference[] = [];

    // Markdown code reference pattern: `functionName` or ClassName
    const codeRefRegex = /`(\w+)`|\bclass\s+(\w+)/g;
    let match;
    while ((match = codeRefRegex.exec(content))) {
      if (match[1]) {
        references.push({ name: match[1], type: 'function', filePath });
      } else if (match[2]) {
        references.push({ name: match[2], type: 'class', filePath });
      }
    }

    // Optionally extract descriptions (first line after reference)
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const funcMatch = line.match(/`(\w+)`/);
      if (funcMatch && lines[i + 1]) {
        references.push({
          name: funcMatch[1],
          type: 'function',
          filePath,
          description: lines[i + 1].trim(),
        });
      }
    }

    return references;
  }

  /**
   * Matches documented items with actual code and identifies mismatches/inconsistencies.
   */
  matchCodeWithDocs(code: CodeSignature[], docs: DocReference[]): ContentAnalysisResult {
    const matched: Array<{ code: CodeSignature; doc: DocReference }> = [];
    const mismatches: Array<{ code?: CodeSignature; doc?: DocReference; reason: string }> = [];
    const missingDocs: CodeSignature[] = [];
    const orphanedDocs: DocReference[] = [];

    for (const codeSig of code) {
      const docRef = docs.find(d => d.name === codeSig.name && d.type === codeSig.type);
      if (docRef) {
        matched.push({ code: codeSig, doc: docRef });
        // Optionally check for param/return mismatches
        if (codeSig.type === 'function' && docRef.description) {
          // Simple check: if param count doesn't match, flag as mismatch
          const paramCount = codeSig.params?.length || 0;
          if (docRef.description.includes('Parameters:')) {
            const docParamCount = (docRef.description.match(/Parameters:/g) || []).length;
            if (paramCount !== docParamCount) {
              mismatches.push({ code: codeSig, doc: docRef, reason: 'Parameter count mismatch' });
            }
          }
        }
      } else {
        missingDocs.push(codeSig);
      }
    }

    for (const docRef of docs) {
      const codeSig = code.find(c => c.name === docRef.name && c.type === docRef.type);
      if (!codeSig) {
        orphanedDocs.push(docRef);
      }
    }

    return { matched, mismatches, missingDocs, orphanedDocs };
  }
}

// End of ContentAnalyzer
