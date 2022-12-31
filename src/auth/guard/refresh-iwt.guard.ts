import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { refresh_token, username } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException('Поле refresh_token оно обязательно');
    }

    if (!username) {
      throw new UnauthorizedException('Поле username оно обязательно');
    }

    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Пользователя не сущевствует');
    }

    return true;
  }
}
