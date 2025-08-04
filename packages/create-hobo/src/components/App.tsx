import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { createProject } from '../utils/create-project.js';
import { validateProjectName } from '../utils/validate.js';

type Step = 'projectName' | 'packageManager' | 'template' | 'creating' | 'done';

interface ProjectConfig {
  name: string;
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  template: 'full-stack' | 'minimal' | 'api-only';
}

export const App: React.FC = () => {
  const [step, setStep] = useState<Step>('projectName');
  const [config, setConfig] = useState<Partial<ProjectConfig>>({});
  const [error, setError] = useState<string>('');
  const [projectNameInput, setProjectNameInput] = useState<string>('');

  const handleProjectName = (value: string) => {
    const validation = validateProjectName(value);
    if (validation.valid) {
      setConfig({ ...config, name: value });
      setStep('packageManager');
      setError('');
    } else {
      setError(validation.error || 'Invalid project name');
    }
  };

  const packageManagers = [
    { label: 'pnpm (recommended)', value: 'pnpm' },
    { label: 'npm', value: 'npm' },
    { label: 'yarn', value: 'yarn' },
    { label: 'bun', value: 'bun' },
  ];

  const templates = [
    { label: 'Full Stack (Next.js + tRPC + Drizzle)', value: 'full-stack' },
    { label: 'Minimal (Next.js only)', value: 'minimal' },
    { label: 'API Only (tRPC + Drizzle)', value: 'api-only' },
  ];

  const handlePackageManager = (item: { value: string }) => {
    setConfig({ ...config, packageManager: item.value as ProjectConfig['packageManager'] });
    setStep('template');
  };

  const handleTemplate = async (item: { value: string }) => {
    const finalConfig = {
      ...config,
      template: item.value as ProjectConfig['template'],
    } as ProjectConfig;
    
    setConfig(finalConfig);
    setStep('creating');

    try {
      await createProject(finalConfig);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setStep('projectName');
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🚀 Create Hobo App
        </Text>
      </Box>

      {step === 'projectName' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text>What is your project named?</Text>
          </Box>
          <TextInput
            value={projectNameInput}
            onChange={setProjectNameInput}
            onSubmit={handleProjectName}
            placeholder="my-hobo-app"
          />
          {error && (
            <Box marginTop={1}>
              <Text color="red">⚠ {error}</Text>
            </Box>
          )}
        </Box>
      )}

      {step === 'packageManager' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text>Which package manager would you like to use?</Text>
          </Box>
          <SelectInput items={packageManagers} onSelect={handlePackageManager} />
        </Box>
      )}

      {step === 'template' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text>Which template would you like to use?</Text>
          </Box>
          <SelectInput items={templates} onSelect={handleTemplate} />
        </Box>
      )}

      {step === 'creating' && (
        <Box>
          <Text color="green">
            <Spinner type="dots" /> Creating your project...
          </Text>
        </Box>
      )}

      {step === 'done' && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text color="green">✓ Project created successfully!</Text>
          </Box>
          <Box flexDirection="column" marginLeft={2}>
            <Text>Next steps:</Text>
            <Text color="gray">  cd {config.name}</Text>
            <Text color="gray">  {config.packageManager} install</Text>
            <Text color="gray">  {config.packageManager} dev</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};