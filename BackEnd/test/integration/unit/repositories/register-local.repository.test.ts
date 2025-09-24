import { describe, it, vi, expect } from 'vitest';
import repository from '../../../src/repository/auth/register-local.repository';
import hashService from '../../../src/services/hash.service';
import emailService from '../../../src/services/email.service';
import createUser from '../../../src/models/create-user.model';

vi.mock('../../../src/services/hash.service');
vi.mock('../../../src/services/email.service');
vi.mock('../../../src/models/create-user.model');

describe('registerLocalUser', () => {
  it('should register a local user successfully', async () => {
    await expect(
      repository.registerLocalUser({
        email: 'test@example.com',
        display_name: 'TestUser',
        password: '123456',
      })
    ).resolves.not.toThrow();

    expect(hashService.hash).toHaveBeenCalled();
    expect(createUser).toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalled();
  });
});
