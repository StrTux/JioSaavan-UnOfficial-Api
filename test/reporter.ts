import fs from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  time: number;
  errorStack?: string;
}

interface SuiteResult {
  name: string;
  tests: TestResult[];
  suites: SuiteResult[];
  time: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

interface FinalReport {
  timestamp: string;
  totalSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  time: number;
  suites: SuiteResult[];
}

class JSONReporter {
  private report: FinalReport;
  private currentSuite: SuiteResult[];
  private startTime: number;
  private outputFile: string;

  constructor() {
    this.outputFile = path.join(process.cwd(), 'test-results.json');
    this.report = {
      timestamp: new Date().toISOString(),
      totalSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      time: 0,
      suites: []
    };
    this.currentSuite = [];
    this.startTime = Date.now();
  }

  onTestStart(test: any) {
    // Track test start
    console.log(`Running test: ${test.name}`);
  }

  onTestEnd(test: any, result: any) {
    if (!this.currentSuite.length) {
      return;
    }

    const currentSuite = this.getCurrentSuite();
    const testResult: TestResult = {
      name: test.name,
      success: !result.failed,
      time: result.duration || 0,
    };

    if (result.failed) {
      testResult.error = result.error?.message || 'Test failed';
      testResult.errorStack = result.error?.stack;
    }

    currentSuite.tests.push(testResult);

    if (!result.failed) {
      currentSuite.passedTests++;
      this.report.passedTests++;
    } else {
      currentSuite.failedTests++;
      this.report.failedTests++;
    }

    this.report.totalTests++;
    currentSuite.totalTests++;
  }

  onSuiteStart(suite: any) {
    const newSuite: SuiteResult = {
      name: suite.name || 'Unnamed Suite',
      tests: [],
      suites: [],
      time: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    };

    if (this.currentSuite.length === 0) {
      this.report.suites.push(newSuite);
    } else {
      this.getCurrentSuite().suites.push(newSuite);
    }

    this.currentSuite.push(newSuite);
    this.report.totalSuites++;
  }

  onSuiteEnd(suite: any) {
    if (!this.currentSuite.length) {
      return;
    }

    const currentSuite = this.getCurrentSuite();
    currentSuite.time = Date.now() - this.startTime;
    this.currentSuite.pop();
  }

  private getCurrentSuite(): SuiteResult {
    return this.currentSuite[this.currentSuite.length - 1];
  }

  onRunEnd() {
    this.report.time = Date.now() - this.startTime;
    
    try {
      // Create results directory if it doesn't exist
      const resultsDir = path.dirname(this.outputFile);
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      // Write the report
      fs.writeFileSync(
        this.outputFile,
        JSON.stringify(this.report, null, 2),
        'utf8'
      );

      console.log(`\nTest results saved to: ${this.outputFile}`);
      console.log(`Total Tests: ${this.report.totalTests}`);
      console.log(`Passed: ${this.report.passedTests}`);
      console.log(`Failed: ${this.report.failedTests}`);
      console.log(`Time: ${this.report.time}ms`);
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  }
}

export default {
  name: 'json',
  reporter: JSONReporter
}; 