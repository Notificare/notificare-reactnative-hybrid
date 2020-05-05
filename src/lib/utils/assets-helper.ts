import { DemoSourceConfig } from './storage';

export async function fetchDemoSourceConfig(url: string): Promise<DemoSourceConfig> {
  const response = await fetch(url);
  return await response.json();
}

export async function fetchString(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}
