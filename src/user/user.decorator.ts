import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const useUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    return GqlExecutionContext.create(ctx).getContext().req.user_id;
  },
);
