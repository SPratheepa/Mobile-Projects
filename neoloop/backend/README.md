# NeoLoop Backend

## Overview

NeoLoop is an AI-powered Escape Room Platform that allows creators to build and publish escape room experiences while enabling players to explore rooms, solve puzzles, collect items, and compete on leaderboards.

This repository contains the Backend API built using:

* Python Flask
* PostgreSQL
* SQLAlchemy
* Alembic
* JWT Authentication

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

In Progress:

* Complete Database Models
* Initial Migration Creation
* Role Seeding

Upcoming:

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

# Notes

During initial setup, the following issues were identified and resolved:

1. PostgreSQL connection string issue caused by special characters in passwords.

2. SQLAlchemy reserved keyword conflict using 'metadata' as a model attribute.

3. Model registration/import issues affecting Alembic migration detection.

These fixes have been incorporated into the current implementation.

---

# Next Steps

Phase 1.3

* JWT Setup
* Password Hashing
* Authentication Utilities
* Role-Based Authorization

Phase 1.4

* Register API
* Login API
* Profile API
* Forgot Password API
* Reset Password API

Target: Complete Sprint 1 Authentication Module.
