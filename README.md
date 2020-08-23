# Rego

Web application of Rehabilitation

## Web application technology stack

MENV Stack
* Back-end
    - MongoDB (데이터베이스)
    - Express (웹서버)
    - Node.js
* Front-end
    - Vue.js
    - Vuetify (UI 컴포넌트 라이브러리)

## 환경 구축 (윈도우)

1. Node.js 설치
    - [https://nodejs.org/](https://nodejs.org/ "Node.js official site") 설치

2. Yarn 설치 (패키지 매니저)
    - [https://classic.yarnpkg.com/en/](https://classic.yarnpkg.com/en/ "Yarn official site") 설치 후 재부팅

3. mongoDB 설치
    - [https://www.mongodb.com/](https://www.mongodb.com/ "mongoDB official site") Software > Community Server 설치
    - [https://robomongo.org/download](https://robomongo.org/download "Robo 3T official site") Robo 3T GUI 툴 설치

## 패키지 설치 및 실행

1. 소스 다운로드

2. Config 추가 (보안 요소라서 github에 commit하지 않음)
    - 아래 config 파일 설정 참고

3. 패키지 설치 및 빌드 (build.sh 참고)
    - be 패키지 설치
        ```bash
        > cd be
        > yarn cache clean
        > yarn
        ```
        - 이미지 리사이즈 sharp 패키지 설치 실패 시 package.json에서 제거하여 이후 개별 설치
            ```bash
            > yarn add sharp
            ```
    - fe 패키지 설치 및 빌드
        ```bash
        > cd ../fe
        > yarn cache clean
        > yarn
        > yarn build   (fe를 build를 하여 be에 적용된다.)
        ```

4. cross-env 설치
    - 윈도우에서 NODE_ENV 등 환경변수를 사용하기 위해서 필요 (리눅스는 생략)
        ```bash
        > cd rego
        > yarn add cross-env
        ```
    - package.json 파일에 "cross-env" 추가
        ```javascript
        "dev": "cross-env DEBUG=be:* NODE_ENV=development node ./be/bin/www",
        "pr": "cd fe && yarn && yarn build && cd ../be && yarn && cd .. && cross-env NODE_ENV=production PORT=80 node ./be/bin/www",
        ```
        - 리눅스에서는 불필요하여 dev 내용 수정 필요(cross-env 삭제)

5. 실행
    - fe 실행
        ```bash
        > cd fe
        > yarn serve
        ```
        - http://localhost:8080/ 접속
    - be 실행
        ```bash
        > cd rego
        > yarn dev
        ```
        - http://localhost:3000/ 접속

6. 서버 배포
    - 깃허브 소스 복제 (/var/www/rego/source)
        ```bash
        > cd /var/www/rego
        > git clone git@github.com:bishopdevlab/Rego.git source
        ```
    - 이후 소스 갱신
        ```bash
        > cd /var/www/rego/source
        > git pull
        ```
    - 패키지 설치 및 빌드 (5번 참고)
    - 서버 모드(배포 모드) 실행
        ```bash
        > cd /var/www/rego/source
        > yarn pr
        ```

## config 파일 설정

### 백엔드 config 파일 설정

**config/index.js**  
```javascript
module.exports = {
  dbUrl: 'mongodb://localhost:27017/rego',
  admin: {
    id: 'admin',
    pwd: 'manager',
    name: '관리자'
  },
  jwt: {
    secretKey: '토큰 발급용 키',
    issuer: 'xxx.com',
    subject: 'user-token',
    algorithm: 'HS256',    
    expiresIn: 60 * 10, // 기본 10분
    expiresInRemember: 60 * 60 * 24 * 7, // 기억하기 눌렀을 때 7일
    expiresInDiv: 3 // 토큰시간 나누는 기준
  }
}
```

- dbUrl: 데이터베이스 주소
- admin: 최초 웹 구동시 생성될 관리자
- jwt: 토큰 정보

### 프론트엔드 config 파일 세팅

**fe/config/index.js**  
```javascript
module.exports = {
  httpsOnly: false
}
```

- httpsOnly: http로 접속할 경우 https로 다시 로드합니다.
