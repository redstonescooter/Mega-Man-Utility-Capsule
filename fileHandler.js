import { promises as fs } from 'node:fs';
import path from 'node:path';

export class FileHandler {
  constructor() {
    if (FileHandler.instance) {
      return FileHandler.instance;
    }

    this.activeOperations = new Map(); // Track ongoing operations per file
    this.fileLocks = new Map(); // Simple lock mechanism
    FileHandler.instance = this;
  }

  // Get singleton instance
  static getInstance() {
    if (!FileHandler.instance) {
      FileHandler.instance = new FileHandler();
    }
    return FileHandler.instance;
  }

  // Create a lock for a specific file
  async acquireLock(filePath) {
    const normalizedPath = path.resolve(filePath);

    while (this.fileLocks.has(normalizedPath)) {
      // Wait for existing lock to be released
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    this.fileLocks.set(normalizedPath, true);
    return normalizedPath;
  }

  // Release lock for a specific file
  releaseLock(filePath) {
    const normalizedPath = path.resolve(filePath);
    this.fileLocks.delete(normalizedPath);
  }

  // Safe read operation
  async readFile(filePath, options = 'utf8') {
    const lockedPath = await this.acquireLock(filePath);

    try {
      const data = await fs.readFile(lockedPath, options);
      return data;
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    } finally {
      this.releaseLock(lockedPath);
    }
  }

  // Safe write operation
  async writeFile(filePath, data, options = 'utf8') {
    const lockedPath = await this.acquireLock(filePath);

    try {
      await fs.writeFile(lockedPath, data, options);
      return true;
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    } finally {
      this.releaseLock(lockedPath);
    }
  }

  // Safe append operation
  async appendFile(filePath, data, options = 'utf8') {
    const lockedPath = await this.acquireLock(filePath);

    try {
      await fs.appendFile(lockedPath, data, options);
      return true;
    } catch (error) {
      throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
    } finally {
      this.releaseLock(lockedPath);
    }
  }

  // Check if file exists
  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Ensure directory exists
  async ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return true;
    } catch (error) {
      throw new Error(
        `Failed to create directory ${dirPath}: ${error.message}`
      );
    }
  }

  // Safe JSON read
  async readJSON(filePath) {
    const data = await this.readFile(filePath);
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(
        `Failed to parse JSON from ${filePath}: ${error.message}`
      );
    }
  }

  // Safe JSON write
  async writeJSON(filePath, obj, space = 2) {
    try {
      const data = JSON.stringify(obj, null, space);
      return await this.writeFile(filePath, data);
    } catch (error) {
      throw new Error(`Failed to write JSON to ${filePath}: ${error.message}`);
    }
  }

  // Get file stats
  async getStats(filePath) {
    const lockedPath = await this.acquireLock(filePath);

    try {
      const stats = await fs.stat(lockedPath);
      return stats;
    } catch (error) {
      throw new Error(`Failed to get stats for ${filePath}: ${error.message}`);
    } finally {
      this.releaseLock(lockedPath);
    }
  }

  // Copy file safely
  async copyFile(source, destination) {
    const sourceLock = await this.acquireLock(source);
    const destLock = await this.acquireLock(destination);

    try {
      await fs.copyFile(sourceLock, destLock);
      return true;
    } catch (error) {
      throw new Error(
        `Failed to copy ${source} to ${destination}: ${error.message}`
      );
    } finally {
      this.releaseLock(sourceLock);
      this.releaseLock(destLock);
    }
  }

  // Delete file safely
  async deleteFile(filePath) {
    const lockedPath = await this.acquireLock(filePath);

    try {
      await fs.unlink(lockedPath);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
    } finally {
      this.releaseLock(lockedPath);
    }
  }
}

// Export singleton instance
export default FileHandler.getInstance();

// Usage example:
/*
const fileHandler = require('./fileHandler');

async function example() {
  try {
    // Write some data
    await fileHandler.writeFile('test.txt', 'Hello World!');
    
    // Read it back
    const content = await fileHandler.readFile('test.txt');
    console.log('Content:', content);
    
    // Work with JSON
    await fileHandler.writeJSON('data.json', { name: 'John', age: 30 });
    const jsonData = await fileHandler.readJSON('data.json');
    console.log('JSON:', jsonData);
    
    // Multiple operations won't conflict
    const promises = [
      fileHandler.appendFile('test.txt', '\nLine 2'),
      fileHandler.appendFile('test.txt', '\nLine 3'),
      fileHandler.appendFile('test.txt', '\nLine 4')
    ];
    
    await Promise.all(promises);
    console.log('Final content:', await fileHandler.readFile('test.txt'));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uncomment to run example
// example();
*/
