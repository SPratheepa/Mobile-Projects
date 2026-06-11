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

Public APIs:

POST /api/auth/register

POST /api/auth/login

POST /api/auth/request-password-reset

POST /api/auth/reset-password

Protected APIs:

GET /api/auth/me

POST /api/auth/change-password

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

roles

users

rooms

room_objects

room_items

puzzles

puzzle_dependency

game_sessions

game_progress

player_inventory

leaderboard

---

# Next Steps

## Phase 2 - Room Management

Room APIs:

Create Room
Update Room
Delete Room
Publish Room
List Rooms
Room Details

Room Objects:

Add Object
Update Object
Delete Object

Room Items:

Add Item
Update Item
Delete Item

Puzzle Management:

Create Puzzle
Update Puzzle
Puzzle Dependency Graph

Target: Complete Room Builder MVP.
