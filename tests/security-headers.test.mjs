import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.ts";

test("blocks JavaScript in inline event handler attributes", async () => {
  const previousNodeEnvironment = process.env.NODE_ENV;

  try {
    process.env.NODE_ENV = "production";

    const headerGroups = await nextConfig.headers();
    const contentSecurityPolicy = headerGroups
      .flatMap(({ headers }) => headers)
      .find(({ key }) => key === "Content-Security-Policy")?.value;

    assert.ok(contentSecurityPolicy);
    const directives = new Map(
      contentSecurityPolicy.split("; ").map((directive) => {
        const [name, ...values] = directive.split(" ");

        return [name, values.join(" ")];
      }),
    );

    assert.equal(directives.get("script-src-attr"), "'none'");
  } finally {
    if (previousNodeEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnvironment;
    }
  }
});
