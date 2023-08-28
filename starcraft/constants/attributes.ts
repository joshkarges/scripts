export type UnitAttributes = {
  weight: 'light' | 'armored' | 'neither',
  structure: 'biological' | 'mechanical' | 'both' | 'neither'
};

export const getUnitAttributes = (
  weight: UnitAttributes['weight'],
  structure: UnitAttributes['structure'],
): UnitAttributes => ({ weight, structure });

export type BuildingAttributes = {
  weight: 'armored' | 'neither',
  structure: 'biological' | 'mechanical' | 'neither'
};

export const getBuildingAttributes = (
  weight: BuildingAttributes['weight'],
  structure: BuildingAttributes['structure'],
): BuildingAttributes => ({ weight, structure });

export type Attributes = UnitAttributes | BuildingAttributes;