import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, CollectionReference, DocumentData, doc, deleteDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Task } from '../models/task'; 

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.tasksCollection = collection(this.firestore, 'tasks');
  }

  async addTask(taskData: Task) {
    try {
      const docRef = await addDoc(this.tasksCollection, taskData);
      console.log('User added with ID: ', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks'); 
    const tasksQuery = query(tasksRef, where('active', '==', true)); 
    const querySnapshot = await getDocs(tasksQuery);

    const activeTasks: Task[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data() as Task;
      const id = doc.id;
      activeTasks.push({id, ...data });
    });

    return activeTasks;
  }

  async deleteTask(id: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    const taskSnapshot = await getDoc(taskDocRef);

    if (taskSnapshot.exists()) {
      const taskData = taskSnapshot.data();
      taskData['active'] = false;

      await updateDoc(taskDocRef, taskData);

    } else {
      throw new Error('Task not found');
    }
  }

  async updateTask(task: Task): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    const taskSnapshot = await getDoc(taskDocRef);

    if (taskSnapshot.exists()) {
      const taskData = taskSnapshot.data();
      taskData['descripcion'] = task.descripcion;
      taskData['isExec'] = task.isExec;

      await updateDoc(taskDocRef, taskData);

    } else {
      throw new Error('Task not found');
    }
  }
}
