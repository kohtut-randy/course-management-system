# Course Management System

A modern, full-stack course management system built with Next.js 14, TypeScript, and TypeORM. This application allows users to create, manage, and organize courses with materials, featuring a clean dashboard interface and secure authentication.

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login/logout with Firebase Authentication and JWT sessions
- **Course Management**: Create, view, edit, and delete courses
- **Material Upload**: Upload various file types (PDFs, images, documents) to courses
- **Dashboard**: Beautiful dashboard with course statistics and activity graphs
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

### Dashboard Features

- **Course Statistics**: Total courses count and recent activity
- **Activity Graph**: Line chart showing course creation over time
- **Quick Links**: Easy navigation to course creation and management
- **Course Cards**: Visual course overview with descriptions and creation dates

### File Management

- **Multiple File Types**: Support for images, PDFs, text files, and documents
- **Secure Storage**: Files stored securely with user authorization
- **File Validation**: Size and type validation for uploaded materials

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **TypeORM** - Type-safe ORM for database operations
- **SQLite** - Lightweight database (development)
- **JWT** - JSON Web Token authentication

### Authentication & Storage

- **Firebase Authentication** - User authentication
- **JWT Sessions** - Secure session management
- **File System** - Local file storage with validation

## 📋 Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd course-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# JWT Secret (generate a secure random string)
JWT_SECRET=your_secure_jwt_secret_here

# Database (SQLite for development)
DATABASE_URL=./database.sqlite
```

### 4. Database Setup

The application automatically initializes the database on startup. The SQLite database file will be created in the project root.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Default Login Credentials

For testing purposes, you can use these default credentials:

- **Email**: hello@example.com
- **Password**: 12345678

## 📁 Project Structure

```
course-management-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── courses/       # Course management APIs
│   │   ├── courses/           # Course pages
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   ├── Header.tsx        # Navigation header
│   │   ├── CourseLineGraph.tsx # Activity chart
│   │   └── ...               # Other components
│   ├── entities/             # TypeORM entities
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── database/         # Database configuration
│   │   └── middleware/       # Authentication middleware
│   └── services/             # Business logic services
├── public/                   # Static assets
├── uploads/                  # Uploaded files storage
├── database.sqlite           # SQLite database (auto-generated)
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run docker-build # Build Docker image
npm run docker-run   # Run with Docker Compose
```

## 📖 Usage

### User Authentication

1. Visit the application - you'll be redirected to the login page
2. Sign in with your email and password
3. Upon successful login, you'll be redirected to the dashboard

### Managing Courses

1. **View Dashboard**: See course statistics and recent activity
2. **Create Course**: Click "Create New Course" to add a new course
3. **View Courses**: Browse your courses in card format
4. **Edit Course**: Click on any course card to view details and materials
5. **Delete Course**: Use the delete button in course details

### Managing Materials

1. **Upload Materials**: In course details, use the upload form
2. **View Materials**: See all uploaded materials with file information
3. **Edit Materials**: Update material titles and descriptions
4. **Delete Materials**: Remove materials with confirmation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Proper session handling with database storage
- **File Validation**: Size and type restrictions for uploads
- **User Authorization**: Users can only access their own courses and materials
- **Input Sanitization**: Proper validation and sanitization of user inputs

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
npm run docker-build

# Run with Docker Compose
npm run docker-run
```

### Docker Configuration

- Uses multi-stage build for optimized production images
- Includes SQLite database in container
- Exposes port 3000 for the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages, browser console logs, and steps to reproduce

## 🔄 Future Enhancements

- [ ] User roles and permissions
- [ ] Course categories and tags
- [ ] Student enrollment system
- [ ] Progress tracking
- [ ] Discussion forums
- [ ] File versioning
- [ ] Export functionality
- [ ] API documentation
- [ ] Unit and integration tests

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
