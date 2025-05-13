🎵 Harmonix – Collaboration & Messaging Module (Backend – Spring Boot)
🔗 Overview
This backend module powers the collaboration requests and real-time messaging system in the Harmonix platform — a music learning and social collaboration application. It enables users to:

Apply for job or collaboration posts

Communicate via in-app chat

Maintain secure, user-based messaging threads

🏗️ Features
✅ Collaboration Requests
Users can apply for any job post with a custom message.

Each request links the sender, receiver (post owner), and the target job post.

Requests are stored and managed through a dedicated CollaborationRequestController.

✅ Chat Thread System
On accepted collaboration, a Chat Head is created to manage the conversation thread.

Both sender and receiver can communicate via a REST-based chat.

Messages are linked to chatHeadId and stored in the MongoDB messages collection.

✅ REST API Endpoints
POST /api/collab/request – Send a collaboration message

GET /api/collab/received – View received requests

POST /api/chat/send – Send a chat message

GET /api/chat/inbox/{userId} – Get inbox chat heads

GET /api/chat/messages/{chatHeadId} – Get full conversation

🛠️ Tech Stack
Backend: Spring Boot (Java 17+)

Database: MongoDB (via Spring Data)

Security: Google OAuth2 + JWT (HttpOnly cookies)

Media: Cloudinary (for post/job uploads)

📂 Key Files & Structure
mathematica
Copy
Edit
├── controller/
│   ├── CollaborationRequestController.java
│   ├── ChatHeadController.java
│   └── MessageController.java
├── model/
│   ├── CollaborationRequest.java
│   ├── ChatHead.java
│   └── Message.java
├── service/
│   ├── CollaborationRequestService.java
│   ├── ChatHeadService.java
│   └── MessageService.java
├── repository/
│   ├── CollaborationRequestRepository.java
│   ├── ChatHeadRepository.java
│   └── MessageRepository.java
🔐 Security
JWT tokens are validated and decoded to extract authenticated user data.

Ownership is checked before allowing actions like chat or request access.

🚀 Status
✅ Completed: Backend logic
🧩 In Progress: Frontend integration for viewing requests, inbox, and chat
📅 Planned: Request status management (Pending / Accepted / Rejected)

