import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators'
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from '../shared/models/student.model';
import { StudentService } from '../shared/services/student.service';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
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
