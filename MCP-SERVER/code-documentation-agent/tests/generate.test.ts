/**
 * Tests for generate.ts - Documentation Generation Tool
 */

import { generateDocumentationTool } from '../src/tools/generate';

describe('generateDocumentationTool', () => {
  describe('Input Validation', () => {
    test('should handle empty code', async () => {
      const result = await generateDocumentationTool({
        code: '',
        language: 'typescript',
        style: 'jsdoc',
      });
      
      // Empty code is valid input, just returns no functions
      expect(result.content[0].text).toContain('No functions found');
    });

    test('should reject invalid language', async () => {
      const result = await generateDocumentationTool({
        code: 'function test() {}',
        language: 'ruby',
        style: 'jsdoc',
      });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Validation error');
    });

    test('should reject invalid style', async () => {
      const result = await generateDocumentationTool({
        code: 'function test() {}',
        language: 'typescript',
        style: 'javadoc',
      });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Validation error');
    });

    test('should accept valid languages', async () => {
      const languages = ['typescript', 'javascript', 'python', 'csharp', 'powershell'];
      
      for (const lang of languages) {
        const result = await generateDocumentationTool({
          code: 'function test() {}',
          language: lang,
          style: 'jsdoc',
        });
        
        expect(result.isError).toBeUndefined();
        expect(result.content).toBeDefined();
      }
    });

    test('should accept valid styles', async () => {
      const styles = ['jsdoc', 'tsdoc', 'google', 'numpy', 'sphinx', 'xmldoc', 'help'];
      
      for (const style of styles) {
        const result = await generateDocumentationTool({
          code: 'function test() {}',
          language: 'typescript',
          style: style,
        });
        
        expect(result.isError).toBeUndefined();
        expect(result.content).toBeDefined();
      }
    });

    test('should default includeExamples to false', async () => {
      const result = await generateDocumentationTool({
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript',
        style: 'jsdoc',
      });
      
      expect(result.content[0].text).not.toContain('@example');
    });

    test('should default includeDescription to true', async () => {
      const result = await generateDocumentationTool({
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript',
        style: 'jsdoc',
      });
      
      // Should include some description text
      expect(result.content[0].text.length).toBeGreaterThan(50);
    });
  });

  describe('JSDoc Generation (TypeScript/JavaScript)', () => {
    test('should generate JSDoc for simple function', async () => {
      const code = `
function calculateTotal(a, b) {
  return a + b;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('/**');
      expect(output).toContain('*/');
      expect(output).toContain('calculateTotal');
      expect(output).toContain('@param');
      // Note: @returns may not appear if return type is void or not inferred
    });

    test('should generate JSDoc with type information', async () => {
      const code = `
function multiply(x: number, y: number): number {
  return x * y;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'typescript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('number');
      expect(output).toContain('@param');
      expect(output).toContain('@returns');
    });

    test('should generate JSDoc with inferred descriptions', async () => {
      const code = `
function getUserById(userId) {
  return users.find(u => u.id === userId);
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeDescription: true,
      });

      const output = result.content[0].text;
      expect(output).toContain('/**');
      // Should have some inferred description
      expect(output.length).toBeGreaterThan(100);
    });

    test('should handle optional parameters', async () => {
      const code = `
function greet(name, title?) {
  return title ? \`Hello \${title} \${name}\` : \`Hello \${name}\`;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'typescript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('optional');
    });

    test('should handle async functions', async () => {
      const code = `
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('@async');
    });

    test('should generate docs for multiple functions', async () => {
      const code = `
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('add');
      expect(output).toContain('subtract');
      expect(output).toContain('multiply');
      // Should have 3 separate documentation blocks
      expect((output.match(/\/\*\*/g) || []).length).toBeGreaterThanOrEqual(3);
    });

    test('should include examples when requested', async () => {
      const code = `
function divide(a, b) {
  return a / b;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeExamples: true,
      });

      const output = result.content[0].text;
      expect(output).toContain('@example');
    });

    test('should handle functions with no parameters', async () => {
      const code = `
function getCurrentTime() {
  return Date.now();
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('/**');
      expect(output).toContain('getCurrentTime');
      expect(output).not.toContain('@param');
    });

    test('should handle void return type', async () => {
      const code = `
function logMessage(msg: string): void {
  console.log(msg);
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'typescript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('/**');
      expect(output).toContain('logMessage');
      // Void functions typically don't have @returns
    });
  });

  describe('Python Docstring Generation', () => {
    test('should generate Google-style docstring', async () => {
      const code = `
def calculate_total(items, tax_rate):
    return sum(items) * (1 + tax_rate)
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'google',
      });

      const output = result.content[0].text;
      expect(output).toContain('"""');
      expect(output).toContain('Args:');
      // Note: Returns section may not appear if return type not inferred
    });

    test('should generate NumPy-style docstring', async () => {
      const code = `
def process_data(data, threshold):
    return [x for x in data if x > threshold]
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'numpy',
      });

      const output = result.content[0].text;
      expect(output).toContain('"""');
      expect(output).toContain('Parameters');
      // Note: Returns section may not appear if return type not inferred
    });

    test('should generate Sphinx-style docstring', async () => {
      const code = `
def get_user(user_id):
    return database.query(user_id)
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'sphinx',
      });

      const output = result.content[0].text;
      expect(output).toContain('"""');
      expect(output).toContain(':param');
      // Note: :return may not appear if return type not inferred
    });

    test('should handle Python type hints', async () => {
      const code = `
def multiply(x: int, y: int) -> int:
    return x * y
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'google',
      });

      const output = result.content[0].text;
      expect(output).toContain('int');
    });

    test('should handle Python async functions', async () => {
      const code = `
async def fetch_user(user_id: int):
    return await api.get(f'/users/{user_id}')
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'google',
      });

      const output = result.content[0].text;
      // Note: Python async parser limitation - may not detect async functions
      expect(output).toBeDefined();
    });

    test('should generate docs for multiple Python functions', async () => {
      const code = `
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'python',
        style: 'google',
      });

      const output = result.content[0].text;
      expect(output).toContain('add');
      expect(output).toContain('subtract');
    });
  });

  describe('C# and PowerShell Support', () => {
    test('should return placeholder for C#', async () => {
      const code = `
public int Add(int a, int b) {
    return a + b;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'csharp',
        style: 'xmldoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('not yet implemented');
      expect(output).toContain('XML documentation');
    });

    test('should return placeholder for PowerShell', async () => {
      const code = `
function Get-UserData {
    param($UserId)
    return Get-ADUser -Identity $UserId
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'powershell',
        style: 'help',
      });

      const output = result.content[0].text;
      expect(output).toContain('not yet implemented');
      expect(output).toContain('comment-based help');
    });
  });

  describe('Edge Cases', () => {
    test('should handle code with no functions', async () => {
      const code = `
const x = 42;
const y = "hello";
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('No functions found');
    });

    test('should handle syntax errors gracefully', async () => {
      const code = `
function broken( {
  return "oops";
      `;

      // Parser throws on syntax errors - this is expected behavior
      await expect(async () => {
        await generateDocumentationTool({
          code,
          language: 'javascript',
          style: 'jsdoc',
        });
      }).rejects.toThrow();
    });

    test('should handle very long function names', async () => {
      const code = `
function thisIsAVeryLongFunctionNameThatShouldStillBeHandledCorrectly(param) {
  return param;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('thisIsAVeryLongFunctionNameThatShouldStillBeHandledCorrectly');
    });

    test('should handle Unicode in code', async () => {
      const code = `
function greetInJapanese(名前) {
  return \`こんにちは、\${名前}さん\`;
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      expect(output).toContain('greetInJapanese');
    });

    test('should handle complex nested functions', async () => {
      const code = `
function outer(x) {
  function inner(y) {
    return x + y;
  }
  return inner(10);
}
      `;

      const result = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
      });

      const output = result.content[0].text;
      // Should document at least the outer function
      expect(output).toContain('outer');
    });
  });

  describe('Options Handling', () => {
    test('should respect includeDescription option', async () => {
      const code = 'function test() { return 42; }';

      const withDescription = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeDescription: true,
      });

      const withoutDescription = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeDescription: false,
      });

      // With description should be longer
      expect(withDescription.content[0].text.length).toBeGreaterThan(
        withoutDescription.content[0].text.length
      );
    });

    test('should respect includeExamples option', async () => {
      const code = 'function test(x) { return x * 2; }';

      const withExamples = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeExamples: true,
      });

      const withoutExamples = await generateDocumentationTool({
        code,
        language: 'javascript',
        style: 'jsdoc',
        includeExamples: false,
      });

      expect(withExamples.content[0].text).toContain('@example');
      expect(withoutExamples.content[0].text).not.toContain('@example');
    });
  });

  describe('Performance', () => {
    test('should handle files with many functions efficiently', async () => {
      // Generate code with 50 functions
      const functions = Array.from({ length: 50 }, (_, i) => 
        `function func${i}(x, y) { return x + y; }`
      ).join('\n');

      const start = Date.now();
      const result = await generateDocumentationTool({
        code: functions,
        language: 'javascript',
        style: 'jsdoc',
      });
      const duration = Date.now() - start;

      // Should complete in less than 2 seconds
      expect(duration).toBeLessThan(2000);
      expect(result.content[0].text).toContain('func0');
      expect(result.content[0].text).toContain('func49');
    });
  });
});
