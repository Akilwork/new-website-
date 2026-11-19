# DocMe CMS REST API Documentation

- **Base URL**: `http://localhost:5000/api/v1`
- **Authentication**: Session-Based Cookie (`docme_sid`, `HttpOnly; SameSite=Lax`)
- **Roles**: `ADMIN`, `CONTENT_MANAGER`

---

## 1. Authentication (`/auth`)

### 1.1 Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@docme.com",
    "password": "Admin@123456"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "admin-seed-uuid-1",
        "email": "admin@docme.com",
        "name": "System Administrator",
        "role": "ADMIN"
      }
    }
  }
  ```

### 1.2 Current Session User
- **Endpoint**: `GET /api/v1/auth/me`
- **Access**: Authenticated (`ADMIN` or `CONTENT_MANAGER`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Session active",
    "data": {
      "user": {
        "id": "admin-seed-uuid-1",
        "email": "admin@docme.com",
        "name": "System Administrator",
        "role": "ADMIN"
      }
    }
  }
  ```

### 1.3 Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Access**: Authenticated
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully",
    "data": null
  }
  ```

---

## 2. Users Management (`/users`)

### 2.1 List All Users
- **Endpoint**: `GET /api/v1/users`
- **Access**: Authenticated

### 2.2 Create User
- **Endpoint**: `POST /api/v1/users`
- **Access**: `ADMIN` role required
- **Request Body**:
  ```json
  {
    "email": "editor@docme.com",
    "name": "Staff Editor",
    "role": "CONTENT_MANAGER"
  }
  ```

---

## 3. Pages Management (`/pages`)

### 3.1 List Website Pages
- **Endpoint**: `GET /api/v1/pages`
- **Access**: Public / Authenticated

### 3.2 Get Page by Slug
- **Endpoint**: `GET /api/v1/pages/:slug`
- **Access**: Public
- **Example**: `GET /api/v1/pages//about`

### 3.3 Create Page
- **Endpoint**: `POST /api/v1/pages`
- **Access**: `ADMIN` or `CONTENT_MANAGER`

---

## 4. Sections Management (`/sections`)

### 4.1 List Sections for Page
- **Endpoint**: `GET /api/v1/sections?pageId=page-about`
- **Access**: Public

### 4.2 Update Section Content
- **Endpoint**: `PATCH /api/v1/sections/:key`
- **Access**: `ADMIN` or `CONTENT_MANAGER`
- **Request Body**:
  ```json
  {
    "content": {
      "clipStart": 15,
      "scale": 1.1,
      "stats": [
        { "value": 2950, "suffix": "+", "label": "Active Member" }
      ]
    }
  }
  ```

---

## 5. Media Library (`/media`)

### 5.1 List Media Assets
- **Endpoint**: `GET /api/v1/media`
- **Access**: Public

### 5.2 Register Media Metadata
- **Endpoint**: `POST /api/v1/media`
- **Access**: `ADMIN` or `CONTENT_MANAGER`

---

## 6. Publishing & Revisions (`/publishing`)

### 6.1 List Revisions
- **Endpoint**: `GET /api/v1/publishing?pageId=page-home`
- **Access**: Authenticated

### 6.2 Submit Draft or Publish Revision
- **Endpoint**: `POST /api/v1/publishing`
- **Access**: `ADMIN` or `CONTENT_MANAGER`
- **Request Body**:
  ```json
  {
    "pageId": "page-about",
    "status": "PUBLISHED",
    "changelog": "Updated About video section scroll height and stats counter"
  }
  ```
