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
  todos$: Observable<any>;
  collection: AngularFirestoreCollection<any>;

  ngOnInit() {
    this.loadTodo2();
  }


  loadTodo2() {
    this.collection = this.afs.collection('tasks');
    console.warn(this.collection);
    this.todos$ = this.collection.valueChanges();
  }

  loadTodo1() {
    this.todos$ = this.afs
      .collection('tasks')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  // collection$(path, query?) {
  //   return this.afs
  //     .collection(path)
  //     .snapshotChanges()
  //     .pipe(
  //       map(actions => {
  //         return actions.map(a => {
  //           const data: Object = a.payload.doc.data();
  //           const id = a.payload.doc.id;
  //           return { id, ...data };
  //         });
  //       })
  //     );
  // }

} //end class

