import { Component } from '@angular/core';
import { StudentManagementComponent } from "./student-management/student-management.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentManagementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lecture8-examples-v2';
}
