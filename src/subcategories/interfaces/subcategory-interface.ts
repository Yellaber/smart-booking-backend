import { CategoryEnum } from '../../categories/interfaces/category.interface';

export enum SubCategoryEnum {
    BARBERIA = 'barbería',
    PELUQUERIA = 'peluquería',
    SALON_DE_BELLEZA = 'salon de belleza',
    CENTRO_DE_ESTETICA = 'centro de estética',
    UNAS = 'uñas',
    SPA = 'SPA',
    MASAJES = 'masajes',
    ESTUDIO_DE_TATUAJES = 'estudio de tatuajes',
    PIERCING = 'piercing'
}

export interface SubCategoryName {
    name: SubCategoryEnum;
    category: CategoryEnum;
}

export const subCategoriesNames: SubCategoryName[] = [
    { name: SubCategoryEnum.BARBERIA, category: CategoryEnum.CUIDADO_CAPILAR },
    { name: SubCategoryEnum.PELUQUERIA, category: CategoryEnum.CUIDADO_CAPILAR },
    { name: SubCategoryEnum.SALON_DE_BELLEZA, category: CategoryEnum.ESTETICA_Y_BELLEZA },
    { name: SubCategoryEnum.CENTRO_DE_ESTETICA, category: CategoryEnum.ESTETICA_Y_BELLEZA },
    { name: SubCategoryEnum.UNAS, category: CategoryEnum.ESTETICA_Y_BELLEZA },
    { name: SubCategoryEnum.SPA, category: CategoryEnum.BIENESTAR_Y_RELAJACION },
    { name: SubCategoryEnum.MASAJES, category: CategoryEnum.BIENESTAR_Y_RELAJACION },
    { name: SubCategoryEnum.ESTUDIO_DE_TATUAJES, category: CategoryEnum.ARTE_CORPORAL },
    { name: SubCategoryEnum.PIERCING, category: CategoryEnum.ARTE_CORPORAL }
]