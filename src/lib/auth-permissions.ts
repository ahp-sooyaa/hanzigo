import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const admin = adminAc;

export const user = userAc;

export const teacher = ac.newRole({
  user: [],
  session: [],
});

export const roles = {
  admin,
  user,
  teacher,
};
