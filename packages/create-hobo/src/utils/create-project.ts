import path from 'path';
import { promises as fs } from 'fs';
import { execa } from 'execa';
import { copyTemplate } from './copy-template.js';
import { updatePackageJson } from './update-package-json.js';

interface ProjectConfig {
  name: string;
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  template: 'full-stack' | 'minimal' | 'api-only';
}

export async function createProject(config: ProjectConfig): Promise<void> {
  const projectPath = path.join(process.cwd(), config.name);

  // Check if directory already exists
  try {
    await fs.access(projectPath);
    throw new Error(`Directory ${config.name} already exists`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Create project directory
  await fs.mkdir(projectPath, { recursive: true });

  // Copy template files
  await copyTemplate(config.template, projectPath);

  // Update package.json with project name
  await updatePackageJson(projectPath, config.name);

  // Initialize git repository
  try {
    await execa('git', ['init'], { cwd: projectPath });
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa('git', ['commit', '-m', 'Initial commit from create-hobo'], { cwd: projectPath });
  } catch (error) {
    // Git init is optional, don't fail if it doesn't work
  }

  // Create .env file from .env.example if it exists
  try {
    const envExamplePath = path.join(projectPath, '.env.example');
    const envPath = path.join(projectPath, '.env');
    await fs.copyFile(envExamplePath, envPath);
  } catch (error) {
    // .env creation is optional
  }
}