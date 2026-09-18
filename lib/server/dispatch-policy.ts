export function dispatchOriginAllowed(
  origin: string | null,
  requestOrigin: string
) {
  // Use server configuration, never client-controlled forwarded headers.
  const configured = process.env.TOSHIP_PUBLIC_ORIGIN
  try {
    const expected = new URL(configured || requestOrigin)
    if (
      expected.username ||
      expected.password ||
      expected.search ||
      expected.hash ||
      expected.pathname !== "/"
    )
      return false
    if (!["https:", "http:"].includes(expected.protocol)) return false
    return origin === expected.origin
  } catch {
    return false
  }
}

export function dispatchRole(userId: string) {
  const ids = (value?: string) =>
    (value || "")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean)
  if (ids(process.env.TOSHIP_SUPERVISOR_USER_IDS).includes(userId))
    return "supervisor"
  if (ids(process.env.TOSHIP_OPERATOR_USER_IDS).includes(userId))
    return "operator"
  return null
}

export function dispatchPath(path: string[], method: string) {
  const joined = path.join("/")
  if (method === "GET" && ["ui", "ui/app.js", "session/me"].includes(joined))
    return joined
  if (
    method === "POST" &&
    ["toship/assign", "toship/assign-file"].includes(joined)
  )
    return joined
  if (
    method === "GET" &&
    /^toship\/jobs\/[a-f0-9]{32}(\/(download|line))?$/.test(joined)
  )
    return joined
  if (
    method === "POST" &&
    /^toship\/assign\/[a-f0-9]{32}\/confirm$/.test(joined)
  )
    return joined
  if (method === "POST" && /^toship\/jobs\/[a-f0-9]{32}\/line$/.test(joined))
    return joined
  return null
}
