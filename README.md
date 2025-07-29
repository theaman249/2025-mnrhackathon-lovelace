# Atlas - by Lovelace

<div align="center">
  <img src="img/lovelace.jpg" width="250"><br><br>
</div>

Atlas is a comprehensive platform for managing travel risk alerts and assessments. This system enables users to seamlessly interact with database assets that store risk levels for various destinations. It's a tool that can be utilized by travel agents and organizations to plan trips and evaluate insurance policies to take. Atlas is a product for #MonkeyAndRiverHackathon2025

## Tech Stack

<img src="img/react-512.webp" width="60">   <img src="img/Node.js_logo.svg" width="80">   <img src="img/postgresql.png" width="60">

**Frontend:** React - Provides a responsive and dynamic user interface for seamless user interaction

**Backend:** Node.js - Handles server-side logic, API endpoints, and database connectivity

**Database:** PostgreSQL - Robust relational database for storing travel risk data and user information

## Atlas Features

### Authentication and Authorization
Secure user authentication system with role-based access control. Users can login, and access features. 

### Session Management
Efficient session handling that maintains user state across the application. Sessions are securely managed with automatic token refresh and logout functionality;  for enhanced security. JWT tokens ensure secure session management and API access.

### Risk Assessment Dashboard
Interactive dashboard displaying real-time travel risk levels for various destinations with color-coded alerts and timestamps.

### Notification System
Comprehensive subsystem for changes made in the database, including additions and deletions.

### User Profile & Preferences
User friendly settings. Users can edit their profiles and customise their preferences.

## Set Up and Run Atlas

1. Clone the repository

    ```bash
    git clone https://github.com/theaman249/2025-mnrhackathon-lovelace
    cd 2025-mnrhackathon-lovelace
    ```

2. Set up the backend directory

    ```bash
    cd backend
    npm install
    npm run dev 
    ```

3. Set up the database in a new terminal

    ```bash
    cd backend
    npm run db:setup
    npm run db:migrate
    ```

4. Set up the frontend directory - in a new terminal

    ```bash
    cd frontend
    npm install
    npm run dev 
    ```

## Atlas Tests

To run the test suite:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Meet the Team (a.k.a Lovelies)

| | |
|:---:|:---:|
| <img src="img/Agape.jpeg" width="120" style="border-radius: 50%"><br>**Agape Mamphasa**<br>*Backend Engineer, Integration Engineer*<br>BSc(Hons) Computer Science Graduate<br>[LinkedIn](https://www.linkedin.com/in/agape-mamphasa-92022a2a9/) \| [GitHub](https://github.com/theaman249) | <img src="img/amanda.jfif" width="120" style="border-radius: 50%"><br>**Amanda Khuzwayo**<br>*Backend Engineer, Integration Engineer*<br>BSc(Hons) Computer Science Student<br>[LinkedIn](https://www.linkedin.com/in/amanda-khuzwayo-894130135/) \| [GitHub](https://github.com/Amanda9805) |
| <img src="img/mbofho.jfif" width="120" style="border-radius: 50%"><br>**Mbofho Mamatsharaga**<br>*Frontend Engineer, Integration Engineer*<br>BSc(Hons) Computer Science Student<br>[LinkedIn](https://www.linkedin.com/in/mbofho-mamatsharaga-54992823b/) \| [GitHub](https://github.com/TheStoryOfChampion) | <img src="img/kea.jpg" width="120" style="border-radius: 50%"><br>**Keabetswe Mothapo**<br>*Frontend Engineer, Integration Engineer*<br>BSc Information & Knowledge Systems Graduate<br>[LinkedIn](https://www.linkedin.com/in/keabetswe-mothapo/) \| [GitHub](https://github.com/keamothapo) |
