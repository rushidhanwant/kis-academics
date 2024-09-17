# kis-academics (Mono Repo)

## Setup 
- [Setup](/SETUP.md)

## Progress

1. Completed Tasks

    - Set up the backend using the Node.js framework (Hapi.js).
    - Completed API implementation for the following:
        1. API to search for tutors, with filter options for subject, price, school, curriculum, and tutor (supports partial string matching).
        2. API to fetch tutor profile details.
        3. API to request a tutor.
    - Set up the frontend with Next.js, Tailwind CSS, and Shadcn.
    - Integrated the APIs with the frontend.
    - Implemented the following components:
        1. Search user interface:
            - Tutor card
            - Filters
            - Pagination
        2. Profile interface:
            - Tutor information
            - Contact section
2. Pending

    - None, as per the assignment requirements.
    - The authentication flow is not implemented, so I will explain how it would work:
        #### JWT Authentication

        1. When a user signs up, a JWT token will be generated on the server.
        2. This token will contain the necessary information to authenticate the user.
        3. After a successful signup, the JWT token is sent to the client.
        4. The user will use this token to request a resource, and it will be included in the header of each request.
        5. When a request is made, the server will first check if the user has a valid token and the required access.
        6. A middleware will be created to validate the token before processing the request.
        7. If the token is valid, the user will be granted access to the resource; otherwise, an unauthorized error will be thrown.
        
        #### Refresh Token Flow

        1. Along with the access token, a refresh token will also be issued during signup or login.
        2. The access token has a short expiration time (e.g., 15 minutes) to enhance security, while the refresh token has a longer expiration (e.g., 7 days).
        3. When the access token expires, the client will send a request to the server with the refresh token to obtain a new access token.
        4. The server will verify the refresh token's validity.
        5. If the refresh token is valid, a new access token is issued and sent to the client.
        6. This process ensures that users don’t have to log in frequently, while maintaining security by keeping the access token short-lived.
        7. If the refresh token is invalid or expired, the user will be required to log in again.

## Challenges

1. Setting up a monorepo and configuring it took more time than expected.  
2. Writing a search query to include all possible filters was a bit tricky but manageable.  
3. On the frontend, deciding the UI design and implementing the functionality was time-consuming but not overly challenging.

## Future Aditions

1. Profile Views
    - Profile views will provide tutors with insights into how appealing their profile is.  
    - It will also offer insights into the type of users interested in their profile, allowing tutors to target specific users.  
2. Introductory Video on Tutor Profiles  
    - An introductory video will help potential clients understand the tutor better.  
3. Descriptive Public Reviews  
    - Reviews will enable users to make informed decisions before hiring a tutor.  
4. Live Chat for Inquiries


