import { Controller, Post, UseGuards, Req, Get, Session, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './authenticated.guard';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {

  @Post('login')
  @UseGuards(AuthGuard('local')) // Valida as credenciais e inicia a sessão
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: AuthenticatedRequest): Promise<{ message: string; user: any; }> {
    // O guard 'local' já anexou o usuário ao req.
    // Retornamos apenas os dados seguros do usuário (sem senha, etc.)
    return { 
        message: 'Login successful', 
        user: req.user 
    };
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard) // 🔒 ERRO CORRIGIDO: Rota agora está protegida
  getProfile(@Req() req: AuthenticatedRequest) {
    // Apenas usuários com sessão ativa chegarão aqui.
    // req.user estará sempre definido.
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard) // É uma boa prática garantir que só usuários logados possam deslogar
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: AuthenticatedRequest, @Session() session: Record<string, any>) {
    // O req.logout() do Passport limpa a sessão de login
    req.logout((err: any) => {
        if (err) {
            // Lide com o erro, se houver
            console.error('Failed to logout:', err);
        }
    });

    // O session.destroy() remove a sessão do armazenamento (ex: Redis, memory)
    session.destroy(null); 
    
    return { message: 'Logged out successfully' };
  }
}