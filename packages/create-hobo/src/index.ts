#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './components/App.js';

// Check if we're in a TTY environment
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Error: create-hobo requires an interactive terminal environment.');
  console.error('Please run this command directly in your terminal, not through pipes or scripts.');
  process.exit(1);
}

render(React.createElement(App));