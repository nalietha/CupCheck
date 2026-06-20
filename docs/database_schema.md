## Table `creators`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |
| `social_links` | `jsonb` |  Nullable |
| `is_active` | `bool` |  |
| `gg_code` | `text` |  Nullable |
| `is_nsfw` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `image_url` | `text` |  Nullable |

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
| `is_favorite` | `bool` |  Nullable |
| `user_image_url` | `text` |  Nullable |

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
| `season` | `text` |  Nullable |
| `parent_item_id` | `uuid` |  Nullable |
| `variant_type` | `text` |  Nullable |
| `flavor_profile` | `text` |  Nullable |

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
| `is_public` | `bool` |  |
| `show_nsfw` | `bool` |  Nullable |
| `role` | `text` |  Nullable |
| `updated_at` | `timestamp` |  Nullable |
| `banner_url` | `text` |  Nullable |
| `status` | `text` |  Nullable |
| `theme` | `text` |  Nullable |
| `equipped_banner_id` | `uuid` |  Nullable |
| `equipped_title_id` | `uuid` |  Nullable |
| `equipped_badges` | `_uuid` |  Nullable |

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
| `is_active` | `bool` |  |

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
| `image_url` | `text` |  Nullable |

## Table `item_artist`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `item_id` | `uuid` | Primary |
| `artist_id` | `uuid` | Primary |
| `role` | `text` |  Nullable |

## Table `support_tickets`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `category` | `text` |  |
| `subject` | `text` |  |
| `description` | `text` |  |
| `status` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `collector_profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `started_collecting_date` | `date` |  Nullable |
| `collector_title` | `text` |  Nullable |
| `favorite_creator_id` | `uuid` |  Nullable |
| `favorite_collection_id` | `uuid` |  Nullable |
| `is_collection_public` | `bool` |  |
| `show_collection_stats` | `bool` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `item_submissions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `name` | `text` |  |
| `item_type` | `text` |  |
| `source_type` | `text` |  |
| `item_image_url` | `text` |  |
| `source_image_url` | `text` |  |
| `suggested_data` | `jsonb` |  Nullable |
| `status` | `text` |  Nullable |
| `admin_notes` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `item_types`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `value` | `text` |  Unique |
| `label` | `text` |  |
| `display_order` | `int4` |  Nullable |

## Table `cosmetics`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `type` | `text` |  |
| `name` | `text` |  |
| `asset_url` | `text` |  Nullable |
| `css_value` | `text` |  Nullable |
| `unlock_condition` | `text` |  Nullable |
| `is_active` | `bool` |  Nullable |

## Table `user_cosmetics`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `user_id` | `uuid` | Primary |
| `cosmetic_id` | `uuid` | Primary |
| `unlocked_at` | `timestamptz` |  Nullable |

## Table `flavor_tier_lists`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `item_id` | `uuid` |  Nullable |
| `tier` | `text` |  |
| `updated_at` | `timestamptz` |  Nullable |

