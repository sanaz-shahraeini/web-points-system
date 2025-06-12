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
- 📧 Email functionality with Nodemailer
- 📈 Data visualization with Recharts

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
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

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
user-dashboard/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
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



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
