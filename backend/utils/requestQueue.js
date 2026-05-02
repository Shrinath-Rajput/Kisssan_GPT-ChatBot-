// Request queue to prevent overwhelming the Gemini API with concurrent requests
// Ensures requests are processed sequentially or with controlled concurrency

class RequestQueue {
  constructor(maxConcurrent = 1) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async execute(fn) {
    // Wait until we have capacity
    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => {
        this.queue.push(resolve);
      });
    }

    this.running++;
    console.log(`📊 Request queue: ${this.running}/${this.maxConcurrent} concurrent`);

    try {
      return await fn();
    } finally {
      this.running--;
      
      // Process next queued request
      const resolve = this.queue.shift();
      if (resolve) {
        resolve();
      }
    }
  }

  getStatus() {
    return {
      running: this.running,
      maxConcurrent: this.maxConcurrent,
      queued: this.queue.length,
      totalWaiting: this.queue.length + Math.max(0, this.running - this.maxConcurrent)
    };
  }
}

// Create a global instance for Gemini API requests
export const geminiRequestQueue = new RequestQueue(1); // Allow only 1 concurrent Gemini API request
