## Users

### Endpoints (protected)
- `GET /api/v1/users/profile`
- `PUT /api/v1/users/profile`
- `GET /api/v1/users/addresses`
- `POST /api/v1/users/addresses`
- `PUT /api/v1/users/addresses/:id`
- `DELETE /api/v1/users/addresses/:id`

### Examples
```
PUT /api/v1/users/profile
{
  "phone": "+20123456789",
  "profile": { "firstName": "John", "lastName": "Doe" }
}
```


