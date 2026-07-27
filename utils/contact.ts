// Single source of truth for Arrow Taxi contact details.
// Every surface that renders the phone number, email or address must import
// from here — previously the number shipped in three different formats
// ('01248 20 93 93', '01248 209393', '01248209393') across Banner, header and footer.

/** Human-readable phone number. The only format shown to users. */
export const PHONE_DISPLAY = '01248 20 93 93';

/** E.164 number used for tel: and wa.me links. */
export const PHONE_E164 = '+441248209393';

/** Ready-to-use href for click-to-call. */
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const EMAIL = 'bookings@arrow.taxi';
export const EMAIL_HREF = `mailto:${EMAIL}`;

/** Canonical trading address — matches the LocalBusiness schema on the homepage. */
export const ADDRESS_LINE = 'Station Road, Bangor, LL57 1LZ';

export const OPENING_HOURS = 'Open 24 hours, 7 days a week';
