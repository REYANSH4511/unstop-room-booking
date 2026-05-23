import swaggerJSDoc from "swagger-jsdoc";

/**
 * ============================================================================
 * SWAGGER / OPENAPI DOCUMENTATION
 * ============================================================================
 *
 * Auto-generated API docs from JSDoc comments in controller files.
 *
 * Access at: http://localhost:8080/api-docs
 *
 * This follows the exact car-pool-app pattern but adapted for TypeScript.
 */

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Room Reservation API",
      version: "1.0.0",
      description:
        "Intelligent hotel room booking system that minimizes travel time between booked rooms.\n\n" +
        "## Hotel Structure\n" +
        "- **Floors 1-9**: 10 rooms each (101-110, 201-210, ..., 901-910)\n" +
        "- **Floor 10**: 7 rooms (1001-1007)\n" +
        "- **Total**: 97 rooms\n\n" +
        "## Travel Time Rules\n" +
        "- **Horizontal**: 1 minute per adjacent room on same floor\n" +
        "- **Vertical**: 2 minutes per floor difference\n\n" +
        "## Booking Algorithm\n" +
        "1. **Same Floor First**: Try to book all rooms on one floor\n" +
        "2. **Minimize Travel**: If impossible, find optimal multi-floor combo\n" +
        "3. **Tie-breaking**: Fewer floors > Lower floors > Closer to lift",
      contact: {
        name: "Hotel Reservation API",
        url: "https://github.com/yourusername/hotel-reservation",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API Version 1",
      },
    ],
    tags: [
      { name: "Rooms", description: "Room management and queries" },
      { name: "Bookings", description: "Booking creation and management" },
      { name: "System", description: "Health checks and system info" },
    ],
  },
  apis: ["./src/api/v1/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
