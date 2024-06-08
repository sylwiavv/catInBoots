import { Component, Input } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Task } from "./tasks-list/task.model";
import { NgFor } from "@angular/common";
import { NgIf } from "@angular/common";

type ListFetchingError = {
  status: number,
  message: string
}

type  IdleState = {
  state: "idle"
}
type  LoadingState = {
  state: "loading"
}
type SuccessState = {
  state: "success",
  results: Task[]
}

type  ErrorState = {
  state: "error",
  result: [],
  error: ListFetchingError
}

type ComponentListState = IdleState | LoadingState | SuccessState | ErrorState;


@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {
  title = "cat-in-boots";
  error?: ListFetchingError
  loading = false
  listState: ComponentListState = {state: "idle"}

  @Input({ required: true }) tasks: Task[] = [];

  private readonly URL = "http://localhost:3000";

  constructor() {
    this.listState = {state: "loading"};
    fetch(`${this.URL}/tasks`)
      .then<Task[] | ListFetchingError>((res) => {
        if (res.ok) {
          return res.json();
        }
        return  {status: res.status, message: res.statusText}
    })
      .then(response => {
        setTimeout(() => {
          if (Array.isArray(response)) {
            this.listState = {
              state: "success",
              results: response
            }
          } else {
            this.listState = {
              state: "error",
              result: [],
              error: {
                status: response.status,
                message: response.message
              }
            }
          }
          this.loading = false
        }, 1200);
      });
  }

  toggleDoneStatus(task: Task) {
    task.done = !task.done;
  }

}
