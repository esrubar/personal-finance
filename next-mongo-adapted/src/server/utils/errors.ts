export function toProblem(status: number, message: string) {
  return Response.json({ error: message }, { status });
}
