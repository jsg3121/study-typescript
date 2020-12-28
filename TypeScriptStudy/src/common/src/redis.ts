
import redis from 'redis';
export const redisStudy = () => {
  // const redis = require('redis');

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

  // hmset() : 첫번째 인자 = 해시테이블 명, 두번째 인자 : 항목들
  // 해시테이블에 key로 식별되는 value 값들을 항목으로 추가 가능
  client.hmset('hashM', {
    'test1': 'hTest',
    'test2': 123123
  });

  // hset() : 첫번째 인자 = 해시테이블 명, 두번째 인자 : 항목의 key, 세번째 인자 : key와 연결되는 value
  // hmset은 여러 항목을 입력할 수 있지만 hset은 하나만 가능
  client.hset('hash', 'hashTest 1', 'hashhhh');
  client.hset('hash', 'hashTest 2', 'number는 입력 불가');
  client.hset(['hash', 'hashTest 3', '대괄호가 들어가도 2번과 같음']);

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

  // hget() : 첫번째 인자 = 에러(err), 두번째 인자 = 항목의 key, 세번째 인자 = function(err, value) => 두번쨰 인자를 키값으로 가지고 있는 value를 가져옴
  // 해당 해시테이블에서 인자로 받는 항목의 값을 가져옴
  client.hget('hashM', 'test2', (err, value) => {
    console.log(`HashMap형식 : ${value}`);
  });

  client.hget('hash', 'hashTest 3', (err, value) => {
    console.log(`Hash형식 : ${value}`);
    console.log(`------------- hashM 테이블 --------------`);
  });

  // hkeys() : 첫 번째 인자 = 해시테이블 명, 두 번째 인자 = funciton(err, key) => 해당 해시테이블의 저장된 항목의 키값을 가져옴
  client.hkeys('hashM', (err, keys) => {
    keys.forEach((item, idx) => {
      console.log(`hash아이템 ${idx} : ${item}`);
    });
    console.log(`------------- hash 테이블 --------------`);
  });

  client.hkeys('hash', (err, keys) => {
    keys.forEach((item, idx) => {
      console.log(`hash아이템 ${idx} : ${item}`);
    });
    console.log(`---------------------------`);
  });

  // 저장된 정보 초기화
  client.flushall();

  // list 형식

  // lpush(), rpush() : 첫 번째 인자 = 리스트 명, 두 번째 인자 = value
  // 리스트에 값을 추가
  // rpush() = 자바스크립트 배열 push(), lpush() = unshift()와 비슷하다고 생각하면 됨
  client.rpush("list", "list 0");
  client.lpush("list", "list 1");
  client.lpush("list", "list 2");
  client.lpush("list", "list 3");
  client.lpush("list", "list 4");
  client.lpush("list", "list 5");

  // lrange() : 첫 번째 인자 = 리스트 명, 두 번째 인자 = 시작지점, 세번째 인자 = 마지막 지점, 네번째 인자 = function(err,value) 해당 리스트의 값
  client.lrange("list", 0, -1, (err, items) => {
    items.forEach((item, idx) => {
      console.log(`list ${idx} : ${item}`);
    });
  });

  client.flushall();

  //set

  // sadd() : 첫 번째 인자 = set배열 테이블 명, 두 번째 인자 = value, 세번째, 네번재... n번째 인자 = value
  // set에 값을 추가
  client.sadd("list", "setList 1");
  client.sadd("list", "setList 2");
  client.sadd("list", "setList 3");
  client.sadd("list", "setList 4");
  client.sadd("list", "setList 3");
  client.sadd("list", "setList 5", "setList 6", "setList6", "setList 7", "setList 8", "setList 6", "setList 9");

  // smembers() : 첫 번째 인자 배열 명, 두번째 인자 = function(err, data) => 배열에서 가지고 있는 데이터
  // 저장된 값을 반환
  client.smembers("list", (err, data) => {
    console.log(data);
  });

  // 그 외 command : https://redis.io/commands
};
