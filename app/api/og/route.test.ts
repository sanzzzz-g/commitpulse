import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

vi.mock('../../../lib/github', () => ({
  fetchGitHubContributions: vi.fn(),
}));

vi.mock('../../../lib/calculate', () => ({
  calculateStreak: vi.fn(),
}));

import { fetchGitHubContributions } from '../../../lib/github';
import { calculateStreak } from '../../../lib/calculate';

describe('OG Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 successfully', async () => {
    vi.mocked(fetchGitHubContributions).mockResolvedValue({} as never);

    vi.mocked(calculateStreak).mockReturnValue({
      totalContributions: 120,
      longestStreak: 20,
      currentStreak: 5,
    });

    const req = new Request('http://localhost:3000/api/og?user=testuser');

    const res = await GET(req);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
  });

  it('falls back to zeros when github fetch fails', async () => {
    vi.mocked(fetchGitHubContributions).mockRejectedValue(new Error('GitHub API failed'));

    const req = new Request('http://localhost:3000/api/og?user=testuser');

    const res = await GET(req as never);

    expect(res.status).toBe(200);
  });

  it('handles missing user query param', async () => {
    const req = new Request('http://localhost:3000/api/og');

    const res = await GET(req as never);

    expect(res.status).toBe(200);
  });
});
