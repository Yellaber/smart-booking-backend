export enum CategoryEnum {
    CUIDADO_CAPILAR = 'cuidado capilar',
    ESTETICA_Y_BELLEZA = 'estética y belleza',
    BIENESTAR_Y_RELAJACION = 'bienestar y relajación',
    ARTE_CORPORAL = 'arte corporal'
}

export interface CategoryName {
    name: CategoryEnum;
}

export const categoriesNames: CategoryName[] = [
    { name: CategoryEnum.CUIDADO_CAPILAR },
    { name: CategoryEnum.ESTETICA_Y_BELLEZA },
    { name: CategoryEnum.BIENESTAR_Y_RELAJACION },
    { name: CategoryEnum.ARTE_CORPORAL }
]