# Quiz-App

| Method | Endpoint            | Description              | Auth Required |
| ------ | ------------------- | ------------------------ | ------------- |
| POST   | `/auth/signup/`     | Register a new user      | No            |
| POST   | `/auth/login/`      | Login & get JWT tokens   | No            |
| POST   | `/auth/logout/`     | Logout user              | Yes           |
| GET    | `/users/me/`        | Get current user profile | Yes           |
| PATCH  | `/users/me/update/` | Update profile info      | Yes           |
