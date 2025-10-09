import '@testing-library/jest-dom';

if (typeof global.crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { webcrypto, randomUUID } = require('crypto');
  global.crypto = webcrypto;
  if (global.crypto && !global.crypto.randomUUID) {
    // @ts-expect-error add randomUUID for tests
    global.crypto.randomUUID = randomUUID;
  }
} else if (!global.crypto.randomUUID) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = require('crypto');
  // @ts-expect-error add randomUUID for tests
  global.crypto.randomUUID = randomUUID;
}
