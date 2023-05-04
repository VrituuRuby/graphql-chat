import { PermissionsGuard } from './permissions.guard';

describe('PermissionGuard', () => {
  it('should be defined', () => {
    expect(new PermissionsGuard()).toBeDefined();
  });
});
