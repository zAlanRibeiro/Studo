import * as SQLite from 'expo-sqlite';
import { ProcessedTask } from '../hooks/useClassroomData';

export async function syncTasksToDb(tasks: ProcessedTask[]) {
  const db = await SQLite.openDatabaseAsync('studo.db');

  await db.withTransactionAsync(async () => {
    for (const task of tasks) {
      await db.runAsync(
        `INSERT OR REPLACE INTO tasks (classroom_id, title, status, due_date) 
         VALUES (?, ?, ?, ?)`,
        [task.id, task.title, task.isCompleted ? 'completed' : 'pending', task.deadlineLabel]
      );
    }
  });
}
export async function debugCheckDatabase() {
  const db = await SQLite.openDatabaseAsync('studo.db');
  const allRows = await db.getAllAsync('SELECT * FROM tasks');
  console.log("--------------------------------");
  console.log("📊 DEBUG BANCO LOCAL:");
  console.log(`Total de tarefas no SQLite: ${allRows.length}`);
  console.table(allRows); // Isso vai mostrar uma tabelinha linda no seu terminal/console
  console.log("--------------------------------");
}