import { Repository } from '../../helpers';
import { hashSync } from 'bcrypt';
import {
	CreateUserDto,
	UpdateRoleDto,
	UpdateUserDto,
} from '../schemas/user.schema';

export class UserRepository extends Repository {
	model = this.prisma.user;

	async create(data: CreateUserDto) {
		const { email, password, roleIds = [], ...rest } = data;
		const hashedPassword = hashSync(password, 10);

		const roles = await this.prisma.role.findMany({
			where: {
				id: {
					in: roleIds,
				},
			},
		});

		const user = await this.model.create({
			data: {
				...rest,
				userPrivate: {
					create: { email, password: hashedPassword },
				},
				userRoles: {
					create: roles.map((role) => ({ roleId: role.id })),
				},
			},
			include: {
				userRoles: {
					select: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		return user;
	}

	async update(id: string, data: UpdateUserDto) {
		const user = await this.model.update({
			data,
			include: {
				userRoles: {
					select: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});

		return user;
	}

	async updateRole(id: string, { roleIds }: UpdateRoleDto) {
		const user = await this.model.update({
			data: {
				userRoles: roleIds && {
					set: [],
					create: roleIds.map((id) => ({ roleId: id })),
				},
			},
			include: {
				userRoles: {
					select: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});

		return user;
	}

	getOneById(id: string) {
		return this.model.findFirst({
			include: {
				userRoles: {
					select: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});
	}

	getTotalInvesment(id: string) {
		return this.model.findFirst({
			include: {
				userRoles: {
					select: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});
	}
}
