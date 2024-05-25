# Node Auth API

## Register User

- **URL:** `http://localhost:4545/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "fullname": "Erkinov Ulugbek",
    "phone": "+998998359015",
    "password": "123456",
    "balance": 0,
    "photo": "image.jpg"
  }
Login User
URL: http://localhost:4545/api/auth/login
Method: POST
Body:
json
Copy code
{
  "phone": "+998998359015",
  "password": "1234567"
}
Category
Create Category:

URL: http://localhost:4545/api/category
Method: POST
Body:
json
Copy code
{
  "name": "Transport",
  "type": "chiqim",
  "photo": "image.jpg"
}
Get All Categories:

URL: http://localhost:4545/api/category
Method: GET
Headers: {"token": {{token}}}
Update Category:

URL: http://localhost:4545/api/category/{categoryId}
Method: PATCH
Headers: {"token": {{token}}}
Body:
json
Copy code
{
  "name": "Ish haqqi",
  "type": "kirim",
  "photo": "image.jpg"
}
Delete Category:

URL: http://localhost:4545/api/category/{categoryId}
Method: DELETE
Headers: {"token": {{token}}}
Get Category by ID:

URL: http://localhost:4545/api/category/{categoryId}
Method: GET
Headers: {"token": {{token}}}
Users
Get All Users:

URL: http://localhost:4545/api/users
Method: GET
Headers: {"token": {{token}}}
Update User Password:

URL: http://localhost:4545/api/users/{userId}
Method: PATCH
Headers: {"token": {{token}}}
Body:
json
Copy code
{
  "password": "1234567"
}
Transactions
Create Transaction:

URL: http://localhost:4545/api/transaction
Method: POST
Headers: {"token": {{token}}}
Body:
json
Copy code
{
  "amount": 5000,
  "type": "chiqim",
  "categoryId": categoryId
}
Update Transaction:

URL: http://localhost:4545/api/transaction/{categoryId}
Method: PATCH
Headers: {"token": {{token}}}
Body:
json
Copy code
{
  "amount": 15000,
  "type": "kirim",
  "categoryId": categoryId
}
Get All Transactions:

URL: http://localhost:4545/api/transaction
Method: GET
Headers: {"token": {{token}}}
Get Balance by Transaction ID:

URL: http://localhost:4545/api/balance/{transactionId}
Method: GET
Headers: {"token": {{token}}}
Delete Transaction by ID:

URL: http://localhost:4545/api/transaction/{transactionId}
Method: DELETE
Headers: {"token": {{token}}}
