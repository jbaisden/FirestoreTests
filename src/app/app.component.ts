import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private afs: AngularFirestore) { }
  title = 'FirestoreTests';
  // todos$: Observable<any>;
  tasks$: Observable<Array<Task>>;
  tasks: Array<any>;
  // collection: AngularFirestoreCollection<any>;

  ngOnInit() {
    // this.subscribeGetTasks();
    this.loadTodo1();
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
