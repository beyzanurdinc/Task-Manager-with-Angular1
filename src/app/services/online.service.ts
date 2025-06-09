import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OnlineService implements OnInit {

  isConnected$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  ngOnInit(): void {
  }


}
