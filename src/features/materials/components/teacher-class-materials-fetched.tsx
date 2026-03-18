import { hasPermission } from "@/features/auth/server/utils";
import { MaterialList } from "@/features/materials/components/material-list";
import { getTeacherClassMaterials } from "@/features/materials/server/dal";

interface TeacherClassMaterialsFetchedProps {
  classId: string;
  userId: string;
}

export async function TeacherClassMaterialsFetched({
  classId,
  userId,
}: TeacherClassMaterialsFetchedProps) {
  const [materials, canUpdate, canDelete] = await Promise.all([
    getTeacherClassMaterials(classId, userId),
    hasPermission("material", "update"),
    hasPermission("material", "delete"),
  ]);

  return <MaterialList materials={materials} canUpdate={canUpdate} canDelete={canDelete} />;
}
