import {Component, OnInit} from '@angular/core';
import {OnlineService} from "./services/online.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'task manger ';
  networkMessage: string = null;

  constructor(private onlineService: OnlineService) {

  }

  ngOnInit(): void {
    this.onlineService.isConnected$.subscribe((message) => {
      this.networkMessage = message
    })
  }

  refreshPage(): void {
    // Reload the page
    window.location.reload();
  }
}
