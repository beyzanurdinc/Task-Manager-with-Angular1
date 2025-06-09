import { Injectable, OnInit } from '@angular/core';
import { Task, TaskState } from "../models/task";
import { catchError, from, map, Observable, switchMap, take, throwError, timeout } from "rxjs";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { User } from "../models/user";
import { OnlineService } from "./online.service";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {

  userUID: string = null;

  constructor(
    private firebaseDatabase: AngularFireDatabase,
    private onlineService: OnlineService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getUserUid();
  }

  getUserUid() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.userUID = null;
      console.warn('Kullanıcı bilgisi localStorage\'ta bulunamadı!');
      return;
    }

    try {
      const userObject = JSON.parse(userString);
      this.userUID = userObject?.uid ?? null;
    } catch (e) {
      console.error('Geçersiz kullanıcı verisi:', e);
      this.userUID = null;
    }
  }

  private checkUser(): boolean {
    this.getUserUid();
    if (!this.userUID) {
      this.onlineService.isConnected$.next('Kullanıcı oturumu bulunamadı.');
      return false;
    }
    return true;
  }

  getTasks(): Observable<Task[]> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));
    return this.handleRequest(
      this.firebaseDatabase.list(`tasks/${this.userUID}`).snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const key = action.payload.key as string;
          const data = action.payload.val() as Task;
          return { id: key, ...data };
        }))
      )
    );
  }

  getTask(taskId: string): Observable<Task> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));
    return this.handleRequest(
      this.firebaseDatabase.list(`tasks/${this.userUID}`).snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const key = action.payload.key as string;
          const data = action.payload.val() as Task;
          return { id: key, ...data };
        })),
        map(tasks => tasks.find(task => task.id === taskId))
      )
    );
  }

  createTask(task: Task): Observable<string> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));

    const newTaskRef = this.firebaseDatabase.list(`tasks/${this.userUID}`).push(task);
    return this.handleRequest(
      from(newTaskRef).pipe(
        switchMap((result) => {
          const taskId = result.key;
          const updatedTask: Task = { ...task, id: taskId };
          return from(this.firebaseDatabase.object(`tasks/${this.userUID}/${taskId}`).update(updatedTask));
        }),
        map(() => 'created'),
        take(1)
      )
    );
  }

  updateTask(taskId: string, taskState: TaskState): Observable<void> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));

    const taskRef = this.firebaseDatabase.object<Task>(`/tasks/${this.userUID}/${taskId}`);
    return this.handleRequest(
      from(taskRef.update({ state: taskState })).pipe(take(1))
    );
  }

  deleteTask(taskId: string): Observable<void> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));

    const taskRef = this.firebaseDatabase.object<Task>(`/tasks/${this.userUID}/${taskId}`);
    return this.handleRequest(
      from(taskRef.remove()).pipe(take(1))
    );
  }

  applyFilter(filterState: TaskState): Observable<Task[]> {
    if (!this.checkUser()) return throwError(() => new Error('Kullanıcı oturumu bulunamadı.'));
    return this.handleRequest(
      this.firebaseDatabase.list(`tasks/${this.userUID}`, ref =>
        ref.orderByChild('state').equalTo(filterState)).snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const key = action.payload.key as string;
          const data = action.payload.val() as Task;
          return { id: key, ...data };
        }))
      )
    );
  }

  getUserProfile(userEmail: string): Observable<User | undefined> {
    const userCollection: AngularFirestoreCollection<User> =
      this.firestore.collection('users', ref => ref.where('email', '==', userEmail));
    return this.handleRequest(
      userCollection.snapshotChanges().pipe(
        map(actions => {
          const user = actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          });

          return user.length > 0 ? user[0] : undefined;
        })
      )
    );
  }

  private handleRequest<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(
      timeout(10000),
      take(1),
      catchError((error) => {
        console.error('İstek hatası:', error);

        if (error.message === 'Timeout has occurred') {
          this.onlineService.isConnected$.next('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          this.onlineService.isConnected$.next('Sunucuyla iletişim kurulamadı.');
        }

        return throwError(() => new Error(error.message));
      })
    );
  }
}
