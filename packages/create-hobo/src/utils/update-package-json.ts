import path from 'path';
import { promises as fs } from 'fs';

export async function updatePackageJson(projectPath: string, projectName: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    
    // Update the name field
    packageJson.name = projectName;
    
    // Remove version if it exists (for root package.json)
    if (packageJson.version === '0.1.0' && !packageJson.private) {
      packageJson.version = '0.1.0';
      packageJson.private = true;
    }
    
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );
  } catch (error) {
    // If package.json doesn't exist or can't be updated, that's okay
    // Some templates might not have a root package.json
  }

  // Also update package.json files in apps if they exist
  const appsToUpdate = ['apps/web/package.json', 'apps/api/package.json'];
  
  for (const appPath of appsToUpdate) {
    const fullPath = path.join(projectPath, appPath);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      // Update workspace references if needed
      if (packageJson.name === 'web') {
        packageJson.name = `@${projectName}/web`;
      } else if (packageJson.name === 'api') {
        packageJson.name = `@${projectName}/api`;
      }
      
      await fs.writeFile(
        fullPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf-8'
      );
    } catch (error) {
      // Skip if file doesn't exist
    }
  }
}