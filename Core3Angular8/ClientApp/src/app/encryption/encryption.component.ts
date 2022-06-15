import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import * as forge from 'node-forge';
import { Student } from '../home/home.component';
import { MyApiService } from '../services/my-api.service';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.css']
})
export class EncryptionComponent{

  userName: string = "";
  userPass: string = "";
  btnClicked: boolean = false;
  loginSuccess: boolean =false;

  publicKey: string = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAskgPKBcNpz71mi4NSYa5
    mazJrO0WZim7T2yy7qPxk2NqQE7OmWWakLJcaeUYnI0kO3yC57vck66RPCjKxWuW
    SGZ7dHXe0bWb5IXjcT4mNdnUIalR+lV8czsoH/wDUvkQdG1SJ+IxzW64WvoaCRZ+
    /4wBF2cSUh9oLwGEXiodUJ9oJXFZVPKGCEjPcBI0vC2ADBRmVQ1sKsZg8zbHN+gu
    U9rPLFzN4YNrCnEsSezVw/W1FKVS8J/Xx4HSSg7AyVwniz8eHi0e3a8VzFg+H09I
    5wK+w39sjDYfAdnJUkr6PjtSbN4/Sg/NMkKB2Ngn8oj7LCfe/7RNqIdiS+dQuSFg
    eQIDAQAB
    -----END PUBLIC KEY-----`;
 

  Students: Student[] = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private myApi: MyApiService) {
    http.get<Student[]>(baseUrl + 'api/Login/44445').subscribe(
      result => {
        this.Students = result;
      },
      error => console.error(error));
   
  }

  ngOnInit() {
    //Init:
    let item: Student = { id: 0, name: "Tsy connecté à WebService", roll: 1 };
    this.Students.push(item);
  }

  login() {
    var rsa = forge.pki.publicKeyFromPem(this.publicKey);
    var encryptedPassword = window.btoa(rsa.encrypt(this.userPass));

    let user: UserLoginModel = { userName: this.userName, password: encryptedPassword };
    const url = "https://localhost:44373/api/encryption";

    this.http.post<boolean>(url, user).subscribe(
      result => { this.btnClicked = true; this.loginSuccess = result },
      error => { console.error(error) }
    );


    //Another method
    //this.myApi.postWithObjectReturn(url, user).subscribe(
    //  res => {      
    //  //this.loginSuccess = res;
    //}, err => {
    //  console.log(err);
    //});

    
  }

  result: any = "";
  error: any;
  encrypt() {

    //const url = "https://localhost:44373/api/Students";
    //this.http.post<string>(url, { value1: "2121212", value2: "0212124" }).subscribe(
    //  result => { this.retPostData = result },
    //  error => { console.error(error) }
    //);

    let user: UserLoginModel = { userName: "qsdqsdsqd", password: "sdfsdf" };
    const url = "https://localhost:44373/api/encryption/5";
    this.http.get(url, { responseType: 'text' }).subscribe(
      res => { this.result = res },
      error => { this.error = error; console.log(error) });

   
  }

  logout() {
    this.loginSuccess = false;
    this.btnClicked = false;
  }

  //GET
  get() {
    const url = "https://localhost:44373/api/encryption/5";
    this.myApi.getData(url).subscribe(res => { }, error => { console.log(error) });
  }

  //POST:
  post() {

  }


}

interface UserLoginModel {
  userName :string
   password :string
}
