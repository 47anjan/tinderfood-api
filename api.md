## auth

- POST /login
- POST /signup
- POST /logout

## profile

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## request

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## user

- GET /user/connections
- GET /user/requests/received
- GET /user/feed
