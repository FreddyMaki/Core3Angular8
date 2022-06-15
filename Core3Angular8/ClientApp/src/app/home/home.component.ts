import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpModels } from '../models/http.models';
import { Options } from 'selenium-webdriver';
import { MyApiService } from '../services/my-api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  Students: Student[] = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private myApiService: MyApiService)
  {
    http.get<Student[]>(baseUrl + 'api/Students').subscribe(
      result => {
        this.Students = result;
      },
      error => console.error(error));
  }


  //Angular CRUD Application
  //POST
  public retPostData !:any;
  public retGetData!: any;
  public retPutData!: any;
  postData()
  {
    const url ="https://localhost:44373/api/Students";
    //this.http.post<string>(url,{value1: "2121212", value2:"0212124"}).subscribe(
    //  result =>{this.retPostData = result},
    //            error =>{console.error(error)}
    //);

    //Another method:
     this.myApiService.postWithTextReturn(url, {value1: "2121212", value2:"0212124"}).subscribe(
       result =>{this.retPostData = result},
       error =>{console.error(error)}
       );

  }

  //GET
  getData()
  {
    const url ="https://localhost:44373/api/Students/5";
    //this.http.get(url, {responseType : 'text'}).subscribe(
    //  data => { this.retGetData = data },
    //  error =>{console.error(error)}
    //  );

    //Another method:
    this.myApiService.getData(url).subscribe(
      data => {this.retGetData = data      },
      error =>{console.error(error)})
  }

  //PUT
  putData()
  {
    const url ="https://localhost:44373/api/Students/5"; //We can use any Id : change it
    this.http.put(url,{value1: "dfdsf", value2:"sdfsdf"}).subscribe(
      data =>{console.log(data)});
  }

  //DELETE
  deleteData(){
    const url ="https://localhost:44373/api/Students/5";
    this.http.delete(url).subscribe(
      data => {console.log(data)},
      error=>{console.log(error)});
  }

}

export interface Student {
  id: number;
  name: string;
  roll: number;
}
