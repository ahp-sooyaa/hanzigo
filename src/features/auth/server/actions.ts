import { signUpSchema, signInSchema } from "./dto";
import { actionClient } from "@/lib/safe-action";

export const signUpAction = actionClient
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput: { email: _email, password: _password, name: _name } }) => {
    return { success: true };
  });

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput: { email: _email, password: _password } }) => {
    return { success: true };
  });
