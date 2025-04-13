export * from './media';
export * from './quiz';
export * from './category';
export * from './workflow';
export * from './admin';
export * from './ilp';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
}

export interface SoftDeletableEntity extends AuditableEntity {
  deletedAt?: string;
  deletedBy?: string;
}

export interface VersionedEntity extends AuditableEntity {
  version: number;
  previousVersionId?: string;
}

export interface MetadataEntity {
  metadata?: Record<string, any>;
}

export interface OrderableEntity {
  order: number;
}

export interface PublishableEntity extends AuditableEntity {
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  publishedBy?: string;
}

export interface LocalizableEntity {
  locale: string;
  translations?: Record<string, any>;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};