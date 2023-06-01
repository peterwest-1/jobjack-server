interface PermissionInfo {
  octal: string;
  description: string;
}

//STACKOVERFLOW
export const getFilePermissionInfo = (permissions: number): PermissionInfo => {
  const owner = (permissions & 0o700) >> 6; // Extract owner permissions
  const group = (permissions & 0o70) >> 3; // Extract group permissions
  const others = permissions & 0o7; // Extract others permissions

  const permissionInfo: PermissionInfo = {
    octal: permissions.toString(8).padStart(3, "0"),
    description: `${getPermissionDescription(owner)}${getPermissionDescription(group)}${getPermissionDescription(
      others
    )}`,
  };

  return permissionInfo;
};

//STACKOVERFLOW
export const getPermissionDescription = (permission: number): string => {
  let description = "";

  description += permission & 0o4 ? "r" : "-";
  description += permission & 0o2 ? "w" : "-";
  description += permission & 0o1 ? "x" : "-";

  return description;
};
