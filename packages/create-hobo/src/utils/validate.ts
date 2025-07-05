export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateProjectName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name cannot be empty' };
  }

  // Check for valid npm package name
  const validNameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!validNameRegex.test(name)) {
    return { 
      valid: false, 
      error: 'Project name must be lowercase, alphanumeric, and may contain hyphens' 
    };
  }

  // Check for reserved names
  const reserved = ['node_modules', 'favicon.ico'];
  if (reserved.includes(name)) {
    return { valid: false, error: 'This name is reserved' };
  }

  return { valid: true };
}