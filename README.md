# Skillsly Frontend

Web component for direct client interaction with Skillsly (Three-Tier architecture version).
This component consumes backend's REST API through Http Client provided by Angular.

The layer structure of this component is the following:

- Pages: Includes all the angular components of the app, grouped into pages
- Services: Where services classes to interact with the backend and the state library are defined.
- Interfaces: In this layer all interfaces and data structures are defined, grouped by functionality
- Models: This layer includes all the definitions of state interfaces
- Shared: Contains shared components between pages, and the state definitions
- Socket: Includes socket classes with configurations

A video showcasing the app: [Skillsly Showcase](https://youtu.be/k2NFCvgpq8Q)

As for the refactored version of this component, the team decided to enhance the overall layer structure,
not grouping by pages, but by features.

Here is the link to the new version: [Skillsly Web Frontend - Enhanced](https://bitbucket.org/jonathanlop07/skillsly-frontend/src/development/)
