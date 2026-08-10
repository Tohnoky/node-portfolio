describe('Node.js Environment Tests', () => {
  test('Node.js is running', () => {
    expect(true).toBe(true);
  });

  test('Math works correctly', () => {
    expect(1 + 1).toBe(2);
    expect(10 * 5).toBe(50);
  });

  test('Environment variables can be read', () => {
    process.env.TEST_VAR = 'devops';
    expect(process.env.TEST_VAR).toBe('devops');
  });

  test('JSON parsing works correctly', () => {
    const appInfo = { 
      version: '1.0.0', 
      environment: 'test',
      features: ['healthcheck', 'version', 'redis']
    };
    const json = JSON.stringify(appInfo);
    const parsed = JSON.parse(json);
    
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.features).toContain('healthcheck');
    expect(parsed.features.length).toBe(3);
  });

  test('Array operations work', () => {
    const services = ['app', 'redis', 'nginx'];
    expect(services).toHaveLength(3);
    expect(services).toContain('redis');
  });
});
