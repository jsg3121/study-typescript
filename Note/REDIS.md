# REDIS

---

### 사전적 정의

- Redis : 키-값 기반의 인-메모리 데이터 저장소
  - 쿼리를 따로 작성할 필요없이 결과를 바로 가져올 수 있으며 메모리에서 데이터를 처리하기 때문에 속도가 빠르다

### 데이터 구조

- String : 단순한 Key-Value 구조
- List : Array형식의 데이터 구조
  - List를 사용하면 처음과 끝에 데이터를 넣고 빼는것은 속도가 빠르지만 중간에 데이터를 삽입할 때 어려움이 있다.
  - 메모리가 허용하는 한 매우 많은 데이터를 저장할 수 있다.
  - 리스트의 길이가 길어지면 검색 속도 또한 느려지게 된다.
- Sets : 순서가 없는 String 데이터 집합.
  - 중복된 데이터는 하나로 처리하기 때문에 중복값이 없음
  - 같은 값을 두 개 저장한다면 나중에 저장하려하는 값은 무시
  - 입력한 순서와 상관없이 랜덤으로 순서가 정해짐
- Sorted Sets : Sets와 같은 구조이지만, Score를 통해 순서를 정할 수 있다.
  - Soreted Sets를 사용하여 Leaderboard와 같은 기능을 손쉽게 구현할 수 있음
- Hashes : Key-Value 구조를 여러개 가진 object 타입을 저장하기 좋은 구조

##### 캐시 데이터 저장, 인증 토큰, Ranking Board 등으로 주로 사용됨

### Redis 관리

- 특징

  - Single thread : 한 번에 하나의 명령어만 실행할 수 있음

    - 명령어를 포함한 패킷이 MTU(Maximum Trasmission Unit)보다 크다면 패킷이 쪼개져서 올 수 있는데 쪼개진 명령어를 합쳐 하나의 명령어가 되는 순간 해당 명령어를 수행

  - 처리시간이 긴 명령어를 중간에 넣으면 그 뒤에 있는 명령어들은 전부 기다려야하기 때문에 주의해야함
    - <span style="color:red">Ex) 전체 키를 불러오는 Keys명령어가 처리가 매우 오래 걸리는데 대기 순서 중간에 Keys명령어를 실행하면 그 뒤에오는 Get/Set 명령어들은 타임아웃이 나오 요청에 실패할 수 있다.</span>
  - 메모리의 한계는 maxmemory 값으로 설정할 수 있으며 maxmemory 수치까지 메모리가 다 차는 경우 Redis는 maxmemory-policy에 따라 추가 메모리를 확보함
    - maxmemory-policy 설정값
      1. noeviction : 기존 데이터를 삭제하지 않음. 메모리가 꽉 찬 경우에 Out Of Memory 오류를 반환하고 새로운 데이터는 버리게 됨
      2. allkeys-lru : LRU(Least Recently Used)라는 페이지 교체 알고리즘을 통해 데이터를 삭제하여 공간을 확보
      3. volatil-lru: expire set을 가진 것 중 LRU로 삭제하여 메모리 공간을 확보
      4. allkeys-random : 랜덤으로 데이터를 삭제하여 공간을 확보함
      5. volatile-random : expire set을 가진 것 중 랜덤으로 데이터를 삭제하여 공간을 확보
      6. volatile-ttl : expire set을 가진 것 중 TTL값이 짧은 것부터 삭제
      7. allkeys-lfu : 가장 적게 액세스한 키를 제거하여 공간을 확보
      8. volatile-lfu : expire set을 가진것 중 가장 적게 액세스한 키부터 제거하여 공간을 확보

## Redis Replication

- Master / Slave 구조
  - Master : 쓰기, 읽기를 전부 수행
  - Slave : 읽기만 가능
- Slave는 Master의 데이터를 전부 가지고 있어야 하는데 이럴 때 마스터에 있는 데이터를 복제해서 Slave로 옮기는 작업을 Replication이라고 한다.

- 특징

  1. 비동기 방식의 복제
  2. 마스터는 여러 복제서버를 가질 수 있음
  3. 복제서버는 또다른 복제 서버를 가질 수 있다
  4. 마스터의 데이터를 복제 서버로 보내는 작업은 자식 프로세스가 처리
  5. 자동 Failover(시스템, 네트워크 등에서 이상이 생겼을 때 대체 작동 또는 장애 극복을 위해 예비 시스템으로 자동 전환되는 기능)가 되지 않는다.

- Replication 작업 순서

  1. Slave Configuration에 **"replacaof \<master IP\>\<master PORT\>"**설정을 하거나 REPLICAOF 명령어를 통해 마스터에 데이터 Sync를 요청함
  2. Master는 백그라운드에서 **RDB파일(현재 메모리 상태를 담은 파일)** 생성을 위한 프로세스 진행 이 때, Master는 fork를 통해 메모리를 복사하고 이후 fork한 프로세스에서 현재 메모리 정보를 디스크에 덤프하는 작업을 진행
  3. 2번 작업과 동시에 Master는 이후부터 들어오는 쓰기 명령들을 Buffer에 저장
  4. 덤프작업이 완료되면 Master는 Slave에 해당 RDB 파일을 전달해주고 Slave는 디스크에 저장한 후에 메모리로 로드
  5. 3번에서 모아두었던 쓰기 명령들을 전부 Slave로 전달

- Replication 작업 주의사항

  1. fork가 발생 될 때 자신이 사용하고 있는 메모리만큼 추가적인 메모리가 필요하기 때문에 메모리 부족이 발생 할 수 있다.

  2. 다수의 redis 서버 각각이 많은 replica를 두고 있으면 네트워크 이슈 등으로 동시에 replication이 재시도 되도록 했을 때 문제가 발생할 수 있다.
