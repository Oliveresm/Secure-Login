// tests/integration/user/update-name.integration.test.ts
import { describe, it, expect, vi, type Mock } from 'vitest';
import app from '../../../src/index';
import supertest from 'supertest';
import * as model from '../../../src/models/update-display-name.model';


// ️Mock DB call
vi.spyOn(model, 'updateDisplayName').mockResolvedValue(undefined);

// Create an app instance with stub auth middleware
function testApp() {
  const express = require('express');
  const testApp = express();

  // <-- stub auth middleware
  testApp.use((req, _res, next) => {
    req.user = { id: 'user-id-123' };      // ← inject fake user
    next();
  });

  testApp.use(app); // mount real app
  return testApp;
}

const request = supertest(testApp());

describe('PATCH /user/update-name', () => {
  it('returns 204 when display name is updated successfully', async () => {
    const res = await request
      .patch('/api/user/update-name')
      .send({ newName: 'MyNewName' });

    expect(res.status).toBe(204);
    expect(model.updateDisplayName)
      .toHaveBeenCalledWith('user-id-123', 'MyNewName');
  });

  it('returns 400 when newName is missing', async () => {
    const res = await request
      .patch('/api/user/update-name')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing parameters');
  });

  it('returns 500 when the model throws', async () => {
    (model.updateDisplayName as any).mockRejectedValue(new Error('DB failure'));

    const res = await request
      .patch('/api/user/update-name')
      .send({ newName: 'Whatever' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('DB failure');
  });
});
