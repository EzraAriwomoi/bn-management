/**
 * @typedef {Object} Booking
 * @property {number} id
 * @property {string} booking_id
 * @property {number} property_id
 * @property {string} guest_name
 * @property {string} platform
 * @property {string=} agent_name
 * @property {string=} agent_contact
 * @property {string} check_in
 * @property {string} check_out
 * @property {number} nights
 * @property {number} amount
 * @property {"Paid"|"Unpaid"|"Pending"} payment_status
 * @property {"Upcoming"|"Ongoing"|"Completed"|"Cancelled"} stay_status
 * @property {string=} notes
 * @property {string=} created_at
 * @property {string=} updated_at
 */

/**
 * @typedef {Object} CreateBookingPayload
 * @property {string} booking_id
 * @property {number} property_id
 * @property {string} guest_name
 * @property {string} platform
 * @property {string=} agent_name
 * @property {string=} agent_contact
 * @property {string} check_in
 * @property {string} check_out
 * @property {number} nights
 * @property {number} amount
 * @property {"Paid"|"Unpaid"|"Pending"} payment_status
 * @property {"Upcoming"|"Ongoing"|"Completed"|"Cancelled"} stay_status
 * @property {string=} notes
 */

/**
 * @typedef {Partial<CreateBookingPayload>} UpdateBookingPayload
 */

export {};
