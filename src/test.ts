import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
}

async function testHealthCheck(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();

    if (response.ok && data.status === 'ok') {
      return {
        name: 'Health Check',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Health Check',
      success: false,
      duration: Date.now() - start,
      error: 'Invalid response format',
    };
  } catch (error) {
    return {
      name: 'Health Check',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testBot(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Say "Hello, World!" in exactly those words.',
      }),
    });

    const data = await response.json();

    if (response.ok && data.response) {
      return {
        name: 'Bot Endpoint',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Bot Endpoint',
      success: false,
      duration: Date.now() - start,
      error: data.error || 'Invalid response format',
    };
  } catch (error) {
    return {
      name: 'Bot Endpoint',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testBotSummary(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Summarize this page: https://example.com',
        bot: 'summary',
      }),
    });

    const data = await response.json();

    if (response.ok && data.response) {
      return {
        name: 'Bot Summary',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Bot Summary',
      success: false,
      duration: Date.now() - start,
      error: data.error || 'Invalid response format',
    };
  } catch (error) {
    return {
      name: 'Bot Summary',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testBotStream(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/bot/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Count from 1 to 3.',
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        name: 'Bot Stream',
        success: false,
        duration: Date.now() - start,
        error: data.error || 'Request failed',
      };
    }

    if (!response.body) {
      return {
        name: 'Bot Stream',
        success: false,
        duration: Date.now() - start,
        error: 'No response body',
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedChunks = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          receivedChunks++;
        }
      }
    }

    if (receivedChunks > 0) {
      return {
        name: 'Bot Stream',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Bot Stream',
      success: false,
      duration: Date.now() - start,
      error: 'No chunks received',
    };
  } catch (error) {
    return {
      name: 'Bot Stream',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testBotStreamSummary(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/bot/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Summarize this: https://example.com',
        bot: 'summary',
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        name: 'Bot Stream Summary',
        success: false,
        duration: Date.now() - start,
        error: data.error || 'Request failed',
      };
    }

    if (!response.body) {
      return {
        name: 'Bot Stream Summary',
        success: false,
        duration: Date.now() - start,
        error: 'No response body',
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedChunks = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          receivedChunks++;
        }
      }
    }

    if (receivedChunks > 0) {
      return {
        name: 'Bot Stream Summary',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Bot Stream Summary',
      success: false,
      duration: Date.now() - start,
      error: 'No chunks received',
    };
  } catch (error) {
    return {
      name: 'Bot Stream Summary',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testConversation(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/bot/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'My name is Alice.' },
          { role: 'assistant', content: 'Nice to meet you, Alice!' },
          { role: 'user', content: 'What is my name?' },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok && data.response) {
      return {
        name: 'Conversation',
        success: true,
        duration: Date.now() - start,
      };
    }

    return {
      name: 'Conversation',
      success: false,
      duration: Date.now() - start,
      error: data.error || 'Invalid response format',
    };
  } catch (error) {
    return {
      name: 'Conversation',
      success: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runTests() {
  console.log('🧪 Running API Tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const tests = [
    testHealthCheck,
    testBot,
    testBotSummary,
    testBotStream,
    testBotStreamSummary,
    testConversation,
  ];

  const results: TestResult[] = [];

  for (const test of tests) {
    process.stdout.write(`Running ${test.name}... `);
    const result = await test();
    results.push(result);

    if (result.success) {
      console.log(`✅ PASSED (${result.duration}ms)`);
    } else {
      console.log(`❌ FAILED (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(0);

  console.log(`\n📊 Results: ${passed}/${total} tests passed (${passRate}%)`);

  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

runTests();
