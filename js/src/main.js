import * as fs from 'node:fs';
import { Dependency } from './Dependency.js';

// ~~~ File I/O ~~~

const TODOS_FILE_PATH = 'todos.json';

export const todoFileDependency = new Dependency('TodoFileDependency');

const writeToTodoFile = todoFileDependency.define('writeToTodoFile', async data => {
  await fs.promises.writeFile(TODOS_FILE_PATH, JSON.stringify(data), 'utf-8');
});

const readFromTodoFile = todoFileDependency.define('readFromTodoFile', async () => {
  try {
    return JSON.parse(await fs.promises.readFile(TODOS_FILE_PATH, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') { // File not found
      return [];
    }
    throw error;
  }
});

// ~~~ logging ~~~

export const loggerDependency = new Dependency('LoggerDependency');

const log = loggerDependency.define('log', console.log);

// ~~~ main ~~~

// Usage example: main(process.argv.slice(2));
export async function main(args) {
  // Adds the todo item to the list
  const updatedTodoItems = [
    ...await readFromTodoFile(),
    args.join(' '),
  ];

  await writeToTodoFile(updatedTodoItems);

  // Prints the updated list of TODO items
  log(updatedTodoItems.join('\n'));
}
