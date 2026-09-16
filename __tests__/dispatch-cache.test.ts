/** @jest-environment node */
jest.mock("next-pwa", () => jest.fn(() => (config: unknown) => config))
jest.mock("@next/bundle-analyzer", () => () => (config: unknown) => config)

test("dispatch bypasses offline caches before all default routes", () => {
  require("../next.config.js")
  const options = require("next-pwa").mock.calls[0][0]
  const rule = options.runtimeCaching[0]
  expect(rule.handler).toBe("NetworkOnly")
  for (const path of ["ui", "session/me", "toship/jobs/abc/download"]) {
    expect(rule.urlPattern({ url: new URL(`https://chat.example/api/dispatch/${path}`) })).toBe(true)
  }
  expect(rule.urlPattern({ url: new URL("https://chat.example/logo.png") })).toBe(false)
  expect(options.runtimeCaching.length).toBeGreaterThan(1)
})
