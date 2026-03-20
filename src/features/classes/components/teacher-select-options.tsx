import { SelectItem } from "@/components/ui/select";
import { getAllTeachersForDropdown } from "@/features/classes/server/dal";

export async function TeacherSelectOptions() {
  const teachers = await getAllTeachersForDropdown();

  if (teachers.length === 0) {
    return (
      <div className="p-2 text-center text-sm text-muted-foreground">No teachers available</div>
    );
  }

  return teachers.map((teacher) => (
    <SelectItem key={teacher.id} value={teacher.id}>
      {teacher.name}
    </SelectItem>
  ));
}
