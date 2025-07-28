// src/repository/auth/register-local.repository.ts
import hashService from '../../services/hash.service';
import createUser from '../../models/create-user.model';
import emailService from '../../services/email.service';
import { randomUUID } from 'crypto';

interface RegisterLocalUserParams {
  email: string;
  display_name: string;
  password: string;
}

const registerLocalUser = async ({
  email,
  display_name,
  password,
}: RegisterLocalUserParams): Promise<void> => {
  // Hash the user's password
  const auth_hash = await hashService.hash(password);

  // Generate the raw verification token and hash it
  const raw_token = randomUUID();
  const out_hash = await hashService.hash(raw_token);

  try {
    // Create the user in the database with the hashed password and verification token
    await createUser({
      email,
      display_name,
      auth_type: 'local',
      auth_hash,
      out_hash,
    });
  } catch (e: any) {
    const msg = e.message?.toLowerCase() ?? '';

    if (msg.includes('email already exists') || msg.includes('display name already exists')) {
      const error = new Error(e.message);
      (error as any).code = 'DUPLICATE';
      throw error;
    }

    throw e; // Re-throw any other error
  }

  // Send the verification email to the user with the raw token
  await emailService.sendVerificationEmail(email, raw_token);
};

export default {
  registerLocalUser,
};
