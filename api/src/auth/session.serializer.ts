import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
// UserService seria um serviço para buscar usuários no DB
// Por simplicidade, vamos assumir que o payload do usuário é suficiente

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    done(null, user); // Serializa o objeto user inteiro na sessão
  }

  deserializeUser(payload: any, done: (err: any, payload: string) => void): any {
    done(null, payload); // Desserializa
  }
}