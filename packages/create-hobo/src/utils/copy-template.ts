import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function copyTemplate(template: string, destination: string): Promise<void> {
  const templatePath = path.join(__dirname, '..', '..', 'templates', template);
  
  // Check if template exists
  try {
    await fs.access(templatePath);
  } catch (error) {
    throw new Error(`Template "${template}" not found`);
  }

  // Copy template files
  await fse.copy(templatePath, destination, {
    filter: (src: string) => {
      // Skip node_modules and .git
      const basename = path.basename(src);
      return !['node_modules', '.git', '.next', 'dist', '.turbo'].includes(basename);
    }
  });
}