import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Dependency } from './Dependency.ts';
import { main, loggerDependency, todoFileDependency, type TodoFileDependency, type LoggerDependency } from './main.ts';

beforeEach(() => {
  Dependency.beforeEach();
});

export class TodoFileFake implements TodoFileDependency {
  #contents: string[] = [];

  async writeToTodoFile(data: string[]) {
    this.#contents = data;
  }

  async readFromTodoFile() {
    return this.#contents;
  }
}

export class LoggerFake implements LoggerDependency {
  logged = '';
  log(...messages: string[]) {
    this.logged += messages.join(' ') + '\n';
  }
}

function initialize() {
  const testDoubles = {
    todoFile: new TodoFileFake(),
    logger: new LoggerFake(),
  };

  todoFileDependency.replaceWith(testDoubles.todoFile);
  loggerDependency.replaceWith(testDoubles.logger);

  return testDoubles;
}

await describe('main()', async () => {
  await test('adds a new todo item to the todo list file', async () => {
    const testDoubles = initialize();

    // Add some initial TODO items to the list
    await testDoubles.todoFile.writeToTodoFile(['item 1', 'item 2']);

    await main(['item', '3']);

    assert.deepEqual(await testDoubles.todoFile.readFromTodoFile(), [
      'item 1',
      'item 2',
      'item 3',
    ]);
  });

  await test('Prints the updated list of todo items', async () => {
    const testDoubles = initialize();

    // Add some initial TODO items to the list
    await testDoubles.todoFile.writeToTodoFile(['item 1', 'item 2']);

    await main(['item', '3']);

    assert.deepEqual(testDoubles.logger.logged, (
      'item 1\n' +
      'item 2\n' +
      'item 3\n'
    ));
  });
});
