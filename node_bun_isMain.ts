const isMain =
  (import.meta as any).main ?? import.meta.url === `file://${process.argv[1]}`;
