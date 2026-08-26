import { describe, expect, it } from 'vitest';

import { greet } from './index.js';

describe('greet', () => {
  it('returns a personalized greeting', () => {
    expect(greet('Leuffen')).toBe('Hello, Leuffen!');
  });
});
