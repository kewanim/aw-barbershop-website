# Database Structure (Firestore)

The app uses three top-level Firestore collections. Sample documents live in
`database/sample-data/` and mirror the shapes below.

---

## Collection: `barbers`

| Field            | Type      | Example                          |
| ---------------- | --------- | -------------------------------- |
| `id`             | string    | `"barber-001"`                   |
| `name`           | string    | `"Marcus Reed"`                  |
| `title`          | string    | `"Master Barber & Owner"`        |
| `bio`            | string    | `"With over 15 years..."`        |
| `photoUrl`       | string    | image URL                        |
| `photoDescription` | string  | alt / description text           |
| `specialties`    | string[]  | `["Skin Fades", "Shaves"]`       |
| `rating`         | number    | `4.9`                            |
| `yearsExperience`| number    | `15`                             |
| `available`      | boolean   | `true`                           |

## Collection: `services`

| Field             | Type    | Example              |
| ----------------- | ------- | -------------------- |
| `id`              | string  | `"svc-001"`          |
| `name`            | string  | `"Classic Haircut"`  |
| `description`     | string  | text                 |
| `price`           | number  | `30`                 |
| `durationMinutes` | number  | `30`                 |
| `category`        | string  | `"Hair"`             |
| `popular`         | boolean | `true`               |

## Collection: `appointments`

| Field           | Type    | Example                  |
| --------------- | ------- | ------------------------ |
| `id`            | string  | `"bk-1001"`              |
| `customerName`  | string  | `"James Carter"`         |
| `customerEmail` | string  | email                    |
| `customerPhone` | string  | phone                    |
| `serviceId`     | string  | ref → `services.id`      |
| `serviceName`   | string  | denormalized for display |
| `barberId`      | string  | ref → `barbers.id`       |
| `barberName`    | string  | denormalized for display |
| `date`          | string  | `"2026-06-16"`           |
| `time`          | string  | `"10:00"`                |
| `price`         | number  | `38`                     |
| `status`        | string  | `confirmed \| pending \| cancelled` |
| `notes`         | string  | free text                |

---

## Relationships

```
services (1) ────< appointments >──── (1) barbers
```

An appointment references one service and one barber by id. The `serviceName`
and `barberName` are denormalized (copied onto the appointment) so the admin
table and confirmation screen can render without extra lookups.

## Suggested Security Rules (starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read the public menu and team.
    match /services/{doc} { allow read: if true; allow write: if false; }
    match /barbers/{doc}  { allow read: if true; allow write: if false; }

    // Appointments: anyone can create a booking; only signed-in staff manage them.
    match /appointments/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```
