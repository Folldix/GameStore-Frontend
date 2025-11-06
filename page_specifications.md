# Application Page Specifications

## Overview
**Pages Path:** `src/pages`  
**Total Pages:** 8  
**Authentication:** AuthContext usage observed  
**Repeating Patterns:**
- Async data loading via `useEffect`
- Authentication-dependent content
- Cart/Wishlist integration
- Responsive layout with Tailwind CSS

---

## Page-by-Page Breakdown

### 🛒 CartPage (`src/pages/CartPage.tsx`)
```typescript
<replace_with_path:src/pages/CartPage.tsx:9>
```
**Purpose:** Manage items in shopping cart  
**Functionality:**
- Displays cart items with pricing details
- Handles checkout process
- Supports item removal
**UI Elements:**
- Item list with images 
- Price summary panel
- Checkout button
```typescript
<replace_with_path:src/pages/CartPage.tsx:73>
```
**Recommendations:**
- Abstract checkout logic to payment service
- Implement quantity controls
- Add empty cart state illustration

---

### 🎮 GameDetailPage (`src/pages/GameDetail.tsx`)
```typescript
<replace_with_path:src/pages/GameDetail.tsx:14>
```
**Purpose:** Game product page  
**Features:**
- Game screenshots gallery
- Rating system
- "Add to Cart/Wishlist" functionality
- System requirements display
```typescript
<replace_with_path:src/pages/GameDetail.tsx:256>
```
**Edge Cases:**
- Discount pricing display logic
- Handle wishlist state inversion
**Recommendations:**
- Extract gallery carousel to component
- Create reusable RatingInput system

---

### 🧩 LibraryPage (`src/pages/LibraryPage.tsx`)
```typescript
<replace_with_path:src/pages/LibraryPage.tsx:10>
```
**Purpose:** User's game collection  
**Features:**
- Sortable game list 
- Play time display
- Installation toggle
```typescript
<replace_with_path:src/pages/LibraryPage.tsx:105>
```
**Optimization Notes:**
- Sort logic could create GC pressure
- Consider virtualization for large libraries
**Recommendations:**
- Memoize sorting functions
- Add filter controls

---

## Auth Flow Pages

### 🔑 LoginPage (`src/pages/LoginPage.tsx`)
```typescript
<replace_with_path:src/pages/LoginPage.tsx:7>
```
**Authentication Method:** Email/password  
**Validation:** In-component (Neeeds abstraction)  

### ✏️ RegisterPage (`src/pages/RegisterPage.tsx`)
```typescript
<replace_with_path:src/pages/RegisterPage.tsx:7>
```
**Auth Flow:** Direct registration  
**Security:** Password masking  
**Critical Improvement:** Add password validation criteria

---

## Additional Pages

### 👤 ProfilePage (`src/pages/ProfilePage.tsx`)
### 🛍️ StorePage (`src/pages/StorePage.tsx`)
```typescript
<replace_with_path:src/pages/StorePage.tsx:9>
```
### 💖 WishListPage (`src/pages/WishListPage.tsx`)
```typescript
<replace_with_path:src/pages/WishListPage.tsx:11>
```

[View full document here](https://fridayai.online/friday/page_specifications.md)