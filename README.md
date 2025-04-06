
# Employee Management System - Backend
### Overview
This is a backend application developed as part of an Employee Management System. The application is designed to manage employee data using the GraphQL API. It allows users to perform various operations such as adding, updating, deleting, and retrieving employee records. The backend is built using Node.js, Express, GraphQL, and MongoDB.

As part of the development process, I have integrated GitHub for version control and utilized DevOps practices to manage the deployment pipeline.

Technologies Used
Node.js: JavaScript runtime used to build the server-side application.
Express.js: Web framework for Node.js that simplifies routing and middleware handling.
GraphQL: Query language for APIs, enabling flexible data fetching from a single endpoint.
MongoDB: NoSQL database used to store employee data.
Mongoose: ODM (Object Data Modeling) library to interact with MongoDB.
GitHub: Version control system to manage the codebase.


## Elio Fezollari 101410182




# Employee Management System - Frontend

### Overview
This is the **frontend application** developed as part of the **Employee Management System** project.  
The application provides a clean and interactive user interface for managing employee data, enabling users to view, search, create, update, and delete employee records.  
The frontend communicates with the backend GraphQL API to fetch and manipulate data.

As part of the development process, GitHub was used for version control, and the project follows modern DevOps best practices to ensure maintainable and scalable deployment pipelines.

---

### Technologies Used

- **Angular**: Frontend web application framework for building dynamic single-page applications.
- **Apollo Angular**: GraphQL client for Angular used to query and mutate data efficiently.
- **GraphQL**: API query language that enables flexible and efficient data fetching.
- **HTML5 & CSS3**: Markup and styling to create responsive, user-friendly interfaces.
- **TypeScript**: Strongly typed language that builds on JavaScript, used throughout the Angular project.
- **GitHub**: Version control system to track and manage the project source code.

---

### Key Features

- **Employee List View**: View all employees in a tabular format with detailed information.
- **Employee Search**: Search employees by department or designation using GraphQL search queries.
- **Create Employee**: Add a new employee to the database with complete details.
- **Update Employee**: Modify existing employee information.
- **Delete Employee**: Remove an employee record securely.
- **View Employee Details**: See a detailed profile view of an employee.
- **Authentication Flow**: Logout functionality and token-based session management.
- **Reusable Navbar**: A global navbar available across all pages for consistent navigation and logout functionality.

---

### Project Structure

- **Components**: Modular, standalone Angular components like Employee List, Employee View, Employee Create, Update, and Navbar.
- **GraphQL Queries and Mutations**: Integrated via Apollo Angular to communicate with the backend API.
- **Routing**: Angular Router handles navigation between different pages (list, view, update, create, etc.).
- **State Management**: Apollo Client manages query states like loading, errors, and success responses.

---

### Running the Frontend Locally

```bash
# Install dependencies
npm install

# Start the Angular application
ng serve --open

# The app will be available at:
# http://localhost:4200
