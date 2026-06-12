# NeoLoop Backend

## Overview

NeoLoop is an AI-powered Escape Room Platform that allows creators to build and publish escape room experiences while enabling players to explore rooms, solve puzzles, collect items, and compete on leaderboards.

This repository contains the Backend API built using:

* Python Flask
* PostgreSQL
* SQLAlchemy
* Alembic
* JWT Authentication
* Marshmallow Validation
* Swagger Documentation

---

# Current Progress

## Sprint 1 - Backend Foundation

Completed:

* Flask Project Setup
* PostgreSQL Integration
* SQLAlchemy Configuration
* Alembic Migration Setup
* Environment Configuration
* Base Model Structure
* Initial Database Schema Design
* Entity Relationship Design
* Complete Database Models
* Initial Migration Creation
* Role Seeding
* JWT Authentication
* Register API
* Login API
* Profile API
* Forgot Password API
* Reset Password API
* Change Password API
* Logout API
* Role-Based Authorization
* Marshmallow Request Validation
* Global Exception Handling
* Swagger Documentation

## Sprint 2 - Room Management

Completed:

* Create Room API
* Update Room API
* Delete Room API
* Get Room Details API
* My Rooms API
* Publish Room API
* Unpublish Room API

In Progress:

* Room Object APIs
* Room Item APIs

---

# Project Structure

backend/

├── app.py

├── config/

├── models/

├── repositories/

├── services/

├── blueprints/

├── validators/

├── middleware/

├── utils/

├── migrations/

└── tests/

---

# Technology Stack

Backend Framework:

* Flask 3

Database:

* PostgreSQL

ORM:

* SQLAlchemy

Migration Tool:

* Alembic

Authentication:

* JWT

API Documentation:

* Swagger

---

# Environment Variables

Create .env File

Create a .env file in the backend root folder using the values from .env.example.

APP_ENV=development

SECRET_KEY=<secret>

JWT_SECRET_KEY=<jwt-secret>

DB_HOST=localhost

DB_PORT=5432

DB_NAME=neoloop

DB_USER=postgres

DB_PASSWORD=<password>

---

# Installation

Create Virtual Environment (First Time Only):

python -m venv venv

Activate Virtual Environment:

Windows:

venv\Scripts\activate

Linux:

source venv/bin/activate

Install Dependencies:

pip install -r requirements.txt

---

# Ensure PostgreSQL Database Exists

CREATE DATABASE neoloop;

If the database already exists, skip this step.

Apply Latest Database Migrations:

flask db upgrade

This will create/update all required tables in the local database.

Verify Migration Version:

flask db current

Run Application:

python app.py

---
# Swagger Documentation

After starting the application:

http://127.0.0.1:5000/apidocs

Swagger UI provides interactive API testing and documentation.

#  Authentication APIs

Public APIs

POST /api/auth/register

POST /api/auth/login

POST /api/auth/request-password-reset

POST /api/auth/reset-password

Protected APIs

GET /api/auth/me

POST /api/auth/change-password

POST /api/auth/logout

#  Room APIs

Protected APIs:

POST /api/rooms

PUT /api/rooms/{room_id}

DELETE /api/rooms/{room_id}

GET /api/rooms/{room_id}

POST /api/rooms/my-rooms

POST /api/rooms/{room_id}/publish

POST /api/rooms/{room_id}/unpublish

# Core MVP Modules

Authentication

* Register
* Login
* Forgot Password
* Reset Password
* Profile

Room Management

* Rooms
* Room Objects
* Room Items

Puzzle Engine

* Puzzles
* Puzzle Dependencies

Gameplay

* Game Sessions
* Inventory
* Progress Tracking

Leaderboard

* Scores
* Rankings

---

# Database Entities

Authentication:

roles
users

Room Builder:

rooms
room_objects
room_items

Gameplay:

puzzles
puzzle_dependency
game_sessions
game_progress
player_inventory

Community:

leaderboard

---

# Next Steps

## Phase 2.2 - Room Builder

Room Objects

* Create Object API
* Update Object API
* Delete Object API
* List Room Objects API

Room Items

* Create Item API
* Update Item API
* Delete Item API
* List Room Items API

Target:
Complete Room Builder MVP

# Future Roadmap

Phase 3 - Room Discovery

* Public Room Browser
* Room Details
* Search & Filters

Phase 4 - Gameplay

* Game Sessions
* Puzzle Engine
* Inventory System
* Progress Tracking
* Time Loop Engine

Phase 5 - AI Features

* Prompt-Based Room Generation
* AI Story Generation
* AI Puzzle Suggestions

Phase 6 - Vision AI

* Room Photo Upload
* Room Video Upload
* Object Detection
* Scene Understanding

Phase 7 - Community

* Leaderboards
* Ratings & Reviews
* Challenge My Room

Phase 8 - Production

* Security Hardening
* Monitoring
* Performance Optimization
* Public Release