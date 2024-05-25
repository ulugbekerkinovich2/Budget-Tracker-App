# node-auth
REGISTER:
    url : http://localhost:4545/api/auth/register -> POST
    body: {
        "fullname": "Erkinov Ulugbek",
        "phone": "+998998359015",
        "password": "123456",
        "balance": 0,
        "photo": "image.jpg"
    }

LOGIN:
    url: http://localhost:4545/api/auth/login -> POST
    body: {
        "phone": "+998998359015",
        "password": "1234567"
    }

CATEGORY:
    url: http://localhost:4545/api/category -> POST
    body: {
        "name": "Transport",
        "type": "chiqim",
        "photo": "image.jpg"
    }

    url: http://localhost:4545/api/category -> GET
    headers: {
        "token": {{token}}
    }

    url: http://localhost:4545/api/category/{categoryId} -> PATCH
    headers: {
        "token": {{token}}
    }
    body: {
        "name": "Ish haqqi",
        "type": "kirim",
        "photo": "image.jpg"
    }

    url: http://localhost:4545/api/category/{categoryId} -> DELETE
    headers: {
        "token": {{token}}      
    }

    url: http://localhost:4545/api/category/{categoryId} -> GET
    headers: {
        "token": {{token}}       
    }

USERS:
    url: http://localhost:4545/api/users -> GET
    headers: {
        "token": {{token}}       
    }

    url: http://localhost:4545/api/users/{userId} -> PATCH
    headers: {
        "token": {{token}}    
    }
    body: {
        "password": "1234567"
    }

TRANSACTIONS:
    url: http://localhost:4545/api/transaction -> POST
    headers: {
        "token": {{token}}    
    }
    body: {
        "amount": 5000,
        "type": "chiqim",
        "categoryId": categoryId
    }

    url: http://localhost:4545/api/transaction/{categoryId} -> PATCH
    headers: {
        "token": {{token}}   
    }
    body: {
        "amount": 15000,
        "type": "kirim",
        "categoryId": categoryId
    }

    url: http://localhost:4545/api/transaction -> GET
    headers: {
        "token": {{token}}
    }

    url: http://localhost:4545/api/balance/{transactionId} -> GET
    headers: {
        "token" {{token}}
    }

    url: http://localhost:4545/api/transaction/{transactionId} -> DELETE
    headers: {
        "token" {{token}}
    }#   B u d g e t - T r a c k e r - A p p  
 