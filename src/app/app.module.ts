import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {TaskListComponent} from './components/task-list/task-list.component';
import {TaskDetailComponent} from './components/task-detail/task-detail.component';
import {NewTaskComponent} from './components/new-task/new-task.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {TaskComponent} from "./components/task/task.component";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FormsModule} from "@angular/forms";
import {FilterComponent} from './components/filter/filter.component';
import {HeaderComponent} from './components/header/header.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {ProfileComponent} from './components/profile/profile.component';
import {LoadingComponent} from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskDetailComponent,
    NewTaskComponent,
    PageNotFoundComponent,
    TaskComponent,
    FilterComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    LoadingComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideDatabase(() => getDatabase())
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
