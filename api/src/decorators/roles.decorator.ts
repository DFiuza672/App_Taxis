import { SetMetadata } from '@nestjs/common';

// A chave 'roles' será usada pelo Guard para ler os metadados.
export const ROLES_KEY = 'roles';

// O decorator aceita uma lista de strings (as roles)
// e as anexa aos metadados da rota usando a chave ROLES_KEY.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);