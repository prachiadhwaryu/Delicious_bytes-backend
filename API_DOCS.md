# Delicious Bytes Backend API Documentation

## Overview
This document provides an overview of the API endpoints for the Delicious Bytes backend. Each endpoint is described with its purpose, request method, URL, parameters, and response format.

## Base URL
```
http://localhost:3000/  (Local environment link)
```

## Endpoints

### User Authentication

#### Register a new user
- **URL:** `/users/register`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "password": "string",
        "confirmPassword": "string"
    }
    ```
- **Response:**
    ```json
    {
        "message": "User registered successfully",
        "userId": "string"
    }
    ```

#### Login
- **URL:** `/users/login`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response:**
    ```json
    {
        "token": "string",
        "userId": "string"
    }
    ```

### Recipes

#### Get all recipes
- **URL:** `/home/latest-recipes`
- **Method:** `GET`
- **Response:**
    ```json
    [
        {
            "id": "string",
            "name": "string",
            "firstImage": "string"
        }
    ]
    ```

#### View recipe
- **URL:** `/recipes/view-recipe/:{id}`
- **Method:** `GET`
- **Response:**
    ```json
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "prep_time": "number",
        "cook_time": "number",
        "total_time": "number",
        "cuisine": "string",
        "time_category": ["string"],
        "recipe_type": ["string"],
        "meal_category": ["string"],
        "ingredients": ["string"],
        "special_equipments": ["string"],
        "recipe_steps": ["string"],
        "images": ["string"],
        "chef_name": {"id": "string", "name": "string"}',
        "comments": {"commenter": "string", "comment": "string"},
        "recipe_video": "string",
        "upload_date": "string"
    }
    ```

#### Create a new recipe
- **URL:** `/recipes/upload-recipe`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "recipe_name": "string",
        "description": "string",
        "prep_time": "number",
        "cook_time": "number",
        "cuisine": "string",
        "time_category": ["string"],
        "recipe_type": ["string"],
        "meal_category": ["string"],
        "ingredients": ["string"],
        "special_equipments": ["string"],
        "recipe_steps": ["string"],
        "recipe_video": "string",
        "chef_name": "string",
        "images": ["string"]
    }
    ```
- **Response:**
    ```json
    {
        "message": "Recipe saved successfully",
        "recipeId": "string"
    }
    ```

## Error Handling
All error responses will have the following format:
```json
{
    "error": "string",
    "message": "string"
}
```

## Authentication
All endpoints, except for `/users/register` and `/users/login`, require a valid JWT token to be included in the `Authorization` header of the request:
```
Authorization: Bearer <token>
```

## Conclusion
This documentation provides a comprehensive guide to using the Delicious Bytes backend API. For any further questions or support, please contact [prachiadhwaryu@gmail.com](mailto:prachiadhwaryu@gmail.com).
