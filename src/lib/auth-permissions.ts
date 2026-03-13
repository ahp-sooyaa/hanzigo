import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  student: ["create", "read", "update", "delete"],
  teacher: ["create", "read", "update", "delete"],
  class: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  student: ["create", "read", "update", "delete"],
  teacher: ["create", "read", "update", "delete"],
  class: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const user = userAc;

export const teacher = ac.newRole({
  class: ["read"],
  student: ["read"],
});

export const student = ac.newRole({
  class: ["read"],
});

export const roles = {
  admin,
  user,
  teacher,
  student,
};
