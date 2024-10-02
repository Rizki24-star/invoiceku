# WidaTech Technical Test

## Description
This project is a full-stack application developed using React for the client-side and Node.js for the server-side. The application aims to demonstrate my skills in building responsive and functional web applications.

## Getting Started
To get the project up and running locally, follow these steps.

## Installation
### Client (React)
Navigate to the client directory:


cd client


Install dependencies:


npm install.
### Server (Node)
Navigate to the server directory:


cd server


Install dependencies:


npm install


## Usage
To run the project, use the following commands.

Running the Client

cd client

npm run start

Running the Server

cd server

npx prisma migrate dev --name init

npm run dev

## Client-Side (React)
The client-side is built using React. It includes components for user interface, routing, and state management.

## Server-Side (Node.js)
The server-side is built using Node.js and Express. It manages API endpoints and database interactions.

## API Documentation
 /api/products	GET	Fetches products data  
 /api/invoices	GET	Fetches invoices data  
 /api/invoices/create POST Creates new invoices data 

## Contact
For questions or feedback, please reach out to Rizki Okto S at kikingar.567@gmail.com

## posgressql
-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customer_name" TEXT NOT NULL,
    "salesperson_name" TEXT NOT NULL,
    "notes" TEXT,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stocks" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_product" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sub_total" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoice_product" ADD CONSTRAINT "invoice_product_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_product" ADD CONSTRAINT "invoice_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
