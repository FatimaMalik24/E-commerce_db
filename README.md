# E-commerce Backend API Documentation

This repository contains a Node.js backend for an E-commerce platform.  
The API uses **Express**, **MongoDB**, **JWT authentication**, and **role-based authorization**.

## Table of Contents

- [Auth](#auth)
  - [Register User](#register-user)
  - [Login](#login)
- [Brands](#brands)
  - [Get All Brands](#get-all-brands)
  - [Create Brand](#create-brand)
- [Products](#products)
  - [Get All Products](#get-all-products)
  - [Create Product](#create-product)
- [Notes](#notes)

## Auth

### Register User

- **Method:** POST  
- **URL:** `/api/auth/register`  
- **Headers:**
  ```http
  Authorization: Bearer <super_admin_token>
  Content-Type: application/json
