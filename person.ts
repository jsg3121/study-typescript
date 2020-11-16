class Person {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  sayHello() {
    return "Hello, " + this.name;
  }
}

const person = new Person("lee");
console.log(person.sayHello());

// cmd 창에 tsc person를 입력하면 person.js로 컴파일 후 저장
// vscode내에서 명령어 입력시 컴파일되지 않음
// 기본 자바스크립트 버전은 ES3 버전
// 자바스크립트를 변경하려면 컴파일 시 옵션에 --target 또는 -t를 사용( 지원 버전 : ES3,5,6(ES2015), ES2016, ES2017)
// ex) tsc person -t es6
