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
