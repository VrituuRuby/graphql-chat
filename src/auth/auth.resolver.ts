import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthInput } from 'src/user/models/inputs/authInput';
import { AuthService } from './auth.service';
import { AuthDTO } from 'src/user/models/dto/authDto.types';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => AuthDTO)
  async signIn(@Args('data') { email, password }: AuthInput) {
    return await this.authService.signIn({ email, password });
  }
}
