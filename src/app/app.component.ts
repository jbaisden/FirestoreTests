import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) { }

  title = 'FirestoreTests';
  // todos$: Observable<any>;
  tasks$: Observable<Array<Task>>;
  tasks: Array<any>;
  user: firebase.User = null;

  // collection: AngularFirestoreCollection<any>;

  ngOnInit() {
    // this.subscribeGetTasks();
    this.loadTodo1();
  }

  googleAuth() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.user = res.user; // res.user as User;
          console.log(this.user);
          resolve(res);
        }, err => {
          console.error(err);
          reject(err);
        }
        );
    });
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.user = null;
  }

  subscribeGetTasks() {
    this.getTasks().subscribe(result => {
      this.tasks = result.map(changeAction => {
        const t: Task = changeAction.payload.doc.data() as Task;
        t.docId = changeAction.payload.doc.id;
        return t;
      })
    });
  }

  getTasks() {
    return this.afs.collection('tasks').snapshotChanges();
    // return new Promise<any>((resolve, reject) => {
    //   this.afs.collection('/tasks').snapshotChanges()
    //     .subscribe(snapshots => {
    //       resolve(snapshots)
    //     })
    // })
  }


  loadTodo1() {
    this.tasks$ = this.afs
      .collection('tasks')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const t: Task = a.payload.doc.data() as Task;
            t.docId = a.payload.doc.id;
            return t;
          });
        })
      );
  }

  addTask(task: string) {
    this.afs.collection('tasks').add({ description: task });
  }

  loadTodo2() {
    // this.collection = this.afs.collection('tasks');
    // console.warn(this.collection);
    // this.tasks$ = this.collection.valueChanges();
  }

} //end class


interface Task {
  description: string;
  docId: string;
  name: string;
  email: string;
}

interface User {
  email: string;
  phoneNumber: string;
  photoURL: string;
  displayName: string;
  isAnonymous: boolean;
  uid: string;
}
