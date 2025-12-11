---
name: extract-cmpt
description: Extract selected code into a new React component
---

Extract the selected code into a new reusable React component:

1. Analyze the selected code and determine:
   - Appropriate component name (PascalCase)
   - Required props based on dynamic values
   - TypeScript interface for props
   - Imports needed

2. Create the component file in an appropriate location:
   - Follow project structure (src/components/...). Ask if you need. Suggest one that i can validate or change
   - Use TypeScript
   - Include proper types
   - Add JSDoc if needed

3. Replace the selected code with the component import and usage

4. Format with proper props and maintain functionality
