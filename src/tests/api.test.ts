import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFrom = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: { from: mockFrom },
}));

function chainFor(resolveWith: unknown) {
  const chain = {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolveWith),
  };
  // delete().eq() resolves directly (no .single())
  chain.eq.mockImplementation(() => ({
    ...chain,
    then: (fn: (v: unknown) => unknown) => fn(resolveWith),
  }));
  return chain;
}

describe('POST /api/projects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 201 with created project', async () => {
    const created = {
      id: 'abc',
      title: 'My Project',
      slug: 'my-project',
      tags: [],
      status: 'draft',
      featured: false,
      display_order: 0,
    };
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: created, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const { POST } = await import('@/app/api/projects/route');
    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: 'My Project',
        slug: 'my-project',
        tags: [],
        status: 'draft',
        display_order: 0,
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('abc');
  });

  it('returns 400 when supabase errors', async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'slug must be unique' } }),
    };
    mockFrom.mockReturnValue(chain);

    const { POST } = await import('@/app/api/projects/route');
    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Dup', slug: '', tags: [] }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });
});

describe('PATCH /api/projects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when id is missing', async () => {
    const { PATCH } = await import('@/app/api/projects/route');
    const req = new Request('http://localhost/api/projects', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'No ID' }),
    });
    const res = await PATCH(req as never);
    expect(res.status).toBe(400);
  });

  it('updates and returns project', async () => {
    const updated = { id: 'abc', title: 'Updated', slug: 'updated', tags: [] };
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: updated, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const { PATCH } = await import('@/app/api/projects/route');
    const req = new Request('http://localhost/api/projects', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'abc', title: 'Updated' }),
    });
    const res = await PATCH(req as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated');
  });
});

describe('POST /api/posts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 201 with created post', async () => {
    const created = {
      id: 'xyz',
      title: 'My Post',
      slug: 'my-post',
      tags: [],
      status: 'draft',
      display_order: 0,
    };
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: created, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const { POST } = await import('@/app/api/posts/route');
    const req = new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'My Post',
        slug: 'my-post',
        tags: [],
        status: 'draft',
        display_order: 0,
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('xyz');
  });

  it('requires both title and slug — returns 400 on supabase error', async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'null value in column "slug"' } }),
    };
    mockFrom.mockReturnValue(chain);

    const { POST } = await import('@/app/api/posts/route');
    const req = new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'No Slug' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});
