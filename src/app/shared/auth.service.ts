import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from "./user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject } from 'rxjs';
//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:User;
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  constructor(
      public router: Router,
      public ngZone: NgZone,
      public afAuth: AngularFireAuth,
      private angularFireAuth: AngularFireAuth
  ) {  }

  // Firebase SignInWithPopup
    OAuthProvider(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((res) => {
                this.ngZone.run(() => {
                    this.router.navigate(['home']);
                })
            }).catch((error) => {
                window.alert(error)
            })
    }

    // Firebase Google Sign-in
    SigninWithGoogle() {
        return this.OAuthProvider(new auth.GoogleAuthProvider())
            .then(res => {
                console.log('Successfully logged in to GOOGLE!')
                this.loggedIn.next(true);
                console.log('Observable: ', this.loggedIn.value)
            }).catch(error => {
                console.log(error)
            });
    }
    SigninWithFaceBook() {
        return this.OAuthProvider(new auth.FacebookAuthProvider())
            .then(res => {
                console.log('Successfully logged in to FACEBOOK!')
                this.loggedIn.next(true);
            }).catch(error => {
                console.log(error)
            });
    }

    // Firebase Logout 
    SignOut() {
        return this.afAuth.auth.signOut().then(() => {
            this.loggedIn.next(false);
            this.router.navigate(['home']);
        })
    }

  
}
