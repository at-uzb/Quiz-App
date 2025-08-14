# Quiz-App

| Method | Endpoint               | Description              | Auth Required          |
| ------ | -------------------    | ------------------------ | -----------------------|
| POST   | `/auth/signup/`        | Register a new user      | No                     |
| POST   | `/auth/login/`         | Login & get JWT tokens   | No                     |
| POST   | `/auth/logout/`        | Logout user              | Yes                    |
| GET    | `/users/<username>/`   | Get user profile         | Yes                    |
| PATCH  | `/users/me/update/`    | Update current profile   | Yes                    |
| PATCH  | `/users/verify-email/` | Verify email address     | No just id  with code  |
