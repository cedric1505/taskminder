📝 TaskMinder
A lightweight, full-stack task management application built to demonstrate CRUD operations and secure user authentication. Designed as a personal productivity tool to track daily tasks with priority levels.   

🚀 Key Features
User Authentication: Secure Login and Registration using JWT (JSON Web Tokens) and bcrypt password hashing.   
Task Management: Add and Delete tasks dynamically.
Priority System: Categorize tasks by urgency (Low, Medium, High).   
Persistent Data: All data is stored securely in MongoDB.
Responsive UI: Clean, minimalist interface built with Vanilla JS and CSS.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (Fetch API)
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ODM)
Authentication: JWT, Bcrypt.js   

📦 How to Run Locally
Clone the repo:
Bash
git clone https://github.com/cedric1505/taskminder.git
cd taskminder

Install dependencies:
Bash
npm install

Configure Environment: Create a .env file in the root directory and add:
Code snippet
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Start the server:
Bash
npm start
Open http://localhost:5000 in your browser.
