import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const useUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().req.user;
    return data ? user?.[data] : user;
  },
);
