## Identity Management with C#/.NET and Angular

### A simple application to manage users accounts

This project is a simple example of how to manage users accounts using C#/.NET and Angular.

### Features

- Account registration with email confirmation
- Login and logout
- Authentication token-based (Bearer)
- Password recovery and reset
- User profile management
- Database management with migrations
- Email sender service
- Audit trail mechanism to track user actions
- Handling errors and exceptions globally
- Unit and integration tests

### Technologies

- C#/.NET 8.0
- Angular 17 (TypeScript)
- PrimeNG 12
- EF Core 8.0
- SQL Server
- Docker

### How to run

#### Prerequisites

If you want to run the application locally, you need to have the following tools installed on your machine:

- .NET SDK >= 7.0.0
- NPM >= 10.0.0
- Docker Engine >= 24.0.0 With Docker Compose

Or you can run the application using the [Dev Container](https://containers.dev/) feature of Visual Studio Code or the [GitHub Codespaces](https://docs.github.com/en/codespaces) feature.

#### Steps

1. Clone this repository to your local machine

```bash
git clone https://github.com/leoguilen/dotnet-angular-identitymgmt
```

2. Go to the project root folder

```bash
cd dotnet-angular-identitymgmt
```

3. Run the following command to execute the script that will deploy the environment

```bash
cd scripts && \
chmod +x deploy-local-environment.sh && \
./deploy-local-environment.sh apply local
```

4. Wait for the script to finish and access the following services with the URLs below:

- Web Application: http://localhost:3000
- Identity Provider Api (Docs): http://localhost:3001/swagger
- MailDev Server: http://localhost:1080

5. To stop the environment, run the following command:

```bash
./deploy-local-environment.sh destroy local
```

### Technical decisions

#### Architecture

The application was developed using the Clean Architecture approach, which is based on the separation of concerns and the dependency inversion principle. This approach allows the application to be more flexible and scalable, as well as facilitating the implementation of unit and integration tests.

#### Database

The database used in the application is SQL Server. The database is managed by EF Core, which is an ORM (Object Relational Mapper) that allows the application to be independent of the database engine.

#### Authentication

The authentication mechanism used in the application is token-based (Bearer). This mechanism allows building a stateless application, which is more flexible and scalable.

#### Audit Trail

The audit trail mechanism used in the application is based on the implementation of an interceptor that intercepts all database operations performed by the API. As a result, the application is able to track all user actions.

#### Error Handling

The error handling mechanism used in the application is based on the implementation of a global exception filter that intercepts all exceptions thrown by the API. The application is able to handle all exceptions in a single place.

#### Docker

The application was containerized using Docker. This allows working more faster and efficiently, as well as facilitating the deployment of resources such as databases and email servers, and the execution of the application in different environments.
