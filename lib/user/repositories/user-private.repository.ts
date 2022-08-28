import { Repository } from '../../helpers';

export class UserPrivateRepository extends Repository {
	model = this.prisma.user_private;

	async getOneByEmail(email: string) {
		return await this.model.findFirst({
			where: { email },
			include: {
				user: {
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
				},
			},
		});
	}
}
