import { StudentMaterialList } from "@/features/materials/components/student-material-list";
import { getStudentClassMaterials } from "@/features/materials/server/dal";

interface StudentClassMaterialsFetchedProps {
  classId: string;
  userId: string;
}

export async function StudentClassMaterialsFetched({
  classId,
  userId,
}: StudentClassMaterialsFetchedProps) {
  const materials = await getStudentClassMaterials(classId, userId);

  return <StudentMaterialList materials={materials} />;
}
