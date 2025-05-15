import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, CollectionReference, DocumentData, doc, deleteDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Category } from 'src/app/core/domain/models/category'; 
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 private categoryCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.categoryCollection = collection(this.firestore, 'categories');
  }

  async addCategory(taskData: Category) {
    try {
      const docRef = await addDoc(this.categoryCollection, taskData);
      console.log('User added with ID: ', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    const categoryRef = collection(this.firestore, 'categories'); 
    const categoryQuery = query(categoryRef, where('active', '==', true)); 
    const querySnapshot = await getDocs(categoryQuery);

    const activeCategories: Category[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data() as Category;
      const id = doc.id;
      activeCategories.push({id, ...data });
    });

    return activeCategories;
  }

  async deleteCategory(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    const categorySnapshot = await getDoc(categoryDocRef);

    if (categorySnapshot.exists()) {
      const categoryData = categorySnapshot.data();
      categoryData['active'] = false;

      await updateDoc(categoryDocRef, categoryData);

    } else {
      throw new Error('category not found');
    }
  }

  async updateCategory(category: Category): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${category.id}`);
    const categorySnapshot = await getDoc(categoryDocRef);

    if (categorySnapshot.exists()) {
      const categoryData = categorySnapshot.data();
      categoryData['name'] = category.name;

      await updateDoc(categoryDocRef, categoryData);

    } else {
      throw new Error('Category not found');
    }
  }
}
