# Authentication
Authentication handled by firebase. Send Authorization header.

#Routes
## GET /api/v1/status
returns OK if api is online

## GET /api/v1/users/me
returns `IOwnUser`

## GET /api/v1/users/me/bookmarkedJobOffers
returns `IJobOffer[]`

## GET /api/v1/users/:id
returns `IUser` with corresponding id

## GET /api/v1/jobOffer?limit=?skip=?search=?categories=?workdays=?from=?to=?geo=?
returns `IJobOffer[]`

## GET /api/v1/jobOffer/:id
returns `IJobOffer`

## POST /api/v1/jobOffer/:id/bookmark
marks the jobOffer as bookmarked
does not return anything

## POST /api/v1/jobOffer/:id/unbookmark
marks the jobOffer as not bookmarked
does not return anything

## POST /api/v1/jobOffer/:id/accept
marks the jobOffer as accepted, creates new conversation
returns `IConversation`

## POST /api/v1/jobOffer/:id/reject
marks the jobOffer as rejected, archives conversation
does not return anything

## GET /api/v1/chat/
returns all chat conversations from logged in user

## GET /api/v1/chat/:offerId
returns chat conversation from logged in user with job offerer

## POST /api/v1/chat/:offerId
adds a new chat conversation (worker only!)

## POST /api/v1/jobOffer/create
creates a new job offer

### Parameters
- categories: number[] (required, at least one)
- workdays: number[] (required, at least one)
- payment: number (required, > 1)
- description: string (required)
- requirements: string[] (optional)
- geoHash: string (required)
- from: number (required, 0 <= from <= to <= 24*60)
- to: number (required, 0 <= from <= to <= 24*60)
- image: string (optional)
