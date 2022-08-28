import { Repository } from '../../helpers';
import {
	CreateCategoryDto,
	UpdateCategoryDto,
} from '../schemas/category.schema';

export class CategoryRepository extends Repository<
	CreateCategoryDto,
	UpdateCategoryDto
> {
	model = this.prisma.category;
}
