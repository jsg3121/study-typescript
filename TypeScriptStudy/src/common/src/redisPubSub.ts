// redis 를 사용하는것 보다 ioredis를 사용하는것이 속도가 더 빠름
import Redis from 'ioredis';



export const PUBSUB = () => {

  // 서비스 구독자
  const subscriber = new Redis();

  // 서비스 발행자
  const publisher = new Redis();
  let msg_count = 0;

  let d = 0;

  // 발행자의 메세지 publish 이벤트를 받아옴
  subscriber.on('message', (channel, message) => {
    msg_count += 1;
    if (msg_count == 5) {
      // console.log(msg_count);
      // subscriber.unsubscribe();
      // publisher.end(true);
      console.log('s', d);
      console.log(Date.now());
    }
  });

  // 'Test Channel'을 구독함
  subscriber.subscribe('Test Channel');

  // 1초뒤 메세지를 전송함
  setTimeout(() => {
    console.time("publish");
    d = Date.now();
    publisher.publish('Test Channel', "First Message");
    publisher.publish('Test Channel', "Second Message");
    publisher.publish('Test Channel', "Third Message");
    publisher.publish('Test Channel', "Fourth Message");
    publisher.publish('Test Channel', "Fifth Message");
    publisher.publish('Test Channel', "Sixth Message");
    console.timeEnd("publish");
  }, 1000);


  // 코드는 정상적으로 동작하지만 실행을 했을 때 콘솔창에 뜨는건 매번 다르게 나오거나 6개 모두 나오는 경우는 pub/sub 기능이 너무 빠르기 때문
  // 속도 체크를 했을 때를 확인해 보면 publish 하는 시간이 매우 빨라 on('message')이벤트로 반응을 하기 전에 끝나는 경우가 생기기 떄문에 6개가 모두 나오거나 3개만 나오는 등 매번 결과가 다르게 나옴
  // 정확한 기능을 구현하기 위해선 추가적인 옵션이 필요하며 RxJS를 같이 사용하는것이 좋음

};
