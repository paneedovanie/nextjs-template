import { Prisma } from '@prisma/client';
import { getDatabaseConnection } from './database.helper';

export type PaginateOptions = Prisma.PrismaClientOptions & {
	page: number;
	limit: number;
};

export class Repository<CreateDto = unknown, UpdateDto = unknown> {
	prisma = getDatabaseConnection();
	model: any = this.prisma.role;

	async getPaginated(options: PaginateOptions) {
		const { page = 1, limit = 10, ...rest } = options;

		const tempOptions = {
			skip: (+options.page - 1) * options.limit,
			take: +options.limit,
			...rest,
		};

		const data = await this.model.findMany(tempOptions);
		const count = await this.model.count(rest);

		return { page: +page, data, count, limit: +limit };
	}

	getOneById(id: string) {
		return this.model.findFirst({
			where: {
				id,
			},
		});
	}

	create(data: CreateDto) {
		return this.model.create({
			data,
		});
	}

	update(id: string, data: UpdateDto) {
		return this.model.update({
			data,
			where: {
				id,
			},
		});
	}

	deleteOneById(id: string) {
		return this.model.delete({
			where: {
				id,
			},
		});
	}
}
