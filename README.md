
https://blog.naver.com/jooeun0502/221956294941 문법 참조
https://backendcode.tistory.com/165 예시 참조 

https://github.com/samchon/resume/blob/master/README.md 참조



## 프로젝트 소개 
 미래에는 ROBOT가 산업 현장의 노동 뿐만 아니라 가사 노동을 지원하고 몇 년 내에 로봇 친화적인 환경으로 변화될 것으로 예상됩니다. 로봇 시장의 규모가 커지고 거래가 B to B에서 확장하여 B to C 또는 C to C 거래도 활성화 되는 사업을 구상해서 만든 'ROBOT Trader 플랫폼'입니다.
 
 

### ⏲️프로젝트 개발 기간
 2023년 12월 18일 ~ 2024년 3월 21일

### ⚙️개발 환경
 + Typescript 4.7.1
 + Node.js 18.12.1
 + **library**:React 18.2.0
 + **Framework**:Nestjs 10.2.10
 + **ORM**: TypeORM 
 + **Database**: Postgresql

## Skill 숙련도 
Skill        | Experiences | Careers  | Note
-------------|-------------|--------- |-------
TypeScript   | 1 년        | 0 년      | 
javascript   | 2 년        | 1년 미만  | 
DB/SQL       | 1년         | 1년 미만  | 

## 📌주요 기능 

### 회원가입
  <img src=" 회원가입 URL ">

 - 아이디/비밀번호 및 휴대 전화의 유효성 확인등 을 통해 아이디/비밀번호 생성  
 - Admin으로 가입 시(일정 기간 제한적 가입)관리자의 '회원 관리' 기능 사용이 가능하다.   
### 로그인 
 <img src=" 로그인 설명 URL ">

 - jwt 활용 
 - DB에서 id 및 password 값 검증
 - 로그인 시 jwt 발급: Session storage에 저장하고 이용
   Token의 값은 있지만 isDormant 속성 값이 true의 경우 '활성화 페이지'로 이동 
 - '로그아웃' 또는 브라우저 창을 닫으면 Sessiong storage에서 제거된다. 

### 회원관리
  <img src=" 회원관리 URL ">

 - 회원가입 시 Admin으로 가입했다면 특정 회원을 '전체 검색' 또는 '회원 이름'을 통해 검색이 가능하다. 
 - Edit '회원 정보' 중 주소 또는 member Role을 변경할 수 있다.   

### 화상 채팅 기능 & 1:1 메세지 가능 
  <img src=" 화상 채팅 설명 URL ">
 
 - WebRTC!!
 - camera 설정: cam_config.png를 참조하여 **구글 크롬에서 카메라 연결 설정** 을 알려준다. 
 - droid cam(window/Mac os 가능)을 검색해서 다운로드 후 보조 캠 용도로 사용이 가능하다.   
 - DataChanne를 통한 메세지 기능: **상대방 peer에게 메세지 전달**이 가능하고 카메라를 보면서 채팅도 가능하다.   

### 고객센터 (채팅창) 
   <img src=" 채팅 설명 URL "> 채팅창 욕하는 거 추가 
 
 - '웹 소켓' or 소켓 
 - 우선 채팅방의 이름을 입력(숫자, 문자 가능)하고 입장한다. 
 - **메세지**뿐만 아니라 **사진 및 동영상도** 업로드가 가능합니다.
 - 대화 참가자가 채팅방을 Exit 버튼을 누르고 퇴장하면 Home 으로 이동하고 **(아이디)님이 퇴장하였습니다** 메세지가 나옵니다.
 

### 로봇 판매/구매 매칭 기능 
  <img src=" 등록/구매/판매/배송 설명 URL ">
 
 - REST API 개인 또는 회사가 거래를 등록하고 누구나(수요자)는 판매되고 있는 리스트에서 선택하여 '주문' 또는 '미리담기'를 할 수 있습니다.  
 - 우선 판매자(공급자, 누구나 가능)가 회사 로고 사진 및 판매 가능한 로봇의 동영상 파일 또는 glb파일을 등록한다. 
 - 판매자들이 등록해 놓은 곳(메뉴 바에서 로봇 이미지 클릭)거래 가능한 상품을 **미리 담기** 또는 **바로 주문**이 가능하다.
 - **미리 담기**(메뉴 바에서 카트 모양 )에서 본인이 담은 상품 목록을 확인할 수 있고 여기에서 **주문**이 바로 가능하다.
 - **결제 상품 보기**(메뉴 바에서 카드 모양)에서 본인이 결제했던 **전자 영수증** 확인이 가능하다.  
 - 판매자가 등록한 판매 영수증과 **배송 상태**를 변경할 수 있다. 

  <br/>

## 배포
 - **Front End:** Netlify 
 - **Back End:** Heroku 

## 시작 가이드
### Backend 
npm run start:dev 
### Frontend
npm run start