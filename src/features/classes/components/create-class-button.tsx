import { CreateClassDialog } from "./create-class-dialog";
import { getAllTeachersForDropdown } from "@/features/classes/server/dal";

export async function CreateClassButton() {
  const teachers = await getAllTeachersForDropdown();
  return <CreateClassDialog teachers={teachers} />;
}
