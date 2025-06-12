# Web Points System

A modern, feature-rich user dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This project provides a comprehensive user management system with authentication, user profiles, and a beautiful UI using Radix UI components.

## Features

- 🚀 Built with Next.js 15 and React 19
- 💻 TypeScript for type safety
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🔐 Authentication with NextAuth.js
- 📊 Database integration with Prisma
- 📱 Responsive design
- 🌙 Dark mode support


## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sanaz-shahraeini/web-points-system.git
cd user-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Authentication System

The project uses NextAuth.js for authentication with a custom Credentials provider. The authentication flow includes:

### Login Process
- Users enter their email and password
- Credentials are validated against the database
- JWT session is created upon successful authentication
- Users are redirected to the dashboard

### Signup Process
- New users provide name, email, and password
- System checks for existing users
- Password is hashed using bcrypt
- New user is created in the database
- User is automatically logged in

### Session Management
- JWT-based session handling
- Secure session storage
- Automatic session validation
- Session duration: 30 days (configurable in `lib/auth.ts`)
- Session strategy: JWT (JSON Web Token)
- Session data includes: user ID, email, and name

## API Endpoints

### Authentication (NextAuth.js)

#### POST `/api/auth/[...nextauth]`

- **Login**
  - **Body:**  
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  - **Response:**  
    - Success: User session is created
    - Failure: Error message

- **Signup**
  - **Body:**  
    ```json
    {
      "name": "Sanaz Shahraeini",
      "email": "user@example.com",
      "password": "yourpassword",
      "isSignUp": true
    }
    ```
  - **Response:**  
    - Success: User is created and session is started
    - Failure: Error message (e.g., user already exists)

#### GET `/api/auth/session`
- **Purpose:** Get the current authenticated session
- **Response:**  
  ```json
  {
    "user": {
      "id": "userId",
      "email": "user@example.com",
      "name": "Sanaz Shahraeini"
    },
    "expires": "2024-07-01T12:00:00.000Z"
  }
  ```

#### POST `/api/auth/signout`
- **Purpose:** Sign the user out and destroy the session

### Wallet Management

#### GET `/api/wallet`
- **Purpose:** Get user's wallet balance and points
- **Response:**
  ```json
  {
    "balance": "100.00",
    "points": 1000
  }
  ```

#### POST `/api/wallet/charge`
- **Purpose:** Add funds to user's wallet
- **Body:**
  ```json
  {
    "amount": 50.00
  }
  ```
- **Response:**
  - Success: Wallet charged successfully
  - Failure: Error message

#### POST `/api/wallet/convert`
- **Purpose:** Convert wallet balance to points ($1 = 100 points)
- **Body:**
  ```json
  {
    "amount": 10.00
  }
  ```
- **Response:**
  - Success: Conversion successful
  - Failure: Error message

### Points Management

#### POST `/api/points/transfer`
- **Purpose:** Transfer points to another user
- **Body:**
  ```json
  {
    "recipientUsername": "recipient@example.com",
    "points": 100
  }
  ```
- **Response:**
  - Success: Points transferred successfully
  - Failure: Error message

### Transaction History

#### GET `/api/transactions`
- **Purpose:** Get user's transaction history
- **Response:**
  ```json
  [
    {
      "id": "tx_id",
      "type": "TRANSFER",
      "amount": "+ 100 points",
      "description": "Transferred 100 points to user@example.com",
      "date": "2024-03-20T10:00:00.000Z",
      "party": "To: user@example.com"
    }
  ]
  ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
user-dashboard/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   │   └── auth/    # Authentication endpoints
├── components/       # Reusable UI components
│   └── auth-forms.tsx # Authentication forms
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
│   ├── auth.ts      # NextAuth configuration
│   └── prisma.ts    # Database client
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── styles/          # Global styles and Tailwind configuration
```

## Technologies Used

- **Frontend Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Database ORM**: Prisma
- **Form Handling**: React Hook Form
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **Session Management**: JWT

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Protected API routes
- Secure cookie handling
- CSRF protection
- Rate limiting on authentication endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
