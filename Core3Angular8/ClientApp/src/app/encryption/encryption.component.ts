import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import * as forge from 'node-forge';
import { cipher, util } from 'node-forge';
import { Student } from '../home/home.component';
import { MyApiService } from '../services/my-api.service';
import CryptoJS  from 'crypto-js';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.css']
})
export class EncryptionComponent{

  //RSA
  username: string = "";
  userPass: string = "";
  btnClicked: boolean = false;
  loginSuccess: boolean = false;

  //AES
  plainText: string = "";
  encryptText: string ="";
  encPassword: string="";
  decPassword: string="";
  conversionEncryptOutput: string="";
  conversionDecryptOutput: string="";

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
    http.get<Student[]>(baseUrl + 'api/Students').subscribe(
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

    let user: UserLoginModel = { username: this.username, password: encryptedPassword };
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

    let user: UserLoginModel = { username: "qsdqsdsqd", password: "sdfsdf" };
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


  //*********Method is used to encrypt and decrypt the text Using Cryptojs AES********* 
  convertText(conversion: string) {
    if (conversion == "encrypt") {
      this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();
      
    }
    else {
      this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);

    }
  }

  //**********Method is used to encrypt and decrypt the text Using Node-Forge AES**********
  //Angular : Achieving payload encryption with Forge | Node-Forge:
  iv = forge.random.getBytesSync(32); //IV
  aesKey = forge.random.getBytesSync(32); // KEY

  //RSA encrypting AES key and IV with RSA
  encryptRSAUtf8(msg: string): string { // payload can be key and IV

    const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
    const buf = forge.util.createBuffer(forge.util.encode64(msg), 'utf8');
    const encrypted = publicKey.encrypt(buf.bytes(), 'RSA-OAEP');
    return forge.util.encode64(encrypted);

  }

  //Encrypting payload with AES
  encryptAES(aesKey: string, iv: string, plainText: string): string {
    const cipherData = cipher.createCipher('AES-CBC', aesKey); // Create a cipher with key and IV
    cipherData.start({
    iv,
    tagLength: 128,  // Authentication tag
    });

  cipherData.update(forge.util.createBuffer(plainText));
  cipherData.finish();

  const encrypted = cipherData.output;
  const tag = cipherData.mode.tag;

  return forge.util.encode64(encrypted.data + tag.data);

  }

 
  // SAMPLE REQUEST CAN BE LIKE :
  //Updating request inside interceptor (cross-cutting concern):
  //Like in normal angular HTTP interceptor, we modify the captured request so that the encryption logic can be decoupled from the business logic
    //request = request.clone({
    //requestPayload: AES Encrypted Payload,
    //aesKey: RSA encrypted AES Key,
    //iv: RSA encrypted AES IV
    // });

  // Decrypting the response from Server
  decryptAES(encryptedText: string, key: string, iv: string): string | null {

    try {
      const byteString = forge.util.decode64(encryptedText);
      const authTag = byteString.slice(byteString.length - 16); // 128 bits TAG
      const encryptedTxt = byteString.slice(0, byteString.length - 16); // Extract text without TAG
      const decipherData = cipher.createDecipher('AES-CBC', key);

      decipherData.start({
        iv,
        tagLength: 128,
        tag: authTag,
       });

      decipherData.update(forge.util.createBuffer(encryptedTxt));
      const pass = decipherData.finish();
      if (pass) {
         return decipherData.output.data;
      }

    } catch (error) {
      console.log(error);
     }

    return null;
  }

  getCipher(aesKey: string) {
    const c = cipher.createCipher('AES-CBC', aesKey);
    return c;
  }

  getDecipher(aesKey: string) {
    const d = cipher.createDecipher('AES-CBC', aesKey);
    return d;
  }

  //We gonne encrypt the payload with AES algorithm and send it on the network, we gonna use: key and iv for that
  //Then we'll encrypt the key and iv with RSA algorithm, after that we 'll send these encrypted object on the network
  
  password: string = "";
  encryptedlogin: string = "";
  encryptedPassword: string = "";
  encryptedKey: string = "";
  encryptedIV: string = "";

  encrypt2(): boolean {

    if (this.username == "") {
      alert('Please enter username');
      return false;
    }
    else if (this.password == "") {
      alert('Please enter Password');
      return false;
    }
    else {
      // Initialization Vector  (IV) assigning and it should be of 16 charaters.
      var keyUtf8 = CryptoJS.enc.Utf8.parse('8080808080808080');
      var ivUtf8 = CryptoJS.enc.Utf8.parse('8080808080808080');
   
     //Encrypt username with AES:
      this.encryptedlogin = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(this.username),
        keyUtf8,
        { keySize: 128 / 8, iv: ivUtf8, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      //Encrypt Password with AES:
      this.encryptedPassword = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(this.password),
        keyUtf8,
        { keySize: 128 / 8, iv: ivUtf8, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      //Encrypt key and iv with RSA algo:
      let key = "8080808080808080";
      let iv = "8080808080808080";
      var rsa = forge.pki.publicKeyFromPem(this.publicKey);
      this.encryptedKey = window.btoa(rsa.encrypt(key));//encrypt key
      this.encryptedIV = window.btoa(rsa.encrypt(iv));//encrypt IV

      //alert('encrypted username :' + this.encryptedlogin);
      //alert('encrypted password :' + this.encryptedPassword);
      
      return true;
    }
      
   
  }

  //SEND ENCRYPTED DATA
  send() {
    const url = "https://localhost:44373/api/encryption/postEncryptedData";
    //Use this to send a little data
    let body: UserLoginModel = { username: this.username, password: this.password };//With encrypted data

    //Use this to send a huge Object:
    let data = JSON.stringify(body);//Convert with JSON

    //Encrypt data with AES:
    var keyUtf8 = CryptoJS.enc.Utf8.parse('8080808080808080');
    var ivUtf8 = CryptoJS.enc.Utf8.parse('8080808080808080');
    var dataUtf8 = CryptoJS.enc.Utf8.parse(data);
    
    var encryptedData = CryptoJS.AES.encrypt(
      dataUtf8,
      keyUtf8,
      { keySize: 128 / 8, iv: ivUtf8, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    var ciphertext=  CryptoJS.enc.Base64.stringify(encryptedData.ciphertext)

    let allData: AllData = {
      encryptedKey: this.encryptedKey,
      encryptedIV: this.encryptedIV,
      encryptedData: ciphertext
    }; //With unencrypted data
    

    //SEND
    var response: any = "";
    this.myApi.postEncryptedData(url, allData).subscribe(
      result => {
        if (result) { response = result }
      },
      error => { console.log(error) });
       
  }
}

interface UserLoginModel {
  username :string,
  password: string,
}

interface AllData {
  encryptedKey: string,
  encryptedIV: string,
  encryptedData: any
}
