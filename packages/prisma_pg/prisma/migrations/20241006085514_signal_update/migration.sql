-- AlterTable
ALTER TABLE "GmgnSignal" ALTER COLUMN "token_price" DROP NOT NULL,
ALTER COLUMN "from_timestamp" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "buy_duration" DROP NOT NULL,
ALTER COLUMN "buy_usd" DROP NOT NULL,
ALTER COLUMN "tx_count" DROP NOT NULL,
ALTER COLUMN "signal_type" DROP NOT NULL,
ALTER COLUMN "smart_buy" DROP NOT NULL,
ALTER COLUMN "smart_sell" DROP NOT NULL,
ALTER COLUMN "signal_1h_count" DROP NOT NULL,
ALTER COLUMN "first_entry_price" DROP NOT NULL,
ALTER COLUMN "price_change" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL,
ALTER COLUMN "recent_buys" DROP NOT NULL,
ALTER COLUMN "is_first" DROP NOT NULL;
