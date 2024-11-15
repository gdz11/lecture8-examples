import { Component } from '@angular/core';
import { Student } from '../shared/models/student.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../shared/services/student.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, AsyncPipe],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent {

  public students: Student[] = [];

  public editingStudent?: Student; 

  addForm = new FormGroup({
    name: new FormControl('', Validators.required),
    personalNumber: new FormControl('', Validators.required)
  });

  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    personalNumber: new FormControl('', Validators.required)
  });

  searchField = new FormControl('');

  searchText$ = new BehaviorSubject<string | null>('');
  searchResults$!: Observable<Student[]>;

  addStudent(){
    this.studentService.addStudent({
      id: '',
      name: this.addForm.value.name!,
      personalNumber: this.addForm.value.personalNumber!
    }).subscribe(() => {
      this.loadStudents();
    });
  }

  editStudent(student: Student){
    this.editingStudent = student;
    // setTimeout(() => {
    // this.editForm.setValue({
    //   name: this.editingStudent?.name,
    //   personalNumber: this.editingStudent?.personalNumber
    // });
    // }, 0);

    this.editForm.setValue({
      name: this.editingStudent?.name,
      personalNumber: this.editingStudent?.personalNumber
    });
  }

  cancelEditStudent(){
    this.editingStudent = undefined;
  }

  updateStudent(){
    this.studentService.updateStudent({
      id: this.editingStudent!.id,
      name: this.editForm.value.name!,
      personalNumber: this.editForm.value.personalNumber!
    }).subscribe(d => {
      this.editingStudent = undefined;
      this.loadStudents();
    })
  }

  deleteStudent(id: string){
    this.studentService.deleteStudent(id).subscribe(() => {
      this.loadStudents();
    })
  }

  loadStudents(){
    this.studentService.getStudents().subscribe(d => {
      this.students = d;
    });
  }

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();

    this.searchResults$ = this.searchText$.pipe(
      debounceTime(500),
      switchMap(query => this.studentService.findStudentByName(query || ''))
    );

    this.searchField.valueChanges.subscribe(this.searchText$);
  }
}
