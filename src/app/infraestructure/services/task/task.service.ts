import { Injectable } from '@angular/core';
import { Firestore, collection, query, QueryDocumentSnapshot,where,startAfter,endBefore,limitToLast, getDocs, addDoc, CollectionReference, DocumentData, doc, orderBy, limit, updateDoc, getDoc } from '@angular/fire/firestore';
import { Task } from 'src/app/core/domain/models/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  //Valiables
  private tasksCollection: CollectionReference<DocumentData>;
  private currentPageDocs: QueryDocumentSnapshot<DocumentData>[] = [];
  public currentIndex = -1;
  private pageSize = environment.pageSize;

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

  async getTasks(direction: 'start' | 'next' | 'previous' = 'start'): Promise<Task[]> {
    let q;

    if (direction === 'start') {
      q = query(this.tasksCollection, 
        where('active', '==', true), 
        limit(this.pageSize),
        orderBy('description')
      );
      this.currentIndex = 0;
    } 
    else if (direction === 'next' && this.currentPageDocs.length > 0) {
      const lastDoc = this.currentPageDocs[this.currentPageDocs.length - 1];
      q = query(this.tasksCollection, 
        where('active', '==', true), 
        orderBy('description'), 
        startAfter(lastDoc), 
        limit(this.pageSize));
      this.currentIndex++;
    } 
    else if (direction === 'previous' && this.currentPageDocs.length > 0) {
      const firstDoc = this.currentPageDocs[0];
      q = query(this.tasksCollection, 
        where('active', '==', true), 
        orderBy('description'), 
        endBefore(firstDoc), 
        limitToLast(this.pageSize));
      this.currentIndex--;
    } 
    else {
      // fallback to start if no docs
      q = query(this.tasksCollection, 
        where('active', '==', true),
        orderBy('description'), 
        limit(this.pageSize));
      this.currentIndex = 0;
    }

    const snapshot = await getDocs(q);
    this.currentPageDocs = snapshot.docs;

    return snapshot.docs.map(doc => this.mapDoc(doc));
  }

  private mapDoc(doc: QueryDocumentSnapshot<DocumentData>): Task {
    return {
      id: doc.id,
      ...(doc.data() as Omit<Task, 'id'>)
    };
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
      taskData['descripcion'] = task.description;
      taskData['isExec'] = task.isExec;
      taskData['category'] = task.category;
      await updateDoc(taskDocRef, taskData);

    } else {
      throw new Error('Task not found');
    }
  }

  hasNext(): boolean {
    return this.currentPageDocs.length === this.pageSize;
  }

  hasPrevious(): boolean {
    return this.currentIndex > 0;
  }
}

