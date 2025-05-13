# School Vaccination Portal – FSAD Assignment

A full-stack web application to manage school student vaccination drives, developed using **React (frontend)** and **NodeJs (backend)**.

This portal allows the school coordinator to:
- Add/edit/search students
- Schedule vaccination drives
- Upload student details via CSV
- Export vaccinated student details as CSV

---

## Features

### Authentication
- Hardcoded login (username: `admin`, password: `password123`)

###  Student Management
- Add student details
- Bulk addition of student details using CSV
- Filter student details with names

### Vaccination Drives
- Create vaccination drives
- Edit drive details i.e. number of slots available
- Date of the drives should be 15 days+ in the future

### Vaccination Status
- Mark students as vaccinated as per the vaccination drive that is selected

### Dashboard
- Total count of student shown
- Count of students vaccinated along with the percentage shown
- Upcoming drive displayed

### Reports
- Full vaccination history of the student viewable
- Completed CSV file can be download
- Filter using the vaccine name and download as CSV

---

## Tech Stack
|Layer	    |Technology	            |Purpose                        |
|-----------|-----------------------|-------------------------------|
|Backend	|Node.js, Express.js	|Server, API, Routing           |
|Database	|MongoDB	            |Data storage                   |
|Frontend	|React.js	            |User Interface                 |
|Styling	|CSS	                |Styling React components       |
|Dev Tools	|npm, Git	            |Dependency & Version Management|
|Config	    |.env	                |Environment Variables          |

---

## Folder Structure

```
vaccination_portal/
├── backend/          
│   ├── server.js
│   ├── models
│   └── routes/
├── frontend/         
    ├── src/
        └── components/
        └── App.js/
        └── styles.css
```

---

## Running the application

### 1. Backend Setup 
```bash
cd backend
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm start
```

> Backend runs on `http://localhost:5000`
> Once **npm start** is run, the frontend will directly open in the browser

---

## 3. Login Credentials
- **Username:** `admin`
- **Password:** `password123`

---