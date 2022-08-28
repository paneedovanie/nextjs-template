import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../lib/user/repositories/user.repository';
import { CreateUserDto } from '../lib/user/schemas/user.schema';

const userRepository = new UserRepository();

const prisma = new PrismaClient();

(async () => {
	await prisma.role.createMany({
		data: [{ name: 'Superadmin' }, { name: 'Admin' }],
	});

	const user = await userRepository.create({
		firstName: 'Superadmin' as never,
		lastName: 'Superadmin' as never,
		middleName: '' as never,
		email: 'superadmin@email.com' as never,
		password: 'password' as never,
	} as CreateUserDto);

	await userRepository.updateRole(user.id, {
		roleIds: [1] as never,
	});
})();

export {};
