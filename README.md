# What is this?

This is a simple tool that watches your Tinder likes and retrieves an un-blurred photo from their profile.

Each like is then saved to a file containing a JSON array of objects, each containing the profile ID, photo URL and timestamp.

This is meant to be run persistently as a service to watch for likes.

The application requires a valid X-AUTH-TOKEN to be supplied. This can be found in the request headers sent to Tinder,
given you are logged in. This token is invalidated frequently and I haven't had a chance to look into how it renews it yet.

### Why does this need to run persistently?

The API endpoint used to retrieve the ID's of your most recent likes only returns the last 10, so to continuously
catalogue your likes it needs to be running persistently.

### Do I need Tinder Gold?

Nope

### Disclaimer

Use this at your own risk, this is bound to break Tinder's TOS in some capacity.
