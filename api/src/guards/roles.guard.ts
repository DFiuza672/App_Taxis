import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Injetamos o Reflector para nos ajudar a ler os metadados
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
   
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Metadados do método (ex: getProfile)
      context.getClass(),   // Metadados da classe (ex: UserController)
    ]);

    
    if (!requiredRoles) {
      return true;
    }

    // 2. Obter o objeto do usuário da requisição
    // Isso assume que um guard de autenticação (como JwtAuthGuard ou AuthenticatedGuard)
    // já rodou e anexou o usuário ao request.
    const { user } = context.switchToHttp().getRequest();

    // Se não houver usuário ou se o usuário não tiver roles, negue o acesso.
    if (!user || !user.roles) {
      return false;
    }

    // 3. Comparar as roles do usuário com as roles requeridas
    // Verificamos se o usuário possui pelo menos UMA das roles necessárias.
    const hasRequiredRole = () => 
      requiredRoles.some((role) => user.roles.includes(role));

    return hasRequiredRole();
  }
}