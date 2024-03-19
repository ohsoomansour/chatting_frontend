
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
 
 - path: /admin
 - 관리자 회원 인증 방법: **UseGuards 데코레이터(Nesgjs 제공)**와 **AuthGuard 클래스**를 사용하여 Reflector 인터페이스 를 통해 현재 요청 핸들러에서 인증이 필요한 값(Role['admin'])을 불러오고 이 'admin'값이 **jwt Middleware**에서 입력한 '로그인 사용자의 정보'를 현재 request 파이프 라인을 기술한 **ExecutionContext 인터페이스**를 통해 사용자의 memberRole 속성 값이 'admin' 인지 확인한다.  

 - 회원가입 시 admin으로 가입했다면 특정 회원을 '전체 검색' 또는 '회원 이름'을 통해 검색이 가능하다. 
 - Edit '회원 정보' 중 주소 또는 member Role을 변경할 수 있다.   

### 📷화상 채팅 기능 & 1:1 메세지 가능  
  **camera 설정**: cam_config.png를 참조하여 **구글 크롬에서 카메라 연결 설정** 을 알려준다. 
  <img src=" https://github.com/ohsoomansour/Trader/assets/98678172/40c2a096-9775-4099-88f2-c33b4c124ac9 "> 
  
  <img src=" 화상 채팅 설명 URL ">
 
 #### WebRTC (F/E: conference.tsx, B/E: events.gateway.ts 파일을 참조)
 - 1.**socket**을 통해 room에 참가할 수 있도록 설정 
 - 2.초기 방을 참가할 때 누구나 myStream (MediaStream인터페이스)에 접촉 할 수 있도록 **양쪽 peer에 PeerConnection인스턴스**를 생성 후 offer/answer를 통해 sdp를 설정한다.    
 - 3.본인(peer B)이 room에 참가하고 상대 peer(peer A)가 참가하면 'addstream'이벤트가 발생되어상대의 stream이 추가되고 상대 cam을 추가한다. 
   4.**ICE candidate(실제 연결)**: offer를 보낸 상대방(peer A)이 answer를 받는 시점에 icecandidate이벤트가 발생하고 상대의 IP주소와 port를 인식하기 위해 **STUN 서버**를 사용한다.  
 - 5.DataChannel를 통한 메세지 기능: **상대방 peer에게 메세지 전달**이 가능하고 '카메라'를 보면서 '채팅'도 가능하다.   
 - *droid cam(window/Mac os 가능)을 검색해서 다운로드 후 보조 캠 용도로 사용이 가능   

### 고객센터 (채팅창) 
   <img src=" 채팅 설명 URL "> 
 
 - '웹 소켓'과 '소켓'을 사용하여 채팅 기능 구현 
 - 우선 채팅방의 이름을 입력(숫자, 문자 가능)하고 입장한다. 
 - 메세지뿐만 아니라 **AWS S3**에 업로드하고 URL을 사용하여 '사진 및 동영상'도 메세지를 보낼 때 같이 사용이 가능하다.
 - 채팅창에서 욕설 내용은 ***로 필터 (Trader(B/E)프로젝트의 event.gateways.ts파일 messageFunction 함수 참조) 
 - 대화 참가자가 채팅방을 Exit 버튼을 누르고 퇴장하면 Home 으로 이동하고 **(아이디)님이 퇴장하였습니다** 메세지가 나옵니다.
 

### 로봇 판매/구매 매칭 기능 
  <img src=" 등록/구매/판매/배송 설명 URL ">
 
 - **r3f**를 통한 로봇 3d파일 업로드 
 - **REST API** 개인 또는 회사가 거래를 등록하고 누구나(수요자)는 판매되고 있는 리스트에서 선택하여 '주문' 또는 '미리담기'를 할 수 있습니다.  
 - 우선 판매자(공급자, 누구나 가능)가 회사 로고 사진 및 판매 가능한 로봇의 동영상 파일 또는 glb파일을 등록한다. 
 - 판매자들이 등록해 놓은 곳(메뉴 바에서 로봇 이미지 클릭)거래 가능한 상품을 **미리 담기** 또는 **바로 주문**이 가능하다.
 - **미리 담기**(메뉴 바에서 카트 모양 )에서 본인이 담은 상품 목록을 확인할 수 있고 여기에서 **주문**이 바로 가능하다.
 - **결제 상품 보기**(메뉴 바에서 카드 모양)에서 본인이 결제했던 **전자 영수증** 확인이 가능하다.  
 - 판매자가 등록한 판매 영수증과 **배송 상태**를 변경할 수 있다. 


## 배포
 - **Front End:** Netlify 
 - **Back End:** Heroku 

## 개발 시작 가이드
### Backend 
npm run start:dev 
### Frontend
npm run start