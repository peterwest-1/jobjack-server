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

export const getPermissionDescription = (permission: number): string => {
  let description = "";

  if (permission & 0o4) {
    description += "r";
  } else {
    description += "-";
  }

  if (permission & 0o2) {
    description += "w";
  } else {
    description += "-";
  }

  if (permission & 0o1) {
    description += "x";
  } else {
    description += "-";
  }

  return description;
};
