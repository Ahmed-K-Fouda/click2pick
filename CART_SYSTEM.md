# Enhanced Shopping Cart System

## Overview

This system provides individual user shopping carts with secure authentication, ensuring that each user's cart data is stored separately and privately. The system handles guest users, prompts for registration, and seamlessly merges cart items when users register.

## Key Features

### 🔐 Individual User Carts
- Each user has their own private cart
- No overlap between different users' cart items
- Secure session-based cart management for guest users

### 👤 Guest User Experience
- Guest users can add items to cart without registration
- Cart items are stored using session cookies
- Seamless transition from guest to registered user

### 🔄 Smart Cart Merging
- When a guest user registers, their cart items are automatically merged
- Intelligent merging prevents duplicate items
- Preserves cart state across authentication

### 🛡️ Security & Privacy
- HTTP-only cookies for session management
- Secure authentication flow
- Protected checkout routes
- No cross-user data leakage

## System Architecture

### Database Schema
```prisma
model Cart {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId        String?  @db.Uuid  // null for guest users
  sessionCartId String   // for guest user identification
  items         Json[]   @default([]) @db.Json()
  itemPrice     Decimal  @db.Decimal(12, 2)
  totalPrice    Decimal  @db.Decimal(12, 2)
  shippingPrice Decimal  @db.Decimal(12, 2)
  taxPrice      Decimal  @db.Decimal(12, 2)
  createdAt     DateTime @default(now()) @db.Timestamp(6)
  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Authentication Flow

1. **Guest User Shopping**
   - User adds items to cart
   - Cart stored with session ID
   - No authentication required

2. **Checkout Prompt**
   - When guest tries to checkout
   - System shows authentication prompt
   - User can register or sign in

3. **Cart Merging**
   - After successful registration/login
   - Guest cart items merged with user account
   - Guest cart deleted, user cart updated

4. **Protected Checkout**
   - Only authenticated users can checkout
   - Middleware redirects unauthenticated users

## API Endpoints

### Cart Management
- `GET /api/cart` - Get current cart data
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove` - Remove item from cart

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

## Components

### Core Components
- `AuthPrompt` - Prompts guest users to register
- `CartIndicator` - Shows cart count in header
- `SuccessMessage` - Shows after successful registration
- `CartTable` - Displays cart items with quantity controls

### Hooks
- `useCart` - Custom hook for cart state management

## Security Features

### Session Management
- HTTP-only cookies for session cart ID
- Secure cookie settings in production
- Automatic session cart ID generation

### Route Protection
- Middleware protects checkout routes
- Automatic redirects for unauthenticated users
- Callback URL support for seamless UX

### Data Privacy
- User-specific cart queries
- No cross-user data access
- Secure cart merging logic

## User Experience Flow

### Guest User Journey
1. User visits site and adds items to cart
2. Cart items stored with session ID
3. User tries to checkout
4. System shows authentication prompt
5. User registers or signs in
6. Cart items automatically merged
7. User proceeds to checkout

### Registered User Journey
1. User signs in to their account
2. Any existing cart items loaded
3. User can add/remove items
4. User proceeds directly to checkout

## Error Handling

### Cart Errors
- Invalid product IDs
- Out of stock items
- Session cart not found
- Database connection issues

### Authentication Errors
- Invalid credentials
- Email already exists
- Password validation failures
- Session expiration

## Performance Optimizations

### Cart Operations
- Efficient database queries
- Caching for cart counts
- Optimistic UI updates
- Background cart refresh

### Authentication
- JWT-based sessions
- Secure password hashing
- Efficient user lookups
- Session persistence

## Testing Scenarios

### Guest User Tests
- [ ] Add items to cart as guest
- [ ] Cart persists across page refreshes
- [ ] Cart count updates correctly
- [ ] Authentication prompt appears

### Registration Tests
- [ ] Guest cart merges after registration
- [ ] No duplicate items after merge
- [ ] Guest cart deleted after merge
- [ ] Success message displayed

### Authentication Tests
- [ ] Protected routes redirect properly
- [ ] Callback URLs work correctly
- [ ] Session persistence
- [ ] Secure logout

### Cart Management Tests
- [ ] Add/remove items
- [ ] Quantity updates
- [ ] Price calculations
- [ ] Stock validation

## Future Enhancements

### Planned Features
- Cart expiration for guest users
- Wishlist functionality
- Cart sharing between devices
- Advanced cart analytics
- Bulk cart operations

### Performance Improvements
- Real-time cart updates
- Offline cart support
- Advanced caching strategies
- Database query optimization

## Troubleshooting

### Common Issues
1. **Cart not persisting** - Check session cookie settings
2. **Merge not working** - Verify user authentication state
3. **Count not updating** - Check API endpoint responses
4. **Redirect loops** - Verify middleware configuration

### Debug Steps
1. Check browser cookies for session cart ID
2. Verify database cart records
3. Test authentication flow
4. Review server logs for errors

## Configuration

### Environment Variables
```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_site_url
```

### Cookie Settings
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - HTTPS only in production
- `sameSite: "lax"` - CSRF protection
- `maxAge: 30 days` - Session duration

This enhanced shopping cart system provides a secure, user-friendly experience that handles both guest and registered users seamlessly while maintaining data privacy and security. 