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
returns `number[]`

## GET /api/v1/jobOffer/:id
returns `IJobOffer`

## POST /api/v1/jobOffer/:id/bookmark
marks the jobOffer as bookmarked
does not return anything
