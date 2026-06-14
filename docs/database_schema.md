## Table `creators`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |
| `social_links` | `jsonb` |  Nullable |
| `is_active` | `bool` |  Nullable |
| `gg_code` | `text` |  Nullable |
| `is_nsfw` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |

## Table `item_categories`

Junction: Maps multiple categories to an item

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `item_id` | `uuid` | Primary |
| `category_id` | `uuid` | Primary |

## Table `user_collections`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `item_id` | `uuid` |  Nullable |
| `condition` | `text` |  Nullable |
| `notes` | `text` |  Nullable |
| `purchase_date` | `date` |  Nullable |
| `purchase_price` | `numeric` |  Nullable |
| `purchase_location` | `text` |  Nullable |
| `creator_code` | `text` |  Nullable |
| `added_at` | `timestamptz` |  Nullable |

## Table `items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Nullable |
| `image_url` | `text` |  Nullable |
| `release_date` | `date` |  Nullable |
| `item_type` | `text` |  |
| `collection_id` | `uuid` |  Nullable |
| `description` | `text` |  Nullable |
| `limited` | `bool` |  Nullable |
| `retired` | `bool` |  Nullable |
| `retail_price` | `numeric` |  Nullable |
| `material` | `text` |  Nullable |
| `external_id` | `text` |  Nullable Unique |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `artist` | `uuid` |  Nullable |
| `creator_id` | `uuid` |  Nullable |
| `season` | `text` |  Nullable |

## Table `profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `username` | `text` |  Unique |
| `display_name` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |
| `avatar_url` | `text` |  Nullable |
| `bio` | `text` |  Nullable |
| `is_public` | `bool` |  Nullable |
| `show_nsfw` | `bool` |  Nullable |
| `role` | `text` |  Nullable |
| `updated_at` | `timestamp` |  Nullable |

## Table `user_wishlists`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `item_id` | `uuid` |  Nullable |
| `priority` | `int2` |  Nullable |
| `added_at` | `timestamp` |  Nullable |
| `status` | `text` |  Nullable |

## Table `collections`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `year` | `int8` |  Nullable |
| `type` | `text` |  Nullable |
| `description` | `text` |  Nullable |
| `slug` | `text` |  Nullable Unique |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `item_creators`

A linking table for groups of items/collabs

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `item_id` | `uuid` | Primary |
| `creator_id` | `uuid` | Primary |

## Table `item_images`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `item_id` | `uuid` |  Nullable |
| `image_url` | `text` |  |
| `display_order` | `int4` |  Nullable |

## Table `artists`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `links` | `jsonb` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `item_artist`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `item_id` | `uuid` | Primary |
| `artist_id` | `uuid` | Primary |
| `role` | `text` |  Nullable |

