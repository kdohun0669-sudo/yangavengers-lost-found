export function validateStudentId(studentId: string): string | null {
  if (!/^\d{5}$/.test(studentId)) {
    return "학번은 5자리 숫자여야 합니다.";
  }

  const grade = parseInt(studentId[0], 10);
  const classNum = parseInt(studentId.slice(1, 3), 10);
  const number = parseInt(studentId.slice(3, 5), 10);

  if (grade < 1 || grade > 3) {
    return "학년은 1~3 사이여야 합니다.";
  }
  if (classNum < 1 || classNum > 99) {
    return "반은 01~99 사이여야 합니다.";
  }
  if (number < 1 || number > 99) {
    return "번호는 01~99 사이여야 합니다.";
  }

  return null;
}

export function formatStudentId(studentId: string): string {
  const grade = studentId[0];
  const classNum = parseInt(studentId.slice(1, 3), 10);
  const number = parseInt(studentId.slice(3, 5), 10);
  return `${grade}학년 ${classNum}반 ${number}번`;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "비밀번호는 영문과 숫자를 모두 포함해야 합니다.";
  }
  return null;
}
