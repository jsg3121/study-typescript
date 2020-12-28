import express from 'express';
import { calc } from '~/common';
import path from 'path';
import redis from 'redis';

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

console.log('calc', calc(2, 2));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// redis 사용
// 실행하기 전 docker에서 redis 서버용 컨테이너를 만들어준다
// 명령어 : docker run --name redis-db -d -p 6379:6379 redis
const client = redis.createClient();

// String형식

// set() : 첫번째 인자 = key, 두번쨰 인자 = value, redis.print => 수행 결과 또는 오류 출력(없어도 무방하며 없을 땐 출력없이 값만 저장)
client.set("name", "STRING");

// get() : 첫번째 인자 = key, 두번째 인자 = function(err, value) => 두번째 인자는 함수로 들어감
client.get("name", (err, value) => {
  console.log(`string형식 : ${value}`);
});

// 해시테이블 데이터

client.hmset('hashM', {
  'test1': 'hTest',
  'test2': 123123
});

//hset으로 hmset에 추가 가능
//추가가 가능하지만 숫자형으로는 추가가 불가능함
//추가하는 방식은 어느것을 사용해도 문제가 없음 hmset으로 할 떄는 여러개의 항목을 추가 가능 하는 부분의 차이와 숫자형식이 입력 가능하다는 차이
client.hset(['hashM', 'test3', "123"]);
client.hset('hashM', 'test6', "123");
client.hmset(['hashM', 'test4', "123"]);
client.hmset('hashM', 'test5', 123);
client.hmset('hashM', {
  'test7': 1234,
  'test8': "테스트8"
});

client.hset('hash', 'hashTest 1', 'hashhhh');
client.hset('hash', 'hashTest 2', 'number는 입력 불가');
client.hset(['hash', 'hashTest 3', '대괄호가 들어가도 2번과 같음']);


client.hget('hashM', 'test2', (err, key) => {
  console.log(`HashMap형식 : ${key}`);
});

client.hget('hash', 'hashTest 3', (err, key) => {
  console.log(`Hash형식 : ${key}`);
  console.log(`---------------------------`);
});

client.hkeys('hashM', (err, keys) => {
  keys.forEach((item, idx) => {
    console.log(`hash아이템 ${idx} : ${item}`);
  });
});

client.hkeys('hash', (err, keys) => {
  keys.forEach((item, idx) => {
    console.log(`hash아이템 ${idx} : ${item}`);
  });
});

